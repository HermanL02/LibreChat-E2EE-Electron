import 'tailwindcss/tailwind.css';
import React from 'react';

export default function AddFriendPage() {
  return (
    <div>
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
      <button
        type="button"
        className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
      >
        Show your encrypt key
      </button>
    </div>
  );
}
