import 'tailwindcss/tailwind.css';
import React, { useState } from 'react';

export default function WeChatChatInterface() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleNewMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewMessage(event.target.value);
  };

  const sendMessage = () => {
    if (newMessage) {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button type="button" className="btn-blue">
          Hook
        </button>
        <button type="button" className="btn-red">
          Unhook
        </button>
      </div>

      <input
        type="text"
        className="input input-bordered input-xs w-full max-w-xs"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
      />

      <div className="bg-gray-100 p-4 my-4 h-64 overflow-y-auto">
        {messages.map((message, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="mb-2">
            {message}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleNewMessageChange}
        />
        <button type="button" onClick={sendMessage} className="btn ml-2">
          Send
        </button>
      </div>
    </div>
  );
}
