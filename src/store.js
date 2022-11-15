import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {moneySlice, navigationSlice, nominaSlice, orientationSlice, prenominaSlice, statisticsSlice, ticketSlice, vacationSlice, varSlice, worldCupSlice} from './slices'

applyMiddleware
export const store = configureStore({
    reducer: {
        navNavigation: navigationSlice,
        navOrientation: orientationSlice,
        navPrenomina: prenominaSlice,
        navMoney: moneySlice,
        navNominas: nominaSlice,
        navTicket: ticketSlice,
        navStatistics: statisticsSlice,
        navVacation: vacationSlice,
        navWorldCup: worldCupSlice,
        navVariables: varSlice,
    }
}, applyMiddleware(thunk))