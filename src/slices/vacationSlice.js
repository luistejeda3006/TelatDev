import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    empleados: [],
    masterEmpleados: [],
    temporalEmpleados: [],
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setEmpleados: (state, action) => {state.empleados = action.payload},
        setTemporalEmpleado: (state, action) => {state.temporalEmpleados = action.payload},
        hideEmpleado: (state, action) => {state.empleados = state.empleados.map(x => x.id_empleado === action.payload ? ({...x, oculta: !x.oculta}) : ({...x, oculta: true}))},
        hideEmpleadoTemporal: (state, action) => {state.temporalEmpleados = state.temporalEmpleados.map(x => x.id_empleado === action.payload ? ({...x, oculta: !x.oculta}) : ({...x, oculta: true}))},
        actionVacation: (state, action) => {state.empleados = state.empleados.map(x => x.id === action.payload.id ? ({...x, ...action.payload.empleado}) : x)},
        actionTemporalVacation: (state, action) => {state.temporalEmpleados = state.temporalEmpleados.map(x => x.id === action.payload.id ? ({...x, ...action.payload.empleado}) : x)},
    }
})

export const {setEmpleados, setTemporalEmpleado, actionVacation, actionTemporalVacation, hideEmpleado, hideEmpleadoTemporal, actionSolicitud, actionSolicitudTemporal} = navSlice.actions
export const selectEmpleados = (state) => state.navVacation.empleados;
export const selectTemporalEmpleados = (state) => state.navVacation.temporalEmpleados;

export default navSlice.reducer