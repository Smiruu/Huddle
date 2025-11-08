import { useState, useEffect, useRef } from "react";
import { socket } from "../socket/socket"; // Adjust this path as needed

export const useMessage = (lobbyId) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const listRef = useRef(null);
  const bottomRef = useRef(null);

  // Main effect for socket listeners
  useEffect(() => {
    function onNewMessage(msg) {
      setMessages((prevMessages) => {
        if (prevMessages.find((m) => m.created_at === msg.created_at)) {
          return prevMessages;
        }
        return [...prevMessages, msg];
      });
    }

    function onChatHistory(historicalMessages) {
      if (historicalMessages.length === 0) {
        setHasMore(false);
      }
      
      const listEl = listRef.current;
      const oldScrollHeight = listEl.scrollHeight;

      setMessages((prevMessages) => [
        ...historicalMessages.reverse(),
        ...prevMessages,
      ]);
      
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
      
      // Preserve scroll position, but NOT on the initial load (page 0)
      if (listEl && page > 0) {
        listEl.scrollTop = listEl.scrollHeight - oldScrollHeight;
      }
    }

    // Register listeners
    socket.on('sending message', onNewMessage);
    socket.on("chat history", onChatHistory);
    
    // Initial fetch
    setIsLoading(true);
    socket.emit("chats", { lobbyId, page: 0 });

    // Cleanup
    return () => {
      socket.off('sending message', onNewMessage);
      socket.off("chat history", onChatHistory);
    };
    
    // This effect should only re-run if the lobbyId changes
  }, [lobbyId]); 

  // Effect for auto-scrolling to the bottom
  useEffect(() => {
    if (bottomRef.current) {
      // Find the last message element
      const lastMessage = bottomRef.current.previousElementSibling;
      
      // Only auto-scroll if the new message is from the *initial* load
      // or if we're already near the bottom. This prevents auto-scrolling
      // if a user is reading old history and a new message comes in.
      
      // A simple implementation is to just scroll:
      bottomRef.current.scrollIntoView();
    }
  }, [messages.length]);

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      socket.emit("send message", { lobbyId, content });
      setContent("");
    }
  };

  // Handler for scrolling to the top
  const handleScroll = () => {
    const el = listRef.current;
    if (el.scrollTop === 0 && !isLoading && hasMore) {
      setIsLoading(true);
      socket.emit("chats", { lobbyId, page });
    }
  };

  // Return everything the component needs
  return {
    messages,
    content,
    setContent,
    isLoading,
    hasMore,
    listRef,
    bottomRef,
    handleSubmit,
    handleScroll,
  };
};