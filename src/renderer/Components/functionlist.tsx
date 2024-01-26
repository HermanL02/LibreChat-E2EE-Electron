import 'tailwindcss/tailwind.css';
import React from 'react';
import { useAppState } from '../AppStateContext';

export default function FunctionList() {
  const { setCurrentPage } = useAppState();

  const handleFunctionClick = (functionType: string) => {
    setCurrentPage(functionType);
  };

  return (
    <div>
      <button
        type="button"
        className="flex items-center justify-start p-2 w-full h-12 text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        onClick={() => handleFunctionClick('addFriend')}
      >
        Add a friend
      </button>
      <button
        type="button"
        className="flex items-center justify-start p-2 w-full h-12 text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        onClick={() => handleFunctionClick('importFriend')}
      >
        Import
      </button>
    </div>
  );
}
