import React, {useState, useEffect, useRef, useCallback} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Image, Alert, SafeAreaView, StatusBar, Platform, RefreshControl, TouchableWithoutFeedback} from 'react-native'
import {HeaderLandscape, HeaderPortrait, Modal, Select, MultiText, ModalLoading, FailedNetwork, Title, BottomNavBar} from '../../../../components'
import {useConnection, useNavigation, useOrientation, useScroll} from '../../../../hooks'
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../../colors/colorsApp';
import DeviceInfo from 'react-native-device-info';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getCurrentDate} from '../../../../js/dates';
import {urlVacaciones, live, login, isIphone} from '../../../../access/requestedData';
import {useDispatch, useSelector} from 'react-redux';
import {actionTemporalVacation, actionVacation} from '../../../../slices/vacationSlice';
import {useFocusEffect} from '@react-navigation/native';
import {selectLanguageApp, selectTokenInfo, selectUserInfo} from '../../../../slices/varSlice';

let token = null;
let user = null;

let language = ''

export default ({navigation, route: {params: {orientation, id_usuario, id_empleado, solicitud_pendiente}}}) => {
    const dispatch = useDispatch()
    language = useSelector(selectLanguageApp)
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)

    const listRef = useRef(null)
    const [index, setIndex] = useState(0)
    const [contador, setContador] = useState(0)
    const {handlePath} = useNavigation();
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });
    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)
    
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const [loading, setLoading] = useState(true)
    const [actionsVisibility, setActionsVisibility] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [initialState, setInitialState] = useState({
        info: {},
        prima_vacacional: {},
        id_periodo: false,
        periodos:[],
        solicitudes:  [],
        details: {},
        requestVacation: {
            initialDate_start: `${getCurrentDate().substring(8,10)}/${getCurrentDate().substring(5,7)}/${getCurrentDate().substring(0,4)}`,
            initialDate_end: `--/--/----`,
            range: `${language === '1' ? 'Del' : 'From'} ${getCurrentDate().substring(8,10)}/${getCurrentDate().substring(5,7)}/${getCurrentDate().substring(0,4)} ${language === '1' ? 'hasta el' : 'to'} --/--/----`,
            sentDate: `${getCurrentDate().substring(8,10)}/${getCurrentDate().substring(5,7)}/${getCurrentDate().substring(0,4)}`,
            inicio: '',
            fin: '',
            motivo: '',
            show_start: false,
            timestamp_start: new Date(),
            timestamp_end: new Date(), 
            show_end: false,
        },
        initialized: {
            initialDate_start: `${getCurrentDate().substring(8,10)}/${getCurrentDate().substring(5,7)}/${getCurrentDate().substring(0,4)}`,
            initialDate_end: `--/--/----`,
            range: `${language === '1' ? 'Del' : 'From'} ${getCurrentDate().substring(8,10)}/${getCurrentDate().substring(5,7)}/${getCurrentDate().substring(0,4)} ${language === '1' ? 'hasta el' : 'to'} --/--/----`,
            sentDate: `${getCurrentDate().substring(8,10)}/${getCurrentDate().substring(5,7)}/${getCurrentDate().substring(0,4)}`,
            motivo: '',
            show_start: false,
            timestamp_start: new Date(),
            timestamp_end: new Date(),
            show_end: false
        },
        currentPeriodo: '',
        id: null,
        tipo: '',
        antiguedad: {
            years: 0,
            months: 1,
            days: 0,
        }
    })

    const [visible, setVisible] = useState(false)
    const [detailsVisibility, setDetailsVisibility] = useState(false)
    const [editVisibility, setEditVisibility] = useState(false)
    const [deleteVisibility, setDeleteVisibility] = useState(false)
    const [hideReason, setHideReason] = useState(false)
    const [visiblePeriodo, setVisiblePeriodo] = useState(false)

    const {id, info, prima_vacacional, id_periodo, currentPeriodo, periodos, solicitudes, requestVacation, details, dias, tipo, initialized, antiguedad} = initialState
    
    useFocusEffect(
        useCallback(() => {
            handlePath('Vacation')
        }, [])
    );

    useEffect(() => {
        if(visible || deleteVisibility || detailsVisibility || editVisibility) setLoading(false)
    }, [visible, deleteVisibility, detailsVisibility, editVisibility])

    const getInformation = async () => {
        askForConnection()
        try{
            setLoading(true)
            const body = {
                'action': 'get_detalle_vacaciones',
                'data': {
                    'id_usuario':id_usuario,
                    'id_empleado':id_empleado,
                    'language': language,
                    'periodo': id_periodo
                },
                'live': live,
                'login': login
            }

            console.log('body: ', body)

            const request = await fetch(urlVacaciones, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
        
            const {response} = await request.json();
            if(response.status === 200){
                const spt = response.info.antiguedad.split(' ')
                setInitialState({...initialState, info: response.info, antiguedad: {...antiguedad, years: spt[0], months: spt[2], days: spt[4]}, periodos: response.periodos, currentPeriodo: !currentPeriodo ? response.periodos[0].label : currentPeriodo, prima_vacacional: response.prima_vacacional, solicitudes: response.solicitud})
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            }
        }catch(e){
            console.log('algo pasó con el internet')
            setLoading(false)
        }
    }

    useEffect(() => {
        getInformation()
    },[refresh, hasConnection, id_periodo, contador])

    const handleVisiblePeriodos = () => {
        setVisiblePeriodo(!visiblePeriodo)
    }

    const handleActionUno = (value, label) => {
        setInitialState({...initialState, id_periodo: label, currentPeriodo: label})
    }

    const handleHideActions = (id, fIndex) => {
        const nuevos = solicitudes.map(x => x.id === id ? ({...x, oculta: !x.oculta}) : ({...x, oculta: true}))
        setInitialState({...initialState, solicitudes: nuevos, id: id})
        setIndex(fIndex)
    }

    const handleInputChange = (e) => {
        setInitialState({...initialState, requestVacation: ({...requestVacation, motivo: e})})
    }

    const handleSave = async () => {
        askForConnection()
        if(requestVacation.initialDate_end !== '--/--/----'){
            try{
                setLoading(true)
                const inicio = (requestVacation.initialDate_start).substring(6,10) + '-' + (requestVacation.initialDate_start).substring(3,5) + '-' + (requestVacation.initialDate_start).substring(0,2)
                const fin = requestVacation.fin;

                let f1 = new Date(parseInt((requestVacation.initialDate_start).substring(6,10)), parseInt((requestVacation.initialDate_start).substring(3,5)), parseInt((requestVacation.initialDate_start).substring(0,2)))
                let f2 = new Date(parseInt((fin).substring(0,4)), parseInt((fin).substring(5,7)), parseInt((fin).substring(8,10)))

                if(f1 <= f2){
                    const body = {
                        'action': 'add_solicitud_vac',
                        'data': {
                            'id_usuario': id_usuario,
                            'id_empleado':id_empleado,
                            'language': language,
                            'motivo': requestVacation.motivo,
                            'fechas': `${inicio} - ${requestVacation.fin}`
                        },
                        'live': live,
                        'login': login
                    }
            
                    const request = await fetch(urlVacaciones, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            token: token,
                        },
                        body: JSON.stringify(body),
                    });
                
                    const {response} = await request.json();
                    if(response.status === 200){
                        setInitialState({...initialState, requestVacation: initialized, tipo: '1'})
                        setVisible(!visible)
                        setRefresh(!refresh)
                        setActionsVisibility(true)
                        /* dispatch(actionSolicitud({id: id_empleado, tipo: '1'}))
                        dispatch(actionSolicitudTemporal({id: id_empleado, tipo: '1'})) */
                        setTimeout(() => {
                            setActionsVisibility(false)
                        }, 3500)
                    }
                    else {
                        Alert.alert(
                            'Error',
                            response.response,
                            [
                                { text: 'OK'}
                            ]
                        )
                        setLoading(false)
                    }
                }
                else {
                    Alert.alert(
                        language === '1' ? 'Fecha Inválida' : 'Invalid Date',
                        language === '1' ? 'La fecha de inicio, no puede ser superior a la fecha final.' : 'The start date cannot be exceed than the end date.',
                        [
                            { text: 'OK'}
                        ]
                    )
                }
            }catch(e){
                console.log('algo pasó con el internet')
                setLoading(false)
            }
        }
        else {
            Alert.alert(
                'Error',
                'No puedes dejar campos vacíos.',
                [
                    { text: 'OK'}
                ]
            )
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        askForConnection()
        try{
            setLoading(true)
            const body = {
                'action': 'delete_solicitud_vac',
                'data': {
                    'id_usuario':id_usuario,
                    'id_vacsol':id
                },
                'live': live,
                'login': login
            }
    
            const request = await fetch(urlVacaciones, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
        
            const {response} = await request.json();
            if(response.status === 200){
                setInitialState({...initialState, tipo: '3'})
                setDeleteVisibility(!deleteVisibility)
                /* dispatch(actionSolicitud({id: id_empleado, tipo: '2'}))
                dispatch(actionSolicitudTemporal({id: id_empleado, tipo: '2'})) */
                setActionsVisibility(true)
                setTimeout(() => {
                    setActionsVisibility(false)
                }, 3500)
                setRefresh(!refresh)
            }
            else {
                Alert.alert(
                    'Error',
                    response.response,
                    [
                        { text: 'OK'}
                    ]
                )
                setLoading(false)
            }
        }catch(e){
            console.log('Algo pasó con el internet')
            setLoading(false)
        }

    }

    const handleEdit = async () => {
        if(requestVacation.initialDate_end !== '--/--/----'){
            askForConnection()
            try{
                setLoading(true)
                const inicio = (requestVacation.initialDate_start).substring(6,10) + '-' + (requestVacation.initialDate_start).substring(3,5) + '-' + (requestVacation.initialDate_start).substring(0,2)
                const fin = (requestVacation.initialDate_end).substring(6,10) + '-' + (requestVacation.initialDate_end).substring(3,5) + '-' + (requestVacation.initialDate_end).substring(0,2)
                
                const body = {
                    'action': 'edit_solicitud_vac',
                    'data': {
                        'id_usuario': id_usuario,
                        'id_vacsol':id,
                        'language': language,
                        'fechas': `${inicio} - ${fin}`
                    },
                    'live': live,
                    'login': login
                }

                const request = await fetch(urlVacaciones, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(body),
                });
            
                const {response} = await request.json();
                if(response.status === 200){
                    setInitialState({...initialState, requestVacation: initialized, tipo: '2'})
                    setEditVisibility(!editVisibility)
                    setActionsVisibility(true)
                    setTimeout(() => {
                        setActionsVisibility(false)
                    }, 3500)
                    setRefresh(!refresh)
                }
                else {
                    Alert.alert(
                        'Error',
                        response.response,
                        [
                            { text: 'OK'}
                        ]
                    )
                }
            }catch(e){
                console.log('algo pasó con el internet')
                setLoading(false)
            }
        }
        else {
            Alert.alert(
                'Campos Vacíos',
                'Campos de fecha requeridos',
                [
                    { text: 'OK'}
                ]
            )
            setLoading(false)
        }
    }

    const handleDate = ({nativeEvent: {timestamp}}, type) => {
        let valida = new Date(timestamp)
        let añoSeleccionado = parseInt(valida.getFullYear());
        let añoPermitido = (parseInt(getCurrentDate().substring(0,4)) + 1);

        if(timestamp !== undefined){
            if(añoSeleccionado <= añoPermitido){
                let date = new Date(timestamp)
                let dia = date.toLocaleDateString().substring(3,5)
                let mes = date.toLocaleDateString().substring(0,2)
                let año = date.getFullYear()
    
                let isIOS = DeviceInfo.getDeviceId().includes('iPhone')
    
                let diaIOS = parseInt(date.getDate())
                let mesIOS = parseInt(date.getMonth() + 1)
    
                diaIOS = diaIOS < 10 ? `0${diaIOS}` : diaIOS
                mesIOS = mesIOS < 10 ? `0${mesIOS}` : mesIOS
                
                switch (type) {
                    case 'start':
                        setInitialState({...initialState, requestVacation: ({...requestVacation, show_start: !requestVacation.show_start, timestamp_start: date, initialDate_start: !isIOS ? dia + '/' + mes + '/' + año : diaIOS + '/' + mesIOS + '/' + año, range: `${language === '1' ? 'Del' : 'From'} ${(!isIOS ? dia + '/' + mes + '/' + año : diaIOS + '/' + mesIOS + '/' + año)}` + `${language === '1' ? ' hasta el' : ' to'} ` + (requestVacation.initialDate_end).substring(0,2) + '/' + (requestVacation.initialDate_end).substring(3,5) + '/' + (requestVacation.initialDate_end).substring(6,10), sentDate: `${(!isIOS ? año + '-' + mes + '-' + dia : año + '-' + mesIOS + '-' + diaIOS)}` + ' - ' + `${requestVacation.initialDate_end.substring(6,10)}-${requestVacation.initialDate_end.substring(3,5)}-${requestVacation.initialDate_end.substring(0,2)}`, inicio: `${(!isIOS ? año + '-' + mes + '-' + dia : año + '-' + mesIOS + '-' + diaIOS)}`})})
                        break;
                    case 'end':
                        setInitialState({...initialState, requestVacation: ({...requestVacation, show_end: !requestVacation.show_end, timestamp_end: date, initialDate_end: !isIOS ? dia + '/' + mes + '/' + año : diaIOS + '/' + mesIOS + '/' + año, range: language === '1' ? 'Del ' + (requestVacation.initialDate_start).substring(0,2) + '/' + (requestVacation.initialDate_start).substring(3,5) + '/' + (requestVacation.initialDate_start).substring(6,10) + ' hasta el ' + (!isIOS ? dia + '/' + mes + '/' + año : diaIOS + '/' + mesIOS + '/' + año) : 'From ' + (requestVacation.initialDate_start).substring(0,2) + '/' + (requestVacation.initialDate_start).substring(3,5) + '/' + (requestVacation.initialDate_start).substring(6,10) + ' to ' + (!isIOS ? dia + '/' + mes + '/' + año : diaIOS + '/' + mesIOS + '/' + año), sentDate: `${requestVacation.initialDate_start.substring(6,10)}-${requestVacation.initialDate_start.substring(3,5)}-${requestVacation.initialDate_start.substring(0,2)}` + ' - ' + `${(!isIOS ? año + '-' + mes + '-' + dia : año + '-' + mesIOS + '-' + diaIOS)}`, fin: `${(!isIOS ? año + '-' + mes + '-' + dia : año + '-' + mesIOS + '-' + diaIOS)}`})})
                        break;
                    default:
                        break;
                }
            }

            else {
                Alert.alert(
                    language === '1' ? 'Fecha Inválida' : 'Invalid Date',
                    language === '1' ? 'No puede seleccionar años posteriores al actual' : 'You cannot select years later than the current year',
                    [
                        { text: 'OK'}
                    ]
                )
                switch (type) {
                    case 'start':
                        setInitialState({...initialState, requestVacation: ({...requestVacation, show_start: !requestVacation.show_start})});
                        break;
                    case 'end':
                        setInitialState({...initialState, requestVacation: ({...requestVacation, show_end: !requestVacation.show_end})});
                        break;
                    default:
                        break;
                }
            }
        }
        else{
            switch (type) {
                case 'start':
                    setInitialState({...initialState, requestVacation: ({...requestVacation, show_start: !requestVacation.show_start})});
                    break;
                case 'end':
                    setInitialState({...initialState, requestVacation: ({...requestVacation, show_end: !requestVacation.show_end})});
                    break;
                default:
                    break;
            }
        }
    }


    const handleDetails = async (status) => {
        askForConnection()
        setLoading(true)
        try{
            const body = {
                'action': 'get_detalle_solicitud',
                'data': {
                    'id_usuario':id_usuario,
                    'id_solicitud':id,
                    'language': language
                },
                'live': live,
                'login': login
            }
    
            const request = await fetch(urlVacaciones, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
        
            const {response} = await request.json();
            
            if(response.status === 200){
                // setActions(status)
                setDetailsVisibility(!detailsVisibility)
                setInitialState({...initialState, details: ({...details, btn_aprobar: response.btn_aprobar, dias: response.dias, estatus: status, fechas: response.fechas, motivo_cancelado: response.motivo_cancelado, motivo_rechazo: response.motivo_rechazo, motivo_solicitud: response.motivo_solicitud})})
            }
            else {
                Alert.alert(
                    'Error',
                    response.response,
                    [
                        { text: 'OK'}
                    ]
                )
                setLoading(false)
            }
        }catch(e){
            console.log('Algo pasó con el internet')
            setLoading(false)
        }
    }

    const handleAprove = async (status) => {
        askForConnection()
        try{
            setLoading(true)
            const body = {
                'action': 'aprobar_solicitud_vac',
                'data': {
                    'id_usuario':id_usuario,
                    'id_vacsol':id,
                    'status': status,
                    'motivo': requestVacation.motivo,
                    'language': language,
                },
                'live': live,
                'login': login
            }
    
            const request = await fetch(urlVacaciones, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
        
            const {response} = await request.json();

            if(response.status === 200){
                setDetailsVisibility(!detailsVisibility)
                setInitialState({...initialState, tipo: status === 1 ? '4' : '5'})
                if(response.last){
                    dispatch(actionVacation({id: response.last.id, empleado: response.last}))
                    dispatch(actionTemporalVacation({id: response.last.id, empleado: response.last}))
                }
                setActionsVisibility(true)
                setTimeout(() => {
                    setActionsVisibility(false)
                }, 3500)
                setRefresh(!refresh)
                setHideReason(false)
            }
            else {
                Alert.alert(
                    'Error',
                    response.response,
                    [
                        { text: 'OK'}
                    ]
                )
                setLoading(false)
            }
        }catch(e){
            console.log('algo pasó con el internet')
            setLoading(false)
        }
    }

    const Contenedor = ({title, leftPosition = true, hasBottomLine = true, down = true}) => {
        return (
            <View style={{alignSelf: 'stretch', borderColor: '#CBCBCB', alignItems: leftPosition ? 'flex-start' : 'center', justifyContent: 'center', paddingBottom: 0, marginLeft: hasBottomLine ? 7 : 0}}>
                <Text style={{fontSize: 14, color: '#000'}}>{title}</Text>
            </View>
        )
    }

    const Solicitudes = ({id, inicio, fin, status, dias, oculta, btn_editar, btn_delete, fIndex}) => {
        return(
            <View style={{backgroundColor: '#f7f7f7', shadowColor: '#000',
            elevation: 5,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27, marginHorizontal: 5, marginVertical: 10, borderRadius: 10}}>
                <TouchableWithoutFeedback onPress={() => handleHideActions(id, fIndex)}>
                    <View style={{flex: 1, height: oculta ? 65 : 110, marginHorizontal: orientationInfo.initial === 'PORTRAIT' ? 0 : 2.5, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{width: 'auto', marginLeft: 15, marginRight: 5}}>
                                {
                                    status === '0'
                                    ?
                                        <IonIcons name={'clock'} color={'#abbac3'} size={26}/>
                                    :
                                        <Icon name={status === '2' || status === '3' ? 'times' : 'check'} size={status === '3' ? 28 : 24} color={status === '2' || status === '3' ? '#DC3232' : '#5FA75D'} />
                                }
                            </View>
                            <View style={{flex: 1, marginLeft: 10, paddingVertical: 8}}>
                                <Text style={styles.title}>{language === '1' ? 'Fecha seleccionada' : 'Selected Date'}</Text>
                                <Contenedor title={`${inicio} - ${fin}`} hasBottomLine={false} down={false}/>
                            </View>
                            <View style={{width: 'auto', paddingHorizontal: 10}}>
                                <Text style={styles.title}>{language === '1' ? 'Días' : 'Days'}</Text>
                                <Contenedor title={dias} hasBottomLine={false} down={false} leftPosition={false}/>
                            </View>
                        </View>
                        {
                            !oculta
                            &&
                                <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <View style={{flex: 1}}>
                                        <TouchableOpacity onPress={() => handleDetails(status)} style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#74A9C4', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
                                            <Icon name={'folder-open'} size={18} color={'#fff'} />
                                            <Text style={{fontSize: 14, color: '#fff', marginLeft: 12, fontWeight: 'bold'}}>{status === '0' ? btn_editar && btn_delete ? language === '1' ? 'Ver' : 'View' : language === '1' ? 'Ver Detalles' : 'View Details' : language === '1' ? 'Ver Detalles' : 'View Details'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        status === '0'
                                        &&
                                            btn_editar
                                            &&
                                                <>
                                                    <View style={{width: 6}}></View>
                                                    <View style={{flex: 1}}>
                                                        <TouchableOpacity onPress={() => setEditVisibility(!editVisibility)} style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#C3E5C4', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
                                                            <Icon name={'pencil'} size={22} color={'#000'} />
                                                            <Text style={{fontSize: 14, color: '#000', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Editar' : 'Edit'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{width: 6}}></View>
                                                    <View style={{flex: 1}}>
                                                        <TouchableOpacity onPress={() => setDeleteVisibility(!deleteVisibility)} 
                                                        style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#DC4D4D', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
                                                            <Icon name={'trash'} size={22} color={'#fff'} />
                                                            <Text style={{fontSize: 14, color: '#fff', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Borrar' : 'Delete'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </>
                                    }
                                </View>
                        }
                    </View>
                </TouchableWithoutFeedback>
            </View>
            
        )
    }

    const Dias = ({id, dia}) => {
        return(
            <View style={{flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: .5, borderColor: '#dadada', flex: 1}}>
                <View style={{width: '20%', height: 'auto', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14, color: '#000'}}>{id}</Text>
                </View>
                <View style={{flex: 1, height: 'auto', justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, color: '#000'}}>{dia}</Text>
                </View>
            </View>
        )
    }

    const reloading = () => {
        setLoading(true)
    }

    return(
        hasConnection
        ?
            <View style={{backgroundColor: '#fff', flex: 1}}>
                <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
                {
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <HeaderPortrait title={language === '1' ? 'Detalle de Vacaciones' : 'Vacation Detail'} screenToGoBack={'Vacation'} navigation={navigation} visible={true} translateY={translateY}/>
                    :
                        <HeaderLandscape title={language === '1' ? 'Detalle de Vacaciones' : 'Vacation Detail'} screenToGoBack={'Vacation'} navigation={navigation} visible={true} translateY={translateY}/>
                }
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{alignSelf: 'stretch', backgroundColor: '#fff'}}
                        refreshControl={
                            <RefreshControl
                                progressBackgroundColor={'#EC5C25'}
                                colors={['#fff']}
                                refreshing={false}
                                onRefresh={() => getInformation()}
                            />
                        }
                        onScroll={handleScroll}
                        contentContainerStyle={{paddingTop: paddingTop}}
                    >
                        <View style={[styles.container,  {paddingBottom: isIphone ? 25 : 0}]}>
                            <View style={{height: 'auto', alignSelf: 'stretch', paddingVertical: 5}}>
                                <Title title={language === '1' ? 'INFORMACIÓN DEL EMPLEADO' : 'EMPLOYEE INFORMATION'} icon={'info'} tipo={1} hasBottom={false}/>
                            </View>
                            <View style={{height: 'auto', alignSelf: 'stretch', padding: 10, backgroundColor: '#fff', shadowColor: '#000', elevation: 5, shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.34,
                                shadowRadius: 6.27, borderRadius: 15}}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center', height: 23, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{height: 'auto', flex: 1, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{width: 'auto', height: 23, justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingHorizontal: 6, borderRadius: 5}}>
                                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{info.num_empleado}</Text>
                                        </View>
                                        <View style={{flex: 1, height: 23, marginLeft: 4, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', borderRadius: 5}}>
                                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{info.nombre}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                                    <Text style={{fontSize: 14.5, fontWeight: 'bold', color: Blue}}>{info.puesto}</Text>
                                </View>
                                
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 5}}>
                                            <View style={{flex: 1, marginLeft: 6}}>
                                                <Text style={styles.title}>{language === '1' ? 'Área' : 'Area'}</Text>
                                                <Contenedor title={info.area} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                            <View style={{flex: 1, marginLeft: 6}}>
                                                <Text style={styles.title}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Admission'}</Text>
                                                <Contenedor title={info.fecha_ingreso} hasBottomLine={false} down={false}/>
                                            </View>
                                            <View style={{width: 6}}></View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{language === '1' ? 'Antiguedad' : 'Antiquity'}</Text>
                                                <Contenedor title={`${antiguedad.years} ${antiguedad.years === '1' ? 'Año,' : 'Años,'} ${antiguedad.months} ${antiguedad.months === '1' ? 'Mes,' : 'Meses,'} ${antiguedad.days} ${antiguedad.days === '1' ? 'Día' : 'Días'}`} hasBottomLine={false} down={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{height: 'auto', alignSelf: 'stretch', marginTop: 25}}>
                                <TouchableOpacity style={[styles.picker, {flexDirection: 'row', flex: 1}]} onPress={() => handleVisiblePeriodos()}>
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{color: '#000'}}>{currentPeriodo}</Text>
                                    </View>
                                    <View style={{width: 'auto'}}>
                                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                    </View>
                                </TouchableOpacity>
                                <View style={{height: 'auto', marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', padding: 4}}>
                                            <Text style={[styles.title]}>{language === '1' ? 'PV Nómina' : 'Date of Entry'}</Text>
                                            <Contenedor title={prima_vacacional.fecha_pago} hasBottomLine={false} leftPosition={false} down={false}/>
                                        </View>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4}}>
                                            <Text style={styles.title}>{language === '1' ? 'Años' : 'Years'}</Text>
                                            <Contenedor title={prima_vacacional.years} hasBottomLine={false} leftPosition={false} down={false}/>
                                        </View>
                                        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', padding: 4}}>
                                            <Text style={styles.title}>{language === '1' ? 'Estado' : 'State'}</Text>
                                            <View style={{flexDirection: 'row'}}>
                                                <Icon name={prima_vacacional.pay === 1 ? 'check' : 'times'} size={20} color={prima_vacacional.pay === 1 ? '#5FA75D' : '#DF4740'} />
                                                <View style={{width: 4}}></View>
                                                <Contenedor title={prima_vacacional.estatus} hasBottomLine={false} leftPosition={false} down={false}/>
                                            </View>
                                            
                                        </View>
                                    </View>
                                    {
                                        orientationInfo.initial === 'PORTRAIT'
                                        ?
                                            <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', marginTop: 5}}>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                    <View style={styles.legends}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>DC</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.dias_correspondientes}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                    <View style={styles.legends}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>DD</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.dias_disfrutados}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                    <View style={[styles.legends, {backgroundColor: '#BFCCE7'}]}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>DP</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.dias_pendientes}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                    <View style={[styles.legends, {backgroundColor: '#E5E2D2'}]}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>PA</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.dias_periodos_anterior}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                    <View style={[styles.legends, {backgroundColor: '#C3E5C4'}]}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>TD</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.total_dias}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        :
                                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                                    <View style={[styles.legends, {marginRight: 10}]}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>DC</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.dias_correspondientes}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.legends, {marginRight: 10}]}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>DD</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.dias_disfrutados}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.legends, {backgroundColor: '#BFCCE7', marginRight: 10}]}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>DP</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.dias_pendientes}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.legends, {backgroundColor: '#E5E2D2', marginRight: 10}]}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>PA</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.dias_periodos_anterior}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.legends, {backgroundColor: '#C3E5C4', marginRight: 10}]}>
                                                        <View style={styles.headerLegend}>
                                                            <Text style={{fontSize: 12, color: '#000'}}>TD</Text>
                                                        </View>
                                                        <View style={styles.subHeaderLegend}>
                                                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{prima_vacacional.total_dias}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                    }
                                </View>
                            </View>
                            <Title title={language === '1' ? 'SOLICITUDES DE VACACIONES' : 'VACATION REQUESTS'} icon={'calendar'} tipo={1} hasBottom={false}/>
                            {
                                info.btn_solicitud
                                &&
                                    <TouchableOpacity style={{flexDirection: 'row', height: 'auto', justifyContent: 'center', alignItems: 'center', marginBottom: 10, backgroundColor: Blue, paddingVertical: 8, borderRadius: 8, alignSelf: 'stretch'}} onPress={() => setVisible(!visible)}>
                                        <IonIcons name={'calendar-plus'} size={26} color={'#fff'} />
                                        <Text style={{fontSize: 17, color: '#fff', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Solicitar Vacaciones' : 'Request Vacation'}</Text>
                                    </TouchableOpacity>
                            }
                            {
                                solicitudes.length > 0
                                ?
                                    <FlatList
                                        ref={listRef}
                                        initialScrollIndex={index}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.list}
                                        data={solicitudes}
                                        numColumns={1}
                                        renderItem={({item, index: fIndex}) => <Solicitudes id={item.id} status={item.status} inicio={item.inicio} fin={item.fin} dias={item.dias} oculta={item.oculta} btn_editar={item.btn_editar} btn_delete={item.btn_delete} fIndex={fIndex}/>}
                                        keyExtractor={item => String(item.id)}
                                        key={'_'}
                                    />
                                :
                                    !loading
                                    &&
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: info.btn_solicitud ? 25: 50}}>
                                            <Image
                                                style={{width: 120, height: 120, resizeMode:'stretch'}}
                                                source={require('../../../../../assets/calendary.gif')}
                                            />
                                        </View>
                            }
                            <View style={{marginBottom: '3%'}}></View>
                        </View>
                </ScrollView>

                <Modal orientation={orientationInfo.initial} visibility={visiblePeriodo} handleDismiss={handleVisiblePeriodos}>
                    <Select data={periodos} handleVisiblePeriodos={handleVisiblePeriodos} handleActionUno={handleActionUno} />
                </Modal>

                <Modal orientation={orientationInfo.initial} visibility={visible} handleDismiss={() => setVisible(!visible)}>
                    <ScrollView
                        style={{alignSelf: 'stretch'}}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <Title title={language === '1' ? 'SOLICITAR VACACIONES' : 'REQUEST VACATION'} icon={'calendar'} tipo={1} itCloses={() => {
                            setVisible(!visible)
                            setInitialState({...initialState, requestVacation: initialized})   
                        }} vertical={false}/>
                        <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', paddingTop: 8}}>
                            <TouchableOpacity style={[styles.picker, {flexDirection: 'row', flex: 1}]} onPress={() => setInitialState({...initialState, requestVacation: ({...requestVacation, show_start: !requestVacation.show_start, show_end: false})})}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: '#000'}}>{requestVacation.initialDate_start}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width: 4}}></View>
                            <TouchableOpacity style={[styles.picker, {flexDirection: 'row', flex: 1}]} onPress={() => setInitialState({...initialState, requestVacation: ({...requestVacation, show_end: !requestVacation.show_end, show_start: false})})}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: '#000'}}>{requestVacation.initialDate_end}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop: isIphone ? requestVacation.show_start || requestVacation.show_end ? 5 : 0 : 0, marginBottom: isIphone ? requestVacation.show_start || requestVacation.show_end ? 20 : 0 : 0}}>
                            {
                                requestVacation.show_start
                                &&
                                    <DateTimePicker
                                        style={{backgroundColor: '#fff'}}
                                        testID='dateTimePicker'
                                        value={requestVacation.timestamp_start}
                                        mode={'date'}
                                        is24Hour={true}
                                        display={'spinner'}
                                        onChange={(e) => handleDate(e,'start')}
                                    />
                            }
                            {
                                requestVacation.show_end
                                &&
                                    <DateTimePicker
                                        style={{backgroundColor: '#fff'}}
                                        testID='dateTimePicker'
                                        value={requestVacation.timestamp_end}
                                        mode={'date'}
                                        is24Hour={true}
                                        display={'spinner'}
                                        onChange={(e) => handleDate(e,'end')}
                                    />
                            }
                        </View>
                        <View style={{paddingHorizontal: 1}}>
                            <View style={{height: 'auto', alignSelf: 'stretch'}}>
                                <TextInput 
                                    editable={false}
                                    value={requestVacation.range}
                                    style={[styles.picker, {textAlign: 'center', fontSize: 16, color: '#adadad'}]}
                                />
                            </View>
                            <MultiText 
                                placeholder={language === '1' ? 'Especifique el motivo de su solicitud de vacaciones en caso que lo crea necesario' : 'Specify the reason for your vacation request if you think it is necessary.'}
                                value={requestVacation.motivo}
                                onChangeText={(e) => handleInputChange(e)}
                                multiline={true}
                                numberOfLines={5}
                                fontSize={16}
                            />
                        </View>
                        <View style={{height: 'auto', marginBottom: 8, padding: 15, alignSelf: 'stretch', backgroundColor: 'rgba(50,131,197,.1)', borderRadius: 8, marginTop: 15}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name={'info'} size={24} color={Blue} />
                                <View style={{flex: 1}}>
                                    <Text style={{marginLeft: 15, fontSize: 16, color: Blue}}>{language === '1' ? 'Podrá hacer su solicitud de vacaciones siempre y cuando:' : 'You will be able to make your vacation request as long as:'}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6}}>
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: 16, color: Blue}}>{language === '1' ? '1- Tenga días disponibles (Se tomaran primero los días que tenga pendientes de otro periodo).' : '1- Have available days (Days pending from another period will be taken first).'}</Text>
                                </View>
                            </View>
                            
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6}}>
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: 16, color: Blue}}>{language === '1' ? '2- En caso de no tener días disponibles solo se podrá adelantar un 50% de los días del siguiente período y no antes de 6 meses.' : '2- If there are no days available, only 50% of the days of the following period may be advanced and not earlier than 6 months.'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', height: 'auto', alignSelf: 'stretch'}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={() => {
                                    setVisible(!visible)
                                    setInitialState({...initialState, requestVacation: initialized})
                                }} style={{flexDirection: 'row', height: 'auto', justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#f7f7f7', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
                                    <Icon name={'times'} size={22} color={'#000'} />
                                    <Text style={{fontSize: 14, color: '#000', marginLeft: 6, fontWeight: 'bold'}}>{language === '1' ? 'Cerrar' : 'Close'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: 6}}></View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={() => handleSave()} style={{flexDirection: 'row', height: 'auto', justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: Blue, paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
                                    <IonIcons name={'content-save'} size={22} color={'#fff'} />
                                    <Text style={{fontSize: 14, color: '#fff', marginLeft: 6, fontWeight: 'bold'}}>{language === '1' ? 'Guardar' : 'Save'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>

                {/* //modal para ver */}
                <Modal orientation={orientationInfo.initial} visibility={detailsVisibility} handleDismiss={() => setDetailsVisibility(!detailsVisibility)}>
                    <ScrollView
                        style={{alignSelf: 'stretch'}}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <Title title={language === '1' ? 'DÍAS SOLICITADOS' : 'REQUESTED DAYS'} icon={'calendar'} tipo={1} itCloses={() => setDetailsVisibility(!detailsVisibility)} hasBottom={false} vertical={false}/>
                        <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 8, paddingBottom: 8, alignSelf: 'stretch'}}>
                                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>{language === '1' ? 'Días de Vacaciones Solicitados' : 'Vacation Days Requested'}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{color: '#000'}}>{language === '1' ? 'Fecha: ' : 'Date: '} </Text>
                                    <View style={{backgroundColor: '#C3E5C4', borderRadius: 3, padding: 3, paddingHorizontal: 6}}>
                                        <Text style={{color: '#000', fontSize: 13, fontWeight: 'bold'}}>{details.fechas}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', backgroundColor: '#F7F7F7'}} onPress={() => setInitialState({...initialState, areLegendsHiden: !areLegendsHiden})}>
                            <View style={{width: '20%', height: 'auto', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>No.</Text>
                            </View>
                            <View style={{flex: 1, height: 'auto', justifyContent: 'center'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>{language === '1' ? 'Días Solicitados' : 'Requested Days'}</Text>
                            </View>
                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.list}
                            data={details.dias}
                            numColumns={1}
                            renderItem={({item}) => <Dias id={item.id} dia={item.dia}/>}
                            keyExtractor={item => String(item.id)}
                        />
                        {
                            details.motivo_solicitud
                            ?
                                <View style={{height: 'auto', marginTop: 8, marginBottom: 4, padding: 8, alignSelf: 'stretch', backgroundColor: (details.estatus === '0' || details.estatus === '1') ? 'rgba(50,131,197,.1)' : 'rgba(220,50,50,.1)', borderRadius: 8}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{color: (details.estatus === '0' || details.estatus === '1') ? Blue : '#DC3232', fontWeight: 'bold', fontSize: 15}}>{`${language === '1' ? 'Motivo: ' : 'Reason: '}`}<Text style={{fontWeight:'normal'}}>{(details.estatus === '0' || details.estatus === '1') ? details.motivo_solicitud : details.motivo_rechazo}</Text></Text>
                                    </View>
                                </View>
                            :
                                <></>
                        }
                        
                        {
                            
                            !hideReason && details.btn_aprobar && solicitud_pendiente
                            &&
                                <View style={{flexDirection: 'row', marginBottom: hideReason ? 16 : 0, marginTop: 8}}>
                                    <TouchableOpacity
                                        style={{height: 40, backgroundColor: '#DC4D4D', borderRadius: 8, flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                                        onPress={() => setHideReason(!hideReason)}
                                    >
                                        <Icon name={'times'} size={22} color={'#fff'} />
                                        <Text style={{fontSize: 16, color: '#fff', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'NO aprobar' : 'No approve'}</Text>
                                    </TouchableOpacity>
                                    
                                    <View style={{width: 6}}></View>
                                    <TouchableOpacity
                                        style={{height: 40, backgroundColor: Blue, borderRadius: 8, flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                                        onPress={() => handleAprove(1)}
                                    >
                                        <Icon name={'check'} size={22} color={'#fff'} />
                                        <Text style={{fontSize: 16, color: '#fff', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Aprobar' : 'Approve'}</Text>
                                    </TouchableOpacity>
                                </View>
                        }
                        {
                            hideReason && solicitud_pendiente
                            &&   
                                <>
                                    <View style={{padding: 4, marginTop: 10}}>
                                        <Text style={[styles.title, {fontSize: 15}]}>Motivo del rechazo de la solicitud</Text>
                                    </View>
                                    <MultiText 
                                        placeholder={language === '1' ? 'Especifique el motivo de su solicitud de vacaciones en caso que lo crea necesario' : 'Specify the reason for your vacation request if you think it is necessary.'}
                                        value={requestVacation.motivo}
                                        onChangeText={(e) => handleInputChange(e)}
                                        multiline={true}
                                        numberOfLines={5}
                                    />
                                    <View style={{flexDirection: 'row', marginTop: 16}}>
                                        <TouchableOpacity
                                            style={{height: 40, backgroundColor: '#f7f7f7', borderRadius: 8, flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                                            onPress={() => setHideReason(!hideReason)}
                                        >
                                            <Icon name={'times'} size={22} color={'#000'} />
                                            <Text style={{fontSize: 16, color: '#000', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Cancelar' : 'Cancel'}</Text>
                                        </TouchableOpacity>
                                        <View style={{width: 6}}></View>
                                        <TouchableOpacity
                                            style={{height: 40, backgroundColor: Blue, borderRadius: 8, flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                                            onPress={() => handleAprove(0)}
                                        >
                                            <Icon name={'paper-plane'} size={20} color={'#fff'} />
                                            <Text style={{fontSize: 16, color: '#fff', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Enviar' : 'Send'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                        }
                    </ScrollView>
                </Modal>
                
                <Modal orientation={orientationInfo.initial} visibility={deleteVisibility} handleDismiss={() => setDeleteVisibility(!deleteVisibility)}>
                    <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', height: 180}}>
                        <Image
                            style={{width: 150, height: 150}}
                            resizeMode='stretch'
                            source={require('../../../../../assets/error.gif')}
                        />
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 24}}>¿Esta seguro de continuar?</Text>
                        <Text style={{fontSize: 16}}>Este cambio no se puede revertir</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 10}}>
                        <TouchableOpacity onPress={() => setDeleteVisibility(!deleteVisibility)} style={{flex: 1, height: 40, backgroundColor: '#f7f7f7', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <Icon name={'times'} size={22} color={'#000'} />
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000', marginLeft: 12}}>Cancelar</Text>
                        </TouchableOpacity>
                        <View style={{width: 6}}></View>
                        <TouchableOpacity onPress={() => handleDelete()} style={{flex: 1, height: 40, backgroundColor: '#DF4740', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <Icon name={'trash'} size={22} color={'#fff'} />
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 12}}>Sí</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal orientation={orientationInfo.initial} visibility={actionsVisibility} handleDismiss={() => setActionsVisibility(!actionsVisibility)}>
                    <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', height: 180}}>
                        <Image
                            style={{width: 150, height: 150}}
                            resizeMode='stretch'
                            source={require('../../../../../assets/correct.gif')}
                        />
                    </View>
                    <View style={{height: 'auto', justifyContent: 'center', alignItems: 'center', padding: 16}}>
                        <Text style={{fontWeight: 'bold', fontSize: 24, textAlign: 'center'}}>{tipo === '1' ? '¡Se registró la solicitud correctamente!' : tipo === '2' ? '¡Se modificó la solicitud correctamente!' : tipo === '4' ? '!Se ha aprobado correctamente la solicitud!' : tipo === '5' ? '¡La solicitud fue rechazada correctamente!' : '¡Se eliminó la solicitud correctamente!'}</Text>
                    </View>
                </Modal>

                <Modal orientation={orientationInfo.initial} visibility={editVisibility} handleDismiss={() => setEditVisibility(!editVisibility)}>
                    <Title title={language === '1' ? 'EDITAR VACACIONES' : 'EDIT VACATION'} icon={'calendar'} tipo={1} vertical={false} itCloses={() => setEditVisibility(!editVisibility)}/>
                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', paddingTop: 8}}>
                        <TouchableOpacity style={[styles.picker, {flexDirection: 'row', flex: 1}]} onPress={() => setInitialState({...initialState, requestVacation: ({...requestVacation, show_start: !requestVacation.show_start, show_end: false})})}>
                            <View style={{flex: 1}}>
                                <Text>{requestVacation.initialDate_start}</Text>
                            </View>
                            <View style={{width: 'auto'}}>
                                <Icon name='calendar' size={20} color={'#4F4F4F'} />
                            </View>
                        </TouchableOpacity>
                        <View style={{width: 4}}></View>
                        <TouchableOpacity style={[styles.picker, {flexDirection: 'row', flex: 1}]} onPress={() => setInitialState({...initialState, requestVacation: ({...requestVacation, show_end: !requestVacation.show_end, show_start: false})})}>
                            <View style={{flex: 1}}>
                                <Text>{requestVacation.initialDate_end}</Text>
                            </View>
                            <View style={{width: 'auto'}}>
                                <Icon name='calendar' size={20} color={'#4F4F4F'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: isIphone ? requestVacation.show_start || requestVacation.show_end ? 5 : 0 : 0, marginBottom: isIphone ? requestVacation.show_start || requestVacation.show_end ? 20 : 0 : 0}}>
                        {
                            requestVacation.show_start
                            &&
                                <DateTimePicker
                                    style={{backgroundColor: '#fff'}}
                                    testID='dateTimePicker'
                                    value={requestVacation.timestamp_start}
                                    mode={'date'}
                                    is24Hour={true}
                                    display={isIphone ? 'spinner' : 'spinner'}
                                    onChange={(e) => handleDate(e,'start')}
                                />
                        }
                        {
                            requestVacation.show_end
                            &&
                                <DateTimePicker
                                    style={{backgroundColor: '#fff'}}
                                    testID='dateTimePicker'
                                    value={requestVacation.timestamp_end}
                                    mode={'date'}
                                    is24Hour={true}
                                    display={isIphone ? 'spinner' : 'spinner'}
                                    onChange={(e) => handleDate(e,'end')}
                                />
                        }
                    </View>
                    <View style={{height: 'auto', alignSelf: 'stretch'}}>
                        <TextInput
                            editable={false}
                            value={requestVacation.range}
                            style={[styles.picker, {textAlign: 'center', fontSize: 16, color: '#adadad'}]}
                        />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => {
                            setEditVisibility(!editVisibility)
                            setInitialState({...initialState, requestVacation: initialized})
                        }} style={{flex: 1, height: 40, backgroundColor: '#f7f7f7', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <Icon name={'times'} size={22} color={'#000'} />
                            <Text style={{fontSize: 16, color: '#000', marginLeft: 12, fontWeight: 'bold'}}>Cancelar</Text>
                        </TouchableOpacity>
                        <View style={{width: 6}}></View>
                        <TouchableOpacity onPress={() => handleEdit()} style={{flex: 1, height: 40, backgroundColor: Blue, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <Icon name={'pencil'} size={22} color={'#fff'} />
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 12}}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                
                <ModalLoading visibility={loading} />
                <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
            </View>
        :
            <>
                <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			    <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>
            </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: isIphone ? '5%' : '3%',
    },
    list:{
        height: 'auto',
        alignSelf: 'stretch',
    },
    title: {
        fontSize: 13,
        color: Blue,
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#adadad',
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        height: 45,
        paddingHorizontal: 16
    },
    multiline: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 15,
        height: 90,
        textAlignVertical: 'top',
        paddingHorizontal: 16,
        fontSize: 16
    },
    legends: {
        height: 65,
        width: 55,
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    headerLegend: {
        height: 20,
        alignSelf: 'stretch',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    subHeaderLegend: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5
    }
})