// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
import 'tailwindcss/tailwind.css';
import React, { useEffect } from 'react';
import { AppStateProvider, useAppState } from './AppStateContext';
import ChatPage from './Components/chatpage';
import ContactList from './Components/contactlist';
import FunctionList from './Components/functionlist';
import AddFriendPage from './Components/addfriend';
import PersonalInfo from './Components/personalinfo';
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
      <div className="flex flex-col">
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
            Cloud Contacts
          </button>
          <button
            type="button"
            className="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            WeChat Direct Messsage (Alpha)
          </button>
        </div>

        <div className="flex flex-grow">
          <div className="flex flex-col bg-gray-100 p-4 shadow rounded-lg w-1/5">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Functions
            </p>
            <FunctionList />
            <p className="text-sm font-semibold text-gray-700 mb-4">Contacts</p>
            <ContactList />
          </div>

          <ContentArea />
          <div className="flex flex-col bg-gray-100 p-4 shadow rounded-lg w-1/5" />
          <PersonalInfo />
        </div>
      </div>
    </AppStateProvider>
  );
}
