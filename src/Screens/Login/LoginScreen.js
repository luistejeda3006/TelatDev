import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, TextInput, Alert, StatusBar, Keyboard, TouchableWithoutFeedback, SafeAreaView} from 'react-native';
import {barStyle, Blue, SafeAreaBackground} from '../../colors/colorsApp'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {useForm, useNavigation, useOrientation} from '../../hooks'
import {live, login, urlApp} from '../../access/requestedData';
import encript from '../../access/encript';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal, ModalLoading} from '../../components';
import {Button} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import tw from 'twrnc';

let contador = 0;
let sendNotification = 'sendNotification'
let dataNotification = 'dataNotification'
let isLogged = 'isLogged'

export default ({navigation, route: {params: {language, orientation}}}) => {
    const input_user = useRef()
    const input_pass = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const {isTablet} = DeviceInfo;
    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false);

    const [bodyMessage, setBodyMessage] = useState({
        header: language === '1' ? 'Recuperación de Contraseña' : 'Password Recovery',
        icon: false,
        body: language === '1' ? 'Introduce tu correo electrónico y te enviaremos las datos para poder restablecer tu contraseña.' : 'Enter your email and we will send you the data to reset your password',
    });

    const {handlePath} = useNavigation()
    const [initialState, setInitialState] = useState({
        error: false,
        hide: true,
        visibility: false,
        enabled: true,
        bloqueo: 1,
    })
    
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const getIsLogged = async () => {
        let isOn = await AsyncStorage.getItem(isLogged) || '0';
        if(isOn === '1'){
            navigation.navigate('Logged', {language: language, orientation: orientationInfo.initial})
        }
    }

    useEffect(() => {
        getIsLogged()
    },[])

    useFocusEffect(
        useCallback(() => {
            handlePath('Choose')
        }, [])
    );

    useEffect(() => {
        let timer1 = setTimeout(() => {
            contador = 0;
            setInitialState({...initialState, enabled: true})
        },2000);

        return () => {
            clearTimeout(timer1);
        };
    },[initialState.enabled]);

    useEffect(() => {
        let timer1 = setTimeout(() => {
            setShow(false)
        },5000);

        return () => {
            clearTimeout(timer1);
        };
    },[show]);

    
    const {handleInputChange, values, handleSubmitForm} = useForm({
        username: '',
        password: '',
        recoveryEmail: '',
    });

    const {username, password, recoveryEmail} = values

    const handleSubmit = async() => {
        try{
            if(contador === 0){
                let data = null;
                if((username.trim() && password.trim()) !== ''){
                    try{
                        const body = {
                            'action': 'login',
                            'login': login,
                            'live': live,
                            'data': {
                                'user': username.trim(),
                                'password': encript(password.trim()).toString(),
                                'bloqueo': initialState.bloqueo,
                                'language': parseInt(language)
                            },
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
                            setIsLoading(true)
                            setInitialState({...initialState, hide: true})
                            setTimeout(async () => {
                                setTimeout(() => {
                                    setIsLoading(false)
                                }, 2000)
                                let keyUserInfo = 'userInfo';
                                let keyTokenInfo = 'tokenInfo';
                                data = await AsyncStorage.getItem(keyUserInfo) || '{}';
                                await AsyncStorage.removeItem(dataNotification)
                                await AsyncStorage.setItem(sendNotification, '1');
                                await AsyncStorage.setItem(keyUserInfo, JSON.stringify(response));
                                await AsyncStorage.setItem(keyTokenInfo, JSON.stringify(response.token));
                                await AsyncStorage.setItem(isLogged, '1');
                                
                                setShow(true)
                                handleSubmitForm();
                                setInitialState({...initialState, enabled: false, hide: true})
                                contador = contador + 1;
                                navigation.navigate('Logged', {language: language, orientation: orientationInfo.initial})
                            }, 3000)
                        }
                        else {
                            if(response.response === 'Usuario incorrecto'){
                                Alert.alert(
                                    language === '1' ? 'Error de Autenticación' : 'Authentication Error',
                                    language === '1' ? 'El usuario no existe' : 'User does not exist',
                                    [
                                        { text: 'OK'}
                                    ]
                                )
                            }
                            else if (response.response === 'Contraseña caducada') {
                                Alert.alert(
                                    language === '1' ? 'Contraseña Caducada' : 'Expired Password',
                                    language === '1' ? 'La contraseña ha caducado, restablezcala via intranet desde su navegador' : 'The password has expired, reset it via intranet from your browser',
                                    [
                                        { text: 'OK'}
                                    ]
                                )
                            }
    
                            else if (response.response === 'Cuenta bloqueada') {
                                Alert.alert(
                                    language === '1' ? 'Cuenta Bloqueada' : 'Blocked Account',
                                    language === '1' ? 'Cuenta bloqueada por 30 minutos, inténtelo más tarde' : 'Account locked for 30 minutes, try again later',
                                    [
                                        { text: 'OK'}
                                    ]
                                )
                                setInitialState({...initialState, bloqueo: 0})
                                handleSubmitForm();
                            }
    
                            else if (response.response === 'Contraseña incorrecta') {
                                setInitialState({...initialState, bloqueo: initialState.bloqueo + 1, error: true})
                            }
    
                            else if(response.response === 'Usuario nuevo') {
                                Alert.alert(
                                    language === '1' ? 'Usuario Nuevo' : 'New User',
                                    language === '1' ? 'Por favor debe cambiar su contraseña vía intranet, para acceder a la app' : 'Please change your password via intranet, to access the app',
                                    [
                                        { text: 'OK'}
                                    ]
                                )
                            }
    
                            else if(response.response === 'Usuario inactivo'){
                                Alert.alert(
                                    language === '1' ? 'Usuario Inactivo' : 'Inactive User',
                                    language === '1' ? 'El usuario no está activo o no existe' : 'The user is not active or does not exist',
                                    [
                                        { text: 'OK'}
                                    ]
                                )
                                handleSubmitForm();
                            }
    
                            else if(response.response === 'Empleado inactivo'){
                                Alert.alert(
                                    language === '1' ? 'Empleado Inactivo' : 'Inactive Employee',
                                    language === '1' ? 'El empleado no está activo o no existe' : 'The employee is not active or does not exist',
                                    [
                                        { text: 'OK'}
                                    ]
                                )
                                handleSubmitForm();
                            }
    
                            else {
                                //para futuro
                            }
                        }
                    } 
                    catch(e){
                        Alert.alert(
                            language === '1' ? 'Error de Conexión' : 'Connection Failed',
                            language === '1' ? 'Por favor, verifique su conexión de internet' : 'Please, verify internet connection',
                            [
                                { text: 'OK'}
                            ]
                        )
                    }
                }
                else {
                    Alert.alert(
                        language === '1' ? 'Campos Vacíos' : 'Empty Fields',
                        language === '1' ? 'No puede haber campos vacíos' : 'Fill Empty Fields',
                        [
                            { text: 'OK'}
                        ]
                    )
                }
            }
        }catch(e){
            console.log('Problema con el internet')
        }
    }

    useEffect(() => {
        if(bodyMessage.header !== 'Correo Enviado Correctamente' && bodyMessage.header !== 'Email Sent Successfully'){
            let timer1 = setTimeout(() => {
                setBodyMessage({
                    header: language === '1' ? 'Recuperación de Contraseña' : 'Password Recovery',
                    icon: false,
                    body: language === '1' ? 'Introduce tu correo electrónico y te enviaremos las datos para poder restablecer tu contraseña.' : 'Enter your email and we will send you the data to reset your password',
                })
            },2500);
    
            return () => {
                clearTimeout(timer1);
            };
        }
        else {
            let timer1 = setTimeout(() => {
                setBodyMessage({
                    header: language === '1' ? 'Recuperación de Contraseña' : 'Password Recovery',
                    icon: false,
                    body: language === '1' ? 'Introduce tu correo electrónico y te enviaremos las datos para poder restablecer tu contraseña.' : 'Enter your email and we will send you the data to reset your password',
                })
                setVisible(false)
            },2500);
    
            return () => {
                clearTimeout(timer1);
            };
        }
    },[bodyMessage.header])

    const handleSendEmail = async () => {
        if(recoveryEmail !== ''){
                setLoading(true)
                const body = {
                    'login': login,
                    'action': 'change_passw',
                    'live': live,
                    'data': {
                        'email': recoveryEmail
                    }
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
                    setLoading(false)
                    setBodyMessage({
                        header: language === '1' ? 'Correo Enviado Correctamente' : 'Email Sent Successfully',
                        icon: true,
                        body: language === '1' ? 'Se ha enviado un correo con las indicaciones para restablecer su contraseña' : 'An email has been sent with the instructions to reset your password',
                    })
                    handleSubmitForm();
                    setIsLoading(false)
                }
                else {
                    setBodyMessage({
                        header: language === '1' ? 'Correo Electrónico Inválido' : 'Invalid Email',
                        icon: true,
                        body: language === '1' ? 'No se encontró el correo proporcionado' : 'The email provided was not found',
                    })
                    setIsLoading(false)
                }
            }
            else {
                Alert.alert(
                    language === '1' ? 'Campo Obligatorio' : 'Obligatory Field',
                    language === '1' ? 'El campo es obligatorio, proporcione un correo electrónico válido' : 'The field is required, provide a valid email',
                    [
                        { text: 'OK'}
                    ]
                )
            }
    }

    useEffect(() => {
        setTimeout(() => {
            if(initialState.error) setInitialState({...initialState, error: false})
        }, 3500)
    },[initialState.error])

    return (
        <>
            {
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <>
                        <StatusBar barStyle={barStyle} />
                        <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground}}/>
                        <View style={tw`flex-1 bg-[#fff] self-stretch`}>
                            <ImageBackground source={require('../../../assets/background/fondo.jpg')} style={tw`w-[100%] h-[100%]`}>
                                <View style={tw`h-25 self-stretch flex-row justify-center items-end px-7.5`}>
                                    {
                                        !isLoading
                                        ?
                                            <TouchableOpacity 
                                                style={tw`h-[100%] flex-1 justify-center`}
                                                onPress={() => navigation.navigate('Choose')}>
                                                <IonIcons name={'arrow-left'} size={35} color='#000' />
                                            </TouchableOpacity>
                                        :
                                            <View style={tw`h-[100%] flex-1 justify-center`}>
                                                <IonIcons name={'arrow-left'} size={35} color='#000' />
                                            </View>
                                    }
                                    <View
                                        style={tw`h-[100%] flex-1 justify-center items-end`}>
                                        <IonIcons name={'bell'} size={35} color='transparent' />
                                    </View>
                                </View>
                                <View style={tw`h-43 justify-center items-center`}>
                                    <Image
                                        resizeMode='contain'
                                        style={tw`w-25 h-25`}
                                        source={require('../../../assets/logo_telat.png')}
                                    />
                                </View>
                                <View style={tw`h-auto justify-center items-center px-${isTablet() ? '30' : '12.5'}`}>
                                    <View style={tw`h-auto self-stretch pt-4.5 justify-center items-center px-3.5 bg-[rgba(255,255,255,.4)] border border-[#f7f7f7] rounded-3xl`}>
                                        <View style={tw`h-12.5 justify-center items-center bg-white w-[100%] rounded-3xl mb-4 shadow-lg`}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={language === '1' ? 'Usuario' : 'Username'}
                                                autoCapitalize='none'
                                                placeholderTextColor='#adadad'
                                                value={values.username}
                                                keyboardType='email-address'
                                                onChangeText={(e) => handleInputChange(e, 'username')}
                                                ref={input_user}
                                                onSubmitEditing={() => input_pass.current.focus()}
                                            />
                                        </View>
                                        
                                        <View style={tw`h-12.5 flex-row justify-center items-center bg-white w-[100%] rounded-3xl mb-4 shadow-lg mb-4 border border-[${initialState.error ? '#FF3333' : '#f7f7f7'}] rounded-3xl`}>
                                            <TextInput
                                                style={[styles.input, {color: initialState.error ? 'red' : '#000'}]}
                                                placeholder={language === '1' ? 'Contraseña' : 'Password'}
                                                placeholderTextColor={'#adadad'}
                                                secureTextEntry={initialState.hide}
                                                autoCapitalize='none'
                                                value={values.password}
                                                ref={input_pass}
                                                onChangeText={(e) => handleInputChange(e, 'password')}
                                            />
                                            {
                                                !isLoading
                                                ?
                                                    <TouchableOpacity style={tw`bg-white w-12.5 h-12 justify-center items-center rounded-3xl mr-px`}
                                                        onPress={() => setInitialState({...initialState, hide: !initialState.hide})}>
                                                        <IonIcons name={initialState.hide ? 'eye-outline' : 'eye-off-outline'} size={24} color='#383838' />
                                                    </TouchableOpacity>
                                                :
                                                    <View style={tw`bg-white w-12.5 h-12 justify-center items-center rounded-3xl mr-px`} 
                                                        onPress={() => setInitialState({...initialState, hide: !initialState.hide})}>
                                                        <IonIcons name={initialState.hide ? 'eye-outline' : 'eye-off-outline'} size={24} color='#383838' />
                                                    </View>
                                            }
                                        </View>
                                        {
                                            isLoading
                                            ?
                                                <Button loading={true}
                                                    style={tw`shadow-xl bg-[${Blue}] rounded-3xl self-stretch h-12.5 justify-center items-center`} 
                                                    uppercase={false} labelStyle={tw`text-base font-bold`} color={'#fff'}>
                                                    {language === '1' ? 'Cargando' : 'Loading'}
                                                </Button>
                                            :
                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        Keyboard.dismiss()
                                                        handleSubmit()
                                                    }}
                                                >
                                                    <View style={tw`shadow-xl h-12.5 self-stretch bg-[${Blue}] justify-center items-center rounded-3xl flex-row`}>
                                                        <View
                                                            style={tw`flex-1 justify-center items-center`}>
                                                            <IonIcons name={'login'} size={24} color='transparent' />
                                                        </View>
                                                        <View style={tw`flex-1 justify-center items-center`}>
                                                            <Text
                                                                style={tw`text-base text-white font-bold text-center`}>{language === '1' ? 'Ingresar' : 'Login'}</Text>
                                                        </View>
                                                        <View style={tw`flex-1 justify-center items-start`}>
                                                            <IonIcons name={'login'} size={24} color='#fff' />
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                        }
                                        {
                                            !isLoading
                                            ?
                                                <TouchableOpacity 
                                                    style={tw`h-12.5 self-stretch justify-center items-center`}
                                                    onPress={() => setVisible(!visible)}>
                                                        <View style={tw`w-auto border-b border-b-[${Blue}]`}>
                                                            <Text style={tw`text-[${Blue}] `}>{language === '1' ? '¿Olvidaste la contraseña?' : 'Forgot password?'}</Text>
                                                        </View>
                                                </TouchableOpacity>
                                            :
                                                <View style={tw`h-12.5 self-stretch justify-center items-center`}>
                                                    <View style={tw`w-auto border-b border-b-[${Blue}]`}>
                                                        <Text style={tw`text-[${Blue}] `}>{language === '1' ? '¿Olvidaste la contraseña?' : 'Forgot password?'}</Text>
                                                    </View>
                                                </View>
                                        }
                                    </View>
                                </View>
                                <View style={tw`flex-1 justify-center items-center`} />
                            </ImageBackground>
                        </View>
                    </>
                :
                    <View style={tw`flex-1`}>
                        <ImageBackground source={require('../../../assets/background/fondo.jpg')} style={tw`w-[100%] h-[100%]`}>
                            <View style={tw`h-19 self-stretch flex-row justify-center items-center px-7.5`}>
                                {
                                    !isLoading
                                    ?
                                        <TouchableOpacity 
                                            style={tw`h-[100%] flex-1 justify-center`}
                                            onPress={() => navigation.navigate('Choose')}>
                                            <IonIcons name={'arrow-left'} size={35} color='#000' />
                                        </TouchableOpacity>
                                    :
                                        <View style={tw`h-[100%] flex-1 justify-center`}>
                                            <IonIcons name={'arrow-left'} size={35} color='#000' />
                                        </View>
                                }
                                <View style={tw`h-25 justify-center items-center mt-{${isTablet() ? 37.5 : 0}}`}>
                                    <Image
                                        style={tw`w-${isTablet() ? 25 : 16} h-${isTablet() ? 25 : 16}`}
                                        resizeMode={'contain'}
                                        source={require('../../../assets/logo_telat.png')}
                                    />
                                </View>
                                <View style={tw`h-[100%] flex-1 justify-center items-end`} >
                                    <IonIcons name={'bell'} size={35} color='transparent' />
                                </View>
                            </View>
                            <View style={tw`flex-1 justify-center items-center`}>
                                <View style={tw`h-auto justify-center items-center px-${isTablet() ? orientationInfo.initial === 'PORTRAIT' ? 30 : 37.5 : 12.5}`}>
                                    <View style={tw`h-auto w-[50%] pt-4.5 justify-center items-center px-3.5 bg-[rgba(255,255,255, 0.4)] rounded-3xl border border-[#f1f1f1]`}>
                                        <View style={tw`shadow-xl justify-center bg-white w-[100%] items-center flex-row rounded-3xl mb-4`}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={language === '1' ? 'Usuario' : 'Username'}
                                                autoCapitalize='none'
                                                placeholderTextColor='#adadad'
                                                value={values.username}
                                                keyboardType='email-address'
                                                onChangeText={(e) => handleInputChange(e, 'username')}
                                                ref={input_user}
                                                onSubmitEditing={() => input_pass.current.focus()}
                                            />
                                        </View>
                                        <View
                                            style={tw`shadow-xl justify-start bg-white w-[100%] items-center flex-row rounded-3xl mb-4 border border-[${initialState.error ? '#FF3333' : '#f7f7f7'}]`}>
                                            <TextInput
                                                style={[styles.input, {color: initialState.error ? 'red' : '#000'}]}
                                                placeholder={language === '1' ? 'Contraseña' : 'Password'}
                                                placeholderTextColor={'#adadad'}
                                                secureTextEntry={initialState.hide}
                                                autoCapitalize='none'
                                                value={values.password}
                                                ref={input_pass}
                                                onChangeText={(e) => handleInputChange(e, 'password')}
                                            />
                                            {
                                                !isLoading
                                                ?
                                                    <TouchableOpacity style={tw`bg-white w-12.5 h-12 justify-center items-center rounded-3xl mr-px`}
                                                        onPress={() => setInitialState({...initialState, hide: !initialState.hide})}>
                                                        <IonIcons name={initialState.hide ? 'eye-outline' : 'eye-off-outline'} size={24} color='#383838' />
                                                    </TouchableOpacity>
                                                :
                                                    <View style={tw`bg-white w-12.5 h-12 justify-center items-center rounded-3xl mr-px`}
                                                     onPress={() => setInitialState({...initialState, hide: !initialState.hide})}>
                                                        <IonIcons name={initialState.hide ? 'eye-outline' : 'eye-off-outline'} size={24} color='#383838' />
                                                    </View>
                                            }
                                        </View>
                                        {
                                            isLoading
                                            ?
                                                <Button loading={true}
                                                    style={tw`shadow-xl bg-[${Blue}] rounded-3xl self-stretch h-12.5 justify-center items-center`} 
                                                    uppercase={false} labelStyle={tw`text-base font-bold`} color={'#fff'}>
                                                    {language === '1' ? 'Cargando' : 'Loading'}
                                                </Button>
                                            :
                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        Keyboard.dismiss()
                                                        handleSubmit()
                                                    }}
                                                >
                                                    <View style={tw`shadow-xl h-12.5 self-stretch bg-[${Blue}] justify-center items-center rounded-3xl flex-row`}>
                                                        <View
                                                            style={tw`flex-1 justify-center items-center`}>
                                                            <IonIcons name={'login'} size={24} color='transparent' />
                                                        </View>
                                                        <View style={tw`flex-1 justify-center items-center`}>
                                                            <Text
                                                                style={tw`text-base text-white font-bold text-center`}>{language === '1' ? 'Ingresar' : 'Login'}</Text>
                                                        </View>
                                                        <View style={tw`flex-1 justify-center items-start`}>
                                                            <IonIcons name={'login'} size={24} color='#fff' />
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                        }
                                        {
                                            !isLoading
                                            ?
                                                <TouchableOpacity 
                                                    style={tw`h-12.5 self-stretch justify-center items-center`}
                                                    onPress={() => setVisible(!visible)}>
                                                        <View style={tw`w-auto border-b border-b-[${Blue}]`}>
                                                            <Text style={tw`text-[${Blue}] `}>{language === '1' ? '¿Olvidaste la contraseña?' : 'Forgot password?'}</Text>
                                                        </View>
                                                </TouchableOpacity>
                                            :
                                                <View style={tw`h-12.5 self-stretch justify-center items-center`}>
                                                    <View style={tw`w-auto border-b border-b-[${Blue}]`}>
                                                        <Text style={tw`text-[${Blue}] `}>{language === '1' ? '¿Olvidaste la contraseña?' : 'Forgot password?'}</Text>
                                                    </View>
                                                </View>
                                        }
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
            }

            <Modal visibility={visible} handleDismiss={() => setVisible(!visible)} orientation={orientationInfo.initial}>
                <View style={tw`h-auto self-stretch`}>
                    <View
                        style={tw`h-auto self-stretch justify-center items-center mb-4`}>
                        <Text style={tw`text-black font-bold text-lg mb-2.5`}>{bodyMessage.header}</Text>
                        {
                            !bodyMessage.icon
                            &&
                            <Text style={tw`text-black text-base`}>{bodyMessage.body}</Text>
                        }
                    </View>
                    <View style={tw`h-auto justify-start items-start self-stretch`}>
                        {
                            !bodyMessage.icon
                            &&
                                <>
                                    <View style={tw`mb-4 justify-start bg-white w-[100%] items-center flex-row rounded-3xl mb-[5%] border border-[#dadada]`}>
                                        <View style={tw`bg-white w-10 h-9 justify-center items-center rounded-3xl`}>
                                            <IonIcons name={'at'} size={25} color={'#000'}/>
                                        </View>
                                        <TextInput
                                            style={[styles.input, {fontSize: 15, paddingRight: 8, paddingLeft: 0}]}
                                            placeholder={language === '1' ? 'Ingresa tu correo' : 'Type your email'}
                                            autoCapitalize='none'
                                            placeholderTextColor='#c1c1c1'
                                            value={recoveryEmail}
                                            keyboardType='email-address'
                                            onChangeText={(e) => handleInputChange(e, 'recoveryEmail')}
                                        />
                                    </View>
                                    <TouchableWithoutFeedback onPress={() => handleSendEmail()}>
                                        <View style={tw`h-12 p-.5 bg-[${Blue}] rounded-3xl self-stretch items-center justify-center flex-row shadow-xl`}>
                                            <Icon size={16} name={'paper-plane'} color={'#fff'}/>
                                            <Text style={tw`text-white font-bold text-sm ml-2`}>{language === '1' ? 'Enviar correo' : 'Send email'}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </>
                        }
                    </View>
                </View>
                    {
                        bodyMessage.icon
                        && 
                            <>
                                <View style={tw`justify-center items-center self-stretch h-45`}>
                                    <Image
                                        style={tw`w-37.5 h-37.5`}
                                        resizeMode='stretch'
                                        source={ 
                                            bodyMessage.header !== 'Correo Enviado Correctamente' && bodyMessage.header !== 'Email Sent Successfully' 
                                            ? require('../../../assets/error.gif') 
                                            : require('../../../assets/correct.gif')
                                        }
                                    />
                                </View>
                            </>
                    }
            </Modal>

            <ModalLoading visibility={loading}/>
        </>
    )
}

const styles = StyleSheet.create({
    input:{
        flex: 1,
        height: 50,
        width: '100%',
        paddingHorizontal: 10,
        borderRadius: 20,
        fontSize: 16,
        color: '#000'
    },
})
