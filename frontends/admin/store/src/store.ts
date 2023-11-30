import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice.ts';

export * from './slice/userSlice.ts';

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
  // preloadedState: {user: {isLoading: false, user: {name: '', isSignedIn: false }, error: ''}},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export { setUser, clearUser, login, getAccessToken, getUserInfo };
