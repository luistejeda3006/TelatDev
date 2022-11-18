import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visibleSliders: false, //cambiar a TRUE para ver los sliders
    languageApp: '1',
    tokenInfo: '',
    userInfo: ''
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setVisibleSliders: (state, action) => {state.visibleSliders = action.payload},
        setLanguageApp: (state, action) => {state.languageApp = action.payload},
        setTokenInfo: (state, action) => {state.tokenInfo = action.payload},
        setUserInfo: (state, action) => {state.userInfo = action.payload},
    }
})

export const {setVisibleSliders, setLanguageApp, setTokenInfo, setUserInfo} = navSlice.actions
export const selectVisibleSliders = (state) => state.navVariables.visibleSliders;
export const selectTokenInfo = (state) => state.navVariables.tokenInfo;
export const selectUserInfo = (state) => state.navVariables.userInfo;
export const selectLanguageApp = (state) => state.navVariables.languageApp;

export default navSlice.reducer