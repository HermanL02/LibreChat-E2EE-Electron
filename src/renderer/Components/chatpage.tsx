/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

interface ChatPageProps {
  contact: {
    name: string;
  };
}

export default function ChatPage({ contact }: ChatPageProps) {
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [message, setMessage] = useState('');

  const handleTextareaChange = (event: any) => {
    setMessage(event.target.value);
    event.target.style.height = 'inherit';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };
  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-4">
          Contact: {contact.name}
        </p>
        <button
          type="button"
          className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
        >
          Add secret key
        </button>
        <button
          type="button"
          className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
        >
          Show his public key
        </button>
      </div>
      {/* 文本框 */}
      <textarea
        value={message}
        onChange={handleTextareaChange}
        className="p-2 w-full border rounded-md mb-2"
        placeholder="Enter your message here"
        style={{ minHeight: '100px' }} // 初始高度
      />

      {/* Toggle Switch */}
      <label className="relative inline-flex items-center mb-5 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isEncrypted}
          onChange={() => setIsEncrypted(!isEncrypted)}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
        <span className="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500">
          {isEncrypted ? 'Decrypt' : 'Encrypt'}
        </span>
      </label>

      {/* 操作按钮 */}
      <button
        type="button"
        className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
      >
        {isEncrypted ? 'Decrypt Message' : 'Encrypt Message'}
      </button>
    </div>
  );
}
