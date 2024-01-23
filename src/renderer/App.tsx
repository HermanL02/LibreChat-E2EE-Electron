// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
import 'tailwindcss/tailwind.css';
import React from 'react';
import { AppStateProvider, useAppState } from './AppStateContext';
import ChatPage from './Components/chatpage';
import ContactList from './Components/contactlist';
import FunctionList from './Components/functionlist';
import AddFriendPage from './Components/addfriend';
// 定义 ContactList 的 Props 类型

function ContentArea() {
  const { selectedContact, currentPage } = useAppState();

  return (
    <div className="ml-10">
      {currentPage === 'chat' && selectedContact && (
        <ChatPage contact={selectedContact} />
      )}
      {currentPage === 'addFriend' && <AddFriendPage />}
    </div>
  );
}

export default function Main() {
  return (
    <AppStateProvider>
      <div className="flex">
        <FunctionList />
        <ContactList />
        <ContentArea />
      </div>
    </AppStateProvider>
  );
}
