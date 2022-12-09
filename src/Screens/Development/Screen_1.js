import React from  'react'
import {View, Text, TouchableOpacity, SafeAreaView, StatusBar} from 'react-native'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaBackground, barStyleBackground, barStyle, Blue} from '../../colors/colorsApp'
import {selectLanguageApp} from '../../slices/varSlice';
import {useSelector} from 'react-redux';
import {isIphone} from '../../access/requestedData';
import tw from 'twrnc'
import {selectError, selectStep} from '../../slices/progressStepSlice';

let step = null;
let error = null;
let language = null;

export default ({children}) => {
    step = useSelector(selectStep)
    error = useSelector(selectError)
    language = useSelector(selectLanguageApp)

    const Item = ({id, title, total}) => {
        return(
            <View style={tw`flex-1 justify-center items-center`}>
                <View style={tw`h-11 w-11 rounded-full bg-[${step >= id ? '#fff' : '#dadada'}] border border-4 border-[${step >= id ? Blue : '#dadada'}] justify-center items-center`}>
                    {
                        step > id
                        ?
                            <IonIcons name={'check-bold'} size={19} color={Blue} />
                        :
                            <Text style={tw`font-bold text-sm text-[${step >= id ? Blue : '#fff'}]`}>{id}</Text>
                    }
                </View>
            </View>
        )
    }

    const data = [
        {
            id: 1,
            title: 'Información Básica'
        },
        {
            id: 2,
            title: 'Competencias y Habilidades'
        },
        {
            id: 3,
            title: 'Experiencia Laboral'
        }
    ]

    const Progress = ({id, title}) => {
        return(
            <View style={tw`h-1.5 self-stretch bg-[${id <= step ? Blue : '#dadada'}] flex-1`} />
        )
    }

    const Legend = ({id, title}) => {
        return(
            <View style={tw`flex-1 justify-center items-center mx-2.5`}>
                <Text style={tw`text-sm text-center text-[${id <= step ? Blue : '#dadada'}]`}>{title}</Text>
            </View>
        )
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }}/>
            <View style={tw`bg-[#f7f7f7] flex-1 justify-center items-center`}>
                <View style={tw`h-16.5 self-stretch justify-center items-center flex-row`}>
                    {data.map(x => <Item total={data.length} {...x}/>)}
                </View>
                <View style={tw`h-auto self-stretch justify-center items-center flex-row`}>
                    {data.map(x => <Progress total={data.length} {...x}/>)}
                </View>
                <View style={tw`h-auto self-stretch justify-center items-center flex-row my-2`}>
                    {data.map(x => <Legend total={data.length} {...x}/>)}
                </View>
                <View style={tw`flex-1 self-stretch border-t border-t-[#dadada] border-b border-b-[#dadada] bg-[#fff]`}>
                    {children}
                </View>
                <View style={tw`h-15 self-stretch justify-center items-end px-6 border-b border-b-[#dadada] bg-[#f7f7f7]`}>
                    {
                        !error
                        ?
                            <TouchableOpacity style={tw`w-auto h-auto bg-[${Blue}] justify-center items-center rounded-2xl px-3 py-2`}>
                                <Text style={tw`text-lg text-[#fff] font-bold`}>{language === '1' ? 'Siguiente' : 'Next'}</Text>
                            </TouchableOpacity>
                        :
                            <View style={tw`w-auto h-auto bg-[#dadada] justify-center items-center rounded-2xl px-3 py-2`}>
                                <Text style={tw`text-lg text-[#fff] font-bold`}>{language === '1' ? 'Siguiente' : 'Next'}</Text>
                            </View>
                    }
                </View>
                {
                    isIphone
                    &&
                        <View style={tw`h-6 self-stretch`}/>
                }
            </View>
        </>
    )
}