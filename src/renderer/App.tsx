// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Pages/MainLayout';
import WeChatOperation from './Pages/WeChatOperation';
import WeChatChatPage from './Pages/WeChatChatPage';
import WeChatContact from './Pages/WeChatContact';

function App() {
  return (
    <Router>
      <div className="bg-gray-800 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/WeChatOperation" element={<WeChatOperation />} />
          <Route
            path="/WeChatOperation/ChatPage"
            element={<WeChatChatPage />}
          />
          <Route
            path="/WeChatOperation/WeChatContact"
            element={<WeChatContact />}
          />

          <Route path="*" element={<MainLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
