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
        className="flex items-center justify-start p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0 h-12"
        onClick={() => handleFunctionClick('addFriend')}
      >
        Add a friend
      </button>
      <button
        type="button"
        className="flex items-center justify-start p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0 h-12"
        onClick={() => handleFunctionClick('importFriend')}
      >
        Import
      </button>
    </div>
  );
}
