import 'tailwindcss/tailwind.css';
import React, { useState } from 'react';

export default function AddFriendPage() {
  const [friendName, setFriendName] = useState('');
  const [key, setKey] = useState('');

  const handleAddFriend = async () => {
    try {
      const publicKeys = [[key, new Date()]];
      const response = await window.electronAPI.insertFriend(
        friendName,
        publicKeys,
      );
      console.log(response); // 处理响应
    } catch (error) {
      console.log('clicked Button');
      console.error('Error adding friend:', error); // 错误处理
    }
  };

  return (
    <div>
      <p> Friend Name</p>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
        className="p-2 w-full text-left"
      />
      <p> Key </p>
      <textarea
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="p-2 w-full text-left"
      />
      <button
        type="button"
        className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
        onClick={handleAddFriend}
      >
        Confirm
      </button>
    </div>
  );
}
