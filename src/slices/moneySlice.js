import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    agente: {},
    periodos: [],
    operaciones: {},
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setAgente: (state, action) => {state.agente = action.payload},
        setPeriodos: (state, action) => {state.periodos = action.payload},
        setOperaciones: (state, action) => {state.operaciones = action.payload},
    }
})

export const {setAgente, setPeriodos, setOperaciones} = navSlice.actions

export const selectAgente = (state) => state.navMoney.agente;
export const selectPeriodos = (state) => state.navMoney.periodos;
export const selectOperaciones = (state) => state.navMoney.operaciones;

export default navSlice.reducer