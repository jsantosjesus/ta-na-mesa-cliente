import React, { createContext } from 'react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';

// Criação do contexto
export const FirebaseContext = createContext(null);

// Inicialização do app Firebase
const app = initializeApp(firebaseConfig);

// Componente Provider
export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={app}>
      {children}
    </FirebaseContext.Provider>
  );
};
