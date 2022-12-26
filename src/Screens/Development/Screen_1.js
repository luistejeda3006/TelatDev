import React, { useState } from 'react'
import {View, Text, TouchableOpacity, StatusBar, SafeAreaView, ImageBackground} from 'react-native'
import {HeaderPortrait} from '../../components'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../colors/colorsApp'
import {useSelector} from 'react-redux'
import {selectLanguageApp} from '../../slices/varSlice'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc'

export default ({navigation}) => {
    const language = useSelector(selectLanguageApp)

    const [initialState, setInitialState] = useState({
        data: [
            {
                id: 1,
                title: 'Día del niño',
                detalle: 'Se llevará acabo un donativo de juguetes para niños de un orfanato en Santa Clara.',
                image: 'https://fondosmil.com/fondo/38780.jpg',
            },
            {
                id: 2,
                title: 'Día de la madre',
                detalle: 'Se llevará acabo un donativo de juguetes para niños de un orfanato en Santa Clara.',
                image: 'https://i.pinimg.com/originals/7c/2f/4b/7c2f4bfbaa411a9ef5b45bd0b4214fba.jpg',
            },
        ],
    })

    const {data} = initialState

    const Item = ({title, detalle, image}) => {
        <View style={tw`h-30 self-stretch bg-red-400`}>
            <ImageBackground style={tw`flex-1`} resizeMode='contain' source={image}>
                <Text>{title}</Text>
            </ImageBackground>
        </View>
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
            <HeaderPortrait title={language === '1' ? 'Dinámicas' : 'Dynamics'} screenToGoBack={'Choose'} navigation={navigation} normal={true}/>
            <View style={{backgroundColor: '#fff', flex: 1}}>
                {
                    data.map(x => 
                        <TouchableOpacity style={tw`h-auto self-stretch mx-2 mt-2 border border-[#dadada] rounded-md overflow-hidden`}>
                            <View style={tw`h-40 self-stretch`}>
                                <ImageBackground style={tw`flex-1`} resizeMode='cover' source={{uri: x.image}}>
                                    <View style={tw`h-6 self-stretch justify-center items-end `}>
                                        <View style={tw`h-[100%] w-[15%] justify-center items-center rounded-bl-xl bg-[rgba(255,255,255,.2)] flex-row`}>
                                            <IonIcons name={'star-outline'} size={14} color={'#ffbf00'} />
                                            <Text style={tw`text-[#fff] font-bold ml-1 text-xs`}>4.3</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </View>
                            <View style={tw`h-auto self-stretch p-1 flex-row border-t border-t-[#dadada]`}>
                                <View style={tw`justify-start items-center flex-1 flex-row`}>
                                    <View style={tw`pb-0.5`}>
                                        <IonIcons name={'bullhorn-outline'} size={14} color={Blue} />
                                    </View>
                                    <Text style={[{fontSize: 13}, tw`font-normal text-[#383838] font-bold ml-1`]}>{x.title}</Text>
                                </View>
                                <View style={tw`justify-end items-center flex-1 flex-row`}>
                                    <View style={tw`w-auto h-[100%] pl-1.5 flex-row justify-center items-center`}>
                                        <View style={tw`pt-0.5`}>
                                            <IonIcons name={'comment-processing-outline'} size={14} color={Blue} />
                                        </View>
                                        <Text style={[{fontSize: 10}, tw`font-bold text-[#000] ml-1 mt-px`]}>64</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }
            </View>
        </>
    )
}