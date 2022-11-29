import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visibleSliders: true, //cambiar a TRUE para ver los sliders
    languageApp: '1',
    tokenInfo: '',
    userInfo: '',
    notification: false,
    dataNotification: undefined
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setVisibleSliders: (state, action) => {state.visibleSliders = action.payload},
        setLanguageApp: (state, action) => {state.languageApp = action.payload},
        setTokenInfo: (state, action) => {state.tokenInfo = action.payload},
        setUserInfo: (state, action) => {state.userInfo = action.payload},
        setNotification: (state, action) => {state.notification = action.payload},
        setDataNotification: (state, action) => {state.dataNotification = action.payload},
    }
})

export const {setVisibleSliders, setLanguageApp, setTokenInfo, setUserInfo, setNotification, setDataNotification} = navSlice.actions
export const selectVisibleSliders = (state) => state.navVariables.visibleSliders;
export const selectTokenInfo = (state) => state.navVariables.tokenInfo;
export const selectUserInfo = (state) => state.navVariables.userInfo;
export const selectLanguageApp = (state) => state.navVariables.languageApp;
export const selectNotification = (state) => state.navVariables.notification;
export const selectDataNotification = (state) => state.navVariables.dataNotification;

export default navSlice.reducer