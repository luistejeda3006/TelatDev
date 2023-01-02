import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current: 1,
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setCurrent: (state, action) => {state.current = action.payload},
    }
})

export const {setCurrent} = navSlice.actions
export const selectCurrent = (state) => state.navDynamics.current;

export default navSlice.reducer