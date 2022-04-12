import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        user: null,
        isLoaded: false,
        isLoading: false,
        new_account: false,
        auth_test: false
    },

    reducers: {

        changeStatus: (state, action) => {
            state.isLoggedIn = action.payload;
        },

        initUser: (state, action) => {
            state.user = action.payload;
            state.isLoaded = true;
        },

        updateScore: (state, action) => {
            state.user.score = action.payload;
        },

        updateRank: (state, action) => {
            state.user.rank = action.payload;
        },

        changeLoadingStatus: (state, action) => {
            state.isLoading = action.payload;
            if(action.payload) {
                state.isTested = true;
            }
        },

        isNewAccount: (state, action) => {
            state.new_account = action.payload;
        },

        logout: (state, action) => {
            state.isLoggedIn = false;
            state.user = null;
            state.isLoaded = false;
            state.isLoading = false;
            state.new_account = false;
            state.auth_test = false;
        },

        update_pp: (state, action) => {
            state.user.profile_picture = action.payload
        },

        update_surname: (state, action) => {
            state.user.surname = action.payload
        }
    }   
})

export const { changeStatus, initUser, updateScore, updateRank, changeLoadingStatus, isNewAccount, logout, update_pp, update_surname } = authSlice.actions

export default authSlice.reducer