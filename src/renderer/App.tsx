// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Pages/MainLayout';
import WeChatConnection from './Pages/WeChatConnection'; // Import your other page component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/WeChatConnection" element={<WeChatConnection />} />
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
