import React, {useCallback, useEffect, useState} from 'react';
import {View, Image, Text, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useOrientation} from '../../hooks';
import {BallIndicator} from 'react-native-indicators';
import {Orange} from '../../colors/colorsApp';
import {useSelector} from 'react-redux';
import {selectOrientation} from '../../slices/orientationSlice';
import tw from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';

let orientation = 'PORTRAIT';

export default ({navigation, route: {params: {language}}}) => {
    orientation = useSelector(selectOrientation)
    const [contador, setContador] = useState(0);
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });
    
    const [info, setInfo] = useState({})
    
    useEffect(async () => {
        let data = null;
        let keyUserInfo = 'userInfo';
        data = await AsyncStorage.getItem(keyUserInfo) || '[]';
        data = JSON.parse(data);
        let obj = null;

        if(data.tipo === 'MX'){
            obj = {
                picture: data.data.datos_personales.foto ? `https://telat.mx/intranet/upload/fotos/${data.data.datos_personales.foto}` : '',
                name: data.data.datos_personales.nombre_login,
                gender: data.data.datos_personales.genero,
                tipo: data.tipo
            }
        }
        else {
            obj = {
                picture: data.data.datos_personales.foto ? `https://telat.mx/intranet/upload/fotos/${data.data.datos_personales.foto}` : '',
                name: data.data.datos_personales.nombre_login,
                gender: null,
                tipo: data.tipo
            }
        }
        setInfo(obj)

        return undefined
    },[])

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                navigation.navigate('Dashboard', {language: language, orientation: orientationInfo.initial});
            }, (contador === 1 || contador === 0) ? 100 : 1) //AQUI ERAN 4000 en el primero
        }, [])
    );
   
    return (
        <ImageBackground source={require('../../../assets/background/fondo.jpg')} resizeMode='cover' style={tw`w-[100%] h-[100%]`}>
            {
                orientation === 'PORTRAIT' || !orientation
                ?
                    <View style={tw`flex-1 justify-center items-center`}>
                        <View style={tw`h-55, self-stretch`} />
                        <View style={tw`h-auto self-stretch justify-center items-center`}>
                            <Text style={tw`text-[#c2c2c2] text-2xl`}>{language === '1' ? '¡Hola!' : 'Hello!'}</Text>
                            <Text style={tw`text-black text-3xl font-bold mt-1`}>{info.name ? info.name : ''}</Text>
                            <View style={tw`w-53 h-53 rounded-full justify-center items-center border-8 border-[#dadada] my-5`}>
                                {
                                    info.picture
                                    ?
                                        <Image
                                            style={tw`w-49 h-49 rounded-full`}
                                            resizeMode={'cover'}
                                            source={{uri: `${info.picture}`}}
                                        />
                                    :
                                        <Image
                                            style={tw`w-48 h-48 rounded-full`}
                                            resizeMode={'cover'}
                                            source={require('../../../assets/user.png')}
                                        />
                                }
                            </View>
                        </View>
                        <View style={tw`flex-1 self-stretch justify-center items-center`}>
                            <BallIndicator color={Orange} size={35} />
                        </View>
                    </View>
                :
                    <View style={tw`flex-1 justify-center items-center`}>
                        <View style={tw`flex-1 self-stretch`}/>
                        <View style={tw`h-auto self-stretch justify-center items-center`}>
                            <Text style={tw`text-[#c2c2c2] text-lg`}>{language === '1' ? '¡Hola!' : 'Hello!'}</Text>
                            <Text style={tw`text-black text-xl font-bold`}>{info.name ? info.name : ''}</Text>
                            <View style={tw`w-37.5 h-37.5 rounded-full justify-center items-center border-8 border-[#dadada] my-5`}>
                                {
                                    info.picture
                                    ?
                                        <Image
                                            style={tw`rounded-full w-34 h-34`}
                                            resizeMode={'cover'}
                                            source={{uri: `${info.picture}`}}
                                        />
                                    :
                                        <Image
                                            style={tw`rounded-full w-34 h-34`}
                                            resizeMode={'cover'}
                                            source={require('../../../assets/user.png')}
                                        />
                                }
                            </View>
                            <View style={tw`h-12.5 self-stretch justify-center items-center`}>
                                <BallIndicator color={Orange} size={35} />
                            </View>
                        </View>
                        <View style={tw`flex-1 self-stretch justify-center items-center`} />
                    </View>
            }
        </ImageBackground>
    )
}