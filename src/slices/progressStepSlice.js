import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    step: 1,
    error: true,
    verified: undefined,
    checked: false,
    /* verified: true,
    checked: false */
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setStep: (state, action) => {state.step = action.payload},
        setError: (state, action) => {state.error = action.payload},
        setVerified: (state, action) => {state.verified = action.payload},
        setChecked: (state, action) => {state.checked = action.payload}
    }
})

export const {setStep, setError, setVerified, setChecked} = navSlice.actions
export const selectStep = (state) => state.navProgress.step;
export const selectError = (state) => state.navProgress.error;
export const selectVerified = (state) => state.navProgress.verified;
export const selectChecked = (state) => state.navProgress.checked;

export default navSlice.reducer