import { useState, useEffect } from "react"
import { socket } from "../../socket/socket";
export const MessagePanel = (lobbyId) => {

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("")

    useEffect(() => {
        //Function to handle the chat event
        function onMessage(msg){
            setMessages(prevMessages => [...prevMessages, msg])
        }

        //Register the webhook listener
        socket.on('sending message', onMessage)

        //cleanup
        return () => {
            socket.off('sending message', onMessage)
        }
    },[])

    const handleSubmit= (e) => {
        e.preventDefault()

        if(content.trim()) {
            //this is to send the message
            socket.emit("send message", lobbyId, content);

            setContent("")
        }
    }
    return(<div className="message-panel">
      <div className="message-list">
        {/* Render all the messages */}
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {/* You'll want to adjust this based on your message object structure */}
            <strong>{msg.sender?.username || 'User'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      {/* --- 3. The form for sending messages --- */}
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
    )
}