import { configureStore } from '@reduxjs/toolkit';

import loginSignUpSlice from './features/loginSignup/loginSignUpSlice';

export const store = configureStore({
  reducer: {
    loginSignUp: loginSignUpSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
