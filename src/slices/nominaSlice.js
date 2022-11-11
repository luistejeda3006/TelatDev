import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setNominas: (state, action) => {state.data = action.payload},
        handleHideNomina: (state, action) => {state.data = state.data.map(x => x.id === action.payload ? ({...x, oculta: !x.oculta}) : ({...x, oculta: true}))},
    }
})

export const {setNominas, handleHideNomina} = navSlice.actions
export const selectNominas = (state) => state.navNominas.data;

export default navSlice.reducer