import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {applicationSlice, cameraSlice, moneySlice, navigationSlice, nominaSlice, orientationSlice, prenominaSlice, progressStepSlice, statisticsSlice, ticketSlice, vacationSlice, varSlice, worldCupSlice} from './slices'

applyMiddleware
export const store = configureStore({
    reducer: {
        navNavigation: navigationSlice,
        navOrientation: orientationSlice,
        navOrientation: orientationSlice,
        navPrenomina: prenominaSlice,
        navMoney: moneySlice,
        navNominas: nominaSlice,
        navTicket: ticketSlice,
        navStatistics: statisticsSlice,
        navVacation: vacationSlice,
        navWorldCup: worldCupSlice,
        navVariables: varSlice,
        navProgress: progressStepSlice,
        navApplication: applicationSlice,
        navCamera: cameraSlice,
    }
}, applyMiddleware(thunk))