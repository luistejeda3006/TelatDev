import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {selectError, selectStep, setStep} from '../slices/progressStepSlice'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Blue} from '../colors/colorsApp'

import tw from 'twrnc'

export default ({language = '1', handleNext = () => {}, finalStep = false}) => {
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
                    <TouchableOpacity style={tw`px-3 py-2 border border-[#dadada] rounded bg-[${Blue}]`} onPress={handleNexts}>
                        <Text style={tw`text-[#fff] font-bold`}>{language === '1' ? !finalStep ? 'Siguiente' : 'Finalizar' : !finalStep ? 'Next' : 'Finish'}</Text>
                    </TouchableOpacity>
                :
                    <View style={tw`px-3 py-2 border border-[#adadad] rounded bg-[#dadada]`}>
                        <Text style={tw`text-[#fff] font-bold`}>{language === '1' ? !finalStep ? 'Siguiente' : 'Finalizar' : !finalStep ? 'Next' : 'Finish'}</Text>
                    </View>
            }
            {/* {
                !error
                ?
                    <TouchableOpacity style={tw`w-auto h-auto bg-[${Blue}] justify-center items-center rounded-2xl py-2 px-4 flex-row`} onPress={() => handleNext()}>
                        <Text style={tw`text-base text-[#fff] font-bold android:pb-0.5`}>{language === '1' ? !finalStep ? 'Siguiente' : 'Finalizar' : !finalStep ? 'Next' : 'Finish'}</Text>
                    </TouchableOpacity>
                :
                    <View style={tw`w-auto h-auto bg-[#dadada] justify-center items-center rounded-2xl py-2 px-4 flex-row`}>
                        <Text style={tw`text-base text-[#fff] font-bold android:pb-0.5`}>{language === '1' ? !finalStep ? 'Siguiente' : 'Finalizar' : !finalStep ? 'Next' : 'Finish'}</Text>
                    </View>
            } */}
        </View>
    )
}