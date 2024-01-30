// AnotherPage.tsx

import React from 'react';
import Navbar from '../Components/navbar';

function WeChatConnection() {
  return (
    <div>
      <Navbar />
      <h1>Before click on this button, Hook WeChat first. </h1>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Connect to WeChat
      </button>
    </div>
  );
}

export default WeChatConnection;
