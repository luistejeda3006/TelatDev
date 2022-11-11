import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    points: [],
    global: [],
    filteredData: [],
    quinielas: [],
    instructions: []
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setData: (state, action) => {state.data = action.payload},
        setPoints: (state, action) => {state.points = action.payload},
        setGlobal: (state, action) => {state.global = action.payload},
        setQuinielas: (state, action) => {state.quinielas = action.payload},
        setInstructions: (state, action) => {state.instructions = action.payload},
        setFilteredData: (state, action) => {state.filteredData = action.payload},
        setFilteredSelected: (state, action) => {state.filteredData = state.filteredData.map(x => x.id === action.payload ? ({...x, selected: true}) : ({...x, selected: false}))},
        setDataSelected: (state, action) => {state.data = state.data.map(x => x.id === action.payload ? ({...x, selected: true}) : ({...x, selected: false}))},
        actionItem: (state, action) => {state.data = state.data.map(x => x.id !== action.payload.id ? x : ({...x, ...action.payload.item}))},
    }
})

export const {setData, setPoints, setGlobal, setQuinielas, setInstructions, setFilteredData, setFilteredSelected, setDataSelected, actionItem, actionBetting} = navSlice.actions

export const selectData = (state) => state.navWorldCup.data;
export const selectPoints = (state) => state.navWorldCup.points;
export const selectInstructions = (state) => state.navWorldCup.instructions;
export const selectGlobal = (state) => state.navWorldCup.global;
export const selectFilteredData = (state) => state.navWorldCup.filteredData;
export const selectQuinielas = (state) => state.navWorldCup.quinielas;

export default navSlice.reducer