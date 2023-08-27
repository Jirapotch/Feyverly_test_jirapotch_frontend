import { createContext } from 'react';
import { createReducer } from '@reduxjs/toolkit';

const AuthContext = createContext();

export const userState = {
    username: '',
}

export const userReducer = createReducer(userState, {
    GET_USER: (state, { payload }) => { state.username = payload },
});

export default AuthContext;