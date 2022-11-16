import React, {useCallback, useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, ImageBackground, StatusBar, SafeAreaView, Alert, BackHandler, TouchableWithoutFeedback} from 'react-native';
import {barStyle, barStyleBackground, Blue, Orange, SafeAreaBackground} from '../../colors/colorsApp'
import {useNavigation, useNotification, useOrientation} from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isIphone, live, login, urlApp, urlJobs, version} from '../../access/requestedData';
import messaging from '@react-native-firebase/messaging'
import PushNotification from "react-native-push-notification";
import * as Animatable from 'react-native-animatable';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modal, Title, UpdateAvailable, Sliders } from '../../components';
//import { useIsDrawerOpen } from '@react-navigation/drawer';
import { selectAccess, selectScreen, setAccess } from '../../slices/navigationSlice';
import { useDispatch, useSelector } from 'react-redux';
import {request, PERMISSIONS} from 'react-native-permissions';
import { selectVisibleSliders, setLanguageApp, setVisibleSliders } from '../../slices/varSlice';
import tw from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';

let key = 'Language'
let show = undefined
let cuenta = 0;
let Option = 'Option'
let data = '';

let notificationToken = 'notificationToken';
let valueNotificationToken = ''
let lastNotifyCand = 'lastNotifyCand';

let dataNotification = 'dataNotification'
let dataNotificationValue = ''
let optionExists = '';

let access = ''
let screen = ''
let visibleSliders = true;
let info_version = null;

