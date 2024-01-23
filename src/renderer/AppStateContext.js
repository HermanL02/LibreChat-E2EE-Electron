// AppStateContext.js
import React, { createContext, useContext, useState } from 'react';

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

// eslint-disable-next-line react/prop-types
export function AppStateProvider({ children }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState('chat'); // 'chat', 'other'

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    selectedContact,
    setSelectedContact,
    currentPage,
    setCurrentPage,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}
