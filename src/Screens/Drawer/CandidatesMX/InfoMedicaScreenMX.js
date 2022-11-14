import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderPortrait, HeaderLandscape, Title} from '../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {useNavigation, useOrientation, useScroll} from '../../../hooks'
import {barStyle, barStyleBackground, SafeAreaBackground} from '../../../colors/colorsApp';
import { isIphone } from '../../../access/requestedData';
import tw from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';

export default ({navigation, route: {params: {language, orientation}}}) => {
    const {handlePath} = useNavigation()
    const {isTablet} = DeviceInfo;
    const [info, setInfo] = useState({})
    const [contador, setContador] = useState(0)

    navigation.addListener('focus', () => {
        setContador(contador + 1);
    });

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    useEffect(async ()=> {
        let keyAccessed = 'keyAccess';
        let datita = await AsyncStorage.getItem(keyAccessed) || '0';
        
        if(datita) {
            await AsyncStorage.removeItem(keyAccessed).then( () => AsyncStorage.setItem(keyAccessed, '1'));
        }
        else {
            await AsyncStorage.setItem(keyAccessed, AsyncStorage.setItem(keyAccessed, '1'));
        }
    },[contador])

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)

    useEffect(async () => {
        let data = null;
        let keyUserInfo = 'userInfo';
        data = await AsyncStorage.getItem(keyUserInfo) || '[]';
        data = JSON.parse(data);
        let obj = {
            contacto: data.data.informacion_medica.infom_contacto ? data.data.informacion_medica.infom_contacto : 'N/A',
            telefono: data.data.informacion_medica.infom_telefono ? data.data.informacion_medica.infom_telefono : 'N/A',
            tipo_sangre: data.data.informacion_medica.infom_tipo_sangre ? data.data.informacion_medica.infom_tipo_sangre : 'N/A',
            medicamentos: data.data.informacion_medica.infom_medicamentos ? data.data.informacion_medica.infom_medicamentos : 'N/A',
            alegias: data.data.informacion_medica.infom_alergias ? data.data.informacion_medica.infom_alergias : 'N/A',
            enfermedades: data.data.informacion_medica.infom_enfermedad ? data.data.informacion_medica.infom_enfermedad : 'N/A',
        }
        setInfo(obj)

        return undefined
    },[])

    const Contenedor = ({title, leftPosition = true, hasBottomLine = true}) => {
        return (
            <View style={tw`self-stretch items-${leftPosition ? 'start' : 'end'} justify-center pb-2 ml-${hasBottomLine ? 2 : 0}`}>
                <Text style={{fontSize: 14}}>{title}</Text>
            </View>
        )
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            {
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <HeaderPortrait title={language === '1' ? 'Información Médica' : 'Medic Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                :
                    <HeaderLandscape title={language === '1' ? 'Información Médica' : 'Medic Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
            }
            {
                
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}]`}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={{alignSelf: 'stretch'}}
                            onScroll={handleScroll}
                            contentContainerStyle={{paddingTop: paddingTop}}
                        >
                            <View style={tw`mt-[3%]`}></View>
                            <Title title={language === '1' ? 'INFORMACIÓN MÉDICA' : 'MEDIC INFORMATION'} icon={'user'}/>
                            <View style={tw`justify-start items-start w-[100%]`}>
                                <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'Contacto de Emergencia' : 'Emergency Contact'}</Text>
                                <Contenedor title={info.contacto}/>
                                <Text style={[titleStyle, {paddingLeft: 7, paddingTop: 7}]}>{language === '1' ? 'Teléfono de Emergencia' : 'Emergency Contact'}</Text>
                                <Contenedor title={info.telefono}/>
                                <Text style={[titleStyle, {paddingLeft: 7, paddingTop: 7}]}>{language === '1' ? 'Tipo de Sangre' : 'Blood Type'}</Text>
                                <Contenedor title={info.tipo_sangre}/>
                                <Text style={[titleStyle, {paddingLeft: 7, paddingTop: 7}]}>{language === '1' ? 'Alergías' : 'Allergies'}</Text>
                                <Contenedor title={info.alegias}/>
                                <Text style={[titleStyle, {paddingLeft: 7, paddingTop: 7}]}>{language === '1' ? 'Medicamentos Controlados' : 'Controlled Medications'}</Text>
                                <Contenedor title={info.medicamentos}/>
                                <Text style={[titleStyle, {paddingLeft: 7, paddingTop: 7}]}>{language === '1' ? '¿Alguna enfermedad que deba conocer la empresa para tu bienestar?' : 'Do you have any illness that we should know about?'}</Text>
                                <Contenedor title={info.enfermedades}/>
                            </View>
                        </ScrollView>
                    </View>
                :
                    <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}]`}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={{alignSelf: 'stretch'}}
                            onScroll={handleScroll}
                            contentContainerStyle={{paddingTop: paddingTop}}
                        >
                            <View style={tw`mt-[3%]`}></View>
                            <Title title={language === '1' ? 'INFORMACIÓN MÉDICA' : 'MEDIC INFORMATION'} icon={'user'}/>
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Contacto de Emergencia' : 'Emergency Contact'}</Text>
                                    <Contenedor title={info.contacto} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1, marginLeft: 6}}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Teléfono de Emergencia' : 'Emergency Contact'}</Text>
                                    <Contenedor title={info.telefono} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Tipo de Sangre' : 'Blood Type'}</Text>
                                    <Contenedor title={info.tipo_sangre} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1, marginLeft: 6}}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Alergías' : 'Allergies'}</Text>
                                    <Contenedor title={info.alegias} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start px-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Medicamentos Controlados' : 'Controlled Medications'}</Text>
                                    <Contenedor title={info.medicamentos} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={[titleStyle]}>{language === '1' ? '¿Alguna enfermedad que deba conocer la empresa para tu bienestar?' : 'Do you have any illness that we should know about?'}</Text>
                                    <Contenedor title={info.enfermedades} hasBottomLine={false}/>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
            }
        </>
    );
}

const titleStyle = tw`text-sm text-[#1177E9] font-medium`