import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    screen: '',
    access: ''
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setScreen: (state, action) => {state.screen = action.payload},
        setAccess: (state, action) => {state.access = action.payload},
    }
})

export const {setScreen, setAccess} = navSlice.actions
export const selectScreen = (state) => state.navNavigation.screen;
export const selectAccess = (state) => state.navNavigation.access;

export default navSlice.reducer