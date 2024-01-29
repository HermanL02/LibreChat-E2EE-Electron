import 'tailwindcss/tailwind.css';
import React from 'react';

export default function Navbar() {
  return (
    <div className="flex justify-center items-center space-x-4 py-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Normal Contacts
      </button>
      <button
        type="button"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Sharing Contacts with UID
      </button>
      <button
        type="button"
        className="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        WeChat Direct Messsage (Alpha)
      </button>
    </div>
  );
}
