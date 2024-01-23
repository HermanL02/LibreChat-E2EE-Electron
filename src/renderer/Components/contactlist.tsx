import 'tailwindcss/tailwind.css';
import React from 'react';
import { useAppState } from '../AppStateContext';

export default function ContactList() {
  const { selectedContact, setSelectedContact, setCurrentPage } = useAppState();
  const contacts = ['Alice', 'Bob', 'Charlie', 'David'];
  const handleContactClick = (contact: string) => {
    setCurrentPage('chat');
    setSelectedContact(contact);
  };
  return (
    <div className="flex flex-col bg-gray-100 p-4 shadow rounded-lg">
      {contacts.map((contact) => (
        <button
          key={contact}
          type="button"
          className={`p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0 ${
            contact === selectedContact ? 'bg-blue-200' : ''
          }`}
          onClick={() => handleContactClick(contact)}
        >
          {contact}
        </button>
      ))}
    </div>
  );
}
