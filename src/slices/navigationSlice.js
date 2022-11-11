import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    screen: '',
    access: '',
    change: 0,
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setScreen: (state, action) => {state.screen = action.payload},
        setAccess: (state, action) => {state.access = action.payload},
        setChange: (state, action) => {state.change = state.change + 1},
    }
})

export const {setScreen, setAccess, setChange} = navSlice.actions
export const selectScreen = (state) => state.navNavigation.screen;
export const selectAccess = (state) => state.navNavigation.access;
export const selectChange = (state) => state.navNavigation.change;

export default navSlice.reducer