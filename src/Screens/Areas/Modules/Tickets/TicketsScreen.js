import React, {useCallback, useEffect, useState, useRef} from 'react'
import {View, Text, StyleSheet, Platform, ScrollView, TouchableWithoutFeedback, TouchableOpacity, StatusBar, SafeAreaView, PermissionsAndroid, Alert, RefreshControl} from 'react-native'
import {HeaderPortrait, HeaderLandscape, FailedNetwork, Pagination, Modal, Select, Message, Camera, ModalLoading, MultiTextEditable, BottomNavBar, Calendar} from '../../../../components'
import {useConnection, useOrientation, useNavigation, useScroll} from '../../../../hooks'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../../colors/colorsApp'
import {request, PERMISSIONS} from 'react-native-permissions';
import {KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {isIphone, live, login, urlTickets} from '../../../../access/requestedData';
import {useDispatch, useSelector} from 'react-redux';
import {selectPermissions, selectTickets, setTickets, setPermissions, addTicket, formTicket, selectForm} from '../../../../slices/ticketSlice';
import {useFocusEffect} from '@react-navigation/native';
import {selectTokenInfo, selectUserInfo} from '../../../../slices/varSlice';
import tw from 'twrnc';

let id_usuario = '';
let id_puesto = '';
let token = null;
let user = null;
let cuenta = 0;
let tickets = []
let permissions = {}
let form = {}

export default ({navigation, route: {params: {language, orientation}}}) => {
    const refTickets = useRef()
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)
    tickets = useSelector(selectTickets)
    permissions = useSelector(selectPermissions)
    form = useSelector(selectForm)

    const dispatch = useDispatch()
    const ref = useRef();
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });
    const {translateY, paddingTop, handleSnap, handleScroll} = useScroll(orientationInfo.initial)
    const [archivados, setArchivados] = useState([])
    const [expedientes, setExpedientes] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const [active, setActive] = useState(1)
    const [initialState, setInitialState] = useState({
        ConceptosTicket: [],
        UbicacionesTicket: [],
        UsuariosTicket: [],
        btn_users: false,
        visibleTipo: false,

        visibleConcepto: false,
        visibleUbicacion: false,
        visibleUsuarios: false,
        showMensaje: '',
        visibleMensaje: false,

        conceptoDesc: '',
        backgroundDesc: 'red',
        colorDesc: '#000',

        idTipo: 'SEL',
        idConcepto: 'SEL',
        idPrioridad: '',
        idUbicacion: 'SEL',
        idUsuario: '',
        mensaje: '',
        imagen: '',
        encryptedImage: '',
        nombre_imagen: '',

        initial: false,
        labelInitial: '',
        
        ending: false,
        labelEnding: '',
        currentFilter: 1,
        reload: 1,
        contador: 1,
        reloadTickets: 1,
        reloadArchivados: 1,
        reloadExpedientes: 1,
        reloadAddTicket: 1,
    })

    const [labels, setLabels] = useState({
        tipoTicket: 'Seleccione una opción',
        conceptoTicket: 'Seleccione una opción',
        ubicacionTicket: 'Seleccione una opción',
        usuarioTicket: 'Seleccione una opción',
    })

    const {visibleTipo, visibleConcepto, visibleUbicacion, visibleUsuarios, visibleMensaje, showMensaje, ConceptosTicket,conceptoDesc, backgroundDesc, colorDesc, idTipo, idConcepto, idUbicacion, idUsuario, mensaje, nombre_imagen, imagen, encryptedImage, initial, labelInitial, labelEnding, ending, reloadTickets, reloadArchivados, reloadExpedientes, currentFilter} = initialState
    const {tipoTicket, conceptoTicket, ubicacionTicket, usuarioTicket} = labels

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ]);
                
                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.CAMERA'] ===
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
                await request(PERMISSIONS.IOS.CAMERA)
                await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
            }catch(err){
                console.warn(err)
                return;
            }
        }
    }

    const getTickets = async () => {
        try{
            if(cuenta === 0){
                setLoading(true)
                cuenta = cuenta + 1;
            }
            id_usuario = user.data.datos_personales.id_usuario
            id_puesto = user.data.datos_laborales.id_puesto
    
            const body = {
                'action': 'get_tickets',
                'data': {
                    'id_usuario':id_usuario,
                    'id_puesto':id_puesto,
                },
                'live': live,
                'login': login
            }
            console.log('body: ', body)

            const request = await fetch(urlTickets, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
        
            const {response} = await request.json();
            if(response.status === 200){
                setTimeout(() => {
                    dispatch(setTickets(response.data))
                    dispatch(setPermissions(response.permisos))
                    setLoading(false)
                }, 800)
            }
        }catch(e){
            console.log('e:', e)
            setLoading(false)
        }
    }

    const getArchivados = async (initial = false, ending = false, tipo = undefined) => {
        id_usuario = user.data.datos_personales.id_usuario
        id_puesto = user.data.datos_laborales.id_puesto

        try{
            if(tipo) {
                setLoading(true)
            }
            const body = {
                'action': 'get_tickets_archivados',
                'data': {
                    'id_usuario':id_usuario,
                    'id_puesto': id_puesto,
                    'fecha_inicio': initial,
                    'fecha_fin': ending
                },
                'live': live,
                'login': login
            }
            
            const request = await fetch(urlTickets, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
        
            const {response} = await request.json();
            if(response.status === 200){
                setArchivados(response.data)
                if(tipo) {
                    setLoading(false)
                }
            }
        }catch(e){
            console.log('e:', e)
            setLoading(false)
        }
    }

    const getExpedientes = async () => {
        id_usuario = user.data.datos_personales.id_usuario
        id_puesto = user.data.datos_laborales.id_puesto
        try{
            const body = {
                'action': 'get_expedientes_seguridad',
                'data': {
                    'id_usuario':id_usuario,
                    'id_puesto': id_puesto
                },
                'live': live,
                'login': login
            }
            
            const request = await fetch(urlTickets, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
        
            const {response} = await request.json();
            if(response.status === 200){
                setExpedientes(response.data)
            }
        }catch(e){
            console.log('e:', e)
        }
    }

    const getAddTicket = async () => {
        id_usuario = user.data.datos_personales.id_usuario
        id_puesto = user.data.datos_laborales.id_puesto
        try{
            const body = {
                'action': 'add_ticket',
                'data': {
                    'id_usuario':id_usuario,
                    'id_puesto':id_puesto
                },
                'live': live,
                'login': login
            }
            
            const request = await fetch(urlTickets, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
        
            const {response} = await request.json();
            if(response.status === 200){
                console.log('response: ', response.usuarios)
                dispatch(formTicket({TiposTicket: response.tickets_tipo, UbicacionesTicket: response.ubicaciones, UsuariosTicket: response.usuarios, btn_users: response.btn_users}))
            }
        }catch(e){
            console.log('e:', e)
        }
    }

    useEffect(() => {
        requestPermissions()
    },[])

    useEffect(() => {
        getTickets()
    },[reloadTickets, hasConnection])

    useEffect(() => {
        getArchivados()
    },[reloadArchivados, hasConnection])

    useEffect(() => {
        getExpedientes()
    },[reloadExpedientes, hasConnection])
    
    useEffect(() => {
        getAddTicket()
    },[hasConnection])
    
    const handleChangeModule = (id) => {
        setCurrentPage(1)
        setActive(id)
    }

    const handlePage = (tipo, defined = undefined) => setCurrentPage(tipo === '+' ? currentPage + 1 : tipo === '-' ? currentPage - 1 : defined)

    const Ticket = ({no_ticket, id, fecha, fecha_archivado, nombre, tipo, concepto, prioridad, prioridadBackgroundColor, ubicacion, estado, backgroundColorEstado, asignado, color_fondo, rango, is_table, html}) => {
        return(
            <TouchableOpacity style={{borderWidth: 2, borderColor: '#dadada', flex: 1, justifyContent: 'center', alignItems: 'center', height: 165, marginBottom: '4%', backgroundColor: color_fondo, borderRadius: 12}} onPress={() => navigation.navigate('TicketsDetail', {id: id, id_usuario: id_usuario, id_puesto: id_puesto, active: active, is_table: is_table, html: html, cuenta: 0, orientation: orientationInfo.initial})}>
                <View style={{flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#dadada'}}>
                    <View style={{borderTopLeftRadius: 12, padding: 4, borderRightWidth: 2, borderRightColor: '#dadada', width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, backgroundColor: Blue}}>
                        <Text style={{fontWeight: 'bold', fontSize: 11, color: '#fff', textAlign: 'center'}}>{no_ticket}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000', paddingHorizontal: 6}}>{nombre}</Text>
                    </View>
                </View>
                <View style={{alignSelf: 'stretch', height: 'auto', flexDirection: 'row', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 6}}>
                    <View style={{width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{backgroundColor: prioridadBackgroundColor, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 3.5}}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>{prioridad}</Text>   
                        </View>
                    </View>
                    <View style={{flex: 1, paddingLeft: 8}}>
                        <Text style={{fontSize: 14.5, fontWeight: 'bold', color: '#000'}}>{tipo}</Text>
                        <Text style={{fontSize: 13, color: '#000'}}>{concepto}</Text>
                    </View>
                    <View style={{width: 'auto', justifyContent: 'center', alignItems: 'center', height: 'auto'}}>
                        <View style={{backgroundColor: backgroundColorEstado, width: 'auto', borderRadius: 3.5, justifyContent: 'center', alignItems: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRadius: 4}}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>{estado}</Text>   
                        </View>
                    </View>
                </View>
                {
                    active !== 1
                    ?
                        <View style={{height: 35, alignSelf: 'stretch', justifyContent: concepto.length >= 35 && orientationInfo.initial === 'PORTRAIT' ? 'center' : 'flex-end', alignItems: 'flex-start'}}>
                            <Text style={{fontSize: 13, color: '#000', paddingHorizontal: 6, fontWeight: 'bold'}}>{active === 1 ? 'Asignado a: ' : 'Fecha Archivado: '}<Text style={{fontWeight: 'normal'}}>{active === 1 ? asignado : fecha_archivado}</Text></Text>
                        </View>
                    :
                        <View style={{height: 35, alignSelf: 'stretch', justifyContent: concepto.length >= 35 && orientationInfo.initial === 'PORTRAIT' ? 'center' : 'flex-end', alignItems: 'flex-start'}}>
                            <Text style={{fontSize: 13, color: '#000', paddingHorizontal: 6, fontWeight: 'bold'}}>{active === 1 ? 'Asignado a: ' : 'Fecha Archivado: '}<Text style={{fontWeight: 'normal'}}>{active === 1 ? asignado : fecha_archivado}</Text></Text>
                        </View>
                }
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 5}}>
                    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
                        <IonIcons name={'map-marker'} size={18} color={Blue} />
                        <Text style={{fontSize: 12, color: '#000'}}>{ubicacion}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', paddingRight: 6}}>
                        <IonIcons name={'map-marker'} size={18} color={'transparent'} />
                        <Text style={{fontSize: 13, fontWeight: 'bold', color: '#000'}}>{fecha}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const handleActionUno = async (value, label) => {
        try{
            if(value !== 'SEL'){
                const body = {
                    'action': 'get_conceptos',
                    'data': {
                        'id_usuario':id_usuario,
                        'id_tipo': value
                    },
                    'live': live,
                    'login': login
                }
                
                const request = await fetch(urlTickets, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(body),
                });
            
                const {response} = await request.json();
                if(response.status === 200){
                    setInitialState({...initialState, idTipo: value, visibleTipo: false, ConceptosTicket: response.data, idConcepto: 'SEL'})
                    setLabels({...labels, tipoTicket: label, conceptoTicket: 'Seleccione una opción'})
                }
            }
            else {
                setInitialState({...initialState, idTipo: value, visibleTipo: false, idConcepto: 'SEL'})
                setLabels({...labels, conceptoTicket: 'Seleccione una opción', tipoTicket: 'Seleccione una opción'})
            }
        }catch(e){
            console.log('algo pasó con el internet')
            setInitialState({...initialState, idTipo: value, visibleTipo: false, idConcepto: 'SEL'})
            setLabels({...labels, conceptoTicket: 'Seleccione una opción', tipoTicket: 'Seleccione una opción'})
        }
    }

    const handleActionDos = async (value, label) => {
        try{
            if(value !== 'SEL'){
                const body = {
                    'action': 'get_prioridad',
                    'data': {
                        'id_usuario':id_usuario,
                        'id_tipo': value
                    },
                    'live': live,
                    'login': login
                }
                
                const request = await fetch(urlTickets, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(body),
                });
            
                const {response} = await request.json();
                if(response.status === 200){
                    setInitialState({...initialState, idConcepto: value, visibleConcepto: false, conceptoDesc: response.data.prioridad, backgroundDesc: response.data.backgroundcolor_prioridad, colorDesc: response.data.color_prioridad, idPrioridad: response.id_prioridad})
                    setLabels({...labels, conceptoTicket: label})
                }
            } else {
                setInitialState({...initialState, idConcepto: 'SEL', visibleConcepto: false})
                setLabels({...labels, conceptoTicket: label})
            }
        }catch(e){
            console.log('algo pasó con el internet')
            setInitialState({...initialState, idConcepto: 'SEL', visibleConcepto: false})
        }
    }

    const handleActionTres = (value, label) => {
        if(value !== 'SEL'){
            setInitialState({...initialState, idUbicacion: value, visibleUbicacion: false})
            setLabels({...labels, ubicacionTicket: label})
        } else {
            setInitialState({...initialState, idUbicacion: 'SEL', visibleUbicacion: false})
            setLabels({...labels, ubicacionTicket: label})
        }
    }

    const handleActionCuatro = (value, label) => {
        setInitialState({...initialState, idUsuario: value, visibleUsuarios: false})
        setLabels({...labels, usuarioTicket: label})
    }

    const handleValues = async () => {
        if(idTipo !== 'SEL' && idConcepto !== 'SEL' && idUbicacion !== 'SEL' && mensaje !== ''){
            try{
                setLoading(true)
                const body = {
                    'action': 'save_ticket',
                    'data': {
                        'id_usuario':id_usuario,
                        'id_puesto': id_puesto,
                        'id_tipo': idTipo,
                        'id_concepto': idConcepto,
                        'id_ubicacion': idUbicacion,
                        'mensaje': mensaje,
                        'usuario_ticket': idUsuario,
                        'imagen': encryptedImage,
                        'nombre_imagen': nombre_imagen,
                    },
                    'live': live,
                    'login': login
                }
                
                const request = await fetch(urlTickets, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(body),
                });
            
                const {response} = await request.json();
                if(response.status === 200){
                    setLoading(false)
                    setInitialState({...initialState, visibleMensaje: true, showMensaje: response.response, reloadTickets: reloadTickets + 1})
                    if(response.last) dispatch(addTicket(response.last))
                    setTimeout(() => {
                        setInitialState({...initialState, visibleMensaje: false, showMensaje: false, idTipo: 'SEL', idConcepto: 'SEL', idPrioridad: '', idUbicacion: 'SEL', idUsuario: '', mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: ''})
                        setActive(1)
                        setLabels({...labels, tipoTicket: 'Seleccione una opción', conceptoTicket: 'Seleccione una opción', ubicacionTicket: 'Seleccione una opción', usuarioTicket: 'Seleccione una opción',})
                    }, 3500)
                }
            }catch(e){
                setLoading(false)
                setInitialState({...initialState, imagen: imagen})
                console.log('algo pasó con el internet')
            }
        }
        else {
            Alert.alert(
                'Campos Vacíos',
                'Revise y llene los campos faltantes',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    const reloading = () => {
        setLoading(true)
    }

    const SubHeader = () => {
        return(
            permissions.nuevo_ticket
            ?
                <View style={tw`h-12.5 self-stretch flex-row border-b border-t border-[${Blue}] bg-[#fff]`}>
                    {
                        permissions.tickets
                        ?
                            <View style={tw`flex-1 items-center justify-center bg-[rgba(50,131,197,.1)]`}>
                                <TouchableWithoutFeedback onPress={() => active !== 1 && handleChangeModule(1)}>
                                    <View style={tw`flex-1 self-stretch justify-center items-center`}>
                                        <Icon name={'ticket'} size={28} color={active === 1 ? Blue : '#acacac'} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        :
                            <></>
                    }
                    {
                        permissions.archivados
                        ?
                            <View style={tw`flex-1 items-center justify-center bg-[rgba(50,131,197,.1)]`}>
                                <TouchableWithoutFeedback style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)'}} onPress={() => active !== 2 && handleChangeModule(2)}>
                                    <View style={tw`flex-1 self-stretch justify-center items-center`}>
                                        <IonIcons name={'archive'} size={30} color={active === 2 ? Blue : '#acacac'} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        :
                            <></>
                    }
                    {
                        permissions.nuevo_ticket
                        ?
                            <View style={tw`flex-1 items-center justify-center bg-[rgba(50,131,197,.1)]`}>
                                <TouchableWithoutFeedback style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)'}} onPress={() => active !== 3 && handleChangeModule(3)}>
                                    <View style={tw`flex-1 self-stretch justify-center items-center`}>
                                        <Icon name={'plus'} size={28} color={active === 3 ? Blue : '#acacac'} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        :
                            <></>
                    }
                    {
                        permissions.expedientes
                        ?
                            <View style={tw`flex-1 items-center justify-center bg-[rgba(50,131,197,.1)]`}>
                                <TouchableWithoutFeedback style={{alignSelf: 'stretch', backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,131,197,.1)'}} onPress={() => active !== 4 && handleChangeModule(4)}>
                                    <View style={tw`flex-1 self-stretch justify-center items-center`}>
                                        <Icon name={'shield'} size={28} color={active === 4 ? Blue : '#c1c1c1'} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        :
                            <></>
                    }
                </View>
            :
                <></>
            
        )
    }

    return(
        <>
        
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
            <View style={{backgroundColor: '#fff', flex: 1}}>
                {
                    hasConnection
                    ?
                        <>
                            {
                                orientationInfo.initial === 'PORTRAIT'
                                ?
                                    <>
                                        <HeaderPortrait title={'Tickets'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY} SubHeader={SubHeader}/>
                                    </>
                                :
                                    <HeaderLandscape title={'Tickets'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY} SubHeader={SubHeader}/>
                            }
                            {
                                isIphone
                                &&
                                    <SubHeader />
                            }
                            <KeyboardAwareScrollView
                                ref={refTickets}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={tw`bg-[#fff]`}
                                refreshControl={
                                    <RefreshControl
                                        progressBackgroundColor={'#EC5C25'}
                                        colors={['#fff']}
                                        refreshing={false}
                                        onRefresh={() => {
                                            cuenta = 0;
                                            if(active === 1) setInitialState({...initialState, reloadTickets: reloadTickets + 1, show_start: false, show_end: false})
                                            /* if(active === 2) setInitialState({...initialState, reloadArchivados: reloadArchivados + 1, show_start: false, show_end: false, show_start: false}) */
                                            if(active === 4) setInitialState({...initialState, reloadExpedientes: reloadExpedientes + 1, show_start: false, show_end: false})
                                        }}
                                    />
                                }
                                contentContainerStyle={{paddingTop: !isIphone ? paddingTop + 50 : paddingTop}}
                                onScroll={handleScroll}
                            >
                                <View style={styles.container}>
                                {
                                    active === 1
                                    ?
                                        tickets
                                        &&
                                            <Pagination data={tickets} Item={Ticket} SearchInput={true} currentFilter={currentFilter} onChangeFilter={() => setInitialState({...initialState, currentFilter: currentFilter === 1 ? 2 : currentFilter === 2 ? 3 : currentFilter === 3 ? 4 : 1})} placeholder={currentFilter === 1 ? 'Asignado a...' : currentFilter === 2 ? 'No.Ticket...' : currentFilter === 3 ? 'Quién solicitó...' : 'Ubicación...'} property={currentFilter === 1 ? 'asignado' : currentFilter ===  2 ? 'no_ticket' : currentFilter === 3 ? 'nombre' : 'ubicacion'} handlePage={handlePage} current={currentPage} handleTop={() => refTickets.current?.scrollToPosition(0, 0)} />
                                    :
                                        active === 2
                                        ?
                                            <>
                                                <View style={tw`flex-row self-stretch h-auto mt-2.5`}>
                                                    <Calendar dateLabel={labelInitial} isModule={true} shortFormat={false} getValue={(value, label) => {
                                                        getArchivados(value, ending, true)
                                                        setInitialState({...initialState, initial: value, labelInitial: label})
                                                    }} language={language} marginBottom={false} />
                                                    <View style={{ width: 6 }}></View>
                                                    <Calendar dateLabel={labelEnding} isModule={true} shortFormat={false} getValue={(value, label) => {
                                                        getArchivados(initial, value, true)
                                                        setInitialState({...initialState, ending: value, labelEnding: label})
                                                    }} language={language} marginBottom={false}/>
                                                </View>
                                                <Pagination data={archivados} Item={Ticket} SearchInput={true} onChangeFilter={() => setInitialState({...initialState, currentFilter: currentFilter === 1 ? 2 : currentFilter === 2 ? 3 : currentFilter === 3 ? 4 : 1})} placeholder={currentFilter === 1 ? 'Fecha de archivado...' : currentFilter === 2 ? 'No.Ticket...' : currentFilter === 3 ? 'Quién solicitó...' : 'Ubicación...'} property={currentFilter === 1 ? 'fecha_archivado' : currentFilter ===  2 ? 'no_ticket' : currentFilter === 3 ? 'nombre' : 'ubicacion'} handlePage={handlePage} current={currentPage} handleTop={() => refTickets.current?.scrollToPosition(0, 0)} />
                                            </>
                                        :
                                            active === 3
                                            ?
                                                <View style={[styles.container, {paddingHorizontal: 0, flex: 1, alignSelf: 'stretch'}]}>
                                                    <ScrollView
                                                        showsVerticalScrollIndicator={false}
                                                        showsHorizontalScrollIndicator={false}
                                                        style={{alignSelf: 'stretch'}}
                                                    >
                                                        <View style={tw`h-auto self-stretch mt-2.5`} />
                                                        <Text style={styles.title}>{'Tipo de ticket'}</Text>
                                                        <TouchableOpacity style={[styles.picker, tw`flex-row flex-1 border border-[${idTipo !== 'SEL' ? '#CBCBCB' : '#E68AA6'}]`]} onPress={() => setInitialState({...initialState, visibleTipo: !visibleTipo})}>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={tw`text-[#000]`}>{tipoTicket}</Text>
                                                            </View>
                                                            <View style={{width: 'auto'}}>
                                                                <Icon name='caret-down' size={15} color={'#000'} />
                                                            </View>
                                                        </TouchableOpacity>
                            
                                                        <Text style={styles.title}>{'Concepto de ticket'}</Text>
                                                        {
                                                            tipoTicket !== 'Seleccione una opción'
                                                            ?
                                                                <TouchableOpacity style={[styles.picker, tw`flex-row flex-1 border border-[${idTipo !== 'SEL' ? '#CBCBCB' : '#E68AA6'}]`]} onPress={() => setInitialState({...initialState, visibleConcepto: !visibleConcepto})}>
                                                                    <View style={tw`flex-1`}>
                                                                        <Text style={tw`text-[#000]`}>{conceptoTicket}</Text>
                                                                    </View>
                                                                    <View style={{width: 'auto'}}>
                                                                        <Icon name='caret-down' size={15} color={'#000'} />
                                                                    </View>
                                                                </TouchableOpacity>
                                                            :
                                                                <View style={[styles.picker, tw`flex-row flex-1 bg-[#f7f7f7]`]}>
                                                                    <View style={tw`flex-1`}>
                                                                        <Text style={tw`text-[#000]`}>{'Seleccione una opción'}</Text>
                                                                    </View>
                                                                    <View style={{width: 'auto'}}>
                                                                        <Icon name='caret-down' size={15} color={'#000'} />
                                                                    </View>
                                                                </View>
                                                        }
                                                        {
                                                            conceptoTicket !== 'Seleccione una opción'
                                                            ?
                                                                <View style={tw`flex-row h-auto items-center mb-2.5`}>
                                                                    <Text style={[styles.title, tw`mb-0`]}>{'Prioridad:'}</Text>
                                                                    <View style={tw`w-auto h-auto bg-[${backgroundDesc}] items-center justify-center ml-1.5 px-1.5 rounded-md py-1`}>
                                                                        <Text style={tw`font-bold text-[${colorDesc}]`}>{conceptoDesc}</Text>
                                                                    </View>
                                                                </View>
                                                            :
                                                                <></>
                                                        }
                                                        <Text style={styles.title}>{'Ubicación de requerimiento'}</Text>
                                                        <TouchableOpacity style={[styles.picker, tw`flex-row flex-1 border border-[${idUbicacion !== 'SEL' ? '#CBCBCB' : '#E68AA6'}]`]} onPress={() => setInitialState({...initialState, visibleUbicacion: !visibleUbicacion})}>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={tw`text-[#000]`}>{ubicacionTicket}</Text>
                                                            </View>
                                                            <View style={tw`w-auto`}>
                                                                <Icon name='caret-down' size={15} color={'#000'} />
                                                            </View>
                                                        </TouchableOpacity>
                                                        {
                                                            form.btn_users
                                                            &&
                                                                <>
                                                                    <Text style={[styles.title, tw`text-xs`]}>{'Usuario que solicita [En caso de levantar un ticket por un tercero]'}</Text>
                                                                    <TouchableOpacity style={[styles.picker, tw`flex-row flex-1`]} onPress={() => setInitialState({...initialState, visibleUsuarios: !visibleUsuarios})}>
                                                                        <View style={tw`flex-1`}>
                                                                            <Text style={tw`text-[#000]`}>{usuarioTicket}</Text>
                                                                        </View>
                                                                        <View style={tw`w-auto`}>
                                                                            <Icon name='caret-down' size={15} color={'#000'} />
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </>
                                                        }
                                                        <Text style={styles.title}>{'Mensaje'}</Text>
                                                        <MultiTextEditable handleInputChange={(e) => setInitialState({...initialState, mensaje: e})}/>
                                                        <Camera savePicture={(nombre_imagen, encryptedImage, imagen) => setInitialState({...initialState, nombre_imagen: nombre_imagen, encryptedImage: encryptedImage, imagen: imagen})} imagen={imagen}/>
                                                        <TouchableOpacity
                                                            style={{flexDirection: 'row', height: 40, backgroundColor: Blue, borderRadius: 8, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', paddingVertical: 5}}
                                                            onPress={() => handleValues()}
                                                        >
                                                            <IonIcons name={'content-save'} size={24} color={'#fff'} />
                                                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 6}}>Guardar</Text>
                                                        </TouchableOpacity>
                            
                                                        <View style={{marginBottom: '3%'}}></View>
                                                    </ScrollView>
                                                </View>
                                            :
                                                <Pagination data={expedientes} SearchInput={true} Item={Ticket} onChangeFilter={() => setInitialState({...initialState, currentFilter: currentFilter === 1 ? 2 : currentFilter === 2 ? 3 : 1})} placeholder={currentFilter === 1 ? 'Quién solicitó...' : currentFilter === 2 ? 'Ubicación...' : 'No.Ticket...'} property={currentFilter === 1 ? 'nombre' : currentFilter ===  2 ? 'ubicacion' : 'no_ticket'}/>
                                }
                                {
                                    isIphone
                                    &&
                                        <View style={{marginBottom: orientationInfo.initial === 'PORTRAIT' ? '3%' : '1.5%'}}></View>
                                }
                                </View>
                            </KeyboardAwareScrollView>
                            <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                                
                            <ModalLoading visibility={loading}/>
                                
                            <Modal orientation={orientationInfo.initial} visibility={visibleTipo} handleDismiss={() => setInitialState({...initialState, visibleTipo: !visibleTipo})}>
                                <Select data={form.TiposTicket} handleActionUno={handleActionUno} />
                            </Modal>
                            
                            <Modal orientation={orientationInfo.initial} visibility={visibleConcepto} handleDismiss={() => setInitialState({...initialState, visibleConcepto: !visibleConcepto})}>
                                <Select data={ConceptosTicket} handleActionUno={handleActionDos} />
                            </Modal>
                
                            <Modal orientation={orientationInfo.initial} visibility={visibleUbicacion} handleDismiss={() => setInitialState({...initialState, visibleUbicacion: !visibleUbicacion})}>
                                <Select data={form.UbicacionesTicket} handleActionUno={handleActionTres} />
                            </Modal>
                
                            <Modal orientation={orientationInfo.initial} visibility={visibleUsuarios} handleDismiss={() => setInitialState({...initialState, visibleUsuarios: !visibleUsuarios})}>
                                <Select data={form.UsuariosTicket} handleActionUno={handleActionCuatro} search={true}/>
                            </Modal>
                
                            <Message tipo={1} visible={visibleMensaje} title={showMensaje} orientation={orientationInfo.initial}/>
                        </>
                    :
                        <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: isIphone ? '5%' : '3%'
    },
    list:{
        height: 'auto',
        alignSelf: 'stretch',
    },
    title: {
        fontSize: 14,
        color: Blue,
        marginBottom: 5,
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        height: 45,
        borderRadius: 15,
        paddingHorizontal: isIphone ? 14 : 12
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        borderRadius: 20
    },
})