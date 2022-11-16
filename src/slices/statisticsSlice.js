import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tiempo_real: {},
    periodos: [],
    altas_bajas_irp: [],
    training: {},
    altas_bajas_quincenas: {},
    altas_grafico: [],
    bajas_grafico: [],
    motivo_bajas_value: [],
    legends_motivo_baja: [],
    detalle_altas: [],
    detalle_bajas: [],
    training_categorias: [],
    training_grafico: [],
    empleados_ubicacion: [],
    edificios: [],
    empleados_areas: [],
    empleados_razon_social: [],
    body_1_master: [],
    body_2_master: [],
    body_1: [],
    body_2: [],
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setTiempoReal: (state, action) => {state.tiempo_real = action.payload},
        setPeriodos: (state, action) => {state.periodos = action.payload},
        setAltasBajasIRP: (state, action) => {state.altas_bajas_irp = action.payload},
        setTraining: (state, action) => {state.training = action.payload},
        setAltasBajasQuincenas: (state, action) => {state.altas_bajas_quincenas = action.payload},
        setAltasGrafico: (state, action) => {state.altas_grafico = action.payload},
        setBajasGrafico: (state, action) => {state.bajas_grafico = action.payload},
        setMotivoBajasValue: (state, action) => {state.motivo_bajas_value = action.payload},
        setLegendsMotivoBaja: (state, action) => {state.legends_motivo_baja = action.payload},
        setDetalleAltas: (state, action) => {state.detalle_altas = action.payload},
        setDetalleBajas: (state, action) => {state.detalle_bajas = action.payload},

        setTrainingCategorias: (state, action) => {state.training_categorias = action.payload},
        setTrainingGrafico: (state, action) => {state.training_grafico = action.payload},
        setEmpleadosUbicacion: (state, action) => {state.empleados_ubicacion = action.payload},
        setEdificios: (state, action) => {state.edificios = action.payload},
        setEmpleadosAreas: (state, action) => {state.empleados_areas = action.payload},
        setEmpleadosRazonSocial: (state, action) => {state.empleados_razon_social = action.payload},
        setBodyMasterUno: (state, action) => {state.body_1_master = action.payload},
        setBodyMasterDos: (state, action) => {state.body_2_master = action.payload},

        setBodyUno: (state, action) => {state.body_1 = action.payload},
        setBodyDos: (state, action) => {state.body_2 = action.payload},
    }
})

export const {setTiempoReal, setPeriodos, setAltasBajasIRP, setTraining, setAltasBajasQuincenas, setAltasGrafico, setBajasGrafico, setMotivoBajasValue,  setLegendsMotivoBaja, setDetalleAltas, setDetalleBajas, setTrainingCategorias, setTrainingGrafico, setEmpleadosUbicacion, setEdificios, setEmpleadosAreas, setEmpleadosRazonSocial, setBodyUno, setBodyDos, setBodyMasterUno, setBodyMasterDos} = navSlice.actions

export const selectTiempoReal = (state) => state.navStatistics.tiempo_real;
export const selectPeriodos = (state) => state.navStatistics.periodos;
export const selectAltasBajasIRP = (state) => state.navStatistics.altas_bajas_irp;

export const selectTraining = (state) => state.navStatistics.training;
export const selectAltasBajasQuincenas = (state) => state.navStatistics.altas_bajas_quincenas;
export const selectAltasGrafico = (state) => state.navStatistics.altas_grafico
export const selectBajasGrafico = (state) => state.navStatistics.bajas_grafico

export const selectMotivoBajasValue = (state) => state.navStatistics.motivo_bajas_value
export const selectLegendsMotivoBaja = (state) => state.navStatistics.legends_motivo_baja
export const selectDetalleAltas = (state) => state.navStatistics.detalle_altas
export const selectDetalleBajas = (state) => state.navStatistics.detalle_bajas

export const selectTrainingCategorias = (state) => state.navStatistics.training_categorias
export const selectTrainingGrafico = (state) => state.navStatistics.training_grafico
export const selectEmpleadosUbicacion = (state) => state.navStatistics.empleados_ubicacion
export const selectEdificios = (state) => state.navStatistics.edificios

export const selectEmpleadosAreas = (state) => state.navStatistics.empleados_areas
export const selectEmpleadosRazonSocial = (state) => state.navStatistics.empleados_razon_social

export const selectBodyUno = (state) => state.navStatistics.body_1
export const selectBodyDos = (state) => state.navStatistics.body_2

export const selectBodyMasterUno = (state) => state.navStatistics.body_1_master
export const selectBodyMasterDos = (state) => state.navStatistics.body_2_master

export default navSlice.reducer