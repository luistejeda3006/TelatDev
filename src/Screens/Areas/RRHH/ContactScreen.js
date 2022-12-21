import React, {useRef, useState, useEffect, useCallback} from 'react'
import {View, Text, TouchableWithoutFeedback, PermissionsAndroid, Platform, Image, Alert, BackHandler, SafeAreaView, ScrollView, StyleSheet, StatusBar} from 'react-native'
import {useConnection, useOrientation, useNavigation, useForm, useScroll} from '../../../hooks'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp'
import {request, PERMISSIONS} from 'react-native-permissions';
import {HeaderPortrait, Input, Modal, MultiText, ModalLoading, FailedNetwork, Title} from '../../../components'
import Picker from 'react-native-picker-select';
import {isIphone, live, login, urlJobs} from '../../../access/requestedData';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import * as Animatable from 'react-native-animatable';
import RNFetchBlob from 'rn-fetch-blob'
import tw from 'twrnc'
import { useFocusEffect } from '@react-navigation/native';

let cuenta = 0;

let audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.05)
let initialization = {
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
    progress: 0
}

let segundos = null;
let minutos = null;
let milisegundos = null;
let split = null;
let total = null;

let segundos_play = null;
let milisegundos_play = null;
let split_play = null;
let total_play = null;

export default ({navigation, route: {params: {id, language, country, id_sede}}}) => {
    /* console.log('id: ', id, 'language: ', language, 'country: ', country, "id_sede: ", id_sede) */
    let filePath = null
    let encrypted = null;
    const speaking_level = useRef()
    const writing_level  = useRef()
    const handle_programs  = useRef()
    const full_name  = useRef()
    const correo  = useRef()
    const phone_1  = useRef()
    const phone_2  = useRef()
    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)
    const [successVisibility, setSuccessVisibility] = useState(false)
    const {handleInputChange, values, handleSetState, handleSubmitForm} = useForm({
        currentCity: (id_sede === '1' || id_sede === '2' || id_sede === '3') ? 'Mexico City' : id_sede === '4' ? 'Juárez' : 'El Paso, TX.',
        currentCityOption: (id_sede === '1' || id_sede === '2' || id_sede === '3') ? 0 : id_sede === '4' ? 1 : 2,
        currentAboutUs: '',
        currentAboutUsOption: 0,
        speakingLevel: '',
        writingLevel: '',
        programs: '',
        currentProgramsOption: 0,
        currentClose: 0,
        currentCloseOption: 0,
        companies_time: '',
        fullName: '',
        email: '',
        telefono_1: '',
        telefono_2: '',
        other: '',
        currentContact: '',
        currentContactOption: 0,

        currentSchedule: '',
        currentScheduleOption: 0,

        currentLevelEnglish: '',
        currentLevelOptionEnglish: 0,

        currentLevelSpanish: '',
        currentLevelOptionSpanish: 0,
    })

    const {currentCity, currentContact, currentCityOption, currentAboutUs, currentAboutUsOption, speakingLevel, writingLevel, programs, currentProgramsOption, currentClose, currentCloseOption, companies_time, fullName, email, telefono_1, telefono_2, other, currentContactOption, currentSchedule, currentScheduleOption, currentLevelEnglish, currentLevelOptionEnglish, currentLevelSpanish, currentLevelOptionSpanish} = values

    const [initialState, setInitialState] = useState({
        loading: false,
        cityOptions: [
            {value: 'Mexico City', label: 'Mexico City'},
            {value: 'Juárez', label: 'Juárez'},
            {value: 'El Paso, TX.', label: 'El Paso, TX.'},
        ],
        
        closeOptions: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: language === '1' ? 'SI' : 'YES', label: language === '1' ? 'SI' : 'YES'},
            {value: 'NO', label: 'NO'},
        ],

        optionsAboutMX: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: 'Facebook/Instagram', label: 'Facebook/Instagram'},
            {value: 'Indeed', label: 'Indeed'},
            {value: 'OCC Mundial', label: 'OCC Mundial'},
            {value: language === '1' ? 'Referido' : 'Referral', label: language === '1' ? 'Referido' : 'Referral'},
            {value: language === '1' ? 'Trabajé antes en Telat' :'I previously worked in Telat', label: language === '1' ? 'Trabajé antes en Telat' :'I previously worked in Telat'},
            {value: language === '1' ? 'Otro' : 'Other', label: language === '1' ? 'Otro' : 'Other'},
        ],

        optionsAboutUS: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: 'Facebook/Instagram', label: 'Facebook/Instagram'},
            {value: 'Indeed', label: 'Indeed'},
            {value: language === '1' ? 'Referido' : 'Referral', label: language === '1' ? 'Referido' : 'Referral'},
            {value: language === '1' ? 'Trabajé antes en Telat/Dataxport' : 'I previously worked in Telat/Dataxport', label: language === '1' ? 'Trabajé antes en Telat/Dataxport' : 'I previously worked in Telat/Dataxport'},
            {value: language === '1' ? 'Otro' : 'Other', label: language === '1' ? 'Otro' : 'Other'},
        ],
        
        levels: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: language === '1' ? 'Básico' : 'Basic', label: language === '1' ? 'Básico' : 'Basic'},
            {value: language === '1' ? 'Intermedio' :'Intermediate', label: language === '1' ? 'Intermedio' :'Intermediate'},
            {value: language === '1' ? 'Avanzado' : 'Advanced', label: language === '1' ? 'Avanzado' : 'Advanced'},
        ],

        contactOptions: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: language === '1' ? 'Llamada' : 'Call', label: language === '1' ? 'Llamada' : 'Call'},
            {value: 'WhatsApp', label: 'WhatsApp'},
            {value: language === '1' ? 'Email' : 'E-mail', label: language === '1' ? 'Email' : 'E-mail'},
        ],
        
        scheduleOptions: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: '8:00a.m. - 11:00a.m.', label: '8:00a.m. - 11:00a.m.'},
            {value: '11:00a.m. - 1:00p.m.', label: '11:00a.m. - 1:00p.m.'},
            {value: '1:00p.m. - 4:00p.m.', label: '1:00p.m. - 4:00p.m.'},
        ],
        isRecording: '1',
        isPlaying: '1',
    })
    const [change, setChange] = useState(false)
    const [recording, setRecording] = useState(initialization)
    const [path, setPath] = useState('')
    const {recordTime, playTime, progress} = recording

    useEffect(() => {
        const backAction = () => {
        Alert.alert(
            language === '1' ? 'Cancelar Solicitud' : 'Cancel Request',
            language === '1' ? '¿Estás seguro(a), que desea cancelar tu solicitud? \n\nSe perderán los datos ingresados\n' : 'Are you sure you want to cancel your request? \n\nThe data entered will be lost\n', 
            [
                {
                    text: language === '1' ? 'Cancelar' : 'Cancel',
                    onPress: () => null,
                    style: 'cancel'
                },
                {text: language === '1' ? 'Sí, estoy seguro' : 'Yes, I am sure', onPress: () => {
                    navigation.navigate('VacantDetail')
                }}
            ]
        );
        return true;
    };
    
    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );
    
    return () => backHandler.remove();
    }, [language]);

    const {isRecording, isPlaying, closeOptions, optionsAboutMX, optionsAboutUS, levels, contactOptions, scheduleOptions, loading} = initialState
    
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);
            
                // console.log('write external stroage', grants);
                
                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    // console.log('Permissions granted');
                } else {
                    // console.log('All required permissions not granted');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }
        else{
            try{
                const permiso = await request(PERMISSIONS.IOS.MICROPHONE)
                if(permiso === 'granted' || permiso === 'unavailable'){
                }
                else {

                }
            }catch(err){
                console.warn(err)
                return;
            }
        }
    }

    const onLoad = async () => {
        handlePath('VacantDetail')
        setRecording(initialization)
        setInitialState({...initialState, isRecording: '1', isPlaying: '1'})
        const result = await audioRecorderPlayer.stopRecorder();
        setPath(result)
        audioRecorderPlayer.removeRecordBackListener();
    }

    useFocusEffect(
        useCallback(() => {
            onLoad()
        }, [])
    );

    useEffect(() => {
        requestPermissions()
    }, [])

    const onStartRecord = async () => {
        try{
            const result = await audioRecorderPlayer.startRecorder();
            audioRecorderPlayer.addRecordBackListener((e) => {
                setRecording({...recording, 
                    recordSecs: e.currentPosition, 
                    recordTime: audioRecorderPlayer.mmssss(
                    Math.floor(e.currentPosition),
                ),})
                split = audioRecorderPlayer.mmssss(
                Math.floor(e.currentPosition),
                ).split(':')
                minutos = parseInt(split[0])
                segundos = parseInt(split[1])
                milisegundos = parseInt(split[2])
                total = ((minutos * 6000) + (segundos * 100) + milisegundos)
                if(minutos === 1) {
                    onStopRecord(2)
                }
                return;
                
            });
            setPath(result)
        }catch(e){
            console.log('error en start: ', e)
            setRecording(initialization)
            setInitialState({...initialState, isRecording: '1', isPlaying: '1'})
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            Alert.alert(
                language === '1' ? 'Advertencia' : 'Warning',
                language === '1' ? 'Intenta grabar nuevamente tu audio.' : 'Try recording your audio again.',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    const onStopRecord = async (type) => {
        try{
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            if(type === 1){
                setRecording({...recording, recordSecs: 0})
                setInitialState({...initialState, isRecording: '3'})
            }
            else {
                setRecording({...recording, recordSecs: 0, recordTime: '01:00:00'})
                setInitialState({...initialState, isRecording: '3'})
            }
        }catch(e){
            setRecording(initialization)
            setInitialState({...initialState, isRecording: '1', isPlaying: '1'})
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            Alert.alert(
                language === '1' ? 'Advertencia' : 'Warning',
                language === '1' ? 'Solo debes presionar una vez el botón de grabar' : 'You only have to press the record button once.',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    const handleIsRecording = async () => {
        if(isRecording === '1'){
            onStartRecord()
            setInitialState({...initialState, isRecording: '2'})
            setChange(false)
        }
        else {
            if(segundos >= 40){
                onStopRecord(1)
            }
            else {
                Alert.alert(
                    language === '1' ? 'Audio Inválido' : 'Invalid Audio',
                    language === '1' ? 'El audio debe ser minimo de 40 segundos' : 'The audio must be at least 40s',
                    [
                        { text: 'OK'}
                    ]
                )
            }
        }
    }

    const handleActionUno = (value, label) => {
        handleSetState({...values, currentCity: value, currentCityOption: label})
    }
    
    const handleActionDos = (value, label) => {
        handleSetState({...values, currentAboutUs: value, currentAboutUsOption: label})
    }
    
    const handleActionTres = (value, label) => {
        handleSetState({...values, currentClose: value, currentCloseOption: label})
    }
    
    const handleActionCuatro = (value, label) => {
        handleSetState({...values, currentContact: value, currentContactOption: label})
    }
    
    const handleActionCinco = (value, label) => {
        handleSetState({...values, currentSchedule: value, currentScheduleOption: label})
    }
    
    const handleActionSeis = (value, label) => {
        handleSetState({...values, currentLevelEnglish: value, currentLevelOptionEnglish: label})
    }

    const handleActionSiete = (value, label) => {
        handleSetState({...values, currentLevelSpanish: value, currentLevelOptionSpanish: label})
    }
    
    const handleActionOcho = (value, label) => {
        handleSetState({...values, programs: value, currentProgramsOption: label})
    }

    const handleSave = async (tipo) => {
        if(cuenta === 0){
            // fileUri is a string like 'file:///var/mobile/Containers/Data/Application/9B754FAA-2588-4FEC-B0F7-6D890B7B4681/Documents/filename'
            if (Platform.OS === 'ios') {
                let arr = path.split('/')
                const dirs = RNFetchBlob.fs.dirs
                filePath = `/var/mobile/Containers/Data/Application/${arr[8]}/Library/Caches/sound.m4a`
            } else {
                filePath = path
            }
            encrypted = await RNFetchBlob.fs.readFile(filePath, 'base64')
    
            if(isRecording === '3'){
                if(email.includes('@') && email.includes('.')){
                    if(minutos === 1 || segundos >= 40){
                        try{
                            cuenta = cuenta + 1;
                            setInitialState({...initialState, loading: true})
                            let body = null;
                            if(tipo === 1){
                                body = {
                                    'action': 'send_formulario_contacto',
                                    'data': {
                                        "info_ciudad":currentCity,
                                        "info_contacto":currentAboutUs,
                                        "nivel_conversacional":currentLevelEnglish,
                                        "nivel_escritura":currentLevelSpanish,
                                        "programas_computadora": programs,
                                        "experiencia_job_bool": currentClose,
                                        "info_contacto_otro": other,
                                        "experiencia_job":companies_time,
                                        "info_nombre":fullName,
                                        "info_email":email,
                                        "info_telefono1": telefono_1,
                                        "info_telefono2":telefono_2,
                                        "opcion_contacto": currentContact,
                                        "horario_contacto":currentSchedule,
                                        'id_vacante': id,
                                        'audio': encrypted
                                    },
                                    'login': login,
                                    'live': live,
                                    'language': language,
                                    'pais': country
                                }
                            } else {
                                body = {
                                    'action': 'send_formulario_contacto',
                                    'data': {
                                        "info_ciudad": currentCity,
                                        "info_contacto": currentAboutUs,
                                        "experiencia_job_bool": currentClose,
                                        "experiencia_job": companies_time,
                                        "info_contacto_otro": other,
                                        'nivel_ingles': '',
                                        'nivel_espanol': '',
                                        "programas_computadora": programs,
                                        "info_nombre": fullName,
                                        "info_email": email,
                                        "info_telefono1": telefono_1,
                                        "info_telefono2": telefono_2,
                                        "opcion_contacto": currentContact,
                                        "horario_contacto": currentSchedule,
                                        'id_vacante': id,
                                        'audio': encrypted
                                    },
                                    'login': login,
                                    'live': live,
                                    'language': language,
                                    'pais': country
                                }
                            }
                            
                            const request = await fetch(urlJobs, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(body)
                            });
                        
                            const {response, status} = await request.json();
                            if(status === 200){
                                cuenta = 0;
                                setSuccessVisibility(true)
                                setInitialState({...initialState, loading: false})
                                setTimeout(() => {
                                    setSuccessVisibility(false)
                                    navigation.navigate('VacantDetail')
                                }, 4500)
                            }
                        }catch(e){
                            console.log('algo pasó con el internet')
                        }
                    } else {
                        Alert.alert(
                            language === '1' ? 'Audio Inválida' : 'Invalid Audio',
                            language === '1' ? 'El audio debe ser minimo de 40 segundos' : 'The audio must be 40s minumum',
                            [
                                { text: 'OK'}
                            ]
                        )
                    }
                } else {
                    Alert.alert(
                        language === '1' ? 'Correo Inválido' : 'Invalid Email',
                        language === '1' ? 'El correo ingresado no es válido' : 'The email entered is invalid',
                        [
                            { text: 'OK'}
                        ]
                    )
                }
            } else {
                Alert.alert(
                    language === '1' ? 'Grabando Audio' : 'Recording Audio',
                    language === '1' ? 'La grabación no ha sido detenida.' : 'The recording has not been stopped',
                    [
                        { text: 'OK'}
                    ]
                )
            }
        }
    }

    const handleValidateContactInfoMx = () => {
        if(fullName !== '' && email !== '' && telefono_1 !== '' && currentContactOption !== 0 && currentScheduleOption !== 0){
            handleSave(1)
        } else Alerta()
    }

    const handleValidateCompaniesMx = () => {
        if(companies_time !== '') handleValidateContactInfoMx()
        else Alerta()
    }

    const handleValidateLanguagesMx = () => {
        if(currentCloseOption !== 0 && currentCloseOption !== 1) handleValidateContactInfoMx()
        else {
            if(currentCloseOption === 1) handleValidateCompaniesMx()
            else Alerta()
        }
    }

    const handleValidateAboutMx = () => {
        if(currentAboutUsOption !== 0 && currentAboutUsOption !== 6 && currentLevelEnglish !== '' && currentLevelSpanish !== '' && currentProgramsOption !== 0) handleValidateLanguagesMx()
        else {
            if(currentAboutUsOption === 0) Alerta()
            else {
                if(other !== '') handleValidateLanguagesMx()
                else Alerta()
            }
        }
    }

    const handleValidateCompaniesUS = () => {
        if(currentCloseOption !== 0){
            if(currentCloseOption === 1) {
                if(companies_time !== ''){
                    handleSave(2)
                } else {
                    Alerta()
                }
            }
            else handleSave(2)
        } else Alerta()
    }

    const handleValidateAboutUs = () => {
        if(currentAboutUsOption !== 0 && currentAboutUsOption !== 5 && currentContactOption !== 0 && currentScheduleOption !== 0 && currentProgramsOption !== 0 && fullName !== '' && email !== '' && telefono_1 !== '') handleValidateCompaniesUS()
        else {
            if(currentAboutUsOption === 0 || currentContactOption === 0 || currentScheduleOption === 0 || programs === '' || fullName === '' || email === '' || telefono_1 === '') Alerta()
            else {
                if(other !== '') handleValidateCompaniesUS()
                else Alerta()
            }
        }
    }

    const handleValidate = () => {
        if(currentCityOption === 0 || currentCityOption === 1) handleValidateAboutMx()
        else handleValidateAboutUs()
    }

    const Alerta = () => {
        Alert.alert(
            language === '1' ? 'Campos Vacíos' : 'Empty Fields',
            language === '1' ? 'Revise y llene los campos faltantes' : 'Review and fill in the missing fields',
            [
                { text: 'OK'}
            ]
        )
    }

    return(
        <>
            {
                hasConnection
                ?
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
                        <HeaderPortrait title={language === '1' ? 'Formulario de Contacto' : 'Contact Form'} screenToGoBack={'VacantDetail'} navigation={navigation} visible={true} confirmation={true} currentLanguage={language} translateY={translateY}/>
                        <View style={tw`flex-1 justify-center items-center px-[${isIphone ? '5%' : '4%'}] bg-white`}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={tw`self-stretch`}
                                /* onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}} */
                            >
                                
                                <View style={tw`h-auto self-stretch mb-2 ios:mb-2.5 pb-[1.8%] mt-[1.5%]`}>
                                    <View style={tw`mt-[1.5%]`}/>
                                    <Title title={language === '1' ? 'Información Básica' : 'Basic Information'} tipo={1} icon={'child'} hasBottom={false}/>
                                    <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                    <View style={[styles.picker, tw`bg-[#f7f7f7]`]}>
                                        <View style={tw`flex-1 justify-center items-start ios:px-1 android:px-4`}>
                                            <Text style={tw`text-[#000] text-base`}>{currentCity}</Text>
                                        </View>
                                    </View>

                                    <Text style={titleStyle}>{language === '1' ? '¿Cómo te enteraste de nosotros?' : 'How did you find out about the job?'}</Text>
                                    <View style={[styles.picker, {paddingRight: currentAboutUsOption === 0 ? 10 : 0}]} >
                                        <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                            <Picker
                                                value={currentAboutUs}
                                                onValueChange={(itemValue, itemIndex) => handleActionDos(itemValue, itemIndex)}
                                                items={currentCityOption === 0 || currentCityOption === 1 ? optionsAboutMX : optionsAboutUS}
                                                placeholder={{}}
                                            />
                                        </View>
                                        {
                                            currentAboutUsOption === 0
                                            &&
                                                <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                    <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                </View>
                                        }
                                    </View>

                                    {
                                        (currentAboutUsOption === 6 || (currentAboutUsOption === 5 && currentCityOption === 2))
                                        &&
                                            <>
                                                <Input
                                                    value={other}
                                                    onChangeText={(e) => handleInputChange(e, 'other')}
                                                    placeholder={language === '1' ? 'Especifica' : 'Specify'}
                                                />
                                            </>
                                    }

                                    {
                                        currentCityOption === 0 || currentCityOption === 1
                                        ?
                                            <>
                                                <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de inglés conversacional?' : `What's your speaking English level?`}</Text>
                                                <View style={[styles.picker, {paddingRight: currentLevelOptionEnglish === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentLevelEnglish}
                                                            onValueChange={(itemValue, itemIndex) => handleActionSeis(itemValue, itemIndex)}
                                                            items={levels}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentLevelOptionEnglish === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>

                                                <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de inglés en escritura?' : `What's your writing English level?`}</Text>
                                                <View style={[styles.picker, {paddingRight: currentLevelOptionSpanish === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentLevelSpanish}
                                                            onValueChange={(itemValue, itemIndex) => handleActionSiete(itemValue, itemIndex)}
                                                            items={levels}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentLevelOptionSpanish === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>

                                                <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de computación?' : `What's your computer skills level?`}</Text>
                                                <View style={[styles.picker, {paddingRight: currentProgramsOption === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={programs}
                                                            onValueChange={(itemValue, itemIndex) => handleActionOcho(itemValue, itemIndex)}
                                                            items={levels}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentProgramsOption === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>

                                                <Text style={titleStyle}>{language === '1' ? '¿Tienes experiencia en empleos bilingües?' : '¿Do you have experience in bilingual jobs?'}</Text>
                                                <View style={[styles.picker, {paddingRight: currentCloseOption === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentClose}
                                                            onValueChange={(itemValue, itemIndex) => handleActionTres(itemValue, itemIndex)}
                                                            items={closeOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentCloseOption === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>
                                                {
                                                    currentCloseOption === 1
                                                    &&
                                                        <>
                                                            <Text style={titleStyle}>{language === '1' ? '¿En qué empresas y por cuánto tiempo?' : 'In which companies and for how long?'}</Text>
                                                            <MultiText
                                                                required={true}
                                                                value={companies_time}
                                                                onChangeText={(e) => handleInputChange(e, 'companies_time')}
                                                                placeholder={language === '1' ? 'Especifica las empresas y el tiempo...' : 'Specify companies and time...'}
                                                                multiline={true}
                                                                numberOfLines={5}
                                                                onSubmitEditing={() => full_name.current.focus()}
                                                            />
                                                        </>
                                                }
                                                
                                                <Title title={language === '1' ? 'Información de Contacto' : 'Contact Information'} tipo={1} icon={'child'} hasBottom={true}/>
                                                <Text style={titleStyle}>{language === '1' ? 'Nombre completo' : `Full name`}</Text>
                                                <Input
                                                    value={fullName}
                                                    autoCapitalize={'words'}
                                                    onChangeText={(e) => handleInputChange(e, 'fullName')}
                                                    placeholder={language === '1' ? 'Especifica tu nombre completo' : 'Specify your full name'}
                                                    ref={full_name}
                                                    onSubmitEditing={() => correo.current.focus()}
                                                />
                                                
                                                <Text style={titleStyle}>{language === '1' ? 'Email' : `E-mail`}</Text>
                                                <Input 
                                                    keyboardType={'email-address'}
                                                    autoCapitalize={'none'}
                                                    value={email}
                                                    onChangeText={(e) => handleInputChange(e, 'email')}
                                                    placeholder={'example@gmail.com'}
                                                    ref={correo}
                                                    onSubmitEditing={() => phone_1.current.focus()}
                                                />

                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono 1' : `Phone number 1`}</Text>
                                                <Input 
                                                    keyboardType={'numeric'}
                                                    value={telefono_1}
                                                    onChangeText={(e) => handleInputChange(e, 'telefono_1')}
                                                    placeholder={language === '1' ? 'Especifica tu número de teléfono' : 'Specify your phone number'}
                                                    ref={phone_1}
                                                    onSubmitEditing={() => phone_2.current.focus()}
                                                />
                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono 2 (opcional)' : `Phone number 2 (optional)`}</Text>
                                                <Input
                                                    keyboardType={'numeric'}
                                                    optional={true}
                                                    value={telefono_2}
                                                    onChangeText={(e) => handleInputChange(e, 'telefono_2')}
                                                    placeholder={language === '1' ? 'Especifica tu número de teléfono (opcional)' : 'Specify your phone number (optional)'}
                                                    ref={phone_2}
                                                />
                                                <Text style={titleStyle}>{language === '1' ? '¿Cómo prefieres que te contactemos?' : 'How do you prefer to be contacted?'}</Text>
                                                <View style={[styles.picker, {paddingRight: currentContactOption === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentContact}
                                                            onValueChange={(itemValue, itemIndex) => handleActionCuatro(itemValue, itemIndex)}
                                                            items={contactOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentContactOption === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>
                                                <Text style={titleStyle}>{language === '1' ? '¿En qué horario podemos contactarte?' : 'At what time can we reach you?'}</Text>
                                                <View style={[styles.picker, {paddingRight: currentScheduleOption === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentSchedule}
                                                            onValueChange={(itemValue, itemIndex) => handleActionCinco(itemValue, itemIndex)}
                                                            items={scheduleOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentScheduleOption === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>
                                            </>
                                        :
                                            <>
                                                <Text style={titleStyle}>{language === '1' ? '¿Tienes experiencia en Call Center o empleos de Atención a Clientes?' : 'Do you have experience in Call Center or Customer Service jobs?'}</Text>
                                                <View style={[styles.picker, {paddingRight: currentCloseOption === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentClose}
                                                            onValueChange={(itemValue, itemIndex) => handleActionTres(itemValue, itemIndex)}
                                                            items={closeOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentCloseOption === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>
                                                {
                                                    currentCloseOption === 1
                                                    &&
                                                        <>
                                                            <Text style={titleStyle}>{language === '1' ? '¿En qué empresas y por cuánto tiempo?' : 'In which companies and for how long?'}</Text>
                                                            <MultiText
                                                                required={true}
                                                                value={companies_time}
                                                                onChangeText={(e) => handleInputChange(e, 'companies_time')}
                                                                placeholder={language === '1' ? 'Especifica las empresas y el tiempo...' : 'Specify companies and time...'}
                                                                multiline={true}
                                                                numberOfLines={5}
                                                                /* ref={input_empresas} */
                                                            />
                                                        </>
                                                }
                                                {
                                                    currentCloseOption === 1
                                                    &&
                                                        <View style={tw`h-2.5 self-stretch`} />
                                                }
                                                {/* <Text style={titleStyle}>{language === '1' ? 'Nivel de Inglés' : 'English profiency'}</Text>
                                                <View style={[styles.picker]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentLevelEnglish}
                                                            onValueChange={(itemValue, itemIndex) => handleActionSeis(itemValue, itemIndex)}
                                                            items={levels}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentLevelOptionEnglish === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>
                                                <Text style={titleStyle}>{language === '1' ? 'Nivel de Español' : 'Spanish profiency'}</Text>
                                                <View style={[styles.picker]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentLevelSpanish}
                                                            onValueChange={(itemValue, itemIndex) => handleActionSiete(itemValue, itemIndex)}
                                                            items={levels}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentLevelOptionSpanish === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View> */}

                                                <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de computación?' : `What's your computer skills level?`}</Text>
                                                <View style={[styles.picker, {paddingRight: currentProgramsOption === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={programs}
                                                            onValueChange={(itemValue, itemIndex) => handleActionOcho(itemValue, itemIndex)}
                                                            items={levels}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentProgramsOption === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>

                                                <Title title={language === '1' ? 'Información de Contacto' : 'Contact Information'} tipo={1} icon={'child'} hasBottom={false}/>
                                                <Text style={titleStyle}>{language === '1' ? 'Nombre completo' : `Full name`}</Text>
                                                <Input
                                                    value={fullName}
                                                    autoCapitalize={'words'}
                                                    onChangeText={(e) => handleInputChange(e, 'fullName')}
                                                    placeholder={language === '1' ? 'Especifica tu nombre completo' : 'Specify your full name'}
                                                    ref={full_name}
                                                    onSubmitEditing={() => correo.current.focus()}
                                                />
                                                
                                                <Text style={titleStyle}>{language === '1' ? 'Email' : `E-mail`}</Text>
                                                <Input 
                                                    keyboardType={'email-address'}
                                                    autoCapitalize={'none'}
                                                    value={email}
                                                    onChangeText={(e) => handleInputChange(e, 'email')}
                                                    placeholder={'example@gmail.com'}
                                                    ref={correo}
                                                    onSubmitEditing={() => phone_1.current.focus()}
                                                />

                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono 1' : `Phone number 1`}</Text>
                                                <Input 
                                                    keyboardType={'numeric'}
                                                    value={telefono_1}
                                                    onChangeText={(e) => handleInputChange(e, 'telefono_1')}
                                                    placeholder={language === '1' ? 'Especifica tu número de teléfono' : 'Specify your phone number'}
                                                    ref={phone_1}
                                                    onSubmitEditing={() => phone_2.current.focus()}
                                                />
                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono 2 (opcional)' : `Phone number 2 (optional)`}</Text>
                                                <Input
                                                    keyboardType={'numeric'}
                                                    optional={true}
                                                    value={telefono_2}
                                                    onChangeText={(e) => handleInputChange(e, 'telefono_2')}
                                                    placeholder={language === '1' ? 'Especifica tu número de teléfono (opcional)' : 'Specify your phone number (optional)'}
                                                    ref={phone_2}
                                                />
                                                <Text style={titleStyle}>{language === '1' ? '¿Cómo prefieres que te contactemos?' : 'How do you prefer to be contacted?'}</Text>
                                                <View style={[styles.picker, {paddingRight: currentContactOption === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentContact}
                                                            onValueChange={(itemValue, itemIndex) => handleActionCuatro(itemValue, itemIndex)}
                                                            items={contactOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentContactOption === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>
                                                <Text style={titleStyle}>{language === '1' ? '¿En qué horario podemos contactarte?' : 'At what time can we reach you?'}</Text>
                                                <View style={[styles.picker, {paddingRight: currentScheduleOption === 0 ? 10 : 0}]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentSchedule}
                                                            onValueChange={(itemValue, itemIndex) => handleActionCinco(itemValue, itemIndex)}
                                                            items={scheduleOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentScheduleOption === 0
                                                        &&
                                                            <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                                                <IonIcons name='asterisk' color={'#DC3644'} size={7}/>
                                                            </View>
                                                    }
                                                </View>

                                            </>
                                    }

                                    <Text style={titleStyle}>{language === '1' ? '¿Por qué quieres trabajar en Telat?' : 'Why do you want to work in Telat?'}</Text>
                                    <Text style={[titleStyle, tw`text-black`]}>{language === '1' ? `Registra tu respuesta en inglés entre 40s y 1min` : `Record your answer in English between 40s and 1min`}</Text>
                                    <View style={boxStyle}>
                                        <View style={tw`h-auto self-stretch mb-2.5`}>
                                            <View style={tw`h-auto self-stretch p-1.5 justify-center items-center flex-row`}>
                                                {
                                                    isRecording === '2'
                                                    &&
                                                        <Animatable.View
                                                            duration={1500}
                                                            animation={'flash'}
                                                            iterationCount={'infinite'}
                                                            style={tw`w-3 h-3 rounded-3xl bg-[#D80505] mr-3`}
                                                        />
                                                }
                                                <Text style={tw`text-base text-[${Blue}]`}>{language === '1' ? isRecording === '3' ? 'Audio grabado' : isRecording === '2' ? 'Grabando audio...' : 'Grabar audio' : isRecording === '3' ? 'Recorded audio' : isRecording === '2' ? 'Recording audio...' : 'Record audio'}</Text>
                                            </View>
                                            <View style={tw`flex-row mt-1.5`}>
                                                <View style={tw`w-12.5 h-12.5 rounded-full justify-center items-center`}>
                                                    <IonIcons name={isRecording ? 'stop' : 'microphone'} size={32} color={'transparent'} />
                                                </View>
                                                <View style={tw`flex-1 self-stretch justify-center items-center pr-1.5`}>
                                                    <View style={tw`flex-1 flex-row self-stretch justify-center items-center`}>
                                                        <Text style={tw`text-xl font-bold text-black`}>{recordTime}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    isRecording !== '3'
                                                    ?
                                                        <TouchableWithoutFeedback
                                                            onPress={() => handleIsRecording()}
                                                            onLongPress={() => Alert.alert(
                                                                language === '1' ? 'Advertencia' : 'Warning',
                                                                language === '1' ? 'Para grabar solo presione una vez el botón' : 'To record just press the button once',
                                                                [
                                                                    { text: 'OK'}
                                                                ]
                                                            )}> 
                                                            {
                                                                isRecording === '1'
                                                                ?
                                                                    <View style={tw`w-15 h-15 bg-[${Blue}] rounded-full justify-center items-center shadow-md`}>
                                                                        <IonIcons name={'microphone'} size={32} color={'white'} />
                                                                    </View>
                                                                :
                                                                    <View
                                                                        style={tw`w-15 h-15 bg-[${Blue}] rounded-full justify-center items-center shadow-md`}>
                                                                        <IonIcons name={'stop'} size={32} color={'white'} />
                                                                    </View>
                                                            }
                                                        </TouchableWithoutFeedback>
                                                    :
                                                        <View style={tw`w-15 h-15 bg-[${Blue}] rounded-full justify-center items-center shadow-md`}>
                                                            <IonIcons name={'check'} size={32} color={'white'} />
                                                        </View>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    
                                    <TouchableWithoutFeedback onPress={() => handleValidate()}>
                                        <View style={tw`bg-[${Blue}] h-11 justify-center items-center rounded-3xl self-stretch flex-row mb-${isIphone ? 1.5 : 'px'} shadow-md mt-2`}>
                                            <Icon name={'paper-plane'} size={18} color={'#fff'}/>
                                            <Text style={tw`text-white font-bold text-lg ml-2.5`}>{language === '1' ? 'Envíar' : 'Send'}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </ScrollView>
                        </View>
                    </>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                        <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                    </>
            }
            
            <Modal orientation={orientationInfo.initial} visibility={successVisibility} handleDismiss={() => setSuccessVisibility(!successVisibility)}>
                <View style={tw`justify-center items-center self-stretch h-auto mt-3`}>
                    <Image
                        style={tw`w-25 h-25`}
                        resizeMode='stretch'
                        source={require('../../../../assets/correct.gif')}
                    />
                </View>
                <View style={tw`h-auto justify-center items-center p-4`}>
                    <Text style={tw`font-bold text-xl text-center text-black`}>{language === '1' ? '¡Gracias por tu interés en Telat!' : 'Thank you for your interest in Telat!'}</Text>
                    <Text style={tw`text-base text-center text-black mt-2`}>{language === '1' ? 'Pronto nos pondremos en contacto contigo para darle seguimiento a tu aplicación.' : `We'll contact you soon to follow up your application.`}</Text>
                </View>
            </Modal>
            <ModalLoading visibility={loading}/>
        </>
    )
}

const titleStyle = tw`text-sm text-[${Blue}] mb-1.5`
const pickerStyle = tw`justify-center border border-[#CBCBCB] mb-2.5 h-12.5 rounded-3xl px-${isIphone ? '2.5' : 'px'} w-[99%] flex-row`
const boxStyle = tw`h-auto justify-center items-center border border-[#CBCBCB] bg-white p-2.5 self-stretch rounded`

const styles = StyleSheet.create({
    picker: {
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#CBCBCB',
        marginBottom: 10,
        height: 45,
        paddingHorizontal: isIphone ? 10 : 1,
        width: '100%',
        flexDirection: 'row',
        paddingRight: 10,
        borderRadius: 4,
    }
})