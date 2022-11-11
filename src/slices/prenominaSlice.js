import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fechas: [],
    periodos: [],
    info: {},
    bonos: {},
    has_bono: 0,
    mensual: false,
    quincena: '',
    loaded: false
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setFechas: (state, action) => {state.fechas = action.payload},
        setPeriodos: (state, action) => {state.periodos = action.payload},
        setInfo: (state, action) => {state.info = action.payload},
        setBonos: (state, action) => {state.bonos = action.payload},
        setHasBono: (state, action) => {state.has_bono = action.payload},
        setMensual: (state, action) => {state.mensual = action.payload},
        setQuincena: (state, action) => {state.quincena = action.payload},
    }
})

export const {setFechas, setPeriodos, setInfo, setBonos, setHasBono, setMensual, setQuincena} = navSlice.actions
export const selectFechas = (state) => state.navPrenomina.fechas;
export const selectPeriodos = (state) => state.navPrenomina.periodos;
export const selectInfo = (state) => state.navPrenomina.info;

export const selectBonos = (state) => state.navPrenomina.bonos;
export const selectHasBono = (state) => state.navPrenomina.has_bono;
export const selectMensual = (state) => state.navPrenomina.mensual;
export const selectQuincena = (state) => state.navPrenomina.quincena;

export default navSlice.reducer