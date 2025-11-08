import { useMessage } from "../../hooks/useMessage";

const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="1.2em"
    width="1.2em"
    className="transform rotate-45"
  >
    <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
  </svg>
);

export const MessagePanel = ({lobbyId}) => {

const {
    messages,
    content,
    setContent,
    isLoading,
    hasMore,
    listRef,
    bottomRef,
    handleSubmit,
    handleScroll,
  } = useMessage(lobbyId);

  return (
    // Main Panel: Flex column, full height, light gray background
<div className="flex flex-col h-[430px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">

      {/* Message List: Grow to fill space, scrollable */}
      <div
        className="flex-grow overflow-y-auto p-4 space-y-4"
        ref={listRef}
        onScroll={handleScroll}
      >
        {/* Loading spinner/text */}
        {isLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
            Loading history...
          </div>
        )}

        {/* Start of conversation marker */}
        {!hasMore && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
            You've reached the start of the conversation.
          </div>
        )}

        {/* Messages: No bubbles, flat style like your screenshot */}
        {messages.map((msg) => (
          <div key={msg.created_at} className="flex">
            <div>
              <div className="flex items-baseline space-x-2">
                <strong className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {msg.profiles?.username || 'User'}
                </strong>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-100">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {/* Empty div at the bottom for auto-scrolling */}
        <div ref={bottomRef} />
      </div>

      {/* Message Form: Styled to match screenshot */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700"
      >
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow rounded-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-3 bg-blue-500 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={!content.trim()}
        >
          <SendIcon />
        </button>
      </form>
    </div>
  
  )
}