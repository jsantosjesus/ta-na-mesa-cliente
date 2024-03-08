import React from 'react';
import './App.css';
import { FirebaseProvider } from './contexts/appContext';
import { BrowserRouter } from 'react-router-dom';
import Rotas from './router';

function App() {
  return (

    <FirebaseProvider>
      <div className="App">
        <BrowserRouter>
            <Rotas />
        </BrowserRouter>
      </div>
    </FirebaseProvider>

  );
}

export default App;
