import React, {useRef, useState, useEffect} from 'react'
import {View, Text, ScrollView, TouchableWithoutFeedback, PermissionsAndroid, Platform, Image, Alert, BackHandler, SafeAreaView, StatusBar} from 'react-native'
import {useConnection, useOrientation, useNavigation, useForm, useScroll} from '../../../hooks'
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp'
import {HeaderPortrait, HeaderLandscape, Input, Modal, MultiText, ModalLoading, FailedNetwork, Title} from '../../../components'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Picker from 'react-native-picker-select';
import {isIphone, live, login, urlJobs} from '../../../access/requestedData';
import RNFetchBlob from 'rn-fetch-blob'
import {request, PERMISSIONS} from 'react-native-permissions';
import tw from 'twrnc'

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
let encrypted = null;
let filePath = null

export default ({navigation, route: {params: {orientation}}}) => {
    const language = '2';
    const input_speaking = useRef()
    const input_writing = useRef()
    const input_empresas = useRef()
    const input_nombre = useRef()
    const input_email = useRef()
    const input_telefono_1 = useRef()
    const input_telefono_2 = useRef()
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
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
    const [recording, setRecording] = useState(initialization)
    const [enabled, setEnabled] = useState(true)
    const [contador, setContador] = useState(0)
    const [change, setChange] = useState(false)
    const [path, setPath] = useState('')
    const {recordTime, playTime, progress} = recording

    const {handleInputChange, values, handleSetState, handleSubmitForm} = useForm({
        currentCity: 'CDMX',
        currentOption: 'OCC Mundial',
        speakingLevel: '',
        writingLevel: '',
        currentCloseOption: language === '1' ? 'Sí' : 'Yes',
        companies_time: '',
        fullName: '',
        email: '',
        telefono_1: '',
        telefono_2: '',
        currentContactOption: language === '1' ? 'Llamada' : 'Phone call',
        currentScheduleOption: '8:00a.m. -11:00a.m.',
    })

    const [initialState, setInitialState] = useState({
        loading: false,
        cityOptions: [
            {value: 'CDMX', label: 'CDMX'},
            {value: 'Juárez', label: 'Juárez'},
        ],
        optionsCDMX_1: [
            {value: 'OCC Mundial', label: 'OCC Mundial'},
            {value: 'Indeed', label: 'Indeed'},
            {value: 'Facebook', label: 'Facebook'},
            {value: language === '1' ? 'Referido' : 'Referral', label: language === '1' ? 'Referido' : 'Referral'},
            {value: language === '1' ? 'Trabajé antes en Telat' : 'I previously worked in Telat', label: language === '1' ? 'Trabajé antes en Telat' : 'I previously worked in Telat'},
        ],
        optionsJuarez_1: [
            {value: 'Facebook', label: 'Facebook'},
            {value: 'Indeed', label: 'Indeed'},
            {value: 'Empleos Maquila', label: 'Empleos Maquila'},
            {value: 'Computrabajo', label: 'Computrabajo'},
            {value: 'OCC Mundial', label: 'OCC Mundial'},
            {value: language === '1' ? 'Bolsa de Empleo UACJ' : 'UACJ Job Board', label: language === '1' ? 'Bolsa de Empleo UACJ' : 'UACJ Job Board'},
            {value: language === '1' ? 'Referido' : 'Referral', label: language === '1' ? 'Referido' : 'Referral'},
            {value: language === '1' ? 'Trabajé antes en Telat' : 'I previously worked in Telat', label: language === '1' ? 'Trabajé antes en Telat' : 'I previously worked in Telat'},
        ],
        closeOptions: [
            {value: language === '1' ? 'Sí' : 'Yes', label: language === '1' ? 'Sí' : 'Yes'},
            {value: 'No', label: 'No'},
        ],

        contactOptions: [
            {value: language === '1' ? 'Llamada' : 'Phone call', label: language === '1' ? 'Llamada' : 'Phone call'},
            {value: 'WhatsApp', label: 'WhatsApp'},
            {value: language === '1' ? 'Email' : 'E-mail', label: language === '1' ? 'Email' : 'E-mail'},
        ],
        scheduleOptions: [
            {value: '8:00a.m. -11:00a.m.', label: '8:00a.m. - 11:00a.m.'},
            {value: '11:00a.m. -1:00p.m.', label: '11:00a.m. - 1:00p.m.'},
            {value: '1:00p.m. -4:00p.m.', label: '1:00p.m. - 4:00p.m.'},
        ],
        isRecording: '1',
        isPlaying: '1',
    })

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
                {text: language === '1' ? 'Sí, estoy seguro' : 'Yes, I am sure', onPress: () => navigation.navigate('VacantDetail')}
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
        console.log('entra')
        handlePath('VacantDetail')
        setRecording(initialization)
        setInitialState({...initialState, isRecording: '1', isPlaying: '1'})
        const result = await audioRecorderPlayer.stopRecorder();
        setPath(result) 
        audioRecorderPlayer.removeRecordBackListener();
    }

    useEffect(() => {
        onLoad()
    },[])

    useEffect(() => {
        requestPermissions()
    }, [])

    const {cityOptions, optionsCDMX_1, optionsJuarez_1, closeOptions, contactOptions, scheduleOptions, isRecording, isPlaying, loading} = initialState
    
    const handleActionUno = (value, label) => {
        handleSetState({...values, currentCity: value, currentOption: value === 'CDMX' ? 'OCC Mundial' : 'Facebook'})
    }

    const handleActionDos = (value, label) => {
        handleSetState({...values, currentOption: value})
    }
    
    const handleActionTres = (value, label) => {
        handleSetState({...values, currentCloseOption: value, companies_time: value === 'No' ? '' : values.companies_time})
    }

    const handleActionCuatro = (value, label) => {
        handleSetState({...values, currentContactOption: value})
    }

    const handleActionCinco = (value, label) => {
        handleSetState({...values, currentScheduleOption: value})
    }

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
                if(!isIphone){
                    minutos = parseInt(split[0])
                    segundos = parseInt(split[1])
                    milisegundos = parseInt(split[2])
                    total = ((minutos * 6000) + (segundos * 100) + milisegundos)
                    if(minutos === 1) {
                        onStopRecord(2)
                    }
                    return;
                }
                else{
                    minutos = parseInt(split[0])
                    segundos = parseInt(split[1])
                    milisegundos = parseInt(split[2])
                    total = ((minutos * 6000) + (segundos * 100) + milisegundos)
                    if(segundos === 50) {
                        onStopRecord(2)
                    }
                    return;
                }
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
                if(isIphone){
                    setRecording({...recording, recordSecs: 0, recordTime: '00:50:00'})
                    setInitialState({...initialState, isRecording: '3'})
                }
                else {
                    setRecording({...recording, recordSecs: 0, recordTime: '01:00:00'})
                    setInitialState({...initialState, isRecording: '3'})
                }
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

    const handleValidate = async () => {
        // fileUri is a string like 'file:///var/mobile/Containers/Data/Application/9B754FAA-2588-4FEC-B0F7-6D890B7B4681/Documents/filename'
    
        if (Platform.OS === 'ios') {
            let arr = path.split('/')
            const dirs = RNFetchBlob.fs.dirs
            filePath = `/var/mobile/Containers/Data/Application/${arr[8]}/Library/Caches/sound.m4a`
        } else {
            filePath = path
        }
        encrypted = await RNFetchBlob.fs.readFile(filePath, 'base64')
        let parte_uno = encrypted.substring(0,(encrypted.length) / 2)
        let parte_dos = encrypted.substring(((encrypted.length) / 2), encrypted.length)
        if(isRecording === '3'){
            if(values.email.includes('@') && values.email.includes('.')){
                if(minutos === 1 || segundos >= 40){
                    setInitialState({...initialState, loading: true})
                        const body = {
                            'action': 'send_mail_info',
                            'data': {
                                'info_ciudad': values.currentCity,
                                'info_contacto': values.currentOption,
                                'nivel_conversacional': values.speakingLevel,
                                'nivel_escritura': values.writingLevel,
                                'experiencia_job_bool': values.currentCloseOption,
                                'experiencia_job': values.companies_time,
                                'info_nombre': values.fullName,
                                'info_email': values.email,
                                'info_telefono1': values.telefono_1,
                                'info_telefono2': values.telefono_2,
                                'opcion_contacto': values.currentContactOption,
                                'horario_contacto': values.currentScheduleOption,
                                'audio': encrypted
                            },
                            'login': login,
                            'live': live,
                            'language': language
                        }
                        
                        const request = await fetch(urlJobs, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(body)
                        });
                    
                        const {response} = await request.json();
                        if(response.status === 200){
                            setSuccessVisibility(true)
                            setInitialState({...initialState, loading: false})
                            setTimeout(() => {
                                setSuccessVisibility(false)
                                navigation.navigate('VacantDetail')
                            }, 4500)
                        }
                }
                else {
                    Alert.alert(
                        language === '1' ? 'Audio Inválida' : 'Invalid Audio',
                        language === '1' ? 'El audio debe ser minimo de 40 segundos' : 'The audio must be 40s minumum',
                        [
                            { text: 'OK'}
                        ]
                    )
                }
            }
            else {
                Alert.alert(
                    language === '1' ? 'Correo Inválido' : 'Invalid Email',
                    language === '1' ? 'El correo ingresado no es válido' : 'The email entered is invalid',
                    [
                        { text: 'OK'}
                    ]
                )
            }
        }
        else {
            Alert.alert(
                language === '1' ? 'Grabando Audio' : 'Recording Audio',
                language === '1' ? 'La grabación no ha sido detenida.' : 'The recording has not been stopped',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    const handleSave = () => {
        if(values.currentCloseOption === 'Yes'){
            if(values.speakingLevel !== '' && values.writingLevel !== '' && values.companies_time !== '' && values.fullName !== '' && values.email !== '' && values.telefono_1 !== ''){
                handleValidate()
            }
            else {
                Alert.alert(
                    language === '1' ? 'Campos Vacíos' : 'Empty Fields',
                    language === '1' ? 'No puede haber campos vacios' : 'Fill Empty Fields',
                    [
                        { text: 'OK'}
                    ]
                )
            }
        }
        else {
            if(values.speakingLevel !== '' && values.writingLevel !== '' && values.fullName !== '' && values.email !== '' && values.telefono_1 !== ''){
                handleValidate()
            }
            else {
                Alert.alert(
                    language === '1' ? 'Campos Vacíos' : 'Empty Fields',
                    language === '1' ? 'No puede haber campos vacios' : 'Fill Empty Fields',
                    [
                        { text: 'OK'}
                    ]
                )
            }
        }
    }

    return(
        <>
            {
                hasConnection
                ?
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <>
                            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
                            <HeaderPortrait title={language === '1' ? 'Formulario de Contacto' : 'Contact Form'} screenToGoBack={'VacantDetail'} navigation={navigation} visible={true} confirmation={true} currentLanguage={language} translateY={translateY}/>
                            <View style={tw`flex-1 justify-center items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={tw`self-stretch`}
                                    onScroll={handleScroll}
                                    contentContainerStyle={{paddingTop: paddingTop}}
                                >
                                    <View style={tw`h-auto self-stretch mt-[3%]`}>
                                        <Title title={language === '1' ? 'Información Básica' : 'Basic Information'} tipo={1} icon={'child'} hasBottom={false}/>
                                        <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                        <View style={[pickerStyle]}>
                                            <Picker
                                                value={values.currentCity}
                                                onValueChange={(itemValue, itemIndex) => handleActionUno(itemValue, itemIndex)}
                                                items={cityOptions}
                                                placeholder={{}}
                                            />
                                        </View>
                                        <Text style={titleStyle}>{language === '1' ? '¿Cómo te enteraste de nuestras vacantes?' : 'How did you find out about the job?'}</Text>
                                        <View style={[pickerStyle]} >
                                            <Picker
                                                value={values.currentOption}
                                                onValueChange={(itemValue, itemIndex) => handleActionDos(itemValue, itemIndex)}
                                                items={values.currentCity === 'CDMX' ? optionsCDMX_1 : optionsJuarez_1}
                                                placeholder={{}}
                                            />
                                        </View>
                                        <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de inglés conversacional?' : `What's your English speaking level?`}</Text>
                                        <Input
                                            value={values.speakingLevel}
                                            onChangeText={(e) => handleInputChange(e, 'speakingLevel')}
                                            placeholder={language === '1' ? 'Especifica tu nivel de inglés conversacional' : 'Specify your English speaking level'}
                                            ref={input_speaking}
                                            onSubmitEditing={() => input_writing.current.focus()}
                                        />
                                        <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de inglés en escritura?' : `What's your English writing level? `}</Text>
                                        {
                                            values.currentCloseOption !== 'No'
                                            ?
                                                <Input 
                                                    value={values.writingLevel}
                                                    onChangeText={(e) => handleInputChange(e, 'writingLevel')}
                                                    placeholder={language === '1' ? 'Especifica tu nivel de inglés en escritura' : 'Specify English writing level'}
                                                    ref={input_writing}
                                                    onSubmitEditing={() => input_empresas.current.focus()}
                                                />
                                            :
                                                <Input 
                                                    value={values.writingLevel}
                                                    onChangeText={(e) => handleInputChange(e, 'writingLevel')}
                                                    placeholder={language === '1' ? 'Especifica tu nivel de inglés en escritura' : 'Specify English writing level'}
                                                    ref={input_writing}
                                                    onSubmitEditing={() => input_nombre.current.focus()}
                                                />
                                        }
                                        <Text style={titleStyle}>{language === '1' ? '¿Tienes experiencia en empleos bilingües?' : '¿Do you have experience in bilingual jobs?'}</Text>
                                        <View style={[pickerStyle]} >
                                            <Picker
                                                value={values.currentCloseOption}
                                                onValueChange={(itemValue, itemIndex) => handleActionTres(itemValue, itemIndex)}
                                                items={closeOptions}
                                                placeholder={{}}
                                            />
                                        </View>
                                        {
                                            values.currentCloseOption !== 'No'
                                            &&
                                                <>
                                                    <Text style={titleStyle}>{language === '1' ? '¿En qué empresas y por cuánto tiempo?' : 'In what companies and for how long?'}</Text>
                                                    <MultiText
                                                        required={true}
                                                        value={values.companies_time}
                                                        onChangeText={(e) => handleInputChange(e, 'companies_time')}
                                                        placeholder={language === '1' ? 'Especifica las empresas y el tiempo...' : 'Specify companies and time...'}
                                                        multiline={true}
                                                        numberOfLines={5}
                                                        ref={input_empresas}
                                                    />
                                                    <View style={tw`mt-2.5`} />
                                                </>
                                        }
                                        <Title title={language === '1' ? 'Información de Contacto' : 'Contact Information'} tipo={1} icon={'address-card'}/>
                                        <Text style={titleStyle}>{language === '1' ? 'Nombre completo' : `Full name`}</Text>
                                        <Input
                                            value={values.fullName}
                                            onChangeText={(e) => handleInputChange(e, 'fullName')}
                                            placeholder={language === '1' ? 'Especifica tu nombre completo' : 'Specify your full name'}
                                            ref={input_nombre}
                                            onSubmitEditing={() => input_email.current.focus()}
                                        />
                                        <Text style={titleStyle}>{language === '1' ? 'Email' : `E-mail`}</Text>
                                        <Input 
                                            keyboardType={'email-address'}
                                            autoCapitalize={'none'}
                                            value={values.email}
                                            onChangeText={(e) => handleInputChange(e, 'email')}
                                            placeholder={language === '1' ? 'Especifica tu email' : 'Specify your e-mail'}
                                            ref={input_email}
                                            onSubmitEditing={() => input_telefono_1.current.focus()}
                                        />
                                        <Text style={titleStyle}>{language === '1' ? 'Teléfono 1' : `Phone number 1`}</Text>
                                        <Input 
                                            keyboardType={'numeric'}
                                            value={values.telefono_1}
                                            onChangeText={(e) => handleInputChange(e, 'telefono_1')}
                                            placeholder={language === '1' ? 'Especifica tu número de teléfono' : 'Specify your phone number'}
                                            ref={input_telefono_1}
                                            onSubmitEditing={() => input_telefono_2.current.focus()}
                                        />
                                        <Text style={titleStyle}>{language === '1' ? 'Teléfono 2 (opcional)' : `Phone number 2 (optional)`}</Text>
                                        <Input
                                            keyboardType={'numeric'}
                                            optional={true}
                                            value={values.telefono_2}
                                            onChangeText={(e) => handleInputChange(e, 'telefono_2')}
                                            placeholder={language === '1' ? 'Especifica tu número de teléfono (opcional)' : 'Specify your phone number (optional)'}
                                            ref={input_telefono_2}
                                        />
                                        <Text style={titleStyle}>{language === '1' ? '¿Cómo prefieres que te contactemos?' : 'How do you prefer to be contacted?'}</Text>
                                        <View style={[pickerStyle]} >
                                        <Picker
                                            value={values.currentContactOption}
                                            onValueChange={(itemValue, itemIndex) => handleActionCuatro(itemValue, itemIndex)}
                                            items={contactOptions}
                                            placeholder={{}}
                                        />
                                        </View>
                                        
                                        <Text style={titleStyle}>{language === '1' ? '¿En qué horario podemos contactarte?' : 'What time can we reach you?'}</Text>
                                        <View style={[pickerStyle]} >
                                            <Picker
                                                value={values.currentScheduleOption}
                                                onValueChange={(itemValue, itemIndex) => handleActionCinco(itemValue, itemIndex)}
                                                items={scheduleOptions}
                                                placeholder={{}}
                                            />
                                        </View>

                                        <Text style={titleStyle}>{language === '1' ? '¿Por qué quieres trabajar en Telat?' : 'Why do you want to work in Telat?'}</Text>
                                        <Text style={[titleStyle, tw`text-black`]}>{language === '1' ? `Registra tu respuesta en inglés entre 40's y 1min` : !isIphone ? `Record your answer in English between 40's and 1min.` : `Record your answer in English between 40's and 50's.`}</Text>
                                        <View style={boxStyle}>
                                            <View style={tw`h-auto self-stretch mb-2.5`}>
                                                <View style={tw`h-auto self-stretch p-1.5 justify-center items-center`}>
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
                                                                <View style={tw`w-15 h-15 bg-[${Blue}] rounded-full justify-center items-center shadow-md`}>
                                                                    <IonIcons name={isRecording === '1' ? 'microphone' : 'stop'} size={32} color={'white'} />
                                                                </View>
                                                            </TouchableWithoutFeedback>
                                                        :
                                                            <View style={tw`w-15 h-15 bg-[${Blue}] rounded-full justify-center items-center shadow-md`}>
                                                                <IonIcons name={'check'} size={32} color={'white'} />
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <TouchableWithoutFeedback onPress={() => handleSave()}>
                                            <View style={tw`flex-row h-11.5 justify-center items-center bg-[${Blue}] my-2.5 px-5 rounded-lg`} >
                                                <Icon name={'paper-plane'} size={18} color={'#fff'} />
                                                <Text style={tw`text-base text-white ml-2.5 font-bold`}>{language === '1' ? 'Envíar' : 'Send'}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <View style={tw`mb-[${isIphone ? '6%' : '1.5%'}]`} />
                                    </View>
                                </ScrollView>
                            </View>
                        </>
                    :
                        <>
                            <HeaderLandscape title={language === '1' ? 'Formulario de Contacto' : 'Contact Form'} screenToGoBack={'VacantDetail'} navigation={navigation} visible={true} confirmation={true} currentLanguage={language} translateY={translateY}/>
                            <View style={tw`flex-1 justify-center items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={tw`self-stretch`}
                                    onScroll={handleScroll}
                                    contentContainerStyle={{paddingTop: paddingTop}}
                                >
                                <View style={tw`h-auto self-stretch`}>
                                    <View style={tw`mt-[1.5%]`}></View>
                                    <Title title={language === '1' ? 'Información Básica' : 'Basic Information'} tipo={1} icon={'child'} hasBottom={false}/>
                                    <View style={tw`flex-row self-stretch items-center`}>
                                        <View style={tw`flex-1 mr-[3%]`}>
                                            <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                            <View style={[pickerStyle]} >
                                                <Picker
                                                    value={values.currentCity}
                                                    onValueChange={(itemValue, itemIndex) => handleActionUno(itemValue, itemIndex)}
                                                    items={cityOptions}
                                                    placeholder={{}}
                                                />
                                            </View>
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={titleStyle}>{language === '1' ? '¿Cómo te enteraste de nuestras vacantes?' : 'How did you find out about the job?'}</Text>
                                            <View style={[pickerStyle]} >
                                                <Picker
                                                    value={values.currentOption}
                                                    onValueChange={(itemValue, itemIndex) => handleActionDos(itemValue, itemIndex)}
                                                    items={values.currentCity === 'CDMX' ? optionsCDMX_1 : optionsJuarez_1}
                                                    placeholder={{}}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch items-center`}>
                                        <View style={tw`flex-1 mr-[3%]`}>
                                            <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de inglés conversacional?' : `What's your speaking English level?`}</Text>
                                            <Input 
                                                value={values.speakingLevel}
                                                onChangeText={(e) => handleInputChange(e, 'speakingLevel')}
                                                placeholder={language === '1' ? 'Especifica tu nivel de inglés conversacional' : 'Specify your speaking english level'}
                                                ref={input_speaking}
                                                onSubmitEditing={() => input_writing.current.focus()}
                                            />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de inglés en escritura?' : `What's your writing english level? `}</Text>
                                            {
                                                values.currentCloseOption !== 'No'
                                                ?
                                                    <Input 
                                                        value={values.writingLevel}
                                                        onChangeText={(e) => handleInputChange(e, 'writingLevel')}
                                                        placeholder={language === '1' ? 'Especifica tu nivel de inglés en escritura' : 'Specify writing english level'}
                                                        ref={input_writing}
                                                        onSubmitEditing={() => input_empresas.current.focus()}
                                                    />
                                                :
                                                    <Input 
                                                        value={values.writingLevel}
                                                        onChangeText={(e) => handleInputChange(e, 'writingLevel')}
                                                        placeholder={language === '1' ? 'Especifica tu nivel de inglés en escritura' : 'Specify writing english level'}
                                                        ref={input_writing}
                                                        onSubmitEditing={() => input_nombre.current.focus()}
                                                    />
                                            }
                                        </View>
                                    </View>
                                    <Text style={titleStyle}>{language === '1' ? '¿Tienes experiencia en empleos bilingües?' : '¿Do you have experience in bilingual jobs?'}</Text>
                                    <View style={[pickerStyle]} >
                                        <Picker
                                            value={values.currentCloseOption}
                                            onValueChange={(itemValue, itemIndex) => handleActionTres(itemValue, itemIndex)}
                                            items={closeOptions}
                                            placeholder={{}}
                                        />
                                    </View>
                                    {
                                        values.currentCloseOption !== 'No'
                                        &&
                                            <>
                                                <Text style={titleStyle}>{language === '1' ? '¿En qué empresas y por cuánto tiempo?' : 'In what companies and for how long?'}</Text>
                                                <MultiText
                                                    required={true}
                                                    value={values.companies_time}
                                                    onChangeText={(e) => handleInputChange(e, 'companies_time')}
                                                    placeholder={language === '1' ? 'Especifica las empresas y el tiempo...' : 'Specify companies and time...'}
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    ref={input_empresas}
                                                />
                                                <View style={tw`mt-2.5`} />
                                            </>
                                    }

                                    <Title title={language === '1' ? 'Información de Contacto' : 'Contact Information'} tipo={1} icon={'address-card'}/>
                                    
                                    <View style={tw`flex-row self-stretch items-center`}>
                                        <View style={tw`flex-1 mr-[3%]`}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nombre completo' : `Full name`}</Text>
                                            <Input
                                                value={values.fullName}
                                                onChangeText={(e) => handleInputChange(e, 'fullName')}
                                                placeholder={language === '1' ? 'Especifica tu nombre completo' : 'Specify your full name'}
                                                ref={input_nombre}
                                                onSubmitEditing={() => input_email.current.focus()}
                                            />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={titleStyle}>{language === '1' ? 'Email' : `E-mail`}</Text>
                                            <Input 
                                                keyboardType={'email-address'}
                                                autoCapitalize={'none'}
                                                value={values.email}
                                                onChangeText={(e) => handleInputChange(e, 'email')}
                                                placeholder={language === '1' ? 'Especifica tu email' : 'Specify your e-mail'}
                                                ref={input_email}
                                                onSubmitEditing={() => input_telefono_1.current.focus()}
                                            />
                                        </View>
                                    </View>
                                    
                                    <View style={tw`flex-row self-stretch items-center`}>
                                        <View style={tw`flex-1 mr-[3%]`}>
                                            <Text style={titleStyle}>{language === '1' ? 'Teléfono 1' : `Phone number 1`}</Text>
                                            <Input 
                                                keyboardType={'numeric'}
                                                value={values.telefono_1}
                                                onChangeText={(e) => handleInputChange(e, 'telefono_1')}
                                                placeholder={language === '1' ? 'Especifica tu número de teléfono' : 'Specify your phone number'}
                                                ref={input_telefono_1}
                                                onSubmitEditing={() => input_telefono_2.current.focus()}
                                            />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={titleStyle}>{language === '1' ? 'Teléfono 2 (opcional)' : `Phone number 2 (optional)`}</Text>
                                            <Input
                                                keyboardType={'numeric'}
                                                optional={true}
                                                value={values.telefono_2}
                                                onChangeText={(e) => handleInputChange(e, 'telefono_2')}
                                                placeholder={language === '1' ? 'Especifica tu número de teléfono (opcional)' : 'Specify your phone number (optional)'}
                                                ref={input_telefono_2}
                                            />
                                        </View>
                                    </View>
                                    
                                    <View style={tw`flex-row self-stretch items-center`}>
                                        <View style={tw`flex-1 mr-[3%]`}>
                                            <Text style={titleStyle}>{language === '1' ? '¿Cómo prefieres que te contactemos?' : 'How do you prefer to be contacted?'}</Text>
                                            <View style={[pickerStyle]} >
                                                <Picker
                                                    value={values.currentContactOption}
                                                    onValueChange={(itemValue, itemIndex) => handleActionCuatro(itemValue, itemIndex)}
                                                    items={contactOptions}
                                                    placeholder={{}}
                                                />
                                            </View>
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={titleStyle}>{language === '1' ? '¿En qué horario podemos contactarte?' : 'What time can we reach you?'}</Text>
                                            <View style={[pickerStyle]} >
                                                <Picker
                                                    value={values.currentScheduleOption}
                                                    onValueChange={(itemValue, itemIndex) => handleActionCinco(itemValue, itemIndex)}
                                                    items={scheduleOptions}
                                                    placeholder={{}}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    
                                    <Text style={titleStyle}>{language === '1' ? '¿Por qué quieres trabajar en Telat?' : 'Why do you want to work in Telat?'}</Text>
                                    <Text style={[titleStyle, tw`text-black`]}>{language === '1' ? `Registra tu respuesta en inglés entre 40's y 1min` : `Record your answer in English between 40's and 1min.`}</Text>
                                    <View style={boxStyle}>
                                        <View style={tw`h-auto self-stretch mb-2.5`}>
                                            <View style={tw`h-auto self-stretch p-1.5 justify-center items-center`}>
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
                                                            )}
                                                            style={tw`w-15 h-15 bg-[${Blue}] rounded-full justify-center items-center shadow-md`}
                                                        >
                                                            <IonIcons name={isRecording === '1' ? 'microphone' : 'stop'} size={32} color={'white'} />
                                                        </TouchableWithoutFeedback>
                                                    :
                                                        <View style={tw`w-15 h-15 bg-[${Blue}] rounded-full justify-center items-center shadow-md`}>
                                                            <IonIcons name={'check'} size={32} color={'white'} />
                                                        </View>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    
                                    <TouchableWithoutFeedback onPress={() => handleSave()}>
                                        <View style={tw`flex-row h-11.5 justify-center items-center mt-2.5 bg-[${Blue}] p-1.5 px-5 rounded-lg`}>
                                            <Icon name={'paper-plane'} size={18} color={'#fff'} />
                                            <Text style={tw`text-sm text-white ml-2.5 font-bold`}>{language === '1' ? 'Envíar' : 'Send'}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={tw`mb-[3%]`}/>
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
const pickerStyle = tw`justify-center border border-[#CBCBCB] mb-2.5 h-12.5 rounded-3xl px-${isIphone ? '2.5' : 'px'}`
const boxStyle = tw`h-auto justify-center items-center border border-[#CBCBCB] bg-white p-2.5 self-stretch rounded-3xl`