import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="flex justify-center items-center space-x-4 py-4 bg-gray-800">
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Normal Contacts
      </Link>
      {/* <button
        disabled
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        onClick={() => navigate('/sharing-contacts')}
      >
        Sync Contacts (Not Done)
      </button> */}
      <Link
        to="/WeChatOperation"
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        WeChat Direct Message (Alpha)
      </Link>
    </div>
  );
}

export default Navbar;
