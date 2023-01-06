import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {selectError, selectStep, setStep} from '../slices/progressStepSlice'
import {Blue} from '../colors/colorsApp'

import tw from 'twrnc'
import { selectLanguageApp } from '../slices/varSlice'

export default ({handleNext = () => {}, finalStep = false}) => {
    const language = useSelector(selectLanguageApp)
    const dispatch = useDispatch()
    const error = useSelector(selectError)
    const step = useSelector(selectStep)

    const handleBack = () => {
        dispatch(setStep(step - 1))
    }

    const handleNexts = () => {
        dispatch(setStep(step + 1))
    }

    return(
        <View style={tw`h-auto py-3 self-stretch justify-center items-end bg-[#fff] mb-6 flex-row`}>
            <View style={tw`flex-1 self-stretch`}/>
            {
                !error
                ?
                    <TouchableOpacity style={tw`px-3 py-2 border border-[#dadada] rounded bg-[${Blue}]`} onPress={handleNext}>
                        <Text style={tw`text-[#fff] font-bold`}>{language === '1' ? !finalStep ? 'Siguiente' : 'Finalizar' : !finalStep ? 'Next' : 'Finish'}</Text>
                    </TouchableOpacity>
                :
                    <View style={tw`px-3 py-2 border border-[#adadad] rounded bg-[#dadada]`}>
                        <Text style={tw`text-[#fff] font-bold`}>{language === '1' ? !finalStep ? 'Siguiente' : 'Finalizar' : !finalStep ? 'Next' : 'Finish'}</Text>
                    </View>
            }
        </View>
    )
}