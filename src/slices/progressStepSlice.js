import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    step: 1,
    error: false,
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setStep: (state, action) => {state.step = action.payload},
        setError: (state, action) => {state.error = action.payload},
    }
})

export const {setStep, setError} = navSlice.actions
export const selectStep = (state) => state.navProgress.step;
export const selectError = (state) => state.navProgress.error;

export default navSlice.reducer