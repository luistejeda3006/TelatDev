import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, SafeAreaView, StatusBar, ScrollView, TouchableWithoutFeedback, Platform, Image, useWindowDimensions} from 'react-native';
import {HeaderLandscape, HeaderPortrait, Modal, ModalLoading, Select, FailedNetwork, CheckBox, Switch, MultiText, Input, MaskInput, Title, BottomNavBar} from '../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Picker from 'react-native-picker-select';
import {useConnection, useNavigation, useOrientation, useScroll} from '../../../hooks';
import DeviceInfo from 'react-native-device-info';
import {urlNomina, live, login, isIphone} from '../../../access/requestedData';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp';
import {useDispatch, useSelector} from 'react-redux';
import {selectBonos, selectFechas, selectHasBono, selectInfo, selectMensual, selectPeriodos, selectQuincena, setBonos, setFechas, setHasBono, setInfo, setMensual, setPeriodos, setQuincena} from '../../../slices/prenominaSlice';
import useKeyboardHeight from 'react-native-use-keyboard-height'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFocusEffect} from '@react-navigation/native';
import {selectTokenInfo, selectUserInfo} from '../../../slices/varSlice';
import tw from 'twrnc';

let keyUserInfo = 'userInfo';
let keyTokenInfo = 'tokenInfo';
let token = null;
let data = null;
let bonus = {};
let params = {};
let cuenta = 0;
let cuentaAsistencia = 0;

let fechas = null;
let periodos = null;
let info = null;
let bonos = null
let has_bono = null;
let mensual = null;
let quincena = null;


