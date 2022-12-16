import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    statements: undefined,
    statementsVisible: false,
    stepOneUSA: {},
    stepTwoUSA: {},
    stepThreeUSA: {},
    schoolsUSA: {},
    curriculumUSA: {}
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setStatements: (state, action) => {state.statements = action.payload},
        setStatementsVisible: (state, action) => {state.statementsVisible = action.payload},
        setStepOneUSA: (state, action) => {state.stepOneUSA = action.payload},
        setStepTwoUSA: (state, action) => {state.stepTwoUSA = action.payload},
        setStepThreeUSA: (state, action) => {state.stepThreeUSA = action.payload},
        setSchoolsUSA: (state, action) => {state.schoolsUSA = action.payload},
        setCurriculumUSA: (state, action) => {state.curriculumUSA = action.payload},
    }
})

export const {setStatements, setStatementsVisible, setStepOneUSA, setStepTwoUSA, setStepThreeUSA, setSchoolsUSA, setCurriculumUSA} = navSlice.actions

export const selectStatementsVisible = (state) => state.navApplication.statementsVisible;
export const selectStatements = (state) => state.navApplication.statements;
export const selectStepOneUSA = (state) => state.navApplication.stepOneUSA;
export const selectStepTwoUSA = (state) => state.navApplication.stepTwoUSA;
export const selectStepThreeUSA = (state) => state.navApplication.stepThreeUSA;
export const selectSchoolsUSA = (state) => state.navApplication.schoolsUSA;
export const selectCurriculumUSA = (state) => state.navApplication.curriculumUSA;

export default navSlice.reducer