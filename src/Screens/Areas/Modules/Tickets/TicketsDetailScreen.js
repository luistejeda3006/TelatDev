import React, {useCallback, useEffect, useState} from 'react'
import {View, Text, StyleSheet, Platform, ScrollView, FlatList, TouchableOpacity, Image, Linking, StatusBar, SafeAreaView, Alert, RefreshControl, Dimensions} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Camera, FailedNetwork, HeaderLandscape, HeaderPortrait, Message, ModalLoading, Modal, MultiText, MultiTextEditable, Select, Title, BottomNavBar} from '../../../../components'
import {useConnection, useOrientation, useNavigation, useScroll} from '../../../../hooks'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {barStyle, barStyleBackground, Blue, Orange, SafeAreaBackground, Yellow} from '../../../../colors/colorsApp'
import HTMLView from 'react-native-htmlview'
import DeviceInfo from 'react-native-device-info';
import {isIphone, live, login, urlTickets} from '../../../../access/requestedData'
import * as Animatable from 'react-native-animatable';
import Picker from 'react-native-picker-select';
import HTML from 'react-native-render-html';
import TableRenderer, {tableModel} from '@native-html/table-plugin';
import WebView from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import {actionTicket} from '../../../../slices/ticketSlice';
import {useFocusEffect} from '@react-navigation/native';
import {selectTokenInfo} from '../../../../slices/varSlice';

let token = null;

const htmlProps = {
    WebView,
    renderers: {
      table: TableRenderer
    },
    renderersProps: {
      table: {
        // Put the table config here
      }
    },
    customHTMLElementModels: {
      table: tableModel
    }
  };

