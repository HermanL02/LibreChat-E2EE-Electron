import 'tailwindcss/tailwind.css';
import React from 'react';
import { useAppState } from '../AppStateContext';

export default function FunctionList() {
  const { setCurrentPage } = useAppState();

  const handleFunctionClick = (functionType: string) => {
    setCurrentPage(functionType);
  };

  return (
    <div className="flex flex-col bg-gray-100 p-4 shadow rounded-lg">
      <button
        type="button"
        className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
        onClick={() => handleFunctionClick('addFriend')}
      >
        Add a friend
      </button>
      <button
        type="button"
        className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
        onClick={() => handleFunctionClick('importFriend')}
      >
        Import
      </button>
    </div>
  );
}
