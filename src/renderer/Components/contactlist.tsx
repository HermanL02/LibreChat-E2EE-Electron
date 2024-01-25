import 'tailwindcss/tailwind.css';
import React from 'react';
import { useAppState } from '../AppStateContext';

export default function ContactList() {
  const { contacts, selectedContact, setSelectedContact, setCurrentPage } =
    useAppState();

  const handleContactClick = (contact: any) => {
    setCurrentPage('chat');
    setSelectedContact(contact);
  };

  if (!contacts) {
    return <div>Loading contacts...</div>;
  }

  return (
    <div>
      {
        // @ts-ignore
        contacts.map((contact) => (
          <button
            // eslint-disable-next-line no-underscore-dangle
            key={contact._id}
            type="button"
            className={`flex items-center justify-start p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0 ${
              // eslint-disable-next-line no-underscore-dangle
              selectedContact && contact._id === selectedContact._id
                ? 'bg-blue-100 rounded-md mb-2 ring-4 outline-none ring-blue-300 border-blue-700'
                : 'text-blue-700 border border-blue-700'
            } h-12`}
            onClick={() => handleContactClick(contact)}
          >
            {contact.name}
          </button>
        ))
      }
    </div>
  );
}