export default ({navigation, route: {params: {id, id_usuario, id_puesto, active, is_table, html, cuenta, orientation}}}) => {
    const dispatch = useDispatch()
    token = useSelector(selectTokenInfo)

    cuenta = cuenta;
    const language = '1';
    const {isTablet} = DeviceInfo;
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const {handlePath} = useNavigation()
    const [contador, setContador] = useState(0)
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });
    const [selected, setSelected] = useState(undefined)
    const {translateY, handleScroll, paddingTop} = useScroll(orientationInfo.initial)

    const [loading, setLoading] = useState(false)
    const [load, setLoad] = useState(false)
    const [initialState, setInitialState] = useState({
        detail: {},
        chat: [],
        Responsables: [],
        Evidencias: [],
        calificacion: {},
        permisos: {},
        areLegendsHiden: false,
        areEvidencesHiden: false,
        currentOrientation: 'PORTRAIT',
        visibleResponsables: false,
        edit: false,
        motivos: [],
        motivo: 'SEL',
        closeOptions: [
            {value: 'SEL', label: 'Seleccione una opción'},
            {value: 1, label: 'Sí'},
            {value: 0, label: 'No'}
        ],
        closeOption: 'SEL',
        imagen: '',
        encryptedImage: '',
        nombre_imagen: '',
        mensaje: '',
        tipoAccion: 1,
        stars: 0,
        url: '',
        tipoCalificacion: 0,
        showMensaje: '',
        visibleMensaje: false,
        
        visibleCalificacion: false,
        visibleResponder: false,
        visibleAutorizar: false,
        visibleConfirmar: false,
        reload: 0,
        isTable: false,
        bodyHtml: '',
    })
    
    const {imagen, encryptedImage, nombre_imagen, motivo, motivos, closeOption, closeOptions, mensaje, areLegendsHiden, areEvidencesHiden, currentOrientation, detail, chat, Responsables, Evidencias, calificacion, permisos, visibleResponsables, edit, visibleResponder,  visibleAutorizar, visibleConfirmar, showMensaje, visibleMensaje, reload} = initialState

    useFocusEffect(
        useCallback(() => {
            handlePath('Tickets')
        }, [])
    );

    const getTicketDetail = async () => {
        try{
            const body = {
                'action': 'get_ticket_detail',
                'data': {
                    'id_usuario': id_usuario,
                    'id_ticket': id,
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
                cuenta = cuenta + 1;
                console.log('body html: ', response.html)
                setInitialState({...initialState, detail: response.data, chat: response.chat, isTable: response.is_table, bodyHtml: response.html, Responsables: response.data.responsables, Evidencias: response.data.evidencias, calificacion: response.data.calificacion, permisos: response.permisos, motivos: response.opciones})
            }
        }catch(e){
            console.log('algo falla:', e)
        }
    }
    
    useEffect(() => {
        getTicketDetail()
    },[contador, reload, hasConnection])

    const handleActionUno = async (value, label) => {
        askForConnection()
        if(value !== 'SEL'){
            try{
                setLoading(true)
                const body = {
                    'action': 'asignar_ticket',
                    'data': {
                        'id_usuario':id_usuario,
                        'id_puesto': id_puesto,
                        'id_usuario_asignado': value,
                        'id_ticket': id
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
                    console.log('asignado correctamente')
                    if(response.last) dispatch(actionTicket({id: response.last.id, ticket: response.last}))
                    setLoading(false)
                    setInitialState({...initialState, visibleResponsables: false, visibleMensaje: true, showMensaje: response.response, visibleCalificacion: false})
                    setTimeout(async () => {
                        cuenta = 1;
                        setInitialState({...initialState, showMensaje: '', visibleMensaje: false, mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: '', visibleResponsables: false, edit: false, reload: reload + 1})
                    }, 3500)
                }
            }catch(e){
                console.log('algo pasó con el internet')
                setLoading(false)
                setInitialState({...initialState, showMensaje: '', visibleMensaje: false, mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: '', visibleResponsables: false, edit: false})
            }
        }
        else {
            setInitialState({...initialState, visibleResponsables: false})
        }
    }

    const handleActionDos = (value, label) => {
        setInitialState({...initialState, motivo: value})
    }

    const handleActionTres = (value, label) => {
        setInitialState({...initialState, closeOption: value})
    }

    const Chat = ({fecha, mensajes}) => {
        console.log('mensajes: ', mensajes[0])
        return(
            <>
                <View style={{flexDirection: 'row', height: 'auto', alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 6, marginTop: 8}}>
                    <Icon name={'calendar'} size={15} color={Blue} />
                    <Text style={{fontSize: 12, marginLeft: 5, color: Blue, borderRadius: 8}}>{fecha}</Text>
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                    data={mensajes}
                    numColumns={1}
                    renderItem={({item}) =>
                    <View style={{borderWidth: 2.5, borderColor: '#f7f7f7', flex: 1, justifyContent: 'center', alignItems: 'center', height: 'auto', marginVertical: '2%', borderRadius: 14, padding: 4, paddingTop: 8, marginBottom: 10, backgroundColor: 'rgba(247,247,247,.5)'}} onPress={() => navigation.navigate('test_2')}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 5, backgroundColor: '#dcdcdc', borderRadius: 35, width: 38, height: 38}}>
                                        {
                                            item.picture !== ''
                                            ?
                                                <Image
                                                    style={[styles.image, {width: !isTablet() ? currentOrientation === 'PORTRAIT' ? 35 : 25 : currentOrientation === 'PORTRAIT' ? 35 : 25, height: !isTablet() ? currentOrientation === 'PORTRAIT' ? 35 : 25 : currentOrientation === 'PORTRAIT' ? 35 : 35}]}
                                                    resizeMode={'cover'}
                                                    source={{uri: `${item.picture}`}}
                                                />
                                            :
                                                <Image
                                                    style={[styles.image, {width: !isTablet() ? currentOrientation === 'PORTRAIT' ? 35 : 25 : currentOrientation === 'PORTRAIT' ? 35 : 25, height: !isTablet() ? currentOrientation === 'PORTRAIT' ? 35 : 25 : currentOrientation === 'PORTRAIT' ? 35 : 35}]}
                                                    resizeMode={'cover'}
                                                    source={require('../../../../../assets/user.png')}
                                                />
                                        }
                                    </View>
                                    <View style={{flex: 1, alignSelf:'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                        <Text style={{fontSize: 14, fontWeight: 'bold', color: Blue}}>{item.usuario}</Text>
                                    </View>
                                    <View style={{width: 'auto', height: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                        <IonIcons name={'clock-outline'} size={18} color={Blue} />
                                        <Text style={{color: Blue, fontSize: 12, marginLeft: 3}}>{item.hora}</Text>
                                    </View>
                                </View>
                                <View style={{height: item.title ? 'auto' : 0, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 15.5, color: Blue}}>{item.title}</Text>
                                </View>
                                {
                                    item.has_filtro
                                    &&
                                        <View style={{marginTop: 10}}>
                                            <View style={{height: item.filtro_autorizacion ? 'auto' : 0, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
                                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>{item.filtro_autorizacion && 'Ticket Autorizado: '}</Text>
                                                {
                                                    item.filtro_autorizacion === 1
                                                    ?
                                                        <IonIcons name={'clock'} size={24} color={Orange} />
                                                    :
                                                        <View style={{width: 20, height: 20, backgroundColor: item.filtro_autorizacion === 2 ? '#629b58' : '#cf513d', borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                            <IonIcons name={item.filtro_autorizacion === 2 ? 'check' : 'close'} size={item.filtro_autorizacion === 2 ? 16 : 18} color={'#fff'} />
                                                        </View>
                                                }
                                            </View>
                                            {
                                                item.filtro_autorizacion === 2
                                                &&
                                                    <View style={{height: item.filtro_confirmacion ? 'auto' : 0, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 3}}>
                                                        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>{item.filtro_confirmacion && 'Confirmación de Seguridad: '}</Text>
                                                        {
                                                            item.filtro_confirmacion === 1
                                                            ?
                                                                <IonIcons name={'clock'} size={24} color={Orange} />
                                                            :
                                                                <View style={{width: 20, height: 20, backgroundColor: item.filtro_confirmacion === 2 ? '#629b58' : '#cf513d', borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                                    <IonIcons name={item.filtro_confirmacion === 2 ? 'check' : 'close'} size={item.filtro_confirmacion === 2 ? 16 : 18} color={'#fff'} />
                                                                </View>
                                                        }
                                                    </View>
                                            }
                                        </View>
                                }
                                <ScrollView style={{height: 'auto', paddingVertical: 10}}>
                                    {
                                        item.id === 0 && is_table
                                        ?
                                            <HTML source={{ html }} {...htmlProps} contentWidth={Dimensions.get('screen').width}/>
                                        :
                                            <HTMLView
                                                value={'<div style="color: black">' + item.body + '</div>'}
                                                stylesheet={styles}
                                            />
                                    }
                                </ScrollView>
                                {
                                    item.url
                                    ?
                                        !item.url.includes('.jpg') && !item.url.includes('.png') && !item.url.includes('.jpeg') 
                                        ?
                                            <View style={{height: 'auto', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 5, borderTopColor: '#f7f7f7', borderTopWidth: 2.5}}>
                                                <TouchableOpacity onPress={async () => await Linking.openURL(item.url)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <View style={{height: 'auto', width: 'auto', justifyContent: 'center', alignItems: 'center'}} >
                                                        <View style={{height: 'auto', width: 'auto', borderWidth: 1, borderColor: '#dadada'}}>
                                                            <IonIcons name={item.url.includes('.pdf') ? 'file-pdf' : (item.url.includes('.docx') || item.url.includes('.doc')) ? 'file-word' : 'file-excel'} size={32} color={item.url.includes('.pdf') ? '#d53f40' : (item.url.includes('.docx') || item.url.includes('.doc')) ? '#185abd' : '#107c41'} />
                                                        </View>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={{color: Blue, fontSize: 13, marginLeft: 4, textDecorationColor: Blue, textDecorationLine: 'underline', textDecorationStyle: 'solid'}}>{item.nombre}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        :
                                            <View style={{height: 'auto', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 5, borderTopColor: '#f7f7f7', borderTopWidth: 2.5}}>
                                                <TouchableOpacity onPress={async () => await Linking.openURL(item.url)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <View style={{height: 'auto', width: 'auto', justifyContent: 'center', alignItems: 'center'}} >
                                                        <View style={{height: 'auto', width: 'auto', paddingHorizontal: 2, paddingVertical: 1, borderWidth: 1, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
                                                            <Image 
                                                                style={{
                                                                    alignSelf: 'center',
                                                                    height: 30,
                                                                    width: 30
                                                                }}
                                                                source={require('../../../../../assets/image.png')}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={{color: Blue, fontSize: 13, marginLeft: 4, textDecorationColor: Blue, textDecorationLine: 'underline', textDecorationStyle: 'solid'}}>{item.nombre}</Text>
                                                    </View> 
                                                </TouchableOpacity>
                                            </View>
                                    :
                                        <></>
                                }
                            </View>
                        </View>
                    </View>}
                    keyExtractor={item => String(item.id)}
                    />
            </>
        )
    }

    const handleAnswer = async () => {
        askForConnection()
        if(motivo !== 'SEL' && mensaje !== ''){
            let permiso = motivo === 4 ? false : true
            if(selected || permiso){
                try{
                    setInitialState({...initialState, visibleResponder: false})
                    setLoading(true)
                    const body = {
                        'action': 'add_mensaje',
                        'data': {
                            'id_usuario':id_usuario,
                            'id_puesto': id_puesto,
                            'id_ticket': id,
                            'mensaje': mensaje,
                            'motivo': motivo,
                            'imagen': encryptedImage,
                            'nombre_imagen': nombre_imagen,
                            'calificacion': selected
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
                        if(response.last) dispatch(actionTicket({id: response.last.id, ticket: response.last}))
                        setInitialState({...initialState, visibleMensaje: true, showMensaje: response.response, visibleResponder: false})
                        setTimeout(() => {
                            setInitialState({...initialState, motivo: 'SEL', mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: '', showMensaje: '', visibleMensaje: false, visibleResponder: false, reload: reload + 1})
                        }, 3500)
                    }
                }catch(e){
                    console.log('algo pasó con el internet')
                    setLoading(false)
                    setInitialState({...initialState, motivo: 'SEL', mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: '', visibleResponder: false})
                }
            } else {
                Alert.alert(
                    'Calificación Obligatoria',
                    'Ingrese una calificación.',
                    [
                        { text: 'OK'}
                    ]
                )
            }
        } else {
            Alert.alert(
                'Campos Vacíos',
                'Revise y llene los campos faltantes',
                [
                    { text: 'OK'}
                ]
            )
        }
    }
    
    const handleSaveEvidencia = async () => {
        askForConnection()
        if(imagen){
            try{
                setLoading(true)
                const body = {
                    'action': 'save_expediente',
                    'data': {
                        'id_usuario': id_usuario,
                        'id_puesto': id_puesto,
                        'id_ticket': id,
                        'comentario': mensaje,
                        'nombre_imagen': nombre_imagen,
                        'imagen': encryptedImage
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
                    cuenta = 1;
                    setLoading(false)
                    setInitialState({...initialState, visibleMensaje: true, showMensaje: response.response,  mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: ''})
                    setTimeout(() => {
                        setInitialState({...initialState, showMensaje: '', mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: '', visibleMensaje: false, reload: reload + 1})
                    }, 3500)
                }
            }catch(e){
                console.log('algo pasó con el internet')
                setLoading(false)
                setInitialState({...initialState, mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: '', visibleResponder: false})
            }
        } else{
            Alert.alert(
                'Evidencia Requerida',
                'Falta seleccionar alguna imagen como evidencia',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    const handleDeleteEvidencia = async (id) => {
        askForConnection()
        try{
            setLoading(true)
            const body = {
                'action': 'delete_expediente',
                'data': {
                    'id_usuario':id_usuario,
                    'id_evidencia': id
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
                cuenta = 1;
                setLoading(false)
                setInitialState({...initialState, visibleMensaje: true, showMensaje: response.response})
                setTimeout(() => {
                    setInitialState({...initialState, showMensaje: '', visibleMensaje: false, reload: reload + 1})
                }, 3500)
            }
        }catch(e){
            console.log('algo pasó con el internet')
            setLoading(false)
            setInitialState({...initialState, visibleResponder: false, showMensaje: '', visibleMensaje: false})
        }
    }

    const handleAutorizar = async () => {
        askForConnection()
        if(closeOption !== 'SEL' && mensaje !== ''){
            try{
                setInitialState({...initialState, visibleAutorizar: false})
                setLoading(true)
                const body = {
                    'action': 'autorizar_ticket',
                    'data': {
                        'id_usuario': id_usuario,
                        'id_ticket': id,
                        'autoriza': closeOption,
                        'comentario': mensaje,
                        'nombre_imagen': nombre_imagen,
                        'imagen': encryptedImage
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
                    if(response.last) dispatch(actionTicket({id: response.last.id, ticket: response.last}))
                    setLoading(false)
                    setInitialState({...initialState, visibleMensaje: true, showMensaje: response.response, visibleAutorizar: false})
                    setTimeout(() => {
                        setInitialState({...initialState, showMensaje: '', visibleMensaje: false, reload: reload + 1, visibleAutorizar: false, closeOption: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})
                    }, 3500)
                }
            }catch(e){
                console.log('algo pasó con el internet')
                setLoading(false)
                setInitialState({...initialState, visibleMensaje: false, showMensaje: '', visibleAutorizar: false, visibleAutorizar: !visibleAutorizar, closeOption: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})
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

    const handleConfirmar = async () => {
        askForConnection()
        if(mensaje !== ''){
            try{
                setInitialState({...initialState, visibleConfirmar: false})
                setLoading(true)
                const body = {
                    'action': 'confirmar_ticket_seguridad',
                    'data': {
                        'id_usuario':id_usuario,
                        'id_ticket': id,
                        'comentario': mensaje,
                        'nombre_imagen': nombre_imagen,
                        'imagen': encryptedImage
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
                    if(response.last) dispatch(actionTicket({id: response.last.id, ticket: response.last}))
                    setLoading(false)
                    setInitialState({...initialState, visibleMensaje: true, showMensaje: response.response, visibleConfirmar: false})
                    setTimeout(() => {
                        setInitialState({...initialState, showMensaje: '', visibleMensaje: false, reload: reload + 1, visibleConfirmar: false, imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})
                    }, 3500)
                }
            }catch(e){
                console.log('algo pasó con el internet')
                setLoading(false)
                setInitialState({...initialState, visibleMensaje: false, showMensaje: '', visibleConfirmar: false, imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})
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

    const handleHide = (id) => {
        const nuevas = Evidencias.map(x => x.id === id ? ({...x, oculta: !x.oculta}) : x)
        setInitialState({...initialState, Evidencias: nuevas})
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            {
                hasConnection
                ?
                    <>
                        {
                            orientationInfo.initial === 'PORTRAIT'
                            ?
                                <HeaderPortrait title={'Detalles de Ticket'} screenToGoBack={'Tickets'} navigation={navigation} visible={true} translateY={translateY}/>
                            :
                                <HeaderLandscape title={'Detalle de Ticket'} screenToGoBack={'Tickets'} navigation={navigation} visible={true} translateY={translateY}/>
                        }
                        <View style={styles.container}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch'}}
                                refreshControl={
                                    <RefreshControl
                                        progressBackgroundColor={'#EC5C25'}
                                        colors={['#fff']}
                                        refreshing={false}
                                        onRefresh={() => {
                                            cuenta = 0;
                                            getTicketDetail()
                                        }}
                                    />
                                }
                                onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}}
                            >
                                <View style={{marginTop: '3%'}}></View>
                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', marginBottom: 10}}>
                                    <Text style={{fontSize: 15, fontWeight: 'bold', color: '#000'}}>No. Ticket: <Text style={{color: Orange}}>{detail?.no_ticket ? detail.no_ticket : '-'}</Text></Text>
                                    <View style={{width: 1.5, height: '100%', backgroundColor: '#dadada', marginHorizontal: 8}}></View>
                                    <View style={{backgroundColor: detail.backgroundColorEstado, padding: 4, borderRadius: 3.5}}>
                                        <Text style={{color: '#fff', fontWeight: 'bold'}}>{detail?.estado ? detail.estado : '-'}</Text>   
                                    </View>
                                </View>
                                <Title title={'Detalles'} icon={'asterisk'} tipo={1} hasBottom={false} isButton={true} areHiden={areLegendsHiden} handleAction={() => setInitialState({...initialState, areLegendsHiden: !areLegendsHiden})} except={true}/>
                                {
                                    !areLegendsHiden
                                    ?
                                        <>
                                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', marginTop: 10, flexDirection: 'row'}}>
                                                <View style={{flex: 1}}>
                                                    <Text style={styles.title}>{'Tipo de ticket'}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.tipo ? detail.tipo : '-'}</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Text style={styles.title}>{'Concepto'}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.concepto ? detail.concepto : '-'}</Text>
                                                </View>
                                            </View>
                                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', marginTop: 10, flexDirection: 'row'}}>
                                                <View style={{flex: 1}}>
                                                    <Text style={styles.title}>{'Prioridad'}</Text>
                                                    <Text style={{fontWeight: 'bold', color: detail.prioridadBackgroundColor, fontSize: 14}}>{detail?.prioridad ? detail.prioridad : '-'}</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Text style={styles.title}>{'Creado'}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.creado ? detail.creado : '-'}</Text>
                                                </View>
                                            </View>
                                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', marginTop: 10}}>
                                                <Text style={styles.title}>{'Solicitado por: '}</Text>
                                                <Text style={{fontSize: 14, color: '#000'}}>{detail?.solicitado ? detail.solicitado : '-'}</Text>
                                            </View>
                                            {
                                                (!detail.asignado || edit) && permisos.btn_asignar
                                                ?
                                                    <View style={{marginTop: 10}}>
                                                        <Text style={styles.title}>{'Asignado a: '}</Text>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 3}}>
                                                            <TouchableOpacity style={[styles.picker, {flexDirection: 'row', flex: 1, borderColor: detail.asignado ? '#CBCBCB' : '#d53f40', height: detail.asignado ? detail.asignado > 33 ? 'auto' : 'auto' : 35, paddingVertical: 6}]} onPress={() => setInitialState({...initialState, visibleResponsables: true})}>
                                                                <View style={{flex: 1}}>
                                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail.asignado ? detail.asignado : 'Seleccione una opción'}</Text>
                                                                </View>
                                                                <View style={{width: 'auto'}}>
                                                                    <Icon name='caret-down' size={20} color={detail.asignado ? '#CBCBCB' : '#d53f40'} />
                                                                </View>
                                                            </TouchableOpacity>
                                                            {
                                                                edit
                                                                &&
                                                                    <Animatable.View
                                                                        style={{width: 35, height: 35, marginLeft: 3, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}
                                                                        animation='bounceIn'
                                                                        duration={1000}
                                                                    >
                                                                        <TouchableOpacity onPress={() => setInitialState({...initialState, edit: false})}>
                                                                            <Icon name='times' size={25} color={'#fff'} />
                                                                        </TouchableOpacity>
                                                                    </Animatable.View>
                                                            }
                                                        </View>
                                                    </View>
                                                :
                                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                                        <View style={{height: 'auto', flex: 1, justifyContent: 'center'}}>
                                                            <Text style={styles.title}>{'Asignado a: '}</Text>
                                                            <Text style={{fontSize: 14, color: '#000'}}>{detail?.asignado ? detail.asignado : '-'}</Text>
                                                        </View>
                                                        {
                                                            (active !== 2 && active !== 4) && permisos.btn_asignar && (detail.estado === 'Proceso' || detail.estado === 'Pendiente')
                                                            &&
                                                                <Animatable.View
                                                                    style={{width: 35, height: 35, marginLeft: 3, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}
                                                                    animation='bounceIn'
                                                                    duration={1000}
                                                                >
                                                                    <TouchableOpacity onPress={() => setInitialState({...initialState, edit: true})}>
                                                                        <Icon name='pencil' size={23} color={'#fff'} />
                                                                    </TouchableOpacity>
                                                                </Animatable.View>
                                                        }
                                                    </View>
                                            }
                                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', marginTop: 10, flexDirection: 'row'}}>
                                                <View style={{height: 'auto', flex: 1, justifyContent: 'center'}}>
                                                    <Text style={styles.title}>{'Asignado: '}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.fecha_asignado ? detail.fecha_asignado : '-'}</Text>
                                                </View>
                                                <View style={{height: 'auto', flex:1 , justifyContent: 'center'}}>
                                                    <Text style={styles.title}>{'Terminado: '}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.fecha_terminado ? detail.fecha_terminado : '-'}</Text>
                                                </View>
                                            </View>
                                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', marginTop: 10, flexDirection: 'row'}}>
                                                <View style={{height: 'auto', flex: 1, justifyContent: 'center'}}>
                                                    <Text style={styles.title}>{'Cerrado: '}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.fecha_cierre ? detail.fecha_cierre : '-'}</Text>
                                                </View>
                                                <View style={{height: 'auto', flex:1 , justifyContent: 'center'}}>
                                                    <Text style={styles.title}>{'Archivado: '}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.fecha_archivado ? detail.fecha_archivado : '-'}</Text>
                                                </View>
                                            </View>
                                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', marginTop: 10, flexDirection: 'row'}}>
                                                <View style={{height: 'auto', flex: 1, justifyContent: 'center'}}>
                                                    <Text style={styles.title}>{'T. Atención: '}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.tiempo_atencion ? detail.tiempo_atencion : '-'}</Text>
                                                </View>
                                                <View style={{height: 'auto', flex:1 , justifyContent: 'center'}}>
                                                    <Text style={styles.title}>{'T. Resolución: '}</Text>
                                                    <Text style={{fontSize: 14, color: '#000'}}>{detail?.tiempo_resolucion ? detail.tiempo_resolucion : '-'}</Text>
                                                </View>
                                            </View>
                                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', marginTop: 10}}>
                                                <Text style={styles.title}>{'Detalle: '}</Text>
                                                <Text style={{fontSize: 14, color: '#000'}}>{detail.detalle ? detail.detalle : '-'}</Text>
                                            </View>
                                        </>
                                    :
                                        active === 4
                                        &&
                                            <View style={{marginTop: 15}}></View>
                                }
                                {
                                    active === 4
                                    &&
                                        <>
                                            <View style={{marginTop: areLegendsHiden ? 0 : 15, marginBottom: 5}}></View>
                                            <Title title={'Evidencias'} icon={'paperclip'} tipo={1} hasBottom={false} isButton={true} areHiden={areEvidencesHiden} handleAction={() => setInitialState({...initialState, areEvidencesHiden: !areEvidencesHiden})}/>
                                        </>
                                }
                                {
                                    !areEvidencesHiden && active === 4
                                    ?
                                        <>
                                            {
                                                Evidencias.length > 0
                                                &&
                                                    <FlatList
                                                        showsVerticalScrollIndicator={false}
                                                        showsHorizontalScrollIndicator={false}
                                                        style={styles.list}
                                                        data={Evidencias}
                                                        numColumns={1}
                                                        renderItem={({item}) => (
                                                            !item.url.includes('.jpg') && !item.url.includes('.png') && !item.url.includes('.jpeg') 
                                                            ?
                                                                <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8}}>
                                                                    {
                                                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                                            <View style={{flexDirection: 'row'}}>
                                                                                <View style={{height: 'auto', width: 'auto', justifyContent: 'center', alignItems: 'center'}} >
                                                                                    <View style={{height: 'auto', width: 'auto', borderWidth: 1, borderColor: '#dadada'}}>
                                                                                        <IonIcons name={item.url.includes('.pdf') ? 'file-pdf' : (item.url.includes('.docx') || item.url.includes('.doc')) ? 'file-word' : 'file-excel'} size={35} color={item.url.includes('.pdf') ? '#d53f40' : (item.url.includes('.docx') || item.url.includes('.doc')) ? '#185abd' : '#107c41'} />
                                                                                    </View>
                                                                                </View>
                                                                                {
                                                                                    !item.oculta 
                                                                                    ?
                                                                                        <TouchableOpacity style={{flexDirection: 'row', flex: 1}} onPress={async () => await Linking.openURL(item.url)}>
                                                                                            <View style={{flex: 1, marginHorizontal: 12, marginLeft: 16, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                                                <Text style={{fontSize: 13, color: Blue, textDecorationColor: Blue, textDecorationLine: 'underline', textDecorationStyle: 'solid'}}>{item.nombre}</Text>
                                                                                            </View>
                                                                                        </TouchableOpacity>
                                                                                    :
                                                                                        <View style={{flexDirection: 'row', flex: 1}}>
                                                                                            <View style={{flex: 1, marginHorizontal: 12, marginLeft: 16, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                                                <Text style={{fontSize: 13, color: Blue}}>{item.observacion}</Text>
                                                                                            </View>
                                                                                        </View>
                                                                                }
                                                                                {
                                                                                    item.observacion
                                                                                    ?
                                                                                        <TouchableOpacity onPress={() => handleHide(item.id)} style={{position: 'absolute', bottom: 18, left: 22, width: 24, height: 24, borderRadius: 15, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderColor: '#cbcbcb', borderWidth: 1}}>
                                                                                            <IonIcons name={!item.oculta ? 'comment' : 'close-thick'} size={!item.oculta ? 12 : 15} color={'#fff'} />
                                                                                        </TouchableOpacity>
                                                                                    :
                                                                                        <></>
                                                                                }
                                                                                <TouchableOpacity style={{width: 35, height: 35, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                                                                                    Alert.alert(
                                                                                        'Eliminar Evidencia',
                                                                                        '¿Esta seguro que deseas eliminar la evidencia?',
                                                                                        [
                                                                                            {
                                                                                                text: 'Cancelar',
                                                                                                style: 'cancel'
                                                                                            },
                                                                                            { 
                                                                                                text: 'Sí, estoy seguro', 
                                                                                                onPress: () => handleDeleteEvidencia(item.id)
                                                                                            }
                                                                                        ]
                                                                                    )
                                                                                }}>
                                                                                    <Icon name={'trash'} size={25} color={'#d53f40'} />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            :
                                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 8}}>
                                                                    <View style={{flexDirection: 'row'}}>
                                                                        <View style={{width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                                                                            <Image 
                                                                                style={{
                                                                                    alignSelf: 'center',
                                                                                    height: 30,
                                                                                    width: 30
                                                                                }}
                                                                                source={require('../../../../../assets/image.png')}
                                                                            />
                                                                        </View>

                                                                        {
                                                                            !item.oculta 
                                                                            ?
                                                                                <TouchableOpacity style={{flexDirection: 'row', flex: 1}} onPress={async () => await Linking.openURL(item.url)}>
                                                                                    <View style={{flex: 1, marginHorizontal: 12, marginLeft: 16, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                                        <Text style={{fontSize: 13, color: Blue, textDecorationColor: Blue, textDecorationLine: 'underline', textDecorationStyle: 'solid'}}>{item.nombre}</Text>
                                                                                    </View>
                                                                                </TouchableOpacity>
                                                                            :
                                                                                <View style={{flexDirection: 'row', flex: 1}}>
                                                                                    <View style={{flex: 1, marginHorizontal: 12, marginLeft: 16, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                                        <Text style={{fontSize: 13, color: Blue}}>{item.observacion}</Text>
                                                                                    </View>
                                                                                </View>
                                                                        }

                                                                        {
                                                                            item.observacion
                                                                            ?
                                                                                <TouchableOpacity onPress={() => handleHide(item.id)} style={{position: 'absolute', bottom: 18, left: 22, width: 24, height: 24, borderRadius: 15, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderColor: '#cbcbcb', borderWidth: 1}}>
                                                                                    <IonIcons name={!item.oculta ? 'comment' : 'close-thick'} size={!item.oculta ? 12 : 15} color={'#fff'} />
                                                                                </TouchableOpacity>
                                                                            :
                                                                                <></>
                                                                        }
                                                                        <TouchableOpacity style={{width: 35, height: 35, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                                                                            Alert.alert(
                                                                                'Eliminar Evidencia',
                                                                                '¿Esta seguro que deseas eliminar la evidencia?',
                                                                                [
                                                                                    {
                                                                                        text: 'Cancelar',
                                                                                        style: 'cancel'
                                                                                    },
                                                                                    { 
                                                                                        text: 'Sí, estoy seguro', 
                                                                                        onPress: () => handleDeleteEvidencia(item.id)
                                                                                    }
                                                                                ]
                                                                            )
                                                                        }}>
                                                                            <Icon name={'trash'} size={25} color={'#d53f40'} />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                        )}
                                                        keyExtractor={item => String(item.id)}
                                                    />
                                            }
                                            <Camera savePicture={(nombre_imagen, encryptedImage, imagen) => setInitialState({...initialState, nombre_imagen: nombre_imagen, encryptedImage: encryptedImage, imagen: imagen})} reload={reload} imagen={imagen} />
                                            <MultiText
                                                placeholder={'Ingresa tu mensaje...'}
                                                value={mensaje}
                                                onChangeText={(e) => setInitialState({...initialState, mensaje: e})}
                                                multiline={true}
                                                numberOfLines={5}
                                                fontSize={16}
                                            />
                                            <TouchableOpacity
                                                style={{flexDirection: 'row', height: 40, backgroundColor: Blue, borderRadius: 8, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, marginTop: 15, marginBottom: 20}}
                                                onPress={() => handleSaveEvidencia()}
                                            >
                                                <IonIcons name={'content-save'} size={24} color={'#fff'} />
                                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 6}}>Guardar</Text>
                                            </TouchableOpacity>
                                        </>
                                    :
                                        areLegendsHiden
                                        &&
                                            <View style={{marginBottom: 20}}></View>
                                }
                                {
                                    !areLegendsHiden && areEvidencesHiden
                                    &&
                                        <View style={{marginTop: '3%'}}></View>
                                }
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.list}
                                    data={chat}
                                    numColumns={1}
                                    renderItem={({item}) => <Chat mensajes={item.mensajes} fecha={item.fecha}/>}
                                    keyExtractor={item => String(item.id)}
                                />
                                {
                                    !calificacion.numero
                                    ?
                                        <View style={{marginBottom: 15}}></View>
                                    :
                                        <></>
                                }
                                {
                                    permisos.btn_responder
                                    &&
                                        <TouchableOpacity
                                            style={{flexDirection: 'row', height: 40, backgroundColor: Blue, borderRadius: 8, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, marginVertical: 10}}
                                            onPress={() => setInitialState({...initialState, visibleResponder: !visibleResponder})}
                                        >
                                            <IonIcons name={'keyboard-return'} size={22} color={'#fff'} />
                                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 6}}>Responder</Text>
                                        </TouchableOpacity>
                                }
                                {
                                    permisos.btn_autorizar
                                    &&
                                        <TouchableOpacity
                                            style={{flexDirection: 'row', height: 40, backgroundColor: Blue, borderRadius: 8, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, marginVertical: 10}}
                                            onPress={() => {
                                                setInitialState({...initialState, visibleAutorizar: !visibleAutorizar})}
                                            }
                                        >
                                            <Icon name={'check'} size={24} color={'#fff'} />
                                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 6}}>Autorizar</Text>
                                        </TouchableOpacity>
                                }
                                {
                                    permisos.btn_confirmar
                                    &&
                                        <TouchableOpacity
                                            style={{flexDirection: 'row', height: 40, backgroundColor: Blue, borderRadius: 8, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, marginVertical: 10}}
                                            onPress={() => setInitialState({...initialState, visibleConfirmar: !visibleConfirmar})}
                                        >
                                            <Icon name={'unlock'} size={24} color={'#fff'} />
                                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 6}}>Confirmación de Seguridad</Text>
                                        </TouchableOpacity>
                                }
                                    
                                {
                                    permisos.btn_ver_calificacion
                                    &&
                                        calificacion.numero
                                        &&
                                            <View style={{marginVertical: 20}}>
                                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{fontSize: 16, textAlign: 'center', color: Blue, fontWeight: 'bold'}}>Calificación</Text>
                                                        <IonIcons name={'star-half-full'} size={28} color={Blue} />
                                                    </View>
                                                </View>
                                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6}}>
                                                    <View style={{height: 'auto', justifyContent: 'center', alignItems: 'center', marginVertical: 6}}>
                                                        <IonIcons name={calificacion.numero === 1 ? 'emoticon-angry-outline' : calificacion.numero === 2 ? 'emoticon-sad-outline' : calificacion.numero === 3 ? 'emoticon-neutral-outline' : calificacion.numero === 4 ? 'emoticon-happy-outline' : 'emoticon-excited-outline'} size={38} color={calificacion.numero === 1 ? '#dd5a43' : calificacion.numero === 2 ? '#ff892a' : calificacion.numero === 3 ? Yellow : calificacion.numero === 4 ? '#69aa46' : Blue} />
                                                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                                            <View style={{width: 'auto', borderBottomWidth: 1, borderBottomColor: calificacion.numero === 1 ? '#dd5a43' : calificacion.numero === 2 ? '#ff892a' : calificacion.numero === 3 ? Yellow : calificacion.numero === 4 ? '#69aa46' : Blue}}>
                                                                <Text style={{fontSize: 15, fontWeight: 'normal', textAlign: 'center', color: calificacion.numero === 1 ? '#dd5a43' : calificacion.numero === 2 ? '#ff892a' : calificacion.numero === 3 ? Yellow : calificacion.numero === 4 ? '#69aa46' : Blue}}>{calificacion.numero === 1 ? 'Muy Insatisfecho' : calificacion.numero === 2 ? 'Insatisfecho' : calificacion.numero === 3 ? 'Neutral' : calificacion.numero === 4 ? 'Satisfecho' : 'Excelente'}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                }
                                
                                <View style={{marginBottom: '3%'}}></View>
                            </ScrollView>

                            <Modal orientation={orientationInfo.initial} visibility={visibleResponsables} handleDismiss={() => setInitialState({...initialState, visibleResponsables: !visibleResponsables})}>
                                <Select data={Responsables} handleActionUno={handleActionUno} />
                            </Modal>

                            <Modal orientation={orientationInfo.initial} visibility={visibleResponder} handleDismiss={() => {
                                setSelected(undefined)
                                setInitialState({...initialState, visibleResponder: !visibleResponder, motivo: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})}
                            }>
                                <KeyboardAwareScrollView
                                    contentContainerStyle={styles.scrollContainer}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Title title={'Respuesta/Comentario'} tipo={2} icon={'chat-processing-outline'} itCloses={() => {
                                        setSelected(undefined)
                                        setInitialState({...initialState, visibleResponder: !visibleResponder, motivo: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})}
                                    } vertical={false}/>
                                    <Text style={styles.title}>{'Motivo'}</Text>
                                    <View style={{justifyContent: 'center', alignItems: 'center', borderColor: '#CBCBCB', borderWidth: 1, height: 45, borderRadius: 15, marginBottom: 10, borderColor: motivo !== 'SEL' ? '#CBCBCB' : '#E68AA6', paddingHorizontal: isIphone ? 8 : 0}}>
                                        <Picker
                                            value={motivo}
                                            onValueChange={(itemValue, itemIndex) => handleActionDos(itemValue, itemIndex)}
                                            items={motivos}
                                            placeholder={{}}
                                        />
                                    </View>
                                    <Text style={styles.title}>{'Mensaje'}</Text>
                                    <MultiTextEditable handleInputChange={(e) => setInitialState({...initialState, mensaje: e})}/>
                                    <Camera savePicture={(nombre_imagen, encryptedImage, imagen) => setInitialState({...initialState, nombre_imagen: nombre_imagen, encryptedImage: encryptedImage, imagen: imagen})} reload={reload} imagen={imagen}/>
                                    {
                                        motivo === 4
                                        &&
                                            <>
                                                <Animatable.View
                                                    animation='bounceIn'
                                                    duration={2500}>
                                                        <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginBottom: 5}}>
                                                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                                <Text style={{fontSize: 16, textAlign: 'center', color: Blue, fontWeight: 'bold'}}>¡Califícanos!</Text>
                                                                <IonIcons name={'star-half-full'} size={28} color={Blue} />
                                                            </View>
                                                        </View>
                                                        <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4}} onPress={() => selected !== 1 ? setSelected(1) : {}}>
                                                                <IonIcons name={'emoticon-angry-outline'} size={38} color={selected === 1 ? '#dd5a43' : '#777'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4}} onPress={() => selected !== 2 ? setSelected(2) : {}}>
                                                                <IonIcons name={'emoticon-sad-outline'} size={38} color={selected === 2 ? '#ff892a' : '#777'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4}} onPress={() => selected !== 3 ? setSelected(3) : {}}>
                                                                <IonIcons name={'emoticon-neutral-outline'} size={38} color={selected === 3 ? Yellow : '#777'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4}} onPress={() => selected !== 4 ? setSelected(4) : {}}>
                                                                <IonIcons name={'emoticon-happy-outline'} size={38} color={selected === 4 ? '#69aa46' : '#777'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4}} onPress={() => selected !== 5 ? setSelected(5) : {}}>
                                                                <IonIcons name={'emoticon-excited-outline'} size={38} color={selected === 5 ? Blue : '#777'} />
                                                            </TouchableOpacity>
                                                        </View>     
                                                </Animatable.View>
                                                {
                                                    selected
                                                    &&
                                                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10, }}>
                                                            <View style={{width: 'auto', borderBottomWidth: 1, borderBottomColor: selected === 1 ? '#dd5a43' : selected === 2 ? '#ff892a' : selected === 3 ? Yellow : selected === 4 ? '#69aa46' : Blue}}>
                                                                <Text style={{fontSize: 15, fontWeight: 'normal', textAlign: 'center', color: selected === 1 ? '#dd5a43' : selected === 2 ? '#ff892a' : selected === 3 ? Yellow : selected === 4 ? '#69aa46' : Blue}}>{selected === 1 ? 'Muy Insatisfecho' : selected === 2 ? 'Insatisfecho' : selected === 3 ? 'Neutral' : selected === 4 ? 'Satisfecho' : 'Excelente'}</Text>
                                                            </View>
                                                        </View>
                                                }
                                            </>
                                    }
                                    <View style={{flexDirection: 'row', marginTop: motivo === 4 ? 20 : 0}}>
                                        <TouchableOpacity onPress={() => {
                                                setSelected(undefined)
                                                setInitialState({...initialState, visibleResponder: !visibleResponder, motivo: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})
                                            }} 
                                            style={{flex: 1, height: 40, backgroundColor: '#f7f7f7', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
                                        >
                                            <Icon name={'times'} size={22} color={'#000'} />
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000', marginLeft: 12}}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <View style={{width: 6}}></View>
                                        <TouchableOpacity onPress={() => handleAnswer()} style={{flex: 1, height: 40, backgroundColor: Blue, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon name={'paper-plane'} size={18} color={'#fff'} />
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 12}}>Envíar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </KeyboardAwareScrollView>
                            </Modal>

                            <Modal orientation={orientationInfo.initial} visibility={visibleAutorizar} handleDismiss={() => setInitialState({...initialState, visibleAutorizar: !visibleAutorizar})}>
                                <KeyboardAwareScrollView
                                    contentContainerStyle={styles.scrollContainer}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Title title={'Autorizar Ticket'} tipo={1} icon={'check'} itCloses={() => setInitialState({...initialState, visibleAutorizar: !visibleAutorizar, closeOption: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})}/>
                                    <Text style={styles.title}>{'Autorizar'}</Text>
                                    <View style={{justifyContent: 'center', alignItems: 'center', borderColor: '#CBCBCB', borderWidth: 1, height: 50, marginBottom: 10, borderColor: closeOption !== 'SEL' ? '#CBCBCB' : '#E68AA6', paddingHorizontal: isIphone ? 8 : 0}}>
                                        <Picker
                                            value={closeOption}
                                            onValueChange={(itemValue, itemIndex) => handleActionTres(itemValue, itemIndex)}
                                            items={closeOptions}
                                            placeholder={{}}
                                        />
                                    </View>
                                    <Text style={styles.title}>{'Mensaje'}</Text>
                                    <MultiTextEditable handleInputChange={(e) => setInitialState({...initialState, mensaje: e})}/>
                                    <Camera savePicture={(nombre_imagen, encryptedImage, imagen) => setInitialState({...initialState, nombre_imagen: nombre_imagen, encryptedImage: encryptedImage, imagen: imagen})} reload={reload} imagen={imagen}/>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity onPress={() => setInitialState({...initialState, visibleAutorizar: !visibleAutorizar, closeOption: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})} style={{flex: 1, height: 40, backgroundColor: '#f7f7f7', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon name={'times'} size={22} color={'#000'} />
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000', marginLeft: 12}}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <View style={{width: 6}}></View>
                                        <TouchableOpacity onPress={() => handleAutorizar()} style={{flex: 1, height: 40, backgroundColor: Blue, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon name={'check'} size={20} color={'#fff'} />
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 12}}>Autorizar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </KeyboardAwareScrollView>
                            </Modal>

                            <Modal orientation={orientationInfo.initial} visibility={visibleConfirmar} handleDismiss={() => setInitialState({...initialState, visibleConfirmar: !visibleConfirmar})}>
                                <KeyboardAwareScrollView
                                    contentContainerStyle={styles.scrollContainer}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Title title={'Confirmación de Seguridad'} tipo={1} icon={'unlock'} itCloses={() => setInitialState({...initialState, visibleConfirmar: !visibleConfirmar, imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})}/>
                                    <Text style={styles.title}>{'Mensaje'}</Text>
                                    <MultiTextEditable handleInputChange={(e) => setInitialState({...initialState, mensaje: e})}/>
                                    <Camera savePicture={(nombre_imagen, encryptedImage, imagen) => setInitialState({...initialState, nombre_imagen: nombre_imagen, encryptedImage: encryptedImage, imagen: imagen})} reload={reload} imagen={imagen}/>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity onPress={() => setInitialState({...initialState, visibleConfirmar: !visibleConfirmar, imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})} style={{flex: 1, height: 40, backgroundColor: '#f7f7f7', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon name={'times'} size={22} color={'#000'} />
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000', marginLeft: 12}}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <View style={{width: 6}}></View>
                                        <TouchableOpacity onPress={() => handleConfirmar()} style={{flex: 1, height: 40, backgroundColor: Blue, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon name={'unlock'} size={20} color={'#fff'} />
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 12}}>Confirmar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </KeyboardAwareScrollView>
                            </Modal>
                            <ModalLoading visibility={loading}/>
                            <Message tipo={1} visible={visibleMensaje} title={showMensaje} orientation={orientationInfo.initial}/>
                            <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                        </View>
                    </>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			            <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                        <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>
                    </>
            }
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
    title: {
        fontSize: 14,
        color: Blue,
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 35,
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        height: 50,
        paddingHorizontal: 8,
        flex: 1,
    },
    scrollContainer: {
        flexGrow:1,
    },
    div: {
        color: '#000'
    },
})