import React, {useState, useEffect, useRef, useCallback} from 'react'
import {View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, Image, Alert, SafeAreaView, StatusBar, Platform, RefreshControl, TouchableWithoutFeedback} from 'react-native'
import {HeaderLandscape, HeaderPortrait, Modal, Select, MultiText, ModalLoading, FailedNetwork, Title, BottomNavBar, Calendar} from '../../../../components'
import {useConnection, useNavigation} from '../../../../hooks'
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../../colors/colorsApp';
import {urlVacaciones, live, login, isIphone} from '../../../../access/requestedData';
import {useDispatch, useSelector} from 'react-redux';
import {actionTemporalVacation, actionVacation} from '../../../../slices/vacationSlice';
import {useFocusEffect} from '@react-navigation/native';
import {selectLanguageApp, selectTokenInfo, selectUserInfo} from '../../../../slices/varSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {selectOrientation} from '../../../../slices/orientationSlice';
import tw from 'twrnc';

let token = null;
let user = null;

export default ({navigation, route: {params: {id_usuario, id_empleado, solicitud_pendiente}}}) => {
    const dispatch = useDispatch()
    const refVacations = useRef()
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)

    const listRef = useRef(null)
    const [index, setIndex] = useState(0)
    const [contador, setContador] = useState(0)
    const {handlePath} = useNavigation();
    const {hasConnection, askForConnection} = useConnection();
    
    const [scrolling, setScrolling] = useState(0)
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
            initial,
            ending,
            labelInitial,
            fin: '',
            labelEnding,
            range: `${language === '1' ? 'Del' : 'From'} --/--/---- ${language === '1' ? 'hasta el' : 'to'} --/--/----`,
            motivo: '',
        },

        initialized: {
            initial,
            ending,
            labelInitial,
            labelEnding,
            fin: '',
            range: `${language === '1' ? 'Del' : 'From'} --/--/---- ${language === '1' ? 'hasta el' : 'to'} --/--/----`,
            motivo: '',
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

    const {id, info, prima_vacacional, id_periodo, currentPeriodo, periodos, solicitudes, requestVacation, details, tipo, initialized, antiguedad} = initialState
    const {dias} = details
    const {initial, ending, labelInitial, labelEnding, motivo, fin, range} = requestVacation;
    useEffect(() => {
        if(labelInitial || labelEnding) setInitialState({...initialState, requestVacation: {...requestVacation, range: `${language === '1' ? 'Del' : 'From'} ${initial ? initial.substring(8,10) : '--'}/${initial ? initial.substring(5,7) : '--'}/${initial ? initial.substring(0,4) : '----'} ${language === '1' ? 'hasta el' : 'to'} ${ending ? ending.substring(8,10) : '--'}/${ending ? ending.substring(5,7) : '--'}/${ending ? ending.substring(0,4) : '----'}`} })
    }, [initial, ending])

    useFocusEffect(
        useCallback(() => {
            handlePath('Vacation')
        }, [])
    );

    useEffect(() => {
        if(visible || deleteVisibility || detailsVisibility || editVisibility) setLoading(false)
    }, [visible, deleteVisibility, detailsVisibility, editVisibility])

    const getInformation = async () => {
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

            const request = await fetch(urlVacaciones, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body),
            });

            const {response, status} = await request.json();
            if(status === 200){
                const spt = response.info.antiguedad.split(' ')
                setInitialState({...initialState, info: response.info, antiguedad: {...antiguedad, years: spt[0], months: spt[2], days: spt[4]}, periodos: response.periodos, currentPeriodo: !currentPeriodo ? response.periodos[0].label : currentPeriodo, prima_vacacional: response.prima_vacacional, solicitudes: response.solicitud})
                setTimeout(() => {
                    setLoading(false)
                }, 800)
            }
        }catch(e){
            console.log('algo pas?? con el internet')
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
        let valor = ((fIndex+1) === solicitudes.length) ? 1 : 0
        if(valor === 1){
            console.log('entra en se va hasta el fondo')
            refVacations.current.scrollToEnd({ animated: true })
        }
        setScrolling(valor)
        setIndex(fIndex)
    }

    const handleInputChange = (e) => {
        setInitialState({...initialState, requestVacation: ({...requestVacation, motivo: e})})
    }

    const handleSave = async () => {
        if(ending !== '--/--/----'){
            const fecha_uno = new Date((initial).substring(0,4), (initial).substring(5,7), (initial).substring(8,10))
            const fecha_dos = new Date((ending).substring(0,4), (ending).substring(5,7), (ending).substring(8,10))
            if(fecha_uno <= fecha_dos){
                try{
                    setLoading(true)
                    const inicio = (initial).substring(0,4) + '-' + (initial).substring(5,7) + '-' + (initial).substring(8,10)
                    const fin = (ending).substring(0,4) + '-' + (ending).substring(5,7) + '-' + (ending).substring(8,10)
                    const body = {
                        'action': 'add_solicitud_vac',
                        'data': {
                            'id_usuario': id_usuario,
                            'id_empleado':id_empleado,
                            'language': language,
                            'motivo': motivo,
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
                
                    const {response, status} = await request.json();
                    if(status === 200){
                        setInitialState({...initialState, requestVacation: initialized, tipo: '1'})
                        setVisible(!visible)
                        setRefresh(!refresh)
                        setActionsVisibility(true)
                        setTimeout(() => {
                            setActionsVisibility(false)
                        }, 3500)
                    }
                    else {
                        Alert.alert(
                            'Error',
                            response.text,
                            [
                                { text: 'OK'}
                            ]
                        )
                        setLoading(false)
                    }
                }catch(e){
                    console.log('algo pas?? con el internet')
                    setLoading(false)
                }
            } else {
                Alert.alert(
                    'Error de selecci??n',
                    'La fecha final no puede ser menor a la de inicio',
                    [
                        { text: 'OK'}
                    ]
                )
                setLoading(false)
            }
        }
        else {
            Alert.alert(
                'Error',
                'No puedes dejar campos vac??os.',
                [
                    { text: 'OK'}
                ]
            )
            setLoading(false)
        }
    }

    const handleDelete = async () => {
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
        
            const {response, status} = await request.json();
            if(status === 200){
                setInitialState({...initialState, tipo: '3'})
                setDeleteVisibility(!deleteVisibility)
                setActionsVisibility(true)
                setTimeout(() => {
                    setActionsVisibility(false)
                }, 3500)
                setRefresh(!refresh)
            }
            else {
                Alert.alert(
                    'Error',
                    response.text,
                    [
                        { text: 'OK'}
                    ]
                )
                setLoading(false)
            }
        }catch(e){
            console.log('Algo pas?? con el internet')
            setLoading(false)
        }

    }

    const handleEdit = async () => {
        if(ending !== '--/--/----'){
            const fecha_uno = new Date((initial).substring(0,4), (initial).substring(5,7), (initial).substring(8,10))
            const fecha_dos = new Date((ending).substring(0,4), (ending).substring(5,7), (ending).substring(8,10))
            if(fecha_uno < fecha_dos){
                try{
                    setLoading(true)
                    const inicio = (initial).substring(0,4) + '-' + (initial).substring(5,7) + '-' + (initial).substring(8,10)
                    const fin = (ending).substring(0,4) + '-' + (ending).substring(5,7) + '-' + (ending).substring(8,10)
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
                
                    const {response, status} = await request.json();
                    if(status === 200){
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
                            response.text,
                            [
                                { text: 'OK'}
                            ]
                        )
                    }
                }catch(e){
                    console.log('algo pas?? con el internet')
                    setLoading(false)
                }
            } else {
                Alert.alert(
                    'Error de selecci??n',
                    'La fecha final no puede ser menor a la de inicio',
                    [
                        { text: 'OK'}
                    ]
                )
                setLoading(false)
            }
        }
        else {
            Alert.alert(
                'Campos Vac??os',
                'Campos de fecha requeridos',
                [
                    { text: 'OK'}
                ]
            )
            setLoading(false)
        }
    }

    const handleDetails = async (status) => {
        try{
            setLoading(true)
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
            
            console.log('bodyes: ', body)

            const {response, status} = await request.json();
            
            if(status === 200){
                // setActions(status)
                setTimeout(() => {
                    setLoading(false)
                    setDetailsVisibility(!detailsVisibility)
                    setInitialState({...initialState, details: ({...details, btn_aprobar: response.btn_aprobar, dias: response.dias, estatus: response.estatus, fechas: response.fechas, motivo_cancelado: response.motivo_cancelado, motivo_rechazo: response.motivo_rechazo, motivo_solicitud: response.motivo_solicitud})})
                }, 500)
            }
            else {
                Alert.alert(
                    'Error',
                    response.text,
                    [
                        { text: 'OK'}
                    ]
                )
                setLoading(false)
            }
        }catch(e){
            console.log('Algo pas?? con el internet')
            setLoading(false)
        }
    }

    const handleAprove = async (status) => {
        console.log('estatus: ', status)
        let temporal = status;
        try{
            setLoading(true)
            const body = {
                'action': 'aprobar_solicitud_vac',
                'data': {
                    'id_usuario':id_usuario,
                    'id_vacsol':id,
                    'status': temporal,
                    'motivo': motivo,
                    'language': language,
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
        
            const {response, status} = await request.json();

            if(status === 200){
                setDetailsVisibility(!detailsVisibility)
                setInitialState({...initialState, tipo: temporal === 1 ? '4' : '5'})
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
                    response.text,
                    [
                        { text: 'OK'}
                    ]
                )
                setLoading(false)
            }
        }catch(e){
            console.log('algo pas?? con el internet')
            setLoading(false)
        }
    }

    const Contenedor = ({title, leftPosition = true, hasBottomLine = true, down = true}) => {
        return (
            <View style={tw`self-stretch ${leftPosition ? 'items-start' : 'items-center'} justify-center pb-0 ml-[${hasBottomLine ? 2 : 0}]`}>
                <Text style={tw`text-sm text-[#000]`}>{title}</Text>
            </View>
        )
    }

    const Solicitudes = ({id, inicio, fin, status, dias, oculta, btn_editar, btn_delete, fIndex}) => {
        return(
            <View style={tw`bg-[#f7f7f7] shadow-md mx-1.5 my-2.5 rounded justify-center items-center py-1.5`}>
                <TouchableWithoutFeedback onPress={() => handleHideActions(id, fIndex)}>
                    <View style={{flex: 1, height: 'auto', marginHorizontal: orientation === 'PORTRAIT' ? 0 : 2.5, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginLeft: 15, marginRight: 5, backgroundColor: status === '0' ? 'rgba(51, 132, 198, 0.4)' : (status === '2' || status === '3') ? 'rgba(220, 50, 50, 0.4)' : 'rgba(95, 167, 93, 0.4)', padding: 5, paddingLeft: isIphone ? status !== '0' ? 6 : 5.5 : 5, paddingBottom: (status === '2' || status === '3') ? 6 : status === '0' ? 5.5 : 5, borderRadius: 25}}>
                                {
                                    status === '0'
                                    ?
                                        <IonIcons name={'clock-time-three'} color={Blue} size={18}/>
                                    :
                                        <Icon name={status === '2' || status === '3' ? 'times' : 'check'} size={status === '3' ? 17 : 16} color={status === '2' || status === '3' ? '#DC3232' : '#5FA75D'} />
                                }
                            </View>
                            <View style={{flex: 1, marginLeft: 10, paddingVertical: 8}}>
                                <Text style={{fontSize: 13, color: Blue}}>{language === '1' ? 'Fecha seleccionada' : 'Selected Date'}</Text>
                                <View style={tw`self-stretch items-center justify-start pb-0 ml-0 flex-row`}>
                                    <Text style={tw`text-sm text-[#000]`}>{inicio}</Text>
                                    <View style={tw`mx-1 justify-center items-center pt-${isIphone ? 0 : 0.5}`}>
                                        <IonIcons name={'arrow-right-thin'} color={'#dadada'} size={20}/>
                                    </View>
                                    <Text style={tw`text-sm text-[#000]`}>{fin}</Text>
                                </View>
                            </View>
                            <View style={{width: 'auto', paddingHorizontal: 10}}>
                                <Text style={{fontSize: 13, color: Blue}}>{language === '1' ? 'D??as' : 'Days'}</Text>
                                <View style={tw`justify-center items-center`}>
                                    <Text style={tw`text-sm text-[#000]`}>{dias}</Text>
                                </View>
                            </View>
                        </View>
                        {
                            !oculta
                            &&
                                <View style={{flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: 10}}>
                                    <View style={{flex: 1}}>
                                        <TouchableOpacity onPress={() => handleDetails(status)} style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#74A9C4', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
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
                                                        <TouchableOpacity onPress={() => setEditVisibility(!editVisibility)} style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C3E5C4', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
                                                            <Icon name={'pencil'} size={22} color={'#000'} />
                                                            <Text style={{fontSize: 14, color: '#000', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Editar' : 'Edit'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{width: 6}}></View>
                                                    <View style={{flex: 1}}>
                                                        <TouchableOpacity onPress={() => setDeleteVisibility(!deleteVisibility)} 
                                                        style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DC4D4D', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
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
            <View style={tw`flex-row border-t border-t-[#dadada] flex-1`}>
                <View style={tw`w-[20%] h-auto p-4 justify-center items-center`}>
                    <Text style={tw`font-bold text-sm text-[#000]`}>{id}</Text>
                </View>
                <View style={tw`flex-1 h-auto justify-center`}>
                    <Text style={tw`text-sm text-[#000]`}>{dia}</Text>
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
            <View style={tw`bg-[#fff] flex-1`}>
                <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
                {
                    orientation === 'PORTRAIT'
                    ?
                        <HeaderPortrait title={language === '1' ? 'Detalle de Vacaciones' : 'Vacation Detail'} screenToGoBack={'Vacation'} navigation={navigation} visible={true} />
                    :
                        <HeaderLandscape title={language === '1' ? 'Detalle de Vacaciones' : 'Vacation Detail'} screenToGoBack={'Vacation'} navigation={navigation} visible={true} />
                }
                    <ScrollView
                        ref={refVacations}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        onContentSizeChange={() => scrolling !== 0 ? refVacations.current.scrollToEnd({ animated: true }) : {}}
                        style={tw`self-stretch bg-white`}
                        refreshControl={
                            <RefreshControl
                                progressBackgroundColor={'#EC5C25'}
                                colors={['#fff']}
                                refreshing={false}
                                onRefresh={() => getInformation()}
                            />
                        }
                    >
                        <View style={[container, tw`pb-[${isIphone ? 6 : 0}]`]}>
                            <View style={tw`h-auto self-stretch py-1.5`}>
                                <Title title={language === '1' ? 'INFORMACI??N DEL EMPLEADO' : 'EMPLOYEE INFORMATION'} icon={'info'} tipo={1} hasBottom={false}/>
                            </View>
                            <View style={tw`h-auto self-stretch p-2.5 bg-[#fff] shadow-md rounded-2xl mx-1.5`}>
                                <View style={tw`flex-row items-center h-6 justify-center items-center`}>
                                    <View style={tw`h-auto flex-1 flex-row bg-[#fff] justify-center items-center`}>
                                        <View style={tw`w-auto h-6 justify-center items-center bg-[${Blue}] px-1.5 rounded-md`}>
                                            <Text style={tw`text-xs font-bold text-[#fff]`}>{info.num_empleado}</Text>
                                        </View>
                                        <View style={tw`flex-1 h-6 ml-1 px-2 justify-center items-center bg-[#000] rounded-md`}>
                                            <Text style={tw`text-xs font-bold text-[#fff]`}>{info.nombre}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={tw`h-auto self-stretch justify-center items-center mt-1.5`}>
                                    <Text style={tw`text-base font-bold text-[${Blue}]`}>{info.puesto}</Text>
                                </View>
                                
                                <View style={tw`flex-row`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-1.5`}>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={title}>{language === '1' ? '??rea' : 'Area'}</Text>
                                                <Contenedor title={info.area} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={tw`flex-row self-stretch justify-start items-start`}>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={title}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Admission'}</Text>
                                                <Contenedor title={info.fecha_ingreso} hasBottomLine={false} down={false}/>
                                            </View>
                                            <View style={tw`w-1.5`}></View>
                                            <View style={tw`flex-1.5`}>
                                                <Text style={title}>{language === '1' ? 'Antiguedad' : 'Antiquity'}</Text>
                                                <Contenedor title={`${antiguedad.years} ${antiguedad.years === '1' ? 'A??o,' : 'A??os,'} ${antiguedad.months} ${antiguedad.months === '1' ? 'Mes,' : 'Meses,'} ${antiguedad.days} ${antiguedad.days === '1' ? 'D??a' : 'D??as'}`} hasBottomLine={false} down={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={tw`h-auto self-stretch mt-6`}>
                                <TouchableOpacity style={[picker, tw`shadow-md`, {height: 45, flexDirection: 'row', marginHorizontal: 6}]} onPress={() => handleVisiblePeriodos()}>
                                    <View style={tw`flex-1 justify-center items-center`}>
                                        <Text style={tw`text-[#000]`}>{currentPeriodo}</Text>
                                    </View>
                                    <View style={tw`w-auto`}>
                                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                    </View>
                                </TouchableOpacity>
                                <View style={tw`h-auto mb-2.5`}>
                                    <View style={tw`flex-row self-stretch justify-center items-center`}>
                                        <View style={tw`flex-2 justify-center items-center p-1`}>
                                            <Text style={[title]}>{language === '1' ? 'PV N??mina' : 'Date of Entry'}</Text>
                                            <Contenedor title={prima_vacacional.fecha_pago} hasBottomLine={false} leftPosition={false} down={false}/>
                                        </View>
                                        <View style={tw`flex-1 justify-center items-center p-1`}>
                                            <Text style={title}>{language === '1' ? 'A??os' : 'Years'}</Text>
                                            <Contenedor title={prima_vacacional.years} hasBottomLine={false} leftPosition={false} down={false}/>
                                        </View>
                                        <View style={tw`flex-2 justify-center items-center p-1`}>
                                            <Text style={title}>{language === '1' ? 'Estado' : 'State'}</Text>
                                            <View style={tw`flex-row`}>
                                                <Icon name={prima_vacacional.pay === 1 ? 'check' : 'times'} size={20} color={prima_vacacional.pay === 1 ? '#5FA75D' : '#DF4740'} />
                                                <View style={tw`w-1`} />
                                                <Contenedor title={prima_vacacional.estatus} hasBottomLine={false} leftPosition={false} down={false}/>
                                            </View>
                                            
                                        </View>
                                    </View>
                                    {
                                        orientation === 'PORTRAIT'
                                        ?
                                            <View style={tw`h-auto self-stretch flex-row mt-1.5`}>
                                                <View style={tw`flex-1 justify-center items-center`}>
                                                    <View style={legends}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>DC</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.dias_correspondientes}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={tw`flex-1 justify-center items-center`}>
                                                    <View style={legends}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>DD</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.dias_disfrutados}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={tw`flex-1 justify-center items-center`}>
                                                    <View style={[legends, {backgroundColor: '#BFCCE7'}]}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>DP</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.dias_pendientes}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={tw`flex-1 justify-center items-center`}>
                                                    <View style={[legends, {backgroundColor: '#E5E2D2'}]}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>PA</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.dias_periodos_anterior}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={tw`flex-1 justify-center items-center`}>
                                                    <View style={[legends, {backgroundColor: '#C3E5C4'}]}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>TD</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.total_dias}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        :
                                            <View style={tw`h-auto self-stretch justify-center items-center mt-1.5`}>
                                                <View style={tw`flex-1 justify-center items-center flex-row`}>
                                                    <View style={[legends, tw`mr-2.5`]}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>DC</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.dias_correspondientes}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[legends, tw`mr-2.5`]}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>DD</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.dias_disfrutados}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[legends, tw`bg-[#BFCCE7] mr-2.5`]}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>DP</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.dias_pendientes}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[legends, tw`bg-[#E5E2D2] mr-2.5`]}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>PA</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.dias_periodos_anterior}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[legends, tw`bg-[#C3E5C4] mr-2.5`]}>
                                                        <View style={headerLegend}>
                                                            <Text style={tw`text-xs text-[#000]`}>TD</Text>
                                                        </View>
                                                        <View style={subHeaderLegend}>
                                                            <Text style={tw`text-2xl font-bold text-[#000]`}>{prima_vacacional.total_dias}</Text>
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
                                    <TouchableOpacity style={tw`flex-row h-auto justify-center items-center mb-2.5 bg-[${Blue}] py-2 mx-1.5 rounded-lg self-stretch shadow-md`} onPress={() => setVisible(!visible)}>
                                        <IonIcons name={'calendar-plus'} size={26} color={'#fff'} />
                                        <Text style={tw`text-lg text-[#fff] ml-3 font-bold`}>{language === '1' ? 'Solicitar Vacaciones' : 'Request Vacation'}</Text>
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
                                        style={list}
                                        data={solicitudes}
                                        numColumns={1}
                                        renderItem={({item, index: fIndex}) => <Solicitudes id={item.id} status={item.status} inicio={item.inicio} fin={item.fin} dias={item.dias} oculta={item.oculta} btn_editar={item.btn_editar} btn_delete={item.btn_delete} fIndex={fIndex}/>}
                                        keyExtractor={item => String(item.id)}
                                        key={'_'}
                                    />
                                :
                                    !loading
                                    &&
                                        <View style={tw`flex-1 justify-center items-center mt-[${info.btn_solicitud ? 6.5 : 12.5}]`}>
                                            <Image
                                                style={tw`w-30 h-30`}
                                                resizeMode={'stretch'}
                                                source={require('../../../../../assets/calendary.gif')}
                                            />
                                        </View>
                            }
                            <View style={tw`mb-[3%]`} />
                        </View>
                </ScrollView>

                <Modal orientation={orientation} visibility={visiblePeriodo} handleDismiss={handleVisiblePeriodos}>
                    <Select data={periodos} handleVisiblePeriodos={handleVisiblePeriodos} handleActionUno={handleActionUno} />
                </Modal>

                <Modal orientation={orientation} visibility={visible} handleDismiss={() => setVisible(!visible)}>
                    <ScrollView
                        style={tw`self-stretch`}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <Title title={language === '1' ? 'SOLICITAR VACACIONES' : 'REQUEST VACATION'} icon={'calendar'} tipo={1} itCloses={() => {
                            setVisible(!visible)
                            setInitialState({...initialState, requestVacation: initialized})   
                        }} vertical={false}/>
                        <View style={tw`flex-row self-stretch h-auto pt-2`}>
                            <Calendar dateLabel={labelInitial} isModule={true} shortFormat={false} getValue={(value, label) => setInitialState({...initialState, requestVacation: {...requestVacation, initial: value, labelInitial: label}})} language={language} marginBottom={false} />
                            <View style={tw`w-1.5`}></View>
                            <Calendar dateLabel={labelEnding} isModule={true} shortFormat={false} getValue={(value, label) => setInitialState({...initialState, requestVacation: {...requestVacation, ending: value, labelEnding: label}})} language={language} marginBottom={false}/>
                        </View>
                        <View style={tw`px-px mt-2.5`}>
                            <View style={tw`h-auto self-stretch`}>
                                <TextInput 
                                    editable={false}
                                    value={range}
                                    style={[picker, tw`text-center text-sm text-[#adadad] bg-[#f7f7f7] ios:pb-1.5`, {height: 45}]}
                                />
                            </View>
                            <MultiText 
                                placeholder={language === '1' ? 'Especifique el motivo de su solicitud de vacaciones en caso que lo crea necesario' : 'Specify the reason for your vacation request if you think it is necessary.'}
                                value={motivo}
                                onChangeText={(e) => handleInputChange(e)}
                                multiline={true}
                                numberOfLines={5}
                                fontSize={16}
                            />
                        </View>
                        <View style={tw`h-auto mb-2 p-4 self-stretch bg-[rgba(50,131,197,.1)] rounded-lg mt-4`}>
                            <View style={tw`flex-row justify-center items-center`}>
                                <Icon name={'info'} size={24} color={Blue} />
                                <View style={tw`flex-1`}>
                                    <Text style={[{fontSize: 16}, tw`ml-4 text-[${Blue}]`]}>{language === '1' ? 'Podr?? hacer su solicitud de vacaciones siempre y cuando:' : 'You will be able to make your vacation request as long as:'}</Text>
                                </View>
                            </View>
                            <View style={tw`flex-row justify-center items-center mt-1.5`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[{fontSize: 16}, tw`text-base text-[${Blue}]`]}>{language === '1' ? '1- Tenga d??as disponibles (Se tomaran primero los d??as que tenga pendientes de otro periodo).' : '1- Have available days (Days pending from another period will be taken first).'}</Text>
                                </View>
                            </View>
                            
                            <View style={tw`flex-row justify-center items-center mt-1.5`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[{fontSize: 16}, tw`text-base text-[${Blue}]`]}>{language === '1' ? '2- En caso de no tener d??as disponibles solo se podr?? adelantar un 50% de los d??as del siguiente per??odo y no antes de 6 meses.' : '2- If there are no days available, only 50% of the days of the following period may be advanced and not earlier than 6 months.'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={tw`flex-row h-auto self-stretch`}>
                            <View style={tw`flex-1`}>
                                <TouchableOpacity onPress={() => {
                                    setVisible(!visible)
                                    setInitialState({...initialState, requestVacation: initialized})
                                }} 
                                    style={tw`flex-row h-auto justify-center items-center mt-2.5 bg-[#f7f7f7] py-1.5 px-5 rounded-lg`}>
                                    <Icon name={'times'} size={22} color={'#000'} />
                                    <Text style={tw`text-sm text-[#000] ml-1.5 font-bold`}>{language === '1' ? 'Cerrar' : 'Close'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={tw`w-1.5`}></View>
                            <View style={tw`flex-1`}>
                                <TouchableOpacity onPress={() => handleSave()} 
                                    style={tw`flex-row h-auto justify-center items-center mt-2.5 bg-[${Blue}] py-1.5 px-5 rounded-lg`}>
                                    <IonIcons name={'content-save'} size={22} color={'#fff'} />
                                    <Text style={tw`text-sm text-[#fff] ml-1.5 font-bold`}>{language === '1' ? 'Guardar' : 'Save'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                
                <Modal orientation={orientation} visibility={detailsVisibility} handleDismiss={() => setDetailsVisibility(!detailsVisibility)}>
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                        <Title title={language === '1' ? 'D??AS SOLICITADOS' : 'REQUESTED DAYS'} icon={'calendar'} tipo={1} itCloses={() => setDetailsVisibility(!detailsVisibility)} hasBottom={false} vertical={false}/>
                        <View style={tw`h-auto self-stretch justify-center items-center`}>
                            <View style={tw`justify-center items-start px-2 pb-2 self-stretch`}>
                                <Text style={tw`text-base font-bold text-[#000]`}>{language === '1' ? 'D??as de Vacaciones Solicitados' : 'Vacation Days Requested'}</Text>
                                <View style={tw`flex-row items-center`}>
                                    <Text style={tw`text-[#000]`}>{language === '1' ? 'Fecha: ' : 'Date: '} </Text>
                                    <View style={tw`bg-[#C3E5C4] rounded p-1 px-1.5`}>
                                        <Text style={tw`text-[#000] text-sm font-bold`}>{details.fechas}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={tw`flex-row bg-[#f7f7f7]`} onPress={() => setInitialState({...initialState, areLegendsHiden: !areLegendsHiden})}>
                            <View style={tw`w-[20%] h-auto p-4 justify-center items-center`}>
                                <Text style={tw`font-bold text-base text-[#000]`}>No.</Text>
                            </View>
                            <View style={tw`flex-1 h-auto justify-center`}>
                                <Text style={tw`font-bold text-base text-[#000]`}>{language === '1' ? 'D??as Solicitados' : 'Requested Days'}</Text>
                            </View>
                        </View>
                        {
                            dias
                            &&
                                dias.map(x => <Dias id={x.id} dia={x.dia}/>)
                        }
                        {
                            details.motivo_solicitud || details.motivo_cancelado || details.motivo_rechazo
                            ?
                                <View style={tw`h-auto mt-2 mb-1 p-2 self-stretch bg-[${(details.estatus === '0' || details.estatus === '1') ? 'rgba(50,131,197,.1)' : 'rgba(220,50,50,.1)'}] rounded-lg`}>
                                    <View style={tw`flex-row items-center`}>
                                        <Text style={tw`text-[${(details.estatus === '0' || details.estatus === '1') ? Blue : '#DC3232'}] font-bold text-base`}>{`${language === '1' ? 'Motivo: ' : 'Reason: '}`}<Text style={tw`font-normal`}>{(details.estatus === '0' || details.estatus === '1') ? details.motivo_solicitud : details.estatus === '2' ? details.motivo_rechazo : details.motivo_cancelado}</Text></Text>
                                    </View>
                                </View>
                            :
                                <></>
                        }
                        
                        {
                            
                            !hideReason && details.btn_aprobar && solicitud_pendiente
                            &&
                                <View style={tw`flex-row mb-[${hideReason ? 4 : 0}] mt-2`}>
                                    <TouchableOpacity
                                        style={tw`h-10 bg-[#DC4D4D] rounded-lg flex-1 items-center justify-center flex-row`}
                                        onPress={() => setHideReason(!hideReason)}
                                    >
                                        <Icon name={'times'} size={22} color={'#fff'} />

                                        <Text style={tw`text-base text-[#fff] ml-3 font-bold`}>{language === '1' ? 'NO aprobar' : 'No approve'}</Text>
                                    </TouchableOpacity>
                                    
                                    <View style={tw`w-1.5`}></View>
                                    <TouchableOpacity
                                        style={tw`h-10 bg-[${Blue}] rounded-lg flex-1 items-center justify-center flex-row`}
                                        onPress={() => handleAprove(1)}
                                    >
                                        <Icon name={'check'} size={22} color={'#fff'} />
                                        <Text style={tw`text-base text-[#fff] ml-3 font-bold`}>{language === '1' ? 'Aprobar' : 'Approve'}</Text>
                                    </TouchableOpacity>
                                </View>
                        }
                        {
                            hideReason && solicitud_pendiente
                            &&   
                                <>
                                    <View style={tw`p-1 mt-2.5`}>
                                        <Text style={[title, tw`text-base`]}>Motivo del rechazo de la solicitud</Text>
                                    </View>
                                    <MultiText 
                                        placeholder={language === '1' ? 'Especifique el motivo de su solicitud de vacaciones en caso que lo crea necesario' : 'Specify the reason for your vacation request if you think it is necessary.'}
                                        value={motivo}
                                        onChangeText={(e) => handleInputChange(e)}
                                        multiline={true}
                                        numberOfLines={5}
                                    />
                                    <View style={tw`flex-row mt-4`}>
                                        <TouchableOpacity
                                            style={tw`h-10 bg-[#f7f7f7] rounded-lg flex-1 items-center justify-center flex-row`}
                                            onPress={() => setHideReason(!hideReason)}
                                        >
                                            <Icon name={'times'} size={22} color={'#000'} />
                                            <Text style={tw`text-base text-[#000] ml-3 font-bold`}>{language === '1' ? 'Cancelar' : 'Cancel'}</Text>
                                        </TouchableOpacity>
                                        <View style={tw`w-1.5`}></View>
                                        <TouchableOpacity
                                            style={tw`h-10 bg-[${Blue}] rounded-lg flex-1 items-center justify-center flex-row`}
                                            onPress={() => handleAprove(0)}
                                        >
                                            <Icon name={'paper-plane'} size={20} color={'#fff'} />
                                            <Text style={tw`text-base text-[#fff] ml-3 font-bold`}>{language === '1' ? 'Enviar' : 'Send'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                        }
                    </KeyboardAwareScrollView>
                </Modal>
                
                <Modal orientation={orientation} visibility={deleteVisibility} handleDismiss={() => setDeleteVisibility(!deleteVisibility)}>
                    <View style={tw`justify-center items-center self-stretch h-50`}>
                        <Image
                            style={tw`w-35 h-35`}
                            resizeMode='stretch'
                            source={require('../../../../../assets/error.gif')}
                        />
                    </View>
                    <View style={tw`justify-center items-center`}>
                        <Text style={tw`font-bold text-2xl text-[#000]`}>??Esta seguro de continuar?</Text>
                        <Text style={tw`text-base text-[#000]`}>Este cambio no se puede revertir</Text>
                    </View>
                    <View style={tw`flex-row mt-5 mb-2.5`}>
                        <TouchableOpacity onPress={() => setDeleteVisibility(!deleteVisibility)} style={tw`flex-1 h-10 bg-[#f7f7f7] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'times'} size={22} color={'#000'} />
                            <Text style={tw`text-base font-bold text-[#000] ml-3`}>Cancelar</Text>
                        </TouchableOpacity>
                        <View style={tw`w-1.5`}></View>
                        <TouchableOpacity onPress={() => handleDelete()} style={tw`flex-1 h-10 bg-[#DF4740] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'trash'} size={22} color={'#fff'} />
                            <Text style={tw`text-base font-bold text-[#fff] ml-3`}>S??</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal orientation={orientation} visibility={actionsVisibility} handleDismiss={() => setActionsVisibility(!actionsVisibility)}>
                    <View style={tw`justify-center items-center self-stretch h-50`}>
                        <Image
                            style={tw`w-35 h-35`}
                            resizeMode='stretch'
                            source={require('../../../../../assets/correct.gif')}
                        />
                    </View>
                    <View style={tw`h-auto justify-center items-center p-4`}>
                        <Text style={tw`font-bold text-2xl text-center`}>{tipo === '1' ? '??Se registr?? la solicitud correctamente!' : tipo === '2' ? '??Se modific?? la solicitud correctamente!' : tipo === '4' ? '!Se ha aprobado correctamente la solicitud!' : tipo === '5' ? '??La solicitud fue rechazada correctamente!' : '??Se elimin?? la solicitud correctamente!'}</Text>
                    </View>
                </Modal>

                <Modal orientation={orientation} visibility={editVisibility} handleDismiss={() => setEditVisibility(!editVisibility)}>
                    <Title title={language === '1' ? 'EDITAR VACACIONES' : 'EDIT VACATION'} icon={'calendar'} tipo={1} vertical={false} itCloses={() => setEditVisibility(!editVisibility)}/>
                    <View style={tw`flex-row self-stretch h-16.5 pt-2`}>
                        <Calendar dateLabel={labelInitial} isModule={true} shortFormat={false} getValue={(value, label) => setInitialState({...initialState, requestVacation: {...requestVacation, initial: value, labelInitial: label}})} language={language} />
                        <View style={tw`w-1.5`}></View>
                        <Calendar dateLabel={labelEnding} isModule={true} shortFormat={false} getValue={(value, label) => setInitialState({...initialState, requestVacation: {...requestVacation, ending: value, labelEnding: label}})} language={language} />
                    </View>
                    <View style={tw`h-auto self-stretch`}>
                        <TextInput
                            editable={false}
                            value={range}
                            style={[picker, tw`text-center text-sm text-[#adadad] bg-[#f7f7f7]`, {height: 45}]}
                        />
                    </View>
                    <View style={tw`flex-row`}>
                        <TouchableOpacity onPress={() => {
                            setEditVisibility(!editVisibility)
                            setInitialState({...initialState, requestVacation: initialized})
                        }}
                            style={tw`flex-1 h-10 bg-[#f7f7f7] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'times'} size={22} color={'#000'} />
                            <Text style={tw`text-base text-[#000] ml-3 font-bold`}>Cancelar</Text>
                        </TouchableOpacity>
                        <View style={tw`w-1.5`}></View>
                        <TouchableOpacity onPress={() => handleEdit()} style={tw`flex-1 h-10 bg-[${Blue}] rounded-lg justify-center items-center flex-row`}>
                            <Icon name={'pencil'} size={22} color={'#fff'} />
                            <Text style={tw`text-base font-bold text-[#fff] ml-3`}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                
                <ModalLoading visibility={loading} />
                {/* <BottomNavBar navigation={navigation} language={language} orientation={orientation}/> */}
            </View>
        :
            <>
                <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			    <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientation}/>
            </>
    )
}

const title = tw`text-sm text-[${Blue}]`
const container = tw`flex-1 justify-center items-center bg-[#fff] px-[${isIphone ? '5%' : '3%'}]`
const headerLegend = tw`h-5 self-stretch justify-end items-center`
const subHeaderLegend = tw`flex-1 self-stretch justify-center items-center pb-1.5`
const legends = tw`h-16.5 w-13.5 bg-[#f7f7f7] rounded-xl justify-center items-center shadow-md `
const picker = tw`justify-center items-center rounded-2xl mb-2.5 h-11.5 px-4 bg-white`
const list = tw`h-auto self-stretch`