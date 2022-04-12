import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';
import contentSlice from './content';

export default configureStore({
    reducer: {
        auth: authSlice,
        content: contentSlice,
    }
});