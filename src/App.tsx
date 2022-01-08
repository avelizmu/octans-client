import React from 'react';
import {UserContextProvider} from "./context/UserContext";
import AppRouter from "./AppRouter";

function App() {
  return <UserContextProvider>
    <AppRouter/>
  </UserContextProvider>
}

export default App;
