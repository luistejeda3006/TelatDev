import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {moneySlice, navigationSlice, nominaSlice, orientationSlice, prenominaSlice, ticketSlice, vacationSlice, varSlice, worldCupSlice} from './slices'

applyMiddleware
export const store = configureStore({
    reducer: {
        navNavigation: navigationSlice,
        navOrientation: orientationSlice,
        navPrenomina: prenominaSlice,
        navMoney: moneySlice,
        navNominas: nominaSlice,
        navTicket: ticketSlice,
        navVacation: vacationSlice,
        navWorldCup: worldCupSlice,
        navVariables: varSlice,
    }
}, applyMiddleware(thunk))