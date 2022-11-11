import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {navigationSlice, nominaSlice, orientationSlice, prenominaSlice, ticketSlice, vacationSlice, varSlice, worldCupSlice} from './slices'

applyMiddleware
export const store = configureStore({
    reducer: {
        navNavigation: navigationSlice,
        navOrientation: orientationSlice,
        navPrenomina: prenominaSlice,
        navNominas: nominaSlice,
        navTicket: ticketSlice,
        navVacation: vacationSlice,
        navWorldCup: worldCupSlice,
        navVariables: varSlice,
    }
}, applyMiddleware(thunk))  