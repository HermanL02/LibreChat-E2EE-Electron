import 'tailwindcss/tailwind.css';
import React from 'react';
import { useAppState } from '../AppStateContext';

export default function ContactList() {
  const { contacts, selectedContact, setSelectedContact, setCurrentPage } =
    useAppState();
  const handleContactClick = (contact: string) => {
    setCurrentPage('chat');
    setSelectedContact(contact);
  };
  // In the case contact is not loaded yet
  if (!contacts) {
    return <div>Loading contacts...</div>; // Or any other fallback UI
  }
  return (
    <div>
      {
        // @ts-ignore
        contacts.map((contact) => (
          <button
            // eslint-disable-next-line
          key={contact._id} // Assuming each contact has a unique '_id'
            type="button"
            className={`flex items-center justify-start p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0 ${
              contact.name === selectedContact ? 'bg-blue-200' : ''
            } h-12`} // h-12 sets a fixed height of 3rem (48px)
            onClick={() => handleContactClick(contact)}
          >
            {contact.name}
          </button>
        ))
      }
    </div>
  );
}
