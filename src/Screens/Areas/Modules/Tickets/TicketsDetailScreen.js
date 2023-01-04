import React, {useCallback, useEffect, useRef, useState} from 'react'
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
import tw from 'twrnc';
import { getCurrentDate } from '../../../../js/dates';
import { selectOrientation } from '../../../../slices/orientationSlice';

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

export default ({navigation, route: {params: {id, id_usuario, id_puesto, active, is_table, html, cuenta}}}) => {
    
    const dispatch = useDispatch()
    token = useSelector(selectTokenInfo)
    const orientation = useSelector(selectOrientation)
    const refDetail = useRef()
    const spliterData = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}, {id: 12}, {id: 13}, {id: 14}, {id: 15}, {id: 16}, {id: 17}, {id: 18}, {id: 19}, {id: 20}, {id: 21}, {id: 22}, {id: 23}, {id: 24}, {id: 25}, {id: 26}, {id: 27}, {id: 28}, {id: 29}, {id: 30}, {id: 31}, {id: 32}, {id: 33}, {id: 34}, {id: 35}]
    cuenta = cuenta;
    const language = '1';
    const {isTablet} = DeviceInfo;
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const {handlePath} = useNavigation()
    const [contador, setContador] = useState(0)
    const {hasConnection, askForConnection} = useConnection();
    const [selected, setSelected] = useState(undefined)
    const {translateY, handleScroll, paddingTop} = useScroll(orientation)
    const [scrolling, setScrolling] = useState(0)
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
            
            console.log('body: ', body)

            const request = await fetch(urlTickets, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });
            const {response, status} = await request.json();
            if(status === 200){
                cuenta = cuenta + 1;
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
            
                const {response, status} = await request.json();
                if(status === 200){
                    console.log('asignado correctamente')
                    if(response.last) dispatch(actionTicket({id: response.last.id, ticket: response.last}))
                    setLoading(false)
                    setInitialState({...initialState, visibleResponsables: false, visibleMensaje: true, showMensaje: response.text, visibleCalificacion: false})
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
        return(
            <>
                <View style={{flexDirection: 'row', height: 'auto', alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 6, marginTop: 8}}>
                    <Icon name={'calendar'} size={15} color={Blue} />
                    <Text style={{fontSize: 12, marginLeft: 5, color: Blue, borderRadius: 8}}>{fecha}</Text>
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{height: 'auto', alignSelf: 'stretch'}}
                    data={mensajes}
                    numColumns={1}
                    renderItem={({item}) =>
                    <View style={{borderWidth: 1.5, borderColor: '#f1f1f1', flex: 1, justifyContent: 'center', alignItems: 'center', height: 'auto', marginVertical: '2%', borderRadius: 14, padding: 4, paddingTop: 8, marginBottom: 10, backgroundColor: '#fff'}} onPress={() => navigation.navigate('test_2')}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 5, backgroundColor: '#dadada', borderRadius: 35, width: 38, height: 38}}>
                                        {
                                            item.picture !== ''
                                            ?
                                                <Image
                                                    style={[image, {width: !isTablet() ? orientation === 'PORTRAIT' ? 35 : 25 : orientation === 'PORTRAIT' ? 35 : 25, height: !isTablet() ? orientation === 'PORTRAIT' ? 35 : 25 : orientation === 'PORTRAIT' ? 35 : 35}]}
                                                    resizeMode={'cover'}
                                                    source={{uri: `${item.picture}`}}
                                                />
                                            :
                                                <Image
                                                    style={[image, {width: !isTablet() ? orientation === 'PORTRAIT' ? 35 : 25 : orientation === 'PORTRAIT' ? 35 : 25, height: !isTablet() ? orientation === 'PORTRAIT' ? 35 : 25 : orientation === 'PORTRAIT' ? 35 : 35}]}
                                                    resizeMode={'cover'}
                                                    source={require('../../../../../assets/user.png')}
                                                />
                                        }
                                    </View>
                                    <View style={{flex: 1, alignSelf:'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                        <Text style={{fontSize: 15, fontWeight: 'bold', color: Blue}}>{item.usuario}</Text>
                                    </View>
                                    <View style={{width: 'auto', height: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                        <IonIcons name={'clock-outline'} size={15} color={Blue} />
                                        <Text style={{color: Blue, fontSize: 10, marginLeft: 2}}>{item.hora}</Text>
                                    </View>
                                </View>
                                <View style={{height: item.title ? 'auto' : 0, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 14, color: Blue}}>{item.title}</Text>
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
                                                        <IonIcons name={'clock'} size={22} color={Orange} />
                                                    :
                                                        <View style={{width: 20, height: 20, backgroundColor: item.filtro_autorizacion === 2 ? '#629b58' : '#cf513d', borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                            <IonIcons name={item.filtro_autorizacion === 2 ? 'check' : 'close'} size={item.filtro_autorizacion === 2 ? 14 : 16} color={'#fff'} />
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
                                                                <IonIcons name={'clock'} size={22} color={Orange} />
                                                            :
                                                                <View style={{width: 20, height: 20, backgroundColor: item.filtro_confirmacion === 2 ? '#629b58' : '#cf513d', borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                                    <IonIcons name={item.filtro_confirmacion === 2 ? 'check' : 'close'} size={item.filtro_confirmacion === 2 ? 14 : 16} color={'#fff'} />
                                                                </View>
                                                        }
                                                    </View>
                                            }
                                        </View>
                                }
                                <ScrollView style={{height: 'auto', paddingTop: 10, paddingBottom: 3}}>
                                    {
                                        item.id === 0 && is_table
                                        ?
                                            <HTML source={{ html }} {...htmlProps} contentWidth={Dimensions.get('screen').width}/>
                                        :
                                            <HTMLView
                                                value={'<div style="color: black">' + item.body.trim() + '</div>'}
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
                                                            <IonIcons name={item.url.includes('.pdf') ? 'file-pdf-box' : (item.url.includes('.docx') || item.url.includes('.doc')) ? 'file-word' : 'file-excel'} size={32} color={item.url.includes('.pdf') ? '#d53f40' : (item.url.includes('.docx') || item.url.includes('.doc')) ? '#185abd' : '#107c41'} />
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
                
                    const {response, status} = await request.json();
                    if(status === 200){
                        setScrolling(scrolling + 1)
                        setLoading(false)
                        if(response.last) dispatch(actionTicket({id: response.last.id, ticket: response.last}))
                        setInitialState({...initialState, visibleMensaje: true, showMensaje: response.text, visibleResponder: false})
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
            
                const {response, status} = await request.json();
                if(status === 200){
                    cuenta = 1;
                    setLoading(false)
                    setInitialState({...initialState, visibleMensaje: true, showMensaje: response.text,  mensaje: '', imagen: '', encryptedImage: '', nombre_imagen: ''})
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
        
            const {response, status} = await request.json();
            if(status === 200){
                cuenta = 1;
                setLoading(false)
                setInitialState({...initialState, visibleMensaje: true, showMensaje: response.text})
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
            
                const {response, status} = await request.json();
                if(status === 200){
                    setScrolling(scrolling + 1)
                    if(response.last) dispatch(actionTicket({id: response.last.id, ticket: response.last}))
                    setLoading(false)
                    setInitialState({...initialState, visibleMensaje: true, showMensaje: response.text, visibleAutorizar: false})
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
            
                const {response, status} = await request.json();
                if(status === 200){
                    setScrolling(scrolling + 1)
                    if(response.last) dispatch(actionTicket({id: response.last.id, ticket: response.last}))
                    setLoading(false)
                    setInitialState({...initialState, visibleMensaje: true, showMensaje: response.text, visibleConfirmar: false})
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

    const pickerStyle = {
        inputIOS: {
            color: '#000',
        },
        inputAndroid: {
            color: '#000',
        },
    };

    const Spliter = ({color = Blue}) => {
        return(
            <View style={tw`flex-row justify-center items-center mx-${color === Blue ? 0 : 4}`}>
                <View style={tw`h-4 w-4 rounded-full bg-[${color}] absolute left-[-6]`}></View>
                <View style={tw`h-2 self-stretch justify-center items-center flex-row`}>
                    {
                        spliterData.map(x => x.id <= 35 && <View style={tw`w-0.5 h-0.5 rounded-full bg-[#adadad] mx-1`} />)
                    }
                </View>
                <View style={tw`h-4 w-4 rounded-full bg-[${color}] absolute right-[-6]`}></View>
            </View>
        )
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            {
                hasConnection
                ?
                    <View style={tw`flex-1 justify-center items-center bg-white`}>
                        <ScrollView
                            ref={refDetail}
                            onContentSizeChange={() => scrolling !== 0 ? refDetail.current.scrollToEnd({ animated: true }) : {}}
                            refreshControl={
                                <RefreshControl
                                    style={tw`bg-[${Blue}]`}
                                    progressBackgroundColor={'#EC5C25'}
                                    colors={['#fff']}
                                    tintColor={'#fff'}
                                    refreshing={false}
                                    onRefresh={() => {
                                        cuenta = 0;
                                        getTicketDetail()
                                    }}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={tw`justify-center items-center`}
                            style={tw`self-stretch bg-[#f1f1f1]`}>
                                <View style={tw`h-70 self-stretch justify-start items-center bg-[${Blue}]`}>
                                    <View style={tw`h-16 self-stretch justify-center items-center`}>
                                        <TouchableOpacity style={tw`rounded-full justify-center items-center bg-[rgba(255,255,255,0.4)] w-14 h-14`} onPress={() => navigation.navigate('Tickets')}>
                                            <IonIcons name='close' size={23} color={'#fff'} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={tw`h-15 self-stretch justify-center items-center`}>
                                        <Text style={tw`text-white font-bold text-2xl`}>Detalle de Ticket</Text>
                                    </View>
                                </View>
                                <View style={[tw`flex-1 self-stretch justify-center items-center mx-[5%] relative top-[-38] z-10 bg-white`, {borderRadius: 22}]}>
                                    <View style={[tw`justify-center items-center h-auto self-stretch`, {borderRadius: 22}]}>
                                        <View style={tw`h-auto self-stretch flex-row px-5 pt-3 justify-end items-center`}>
                                            <View style={tw`h-auto self-stretch justify-center items-end`}>
                                                <Text style={tw`text-xs font-bold text-[#000]`}>No. Ticket: <Text style={tw`text-[${Orange}]`}>{detail?.no_ticket ? detail.no_ticket : '-'}</Text></Text>
                                            </View>
                                            <View style={tw`w-px h-5 bg-[#dadada] mx-2`} />
                                            <View style={tw`bg-[${detail.backgroundColorEstado ? detail.backgroundColorEstado : '#fff'}] py-px px-1 rounded`}>
                                                <Text style={tw`text-[#fff] font-bold text-xs`}>{detail?.estado ? detail.estado : '-'}</Text>   
                                            </View>
                                        </View>
                                        <View style={[tw`h-auto self-stretch justify-start items-center mt-5 mb-3 px-4`, {borderRadius: 22}]}>
                                            <View style={tw`flex-row self-stretch mb-3`}>
                                                {
                                                    detail.foto_solicitado !== ''
                                                    ?
                                                        <Image
                                                            style={tw`h-12 w-12 rounded-full border-2 border-[#dadada]`}
                                                            resizeMode={'cover'}
                                                            source={{uri: detail.foto_solicitado}}
                                                        />
                                                    :
                                                        <Image
                                                            style={tw`h-12 w-12 rounded-full border-2 border-[#dadada]`}
                                                            resizeMode={'cover'}
                                                            source={require('../../../../../assets/user.png')}
                                                        />
                                                }
                                                <View style={tw`ml-4 flex-1 justify-center items-start`}>
                                                    <Text style={tw`text-[#adadad] text-sm`}>Solicitado por:</Text>
                                                    <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.solicitado ? detail.solicitado : '-'}</Text>
                                                </View>
                                                <View style={tw`h-12 w-14 justify-center items-end pl-px`}>
                                                    <View style={tw`w-auto h-auto p-1 justify-center items-center bg-[${detail.prioridadBackgroundColor ? detail.prioridadBackgroundColor : Blue}] rounded`}>
                                                        <Text style={tw`font-bold text-[#fff] text-sm`}>{detail?.prioridad ? detail.prioridad : '-'}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Spliter />
                                        </View>
                                        <View style={tw`flex-row self-stretch mb-3 px-4 justify-center items-center`}>
                                            {
                                                detail.foto_asignado !== ''
                                                ?
                                                    <Image
                                                        style={tw`h-12 w-12 rounded-full border-2 border-[#dadada]`}
                                                        resizeMode={'cover'}
                                                        source={{uri: detail.foto_asignado}}
                                                    />
                                                :
                                                    <Image
                                                        style={tw`h-12 w-12 rounded-full border-2 border-[#dadada]`}
                                                        resizeMode={'cover'}
                                                        source={require('../../../../../assets/user.png')}
                                                    />
                                            }
                                            {
                                                (!detail.asignado || edit) && permisos.btn_asignar
                                                ?
                                                    <View style={tw`self-stretch flex-1 ml-4`}>
                                                        <Text style={tw`text-[#adadad] text-sm`}>{'Asignado a: '}</Text>
                                                        <View style={tw`flex-row self-stretch justify-center items-center mt-1`}>
                                                            <TouchableOpacity style={[styles.picker, tw`pl-1 h-7 flex-row flex-1 border border-[${detail.asignado ? '#CBCBCB' : '#d53f40'}] self-stretch`]} onPress={() => setInitialState({...initialState, visibleResponsables: true})}>
                                                                <View style={tw`flex-1`}>
                                                                    <Text style={tw`text-xs text-[#000]`}>{detail.asignado ? `${detail.asignado.length > 33 ? detail.asignado.substring(0,33) + '...' : detail.asignado}` : 'Seleccione una opción'}</Text>
                                                                </View>
                                                                <View style={tw`w-auto`}>
                                                                    <Icon name='caret-down' size={16} color={detail.asignado ? '#CBCBCB' : '#d53f40'} />
                                                                </View>
                                                            </TouchableOpacity>
                                                            {
                                                                edit
                                                                &&
                                                                    <Animatable.View
                                                                        style={[{width: 28, height: 28}, tw`ml-1 bg-[#DB3E2F] justify-center items-center rounded-full border border-[#dadada]`]}
                                                                        animation='bounceIn'
                                                                        duration={1000}
                                                                    >
                                                                        <TouchableOpacity style={tw`flex-1 justify-center items-center`} onPress={() => {
                                                                            setScrolling(0)
                                                                            setInitialState({...initialState, edit: false})
                                                                        }}>
                                                                            <IonIcons name='close-thick' size={14} color={'#fff'} />
                                                                        </TouchableOpacity>
                                                                    </Animatable.View>
                                                            }
                                                        </View>
                                                    </View>
                                                :
                                                    <View style={tw`flex-row self-stretch justify-center items-center flex-1 ml-4`}>
                                                        <View style={tw`flex-1 justify-center items-start`}>
                                                            <Text style={tw`text-[#adadad] text-sm`}>Asignado a:</Text>
                                                            <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.asignado ? detail.asignado : '-'}</Text>
                                                        </View>
                                                        {
                                                            (active !== 2 && active !== 4) && permisos.btn_asignar && (detail.estado === 'Proceso' || detail.estado === 'Pendiente')
                                                            &&
                                                                <Animatable.View
                                                                    style={[{width: 28, height: 28}, tw`ml-1 bg-[${Blue}] justify-center items-center rounded-full border border-[#dadada]`]}
                                                                    animation='bounceIn'
                                                                    duration={1000}
                                                                >
                                                                    <TouchableOpacity style={tw`flex-1 justify-center items-center`} onPress={() => setInitialState({...initialState, edit: true})}>
                                                                        <Icon name='pencil' size={14} color={'#fff'} />
                                                                    </TouchableOpacity>
                                                                </Animatable.View>
                                                        }
                                                    </View>
                                            }
                                        </View>
                                        <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mb-2.5`}>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>Tipo de Ticket:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.tipo ? detail.tipo : '-'}</Text>
                                            </View>
                                            <View style={tw`w-2`}/>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>Concepto:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.concepto ? detail.concepto : '-'}</Text>
                                            </View>
                                        </View>
                                        <Spliter color={'#f1f1f1'}/>
                                        <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mt-2.5`}>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>Creado:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.creado ? detail.creado : '-'}</Text>
                                            </View>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>Asignado:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.fecha_asignado ? detail.fecha_asignado : '-'}</Text>
                                            </View>
                                        </View>
                                        <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mt-2.5`}>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>Terminado:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.fecha_terminado ? detail.fecha_terminado : '-'}</Text>
                                            </View>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>Cerrado:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.fecha_cierre ? detail.fecha_cierre : '-'}</Text>
                                            </View>
                                        </View>
                                        <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mt-2.5`}>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>Archivado:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.fecha_archivado ? detail.fecha_archivado : '-'}</Text>
                                            </View>
                                        </View>
                                        <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mt-2.5`}>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>T. Atención:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.tiempo_atencion ? detail.tiempo_atencion : '-'}</Text>
                                            </View>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>T. Resolución:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail?.tiempo_resolucion ? detail.tiempo_resolucion : '-'}</Text>
                                            </View>
                                        </View>
                                        <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 my-2.5`}>
                                            <View style={tw`flex-1 justify-start items-start h-auto`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>Detalle:</Text>
                                                <Text style={tw`text-[#000] font-bold text-sm`}>{detail.detalle ? detail.detalle : '-'}</Text>
                                            </View>
                                        </View>
                                        {
                                            active === 4
                                            &&
                                                <>
                                                    <Spliter color={'#f1f1f1'}/>
                                                    <Title title={'Evidencias'} icon={'paperclip'} tipo={1} hasBottom={false} isButton={true} areHiden={areEvidencesHiden} handleAction={() => setInitialState({...initialState, areEvidencesHiden: !areEvidencesHiden})}/>
                                                </>
                                        }
                                        {
                                            !areEvidencesHiden && active === 4
                                            ?
                                                <View style={{height: 'auto', alignSelf: 'stretch', marginHorizontal: 16}}>
                                                    {
                                                        Evidencias.length > 0
                                                        &&
                                                            <FlatList
                                                                showsVerticalScrollIndicator={false}
                                                                showsHorizontalScrollIndicator={false}
                                                                style={{height: 'auto', alignSelf: 'stretch'}}
                                                                data={Evidencias}
                                                                numColumns={1}
                                                                renderItem={({item}) => (
                                                                    !item.url.includes('.jpg') && !item.url.includes('.png') && !item.url.includes('.jpeg') 
                                                                    ?
                                                                        <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8}}>
                                                                            {
                                                                                <View style={tw`flex-1 justify-center items-center`}>
                                                                                    <View style={tw`flex-row`}>
                                                                                        <View style={tw`h-auto w-auto justify-center items-center`}>
                                                                                            <View style={tw`h-auto w-auto border border-[#dadada]`}>
                                                                                                <IonIcons name={item.url.includes('.pdf') ? 'file-pdf-box' : (item.url.includes('.docx') || item.url.includes('.doc')) ? 'file-word' : 'file-excel'} size={35} color={item.url.includes('.pdf') ? '#d53f40' : (item.url.includes('.docx') || item.url.includes('.doc')) ? '#185abd' : '#107c41'} />
                                                                                            </View>
                                                                                        </View>
                                                                                        {
                                                                                            !item.oculta 
                                                                                            ?
                                                                                                <TouchableOpacity style={tw`flex-row flex-1`} onPress={async () => await Linking.openURL(item.url)}>
                                                                                                    <View style={tw`flex-1 mx-3 ml-4 justify-center items-start`}>
                                                                                                        <Text style={[tw`text-sm text-[${Blue}]`, {textDecorationColor: Blue, textDecorationLine: 'underline', textDecorationStyle: 'solid'}]}>{item.nombre}</Text>
                                                                                                    </View>
                                                                                                </TouchableOpacity>
                                                                                            :
                                                                                                <View style={tw`flex-row flex-1`}>
                                                                                                    <View style={tw`flex-1 mx-3 ml-4 justify-center items-start`}>
                                                                                                        <Text style={tw`text-sm text-[${Blue}]`}>{item.observacion}</Text>
                                                                                                    </View>
                                                                                                </View>
                                                                                        }
                                                                                        {
                                                                                            item.observacion
                                                                                            ?
                                                                                                <TouchableOpacity onPress={() => handleHide(item.id)} style={{position: 'absolute', bottom: 18, left: 22, width: 24, height: 24, borderRadius: 15, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderColor: '#cbcbcb', borderWidth: 1, paddingLeft: isIphone ? 1 : 0, paddingTop: isIphone ? 1 : 0}}>
                                                                                                    <IonIcons name={!item.oculta ? 'comment' : 'close-thick'} size={!item.oculta ? 12 : 15} color={'#fff'} />
                                                                                                </TouchableOpacity>
                                                                                            :
                                                                                                <></>
                                                                                        }
                                                                                        <TouchableOpacity style={tw`w-9 h-9 justify-center items-center`} onPress={() => {
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
                                                                                        style={tw`self-center h-7.5 w-7.5`}
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
                                                                                                <Text style={{fontSize: 14, color: Blue}}>{item.observacion}</Text>
                                                                                            </View>
                                                                                        </View>
                                                                                }

                                                                                {
                                                                                    item.observacion
                                                                                    ?
                                                                                        <TouchableOpacity onPress={() => handleHide(item.id)} style={{position: 'absolute', bottom: 18, left: 22, width: 24, height: 24, borderRadius: 15, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderColor: '#cbcbcb', borderWidth: 1, paddingLeft: isIphone ? 1 : 0, paddingTop: isIphone ? 1 : 0}}>
                                                                                            <IonIcons name={!item.oculta ? 'comment' : 'close-thick'} size={!item.oculta ? 12 : 15} color={'#fff'} />
                                                                                        </TouchableOpacity>
                                                                                    :
                                                                                        <></>
                                                                                }
                                                                                <TouchableOpacity style={tw`w-9 h-9 justify-center items-center`} onPress={() => {
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
                                                        style={tw`flex-row h-10 bg-[${Blue}] rounded-lg self-stretch items-center justify-center py-1.5 mt-4 mb-5`}
                                                        onPress={() => handleSaveEvidencia()}
                                                    >
                                                        <IonIcons name={'content-save'} size={24} color={'#fff'} />
                                                        <Text style={tw`text-[#fff] font-bold text-base ml-1.5`}>Guardar</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            :
                                                <></>
                                        }
                                        {
                                            chat.length > 0
                                            &&
                                                <Spliter color={'#f1f1f1'}/>
                                        }
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{paddingHorizontal: 10}}
                                            style={{height: 'auto', alignSelf: 'stretch'}}
                                            data={chat}
                                            numColumns={1}
                                            renderItem={({item}) => <Chat mensajes={item.mensajes} fecha={item.fecha}/>}
                                            keyExtractor={item => String(item.id)}
                                        />
                                        {
                                        permisos.btn_ver_calificacion
                                        &&
                                            calificacion.numero
                                            &&
                                                <>
                                                    <Spliter color={'#f1f1f1'}/>
                                                    <View style={tw`mt-5 mb-10`}>
                                                        <View style={tw`h-auto self-stretch justify-center items-center`}>
                                                            <View style={tw`flex-row justify-center items-center`}>
                                                                <Text style={tw`text-base text-center text-[${Blue}] font-bold`}>Calificación</Text>
                                                                <IonIcons name={'star-half-full'} size={28} color={Blue} />
                                                            </View>
                                                        </View>
                                                        <View style={tw`h-auto self-stretch justify-center items-center px-1.5`}>
                                                            <View style={tw`h-auto justify-center items-center my-1.5`}>
                                                                <IonIcons name={calificacion.numero === 1 ? 'emoticon-angry-outline' : calificacion.numero === 2 ? 'emoticon-sad-outline' : calificacion.numero === 3 ? 'emoticon-neutral-outline' : calificacion.numero === 4 ? 'emoticon-happy-outline' : 'emoticon-excited-outline'} size={38} color={calificacion.numero === 1 ? '#dd5a43' : calificacion.numero === 2 ? '#ff892a' : calificacion.numero === 3 ? Yellow : calificacion.numero === 4 ? '#69aa46' : Blue} />
                                                                <View style={tw`justify-center items-center mt-2.5`}>
                                                                    <View style={tw`w-auto border-b border-b-[${calificacion.numero === 1 ? '#dd5a43' : calificacion.numero === 2 ? '#ff892a' : calificacion.numero === 3 ? Yellow : calificacion.numero === 4 ? '#69aa46' : Blue}]`}>
                                                                        <Text style={tw`text-base font-normal text-center text-[${calificacion.numero === 1 ? '#dd5a43' : calificacion.numero === 2 ? '#ff892a' : calificacion.numero === 3 ? Yellow : calificacion.numero === 4 ? '#69aa46' : Blue}]`}>{calificacion.numero === 1 ? 'Muy Insatisfecho' : calificacion.numero === 2 ? 'Insatisfecho' : calificacion.numero === 3 ? 'Neutral' : calificacion.numero === 4 ? 'Satisfecho' : 'Excelente'}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </>
                                    }
                                    </View>
                                </View>
                                <View style={tw`h-70 self-stretch justify-end items-center bg-[#f1f1f1] absolute bottom-0 w-[100%] px-[5%]`}>
                                    {
                                        permisos.btn_responder
                                        &&
                                            <TouchableOpacity 
                                                onPress={() => setInitialState({...initialState, visibleResponder: !visibleResponder})}
                                                style={tw`flex-row h-10 bg-[${Blue}] rounded-lg self-stretch w-[100%] items-center justify-center absolute top-35 right-5`}>
                                                <IonIcons name={'keyboard-return'} size={22} color={'#fff'} />
                                                <Text style={tw`text-[#fff] font-bold text-sm ml-1.5`}>Responder</Text>
                                            </TouchableOpacity>
                                    }
                                    {
                                        permisos.btn_autorizar
                                        &&
                                            <TouchableOpacity 
                                                onPress={() => setInitialState({...initialState, visibleAutorizar: !visibleAutorizar})}
                                                style={tw`flex-row h-10 bg-[${Blue}] rounded-lg self-stretch w-[100%] items-center justify-center absolute top-35 right-5`}>
                                                <Icon name={'check'} size={22} color={'#fff'} />
                                                <Text style={tw`text-[#fff] font-bold text-sm ml-1.5`}>Autorizar</Text>
                                            </TouchableOpacity>
                                    }
                                    {
                                        permisos.btn_confirmar
                                        &&
                                            <TouchableOpacity 
                                                onPress={() => setInitialState({...initialState, visibleConfirmar: !visibleConfirmar})}
                                                style={tw`flex-row h-10 bg-[${Blue}] rounded-lg self-stretch w-[100%] items-center justify-center absolute top-35 right-5`}>
                                                <Icon name={'unlock'} size={22} color={'#fff'} />
                                                <Text style={tw`text-[#fff] font-bold text-sm ml-1.5`}>Confirmación de Seguridad</Text>
                                            </TouchableOpacity>
                                    }

                                    <View style={tw`flex-row h-10 rounded-lg self-stretch w-[100%] items-center justify-center absolute bottom-${!permisos.btn_responder && !permisos.btn_autorizar && !permisos.btn_confirmar ? 15 : 10} right-5`}>
                                        <Image
                                            style={tw`h-8 w-8`}
                                            resizeMode={'contain'}
                                            source={require('../../../../../assets/logo_telat.png')}
                                        />
                                        <Text style={tw`font-bold text-base text-[#000] ml-2`}>Telat Group<Text style={tw`font-normal`}> © {`${getCurrentDate().substring(0,4)}`}</Text></Text>
                                    </View>
                                </View>
                        </ScrollView>
                    </View>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                        <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientation}/>
                    </>
            }

            <Modal orientation={orientation} visibility={visibleResponsables} handleDismiss={() => setInitialState({...initialState, visibleResponsables: !visibleResponsables})}>
                <Select data={Responsables} handleActionUno={handleActionUno} />
            </Modal>


            <Modal orientation={orientation} visibility={visibleAutorizar} handleDismiss={() => setInitialState({...initialState, visibleAutorizar: !visibleAutorizar})}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={tw`h-auto self-stretch pb-2 justify-center items-center`}>
                        <Text style={tw`text-lg text-[#000] font-bold`}>Autorizar Ticket</Text>
                    </View>
                    <Text style={title}>{'Autorizar'}</Text>
                    <View style={[styles.picker, tw`justify-center items-center border border-[${closeOption !== 'SEL' ? '#CBCBCB' : '#E68AA6'}] mb-2.5 px-${isIphone ? 2 : 0}`]}>
                        <Picker
                            style={pickerStyle}
                            value={closeOption}
                            onValueChange={(itemValue, itemIndex) => handleActionTres(itemValue, itemIndex)}
                            items={closeOptions}
                            placeholder={{}}
                        />
                    </View>
                    <Text style={title}>{'Mensaje'}</Text>
                    <MultiTextEditable handleInputChange={(e) => setInitialState({...initialState, mensaje: e})}/>
                    <Camera savePicture={(nombre_imagen, encryptedImage, imagen) => setInitialState({...initialState, nombre_imagen: nombre_imagen, encryptedImage: encryptedImage, imagen: imagen})} reload={reload} imagen={imagen}/>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => setInitialState({...initialState, visibleAutorizar: !visibleAutorizar, closeOption: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})} style={tw`flex-1 h-10 bg-[#f7f7f7] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'times'} size={22} color={'#000'} />
                            <Text style={tw`text-base font-bold text-[#000] ml-3`}>Cancelar</Text>
                        </TouchableOpacity>
                        <View style={{width: 6}}></View>
                        <TouchableOpacity onPress={() => handleAutorizar()} style={tw`flex-1 h-10 bg-[${Blue}] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'check'} size={20} color={'#fff'} />
                            <Text style={tw`text-base font-bold text-[#fff] ml-3`}>Autorizar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>

            <Modal orientation={orientation} visibility={visibleConfirmar} handleDismiss={() => setInitialState({...initialState, visibleConfirmar: !visibleConfirmar})}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={tw`h-auto self-stretch pb-2 justify-center items-center`}>
                        <Text style={tw`text-lg text-[#000] font-bold`}>Confirmación de Seguridad</Text>
                    </View>
                    <Text style={title}>{'Mensaje'}</Text>
                    <MultiTextEditable handleInputChange={(e) => setInitialState({...initialState, mensaje: e})}/>
                    <Camera savePicture={(nombre_imagen, encryptedImage, imagen) => setInitialState({...initialState, nombre_imagen: nombre_imagen, encryptedImage: encryptedImage, imagen: imagen})} reload={reload} imagen={imagen}/>
                    <View style={tw`flex-row`}>
                        <TouchableOpacity onPress={() => setInitialState({...initialState, visibleConfirmar: !visibleConfirmar, imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})} style={tw`flex-1 h-10 bg-[#f7f7f7] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'times'} size={22} color={'#000'} />
                            <Text style={tw`text-base font-bold text-[#000] ml-3`}>Cancelar</Text>
                        </TouchableOpacity>
                        <View style={{width: 6}}></View>
                        <TouchableOpacity onPress={() => handleConfirmar()} style={tw`flex-1 h-10 bg-[${Blue}] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'unlock'} size={20} color={'#fff'} />
                            <Text style={tw`text-base font-bold text-[#fff] ml-3`}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>

            <ModalLoading visibility={loading}/>
            <Message tipo={1} visible={visibleMensaje} title={showMensaje} orientation={orientation}/>

            <Modal orientation={orientation} visibility={visibleResponder} handleDismiss={() => {
                setSelected(undefined)
                setInitialState({...initialState, visibleResponder: !visibleResponder, motivo: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})}
            }>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={tw`h-auto self-stretch pb-2 justify-center items-center`}>
                        <Text style={tw`text-lg text-[#000] font-bold`}>Respuesta/Comentario</Text>
                    </View>
                    <Text style={title}>{'Motivo'}</Text>
                    <View style={[styles.picker, tw`justify-center items-center border border-[${motivo !== 'SEL' ? '#CBCBCB' : '#E68AA6'}] mb-2.5 px-${isIphone ? 2 : 0}`]}>
                        <Picker
                            style={pickerStyle}
                            value={motivo}
                            onValueChange={(itemValue, itemIndex) => handleActionDos(itemValue, itemIndex)}
                            items={motivos}
                            placeholder={{}}
                        />
                    </View>
                    <Text style={title}>{'Mensaje'}</Text>
                    <MultiTextEditable handleInputChange={(e) => setInitialState({...initialState, mensaje: e})}/>
                    <Camera savePicture={(nombre_imagen, encryptedImage, imagen) => setInitialState({...initialState, nombre_imagen: nombre_imagen, encryptedImage: encryptedImage, imagen: imagen})} reload={reload} imagen={imagen}/>
                    {
                        motivo === 4
                        &&
                            <>
                                <Animatable.View
                                    animation='bounceIn'
                                    duration={2500}>
                                        <View style={tw`h-auto self-stretch justify-center items-center mb-1.5`}>
                                            <View style={tw`flex-row justify-center items-center`}>
                                                <Text style={tw`text-base text-center text-[${Blue}] font-bold`}>¡Califícanos!</Text>
                                                <IonIcons name={'star-half-full'} size={28} color={Blue} />
                                            </View>
                                        </View>
                                        <View style={tw`h-auto self-stretch flex-row justify-center items-center`}>
                                            <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 1 ? setSelected(1) : {}}>
                                                <IonIcons name={'emoticon-angry-outline'} size={38} color={selected === 1 ? '#dd5a43' : '#777'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 2 ? setSelected(2) : {}}>
                                                <IonIcons name={'emoticon-sad-outline'} size={38} color={selected === 2 ? '#ff892a' : '#777'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 3 ? setSelected(3) : {}}>
                                                <IonIcons name={'emoticon-neutral-outline'} size={38} color={selected === 3 ? Yellow : '#777'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 4 ? setSelected(4) : {}}>
                                                <IonIcons name={'emoticon-happy-outline'} size={38} color={selected === 4 ? '#69aa46' : '#777'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 5 ? setSelected(5) : {}}>
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
                    <View style={tw`flex-row mt-${motivo === 4 ? 5 : 0}`}>
                        <TouchableOpacity onPress={() => {
                                setSelected(undefined)
                                setInitialState({...initialState, visibleResponder: !visibleResponder, motivo: 'SEL', imagen: '', encryptedImage: '', nombre_imagen: '', mensaje: ''})
                            }}
                            style={tw`flex-1 h-10 bg-[#f7f7f7] rounded-lg justify-center items-center flex-row`}
                        >
                            <Icon name={'times'} size={22} color={'#000'} />
                            <Text style={tw`text-base font-bold text-[#000] ml-3`}>Cancelar</Text>
                        </TouchableOpacity>
                        <View style={{width: 6}}></View>
                        <TouchableOpacity onPress={() => handleAnswer()} style={tw`flex-1 h-10 bg-[${Blue}] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'paper-plane'} size={18} color={'#fff'} />
                            <Text style={tw`text-base font-bold text-[#fff] ml-3`}>Envíar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
        </>
    )
}

const container = tw`flex-1 justify-center items-center bg-[#fff] px-[${isIphone ? '5%' : '3%'}]`
const title = tw`text-sm text-[${Blue}]`
const image = tw`w-7.5 h-7.5 rounded-full`
const picker = tw`justify-center items-center border border-[#CBCBCB] px-2 flex-1`

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow:1,
    },
    div: {
        color: '#000'
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        height: 45,
        borderRadius: 4,
        paddingRight: isIphone ? 14 : 12,
        paddingLeft: isIphone ? 14 : 12,
    },
})