export default ({navigation, route: {params: {language, orientation, id_puesto, id_usuario, btn_editar = false, origin = 1}}}) => {

    token = useSelector(selectTokenInfo)
    data = useSelector(selectUserInfo)

    const [contentBottom, setContentBottom] = useState(0);
    const [keyboardActive, setKeyboardActive] = useState(false)

    const {height} = useWindowDimensions()
    const keyHeight = useKeyboardHeight()

    useEffect(() => {  
        if (keyboardActive){
          const diff = (parseFloat((height - keyHeight)/2))
          setContentBottom(diff)
        } else {
          setContentBottom(0)
        }
    },[keyHeight, keyboardActive])

    const dispatch = useDispatch()
    fechas = useSelector(selectFechas)
    periodos = useSelector(selectPeriodos)
    info = useSelector(selectInfo)
    bonos = useSelector(selectBonos)
    has_bono = useSelector(selectHasBono)
    mensual = useSelector(selectMensual)
    quincena = useSelector(selectQuincena)

    const {isTablet} = DeviceInfo;
    const [contador, setContador] = useState(Math.random().toString());
    const [visiblePeriodo, setVisiblePeriodo] = useState(false)
    const [visibleAsistencia, setVisibleAsistencia] = useState(false)
    const [deleteVisibility, setDeleteVisibility] = useState(false)

    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(origin === 1 ? false : true)
    const [idEdit, setIdEdit] = useState(0)
    const [idDelete, setIdDelete] = useState(0)
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const [comentarios, setComentarios] = useState([])
    const [id_periodo, setIdPeriodo] = useState(false)
    const [currentPeriodo, setCurrentPeriodo] = useState('')
    const [error, setError] = useState(false)
    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const {translateY, paddingTop, handleScroll} = useScroll(orientationInfo.initial);

    useFocusEffect(
        useCallback(() => {
            handlePath(origin === 1 ? 'Dashboard' : 'GeneralPrenomine')
        }, [])
    );
    
    const [initialState, setInitialState] = useState({
        fecha: [],
        periodos: [],
        checadas: [],
        info_resumen: {},
        info: {},
        asistencia: {},
        incidencias: [],
        currentId: 1,
        has_bono: 0,
        mensual: false,
        quincena: '',
        date: '',
        bonos: {},
        calendar: false,
        resume: false,
        editForm: {
            //modal de caja
            id_asistencia: false,
            currentAsistencia: '',
            isTurnOn: true,
            horario: '',
            comment: '',
            asistencias: [],
            lunch_time: false,
            showComment: false,
            
            //modal de menu
            visibleMenu: false,
            active: 1,
            lun_jue: '',
            vier: '',
            sab: '',
            dom: '',
            bono: '',
            bonoComment: '',
            bonoPerm: '',
            bonoPermComment: '',
            bonoAsist: '',
            bonoAsistComment: '',
            btn_editar: false
        },
        horarios: {}
    })
    
    
    const {resume, info_resumen, calendar, incidencias, asistencia, checadas, editForm, horarios} = initialState
    
    useEffect(() => {
        if(calendar || resume || editForm.visibleMenu) setLoading(false)
    }, [calendar, resume, editForm.visibleMenu])
    
    const getPrenomina = async () => {
        if(cuenta === 0){
            setLoading(true)
            cuenta = cuenta + 1;
        }
    
        params = {
            id_usuario: data.data.datos_personales.id_usuario,
            id_puesto: data.data.datos_laborales.id_puesto,
        }
    
        const body = {
            'action': 'get_my_prenomina',
            'data': {
                'id_usuario': params.id_usuario,
                'id_puesto': origin === 1 ? params.id_puesto : id_puesto,
                'idioma': language,    
                'id_periodo': id_periodo,
                'id_puesto_padre': params.id_puesto,
                'id_seleccionado': id_usuario,
            },
            'live': live,
            'login': login
        }
    
        console.log('body: ', body)

        const request = await fetch(urlNomina, {
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
                cuentaAsistencia = cuentaAsistencia + 1
                const total = response.prenomina_info.pren_nombre.length
                const quincena = response.prenomina_info.pren_nombre.substring(total - 2, total);
                
                let has_bono = parseInt(response.prenomina_info.has_bono);
                if(has_bono === 1){
                    if(quincena === 'Q1'){
                        bonus = {
                            Q1: response.prenomina_info.pren_bono
                        }
                    }
                    else{
                        bonus = {
                            bono_permanencia: response.prenomina_info.pren_bono_permanencia,
                            bono_asistencia: response.prenomina_info.pren_bono_asistencia,
                        }
                    }
                }
                /* setIdPeriodo(response.periodos[0].value) */
                setCurrentPeriodo(!currentPeriodo ? response.periodos[0].label : currentPeriodo)
                dispatch(setFechas(response.fechas))
                dispatch(setPeriodos(response.periodos))
                dispatch(setInfo(response.prenomina_info))
                dispatch(setBonos(bonus))
                dispatch(setHasBono(has_bono))
                dispatch(setMensual(response.prenomina_info.mensual))
                dispatch(setQuincena(quincena))
                setError(false)
                setLoading(false)
            }, 800)
        }
    
        else if(status === 400){
            setError(true)
            setLoading(false)
        }
    
        else if(status === 401){
            console.log('body: ', body)
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
            setLoading(false)
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
            
            setLoading(false)
            await AsyncStorage.removeItem(keyUserInfo)
            await AsyncStorage.removeItem(keyTokenInfo)
            navigation.navigate('AuthLogin')
        }
    
        else{
            Alert.alert(
                language === 1 ? 'Sesión Inválida' : 'Invalid Session',
                language === 1 ? 'Comuniquese con el área de sistemas de Telat' : 'Contact the Telat systems area',
                [
                    { text: 'OK'}
                ]
            )
            setLoading(false)
            await AsyncStorage.removeItem(keyTokenInfo)
            await AsyncStorage.removeItem(keyUserInfo)
            navigation.navigate('AuthLogin')
        }
    }

    useEffect(() => {
        getPrenomina()
    },[id_periodo, refresh])

    const handlePeriodos = async (id, dia, btn_editar) => {
        try{
            setLoading(true)
            id = id
            setIdEdit(id)
            const body = {
                'action': 'get_asistencia',
                'data': {
                    'id_asistencia': id,
                    'id_usuario': origin === 1 ? params.id_usuario : id_usuario,
                    'idioma': language,
                    'id_periodo': id_periodo,
                    'id_puesto': params.id_puesto,
                    'dia': dia
                },
                'live': live,
                'login': login
            }
            console.log('body: ', body)

            const request = await fetch(urlNomina, {
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
                    getComentarios(id)
                    setInitialState({...initialState, asistencia: response.data, calendar: !calendar, incidencias: response.data.incidencias, checadas: response.checadas, editForm: ({...editForm, asistencias: response.data.asistencias, btn_editar: btn_editar, currentAsistencia: !editForm.currentAsistencia ? response.data.tp_asist : editForm.currentAsistencia})})
                }, 500)
            }
            else if(status === 406){
                Alert.alert(
                    language === 1 ? 'Acceso Inválido' : 'Invalid Access', 
                    language === 1 ? 'Su sesión ha expirado' : 'Your session has expired',
                    [
                        {
                            text: language === 1 ? 'Entendido' : 'OK',
                            style: 'OK'
                        }
                    ]
                )
                setLoading(false)
                await AsyncStorage.removeItem(keyUserInfo)
                await AsyncStorage.removeItem(keyTokenInfo)
                navigation.navigate('AuthLogin')
            }
        }
        catch(e){
            console.log('Algo pasó con el internet')
            setLoading(false)
        }
    }

    const Quincenas = ({id, dia, fecha, asistencia, comentario, color, btn_editar}) => {
        return(
            <View style={tw`flex-1 justify-center items-center p-1.5 self-stretch`}>
                <TouchableOpacity style={tw`h-20 self-stretch justify-center items-center mb-0.5 ml-0.5 p-2.5 bg-[${color}] shadow-md rounded-2xl`} onPress={() => handlePeriodos(id, dia, btn_editar)}>
                    <View style={tw`h-5 self-stretch flex-row`}>
                        <View style={tw`flex-1 justify-start items-end`}>
                            <Text style={tw`text-sm text-[#000]`}>{dia}</Text>
                        </View>
                        <View style={tw`justify-start items-center mx-1`}>
                            <Text style={tw`text-[#adadad]`}>|</Text>
                        </View>
                        <View style={tw`flex-1 justify-start items-start`}>
                            <Text style={tw`text-sm text-[#000]`}> {fecha}</Text>
                        </View>
                    </View>
                    {
                        comentario
                        ?
                            <View style={tw`flex-row flex-1`}>
                                <View style={tw`flex-1 mr-0.5 justify-center items-center self-stretch`}>
                                    <Text style={tw`text-xl font-bold text-[${Blue}]`}>{asistencia}</Text>
                                </View>
                                <View style={tw`flex-1 mr-0.5 justify-center items-center self-stretch`}>
                                    <Icon name={'comments'} size={24} color={Blue} />
                                </View>
                            </View>
                        :
                            <View style={tw`flex-1 justify-center items-center self-stretch`}>
                                <Text style={tw`text-xl font-bold text-[${Blue}]`}>{asistencia}</Text>
                            </View>
                    }
                </TouchableOpacity>
            </View>
        )
    }

    const Incidencias = ({id, checked, incidencia}) => {
        return(
            <CheckBox onChecked={() => {}} checked={checked === 0 ? false : true} disabled={true} list={true} legend={incidencia === 'No Registro Regreso de Comida' ? 'No Registro Regreso Comida' : incidencia}/>
        )
    }

    const handleResumen = async () => {
        try{
            const body = {
                'action': 'get_my_resumen',
                'data': {
                    'id_usuario': origin === 1 ? params.id_usuario : id_usuario,
                    'id_periodo': !id_periodo ? periodos[0].value : id_periodo,
                    'id_clasificacion': info.id_clasif_prenomina
                },
                'live': live,
                'login': login
            }
    
            const request = await fetch(urlNomina, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
    
            console.log('body: ', body)

            const {response, status} = await request.json();
            if(status === 200){
                setInitialState({...initialState, info_resumen: response, resume: !resume})
            }
            else if(status === 406){
                Alert.alert(
                    language === 1 ? 'Acceso Inválido' : 'Invalid Access', 
                    language === 1 ? 'Su sesión ha expirado' : 'Your session has expired',
                    [
                        {
                            text: language === 1 ? 'Entendido' : 'OK',
                            style: 'OK'
                        }
                    ]
                )
                setLoading(false)
                await AsyncStorage.removeItem(keyUserInfo)
                await AsyncStorage.removeItem(keyTokenInfo)
                navigation.navigate('AuthLogin')
            }
        }catch(e){
            setLoading(false)
            console.log('error con la conexion')
        }
    }

    const handleVisiblePeriodos = () => {
        setVisiblePeriodo(!visiblePeriodo)
    }

    const handleActionUno = (value, label) => {
        setIdPeriodo(value)
        setCurrentPeriodo(label)
        cuenta = 0;
    }
    
    const handleActionDos = (value, index) => {
        setInitialState({...initialState, editForm: ({...editForm, id_asistencia: value, currentAsistencia: value}), asistencia: {...asistencia, id_asist: value}})
    }

    const handleSwitch = () => {
        setInitialState({...initialState, asistencia: ({...asistencia, take_lunch: asistencia.take_lunch === '1' ? '0' : '1'})})
    }

    const handleChangeModule = (section) => {
        setInitialState({...initialState, editForm: ({...editForm, active: section})})
    }

    const handleEdit = async () => {
        try{
            if(btn_editar){
                setLoading(true)
                const body = {
                    'action': 'edit_asistencia',
                    'data': {
                        'id_usuario': params.id_usuario,
                        'id_puesto': params.id_puesto,
                        'idioma': language,
                        'horario': asistencia.horario,
                        'id_pren_asist': idEdit,
                        'take_lunch': !asistencia.take_lunch ? '1' : '0',
                        'comentario': editForm.comment,
                        'id_tipo_asist': asistencia.id_asist
                    },
                    'live': live,
                    'login': login
                }
        
                const request = await fetch(urlNomina, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(body)
                });
        
                const {response, status} = await request.json();
                if(status === 200){
                    setInitialState({...initialState, editForm: {...editForm, comment: '', showComment: false}, calendar: false})
                    setRefresh(!refresh)
                }
            }
            else{
                setInitialState({...initialState, calendar: false})
            }
        }catch(e){
            console.log('hay un problema en el internet...')
            setLoading(false)
            setInitialState({...initialState, calendar: false})
        }
    }

    const handleEditHorarios = async () => {
        try{
            setLoading(true)
            const body = {
                "action": "edit_horario",
                "data": {
                    "id_usuario": params.id_usuario,
                    "id_puesto": params.id_puesto, 
                    "idioma": language,
                    "hora_lun_jue": info.pren_horario_lun_jue,
                    "hora_viernes": info.pren_horario_vie,
                    "hora_sabado": info.pren_horario_sab,
                    "hora_domingo": info.pren_horario_dom,
                    "idprenlist": info.id_prenomina_list
                },
                "live": live,
                "login": login
            }
    
            const request = await fetch(urlNomina, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
    
            const {response, status} = await request.json();
            if(status === 200){
                setInitialState({...initialState,editForm: {...editForm, visibleMenu: false}})
                setRefresh(!refresh)
            }
        }catch(e){
            console.log('hay un problema en el internet...')
            setLoading(false)
            setInitialState({...initialState, editForm: {...editForm, visibleMenu: false}})
        }
    }

    const handleEditBonos = async () => {
        try{
            setLoading(true)
            const body = {
                "action": "edit_bonos",
                "data": {
                    "id_usuario": params.id_usuario,
                    "id_puesto": params.id_puesto, 
                    "idioma": language,
                    "bono": info.pren_bono,
                    "comentbono": info.pren_bono_comentario,
                    "bonop": info.pren_bono_permanencia,
                    "comentbonop": info.pren_bono_perm_coment,
                    "bonoa": info.pren_bono_asistencia,
                    "comentbonoa": info.pren_bono_assit_coment,
                    "idprenlist": info.id_prenomina_list,
                    "quincena": quincena
                },
                "live": live,
                "login": login
            }
    
            const request = await fetch(urlNomina, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
    
            const {response, status} = await request.json();
            if(status === 200){
                setInitialState({...initialState, editForm: {...editForm, visibleMenu: false}})
                setRefresh(!refresh)
            }
        }catch(e){
            console.log('hay un problema en el internet...')
            setLoading(false)
            setInitialState({...initialState, editForm: {...editForm, visibleMenu: false}})

        }
    }

    const handleDeleteComment = async (id) => {
        setIdDelete(id)
        setDeleteVisibility(true)
    }

    const getComentarios = async (id) => {
        try{
            setLoading(true)
            const body = {
                "action": "get_comentarios",
                "data": {
                    "id_asistencia": id,
                    'id_usuario': params.id_usuario,
                },
                "live": live,
                "login": login
            }

            const request = await fetch(urlNomina, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
    
            const {response, status} = await request.json();
            if(status === 200){
                setComentarios(response)
            }
        }catch(e){
            setLoading(false)
        }
    }

    const handleDelete = async (id = undefined) => {
        try{
            setLoading(true)
            const body = {
                "action": "delete_comentario",
                "data": {
                    "id_comentario": !id ? idDelete : id,
                    "id_usuario": params.id_usuario,
                    "id_puesto": params.id_puesto,
                    "idioma": language
                },
                "live": live,
                "login": login
            }

            const request = await fetch(urlNomina, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
    
            const {response, status} = await request.json();
            if(status === 200){
                setInitialState({...initialState, editForm: {...editForm, comment: '', showComment: false}})
                setRefresh(!refresh)
                setDeleteVisibility(false)
                getComentarios(idEdit)
            }
        }catch(e){
            setLoading(false)
            setInitialState({...initialState, editForm: {...editForm, comment: '', showComment: false}, calendar: false})
            setDeleteVisibility(false)
        }
    }

    const handleAlert = (id) => {
        Alert.alert(
            language === '1' ? '¿Esta seguro de continuar?' : 'Are you sure you want to continue?',
            language === '1' ? 'Este cambio no se puede revertir' : 'This change cannot be reversed',
            [
                {
                    text: language === '1' ? 'Cancelar' : 'Cancel',
                    style: "cancel"
                },
                { 
                    text: language === '1' ? "Sí, estoy seguro": "Yes, I am sure", 
                    onPress: async () => handleDelete(id)
                }
            ]
        )
    }

    const pickerStyle = {
        inputIOS: {
            color: '#000',
        },
        inputAndroid: {
            color: '#000',
        },
    };

    return(
        <>
            {
                orientationInfo.initial === 'PORTRAIT'
                ?
                    hasConnection
                    ?
                        <View style={tw`flex-1 bg-white`}>
                            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
                            <HeaderPortrait title={language === '1' ? 'Mi Pre-nómina' : 'My Pre-payroll'} screenToGoBack={origin === 1 ? 'Dashboard' : 'GeneralPrenomine'} navigation={navigation} visible={true} translateY={translateY}/>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={tw`self-stretch bg-white`}
                                /* contentContainerStyle={{paddingTop: paddingTop}}
                                onScroll={handleScroll} */
                            >
                                <View style={container}>
                                    <View style={tw`h-auto self-stretch py-1.5`}>
                                        <Title icon={'user'} tipo={1} hasBottom={false} title={language === '1' ? 'Pre-nóminas (Listado)' : 'Pre-payroll (List)'}/>
                                    </View>
                                    <View style={tw`h-auto self-stretch justify-center p-2.5 bg-white shadow-md rounded-2xl`}>
                                        <View style={tw`flex-row h-6 justify-center items-center`}>
                                            <View style={tw`h-auto flex-1 flex-row bg-white justify-center items-center`}>
                                                <View style={tw`w-auto h-6 justify-center items-center bg-[${Blue}] px-1.5 rounded-md`}>
                                                    <Text style={tw`text-xs font-bold text-[#fff]`} >{info.numero}</Text>
                                                </View>
                                                <View style={tw`flex-1 h-6 ml-1 px-2 justify-center items-center bg-[#000] rounded-md`}>
                                                    <Text style={tw`text-xs font-bold text-[#fff]`}>{info.empleado}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={tw`h-auto self-stretch justify-center items-center mt-1.5`}>
                                            <Text style={tw`text-base font-bold text-[${Blue}]`}>{info.pren_puesto ? info.pren_puesto : '-----'}</Text>
                                        </View>

                                        <View style={tw`h-auto self-stretch mt-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Admission'}</Text>
                                            <Text style={tw`text-sm text-[#000]`}>{info.alta ? `${info.alta.substring(8,10)}-${info.alta.substring(5,7)}-${info.alta.substring(0,4)}` : 'N/A'}</Text>
                                        </View>
                    
                                        <View style={tw`flex-row mt-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={title}>{language === '1' ? 'Horario Lunes - Jueves' : 'Schedule Monday - Thuesday'}</Text>
                                                <Text style={tw`text-sm text-[#000]`}>{info.pren_horario_lun_jue ? info.pren_horario_lun_jue : 'N/A'}</Text>
                                            </View>
                    
                                            <View style={tw`flex-1`}>
                                                <Text style={title}>{language === '1' ? 'Horario Viernes' : 'Schedule Friday'}</Text>
                                                <Text style={tw`text-sm text-[#000]`}>{info.pren_horario_vie ? info.pren_horario_vie : 'N/A'}</Text>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row mt-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={title}>{language === '1' ? 'Horario Sábado' : 'Schedule Saturday'}</Text>
                                                <Text style={tw`text-sm text-[#000]`}>{info.pren_horario_sab ? info.pren_horario_sab : 'N/A'}</Text>
                                            </View>
                    
                                            <View style={tw`flex-1`}>
                                                <Text style={title}>{language === '1' ? 'Horario Domingo' : 'Schedule Sunday'}</Text>
                                                <Text style={tw`text-sm text-[#000]`}>{info.pren_horario_dom ? info.pren_horario_dom : 'N/A'}</Text>
                                            </View>
                                        </View>

                                        {
                                            has_bono === 1 && mensual
                                            ?
                                                <>
                                                    <View style={tw`flex-row mt-2`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Bono [Prod.]' : 'Bonus [Prod.]'}</Text>
                                                            <Text style={tw`text-sm text-[#000]`}>{bonos.Q1 ? `$${bonos.Q1}` : '$0.00'}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={tw`flex-row mt-2`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Bono [Perm.]' : 'Bonus [Perm.]'}</Text>
                                                            <Text style={tw`text-sm text-[#000]`}>{bonos.bono_permanencia ? `$${bonos.bono_permanencia}` : '$0.00'}</Text>
                                                        </View>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Bono [Exce.]' : 'Bonus [Exce.]'}</Text>
                                                            <Text style={tw`text-sm text-[#000]`}>{bonos.bono_asistencia ? `$${bonos.bono_asistencia}` : '$0.00'}</Text>
                                                        </View>
                                                    </View>
                                                </>
                                            :
                                                has_bono === 1
                                                ?
                                                    quincena === 'Q1'
                                                    ?
                                                        <View style={tw`flex-row mt-2`}>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={title}>{language === '1' ? 'Bono' : 'Bonus'}</Text>
                                                                <Text style={tw`text-sm text-[#000]`}>{bonos.Q1 ? `$${bonos.Q1}` : '$0.00'}</Text>
                                                            </View>
                                                        </View>
                                                    :
                                                        <View style={tw`flex-row mt-2`}>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={title}>{language === '1' ? 'Bono (P)' : 'Bonus (P)'}</Text>
                                                                <Text style={tw`text-sm text-[#000]`}>{bonos.bono_permanencia ? `$${bonos.bono_permanencia}` : '$0.00'}</Text>
                                                            </View>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={title}>{language === '1' ? 'Bono (AP)' : 'Bonus (AP)'}</Text>
                                                                <Text style={tw`text-sm text-[#000]`}>{bonos.bono_asistencia ? `$${bonos.bono_asistencia}` : '$0.00'}</Text>
                                                            </View>
                                                        </View>
                                                :
                                                    <></>
                                        }
                                    </View>
                                    
                                    <View style={tw`h-auto self-stretch pt-1.5 px-2.5 bg-white shadow-md rounded-2xl mt-6 mb-5`}>

                                        <View style={tw`h-auto self-stretch mt-4 flex-row`}>
                                            {
                                                !error
                                                ?
                                                    <TouchableOpacity onPress={() => handleResumen()} style={tw`flex-row h-11 flex-1 px-1.5 rounded-2xl bg-[#BFCCE7] justify-center items-center shadow-md`}>
                                                        <IonIcons name={'file-check'} size={21} color={'#000'} />
                                                        <Text style={tw`font-bold text-[#000] text-lg ml-1.5`}>{language === '1' ? 'Resumen' : 'Resume'}</Text>
                                                    </TouchableOpacity>
                                                :
                                                    <View style={tw`flex-row h-11 flex-1 px-1.5 rounded-2xl bg-[#f7f7f7] justify-center items-center border border-[#dadada] shadow-md`}>
                                                        <IonIcons name={'file-check'} size={21} color={'#000'} />
                                                        <Text style={tw`font-bold text-[#000] text-lg ml-1.5`}>{language === '1' ? 'Resumen' : 'Resume'}</Text>
                                                    </View>

                                            }
                                            {
                                                btn_editar
                                                &&
                                                    <>
                                                        <View style={tw`w-1`}></View>
                                                        <TouchableOpacity
                                                            style={tw`flex-row h-11 flex-1 px-1.5 rounded-2xl bg-[#C3E5C4] justify-center items-center`}
                                                            onPress={() => setInitialState({...initialState, editForm: ({...editForm, visibleMenu: !editForm.visibleMenu})})}
                                                        >
                                                            <Icon name='pencil' size={20} color={'#000'} />
                                                            <Text style={tw`font-bold text-[#000] text-lg ml-1.5`}>{language === '1' ? 'Editar' : 'Edit'}</Text>
                                                        </TouchableOpacity>
                                                    </>
                                            }
                                        </View>
                                        <View style={tw`h-auto self-stretch mt-2.5 flex-row`}>
                                            <TouchableOpacity style={[picker, tw`flex-row flex-1`, {height: 45}]} onPress={() => handleVisiblePeriodos()}>
                                                <View style={tw`flex-1 justify-center items-center`} >
                                                    <Text style={tw`text-lg text-[#000]`}>{currentPeriodo}</Text>
                                                </View>
                                                <View style={tw`w-auto`}>
                                                    <Icon name='caret-down' size={15} color={'#000'} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        {
                                            !error
                                            ?
                                                <View style={tw`flex-1 self-stretch mt-2.5 mb-4`}>
                                                    <FlatList
                                                        showsVerticalScrollIndicator={false}
                                                        showsHorizontalScrollIndicator={false}
                                                        style={list}
                                                        data={fechas}
                                                        numColumns={3}
                                                        renderItem={({item}) => <Quincenas id={item.id} dia={item.dia} asistencia={item.asistencia} fecha={item.fecha} color={item.color} comentario={item.comentario} btn_editar={item.btn_editar}/>}
                                                        keyExtractor={item => String(item.id)}
                                                    />
                                                </View>
                                        :
                                            <View style={tw`flex-1 items-center justify-center`}>
                                                <Image
                                                    style={tw`w-30 h-30 my-10`}
                                                    resizeMode={'stretch'}
                                                    source={require('../../../../assets/calendary.gif')}
                                                />
                                            </View>
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                            <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                        </View>
                    :
                        <>
                            <StatusBar barStyle='light-content' />
                            <SafeAreaView style={{ flex: 0, backgroundColor: '#FDA412' }} />
                            <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                        </>
                :
                    hasConnection
                    ?
                        <View style={tw`flex-1 bg-white`}>
                            <HeaderLandscape title={'Mi Pre-nómina'} screenToGoBack={origin === 1 ? 'Dashboard' : 'GeneralPrenomine'} navigation={navigation} visible={true} translateY={translateY}/>
                            <View style={container}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={tw`self-stretch`}
                                    /* contentContainerStyle={{paddingTop: paddingTop}}
                                    onScroll={handleScroll} */
                                >
                                    <View style={tw`flex-1 self-stretch`}>
                                        <View style={tw`flex-row py-[1.5%] mx-[${isIphone ? 2.5 : 2}]`}>
                                            <View style={tw`flex-1 self-stretch`}>
                                                <View style={tw`h-auto self-stretch mr-4 p-2.5 bg-[#fff] shadow-md rounded-2xl`}>
                                                    <View style={tw`flex-row justify-center items-center`}>
                                                        <View style={tw`flex-row items-center h-auto justify-center`}>
                                                            <View style={tw`h-auto flex-1 flex-row bg-white justify-center items-center`}>
                                                                <View style={tw`w-auto h-7 justify-center items-center bg-[${Blue}] px-1.5 rounded-md`}>
                                                                    <Text style={tw`text-xs font-bold text-[#fff]`}>{info.numero}</Text>
                                                                </View>
                                                                <View style={tw`flex-1 h-7 ml-1 px-2 justify-center items-center bg-[#000] rounded-md`}>
                                                                    <Text style={tw`text-xs font-bold text-[#fff]`}>{info.empleado}</Text>
                                                                </View>
                                                                {
                                                                    btn_editar
                                                                    &&
                                                                        <TouchableOpacity
                                                                            style={tw`w-7 h-7 bg-[#C3E5C4] justify-center items-center rounded-lg ml-1`}
                                                                            onPress={() => setInitialState({...initialState, editForm: ({...editForm, visibleMenu: !editForm.visibleMenu})})}
                                                                        >
                                                                            <Icon name='pencil' size={15} color={'#000'} />
                                                                        </TouchableOpacity>
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={tw`flex-row mt-1.5`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Admission'}</Text>
                                                            {/* info.alta.substring(0,10) */}
                                                            <Text style={tw`text-sm text-[#000]`}>{info.alta && `${info.alta.substring(8,10)}•${info.alta.substring(5,7)}•${info.alta.substring(0,4)}`}</Text>
                                                        </View>
                                
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Puesto' : 'Position'}</Text>
                                                            <Text style={tw`text-sm text-[#000]`}>{info.pren_puesto}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={tw`flex-row mt-1.5`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Horario Lunes - Jueves' : 'Schedule Monday - Thuesday'}</Text>
                                                            <Text style={tw`text-sm text-[#000]`}>{info.pren_horario_lun_jue ? info.pren_horario_lun_jue : 'N/A'}</Text>
                                                        </View>
                                
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Horario Viernes' : 'Schedule Friday'}</Text>
                                                            <Text style={tw`text-sm text-[#000]`}>{info.pren_horario_vie ? info.pren_horario_vie : 'N/A'}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={tw`flex-row mt-1.5`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Horario Sábado' : 'Schedule Saturday'}</Text>
                                                            <Text style={tw`text-sm text-[#000]`}>{info.pren_horario_sab ? info.pren_horario_sab : 'N/A'}</Text>
                                                        </View>
                                
                                                        <View style={tw`flex-1`}>
                                                            <Text style={title}>{language === '1' ? 'Horario Domingo' : 'Schedule Sunday'}</Text>
                                                            <Text style={tw`text-sm text-[#000]`}>{info.pren_horario_dom ? info.pren_horario_dom : 'N/A'}</Text>
                                                        </View>
                                                    </View>
                                                    {
                                                        has_bono === 1
                                                        ?
                                                            quincena === 'Q1'
                                                            ?                                        
                                                                <View style={tw`flex-row mt-1.5`}>
                                                                    <View style={tw`flex-1`}>
                                                                        <Text style={title}>{language === '1' ? 'Bono' : 'Bonus'}</Text>
                                                                        <Text style={tw`text-sm`}>{bonos.Q1 ? `$${bonos.Q1}` : '$0.00'}</Text>
                                                                    </View>
                                                                </View>
                                                            :
                                                                <View style={tw`flex-row mt-1.5`}>
                                                                    <View style={tw`flex-1`}>
                                                                        <Text style={title}>{language === '1' ? 'Bono (P)' : 'Bonus (P)'}</Text>
                                                                        <Text style={tw`text-sm`}>{bonos.bono_permanencia ? `$${bonos.bono_permanencia}` : '$0.00'}</Text>
                                                                    </View>
                                            
                                                                    <View style={tw`flex-1`}>
                                                                        <Text style={title}>{language === '1' ? 'Bono (AP)' : 'Bonus (AP)'}</Text>
                                                                        <Text>{bonos.bono_asistencia ? `$${bonos.bono_asistencia}` : '$0.00'}</Text>
                                                                    </View>
                                                                </View>
                                                        :
                                                            <></>
                                                    }
                                                </View>
                                            </View>
                                            <View style={tw`flex-1 self-stretch p-2.5 bg-[#fff] shadow-md rounded-2xl`}>
                                                <View style={tw`h-auto self-stretch items-end justify-end flex-row mb-2.5`}>
                                                    <TouchableOpacity style={[picker, tw`flex-row mb-0 flex-1 justify-center items-center`, {height: 45}]} onPress={() => handleVisiblePeriodos()}>
                                                        <View style={tw`flex-1 justify-center items-center`}>
                                                            <Text style={tw`text-[#000]`}>{currentPeriodo}</Text>
                                                        </View>
                                                        <View style={tw`w-auto`}>
                                                            <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={tw`w-1.5`}></View>
                                                    {
                                                        !error
                                                        ?
                                                            <TouchableOpacity onPress={() => handleResumen()} style={tw`flex-row h-11 w-auto px-1.5 rounded-2xl bg-[#BFCCE7] justify-center items-center`}>
                                                                <IonIcons name={'file-check'} size={24} color={'#000'} />
                                                                <Text style={tw`font-bold text-[#000] text-xs ml-1`}>{language === '1' ? 'Resumen' : 'Resume'}</Text>
                                                            </TouchableOpacity>
                                                        :
                                                            <View onPress={() => handleResumen()} style={tw`flex-row h-11 w-auto px-1.5 rounded-2xl bg-[#f7f7f7] justify-center items-center border border-[#dadada]`}>
                                                                <IonIcons name={'file-check'} size={24} color={'#000'} />
                                                                <Text style={tw`font-bold text-[#000] text-xs ml-1`}>{language === '1' ? 'Resumen' : 'Resume'}</Text>
                                                            </View>
                                                    }
                                                </View>
                                                <FlatList
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={list}
                                                    data={fechas}
                                                    numColumns={3}
                                                    renderItem={({item}) => <Quincenas id={item.id} dia={item.dia} asistencia={item.asistencia} fecha={item.fecha} color={item.color} comentario={item.comentario} btn_editar={item.btn_editar}/>}
                                                    keyExtractor={item => String(item.id)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                            <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                        </View>
                    :
                        <>
                            <StatusBar barStyle='light-content' />
                            <SafeAreaView style={{ flex: 0, backgroundColor: '#FDA412' }} />
                            <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                        </>
            }
            

            <Modal visibility={calendar} orientation={orientationInfo.initial} handleDismiss={() => setInitialState({...initialState, calendar: !calendar})}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyboardOpeningTime={0}
                    enableResetScrollToCoords
                    onKeyboardWillHide={() => setKeyboardActive(false)}
                    onKeyboardWillShow={()=> setKeyboardActive(true)}
                    contentInset={{ bottom: contentBottom }}
                    automaticallyAdjustKeyboardInsets={true}
                    automaticallyAdjustContentInsets={false}
                >
                    <View style={tw`flex-row self-stretch mb-2`}>
                        <View style={tw`w-7.5 justify-center items-center`}>
                            <IonIcons name={'close'} size={35} color={'transparent'} />
                        </View>
                        <View style={tw`flex-1 justify-center items-center`}>
                            <Text style={tw`font-bold text-[#383838] text-lg`}>{language === '1' ? 'Asistencia' : 'Attendance'}</Text>
                        </View>
                        <TouchableOpacity style={tw`w-7.5 justify-center items-center`} onPress={() => setInitialState({...initialState, calendar: !calendar})}>
                            <IonIcons name={'close'} size={35} color={'#383838'} />
                        </TouchableOpacity>
                    </View>
                    <View style={tw`h-auto self-stretch`}>
                        {
                            orientationInfo.initial === 'PORTRAIT' && isTablet() || orientationInfo.initial === 'LANDSCAPE' && isTablet()
                            ?
                                <View style={tw`flex-row`}>
                                    <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                        <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Día' : 'Day'}</Text>
                                        <View style={[box, tw`justify-center`, {height: 45}]}>
                                            <Text style={tw`text-[#000]`}>{asistencia.dia ? asistencia.dia : ''}</Text>
                                        </View>
                                    </View>
                                    <View style={tw`w-1.5`}></View>
                                    <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                        <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Tipo Asistencia' : 'Assistance Type'}</Text>
                                        <View style={[box, tw`justify-center`, {height: 45}]}>
                                            <Text style={tw`text-[#000]`}>{asistencia.tp_asist ? asistencia.tp_asist : ''}</Text>
                                        </View>
                                    </View>
                                </View>
                            :
                                orientationInfo.initial === 'PORTRAIT'
                                ?
                                    <View style={tw`flex-row justify-center items-center`}>
                                        <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                            <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Día' : 'Day'}</Text>
                                            <View style={[box, tw`justify-center`, {height: 45}]}>
                                                <Text style={tw`text-[#000]`}>{asistencia.dia ? asistencia.dia : ''}</Text>
                                            </View>
                                        </View>
                                        <View style={tw`w-1.5`}></View>
                                        <View style={{flex: !btn_editar ? asistencia.tp_asist ? asistencia.tp_asist.length > 19 ? 2 : 1 : 1 : 1, marginBottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Tipo Asistencia' : 'Assistance Type'}</Text>
                                            {
                                                btn_editar && editForm.btn_editar
                                                ?
                                                    <View style={styles.picker}>
                                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 0, alignSelf: 'stretch'}}>
                                                            <Picker
                                                                value={asistencia.id_asist}
                                                                onValueChange={(itemValue, itemIndex) => handleActionDos(itemValue, itemIndex)}
                                                                items={editForm.asistencias}
                                                                placeholder={{}}
                                                                style={[tw`text-xs items-center justify-center flex-1`, {pickerStyle}]}
                                                            />
                                                        </View>
                                                    </View>
                                                :
                                                    <View style={[styles.picker, tw`bg-[#f7f7f7] pl-0`]}>
                                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                            <Text style={tw`text-[#000]`}>{asistencia.tp_asist ? asistencia.tp_asist : ''}</Text>
                                                        </View>
                                                    </View>
                                                    
                                            }
                                        </View>
                                    </View>
                                :
                                    <View style={tw`flex-row`}>
                                        <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                            <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Día' : 'Day'}</Text>
                                            <View style={[box, tw`justify-center`, {height: 45}]}>
                                                <Text style={tw`text-[#000]`}>{asistencia.dia ? asistencia.dia : ''}</Text>
                                            </View>
                                        </View>
                                        <View style={tw`w-1.5`}></View>
                                        <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                            <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Tipo Asistencia' : 'Assistance Type'}</Text>
                                            {
                                                btn_editar
                                                ?
                                                    <View style={styles.picker}>
                                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 0, alignSelf: 'stretch'}}>
                                                            <Picker
                                                                value={asistencia.id_asist}
                                                                onValueChange={(itemValue, itemIndex) => handleActionDos(itemValue, itemIndex)}
                                                                items={editForm.asistencias}
                                                                placeholder={{}}
                                                                style={[tw`text-xs items-center justify-center flex-1`, {pickerStyle}]}
                                                            />
                                                        </View>
                                                    </View>
                                                :
                                                    <View style={[styles.picker, tw`bg-[#f7f7f7] pl-0`]}>
                                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                            <Text style={tw`text-[#000]`}>{asistencia.tp_asist ? asistencia.tp_asist : ''}</Text>
                                                        </View>
                                                    </View>
                                                    
                                            }
                                        </View>
                                    </View>
                        }
                        <View style={tw`flex-row`}>
                            <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Horario (Del día)' : 'Schedule (Day)'}</Text>
                                {
                                    btn_editar && editForm.btn_editar
                                    ?
                                        <MaskInput
                                            isCenter={true}
                                            value={asistencia.horario}
                                            keyboardType='numeric'
                                            onChangeText={(masked, unmasked) => {
                                                setInitialState({...initialState, asistencia: {...asistencia, horario: masked}})
                                            }}
                                            mask={[/\d/, /\d/,':', /\d/, /\d/, ' - ', /\d/, /\d/,':', /\d/, /\d/,]}
                                        />
                                    :
                                        <View style={[box, tw`justify-center`, {height: 45}]}>
                                            <Text style={tw`text-[#000]`}>{asistencia.horario ? asistencia.horario : 'N/A'}</Text>
                                        </View>
                                        
                                }
                            </View>
                            <View style={tw`w-1.5`}></View>
                            <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Horario checada' : 'Check Schedule'}</Text>
                                <View style={[box,{justifyContent: 'center', alignItems: 'center', height: 45}]}>
                                    <Text style={tw`text-[#000]`}>{asistencia.checada ? asistencia.checada : 'N/A'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={tw`flex-row`}>
                            <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Horario comida' : 'Meal Schedule'}</Text>
                                <View style={[box,{justifyContent: 'center', alignItems: 'center', height: 45}]}>
                                    <Text style={tw`text-[#000]`}>{asistencia.checadacom ? asistencia.checadacom : 'N/A'}</Text>
                                </View>
                            </View>
                            <View style={tw`w-1.5`}></View>
                            <View style={tw`flex-1 mt-1 justify-center items-center`}>
                                <Text style={[title, tw`mb-1`]}>{language === '1' ? 'Tiempo' : 'Time'}</Text>
                                <View style={[box,{justifyContent: 'center', alignItems: 'center', height: 45}]}>
                                    <Text style={tw`text-[#000]`}>{asistencia.tiempocom ? asistencia.tiempocom : 'N/A' }</Text>
                                </View>
                            </View>
                        </View>
                        <Switch title={language === '1' ? 'Tiempo de Comida' : 'Lunch Time'} isButton={btn_editar && editForm.btn_editar ? true : false} handleSwitch={handleSwitch} value={asistencia.take_lunch} />
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={list}
                        data={incidencias}
                        numColumns={2}
                        renderItem={({item}) => <Incidencias id={item.id_tipo_incidencia} checked={item.checked} incidencia={item.tipo_incidencia}/>}
                        keyExtractor={item => String(item.id_tipo_incidencia)}
                    />
                    {/* //este es el footer */}
                    {
                        btn_editar && editForm.btn_editar
                        &&
                            <>
                                <View style={tw`flex-row`}>
                                    <View style={tw`flex-1`}></View>
                                    <TouchableOpacity onPress={() => setInitialState({...initialState, editForm: ({...editForm, showComment: !editForm.showComment})})} style={tw`flex-row h-9 flex-1 justify-end items-center`}>
                                        <Icon name={editForm.showComment ? 'minus' : 'plus'} size={24} color={Blue} />
                                        <Text style={tw`text-[${Blue}] ml-1.5 mb-1`}>Agregar Comentario</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    editForm.showComment
                                    &&
                                        <MultiText 
                                            placeholder={language === '1' ? 'Ingrese su comentario' : 'Type your comment'}
                                            multiline={true}
                                            numberOfLines={5}
                                            value={editForm.comment}
                                            onChangeText={(e) => setInitialState({...initialState, editForm: ({...editForm, comment: e})})}
                                        />
                                }
                            </>

                    }
                    {
                        comentarios.length > 0
                        &&
                            <Text style={tw`text-[#1177E9] mt-2.5`}>{language === '1' ? 'Comentarios' : 'Comments'}</Text>
                    }
                    {
                        comentarios.length > 0
                        &&
                            comentarios.map(x => 
                                <View style={tw`h-auto my-2 p-2 self-stretch bg-[${comentarios.length > 0 ? 'rgba(50,131,197,.1)' : '#fff'}] rounded-lg`} key={x.id_comentario}>
                                    <View style={tw`h-auto self-stretch flex-row justify-center`}>
                                        <View style={tw`flex-1 justify-center`}>
                                            <Text style={tw`font-bold text-[#1177E9] text-base mb-1`}>{x.usuario}</Text>
                                        </View>
                                        <TouchableOpacity style={tw`w-auto justify-center`} onPress={() => !isIphone ? handleDeleteComment(x.id_comentario) : handleAlert(x.id_comentario)}>
                                            {
                                                btn_editar && editForm.btn_editar
                                                &&
                                                    <Icon name={'trash'} size={24} color={'#DC3232'} />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={tw`text-[#1177E9] text-sm text-justify`}>{x.comentario}</Text>
                                </View>
                            )
                    }
                    {
                        checadas.length > 0
                        &&
                            <Title icon={'user'} tipo={1} hasBottom={false} title={language === '1' ? 'Checadas' : 'Check-Ins'} top={true}/>
                    }

                    {
                        checadas
                        &&
                            checadas.map(x =>
                                <View style={tw`h-7 self-stretch bg-[#fEE188] mx-2.5 mt-2.5 mb-2 px-px mt-2.5 mb-1.5 px-px flex-row rounded-3xl shadow-md`} key={x.id}>
                                    <View style={tw`h-7 w-7 justify-center items-center`}>
                                        <View style={tw`bg-[#00B800] rounded-full w-4 h-4`}/>
                                    </View>
                                    <View style={tw`flex-1 justify-center items-center`}>
                                        <Text style={tw`text-base font-bold text-[#000]`}>{x.hora}</Text>
                                    </View>
                                    <View style={tw`h-7 w-7 justify-center items-center`}>
                                        <View style={tw`rounded-full w-4 h-4`} />
                                    </View>
                                </View>
                            )
                    }
                    
                    {
                        btn_editar && editForm.btn_editar
                        &&
                            <TouchableOpacity
                                style={tw`flex-row h-10 bg-[${Blue}] rounded-2xl flex-1 items-center justify-center mt-2.5`}
                                onPress={() => handleEdit()}
                            >
                                <IonIcons name={'content-save'} size={22} color={'#fff'} />
                                <Text style={tw`text-[#fff] font-bold text-base ml-1.5`}>{language === '1' ? 'Guardar' : 'Save'}</Text>
                            </TouchableOpacity>
                    }
                </KeyboardAwareScrollView>
            </Modal>

            <Modal visibility={resume} orientation={orientationInfo.initial} handleDismiss={() => setInitialState({...initialState, resume: !resume})}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={tw`flex-row self-stretch mb-2`}>
                        <View style={tw`w-7.5 justify-center items-center`}>
                            <IonIcons name={'close'} size={35} color={'transparent'} />
                        </View>
                        <View style={tw`flex-1 justify-center items-center`}>
                            <Text style={tw`font-bold text-[#383838] text-lg`}>{language === '1' ? 'Resumen' : 'Resume'}</Text>
                        </View>
                        <TouchableOpacity style={tw`w-7.5 justify-center items-center`} onPress={() => setInitialState({...initialState, resume: !resume})}>
                            <IonIcons name={'close'} size={35} color={'#383838'} />
                        </TouchableOpacity>
                    </View>
                    <View style={tw`h-auto`}>
                        {
                            orientationInfo.initial === 'PORTRAIT'
                            ?
                                <>
                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Asistencias' : 'Assistance'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.A === 'N/A' ? '-' : info_resumen.A}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Descansos' : 'Breaks'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.D === 'N/A' ? '-' : info_resumen.D}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Faltas' : 'Absence'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.F === 'N/A' ? '-' : info_resumen.F}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Faltas Justificadas' : 'Justified Absence'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.FJ === 'N/A' ? '-' : info_resumen.FJ}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Día Festivo' : 'Holiday'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.DF === 'N/A' ? '-' : info_resumen.DF}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Día Festivo Trabajado' : 'Holiday Worked'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.DFT === 'N/A' ? '-' : info_resumen.DFT}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Incapacidad' : 'Inability'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.I === 'N/A' ? '-' : info_resumen.I}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Permiso Sin Goce' : 'Permission Without Enjoyment'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.PSG === 'N/A' ? '-' : info_resumen.PSG}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Permiso Con Goce' : 'Permission With Joy'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.PCG === 'N/A' ? '-' : info_resumen.PCG}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Vacaciones' : 'Vacations'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.V === 'N/A' ? '-' : info_resumen.V}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Trabajo en Casa' : 'Home Office'}</Text>
                                            <Text>{info_resumen.HO === 'N/A' ? '-' : info_resumen.HO}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Incidencias' : 'Incidence'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.incidencias === 'N/A' ? '-' : info_resumen.incidencias}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2 px-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={title}>{language === '1' ? 'Retardos' : 'Time Delay'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.retardos === 'N/A' ? '-' : info_resumen.retardos}</Text>
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Viernes Salida a las 4pm' : 'Leave Early on Friday'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.salida_viernes === 'SI' ? language === '1' ? 'SI' : 'YES' : 'NO'}</Text>
                                        </View>
                                    </View>
                                </>
                            :
                                <>
                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Asistencias' : 'Assistance'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.A === 'N/A' ? '-' : info_resumen.A}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Descansos' : 'Breaks'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.D === 'N/A' ? '-' : info_resumen.D}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={[title]}>{language === '1' ? 'Faltas' : 'Absence'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.F === 'N/A' ? '-' : info_resumen.F}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Faltas Justificadas' : 'Justified Absence'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.FJ === 'N/A' ? '-' : info_resumen.FJ}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={[title]}>{language === '1' ? 'Día Festivo' : 'Holiday'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.DF === 'N/A' ? '-' : info_resumen.DF}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Día Festivo Trabajado' : 'Holiday Worked'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.DFT === 'N/A' ? '-' : info_resumen.DFT}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={[title]}>{language === '1' ? 'Incapacidad' : 'Inability'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.I === 'N/A' ? '-' : info_resumen.I}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={title}>{language === '1' ? 'Permiso Sin Goce' : 'Permission Without Enjoyment'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.PSG === 'N/A' ? '-' : info_resumen.PSG}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={[title]}>{language === '1' ? 'Permiso Con Goce' : 'Permission With Joy'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.PCG === 'N/A' ? '-' : info_resumen.PCG}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={title}>{language === '1' ? 'Vacaciones' : 'Vacations'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.V === 'N/A' ? '-' : info_resumen.V}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={[title]}>{language === '1' ? 'Trabajo en Casa' : 'Home Office'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.HO === 'N/A' ? '-' : info_resumen.HO}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={[title]}>{language === '1' ? 'Incidencias' : 'Incidence'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.incidencias === 'N/A' ? '-' : info_resumen.incidencias}</Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start p-2 px-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={title}>{language === '1' ? 'Retardos' : 'Time Delay'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.retardos === 'N/A' ? '-' : info_resumen.retardos}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={[title]}>{language === '1' ? 'Viernes Salida a las 4pm' : 'Leave Early on Friday'}</Text>
                                            <Text style={tw`text-[#000]`}>{info_resumen.salida_viernes === 'SI' ? language === '1' ? 'SI' : 'YES' : 'NO'}</Text>
                                        </View>
                                        <View style={tw`w-1`}></View>
                                        <View style={tw`flex-1 ml-1.5`}/>
                                    </View>
                                </>
                        }
                        
                    </View>
                </ScrollView>
            </Modal>

            <Modal orientation={orientationInfo.initial} visibility={visiblePeriodo} handleDismiss={handleVisiblePeriodos}>
                <Select data={periodos} handleVisiblePeriodos={handleVisiblePeriodos} handleActionUno={handleActionUno} />
            </Modal>

            <Modal orientation={orientationInfo.initial} visibility={visibleAsistencia} handleDismiss={() => setVisibleAsistencia(!visibleAsistencia)}>
                <Select data={editForm.asistencias} handleVisiblePeriodos={() => setVisibleAsistencia(!visibleAsistencia)} handleActionDos={handleActionDos} />
            </Modal>

            <Modal orientation={orientationInfo.initial} visibility={editForm.visibleMenu} handleDismiss={() => setInitialState({...initialState, editForm: {...editForm, visibleMenu: false}})}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={tw`h-12.5 self-stretch flex-row border border-[#3283c5] bg-[rgba(50,131,197,.1)] px-[2%] rounded`}>
                        <TouchableWithoutFeedback onPress={() => editForm.active !== 1 && handleChangeModule(1)}>
                            <View style={tw`flex-1 flex-row items-center justify-center`}>
                                <IonIcons name={'clock-outline'} size={28} color={editForm.active === 1 ? '#3283c5' : '#C1C1C1'} />
                                {/* <Icon name={'clock'} size={24} color={editForm.active === 1 ? '#3283c5' : '#C1C1C1'} /> */}
                                <Text style={tw`ml-1.5 text-sm font-bold text-[${editForm.active === 1 ? '#3283c5' : '#c1c1c1'}]`}>{language === '1' ? 'HORARIOS' : 'SCHEDULES'}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {
                            has_bono === 1
                            &&
                                <TouchableWithoutFeedback onPress={() => editForm.active !== 2 && handleChangeModule(2)}>
                                    <View style={tw`flex-1 flex-row items-center justify-center`}>
                                        <IonIcons name={'currency-usd'} size={28} color={editForm.active === 2 ? '#3283c5' : '#C1C1C1'} />
                                        <Text style={tw`ml-1.5 text-sm font-bold text-[${editForm.active === 2 ? '#3283c5' : '#c1c1c1'}]`}>{language === '1' ? 'BONOS' : 'BONUSES'}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                        }
                    </View>
                    {
                        editForm.active === 1
                        ?
                            <View style={tw`h-auto self-stretch mt-4 px-[0.5%]`}>
                                <View style={tw`flex-row`}>
                                    <View style={tw`flex-1`}>
                                        <Text style={title}>{language === '1' ? 'Lunes - Jueves' : 'Monday - Thursday'}</Text>
                                        <MaskInput
                                            value={info.pren_horario_lun_jue}
                                            onChangeText={(masked, unmasked) => dispatch(setInfo({...info, pren_horario_lun_jue: masked}))}
                                            keyboardType='numeric'
                                            mask={[/\d/, /\d/,':', /\d/, /\d/, ' - ', /\d/, /\d/,':', /\d/, /\d/,]}
                                        />
                                    </View>
                                    <View style={tw`w-1`}></View>
                                    <View style={tw`flex-1`}>
                                        <Text style={title}>{language === '1' ? 'Viernes' : 'Friday'}</Text>
                                        <MaskInput
                                            value={info.pren_horario_vie}
                                            onChangeText={(masked, unmasked) => dispatch(setInfo({...info, pren_horario_vie: masked}))}
                                            keyboardType='numeric'
                                            mask={[/\d/, /\d/,':', /\d/, /\d/, ' - ', /\d/, /\d/,':', /\d/, /\d/,]}
                                        />
                                    </View>
                                </View>

                                <View style={tw`flex-row`}>
                                    <View style={tw`flex-1`}>
                                        <Text style={title}>{language === '1' ? 'Sábado' : 'Saturday'}</Text>
                                        <MaskInput
                                            value={info.pren_horario_sab}
                                            onChangeText={(masked, unmasked) => dispatch(setInfo({...info, pren_horario_sab: masked}))}
                                            keyboardType='numeric'
                                            mask={[/\d/, /\d/,':', /\d/, /\d/, ' - ', /\d/, /\d/,':', /\d/, /\d/,]}
                                        />
                                    </View>
                                    <View style={tw`w-1`}></View>
                                    <View style={tw`flex-1`}>
                                        <Text style={title}>{language === '1' ? 'Domingo' : 'Sunday'}</Text>
                                        <MaskInput
                                            value={info.pren_horario_dom}
                                            onChangeText={(masked, unmasked) => dispatch(setInfo({...info, pren_horario_dom: masked}))}
                                            keyboardType='numeric'
                                            mask={[/\d/, /\d/,':', /\d/, /\d/, ' - ', /\d/, /\d/,':', /\d/, /\d/,]}
                                        />
                                    </View>
                                </View>
                            </View>
                        :
                            quincena === 'Q1'
                            ?
                                <View style={tw`h-auto self-stretch mt-4 justify-center items-start px-[0.5%]`}>
                                    <Text style={title}>{language === '1' ? 'Bono' : 'Bonus'}</Text>
                                    <Input
                                        edit={info.btn_editar_bono_Q1}
                                        editable={info.btn_editar_bono_Q1}
                                        optional={true}
                                        placeholder={'$0.00'}
                                        keyboardType='numeric' 
                                        value={info.pren_bono}
                                        onChangeText={(e) => dispatch(setInfo({...info, pren_bono: e}))}
                                    />
                                    <Text style={title}>{language === '1' ? 'Comentario' : 'Comment'}</Text>
                                    <MultiText
                                        edit={info.btn_editar_bono_Q1}
                                        editable={info.btn_editar_bono_Q1}
                                        placeholder={language === '1' ? 'Ingresa tu comentario' : 'Type your comment'}
                                        value={info.pren_bono_comentario}
                                        onChangeText={(e) => dispatch(setInfo({...info, pren_bono_comentario: e}))}
                                        multiline={true}
                                        numberOfLines={5}
                                    />
                                </View>
                            :
                                <View style={tw`h-auto self-stretch mt-4 justify-center items-start px-[0.5%]`}>
                                    <Text style={title}>{language === '1' ? 'Bono Permanencia' : 'Permanence Bonus'}</Text>
                                    <Input
                                        edit={info.btn_editar_bono_Q2_p}
                                        editable={info.btn_editar_bono_Q2_p}
                                        optional={true}
                                        placeholder={'$0.00'} 
                                        keyboardType='numeric' 
                                        value={info.pren_bono_permanencia} 
                                        onChangeText={(e) => dispatch(setInfo({...info, pren_bono_permanencia: e}))}
                                    />
                                    <Text style={title}>{language === '1' ? 'Comentario' : 'Comment'}</Text>
                                    <MultiText
                                        edit={info.btn_editar_bono_Q2_p}
                                        editable={info.btn_editar_bono_Q2_p}
                                        placeholder={language === '1' ? 'Ingresa tu comentario' : 'Type your comment'}
                                        value={info.pren_bono_perm_coment}
                                        onChangeText={(e) => dispatch(setInfo({...info, pren_bono_perm_coment: e}))}
                                        multiline={true}
                                        numberOfLines={5}
                                    />
                                    <View style={tw`mt-4`}></View>
                                    <Text style={title}>{language === '1' ? 'Bono Asistencia' : 'Attendance Bonus'}</Text>
                                    <Input
                                        edit={info.btn_editar_bono_Q2_a}
                                        editable={info.btn_editar_bono_Q2_a}
                                        optional={true}
                                        placeholder={'$0.00'} 
                                        keyboardType='numeric' 
                                        value={info.pren_bono_asistencia} 
                                        onChangeText={(e) => dispatch(setInfo({...info, pren_bono_asistencia: e}))}
                                    />
                                    <Text style={title}>{language === '1' ? 'Comentario' : 'Comment'}</Text>
                                    <MultiText
                                        edit={info.btn_editar_bono_Q2_a}
                                        editable={info.btn_editar_bono_Q2_a}
                                        placeholder={language === '1' ? 'Ingresa tu comentario' : 'Type your comment'}
                                        value={info.pren_bono_assit_coment}
                                        onChangeText={(e) => dispatch(setInfo({...info, pren_bono_assit_coment: e}))}
                                        multiline={true}
                                        numberOfLines={5}
                                    />
                                </View>
                    }
                    <View style={tw`flex-row self-stretch`}>
                        <TouchableOpacity
                            style={tw`flex-row h-10 bg-[#f7f7f7] rounded-2xl flex-1 items-center justify-center mt-2.5`}
                            onPress={() => setInitialState({...initialState, editForm: ({...editForm, visibleMenu: !editForm.visibleMenu, active: 1})})}
                        >
                            <Icon name={'times'} size={22} color={'#000'} />
                            <Text style={tw`text-[#000] font-bold text-base ml-1.5`}>{language === '1' ? 'Cerrar' : 'Close'}</Text>
                        </TouchableOpacity>
                        
                        {
                            
                            (info.btn_editar_bono_Q2_a || info.btn_editar_bono_Q2_p || info.btn_editar_bono_Q1) && editForm.active === 2
                            &&
                                <>
                                    <View style={tw`w-1`}></View>
                                    <TouchableOpacity
                                        style={tw`flex-row h-10 bg-[${Blue}] rounded-2xl flex-1 items-center justify-center mt-2.5`}
                                        onPress={() => handleEditBonos()}
                                    >
                                        <IonIcons name={'content-save'} size={22} color={'#fff'} />
                                        <Text style={tw`text-[#fff] font-bold text-base ml-1.5`}>{language === '1' ? 'Guardar' : 'Save'}</Text>
                                    </TouchableOpacity>
                                </>
                        }
                        {
                            editForm.active === 1
                            &&
                                <>
                                    <View style={tw`w-1`}></View>
                                    <TouchableOpacity
                                        style={tw`flex-row h-10 bg-[${Blue}] rounded-2xl flex-1 items-center justify-center mt-2.5`}
                                        onPress={() => handleEditHorarios()}
                                    >
                                        <IonIcons name={'content-save'} size={22} color={'#fff'} />
                                        <Text style={tw`text-[#fff] font-bold text-base ml-1.5`}>{language === '1' ? 'Guardar' : 'Save'}</Text>
                                    </TouchableOpacity>
                                </>
                        }
                        
                    </View>
                </ScrollView>
            </Modal>

            <Modal orientation={orientationInfo.initial} visibility={deleteVisibility} handleDismiss={() => setDeleteVisibility(!deleteVisibility)}>
                <View style={tw`justify-center items-center self-stretch h-45`}>
                    <Image
                        style={tw`w-45 h-45`}
                        resizeMode='stretch'
                        source={require('../../../../assets/error.gif')}
                    />
                </View>
                <View style={tw`justify-center items-center`}>
                    <Text style={tw`font-bold text-2xl`}>{language === '1' ? '¿Esta seguro de continuar?' : 'Are you sure you want to continue?'}</Text>
                    <Text style={tw`text-base`}>{language === '1' ? 'Este cambio no se puede revertir' : 'This change cannot be reversed'}</Text>
                </View>
                <View style={tw`flex-row mt-5 mb-2.5`}>
                    <TouchableOpacity onPress={() => setDeleteVisibility(false)} style={tw`flex-1 h-10 bg-[#E8E8E8] rounded-lg justify-center items-center flex-row`}>
                        <Icon name={'times'} size={22} color={'#000'} />
                        <Text style={tw`text-base font-bold text-[#000] ml-3`}>{language === '1' ? 'Cancelar' : 'Cancel'}</Text>
                    </TouchableOpacity>
                    <View style={tw`w-1.5`}></View>
                    <TouchableOpacity onPress={() => handleDelete()} style={tw`flex-1 h-10 bg-[#DF4740] rounded-lg justify-center items-center flex-row`}>
                        <Icon name={'trash'} size={22} color={'#fff'} />
                        <Text style={tw`text-base font-bold text-[#fff] ml-3`}>{language === '1' ? 'Sí' : 'Yes'}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <ModalLoading visibility={loading}/>
        </>
    )
}

const container = tw`flex-1 justify-center items-center px-[${isIphone ? '5%' : '3%'}] bg-white`
const title = tw`text-sm text-[${Blue}]`
const picker = tw`justify-center items-center rounded-2xl mb-2.5 h-11 px-4 bg-white shadow-md`
const box = tw`justify-start items-center h-11 flex-row border border-[#CBCBCB] mb-2.5 rounded bg-[#f7f7f7] px-2 py-2.5 self-stretch`
const list = tw`h-auto self-stretch`

const styles = StyleSheet.create({
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 6,
        height: 45,
        borderRadius: 4,
        flexDirection: 'row',
        paddingRight: 0,
        paddingLeft: isIphone ? 10 : 0
    },
})