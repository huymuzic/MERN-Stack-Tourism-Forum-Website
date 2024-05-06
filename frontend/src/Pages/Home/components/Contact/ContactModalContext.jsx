// ContactModalContext.js
import React, { createContext, useState, useContext } from "react";

const ContactModalContext = createContext();

export const useContactModal = () => useContext(ContactModalContext);

export const ContactModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true); 
  const handleHideModal = () => setShowModal(false);

  return (
    <ContactModalContext.Provider
      value={{ showModal, handleShowModal, handleHideModal }}
    >
      {children}
    </ContactModalContext.Provider>
  );
};
