import React, {useState, useEffect, useRef, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ImageBackground, StatusBar, SafeAreaView, FlatList, Alert, Platform, Image, TouchableWithoutFeedback} from 'react-native';
import {BottomNavBar, Calendar, FailedNetwork, HeaderLandscape, HeaderPortrait, ModalLoading, NotResults} from '../../../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatDate, getCurrentDate, getLastDayMonth} from '../../../js/dates';
import {isIphone, live, login, urlGaceta} from '../../../access/requestedData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useConnection, useNavigation, useOrientation, useScroll} from '../../../hooks';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import {BallIndicator} from 'react-native-indicators';
import {barStyle, barStyleBackground, Blue, Orange, SafeAreaBackground} from '../../../colors/colorsApp';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectTokenInfo, selectUserInfo} from '../../../slices/varSlice';
import tw from 'twrnc'

let token = null;
let user = null;
let id_usuario = null;
let tipo = null;
let keyUserInfo = 'userInfo';
let keyTokenInfo = 'tokenInfo';

export default ({navigation, route: {params: {language, orientation}}}) => {
    const dispatch = useDispatch()
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)

    const refGaceta = useRef()
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(true)
    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)

    useEffect(() => {
        id_usuario = user.data.datos_personales.id_usuario
        tipo = user.tipo
    },[])

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    const [gaceta, setGaceta] = useState([])
    const [initialState, setInitialState] = useState({
        data: [],
        urlModal: '',
        initialDate: '',
        active: 1,
        initial: false,
        labelInitial: '',
        ending: false,
        labelEnding: '',
        visible: false,
        hide: false,
        current: 2,
        mes: parseInt(getCurrentDate().substring(5,7)),
        año: getCurrentDate().substring(0,4),
        completa: false,
    })

    const {active, initial, ending, data, hide, current, mes, año, completa, labelInitial, labelEnding} = initialState;
    
    const getGaceta = async () => {
        try{
            setLoading(true)
            const body = {
                'action': 'get_gaceta_mes',
                'data': {
                    'fecha': completa,
                    'idioma': tipo === 'MX' ? language : '2',
                    'id_usuario': id_usuario
                },
                'live': live,
                'login': login
            }
            
            console.log('body: ', body)

            const request = await fetch(urlGaceta, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });

            const {response, status} = await request.json();
            if(status === 200){
                setTimeout(() => {
                    setInitialState({...initialState, data: response})
                    setLoading(false)
                }, 800)
            }
            else if(status === 401){
                Alert.alert(
                    language === 1 ? 'Sesión Expirada' : 'Expired Session',
                    language === 1 ? 'Su sesión ha expirado' : 'Your session has expired',
                    [
                        { text: 'OK'}
                    ]
                )
                await AsyncStorage.removeItem(keyTokenInfo)
                await AsyncStorage.removeItem(keyUserInfo)
                navigation.navigate('AuthLogin')
            }
    
            else if(status === 406){
                Alert.alert(
                    language === 1 ? 'Acceso Inválido' : 'Invalid Access', 
                    language === 1 ? 'Acceso denegado, comuniquese con un administrador.' : 'Access denied, contact an administrator',
                    [
                        {
                            text: language === 1 ? 'Entendido' : 'OK',
                            style: 'OK'
                        }
                    ]
                )
                
                await AsyncStorage.removeItem(keyUserInfo)
                await AsyncStorage.removeItem(keyTokenInfo)
                navigation.navigate('AuthLogin')
            }
        }catch(e){
            setLoading(false)
            console.log('algo pasó con el internet')
        }
    }

    useEffect(() => {
        getGaceta()
    },[completa, hasConnection])

    useEffect(() => {
        refGaceta.current?.scrollToOffset({ animated: true, offset: 0 })
        let temporal = active === 1 ? data.importante : active === 2 ? data.informativo : active === 3 ? data.dinamicas : data.promociones
        setGaceta(temporal)
    }, [active, data])

    useEffect(() => {
        setTimeout(() => {
            setReload(false)
        },1000)
    },[reload])

    const handleChangeModule = (id) => {
        refGaceta.current?.scrollToOffset({ animated: true, offset: 0 })
        setReload(true)
        setInitialState({...initialState, active: id})
    }

    const handleChangeMonth = useCallback((type) => {
        let finMes = type === '+' ? mes === 12 ? 1 : (mes + 1) : mes === 1 ? 12 : (mes - 1)
        let finAño = type === '+' ? finMes === 1 ? (parseInt(año) + 1) : año : finMes === 12 ? (parseInt(año) - 1) : año
        let completita = `${finAño}-${finMes < 10 ? `0${finMes}` : finMes}`
        setInitialState({...initialState, mes: finMes, año: finAño, completa: completita})
    })

    const handleChangeYear = useCallback((type) => {
        let finAño = type === '+' ? (parseInt(año) + 1) : (parseInt(año) - 1)
        let completita = `${finAño}-${mes < 10 ? `0${mes}` : mes}`
        setInitialState({...initialState, mes: mes, año: finAño, completa: completita})
    })


    const Card = ({title, picture, w, h}) => {
        return(
            <Animatable.View style={{flex: 1, alignSelf: 'stretch', borderColor: '#CBCBCB', borderWidth: 1, marginBottom: 5}} animation='pulse' duration={2000}>
                { 
                    <>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ImageBackground source={{uri: 'https://fondosmil.com/fondo/17560.gif'}} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
                                    <BallIndicator color={Orange} size={35} />
                                </View>
                                <Image
                                    style={{aspectRatio: (w / h), width: '100%', height: '100%', zIndex: 1}}
                                    resizeMode={'contain'}
                                    source={{uri: picture}}
                                />
                            </ImageBackground>
                        </View>
                        <View style={{height: 'auto', alignSelf: 'stretch', padding: 8, borderTopColor: '#CBCBCB', borderTopWidth: 1}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>{title}</Text>
                        </View>
                    </>
                }
            </Animatable.View>
        )
    }

    const Header = () => {
        return(
            <View style={{height: 'auto', alignSelf: 'stretch'}}>
                <View style={{height: 50, alignSelf: 'stretch', flexDirection: 'row', borderColor: '#3283c5', borderTopWidth: 1, borderBottomWidth: 1, backgroundColor: 'rgba(50,131,197,.1)'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={() => active !== 1 && handleChangeModule(1)}>
                            <View style={{flex:1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name='alert' size={28} color={active === 1 ? '#3283c5' : '#c1c1c1'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={() => active !== 2 && handleChangeModule(2)}>
                            <View style={{flex:1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name='information' size={28} color={active === 2 ? '#3283c5' : '#c1c1c1'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={() => active !== 3 && handleChangeModule(3)}>
                            <View style={{flex:1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name={'bullseye-arrow'} size={28} color={active === 3 ? '#3283c5' : '#c1c1c1'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={() => active !== 4 && handleChangeModule(4)}>
                            <View style={{flex:1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name='trophy' size={28} color={active === 4 ? '#3283c5' : '#c1c1c1'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={{height: 'auto'}}>
                    {
                        orientationInfo.initial === 'PORTRAIT'
                        ?
                            <>
                                <View style={tw`bg-[#fff]`}>
                                    {
                                        !hide
                                        &&
                                            <View style={tw`h-14 self-stretch flex-row border-b border-b-[#adadad] bg-white border-b border-b-[${Blue}] bg-[rgba(50,131,197,.1)]`}>
                                                <View style={tw`flex-1 flex-row justify-start items-center`}>
                                                    <TouchableOpacity onPress={() => current !== 1 && setInitialState({...initialState, current: 1})} style={tw`h-[100%] w-16 px-1.5 justify-center items-center`}>
                                                        <Text style={tw`font-bold text-lg text-[${current === 1 ? Blue : '#adadad'}]`}>{`${año}`}</Text>
                                                    </TouchableOpacity>
                                                    <Text style={{color: '#adadad'}}> | </Text>
                                                    <TouchableOpacity onPress={() => current !== 2 && setInitialState({...initialState, current: 2})} style={tw`h-[100%] w-auto pl-2 pr-1.5 justify-center items-center`}>
                                                        <Text style={tw`font-bold text-lg text-[${current === 2 ? Blue : '#adadad'}]`}>{mes === 1 ? language === '1' ? 'Enero' : 'January' : mes === 2 ? language === '1' ? 'Febrero' : 'February' : mes === 3 ? language === '1' ? 'Marzo' : 'March' : mes === 4 ? language === '1' ? 'Abril' : 'April' : mes === 5 ? language === '1' ? 'Mayo' : 'May' : mes === 6 ? language === '1' ? 'Junio' : 'June' : mes === 7 ? language === '1' ? 'Julio' : 'July' : mes === 8 ? language === '1' ? 'Agosto' : 'August' : mes === 9 ? language === '1' ? 'Septiembre' : 'September' : mes === 10 ? language === '1' ? 'Octubre' : 'October' : mes === 11 ? language === '1' ? 'Noviembre' : 'November' : language === '1' ? 'Diciembre' : 'December'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={tw`h-[100%] w-auto justify-center items-center flex-row`}>
                                                    {
                                                        initialState.loading
                                                        ?
                                                            <>
                                                                <View style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('-') : handleChangeYear('-')}>
                                                                    <IonIcons name={'chevron-left'} size={26} color={Blue} />
                                                                </View>
                                                                <View style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('+') : handleChangeYear('+')}>
                                                                    <IonIcons name={'chevron-right'} size={26} color={Blue} />
                                                                </View>
                                                            </>
                                                        :
                                                            <>
                                                                <TouchableOpacity style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('-') : handleChangeYear('-')}>
                                                                    <IonIcons name={'chevron-left'} size={26} color={Blue} />
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('+') : handleChangeYear('+')}>
                                                                    <IonIcons name={'chevron-right'} size={26} color={Blue} />
                                                                </TouchableOpacity>
                                                            </>
                                                    }
                                                </View>
                                            </View>
                                    }
                                    <View style={tw`h-auto self-stretch justify-center items-center border-b border-b-[${Blue}] bg-[${Blue}] `}>
                                        <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 13}}>{active === 1 ? language === '1' ? 'Importante' : 'Important' : active === 2 ? language === '1' ? 'Informativo' : 'Informative' : active === 3 ? language === '1' ? 'Dinámicas' : 'Dinamics' : language === '1' ? 'Promociones' : 'Promotions'}</Text>
                                    </View>
                                </View>
                            </>
                        :
                            <></>
                    }
                </View>
            </View>
        )
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            <View style={{flex: 1, backgroundColor: '#fff', paddingBottom: 0}}>
                {
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        hasConnection
                        ?
                            <>
                                <HeaderPortrait title={language === '1' ? 'Gaceta' : 'Gazzete'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY} SubHeader={Header}/>
                                <Header />
                                <View style={[styles.container, {padding: 0}]}>
                                    {
                                        gaceta
                                        &&
                                            gaceta.length > 0 && !loading
                                            ?
                                                <FlatList
                                                    ref={refGaceta}
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={styles.list}
                                                    data={gaceta}
                                                    renderItem={({item}) => <Card title={item.gaceta_titulo} picture={item.gaceta_img_url} w={item.width} h={item.height}/>}
                                                    keyExtractor={item => String(item.id_gaceta)}
                                                    key={'_G'}
                                                />
                                            :
                                                !loading
                                                ?
                                                    <NotResults />
                                                :
                                                    <></>
                                    }
                                </View>
                                <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial} screen={2}/>
                            </>
                        :
                            <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                    :
                        hasConnection
                        ?
                            <>
                                <HeaderLandscape title={language === '1' ? 'Gaceta' : 'Gazzete'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY} SubHeader={Header}/>
                                <Header />
                                <View style={[styles.container, {padding: 0}]}>
                                    {
                                        gaceta
                                        &&
                                            gaceta.length > 0 && !loading
                                            ?
                                                <FlatList
                                                    ref={refGaceta}
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={styles.list}
                                                    data={gaceta}
                                                    renderItem={({item}) => <Card title={item.gaceta_titulo} picture={item.gaceta_img_url} w={item.width} h={item.height}/>}
                                                    keyExtractor={item => String(item.id_gaceta)}
                                                    key={'_G'}
                                                />
                                            :
                                                !loading
                                                ?
                                                    <NotResults />
                                                :
                                                    <></>
                                    }
                                </View>
                            </>
                        :
                            <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                }
            </View>
            <ModalLoading visibility={loading}/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '3%',
        backgroundColor: '#fff'
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        alignSelf: 'stretch',
        flexDirection: 'row',
        borderColor: '#383838',
        borderWidth: 1,
        marginBottom: 10,
        alignItems: 'center',
        padding: 8,
        borderRadius: 20
    },
    title: {
        fontSize: 13,
        color: Blue,
    },
    image: {
        width: '100%',
        height: '100%'
    },
    list:{
        height: 'auto',
        alignSelf: 'stretch',
        backgroundColor: '#fff'
    },
})