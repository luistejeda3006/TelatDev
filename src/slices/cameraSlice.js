import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: 'back',
    flash: 'off',
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setType: (state, action) => {state.type = action.payload},
        setFlash: (state, action) => {state.flash = action.payload},
    }
})

export const {setType, setFlash} = navSlice.actions
export const selectType = (state) => state.navCamera.type;
export const selectFlash = (state) => state.navCamera.flash;

export default navSlice.reducer