export default ({navigation, route: {params: {orientation, language_}}}) => {
    const dispatch = useDispatch()
    screen = useSelector(selectScreen)
    access = useSelector(selectAccess)

    visibleSliders = useSelector(selectVisibleSliders)

    //let now = useIsDrawerOpen()
    let now = false
    const [language, setLanguage] = useState()
    const [isHide, setIsHide] = useState(true)
    const [vacantsUsa, setVacantsUsa] = useState(false)
    const [notificacion, setNotificacion] = useState(false)
    const [visibility, setVisibility] = useState(false)
    const [count, setCount] = useState(0)
    const [contador, setContador] = useState(0)

    const {handlePath} = useNavigation()

    useEffect(() => {
        getLanguage()
    },[])

    useFocusEffect(
        useCallback(() => {
            handlePath('Leave')
        }, [])
    );
    
    const getLanguage = async () => {
        let current = null;
        current = await AsyncStorage.getItem(key) || '1';
        dispatch(setLanguageApp(current))
        setLanguage(current)
    }

    const getOption = async () => {
        if(!now){
            optionExists = await AsyncStorage.getItem(Option) || undefined;
            if(optionExists){
                handlePressOption()
                await AsyncStorage.removeItem(Option)
            }
            setCount(0)
            setIsHide(true)
        }
    }

    useEffect(() => {
        return getOption
    },[now])

    const requestPermissions = async () => {
        try{
            const permiso = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
            if(permiso === 'granted' || permiso === 'unavailable'){
            }
            else {

            }
        }catch(err){
            console.warn(err)
            return;
        }
    }

    useEffect(() => {
        requestPermissions()
    }, [])

    useEffect(() => {
        const backAction = async () => {
            const temporal = screen.split('/')
            if(temporal.length === 1){
                if(screen === 'ChooseMemorama' || screen === 'ChoosePuzzle' || screen.includes('_')){
                    if(!screen.includes('_')){
                        Alert.alert('Saliendo del juego', '¿Seguro que deseas abandonar la partida?', 
                        [
                            {
                                text: language === '1' ? 'Cancelar' : 'Cancel',
                                onPress: () => null,
                                style: 'cancel'
                            },
                            { text: language === '1' ? 'Sí' : 'Yes', onPress: () => navigation.navigate(screen)}
                        ]);
                    } else {
                        const temporal = screen.split('_')
                        Alert.alert('Saliendo del juego', '¿Seguro que deseas abandonar la partida?', 
                        [
                            {
                                text: language === '1' ? 'Cancelar' : 'Cancel',
                                onPress: () => null,
                                style: 'cancel'
                            },
                            { text: language === '1' ? 'Sí' : 'Yes', onPress: () => navigation.navigate(temporal[0])}
                        ]);
                    }
                } else if(screen.includes('_')){
                    const temporal = screen.split('_')
                    navigation.navigate(temporal[0])
                }

                else if(screen === 'AuthLogin'){
                    Alert.alert(
                        language === '1' ? 'Cerrar Sesión' : 'Sign Out',
                        language === '1' ? '¿Seguro que deseas cerrar tu sesión?' : 'Are you sure you want to close the session?', 
                    [
                        {
                            text: 'Cancelar',
                            onPress: () => null,
                            style: 'cancel'
                        },
                        { text: language === '1' ? 'Sí' : 'Yes', onPress: () => navigation.navigate(screen)}
                    ]);
                }
                
                else if(screen === 'Leave'){
                    BackHandler.exitApp()
                }

                else {
                    if(access === '1') {
                        dispatch(setAccess('0'))
                        navigation.navigate(screen)
                    }
                    else {
                        BackHandler.exitApp()
                    }
                }
            } else {
                if(temporal[0] === 'Menu'){
                    Alert.alert('Saliendo del juego', '¿Seguro que deseas abandonar la partida?', 
                    [
                        {
                            text: language === '1' ? 'Cancelar' : 'Cancel',
                            onPress: () => null,
                            style: 'cancel'
                        },
                        { text: language === '1' ? 'Sí' : 'Yes', onPress: () => navigation.navigate(temporal[0])}
                    ]);
                } 
                
            }
        };
    
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
    
        return () => backHandler.remove();
    }, [contador, language]);

    const getToken = async() => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            data = null;
            data = await AsyncStorage.getItem(notificationToken) || '';
            if(!data){
                valueNotificationToken = await messaging().getToken();
                await AsyncStorage.setItem(notificationToken, valueNotificationToken);
            } else {
                valueNotificationToken = await AsyncStorage.getItem(notificationToken);
            }
        }
    }

    useEffect(() => {
        getToken()
    },[])

    useEffect(() => {
        createChannels()
    })

    const createChannels = () => {
        PushNotification.createChannel({
            channelId: "telat-channel",
            channelName: "Telat Channel",
            vibrate: true, // (optional) default: true
            vibration: 300,
        })
    }
    
    const handlePressOption = () => {
        optionExists = parseInt(optionExists)
        if(optionExists === 1){
            navigation.navigate('LoginGames', {language: language, orientation: orientationInfo.initial, usertype: 'INV'})
        }
        else if(optionExists === 2){
            navigation.navigate('Notifications', {language: language, orientation: orientationInfo.initial, origin: 2})
        }
        else{
            setIsHide(true)
            if(vacantsUsa) setVisibility(!visibility)
            else navigation.navigate('Register', {language: language, orientation: orientationInfo.initial, country: 'MX'})
        }
    }

    const handleNotification = async () => {
        dataNotificationValue = await AsyncStorage.getItem(dataNotification);
        dataNotificationValue = JSON.parse(dataNotificationValue)
        if(dataNotificationValue){
            const title = dataNotificationValue.notification.title
            const body = dataNotificationValue.notification.body
            PushNotification.localNotification({
                channelId: 'telat-channel',
                title: title,
                message: body,
                largeIcon: ""
            })
        }
    }

    const {arrived} = useNotification()

    
    useEffect(() => {
        handleNotification()
    },[arrived])
    
    const handleLanguage = async (language) => {
        data = null;
        if(language === '2') {
            setLanguage('1')
        }
        else {
            setLanguage('2')
        }
        data = await AsyncStorage.getItem(key) || '';
        if(data) {
            await AsyncStorage.removeItem(key).then( () => AsyncStorage.setItem(key, language === '1' ? '2' : '1'));
        }
        else {
            data = await AsyncStorage.setItem(key, language === '1' ? '2' : '1');
        }
    }
    
    const orientationInfo = {
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    };

    /* const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    }); */
    
    const getVersion = async () => {
        try{
            const body = {
                'action': 'get_version',
                'login': login,
                'live': live,
                'data': {
                    'device': !isIphone ? 1 : 2,
                    'version': version
                }
            }
    
            const request = await fetch(urlJobs, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            
            const {response} = await request.json();
            show = response.show
            info_version = response.info
            cuenta = cuenta + 1
        }catch(e){
            console.log('algo pasó con el internet')
            cuenta = 0;
        }
    }

    const getNotification = async () => {
        try{
            const body = {
                "login": login,
                "action": "get_notificacion_cand",
                "live": live,
                "data": valueNotificationToken
            }
    
            const request = await fetch(urlApp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            
            const {response} = await request.json();
            if(response.status === 200){
                setVacantsUsa(response.vacantes_usa)
                let notify = await AsyncStorage.getItem(lastNotifyCand) || undefined;
                if(String(notify) === String(response.info.id)) setNotificacion(false)
                else {
                    if(response.info.lenght > 0){
                        setNotificacion(false)
                    } else {
                        setNotificacion(true)
                    }
                }
            }
        }catch(e){
            console.log('algo pasó con el internet asdasd')
        }
    }

    useEffect(() =>  {
        return getVersion
    },[])

    useEffect(() =>  {
        return getNotification
    },[contador, arrived, valueNotificationToken])

    const handleSliders = () => dispatch(setVisibleSliders(false))
    
    return (
        <>
            {
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground}} />
                        <View style={tw`flex-1 bg-[#fff] self-stretch`}>
                            {
                                !visibleSliders
                                ?
                                    <ImageBackground source={require('../../../assets/background/fondo.jpg')} style={tw`w-[100%] h-[100%]`}>
                                        <View style={tw`h-25 self-stretch flex-row justify-center items-end px-7.5`}>
                                            <View style={tw`h-[100%] flex-1 justify-center`}>
                                                <IonIcons name={'arrow-left'} size={35} color='transparent' />
                                            </View>
                                            <TouchableOpacity 
                                                style={tw`h-[100%] flex-1 justify-center items-end`}
                                                onPress={() => navigation.navigate('Notifications', {language, orientation: orientationInfo.initial, origin: 2})}>
                                                <IonIcons name={'bell'} size={35} color='#000' />
                                                {
                                                    notificacion
                                                    &&
                                                        <View style={tw`w-4 h-4 rounded-3xl bg-[#FF3333] absolute top-9 right-0 border border-[#fff] justify-center items-center`} />
                                                }
                                            </TouchableOpacity>
                                        </View>
                                        <View style={tw`h-31 self-stretch justify-center items-center mt-12.5`}>
                                            <Image
                                                resizeMode='contain'
                                                style={tw`w-25 h-25`}
                                                source={require('../../../assets/logo_telat.png')}
                                            />
                                        </View>
                                        <View 
                                            style={tw`h-25 self-stretch justify-center items-center`}>
                                            <Text style={tw`text-2xl font-bold text-[#383838]`}>{language === '1' ? '¡Bienvenido!' : 'Welcome!'}</Text>
                                        </View>
                                        <View 
                                            style={tw`flex-1 self-stretch justify-start items-center`}>
                                            <View style={tw`h-auto self-stretch justify-center items-center rounded-3xl`}>
                                                <View style={tw`w-75 h-auto p-2.5 rounded-3xl`}>
                                                    <TouchableWithoutFeedback 
                                                        onPress={() => {
                                                            setIsHide(true)
                                                            navigation.navigate('Login', {language: language, orientation: orientationInfo.initial})
                                                        }}
                                                    >
                                                        <View style={tw`shadow-xl h-12.5 self-stretch bg-[${Blue}] justify-center items-center rounded-3xl mb-4`}>
                                                            <Text style={tw`text-lg text-white font-bold text-center`}>{language === '1' ? 'Usuarios' : 'Users'}</Text>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                    <TouchableWithoutFeedback 
                                                        onPress={() => {
                                                            setIsHide(true)
                                                            navigation.navigate('Vacants', {language: String(language), orientation: orientationInfo.initial, valueNotificationToken: valueNotificationToken})
                                                        }}
                                                    >
                                                        <View style={tw`shadow-xl h-12.5 self-stretch bg-[${Orange}] justify-center items-center rounded-3xl mb-4`}>
                                                            <Text style={tw`text-lg text-white font-bold text-center`}>{language === '1' ? 'Bolsa de Empleo' : 'Careers'}</Text>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </View>
                                        </View>
                                        <View
                                            style={tw`h-auto self-stretch justify-end items-end px-2 pb-6`}>
                                            <View style={tw`h-auto flex-row self-stretch justify-end items-end px-2 shadow-xl`}>
                                                {
                                                    !isHide
                                                    ?
                                                        count > 0
                                                        ?
                                                            <Animatable.View
                                                                style={tw`h-16 w-auto justify-center items-center bg-[${Blue}] rounded-tl-10 rounded-bl-10 rounded-br-none rounded-tr-none px-4 border-r border-r-white shadow-xl`}
                                                                animation='bounceIn'
                                                                duration={500}
                                                            >
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        if(vacantsUsa) setVisibility(!visibility)
                                                                        else {
                                                                            setCount(0)
                                                                            setIsHide(!isHide)
                                                                            navigation.navigate('Register', {language: language, orientation: orientationInfo.initial, country: 'MX'})
                                                                        }
                                                                    }}
                                                                    style={tw`flex-1 h-16 self-stretch justify-center items-center`}
                                                                >
                                                                    <Text style={tw`text-lg ml-2 text-white font-bold text-center`}>{language === '1' ? 'Solicitud de Empleo' : 'Application for Employment'}</Text>
                                                                </TouchableOpacity>
                                                            </Animatable.View>
                                                        :
                                                            <></>
                                                    :
                                                        count > 0
                                                        ?
                                                            <Animatable.View
                                                                style={tw`h-16 w-auto justify-center items-center bg-[${Blue}] rounded-tl-10 rounded-bl-10 rounded-br-none rounded-tr-none px-4 border-r border-r-white shadow-xl`}
                                                                animation='bounceOut'
                                                                duration={300}
                                                            >
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        if(vacantsUsa) setVisibility(!visibility)
                                                                        else {
                                                                            setCount(0)
                                                                            setIsHide(!isHide)
                                                                            navigation.navigate('Register', {language: language, orientation: orientationInfo.initial, country: 'MX'})
                                                                        }
                                                                    }}
                                                                    style={tw`flex-1 h-16 self-stretch justify-center items-center`}
                                                                >
                                                                    <Text style={tw`text-lg ml-2 text-white font-bold text-center`}>{language === '1' ? 'Solicitud de Empleo' : 'Application for Employment'}</Text>
                                                                </TouchableOpacity>
                                                            </Animatable.View>
                                                        :
                                                            <></>
                                                }
                                                <TouchableOpacity 
                                                    onPress={() => { 
                                                        setIsHide(!isHide)
                                                        setCount(count + 1)
                                                    } }
                                                    style={tw`p-2 w-16 h-16 bg-[${Blue}] justify-center items-center rounded-tl-${isHide ? '10' : 'none'} rounded-bl-${isHide ? '10' : 'none'} rounded-tr-10 rounded-br-10 shadow-xl`}
                                                >
                                                    <IonIcons name={'file-document-edit-outline'} size={40} color='white' />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View
                                            style={tw`h-12.5 py-1.5 self-stretch justify-center items-${isIphone ? 'start' : 'center'} flex-row`}>
                                            <TouchableOpacity onPress={() => language !== '1' && handleLanguage('2')}>
                                                <Text style={tw`font-${language === '1' ? 'bold' : 'normal'} text-[${language === '1' ? '#000' : '#acacac'}] mr-2.5`}>Español</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => language !== '2' && handleLanguage('1')}>
                                                <Text style={tw`font-${language === '2' ? 'bold' : 'normal'} text-[${language === '2' ? '#000' : '#acacac'}]`}>English (US)</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ImageBackground>
                                :
                                    <Sliders handleStart={() => handleSliders()}/>
                            }
                        </View>

                    </>
                :
                    <View style={{flex: 1}}>
                        <ImageBackground source={require('../../../assets/background/fondo.jpg')} style={tw`w-[100%] h-[100%]`}>
                            <View style={tw`px-[${isIphone ? '5%' : '3%'}] flex-1`}>
                                <View style={tw`h-25 self-stretch flex-row justify-center items-end p-7.5`}>
                                    <View style={tw`h-[100%] flex-1 justify-start`}>
                                        <IonIcons name={'bell'} size={35} color='transparent' />
                                    </View>
                                    <View style={tw`h-[100%] flex-1 justify-center items-center`}>
                                        <Image
                                            style={tw`w-20 h-20`}
                                            resizeMode={'contain'}
                                            source={require('../../../assets/logo_telat.png')}
                                        />
                                    </View>
                                    <TouchableOpacity 
                                        style={tw`h-[100%] flex-1 justify-start items-end`}
                                        onPress={() => navigation.navigate('Notifications', {language, orientation: orientationInfo.initial, origin: 2})}>
                                        <IonIcons name={'bell'} size={35} color='#000' />
                                        {
                                            notificacion
                                            &&
                                                <View style={tw`w-4 h-4 rounded-3xl bg-[#FF3333] absolute top-0 right-0 border border-[#fff] justify-center items-center`} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={tw`h-17.5 self-stretch justify-center items-center`}>
                                    <Text style={tw`text-2xl font-bold text-[#383838]`}>{language === '1' ? '¡Bienvenido!' : 'Welcome!'}</Text>
                                </View>
                                <View style={tw`flex-1 self-stretch justify-center items-center mx-2.5`}>
                                    <View style={tw`h-auto self-stretch flex-row justify-center items-center rounded-3xl p-2`}>
                                        <TouchableOpacity style={tw`shadow-xl h-12.5 flex-1 bg-[${Blue}] justify-center items-center rounded-3xl mr-2`}
                                            onPress={() => {
                                                setIsHide(true)
                                                navigation.navigate('Login', {language: language, orientation: orientationInfo.initial})
                                            }}
                                        >
                                            <Text style={tw`text-xl text-white font-bold text-center`}>{language === '1' ? 'Usuarios' : 'Users'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={tw`shadow-xl h-12.5 flex-1 bg-[${Orange}] justify-center items-center rounded-3xl mr-2`}
                                            onPress={() => {
                                                setIsHide(true)
                                                navigation.navigate('Vacants', {language: String(language), orientation: orientationInfo.initial, valueNotificationToken: valueNotificationToken})
                                            }}
                                        >
                                            <Text style={tw`text-xl text-white font-bold text-center`}>{language === '1' ? 'Bolsa de Empleo' : 'Careers'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={tw`h-auto self-stretch justify-end items-end px-2 mt-3`}>
                                    <View style={tw`h-auto flex-row self-stretch justify-end items-end px-2`}>
                                        {
                                            !isHide
                                            ?
                                                count > 0
                                                ?
                                                    <Animatable.View
                                                        style={tw`h-16 w-auto justify-center items-center bg-[${Blue}] rounded-tl-10 rounded-bl-10 rounded-br-none rounded-tr-none px-4 border-r border-r-white shadow-xl`}
                                                        animation='bounceIn'
                                                        duration={500}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                if(vacantsUsa) setVisibility(!visibility)
                                                                else {
                                                                    setCount(0)
                                                                    setIsHide(!isHide)
                                                                    navigation.navigate('Register', {language: language, orientation: orientationInfo.initial, country: 'MX'})
                                                                }
                                                            }}
                                                            style={tw`flex-1 h-16 self-stretch justify-center items-center`}
                                                        >
                                                            <Text style={tw`text-lg ml-2 text-white font-bold text-center`}>{language === '1' ? 'Solicitud de Empleo' : 'Application for Employment'}</Text>
                                                        </TouchableOpacity>
                                                    </Animatable.View>
                                                :
                                                    <></>
                                            :
                                                count > 0
                                                ?
                                                    <Animatable.View
                                                        style={tw`h-16 w-auto justify-center items-center bg-[${Blue}] rounded-tl-10 rounded-bl-10 rounded-br-none rounded-tr-none px-4 border-r border-r-white shadow-xl`}
                                                        animation='bounceOut'
                                                        duration={300}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                if(vacantsUsa) setVisibility(!visibility)
                                                                else {
                                                                    setCount(0)
                                                                    setIsHide(!isHide)
                                                                    navigation.navigate('Register', {language: language, orientation: orientationInfo.initial, country: 'MX'})
                                                                }
                                                            }}
                                                            style={tw`flex-1 h-16 self-stretch justify-center items-center`}
                                                        >
                                                            <Text style={tw`text-lg ml-2 text-white font-bold text-center`}>{language === '1' ? 'Solicitud de Empleo' : 'Application for Employment'}</Text>
                                                        </TouchableOpacity>
                                                    </Animatable.View>
                                                :
                                                    <></>
                                        }
                                        <TouchableOpacity 
                                            onPress={() => { 
                                                setIsHide(!isHide)
                                                setCount(count + 1)
                                            } }
                                            style={tw`p-2 w-16 h-16 bg-[${Blue}] justify-center items-center rounded-tl-${isHide ? '10' : 'none'} rounded-bl-${isHide ? '10' : 'none'} rounded-tr-10 rounded-br-10 shadow-xl`}
                                        >
                                            <IonIcons name={'file-document-edit-outline'} size={40} color='white' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View
                                    style={tw`h-12.5 py-1.5 self-stretch justify-center items-${isIphone ? 'start' : 'center'} flex-row`}>
                                    <TouchableOpacity onPress={() => language !== '1' && handleLanguage('2')}>
                                        <Text style={tw`font-${language === '1' ? 'bold' : 'normal'} text-[${language === '1' ? '#000' : '#acacac'}] mr-2.5`}>Español</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => language !== '2' && handleLanguage('1')}>
                                        <Text style={tw`font-${language === '2' ? 'bold' : 'normal'} text-[${language === '2' ? '#000' : '#acacac'}]`}>English (US)</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                }
            
            
            <Modal visibility={visibility} orientation={orientationInfo.initial} handleDismiss={() => setVisibility(!visibility)}>
                <Title title={language === '1' ? 'SELECCIONAR PAÍS' : 'SELECT COUNTRY'} tipo={2} />
                <View
                    style={tw`flex-row self-stretch h-auto`}>
                    <TouchableOpacity
                        style={tw`flex-1 h-11 bg-[#ececec] justify-center items-center flex-row rounded-md mr-1`}
                        onPress={() => {
                            setCount(0)
                            setIsHide(!isHide)
                            setVisibility(!visibility)
                            navigation.navigate('Register', {language: language, orientation: orientationInfo.initial, country: 'MX'})
                        }}
                    >
                        <Image
                            style={tw`w-6 h-6 border-2 border-[#fff] rounded-3xl m-px`}
                            resizeMode={'cover'}
                            source={require('../../../assets/language_mx.png')}
                        />
                        <Text style={tw`text-[#000] text-sm font-bold ml-1`}>México</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={tw`flex-1 h-11 bg-[#ececec] justify-center items-center flex-row rounded-md`}
                        onPress={() => {
                            setCount(0)
                            setIsHide(!isHide)
                            setVisibility(!visibility)
                            navigation.navigate('Register', {language: language, orientation: orientationInfo.initial, country: 'US'})
                        }}
                    >
                        <Image
                            style={tw`w-6 h-6 border-2 border-[#fff] rounded-3xl m-px`}
                            resizeMode={'cover'}
                            source={require('../../../assets/language_us.png')}
                        />
                        <Text style={tw`text-[#000] text-sm font-bold ml-1`}>USA</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {
                show && cuenta !== 0
                &&
                    <UpdateAvailable language={language} visibility={true} id_ios={info_version.id_ios} id_android={info_version.id_android}/>
            } 
        </>
    )
}