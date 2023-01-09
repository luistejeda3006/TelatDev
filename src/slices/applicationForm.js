import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    statements: undefined,
    statementsVisibility: false,
    successVisibility: false,
    stepOneUSA: {},
    stepTwoUSA: {},
    stepThreeUSA: {},
    schoolsUSA: {},
    curriculumUSA: {},

    stepOneMX: {},
    stepTwoMX: {},
    stepThreeMX: {},
    stepFourMX: {},
    stateOption: null,
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setStatements: (state, action) => {state.statements = action.payload},
        setStatementsVisibility: (state, action) => {state.statementsVisibility = action.payload},
        setSuccessVisibility: (state, action) => {state.successVisibility = action.payload},
        setStepOneUSA: (state, action) => {state.stepOneUSA = action.payload},
        setStepTwoUSA: (state, action) => {state.stepTwoUSA = action.payload},
        setStepThreeUSA: (state, action) => {state.stepThreeUSA = action.payload},
        setSchoolsUSA: (state, action) => {state.schoolsUSA = action.payload},
        setCurriculumUSA: (state, action) => {state.curriculumUSA = action.payload},

        setStepOneMX: (state, action) => {state.stepOneMX = action.payload},
        setStepTwoMX: (state, action) => {state.stepTwoMX = action.payload},
        setStepThreeMX: (state, action) => {state.stepThreeMX = action.payload},
        setStepFourMX: (state, action) => {state.stepFourMX = action.payload},
        setStateOption: (state, action) => {state.stateOption = action.payload},
    }
})

export const {setStatements, setStatementsVisibility, setSuccessVisibility, setStepOneUSA, setStepTwoUSA, setStepThreeUSA, setSchoolsUSA, setCurriculumUSA, setStepOneMX, setStepTwoMX, setStepThreeMX, setStepFourMX, setStateOption} = navSlice.actions

export const selectStatementsVisibility = (state) => state.navApplication.statementsVisibility;
export const selectSuccessVisibility = (state) => state.navApplication.successVisibility;
export const selectStatements = (state) => state.navApplication.statements;
export const selectStepOneUSA = (state) => state.navApplication.stepOneUSA;
export const selectStepTwoUSA = (state) => state.navApplication.stepTwoUSA;
export const selectStepThreeUSA = (state) => state.navApplication.stepThreeUSA;
export const selectSchoolsUSA = (state) => state.navApplication.schoolsUSA;
export const selectCurriculumUSA = (state) => state.navApplication.curriculumUSA;

export const selectStepOneMX = (state) => state.navApplication.stepOneMX;
export const selectStepTwoMX = (state) => state.navApplication.stepTwoMX;
export const selectStepThreeMX = (state) => state.navApplication.stepThreeMX;
export const selectStepFourMX = (state) => state.navApplication.stepFourMX;
export const selectStateOption = (state) => state.navApplication.stateOption;


export default navSlice.reducer