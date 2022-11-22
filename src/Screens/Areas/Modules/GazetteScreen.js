import React, {useState, useEffect, useRef, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ImageBackground, StatusBar, SafeAreaView, FlatList, Alert, Platform, Image, TouchableWithoutFeedback} from 'react-native';
import {BottomNavBar, Calendar, FailedNetwork, HeaderLandscape, HeaderPortrait, ModalLoading} from '../../../components';
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
        hide: false
    })

    const {active, initial, ending, data, hide, labelInitial, labelEnding} = initialState;
    
    const getGaceta = async () => {
        try{
            setLoading(true)
            const body = {
                'action': 'get_gaceta',
                'data': {
                    'fecha_inicio': initial,
                    'fecha_fin': ending,
                    'idioma': tipo === 'MX' ? language : '2',
                    'id_usuario': id_usuario
                },
                'live': live,
                'login': login
            }

            const request = await fetch(urlGaceta, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });

            const {response} = await request.json();
            if(response.status === 200){
                setTimeout(() => {
                    setInitialState({...initialState, data: response})
                    setLoading(false)
                }, 500)
            }
            else if(response.status === 401){
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
    
            else if(response.status === 406){
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
    },[initial, ending])

    const handleChangeModule = (id) => {
        refGaceta.current?.scrollToOffset({ animated: true, offset: 0 })
        setReload(true)
        setInitialState({...initialState, active: id})
    }

    useEffect(() => {
        setTimeout(() => {
            setReload(false)
        },1000)
    },[reload])

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
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
                        </View>
                    </>
                }
            </Animatable.View>
        )
    }

    const Header = () => {
        return(
            <View style={{height: !isIphone ? !hide ? 240 : 150 : 'auto', alignSelf: 'stretch'}}>
                <View style={{height: 50, alignSelf: 'stretch', flexDirection: 'row', borderColor: '#3283c5', borderWidth: 1, backgroundColor: '#fff'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)'}}>
                        <TouchableWithoutFeedback onPress={() => active !== 1 && handleChangeModule(1)}>
                            <View style={{flex:1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name='alert' size={28} color={active === 1 ? '#3283c5' : '#c1c1c1'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)'}}>
                        <TouchableWithoutFeedback onPress={() => active !== 2 && handleChangeModule(2)}>
                            <View style={{flex:1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name='information' size={28} color={active === 2 ? '#3283c5' : '#c1c1c1'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)'}}>
                        <TouchableWithoutFeedback onPress={() => active !== 3 && handleChangeModule(3)}>
                            <View style={{flex:1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name={'bullseye-arrow'} size={28} color={active === 3 ? '#3283c5' : '#c1c1c1'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)'}}>
                        <TouchableWithoutFeedback onPress={() => active !== 4 && handleChangeModule(4)}>
                            <View style={{flex:1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name='trophy' size={28} color={active === 4 ? '#3283c5' : '#c1c1c1'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={{height: !isIphone ? 190 : 'auto'}}>
                    {
                        orientationInfo.initial === 'PORTRAIT'
                        ?
                            <>
                                <TouchableOpacity style={{alignSelf: 'stretch'}} onPress={() => setInitialState({...initialState, hide: !hide, show_end: false})}>
                                    <View style={{height: 'auto', alignSelf: 'stretch', paddingTop: '3%', paddingHorizontal: '3%', borderBottomColor: '#adadad', borderBottomWidth: 1, paddingBottom: '3%', backgroundColor: '#fff'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
                                                <IonIcons name={'newspaper'} size={28} color='transparent' />
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8}}>
                                                <Text style={{fontWeight: 'bold', color: '#383838', fontSize: 20}}>{active === 1 ? language === '1' ? 'Importante' : 'Important' : active === 2 ? language === '1' ? 'Informativo' : 'Informative' : active === 3 ? language === '1' ? 'Dinámicas' : 'Dinamics' : language === '1' ? 'Promociones' : 'Promotions'}</Text>
                                            </View>
                                            <View style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
                                            {
                                                hide
                                                ?
                                                    <Icon name={'chevron-down'} size={16} color={'#383838'} />
                                                :
                                                    <Icon name={'chevron-up'} size={16} color={'#383838'} />
                                            }
                                            </View>
                                        </View>
                                    </View>
                                    {
                                        !hide
                                        &&
                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', height: 65, paddingHorizontal: '3%', backgroundColor: '#fff', paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#adadad'}}>
                                                <Calendar dateLabel={labelInitial} isModule={true} shortFormat={false} getValue={(value, label) => setInitialState({...initialState, initial: value, labelInitial: label})} language={language} />
                                                <View style={{width: 6}}></View>
                                                <Calendar dateLabel={labelEnding} isModule={true} shortFormat={false} getValue={(value, label) => setInitialState({...initialState, ending: value, labelEnding: label})} language={language} />
                                            </View>
                                    }
                                </TouchableOpacity>
                            </>
                        :
                            <></>
                    }
                </View>
            </View>
        )
    }

    return(
        <View style={{backgroundColor: '#fff', flex: 1}}>
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
                            {
                                isIphone
                                &&
                                    <Header />
                            }
                            <View style={[styles.container, {padding: 0}]}>
                                {
                                    !loading
                                    &&
                                        <FlatList
                                            ref={refGaceta}
                                            onScroll={handleScroll}
                                            contentContainerStyle={{paddingTop: !isIphone ? !hide ? paddingTop + 175 : paddingTop + 103 : 0}}
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            style={styles.list}
                                            data={active === 1 ? data.importante : active === 2 ? data.informativo : active === 3 ? data.dinamicas : data.promociones}
                                            renderItem={({item}) => <Card title={item.gaceta_titulo} picture={item.gaceta_img_url} w={item.width} h={item.height}/>}
                                            keyExtractor={item => String(item.id_gaceta)}
                                        />
                                }
                            </View>
                        </>
                    :
                        <>
                            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			                <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                            <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                        </>
                :
                    hasConnection
                    ?
                        <>
                            <HeaderLandscape title={language === '1' ? 'Gaceta' : 'Gazzete'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY} SubHeader={Header}/>
                            <View style={[styles.container, {padding: 0}]}>
                                {
                                    !loading
                                    &&
                                        <FlatList
                                            ref={refGaceta}
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            style={styles.list}
                                            data={active === 1 ? data.importante : active === 2 ? data.informativo : active === 3 ? data.dinamicas : data.promociones}
                                            renderItem={({item}) => <Card title={item.gaceta_titulo} picture={item.gaceta_img_url} w={item.width} h={item.height}/>}
                                            keyExtractor={item => String(item.id_gaceta)}
                                            onScroll={handleScroll}
                                            contentContainerStyle={{paddingTop: paddingTop + 50}}
                                        />
                                }
                            </View>
                        </>
                    :
                        <>
                            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			                <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />¡
                            <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                        </>
                }
                </View>
                <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial} screen={2}/>
                <ModalLoading visibility={loading}/>
        </View>
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