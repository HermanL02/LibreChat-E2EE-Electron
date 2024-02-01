// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import '../App.css';
import 'tailwindcss/tailwind.css';
import React, { useEffect } from 'react';
import { AppStateProvider, useAppState } from '../AppStateContext';
import ChatPage from '../Components/chatpage';
import ContactList from '../Components/contactlist';
import FunctionList from '../Components/functionlist';
import AddFriendPage from '../Components/addfriend';
import PersonalInfo from '../Components/personalinfo';
import Navbar from '../Components/navbar';
// 定义 ContactList 的 Props 类型

function ContentArea() {
  const { selectedContact, currentPage, getAllFriends } = useAppState();
  useEffect(() => {
    getAllFriends();
  }, [getAllFriends]);
  return (
    <div>
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
      <div className="flex flex-col bg-gray-800 text-white">
        <Navbar />
        <div className="flex flex-grow">
          <div className="flex flex-col bg-gray-700 p-4 shadow-lg rounded-lg w-1/5">
            <p className="text-sm font-semibold mb-4">Functions</p>
            <FunctionList />
            <p className="text-sm font-semibold mb-4">Contacts</p>
            <ContactList />
          </div>

          <ContentArea />

          <div className="flex flex-col bg-gray-700 p-4 shadow-lg rounded-lg w-1/5">
            <PersonalInfo />
          </div>
        </div>
      </div>
    </AppStateProvider>
  );
}
