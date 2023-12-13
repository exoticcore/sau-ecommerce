import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

const AuthLazy = React.lazy(() => import('./components/AuthApp'));
const DashboardLazy = React.lazy(() => import('./components/Dashboard'));
const HeaderLazy = React.lazy(() => import('./components/Header'));
const ProductLazy = React.lazy(() => import('./components/ProductApp'));

import './index.scss';
import axios from 'axios';
import Template from './components/Template';

const App = (): React.ReactNode => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const navigate = useNavigate();

  useMemo(() => {
    async function getAccess() {
      try {
        const resp = await axios.get(
          'http://localhost:3000/api/v1/auth/token',
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const { token } = resp.data;
        if (!token) {
          navigate('/auth/signin');
        }
      } catch (err) {
        navigate('/auth/signin');
      }
    }

    getAccess();
  }, [isLogin]);

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthLazy />} />
      <Route
        path="/"
        element={
          <Template>
            {/* <DashboardLazy /> */}
            <ProductLazy />
          </Template>
        }
      />
    </Routes>
  );
};

export default App;

const myfdasf = () => {};
