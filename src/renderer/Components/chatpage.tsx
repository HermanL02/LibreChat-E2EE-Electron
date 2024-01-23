import 'tailwindcss/tailwind.css';
import React from 'react';

interface ChatPageProps {
  contact: string;
}

export default function ChatPage({ contact }: ChatPageProps) {
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
      <h2>This is the chat page with **{contact}**.</h2>
    </div>
  );
}
