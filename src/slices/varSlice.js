import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visibleSliders: false, //cambiar a TRUE para ver los sliders
    languageApp: '1',
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setVisibleSliders: (state, action) => {state.visibleSliders = action.payload},
        setLanguageApp: (state, action) => {state.languageApp = action.payload},
    }
})

export const {setVisibleSliders, setLanguageApp} = navSlice.actions
export const selectVisibleSliders = (state) => state.navVariables.visibleSliders;
export const selectLanguageApp = (state) => state.navVariables.languageApp;

export default navSlice.reducer