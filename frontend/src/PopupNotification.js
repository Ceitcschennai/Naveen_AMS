import React, { createContext, useContext, useState, useCallback } from 'react';
import './styles/LoginPage.css';

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState(null);

  const showPopup = useCallback((message, type = 'error') => {
    setPopup({ message, type });
    setTimeout(() => {
      setPopup(null);
    }, 3000);
  }, []);

  const showSuccess = useCallback((message) => showPopup(message, 'success'), [showPopup]);
  const showError = useCallback((message) => showPopup(message, 'error'), [showPopup]);

  return (
    <PopupContext.Provider value={{ popup, showPopup, showSuccess, showError }}>
      {children}
    </PopupContext.Provider>
  );
};

export const PopupNotification = () => {
  const { popup } = usePopup();

  if (!popup) return null;

  return (
    <div className="popup-overlay">
      <div className={`popup-notification ${popup.type}`}>
        {popup.type === 'success' ? '✓ ' : '⚠ '}
        {popup.message}
      </div>
    </div>
  );
};