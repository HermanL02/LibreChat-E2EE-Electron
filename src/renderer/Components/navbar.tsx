import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center space-x-4 py-4 bg-gray-800">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        onClick={() => navigate('/normal-contacts')}
      >
        Normal Contacts
      </button>
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        onClick={() => navigate('/sharing-contacts')}
      >
        Sharing Contacts with UID
      </button>
      <button
        type="button"
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        onClick={() => navigate('/WeChatOperation')}
      >
        WeChat Direct Message (Alpha)
      </button>
    </div>
  );
}

export default Navbar;
