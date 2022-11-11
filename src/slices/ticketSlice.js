import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tickets: [],
    permissions: {},
    form: {}
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setTickets: (state, action) => {state.tickets = action.payload},
        setPermissions: (state, action) => {state.permissions = action.payload},
        addTicket: (state, action) => {state.tickets = [action.payload, ...state.tickets]},
        actionTicket: (state, action) => {state.tickets = state.tickets.map(x => x.id === action.payload.id ? ({...x, ...action.payload.ticket}) : x)},
        formTicket: (state, action) => {state.form = state.form = action.payload}
    }
})

export const {setTickets, setPermissions, addTicket, actionTicket, formTicket} = navSlice.actions
export const selectTickets = (state) => state.navTicket.tickets;
export const selectPermissions = (state) => state.navTicket.permissions;
export const selectForm = (state) => state.navTicket.form;

export default navSlice.reducer