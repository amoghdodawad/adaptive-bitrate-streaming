import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : 'user',
    initialState : {
        name : null,
        email : null,
        bio: null,
        token: null
    },
    reducers : {
        setUser : (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.bio = action.payload.bio;
            state.token = action.payload.token;
        },
        setName : (state, action) => {
            state.name = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setEmail : (state, action) => {
            state.email = action.payload;
        },
        setBio : (state, action) => {
            state.bio = action.payload
        },
        removeName : (state, action) => {
            state.name = null;
        },
        removeEmail : (state, action) => {
            state.email = null;
        },
        removeBio : (state, action) => {
            state.bio = null;
        },
        removeToken : (state, action) => {
            state.token = null;
        },
        removeUser : (state, action) => {
            state.name = null;
            state.email = null;
            state.bio = null;
            state.token = null;
        }
    }
})

export default userSlice;
export const { setUser, setName, setEmail, setToken, setBio, removeUser, removeName, removeEmail, removeToken, removeBio } = userSlice.actions;