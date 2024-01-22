// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
import 'tailwindcss/tailwind.css';
import React, { useState } from 'react';
// 定义 ContactList 的 Props 类型
interface ContactListProps {
  onSelectContact: (contact: string) => void;
}

function ContactList({ onSelectContact }: ContactListProps) {
  const contacts = ['Alice', 'Bob', 'Charlie', 'David'];

  return (
    <div className="flex flex-col bg-gray-100 p-4 shadow rounded-lg">
      {contacts.map((contact) => (
        <button
          key={contact}
          type="button"
          className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
          onClick={() => onSelectContact(contact)}
        >
          {contact}
        </button>
      ))}
    </div>
  );
}

// 定义 ChatPage 的 Props 类型
interface ChatPageProps {
  contact: string;
}

function ChatPage({ contact }: ChatPageProps) {
  return (
    <div>
      <h2>Chat with {contact}</h2>
      <p>这里是与 {contact} 的聊天内容。</p>
    </div>
  );
}

function Hello() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  return (
    <div className="flex">
      <ContactList onSelectContact={setSelectedContact} />
      <div className="ml-10">
        {selectedContact && <ChatPage contact={selectedContact} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Hello />
    </div>
  );
}
