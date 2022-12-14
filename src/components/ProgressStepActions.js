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
                    <TouchableOpacity style={tw`w-auto h-auto bg-[${Blue}] justify-center items-center rounded-2xl px-3.5 pr-1.5 py-1.5 flex-row`} onPress={() => handleNext()}>
                        <Text style={tw`text-base text-[#fff] font-bold android:pb-0.5 mr-1`}>{language === '1' ? !finalStep ? 'Siguiente' : 'Finalizar' : !finalStep ? 'Next' : 'Finish'}</Text>
                        <IonIcons name={!finalStep ? 'chevron-right' : 'check'} size={18} color='#fff' />
                    </TouchableOpacity>
                :
                    <View style={tw`w-auto h-auto bg-[#dadada] justify-center items-center rounded-2xl px-3.5 pr-1.5 py-1.5 flex-row`}>
                        <Text style={tw`text-base text-[#fff] font-bold android:pb-0.5 mr-1`}>{language === '1' ? !finalStep ? 'Siguiente' : 'Finalizar' : !finalStep ? 'Next' : 'Finish'}</Text>
                        <IonIcons name={!finalStep ? 'chevron-right' : 'check'} size={18} color='#fff' />
                    </View>
            }
        </View>
    )
}