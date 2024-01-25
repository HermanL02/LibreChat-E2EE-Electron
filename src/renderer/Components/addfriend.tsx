import 'tailwindcss/tailwind.css';
import React, { useState } from 'react';

export default function AddFriendPage() {
  const [friendName, setFriendName] = useState('');
  const [key, setKey] = useState('');

  const handleAddFriend = async () => {
    try {
      const publicKeys = [[key, new Date()]];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await window.electronAPI.insertFriend(
        friendName,
        publicKeys,
      );
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'Add friend',
        buttons: ['OK'],
        type: 'info',
        message: 'Add friend successfully!',
      });
    } catch (error) {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'Failed to Add friend',
        buttons: ['OK', 'Report'],
        type: 'info',
        message: 'Failed to add. It is our problem, not yours.',
      });
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
