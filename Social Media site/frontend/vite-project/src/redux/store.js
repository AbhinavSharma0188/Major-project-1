import { configureStore } from '@reduxjs/toolkit';
import loopSlice from './loopSlice';
import messageSlice from './messageSlice';
import postSlice from './postSlice';
import socketSlice from './SocketSlice';
import storySlice from './storySlice';
import userSlice from './userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    loop: loopSlice,
    message: messageSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    }),
});

export default store;