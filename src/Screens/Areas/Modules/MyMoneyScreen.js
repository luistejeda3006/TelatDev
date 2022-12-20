import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet,Text, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Alert, TouchableWithoutFeedback, FlatList, Platform} from 'react-native';
import {FailedNetwork, HeaderLandscape, HeaderPortrait, ModalLoading, Modal, Select, BottomNavBar, Title} from '../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useOrientation, useConnection, useNavigation, useScroll} from '../../../hooks';
import {isIphone, live, login, urlMoney} from '../../../access/requestedData';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground, Yellow} from '../../../colors/colorsApp';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectAgente, selectOperaciones, selectPeriodos, setAgente, setOperaciones, setPeriodos} from '../../../slices/moneySlice';
import {selectTokenInfo, selectUserInfo} from '../../../slices/varSlice';
import tw from 'twrnc'

let keyUserInfo = 'userInfo';
let keyTokenInfo = 'tokenInfo';
let token = null;
let user = null;
let data = null;
let id_usuario = null;
let cuenta = 0;
let agente = {}
let periodos = []
let operaciones = {}

export default ({navigation, route: {params: {language, orientation}}}) => {
    const dispatch = useDispatch()
    agente = useSelector(selectAgente)
    periodos = useSelector(selectPeriodos)
    operaciones = useSelector(selectOperaciones)
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)

    const [contador, setContador] = useState(0);
    const [visiblePeriodo, setVisiblePeriodo] = useState(false)
    const [visibleSummary, setVisibleSummary] = useState(false)
    const [date, setDate] = useState(false)
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const [currentPeriodo, setCurrentPeriodo] = useState('')
    const [initialState, setInitialState] = useState({
        loading: false,
        id_periodo: false,
        header_uno: true,
        header_dos: true,
        header_tres: true,
        
        header_cuatro: true,
        header_cinco: true,
        header_seis: true,
        header_siete: true,
        header_ocho: true,
        header_nueve: true,
        header_diez: true,
        fechas: [],
        detalle_dia: {
            'supervisor': '',
            'schedule': {
                'value': '',
                'background': '',
                'color': ''
            },
            'entry': '',
            'exit': '',
            'adjusted_shift': '',
            'lunch': '',
            'break': '',
            'bath': '',
            'ot_hr': '',
            'bit': '',
            'disco_sp': '',
            'vto': '',
            'disco_auth': '',
            'login': '',
            'logout': '',
            'status': {
                'value': '',
                'background': '',
                'color': ''
            },
            'connection': '',
            'login_conexion': '',
            'total_lunch': '',
            'total_break': '',
            'restroom': '',
            'excess_lunch': {
                'value': '',
                'color': ''
            },
            'excess_break': {
                'value': '',
                'color': ''
            },
            'excess_restroom': {
                'value': '',
                'color': ''
            },
            'excess_used': '',
            'excess_permitted': '',
            'excess_callwrapup': '',
            'excess_used_2': '',
            'excess_permitted2': '',
            'excess_inbounding': '',
            'excess_aux': {
                'value': '',
                'color': '',
                'background': ''
            },
            'aht': '',
            'calls': '',
            'adh': '',
            'late_approved': '',
            'campaing': '',
            'working': '',
            'conexion': '',
            'ot': ''
        },
        sectionActive: 1,
    })

    const {id_periodo, header_uno, header_dos, header_tres, header_cuatro, header_cinco, header_seis, header_siete, header_ocho, header_nueve, header_diez, loading, fechas, detalle_dia, sectionActive} = initialState;
    
    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });
    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)

    useEffect(async () => {
        id_usuario = user.data.datos_personales.id_usuario
    },[])

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );
    
    const llamada = async () => {
        try{
            if(cuenta === 0){
                cuenta = cuenta + 1;
                setInitialState({...initialState, loading: true})
            }

            const body = {
                'action': 'get_info_money',
                'data': {
                    'id_empleado': user.data.datos_personales.id_empleado,
                    'id_periodo': id_periodo,
                    'id_usuario': id_usuario
                },
                'live': live,
                'login': login
            }

            console.log('body: ', body)
            
            const request = await fetch(urlMoney, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            const {response, status} = await request.json();
            if(status === 200) {
                const body = {
                    'action': 'get_metricas',
                    'data': {
                        'id_empleado': user.data.datos_personales.id_empleado,
                        'id_periodo': id_periodo,
                        'id_usuario': id_usuario
                    },
                    'live': live,
                    'login': login
                }
        
                const request = await fetch(urlMoney, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(body)
                });
                
                const {response: respuestita, status: statusi} = await request.json();
                if(statusi === 200){
                    let obj = {
                        emp_numero: response.data.emp_numero,
                        foto: `https://telat.mx/intranet/upload/fotos/${response.data.emp_foto}`,
                        nombre: response.data.nombre,
                        puesto: response.data.puesto,
                        area: response.data.area,
                        subarea: response.data.subarea,
                        campanna: response.data.campanna,
                        extension: response.data.extension,
                        ubicacion: response.data.cand_ubicacion ? response.data.cand_ubicacion : 'EDIF. MONTERREY',
                    }
                    setTimeout(() => {
                        setCurrentPeriodo(!currentPeriodo ? response.quincenas[0].label : currentPeriodo)
                        dispatch(setPeriodos(response.quincenas))
                        dispatch(setOperaciones(response.my_money))
                        dispatch(setAgente(obj))
                        setInitialState({...initialState, fechas: respuestita, loading: false});
                    }, 800)
                }
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
            console.log('algo pasó con el internet')
            setInitialState({...initialState, loading: false})
            askForConnection()
        }
    }

    useEffect(() => {
        llamada()
    },[id_periodo, hasConnection])

    const Elemento = ({title, color = '#000', subtitle, half = false, last = false}) => {
        return(
            <View style={{height: 30, flexDirection: 'row', borderBottomWidth: last ? 2 : 0, borderBottomColor: last ? Blue : 'transparent', borderColor: Blue, borderLeftWidth: 2, borderRightWidth: 2, borderBottomStartRadius: last ? 15 : 0, borderBottomEndRadius: last ? 15 : 0}}>
                <View style={{flex: 2, justifyContent: 'center', backgroundColor: '#fff', padding: 4, borderColor: Blue, borderBottomStartRadius: last ? 15 : 0, paddingLeft: 18}}>
                    <Text style={{fontWeight: '600', fontSize: 14, color: '#000'}}>{title}</Text>
                </View>
                <View style={{width: half ? '50%' : 100, paddingRight: 18, borderColor: Blue, justifyContent: 'center', alignItems: 'flex-end', borderBottomEndRadius: last ? 15 : 0}}>
                    <Text style={{fontWeight: 'bold', fontSize: 13, color: color}}>{subtitle}</Text>
                </View>
            </View>
        )
    }

    const Header = ({icon = 'check', title = '', tipo = 1, id, hide, first = false}) => {
        return (
            <TouchableOpacity style={{height: 45, alignSelf: 'stretch', paddingHorizontal: 12, backgroundColor: Blue, borderColor: Blue, borderWidth: 2, marginTop: first ? 0 : 15, justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 15, borderTopEndRadius: 15, borderBottomStartRadius: !hide ? 15 : 0, borderBottomEndRadius: !hide ? 15 : 0}} onPress={() => handleVisible(id)}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: 'auto', justifyContent: 'center'}}>
                        <Icon name={'chevron-up'} size={16} color={'transparent'} />
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8}}>
                        <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>{title}</Text>
                    </View>
                    <View style={{width: 'auto', justifyContent: 'center'}}>
                        {
                            hide
                            ?
                                <Icon name={'chevron-up'} size={16} color={'#fff'} />
                            :
                                <Icon name={'chevron-down'} size={16} color={'#fff'} />
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    const handleVisible = (id) => {
        switch (id) {
            case 1:
                setInitialState({...initialState, header_uno: !header_uno})
              break;
            case 2:
                setInitialState({...initialState, header_dos: !header_dos})
              break;
            case 3:
                setInitialState({...initialState, header_tres: !header_tres})
              break;
            case 4:
                setInitialState({...initialState, header_cuatro: !header_cuatro})
              break;
            case 5:
                setInitialState({...initialState, header_cinco: !header_cinco})
              break;
            case 6:
                setInitialState({...initialState, header_seis: !header_seis})
              break;
            case 7:
                setInitialState({...initialState, header_siete: !header_siete})
              break;
            case 8:
                setInitialState({...initialState, header_ocho: !header_ocho})
              break;
            case 9:
                setInitialState({...initialState, header_nueve: !header_nueve})
              break;
            default:
                setInitialState({...initialState, header_diez: !header_diez})
              break;
        }
    }

    const handleVisiblePeriodos = () => {
        setVisiblePeriodo(!visiblePeriodo)
    }

    const handleActionUno = (value, label) => {
        cuenta = 0;
        setInitialState({...initialState, id_periodo: value})
        setCurrentPeriodo(label)
    }

    const handleDayDetail = async (id, completa) => {
        setInitialState({...initialState, loading: true})
        try{
            const body = {
                'action': 'get_detalle_dia',
                'data': {
                    'id_dia': id,
                    'id_usuario': id_usuario
                },
                'live': true,
                'login': 'App-Telat'
            }
    
            const request = await fetch(urlMoney, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            const {response, status} = await request.json();
            if(status === 200){
                setInitialState({...initialState, detalle_dia: response, loading: false})
                setVisibleSummary(!visibleSummary)
                setDate(completa)
            }
        }catch(e){
            console.log('algo pasó con el internet')
            askForConnection()
        }

    }

    const Quincenas = ({id, title, background, color, dia, fecha, btn, completa}) => {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6, alignSelf: 'stretch', backgroundColor: '#fff'}}>
                {
                    btn
                    ?
                        <TouchableOpacity style={{height: 90, alignSelf: 'stretch', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#d1d1d1', marginBottom: 8, marginHorizontal: 2.5, shadowColor: '#000', elevation: 5, shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.34,
                        shadowRadius: 6.27, borderRadius: 15}} onPress={() => handleDayDetail(id, completa)}>
                            <View style={{height: 30, alignSelf: 'stretch', flexDirection: 'row'}}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', alignSelf: 'stretch'}}>
                                    <Text style={{fontSize: 13, color: '#000'}}>{dia}</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: 4}}>
                                    <Text style={{color: '#dadada'}}>| </Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'stretch'}}>
                                    <Text style={{fontSize: 12, color: '#000'}}>{fecha}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', backgroundColor: background, paddingBottom: title ? 0 : 10, borderBottomStartRadius: 15, borderBottomEndRadius: 15}}>
                                {
                                    title
                                    ?
                                        <Text style={{fontSize: 14, fontWeight: 'bold', color: color, textAlign: 'center'}}>{title}</Text>
                                    :
                                        <Icon name={'folder-open'} size={28} color={Yellow} />
                                }
                            </View>
                        </TouchableOpacity>
                    :
                        <View style={{height: 90, alignSelf: 'stretch', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#d1d1d1', marginBottom: 8, marginHorizontal: 2.5, borderRadius: 15, shadowColor: '#000', elevation: 5, shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.34,
                        shadowRadius: 6.27, borderRadius: 15}}>
                            <View style={{height: 30, alignSelf: 'stretch', flexDirection: 'row'}}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', alignSelf: 'stretch'}}>
                                    <Text style={{fontSize: 13, color: '#000'}}>{dia}</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: 4}}>
                                    <Text style={{color: '#dadada'}}>| </Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'stretch'}}>
                                    <Text style={{fontSize: 12, color: '#000'}}>{fecha}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', backgroundColor: background, paddingBottom: title ? 0 : 10, borderBottomStartRadius: 15, borderBottomEndRadius: 15}}>
                                {
                                    title
                                    ?
                                        <Text style={{fontSize: 14, fontWeight: 'bold', color: color, textAlign: 'center'}}>{title}</Text>
                                    :
                                        <Icon name={'folder-open'} size={28} color={Yellow} />
                                }
                            </View>
                        </View>
                }
            </View>
        )
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
            <View style={styles.container}>
                {
                    hasConnection
                    ?
                        <>
                            {
                                orientationInfo.initial === 'PORTRAIT'
                                ?
                                    <HeaderPortrait title={'My Money'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                                :
                                    <HeaderLandscape title={'My Money'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                            }
                            
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch'}}
                                /* contentContainerStyle={{paddingTop: paddingTop}}
                                onScroll={(e) => handleScroll(e)} */
                            >
                                <View style={{height: 'auto', alignSelf: 'stretch', marginTop: '3%'}}>
                                    <View style={{height: 'auto', alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={tw`w-47.5 h-47.5 rounded-full justify-center items-center border-8 border-[#dadada] my-5`}>
                                            {
                                                agente.foto
                                                ?
                                                    <Image
                                                        style={tw`w-43 h-43 rounded-full`}
                                                        resizeMode={'cover'}
                                                        source={{uri: `${agente.foto}`}}
                                                    />
                                                :
                                                    <Image
                                                        style={tw`w-43 h-43 rounded-full`}
                                                        resizeMode={'cover'}
                                                        source={require('../../../../assets/user.png')}
                                                    />
                                            }
                                        </View>
                                    </View>
                                    
                                    <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', padding: 10, backgroundColor: '#fff', shadowColor: '#000', elevation: 5, shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.34,
                                    shadowRadius: 6.27, borderRadius: 15, marginTop: 10, marginHorizontal: isIphone ? '5%' : '3%'}}
                                    >
                                        <View style={{flexDirection: 'row', alignItems: 'center', height: 23, justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{height: 'auto', flex: 1, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                                <View style={{width: 'auto', height: 23, justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingHorizontal: 6, borderRadius: 5}}>
                                                    <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>{agente.emp_numero}</Text>
                                                </View>
                                                <View style={{flex: 1, height: 23, marginLeft: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', borderRadius: 5}}>
                                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{agente.nombre}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                                            <Text style={{fontSize: 14.5, fontWeight: 'bold', color: Blue}}>{agente.puesto ? agente.puesto : '-----'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', marginTop: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Area'}</Text>
                                                <Text style={{color: '#000'}}>{agente.area}</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', marginTop: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Sub-area'}</Text>
                                                <Text style={{fontSize: 14, color: '#000'}}>{agente.subarea}</Text>
                                            </View>

                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Campaign'}</Text>
                                                <Text style={{fontSize: 14, color: '#000'}}>{agente.campanna}</Text>
                                            </View>
                                        </View>

                                        <View style={{flexDirection: 'row', marginTop: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Extension'}</Text>
                                                <Text style={{fontSize: 14, color: '#000'}}>{agente.extension}</Text>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Location'}</Text>
                                                <Text style={{fontSize: 14, color: '#000'}}>{agente.ubicacion}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity style={[styles.picker, tw`shadow-md`, {flexDirection: 'row', marginTop: 25}]} onPress={() => handleVisiblePeriodos()}>
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 17, color: '#000'}}>{currentPeriodo}</Text>
                                    </View>
                                    <View style={{width: 'auto'}}>
                                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                    </View>
                                </TouchableOpacity>

                                <View style={{height: 50, alignSelf: 'stretch', flexDirection: 'row', borderColor: '#3283c5', borderWidth: 1, backgroundColor: '#fff', borderRadius: 16, marginBottom: 10, marginHorizontal: isIphone ? '5%' : '3%'}}>
                                    <TouchableWithoutFeedback onPress={() => sectionActive !== 1 && setInitialState({...initialState, sectionActive: 1})}>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)', borderTopStartRadius: 16, borderBottomStartRadius: 16}}>
                                            <IonIcons name={'currency-usd'} size={28} color={sectionActive === 1 ? '#3283c5' : '#C1C1C1'} />
                                            <Text style={{marginLeft: 6, fontSize: 15, fontWeight: 'bold', color: sectionActive === 1 ? '#3283c5' : '#c1c1c1'}}>Details</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => sectionActive !== 2 && setInitialState({...initialState, sectionActive: 2})}>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)', borderTopEndRadius: 16, borderBottomEndRadius: 16}}>
                                            <IonIcons name={'calendar-range'} size={28} color={sectionActive === 2 ? '#3283c5' : '#C1C1C1'} />
                                            <Text style={{marginLeft: 6, fontSize: 15, fontWeight: 'bold', color: sectionActive === 2 ? '#3283c5' : '#c1c1c1'}}>Metrics</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                {
                                    sectionActive === 1
                                    ?
                                        <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 25, marginTop: 15, paddingHorizontal: 10, paddingTop: 5, paddingBottom: 20, backgroundColor: '#fff', shadowColor: '#000', elevation: 5, shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.34,
                                        shadowRadius: 6.27, borderRadius: 15, marginHorizontal: isIphone ? '5%' : '3%'}}>
                                            {/* <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8, paddingBottom: 8, borderBottomColor: Blue, borderBottomWidth: 1, marginTop: 10}}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={{width: 'auto', justifyContent: 'center'}}>
                                                        <IonIcons name={'currency-usd'} size={24} color={Yellow} />
                                                    </View>
                                                    <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 8}}>
                                                        <Text style={{fontWeight: 'bold', color: Blue, fontSize: 18}}>{'My Money Details'}</Text>
                                                    </View>
                                                </View>
                                            </View> */}
                                            <Title icon={'user'} tipo={1} hasBottom={false} title={'My Money Details'}/>
                                            <Header title={'Operations'} id={1} hide={header_uno} first={true}/>
                                            {
                                                header_uno
                                                &&
                                                    <>
                                                        <Elemento title={'Work Days'} subtitle={operaciones.mym_work_days ? operaciones.mym_work_days : '0'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Decimal Hours'} subtitle={operaciones.mym_decimal_hours ? operaciones.mym_decimal_hours : '0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Productivity Bonus'} subtitle={operaciones.mym_productivity_2 ? `$${operaciones.mym_productivity_2}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Excelence Bonus'} subtitle={operaciones.mym_excelence_2 ? `$${operaciones.mym_excelence_2}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Attendance Bonus'} subtitle={operaciones.mym_attendance_2 ? `$${operaciones.mym_attendance_2}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Tenure Bonus'} subtitle={operaciones.mym_tenure_2 ? `$${operaciones.mym_tenure_2}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Certification Bonus'} subtitle={operaciones.mym_certification_2 ? `$${operaciones.mym_certification_2}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Transportation Bonus'} subtitle={operaciones.mym_transportation ? `$${operaciones.mym_transportation}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Uncertified Hours'} subtitle={operaciones.mym_uncertified_hours_2 ? `$${operaciones.mym_uncertified_hours_2}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Holiday'} subtitle={operaciones.mym_holiday ? `$${operaciones.mym_holiday}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Special OT'} subtitle={operaciones.my_especial_ot ? `$${operaciones.my_especial_ot}` : '$0.00'} titleBackground={'#E2EFDA'}/>
                                                        <Elemento title={'Payment per Hour'} subtitle={operaciones.mym_payment_per_hour ? `$${operaciones.mym_payment_per_hour}` : '$0.00'} titleBackground={'#E2EFDA'} last={true}/>
                                                    </>  
                                            }
                            
                                            <Header title={'Additionals'} id={2} icon={'plus'} hide={header_dos}/>
                                            {
                                                header_dos
                                                && 
                                                    <>
                                                        <Elemento title={'Retroactive Adjustments'} subtitle={operaciones.mym_retroactive_adjustments ? `$${operaciones.mym_retroactive_adjustments}` : '$0.00'} titleBackground={'#FFE699'}/>
                                                        <Elemento title={'Welcome Bonus'} subtitle={operaciones.bono_bienvenida ? `$${operaciones.bono_bienvenida}` : '$0.00'} titleBackground={'#FFE699'}/>
                                                        <Elemento title={'Referral Bonus'} subtitle={operaciones.bono_referidos ? `$${operaciones.bono_referidos}` : '$0.00'} titleBackground={'#FFE699'}/>
                                                        <Elemento title={'Equipment Transportation Bonus'} subtitle={operaciones.bono_transporte ? `$${operaciones.bono_transporte}` : '$0.00'} titleBackground={'#FFE699'}/>
                                                        <Elemento title={'Compliment Calls'} subtitle={operaciones.bono_cc ? `$${operaciones.bono_cc}` : '$0.00'} titleBackground={'#FFE699'}/>
                                                        <Elemento title={'Salary Permits'} subtitle={operaciones.mym_salary_permits ? `$${operaciones.mym_salary_permits}` : '$0.00'} titleBackground={'#FFE699'}/>
                                                        <Elemento title={'Vacations'} subtitle={operaciones.mym_vacations ? `$${operaciones.mym_vacations}` : '$0.00'} titleBackground={'#FFE699'}/>
                                                        <Elemento title={'Work Accesories'} subtitle={operaciones.mym_work_accessories ? `$${operaciones.mym_work_accessories}` : '$0.00'} titleBackground={'#FFE699'} last={true}/>
                                                    </>
                                            }

                                            <Header title={'Totals'} icon={'currency-usd'} tipo={2} id={3} hide={header_tres}/>
                                            {
                                                header_tres
                                                &&
                                                    <>
                                                        <Elemento title={'Subtotal'} subtitle={operaciones.mym_subtotal ? `$${operaciones.mym_subtotal}` : '$0.00'} titleBackground={'#00B0F0'}/>
                                                        <Elemento title={'Aditionals'} subtitle={operaciones.adicional ? `$${operaciones.adicional}` : '$0.00'} titleBackground={'#00B0F0'}/>
                                                        <Elemento title={'Discounts for Incidents'} subtitle={operaciones.mym_discounts_incidents ? `${operaciones.mym_discounts_incidents}` : '0'} titleBackground={'#00B0F0'}/>
                                                        <Elemento title={'Total Discount Incidents'} subtitle={operaciones.discount_daily ? `$${operaciones.discount_daily}` : '$0.00'} titleBackground={'#00B0F0'}/>
                                                        <Elemento title={'Total'} subtitle={operaciones.total ? `$${operaciones.total}` : '$0.00'} titleBackground={'#00B0F0'} last={true}/>
                                                    </>
                                            }
                                        </View>
                                    :
                                        <View style={{flex: 1, alignSelf: 'stretch', paddingHorizontal: 10, paddingVertical: 5, marginVertical: 15, backgroundColor: '#fff', shadowColor: '#000', elevation: 5, shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.34,
                                        shadowRadius: 6.27, borderRadius: 15, marginBottom: 15, marginHorizontal: isIphone ? '5%' : '3%'}}>
                                            <View style={{height: 'auto', alignSelf: 'stretch' }}>
                                                <Title icon={'user'} tipo={1} hasBottom={false} title={'Metrics'}/>
                                                <FlatList
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={styles.list}
                                                    data={fechas}
                                                    numColumns={orientationInfo.initial === 'PORTRAIT' ? 3 : 5}
                                                    renderItem={({item}) => <Quincenas id={item.id} title={item.title} background={item.background} color={item.color} dia={item.dia} fecha={item.fecha} btn={item.btn} completa={item.completa}/>}
                                                    keyExtractor={item => String(item.id)}
                                                    key={orientationInfo.initial === 'PORTRAIT' ? '_1' : '_2'}
                                                />
                                            </View>
                                        </View>
                                }
                            </ScrollView>
                            <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                        </>
                    :
                        <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                }
            </View>
            
            <ModalLoading visibility={loading}/>
            
            <Modal orientation={orientationInfo.initial} visibility={visiblePeriodo} handleDismiss={handleVisiblePeriodos}>
                <Select data={periodos} handleVisiblePeriodos={handleVisiblePeriodos} handleActionUno={handleActionUno} />
            </Modal>

            <Modal orientation={orientationInfo.initial} visibility={visibleSummary} handleDismiss={() => setVisibleSummary(!visibleSummary)}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{height: 'auto', alignSelf: 'stretch'}}>
                        <View style={{flexDirection: 'row', height: 'auto', alignSelf: 'stretch', marginBottom: 17}}>
                            <View style={{width: 30, justifyContent: 'center', alignItems: 'center'}}>
                                <IonIcons name={'close'} size={35} color={'transparent'} />
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontWeight: 'bold', color: '#383838', fontSize: 18}}>{`Summary ${date}`}</Text>
                            </View>
                            <TouchableOpacity style={{width: 30, justifyContent: 'center', alignItems: 'center'}} onPress={() => setVisibleSummary(!visibleSummary)}>
                                <IonIcons name={'close'} size={35} color={'#383838'} />
                            </TouchableOpacity>
                        </View>
                        <Header title={'Agent Information'} id={4} hide={header_cuatro} icon={'user'} first={true}/>
                        {
                            header_cuatro
                            &&
                                <>
                                    <Elemento title={'Supervisor'} subtitle={detalle_dia.supervisor ? detalle_dia.supervisor : ''} half={true}/>
                                    <Elemento title={'Schedule'} subtitle={detalle_dia.schedule.value ? detalle_dia.schedule.value : ''} half={true}/>
                                    <Elemento title={'Entry'} subtitle={detalle_dia.entry ? detalle_dia.entry : ''} half={true}/>
                                    <Elemento title={'Exit'} subtitle={detalle_dia.exit ? detalle_dia.exit : ''} half={true}/>
                                    <Elemento title={'Adjusted shift'} subtitle={detalle_dia.adjusted_shift ? detalle_dia.adjusted_shift : ''} half={true}/>
                                    <Elemento title={'Lunch'} subtitle={detalle_dia.lunch ? detalle_dia.lunch : ''} half={true}/>
                                    <Elemento title={'Break'} subtitle={detalle_dia.break ? detalle_dia.break : ''} half={true}/>
                                    <Elemento title={'Bath'} subtitle={detalle_dia.bath ? detalle_dia.bath : ''} half={true} last={true}/>
                                </>  
                        }
        
                        <Header title={`Discos & VTO's`} id={5} icon={'hand-pointing-right'} tipo={2} hide={header_cinco}/>
                        {
                            header_cinco
                            && 
                                <>
                                    <Elemento title={'OT(HR)'} subtitle={detalle_dia.ot_hr ? detalle_dia.ot_hr : ''} half={true}/>
                                    <Elemento title={'BIT QA'} subtitle={detalle_dia.bit ? detalle_dia.bit : ''} half={true}/>
                                    <Elemento title={'DISCO S/P'} subtitle={detalle_dia.disco_sp ? detalle_dia.disco_sp : ''} half={true}/>
                                    <Elemento title={'VTO'} subtitle={detalle_dia.vto ? detalle_dia.vto : ''} half={true}/>
                                    <Elemento title={'DISCO AUTH'} subtitle={detalle_dia.disco_auth ? detalle_dia.disco_auth : ''} half={true} last={true}/>
                                </>
                        }

                        <Header title={'Agent Login Information'} icon={'login'} tipo={2} id={6} hide={header_seis}/>
                        {
                            header_seis
                            &&
                                <>
                                    <Elemento title={'Login'} subtitle={detalle_dia.login ? detalle_dia.login : ''} half={true}/>
                                    <Elemento title={'Logout'} subtitle={detalle_dia.logout ? detalle_dia.logout : ''} half={true}/>
                                    <Elemento title={'Status'} subtitle={detalle_dia.status.value ? detalle_dia.status.value : ''} half={true} subtitleBackground={detalle_dia.status.background} color={detalle_dia.status.color}/>
                                    <Elemento title={'Connection'} subtitle={detalle_dia.connection ? detalle_dia.connection : ''} half={true}/>
                                    <Elemento title={'#Login'} subtitle={detalle_dia.login_conexion ? detalle_dia.login_conexion : ''} half={true} last={true}/>
                                </>
                        }

                        <Header title={'Total Auxiliaries'} icon={'calculator'} tipo={2} id={7} hide={header_siete}/>
                        {
                            header_siete
                            &&
                                <>
                                    <Elemento title={'Lunch'} subtitle={detalle_dia.total_lunch ? detalle_dia.total_lunch : ''} half={true}/>
                                    <Elemento title={'Break'} subtitle={detalle_dia.total_break ? detalle_dia.total_break : ''} half={true}/>
                                    <Elemento title={'Restroom'} subtitle={detalle_dia.restroom ? detalle_dia.restroom : ''} half={true} last={true}/>
                                </>
                        }

                        <Header title={'Excesses'} icon={'clock'} tipo={2} id={8} hide={header_ocho}/>
                        {
                            header_ocho
                            &&
                                <>
                                    <Elemento title={'Excess Lunch'} subtitle={detalle_dia.excess_lunch.value ? detalle_dia.excess_lunch.value : ''} color={detalle_dia.excess_lunch.color} half={true}/>
                                    <Elemento title={'Break'} subtitle={detalle_dia.excess_break.value ? detalle_dia.excess_break.value : ''} color={detalle_dia.excess_break.color} half={true}/>
                                    <Elemento title={'Restroom'} subtitle={detalle_dia.excess_restroom.value ? detalle_dia.excess_restroom.value : ''} color={detalle_dia.excess_restroom.color} half={true}/>
                                    <Elemento title={'Used'} subtitle={detalle_dia.excess_used ? detalle_dia.excess_used : ''} half={true}/>
                                    <Elemento title={'Permitted'} subtitle={detalle_dia.excess_permitted ? detalle_dia.excess_permitted : ''} half={true}/>
                                    <Elemento title={'Call Wrap-up'} subtitle={detalle_dia.excess_callwrapup ? detalle_dia.excess_callwrapup : ''} half={true}/>
                                    <Elemento title={'Used'} subtitle={detalle_dia.excess_used_2} half={true}/>
                                    <Elemento title={'Permitted'} subtitle={detalle_dia.excess_permitted2 ? detalle_dia.excess_permitted2 : ''} half={true}/>
                                    <Elemento title={'InboundPending'} subtitle={detalle_dia.excess_inbounding ? detalle_dia.excess_inbounding : ''} half={true} last={true}/>
                                </>
                        }

                        <Header title={'Agent Metrics'} icon={'calendar'} tipo={2} id={9} hide={header_nueve}/>
                        {
                            header_nueve
                            &&
                                <>
                                    <Elemento title={'Excess AUX'} subtitle={detalle_dia.excess_aux.value ? detalle_dia.excess_aux.value : ''} color={detalle_dia.excess_aux.color} subtitleBackground={detalle_dia.excess_aux.background} half={true}/>
                                    <Elemento title={'AHT'} subtitle={detalle_dia.aht ? detalle_dia.aht : ''} half={true}/>
                                    <Elemento title={'Calls'} subtitle={detalle_dia.calls ? detalle_dia.calls : ''} half={true}/>
                                    <Elemento title={'ADH'} subtitle={''} subtitleBackground={detalle_dia.adh ? detalle_dia.adh : ''} half={true} last={true}/>
                                </>
                        }

                        <Header title={'Other'} icon={'bars'} id={10} hide={header_diez}/>
                        {
                            header_diez
                            &&
                                <>
                                    <Elemento title={'Late Approved'} subtitle={detalle_dia.late_approved ? detalle_dia.late_approved : ''} half={true}/>
                                    <Elemento title={'Campaign'} subtitle={detalle_dia.campaing ? detalle_dia.campaing : ''} half={true}/>
                                    <Elemento title={'Working Day'} subtitle={detalle_dia.working ? detalle_dia.working : ''} half={true}/>
                                    <Elemento title={'Connection'} subtitle={detalle_dia.conexion ? detalle_dia.conexion : ''} half={true}/>
                                    <Elemento title={'OT'} subtitle={detalle_dia.ot ? detalle_dia.ot : ''} half={true} last={true}/>
                                </>
                        }
                    </View>
                </ScrollView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    list:{
        height: 'auto',
        alignSelf: 'stretch',
    },
    image: {
        width: 155,
        height: 155,
        borderRadius: 130,
    },
    gradient: {
        width: 185,
        height: 185,
        borderRadius: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 13,
        color: Blue,
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        height: 50,
        paddingHorizontal: 16,
        alignSelf: 'stretch',
        borderRadius: 16,
        marginHorizontal: isIphone ? '5%' : '3%',
        backgroundColor: '#fff'
    },
})