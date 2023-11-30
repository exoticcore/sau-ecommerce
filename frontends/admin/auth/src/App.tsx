import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';

import SignIn from './components/SignIn';
import Reset from './components/Reset';

import 'container/index.scss';

function App({ history }: { history?: string }): React.ReactNode {
  const navigate = useNavigate();

  useEffect(() => {}, []);
  return (
    <Routes>
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/reset" element={<Reset />} />
    </Routes>
  );
}

export default App;
