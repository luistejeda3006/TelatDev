import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visibleSliders: true,
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setVisibleSliders: (state, action) => {state.visibleSliders = action.payload},
    }
})

export const {setVisibleSliders} = navSlice.actions
export const selectVisibleSliders = (state) => state.navVariables.visibleSliders;

export default navSlice.reducer