// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Pages/MainLayout';
import WeChatOperation from './Pages/WeChatOperation'; // Import your other page component
import WeChatChatPage from './Pages/WeChatChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/WeChatOperation" element={<WeChatOperation />} />
        <Route path="/WeChatOperation/ChatPage" element={<WeChatChatPage />} />
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
