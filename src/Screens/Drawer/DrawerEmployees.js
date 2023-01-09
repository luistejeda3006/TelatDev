import React,{useEffect, useState} from 'react';
import {View, Image, Alert, ImageBackground, StatusBar, ScrollView, Text, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerItem} from '../../components'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, Orange} from '../../colors/colorsApp'
import {useSelector} from 'react-redux';
import {selectOrientation} from '../../slices/orientationSlice';
import {selectLanguageApp} from '../../slices/varSlice';
import {isIphone} from '../../access/requestedData';
import tw from 'twrnc';

let currentLanguage = null;
let isLogged = 'isLogged'
let puesto = ''
let orientation = null;

export default (props) => {
    orientation = useSelector(selectOrientation)
    currentLanguage = useSelector(selectLanguageApp)

    const sendNotification = 'sendNotification'
    const dataNotification = 'dataNotification'
    const [info, setInfo] = useState({})

    useEffect(() => {
        props.navigation.closeDrawer()
    },[orientation])

    useEffect(async () => {
        let data = null;
        let keyUserInfo = 'userInfo';
        data = await AsyncStorage.getItem(keyUserInfo) || '[]';
        data = JSON.parse(data);
        let obj = null;
        if(data.tipo === 'MX'){
            obj = {
                picture: data.data.datos_personales.foto_url ? data.data.datos_personales.foto_url : '',
                name: data.data.datos_personales.nombre_completo,
                position: data.data.datos_laborales.puesto,
                gender: data.data.datos_personales.genero,
                tipo: data.tipo,
            }
            puesto = data.data.datos_laborales.puesto
        }
        else {
            obj = {
                picture: data.data.datos_personales.foto_url ? data.data.datos_personales.foto_url : '',
                name: data.data.datos_personales.nombre_completo,
                position: data.data.datos_laborales.puesto,
                gender: null,
                tipo: data.tipo,
            }
            puesto = data.data.datos_laborales.puesto
        }
        setInfo(obj)
        
        return undefined
    },[])

    const handleAlert = () => {
        Alert.alert(
            info.gender ? currentLanguage === '1' ? 'Cerrar Sesión' : 'Sign Out' : 'Sign Out',
            info.gender ? currentLanguage === '1' ? info.gender === 'M' ? '¿Segura que deseas cerrar tu sesión?' : '¿Seguro que deseas cerrar tu sesión?' : 'Are you sure you want to close the session?' : 'Are you sure you want to close the session?',
            [
                {
                    text: info.gender ? currentLanguage === '1' ? 'Cancelar' : 'Cancel' : 'Cancel',
                    style: "cancel"
                },
                { 
                    text: info.gender ? currentLanguage === '1' ? info.gender === 'H' ? "Sí, estoy seguro" : 'Sí, estoy segura' : "Yes, I am sure" : "Yes, I am sure", 
                    onPress: async () => {
                        let keyUserInfo = 'userInfo';
                        let keyTokenInfo = 'tokenInfo';
                        await AsyncStorage.removeItem(keyUserInfo)
                        await AsyncStorage.removeItem(keyTokenInfo)
                        await AsyncStorage.removeItem(sendNotification)
                        await AsyncStorage.removeItem(dataNotification)
                        await AsyncStorage.setItem(isLogged, '0');
                        props.navigation.closeDrawer()
                        props.navigation.navigate('AuthLogin')
                    }
                }
            ]
        )
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <ImageBackground source={require('../../../assets/background/fondo.jpg')} resizeMode='cover' style={tw`w-[100%] h-[100%] bg-[#f1f1f1] pb-${isIphone ? 7.5 : 0} pt-${orientation === 'PORTRAIT' ? isIphone ? 7.5 : 1.5 : 1.5}`}>
                <View style={tw`h-auto self-stretch ml-6 mr-4 pt-${orientation === 'PORTRAIT' ? 5 : 1.5} justify-center items-center`} >
                    <View style={tw`w-22.5 h-22.5 rounded-full justify-center items-center border border-8 border-[#dadada]`}>
                        {
                            info.picture
                            ?
                                <Image
                                    style={imageStyle}
                                    resizeMode={'cover'}
                                    source={{uri: `${info.picture}`}}
                                />
                            :
                                <Image
                                    style={imageStyle}
                                    resizeMode={'cover'}
                                    source={require('../../../assets/user.png')}
                                />
                        }
                    </View>
                    <View style={tw`h-auto self-stretch justify-center items-center py-4`}>
                        <Text style={tw`text-black text-base font-bold mb-1 text-center`}>{info.name ? info.name : ''}</Text>
                        <View style={tw`h-0.5 w-[${info.name  > 24 ? '75%' : '58%'}] bg-[#dadada] my-0.5`}/>
                        <Text style={tw`text-sm text-[${Blue}] mt-1 text-center`}>{info.position ? info.position : puesto}</Text>
                    </View>
                </View>
                <View style={tw`h-0.5 self-stretch bg-[#dadada]`}/>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={tw`self-stretch`}
                >
                    {
                        info.tipo === 'US'
                        ?
                            <>
                                <DrawerItem icon={'account-outline'} title={'Personal Information'} handlePress={() => props.navigation.navigate('PersonalUSA', {language: currentLanguage, orientation: orientation})} first={true}/>
                                <DrawerItem icon={'briefcase-account-outline'} title={'Associated Information'} handlePress={() => props.navigation.navigate('EmployeeUSA', {language: currentLanguage, orientation: orientation})}/>
                                <DrawerItem icon={'file-account-outline'} title={'Resume'} handlePress={() => props.navigation.navigate('CurriculumUSA', {language: currentLanguage, orientation: orientation})}/>
                                <DrawerItem icon={'account-multiple-outline'} title={'Personal References'} handlePress={() => props.navigation.navigate('PersonalesUSA', {language: currentLanguage, orientation: orientation})}/>
                            </>
                        :
                            <>
                                <DrawerItem icon={'account-circle-outline'} title={currentLanguage === '1' ? 'Información Personal' : 'Personal Information'} handlePress={() => props.navigation.navigate('Personal', {language: currentLanguage, orientation: orientation})} first={true}/>
                                <DrawerItem icon={'briefcase-variant-outline'} title={currentLanguage === '1' ? 'Datos Laborales' : 'Labor Information'} handlePress={() => props.navigation.navigate('Laboral', {language: currentLanguage, orientation: orientation})}/>
                                <DrawerItem icon={'clipboard-account-outline'} title={currentLanguage === '1' ? 'Currículum' : 'Resume'} handlePress={() => props.navigation.navigate('Curriculum', {language: currentLanguage, orientation: orientation})}/>
                                <DrawerItem icon={'account-group-outline'} title={currentLanguage === '1' ? 'Referencias Personales' : 'Personal References'} handlePress={() => props.navigation.navigate('Personales', {language: currentLanguage, orientation: orientation})}/>
                                <DrawerItem icon={'heart-pulse'} title={currentLanguage === '1' ? 'Información Médica' : 'Medic Information'} handlePress={() => props.navigation.navigate('Medica', {language: currentLanguage, orientation: orientation})}/>
                            </>
                    }
                </ScrollView>
                <TouchableWithoutFeedback onPress={() => handleAlert()}>
                    <View style={tw`h-${orientation === 'PORTRAIT' ? 21 : 15} mx-4 justify-${isIphone ? 'end' : 'center'} items-center`}>
                        <View style={tw`bg-[${Orange}] h-${orientation === 'PORTRAIT' ? 14 : 10} self-stretch justify-center items-center rounded-xl flex-row`}>
                            <IonIcons name={'logout'} size={25} color='#fff' />
                            <Text style={tw`text-base text-white font-bold ml-2`} >{currentLanguage === '1' ? 'Cerrar Sesión' : 'Logout'}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </>
    );
}

const imageStyle = tw`w-21 h-21 rounded-full`