import 'tailwindcss/tailwind.css';
import React from 'react';

interface ChatPageProps {
  contact: {
    name: string;
  };
}

export default function ChatPage({ contact }: ChatPageProps) {
  return (
    <div>
      <h2>This is the chat page with **{contact.name}**.</h2>
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
  );
}
