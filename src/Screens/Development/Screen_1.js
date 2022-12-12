import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {selectError, selectStep} from '../../slices/progressStepSlice'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Blue} from '../../colors/colorsApp'

import tw from 'twrnc'

export default ({language = '1', handleNext = () => {}, handleBack = () => {}}) => {
    const error = useSelector(selectError)
    const step = useSelector(selectStep)

    return(
        <View style={tw`h-auto py-3 self-stretch justify-center items-end px-3 border-b border-b-[#dadada] bg-[#fff] mb-6 flex-row`}>
            {
                step > 1
                &&
                    <TouchableOpacity style={tw`w-auto h-auto bg-[${Blue}] justify-center items-center rounded-2xl pl-1 pr-3 py-2 flex-row`} onPress={handleBack}>
                        <IonIcons name={'chevron-left'} size={25} color='#fff' />
                        <Text style={tw`text-base text-[#fff] font-bold`}>{language === '1' ? 'Atrás' : 'Back'}</Text>
                    </TouchableOpacity>
            }
            <View style={tw`flex-1 self-stretch`}/>
            {
                !error
                ?
                    <TouchableOpacity style={tw`w-auto h-auto bg-[${Blue}] justify-center items-center rounded-2xl pl-3 pr-1 py-2 flex-row`} onPress={handleNext}>
                        <Text style={tw`text-base text-[#fff] font-bold`}>{language === '1' ? 'Siguiente' : 'Next'}</Text>
                        <IonIcons name={'chevron-right'} size={25} color='#fff' />
                    </TouchableOpacity>
                :
                    <View style={tw`w-auto h-auto bg-[#dadada] justify-center items-center rounded-2xl px-3 py-2 pl-3 pr-1 py-2 flex-row`}>
                        <Text style={tw`text-lg text-[#fff] font-bold`}>{language === '1' ? 'Siguiente' : 'Next'}</Text>
                        <IonIcons name={'chevron-right'} size={25} color='#fff' />
                    </View>
            }
        </View>
    )
}