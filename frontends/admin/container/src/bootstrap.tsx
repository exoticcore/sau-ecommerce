import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store/Store';

const mount = (el: Element | DocumentFragment) => {
  return ReactDOM.createRoot(el).render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
};

if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#_container-dev-root');
  if (devRoot) {
    mount(devRoot);
  }
}

export { mount };
