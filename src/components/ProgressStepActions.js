import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {selectError, selectStep, setStep} from '../slices/progressStepSlice'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Blue} from '../colors/colorsApp'

import tw from 'twrnc'

export default ({language = '1', handleNext = () => {}}) => {
    const dispatch = useDispatch()
    const error = useSelector(selectError)
    const step = useSelector(selectStep)

    const handleBack = () => {
        dispatch(setStep(step - 1))
    }

    return(
        <View style={tw`h-auto py-3 self-stretch justify-center items-end bg-[#fff] mb-6 flex-row`}>
            <View style={tw`flex-1 self-stretch`}/>
            {
                !error
                ?
                    <TouchableOpacity style={tw`w-auto h-auto bg-[${Blue}] justify-center items-center rounded-2xl pl-3 pr-1 py-2 flex-row`} onPress={() => handleNext()}>
                        <Text style={tw`text-base text-[#fff] font-bold pb-0.5`}>{language === '1' ? 'Siguiente' : 'Next'}</Text>
                        <IonIcons name={'chevron-right'} size={25} color='#fff' />
                    </TouchableOpacity>
                :
                    <View style={tw`w-auto h-auto bg-[#dadada] justify-center items-center rounded-2xl pl-3 pr-1 py-2 flex-row`}>
                        <Text style={tw`text-base text-[#fff] font-bold pb-0.5`}>{language === '1' ? 'Siguiente' : 'Next'}</Text>
                        <IonIcons name={'chevron-right'} size={25} color='#fff' />
                    </View>
            }
        </View>
    )
}