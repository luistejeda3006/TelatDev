import React, {useEffect, useState} from 'react';
import {FlatList, View, StatusBar, SafeAreaView, BackHandler, Alert, RefreshControl, ImageBackground, Image, Text, TouchableOpacity} from 'react-native';
import {Card, FailedNetwork, BottomNavBar} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {useConnection, useNotification, useOrientation, useScroll, useSound} from '../../hooks';
import {isIphone, live, login, urlApp, urlJobs, version } from '../../access/requestedData';
import {BallIndicator} from 'react-native-indicators';
import PushNotification from 'react-native-push-notification';
import {barStyle, barStyleBackground, Blue, Orange, SafeAreaBackground} from '../../colors/colorsApp';
import {useDispatch, useSelector} from 'react-redux';
import {selectAccess, selectScreen, setAccess} from '../../slices/navigationSlice';
import {selectOrientation} from '../../slices/orientationSlice';
import {selectDataNotification, selectLanguageApp, selectNotification, selectTokenInfo, selectUserInfo, setNotification, setVisibleSliders} from '../../slices/varSlice';
import UpdateAvailable from '../../components/UpdateAvailable';
import tw from 'twrnc';

let gender = null;
let picture = null;
let token = null;
let user = null;
let notification = false;

let keyUserInfo = 'userInfo';
let lastNotify = 'lastNotify';
let keyTokenInfo = 'tokenInfo';
let notificationToken = 'notificationToken';
let valueNotificationToken = ''
let sendNotification = 'sendNotification'
let valueSendNotification = ''
let pendingNotify = 'pendingNotify'
let thereAre = 'thereAre';
let show = undefined;
let cuenta = 0;

let dataNotification = 'dataNotification'
let dataNotificationValue = ''
let isLogged = 'isLogged'
let change = 'change'; // 1 hay cambios 2 no hay cambios
let id_usuario = ''

let screen = '';
let access = '';
let orientation = '';
let info_version = null;
let language = null;

export default ({navigation}) => {
    const dispatch = useDispatch()

    notification = useSelector(selectNotification)
    dataNotificationValue = useSelector(selectDataNotification)
    orientation = useSelector(selectOrientation)
    language = useSelector(selectLanguageApp)
    user = useSelector(selectUserInfo)
    token = useSelector(selectTokenInfo)
    
    screen = useSelector(selectScreen)
    access = useSelector(selectAccess)

    const {isTablet} = DeviceInfo;
    const [enabled, setEnabled] = useState(false)
    const [modules, setModules] = useState([])
    /* const [notification, setNotificacion] = useState(false) */
    const [loading, setLoading] = useState(true)
    const {hasConnection, askForConnection} = useConnection();
    const {arrived} = useNotification()
    const {sound: openSound} = useSound('pop.mp3')

    const getToken = async() => {
        valueNotificationToken = await AsyncStorage.getItem(notificationToken);
        console.log('value: ', valueNotificationToken)
        valueSendNotification = await AsyncStorage.getItem(sendNotification) || '0';
        await AsyncStorage.setItem(sendNotification, '0')
    }

    useEffect(() => {
        getToken()
    },[])
    
    useEffect(() => {
        dispatch(setVisibleSliders(false))
    },[])

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });
    
    const reloading = () => {
        setLoading(true)
    }
    
    useEffect(async () => {
        if(user.tipo === 'MX'){
            gender = user.data.datos_personales.genero
            picture = user.data.datos_personales.foto_url
        }
        else {
            gender = null
        }
        
        return undefined
    },[])

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
                }
                else {
                    if(access === '1') {
                        dispatch(setAccess('0'))
                        navigation.navigate(screen)
                    }
                    else {
                        Alert.alert(gender ? language === '1' ? '¡Espera!' : 'Hold on!' : 'Hold on!', gender ? language === '1' ? gender === 'M' ? '¿Segura que quieres salir?' : '¿Seguro que quieres salir?' : 'Are you sure you want to go back?' : 'Are you sure you want to go back?', 
                        [
                            {
                                text: gender ? language === '1' ? 'Cancelar' : 'Cancel' : 'Cancel',
                                onPress: () => null,
                                style: 'cancel'
                            },
                            { text: gender ? language === '1' ? 'Sí' : 'Yes' : 'Yes', onPress: access === '1' ? () => navigation.navigate('Dashboard', {language: language}) : () => BackHandler.exitApp() }
                        ]);
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
                } else {
                    if(temporal[0] === 'Dashboard'){
                        Alert.alert(
                            language === '1' ? 'Abandonar' : 'Leave',
                            language === '1' ? '¿Seguro que deseas abandonar Juegos?' : 'Are you sure you want to leave Games?', 
                            [
                                {
                                    text: language === '1' ? 'Cancelar' : 'Cancel',
                                    onPress: () => null,
                                    style: 'cancel'
                                },
                                { text: language === '1' ? 'Sí' : 'Yes', onPress: () => navigation.navigate(temporal[0])}
                            ]
                        );
                    } else {
                        Alert.alert(
                            language === '1' ? 'Cerrar Sesión' : 'Sign Out',
                            language === '1' ? '¿Seguro que deseas cerrar tu sesión?' : 'Are you sure you want to close the session?', 
                        [
                            {
                                text: 'Cancelar',
                                onPress: () => null,
                                style: 'cancel'
                            },
                            { text: language === '1' ? 'Sí' : 'Yes', onPress: () => navigation.navigate('Dashboard')}
                        ]);
                    }
                }
            }
        };
    
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
    
        return () => backHandler.remove();
    }, [language]);
    
    useEffect(() => {
        setTimeout(() => {
            setEnabled(true)
            //este quitarlo solo es para desarrollo
            /* navigation.navigate('Games', {language: language, orientation: orientation, origin: 1}) */
        },1500)
        return false
    },[])

    const getInformation = async () => {
        try{
            id_usuario = user.data.datos_personales.id_usuario
            const body = {
                'login': login,
                'action': 'get_modulos',
                'live': live,
                'data': {
                    'id_usuario': id_usuario,
                    'language':language,
                    'token': valueNotificationToken
                }
            }

            console.log('value: ', body)
            
            const request = await fetch(urlApp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });

            
            const {response} = await request.json();
            if(response.status === 200){
                setModules(response.permisos)
                let notify = await AsyncStorage.getItem(lastNotify) || undefined;
                
                if(response.notificacion){
                    if(!notify) dispatch(setNotification(true))
                    else {
                        if(String(notify) === String(response.notificacion.id)) dispatch(setNotification(false))
                        else dispatch(setNotification(true))
                    }
                } else dispatch(setNotification(false))

                let obj = {
                    token: user.token,
                    tipo: user.tipo,
                    data: response.data
                }
                
                await AsyncStorage.removeItem(keyUserInfo).then(() => AsyncStorage.setItem(keyUserInfo, JSON.stringify(obj)));
                setLoading(false)
                cuenta = cuenta + 1
            }
            else {
                Alert.alert(
                    language === 1 ? 'Sesión Expirada' : 'Expired Session',
                    language === 1 ? 'Su sesión ha expirado' : 'Your session has expired',
                    [
                        { text: 'OK'}
                    ]
                )
                await AsyncStorage.removeItem(keyTokenInfo)
                await AsyncStorage.removeItem(keyUserInfo)
                await AsyncStorage.removeItem(isLogged)
                navigation.navigate('AuthLogin')
            }
        }catch(e){
            console.log(e)
            setLoading(false)
        }
    }

    useEffect(() => {
        getInformation()
    },[hasConnection, arrived, valueNotificationToken])

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
            console.log('hay un error con el internet')
            cuenta = 0;
        }
    }

    useEffect(() =>  {
        getVersion()
    },[])
    
    useEffect(() => {
        createChannels()
    })

    const createChannels = () => {
        PushNotification.createChannel({
            channelId: 'telat-channel',
            channelName: 'Telat Channel'
        })
    }
    
    const handleNotification = async () => {
        if(dataNotificationValue && valueSendNotification === '0'){
            dataNotificationValue = JSON.parse(dataNotificationValue)
            const title = dataNotificationValue.notification.title
            const body = dataNotificationValue.notification.body
            PushNotification.localNotification({
                channelId: 'telat-channel',
                title: title,
                message: body,
                largeIcon: ''
            })
            dispatch(setNotification(true))
        }
    }


    useEffect(() => {
        handleNotification()
    },[arrived])

    const handleModule = async (screen) => {
        if(screen === 'GeneralPrenomine'){
            navigation.navigate('GeneralPrenomine', {btn_editar: true, orientation: orientation})
        }
        else if(screen === 'Prenomine'){
            navigation.navigate('Prenomine', {btn_editar: false, id_usuario: id_usuario, language: language, orientation: orientation, origin: 1})
        }
        else if(screen === 'Tickets'){
            await AsyncStorage.setItem(change, '2')
            navigation.navigate('Tickets', {language: language, orientation: orientation})
        }
        else {
            navigation.navigate(screen, {language: language, orientation: orientation})
        }
    }

    return(
        <>
            {
                hasConnection
                ?
                    orientation === 'PORTRAIT' 
                    ?
                        <>
                            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground}} />
                            <View style={tw`flex-1`}>
                                <View style={tw`h-${orientation === 'PORTRAIT' ? isTablet() ? 15 : 15 : isTablet() ? 13 : 14.5} self-stretch flex-row bg-[${Blue}]`}>
                                    <View style={tw`w-${orientation === 'PORTRAIT' ? '20%' : '10%'} h-[100%] justify-center items-center`}>
                                        <Image
                                            style={stylesImage}
                                            resizeMode={'contain'}
                                            source={require('../../../assets/logo_telat.png')}
                                        />
                                    </View>
                                    <View style={tw`flex-1 justify-center items-center`}>
                                        <Text style={tw`text-lg text-white font-bold`}>{language === '1' ? 'Menú Principal' : 'Main Menu'}</Text>
                                    </View>
                                    <View style={tw`w-${orientation === 'PORTRAIT' ? '20%' : '10%'} h-[100%] justify-center items-center`}>
                                        
                                        <TouchableOpacity style={tw`w-12.5 h-12.5 rounded-full justify-center items-center border border-8 border-[#dadada] bg-[#dadada]`} onPress={() => navigation.openDrawer()}>
                                            {
                                                picture
                                                ?
                                                    <Image
                                                        style={tw`w-${orientation === 'PORTRAIT' ? 11.5 : 11} h-${orientation === 'PORTRAIT' ? 11.5 : 11} rounded-full`}
                                                        resizeMode={'cover'}
                                                        source={{uri: `${picture}`}}
                                                    />
                                                :
                                                    <>
                                                        <Image
                                                            style={tw`w-${orientation === 'PORTRAIT' ? 11.5 : 11} h-${orientation === 'PORTRAIT' ? 11.5 : 11} rounded-full`}
                                                            resizeMode={'cover'}
                                                            source={require('../../../assets/user.png')}
                                                        />
                                                    </>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    loading
                                    ?
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <BallIndicator color={Orange} size={35} />
                                        </View>
                                    :
                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <ImageBackground source={require('../../../assets/background/fondo.jpg')} style={tw`w-[100%] h-[100%]`}>
                                                    <FlatList
                                                        refreshControl={
                                                            <RefreshControl
                                                                progressBackgroundColor={Orange}
                                                                colors={['#fff']}
                                                                refreshing={false}
                                                                onRefresh={() => getInformation()}
                                                            />
                                                        }
                                                        showsVerticalScrollIndicator={false}
                                                        showsHorizontalScrollIndicator={false}
                                                        style={tw`flex-1 self-stretch mx-2`}
                                                        data={modules}
                                                        numColumns={orientation === 'PORTRAIT' ? isTablet() ? 3 : 2 : isTablet() ? 5 : 4}
                                                        renderItem={({item}) => <Card value={item.name} index={item.index} isPair={String(modules.length / 2).includes('.')} orientation={orientation} total={modules.length} onPress={() => {
                                                            openSound.play()
                                                            handleModule(item.screen)}
                                                        }/>}
                                                        key={orientation === 'PORTRAIT' ? '_1' : '_2'}
                                                        keyExtractor={item => String(item.id)}
                                                    />
                                                </ImageBackground>
                                            </View>
                                            <BottomNavBar navigation={navigation} language={language} orientation={orientation} notify={notification} screen={1}/>
                                        </View>
                                }
                            </View>
                        </>
                    :
                        <View style={tw`flex-1 bg-white`}>
                            <View style={tw`h-${orientation === 'PORTRAIT' ? isTablet() ? 15 : 16 : isTablet() ? 13 : 14.5} self-stretch flex-row bg-[${Blue}]`} >
                                <View style={tw`w-${orientation === 'PORTRAIT' ? '20%' : '10%'} h-[100%] justify-center items-center`}>
                                    <Image
                                        style={stylesImage}
                                        resizeMode={'contain'}
                                        source={require('../../../assets/logo_telat.png')}
                                    />
                                </View>
                                <View style={tw`flex-1 justify-center items-center`}>
                                    <Text style={tw`text-lg text-white font-bold`}>Menú Principal</Text>
                                </View>
                                <View style={tw`w-${orientation === 'PORTRAIT' ? '20%' : '10%'} h-[100%] justify-center items-center`}>
                                    <TouchableOpacity style={tw`w-12.5 h-12.5 rounded-full justify-center items-center border border-8 border-[#dadada]`} onPress={() => navigation.openDrawer()}>
                                        {
                                            picture
                                            ?
                                                <Image
                                                    style={tw`w-${orientation === 'PORTRAIT' ? 11.5 : 12} h-${orientation === 'PORTRAIT' ? 11.5 : 12} rounded-full`}
                                                    resizeMode={'cover'}
                                                    source={{uri: `${picture}`}}
                                                />
                                            :
                                                <Image
                                                style={tw`w-${orientation === 'PORTRAIT' ? 11.5 : 12} h-${orientation === 'PORTRAIT' ? 11.5 : 12} rounded-full`}
                                                    resizeMode={'cover'}
                                                    source={require('../../../assets/user.png')}
                                                />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {
                                loading
                                ?
                                    <View style={tw`flex-1 justify-center items-center`}>
                                        <BallIndicator color={Orange} size={35} />
                                    </View>
                                :
                                    <>
                                        <View style={tw`flex-1 justify-center items-center bg-white`}>
                                            <ImageBackground source={require('../../../assets/background/fondo.jpg')} style={tw`w-[100%] h-[100%]`}>
                                                <View style={tw`flex-1 self-stretch px-[${isIphone ? '5%' : '3%'}]`}>
                                                    <FlatList
                                                        refreshControl={
                                                            <RefreshControl
                                                                progressBackgroundColor={Orange}
                                                                colors={['#fff']}
                                                                refreshing={false}
                                                                onRefresh={() => getInformation()}
                                                            />
                                                        }
                                                        showsVerticalScrollIndicator={false}
                                                        showsHorizontalScrollIndicator={false}
                                                        style={tw`flex-1 self-stretch px-2`}
                                                        data={modules}
                                                        numColumns={orientation === 'PORTRAIT' ? isTablet() ? 3 : 2 : isTablet() ? 5 : 4}
                                                        renderItem={({item}) => <Card value={item.name} index={item.index} isPair={String(modules.length / 2).includes('.')} total={modules.length} orientation={orientation} onPress={() => {
                                                            openSound.play()
                                                            handleModule(item.screen)}
                                                        }/>}
                                                        key={orientation === 'PORTRAIT' ? '_1' : '_2'}
                                                        keyExtractor={item => String(item.id)}
                                                    />
                                                </View>
                                            </ImageBackground>
                                        </View>
                                        <BottomNavBar navigation={navigation} language={language} orientation={orientation} notify={notification} screen={1}/>
                                    </>
                            }
                        </View>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground}} />
                        <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientation}/>
                    </>
            }
            {
                show && cuenta !== 0
                &&
                    <UpdateAvailable language={language} visibility={true} id_ios={info_version.id_ios} id_android={info_version.id_android}/>
            } 
        </>
    );
}

const stylesImage = tw`w-11 h-11`