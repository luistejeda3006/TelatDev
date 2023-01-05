import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, Dimensions, SafeAreaView, StatusBar, Alert, RefreshControl, Platform} from 'react-native';
import {HeaderPortrait, ModalLoading, Modal, MultiSelect, FailedNetwork, HeaderLandscape, Select, Title, RadioButton, CheckBox, BottomNavBar} from '../../../components';
import {getCurrentDate} from '../../../js/dates'
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useConnection, useNavigation, useOrientation, useScroll} from '../../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {LineChart, BarChart, PieChart} from 'react-native-chart-kit';
import {isIphone, live, login, urlReportes} from '../../../access/requestedData';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectTokenInfo, selectUserInfo} from '../../../slices/varSlice';
import tw from 'twrnc';

let keyUserInfo = 'userInfo';
let keyTokenInfo = 'tokenInfo';
let token = null;
let user = null;
let temporal = null;
let id_usuario = null;
let cuenta = 0;
let longitud = 0;

export default ({navigation, route: {params: {orientation}}}) => {
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)

    const {isTablet} = DeviceInfo;
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    
    const [contador, setContador] = useState(0);
    const [loadingContent, setLoadingContent] = useState(true)
    
    const [currentQuincena, setCurrentQuincena] = useState(null)
    const [currentArea, setCurrentArea] = useState('')
    const [currentSubarea, setCurrentSubarea] = useState('')

    const [visiblePeriodo, setVisiblePeriodo] = useState(false);
    const [visibleArea, setVisibleArea] = useState(false);
    const [visibleSubarea, setVisibleSubarea] = useState(false);

    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)
    
    const getUserInfo = () => {
        id_usuario = user.data.datos_personales.id_usuario
    }

    useEffect(() => {
        getUserInfo()
    },[])

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );
    

    const [areasGeneral, setAreasGeneral] = useState({
        total: 0,
        total_razon_social: [],
        data_grafico: [],
        subareas: [],
        id_subarea: false,
    })

    const [dataGraficoSubarea, setDataGraficoSubarea] = useState([])
    const [mesInicialUno, setMesInicialUno] = useState((parseInt(getCurrentDate().substring(5,7)) - 1).toString())
    const [mesInicialDos, setMesInicialDos] = useState((parseInt(getCurrentDate().substring(5,7)) - 2).toString())
    const [yearsPickerUno, setYearsPickerUno] = useState([])
    const [yearsPickerDos, setYearsPickerDos] = useState([])
    
    const [meses, setMeses] = useState([
        {id: '1', name: 'Enero', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '1' ? true : false},
        {id: '2', name: 'Febrero', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '2' ? true : false},
        {id: '3', name: 'Marzo', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '3' ? true : false},
        {id: '4', name: 'Abril', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '4' ? true : false},
        {id: '5', name: 'Mayo', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '5' ? true : false},
        {id: '6', name: 'Junio', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '6' ? true : false},
        {id: '7', name: 'Julio', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '7' ? true : false},
        {id: '8', name: 'Agosto', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '8' ? true : false},
        {id: '9', name: 'Septiembre', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '9' ? true : false},
        {id: '10', name: 'Octubre', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '10' ? true : false},
        {id: '11', name: 'Noviembre', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '11' ? true : false},
        {id: '12', name: 'Diciembre', selected: (parseInt(getCurrentDate().substring(5,7)) - 1).toString() === '0' ? true : false},
    ])
    const found_1 = meses.find(x => x.selected && x)
    const [years, setYears] = useState([]);
    const [month, setMonth] = useState([found_1.id])
    const [count, setCount] = useState(meses.filter(x => x.selected && x).length)
    const [mesesDos, setMesesDos] = useState([
        {id: '1', name: 'Enero', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '1' ? true : false},
        {id: '2', name: 'Febrero', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '2' ? true : false},
        {id: '3', name: 'Marzo', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '3' ? true : false},
        {id: '4', name: 'Abril', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '4' ? true : false},
        {id: '5', name: 'Mayo', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '5' ? true : false},
        {id: '6', name: 'Junio', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '6' ? true : false},
        {id: '7', name: 'Julio', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '7' ? true : false},
        {id: '8', name: 'Agosto', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '8' ? true : false},
        {id: '9', name: 'Septiembre', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '9' ? true : false},
        {id: '10', name: 'Octubre', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '10' ? true : false},
        {id: '11', name: 'Noviembre', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '-1' ? true : false},
        {id: '12', name: 'Diciembre', selected: (parseInt(getCurrentDate().substring(5,7)) - 2).toString() === '0' ? true : false},
    ])

    const [yearUno, setYearUno] = useState(found_1.id === '12' ? (parseInt(getCurrentDate().substring(0,4)) - 1).toString() : getCurrentDate().substring(0,4));
    const found_2 = mesesDos.find(x => x.selected && x)
    const [yearDos, setYearDos] = useState((found_2.id === '11' || found_2.id === '12') ? (parseInt(getCurrentDate().substring(0,4)) - 1).toString() : getCurrentDate().substring(0,4));
    const [monthDos, setMonthDos] = useState([found_2.id])
    const [countDos, setCountDos] = useState(mesesDos.filter(x => x.selected && x).length)
    const [dataGraficaUno, setDataGraficoUno] = useState([])
    const [dataGraficaDos, setDataGraficoDos] = useState([])
    const [initialState, setInitialState] = useState({
        loading: true,
        id_periodo: false,
        id_year: '',
        tiempo_real: {},
        periodos: [],
        altas_bajas_irp: [],
        training: {},
        altas_bajas_quincenas: {},
        altas_grafico: [],
        bajas_grafico: [],
        motivo_bajas_value: [],
        legends_motivo_baja: [],
        detalle_altas: [],
        detalle_bajas: [],
        training_categorias: [],
        training_grafico: [],
        empleados_ubicacion: [],
        edificios: [],
        empleados_areas: [],
        empleados_razon_social: [],
        body_1:[],
        body_2:[],
        body_1_master: [],
        body_2_master: [],
        altas: false,
        bajas: false,
        last: '',
        section: 1,
        headers_1: [
            {id: 1, title: 'Campaña'},
            {id: 2, title: 'Ola'},
            {id: 4, title: 'Next'},
        ],
        headers_2: [
            {id: 5, title: 'Back'},
            {id: 6, title: 'Altas'},
            {id: 7, title: 'Bajas'},
            {id: 8, title: 'Activos'},
        ],
        headers_3: [
            {id: 11, title: 'Back'},
            {id: 10, title: 'Supervisor'},
        ],
        hearder_all: [
            {id: 1, title: 'Campaña'},
            {id: 2, title: 'Ola'},
            {id: 6, title: 'Altas'},
            {id: 7, title: 'Bajas'},
            {id: 8, title: 'Activos'},
        ],
        body_horizontal: [],
        empleados: [
            {id: 1, name: 'Operaciones', data: [30,20,40], edificio: 'Presa Salinillas'},
            {id: 2, name: 'Admin y Finanzas', data: [47,90,117], edificio: 'Presa Salinillas'},
            {id: 3, name: 'Operaciones', data: [13,59,280], edificio: 'Presa Salinillas'},
        ],
        lines: 
        [
            {
                'data': [0, 0, 0, '', '', 5],
            },
            {
                'data': [null, null, null, null, null, null],
                color: () => 'transparent'
            }
        ],
        años: [getCurrentDate().substring(0,4)],
        data_años: [],
        content: false,
        showList: false,
        areas: [],
        id_area: '1',
        title: '',
        hide: true,
        hideTraining: true,
        legends: [],
        data :[
            {value: 1, label: 'PERIODO 1'},
            {value: 2, label: 'PERIODO 2'},
            {value: 3, label: 'PERIODO 3'},
            {value: 4, label: 'PERIODO 4'}, 
            {value: 5, label: 'PERIODO 5'},
            {value: 6, label: 'PERIODO 6'},
            {value: 7, label: 'PERIODO 7'},
            {value: 8, label: 'PERIODO 8'},
        ],
        legendsIRP: [],
        legendsGraphicIRP: [],
        generalIRP: [],
        dataIRP: [],
    })

    
    const {
        loading,
        id_periodo,
        altas,
        bajas,
        tiempo_real,
        periodos,
        altas_bajas_irp,
        training,
        altas_bajas_quincenas,
        altas_grafico,
        bajas_grafico,
        motivo_bajas_value,
        legends_motivo_baja,
        detalle_altas,
        detalle_bajas,
        training_categorias,
        training_grafico,
        empleados_ubicacion,
        edificios,
        empleados_areas,
        empleados_razon_social,
        body_1,
        body_2,
        body_1_master,
        body_2_master,
        section,
        headers_1,
        headers_2,
        headers_3,
        hearder_all,
        body_horizontal,
        body_horizontal_master,
        last,
        lines,
        años,
        data_años,
        content,
        areas,
        id_area,
        title,
        legends,
        legendsGraphicIRP,
        legendsIRP,
        generalIRP,
        dataIRP
    } = initialState

    const {total_razon_social, data_grafico, total, subareas, id_subarea} = areasGeneral;

    const language = '1';

    const handleVisiblePeriodos = () => {
        setVisiblePeriodo(!visiblePeriodo)
    }

    const handleActionUno = useCallback((value, label) => {
        setInitialState({...initialState, id_periodo: value, tipo: 1})
        setCurrentQuincena(label)
    })

    const handleVisibleArea = useCallback(() => {
        setVisibleArea(!visibleArea)
    })

    const handleActionDos = useCallback((value, label) => {
        let seleccionado = areas.find(x => x.value === value && x)
        setInitialState({...initialState, id_area: value, title: seleccionado.label, tipo: 2})
        setCurrentArea(label)
    })

    const handleVisibleSubarea = () => {
        setVisibleSubarea(!visibleSubarea)
    }

    const handleActionTres = useCallback((value, label) => {
        setAreasGeneral({...areasGeneral, id_subarea: value})
        setCurrentSubarea(label)
    })

    const reloading = useCallback(() => {
        setLoadingContent(true)
    })

    const handleAddElement = useCallback((element, id) => {
        let arr = [String(id)]
        let exists = month.find(x => x === String(id) && x)

        if(!exists) {
            let meseses = [...month, ...arr];
            setCount(meseses.length)
            setMonth(meseses)
            let selected = meses.map(x => x.name === element ? ({...x, selected: !x.selected}) : x)
            setMeses(selected)
            temporal = id;
        }

        else {
            if(month.length >= 2){
                if(month.length >= 3){
                    let ordenado = month.sort((a,b) => a-b)
                    const primero = parseInt(ordenado[0]);
                    const ultimo = parseInt(ordenado[ordenado.length - 1]);
    
                    if(parseInt(id) > primero && parseInt(id) < ultimo){
                        Alert.alert(
                            'Mes inválido',
                            'No puedes deseleccionar meses intermedios',
                            [
                                { text: 'OK'}
                            ]
                        )
                    }
                    
                    else {
                        let nuevos = month.filter(x => x !== String(id) && x)
                        setMonth(nuevos)
                        setCount(nuevos.length)
                        let selected = meses.map(x => x.name === element ? ({...x, selected: !x.selected}) : x)
                        setMeses(selected)
                        temporal = id;
                    }
                }
                else {
                    let nuevos = month.filter(x => x !== String(id) && x)
                    setMonth(nuevos)
                    setCount(nuevos.length)
                    let selected = meses.map(x => x.name === element ? ({...x, selected: !x.selected}) : x)
                    setMeses(selected)
                    temporal = id;
                }
            }
            else {
                // console.log('Debe tener seleccionado al menos 1 mes')
            }
        }  
    })

    const handleAddElementDos = useCallback((element, id) => {
        let arr = [String(id)]
        let exists = monthDos.find(x => x === String(id) && x)
        if(!exists) {
            let meses = [...monthDos, ...arr];
            setCountDos(meses.length)
            setMonthDos(meses)
            let selected = mesesDos.map(x => x.name === element ? ({...x, selected: !x.selected}) : x)
            setMesesDos(selected)
            temporal = id;
        }

        else {
            if(monthDos.length >= 2){
                if(monthDos.length >= 3){
                    let ordenado = monthDos.sort((a,b) => a-b)
                    const primero = parseInt(ordenado[0]);
                    const ultimo = parseInt(ordenado[ordenado.length - 1]);
    
                    if(parseInt(id) > primero && parseInt(id) < ultimo){
                        Alert.alert(
                            'Mes inválido',
                            'No puedes deseleccionar meses intermedios',
                            [
                                {text: 'OK'}
                            ]
                        )
                    }
                    
                    else {
                        let nuevos = monthDos.filter(x => x !== String(id) && x)
                        setMonthDos(nuevos)
                        setCountDos(nuevos.length)
                        let selected = mesesDos.map(x => x.name === element ? ({...x, selected: !x.selected}) : x)
                        setMesesDos(selected)
                        temporal = id;
                    }
                }
                else {
                    let nuevos = monthDos.filter(x => x !== String(id) && x)
                    setMonthDos(nuevos)
                    setCountDos(nuevos.length)
                    let selected = mesesDos.map(x => x.name === element ? ({...x, selected: !x.selected}) : x)
                    setMesesDos(selected)
                    temporal = id;
                }
            }
            else {
                // console.log('Debe tener seleccionado al menos 1 mes')
            }
        }
    })

	const data_altas_bajas_irp = {
        legendFontSize: 8,
		labels: ['Altas %', 'Bajas %', 'IRP %'],
		datasets: [
			{
                data: altas_bajas_irp,
				colors: [
                    () => '#2CA02C',
					() => '#FF0000',
					() => '#808B96',
				],
			},
		],
	};

	const data_modal = {
		legendFontSize: 8,
		datasets: [
			{
				data: motivo_bajas_value,
				colors: [
					() => '#1F77B4',
					() => '#FF7F0E',
					() => '#2CA02C',
					() => '#FF0000',
					() => '#9467BD',
					() => '#FF6347',
					() => '#C71585',
					() => '#4169FF',
					() => '#800000',
					() => '#008080',
				],
			},
		],
	};

    const getInformation = async () => {
        if(cuenta === 0){
            setInitialState({...initialState, loading: true})
            cuenta = cuenta + 1;
        }
        try{
            const body = {
                'action': 'get_estadisticos',
                'data': {
                    'id_usuario': id_usuario,
                },
                'live': live,
                'login': login,
            }

            const request = await fetch(urlReportes, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });

            const {response, status} = await request.json();
            if(status === 200){
                const body = {
                    'action': 'get_altas_bajas',
                    'data': {
                        'id_periodo': id_periodo,
                        'is_phone': !isTablet() ? 1 : 2,
                        'id_usuario': id_usuario,
                    },
                    'live': live,
                    'login': login
                }

                const request = await fetch(urlReportes, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(body)
                });
                const {response: respuestita} = await request.json();
                let obj = {
                    empleados_periodo: respuestita.altas_bajas_quincena.empleados_periodo,
                    activos_semana_ant: respuestita.altas_bajas_quincena.activos_semana_ant,
                    altas: respuestita.altas_bajas_quincena.altas,
                    altas_porcentaje: respuestita.altas_bajas_quincena.altas_porcentaje,
                    bajas: respuestita.altas_bajas_quincena.bajas,
                    bajas_porcentaje: respuestita.altas_bajas_quincena.bajas_porcentaje,
                    irp_porcentaje: respuestita.altas_bajas_quincena.irp_porcentaje,
                }

                const bodys = {
                    'action': 'get_irp',
                    'data': {
                        'years': [getCurrentDate().substring(0,4)],
                        'id_usuario': id_usuario,
                    },
                    'live': live,

                    'login': login
                }

                const requestion = await fetch(urlReportes, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(bodys)
                });
                
                const {response: res} = await requestion.json();
                let finGeneral = []
                let add_color = []
                let add_color_2 = []
                let add_color_general = []
                let fin = []

                add_color_general = res.data.map((x,i,a) => ({data: x.data, color: () => x.color, id: i}))
                const odi = [
                    {
                        'data': [null, null, null, null, null, null],
                        color: () => 'transparent',
                        id: add_color_general.length + 1
                    }
                ]
                finGeneral = [...add_color_general, ...odi]
                
                const finito = [
                    finGeneral[add_color_general.length - 1],
                    finGeneral[add_color_general.length],
                ]

                const legendsColor = res.data.map((x,i,a) => ({id: i, year: x.year, color: x.color, visible: getCurrentDate().substring(0,4) === String(x.year) ? true : false}))
                console.log('legendsColor: ', legendsColor)
                add_color_2 = {...res.data[res.data.length - 1], color: () => res.data[res.data.length - 1].color}
                fin = [...add_color, ...odi]

                longitud = (res.legends_index.length) + 1
                setInitialState({...initialState, 
                    loading: false,
                    tiempo_real: response.inf_tiempo_real,
                    periodos: respuestita.periodos,
                    altas_bajas_quincenas: obj,
                    altas_bajas_irp: respuestita.data_altas_bajas_irp,
                    altas_grafico: respuestita.altas_grafico,
                    bajas_grafico: respuestita.bajas_grafico,
                    motivo_bajas_value: respuestita.motivo_bajas_value,
                    legends_motivo_baja: respuestita.colores_motivo_baja,
                    detalle_altas: respuestita.detalle_altas,
                    detalle_bajas: respuestita.detalle_bajas,
                    training: response.training.data,
                    training_grafico: response.training.data_grafico,
                    training_categorias: response.training.categorias_grafico,
                    empleados_ubicacion: response.empleados_ubicacion,
                    empleados_razon_social: response.empleados_razon_social,
                    edificios: response.edificios,
                    empleados_areas: response.empleados_areas,
                    body_1: response.training.body_1,
                    body_2: response.training.body_2,
                    body_1_master: response.training.body_1,
                    body_2_master: response.training.body_2,
                    data_años: fin,
                    areas: response.areas,
                    title: response.areas[0].label,
                    content: true,
                    legendsIRP: res.legends_index,
                    generalIRP: finGeneral,
                    dataIRP: finito,
                    legendsGraphicIRP: legendsColor,
                    body_horizontal: response.training.body_horizontal,
                    body_horizontal_master: response.training.body_horizontal,
                })

                //información con redux, nada más llegar acomodar y hacer que ya no cargue,  unica recarga con refresh control

                setCurrentQuincena(!currentQuincena ? respuestita.periodos[0].label : currentQuincena)
                setCurrentArea(response.areas[0].label)
                setLoadingContent(false)
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
            setInitialState({...initialState, loading: false})
        }
    }

    useEffect(() => {
        getInformation()
    },[id_periodo, años, contador, hasConnection])

    const getYears = async () => {
        try{
            const body = {
                'action': 'get_years',
                'data': {
                    'years': años,
                    'id_usuario': id_usuario,
                },
                'live': live,
                'login': login
            }
            
    
            const request = await fetch(urlReportes, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            const {response} = await request.json();
            const es_1 = found_1.id === '12' ? (parseInt(getCurrentDate().substring(0,4)) - 1).toString() : getCurrentDate().substring(0,4)
            const es_2 = (found_2.id === '11' || found_2.id === '12') ? (parseInt(getCurrentDate().substring(0,4)) - 1).toString() : getCurrentDate().substring(0,4)
    
            let n_1 = response.map(x => String(x.year) === es_1 ? ({'id': x.id, 'name': String(x.year), 'selected': true}) : ({'id': x.id, 'name': String(x.year), 'selected': false}))
            let n_2 = response.map(x => String(x.year) === es_2 ? ({'id': x.id, 'name': String(x.year), 'selected': true}) : ({'id': x.id, 'name': String(x.year), 'selected': false}))
            setYears(response.years)
            setYearsPickerUno(n_1)
            setYearsPickerDos(n_2)
        }catch(e){
            console.log('algo pasó con el internet')
            setLoadingContent(false)
            setInitialState({...initialState, loading: false})
        }
    }

    useEffect(() => {
        getYears()
    },[años, hasConnection])

    const getEmpleadoSubarea = async () => {
        try{
            const body = {
                'action': 'empleados_subarea',
                'data': {
                    'id_area':id_area,
                    'idioma': language,
                    'is_phone': !isTablet() ? 1 : 2,
                    'id_usuario': id_usuario,
                },
                'live': live,
                'login': login
            }

            const request = await fetch(urlReportes, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            
            const {response, status} = await request.json();
            console.log('response: ', response)
            if(status === 200){
                const data = response.data_grafico.map(x => x.name === '--PRESA SALINILLAS' ? ({...x, name: '--SALINILLAS'}) : x.name === '--CIUDAD JUAREZ' ? ({...x, name: '--JUAREZ'}) : x)
                setAreasGeneral({...areasGeneral, total_razon_social: response.empleados_razon_social, data_grafico: data, total: response.total, subareas: response.subareas})
                setInitialState({...initialState, loading: false})
                const nuevita = response.data_grafico_subarea.map(x => x.name === '--PRESA SALINILLAS' ? ({...x, name: '--SALINILLAS'}) : x.name === '--CIUDAD JUAREZ' ? ({...x, name: '--JUAREZ'}) : x)
                setDataGraficoSubarea(nuevita)
                setCurrentSubarea(response.subareas[0].label)
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
                await AsyncStorage.removeItem(keyUserInfo)
                await AsyncStorage.removeItem(keyTokenInfo)
                navigation.navigate('AuthLogin')
            }
        }catch(e){
            console.log('algo pasó con el internet')
            setLoadingContent(false)
            setInitialState({...initialState, loading: false})
        }
    }

    useEffect(() => {
        getEmpleadoSubarea()
    },[id_area, hasConnection])

    const getDetalleEmpleadoSubarea = async () => {
        setInitialState({...initialState, loading: true})
        try{
            const body = {
                'action': 'detalle_empleados_subarea',
                'data': {
                    'id_area': id_area,
                    'id_subarea': id_subarea,
                    'is_phone': !isTablet() ? 1 : 2,
                    'id_usuario': id_usuario,
                },
                'live': live,
                'login': login
            }

            const request = await fetch(urlReportes, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            const {response, status} = await request.json();
            if(status === 200){
                const data = response.map(x => x.name === '--PRESA SALINILLAS' ? ({...x, name: '--SALINILLAS'}) : x.name === '--CIUDAD JUAREZ' ? ({...x, name: '--JUAREZ'}) : x)
                setDataGraficoSubarea(data)
                setInitialState({...initialState, loading: false})
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
                await AsyncStorage.removeItem(keyUserInfo)
                await AsyncStorage.removeItem(keyTokenInfo)
                navigation.navigate('AuthLogin')
            }
        }catch(e){
            console.log('algo pasó con el internet')
            setLoadingContent(false)
            setInitialState({...initialState, loading: false})
        }
    }

    useEffect(() => {
        getDetalleEmpleadoSubarea()
    },[id_subarea, hasConnection])

    const getComparativasUno = async () => {
        try{
            const body = {
                'action': 'graficas_comparativas1',
                'data': {
                    'year': yearUno,
                    'meses':month,
                    'id_usuario': id_usuario,
                },
                'live': live,
                'login': login
            }
    
            const request = await fetch(urlReportes, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            const {response} = await request.json();
            if(response.length > 0){
                setDataGraficoUno(response)
            }
            
            else {
                month.length > 1
                &&
                    Alert.alert(
                        'Mes inválido',
                        'Debes elegir un mes adyacente al seleccionado',
                        [
                            { text: 'OK'}
                        ]
                    )
                
                if(mesInicialUno !== temporal){
                    if(month.length > 0){
                        let mostrados = meses.map(x => x.id === temporal ? ({...x, selected: !x.selected}) : x)
                        let nuevo = month.filter(x => x !== temporal && x)
                        setMonth(nuevo)
                        setMeses(mostrados)
                        setCount(count - 1)
                    }
                    else {
                        console.log('segundo else')
                    }
                }
                else {
                    console.log('primer else')
                }
            }
            
        }catch(e){
            console.log('algo pasó con el internet')
            setLoadingContent(false)
            setInitialState({...initialState, loading: false})
        }
    }

    useEffect(() => {
        getComparativasUno()
    },[month, yearUno, orientationInfo.initial, hasConnection])

    const getComparativasDos = async () => {
        try{
            const body = {
                'action': 'graficas_comparativas2',
                'data': {
                    'year': yearDos,
                    'meses':monthDos,
                    'id_usuario': id_usuario,
                },
                'live': live,
                'login': login
            }
    
            const request = await fetch(urlReportes, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            const {response} = await request.json();
            if(response.length > 0){
                setDataGraficoDos(response)
            }
            
            else {
                monthDos.length > 1
                &&
                    Alert.alert(
                        'Mes inválido',
                        'Debes elegir un mes adyacente al seleccionado',
                        [
                            { text: 'OK'}
                        ]
                    )
    
                if(mesInicialDos !== temporal){
                    if(monthDos.length > 0){
                        let mostrados = mesesDos.map(x => x.id === temporal ? ({...x, selected: !x.selected}) : x)
                        let nuevo = monthDos.filter(x => x !== temporal && x)
                        setMonthDos(nuevo)
                        setMesesDos(mostrados)
                        setCountDos(countDos - 1)
                    }
                    else {
                        console.log('segundo else')
                    }
                }
                else {
                    console.log('primer else')
                }
            }
            
        }catch(e){
            console.log('algo pasó con el internet')
            setLoadingContent(false)
            setInitialState({...initialState, loading: false})
        }
    }

    useEffect(() => {
        getComparativasDos()
    },[monthDos, yearDos, hasConnection])

    const data_grafica_comparativa_uno = {
        legendFontSize: 8,
		labels: ['Altas', 'Bajas', 'IRP %'],
		datasets: [
			{
                data: dataGraficaUno,
				colors: [
                    () => '#2CA02C',
					() => '#FF0000',
					() => '#808B96',
				],
			},
		],
	};


    const data_grafica_comparativa_dos = {
        legendFontSize: 8,
		labels: ['Altas', 'Bajas', 'IRP %'],
		datasets: [
			{
                data: dataGraficaDos,
				colors: [
                    () => '#2CA02C',
					() => '#FF0000',
					() => '#808B96',
				],
			},
		],
	};


    const handleSelectedYear = useCallback((year, checked) => {
        const conteo = legendsIRP.filter(x => x.checked)
        if(conteo.length === 1 && conteo[0].year === year){
            console.log('no le permito deseleccionar')
        } else {
            //esto es para las puras leyendas de los checkbox
            const nuevos = legendsIRP.map(x => String(x.year) === String(year) ? ({...x, checked: !x.checked}) : x)
            //esto es para las leyendas de la grafica, si existe ya en el arreglo la quitamos, si no la agregamos
            const legend = legendsGraphicIRP.find(x => String(x.year) === String(year) && x.visible)
            let legends = null
            let nuevaData = []
            let comun = []
            const search = nuevos.find(x => String(x.year) === String(year))
            console.log('legend: ', legend)
            if(legend){
                console.log('entra en ya exisste')
                comun = legendsGraphicIRP.map(x => String(x.year) === String(year) ? ({...x, visible: false}) : x)
                legends = legendsGraphicIRP.filter(x => String(x.year) !== String(year))
                nuevaData = dataIRP.filter(x => String(x.id) !== String(search.id) && String(x.id) !== String(longitud))
            } else {
                comun = legendsGraphicIRP.map(x => String(x.year) === String(year) ? ({...x, visible: true}) : x)
                legends = [...legendsGraphicIRP, String(year)]
                nuevaData = generalIRP.find(x => x.id === search.id)
                nuevaData = [...dataIRP, nuevaData]
                nuevaData = nuevaData.sort((a, b) => a.id > b.id)
            }

            const ordenadas = legends.sort()
            
            setInitialState({...initialState, legendsIRP: nuevos, legendsGraphicIRP: comun, dataIRP: nuevaData})
        }
    })

    const Motivo = ({legend, color, tipo = 1}) => {
        return(
            <View style={tw`h-auto flex-1 flex-row justify-center items-center py-1`}>
                <View style={tw`flex-1 flex-row justify-${tipo === 1 ? 'start' : 'center'} items-center`}>
                    <View style={tw`w-4 h-4 bg-[${color}] rounded-3xl`} />
                    <View style={tw`w-1`} />
                    <Text style={tw`text-${tipo === 2 ? 'sm' : 'xs'}`}>{legend}</Text>
                </View>
            </View>
        )
    }

    const Detalle_Gerencia = ({id, campanna, altas = null, activos = null, bajas = null, monterrey = null, insurgentes = null, salinillas = null, juarez = null, home = null, total, tipo = 1}) => {
        return(
            <View style={tw`flex-1 h-auto mb-3.5 mx-1.5 shadow-md border border-[#adadad] rounded-2xl overflow-hidden`}>
                <View style={tw`h-auto p-px bg-white`}>
                    <View style={tw`flex-row items-center justify-center`}>
                        {
                            tipo === 1
                            ?
                                <>
                                    <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-2 py-0.5 mr-1.5`}>
                                        <Text style={tw`text-base font-bold text-[#fff]`}>{total}</Text>
                                    </View>
                                    <Text style={tw`font-bold text-xs text-[#000]`}>{campanna}</Text>
                                </>
                            :
                                <Text style={tw`text-xs text-[#000] font-bold`}>{campanna}</Text>
                        }
                    </View>
                </View>
                {
                    tipo === 1
                    ?
                        <View style={tw`h-auto self-stretch flex-row`}>
                            <View style={tw`flex-1 bg-[#1f77b4] h-6 justify-center items-center`}>
                                <Text style={tw`text-base font-bold text-[#fff]`}>{monterrey}</Text>
                            </View>
                            <View style={tw`flex-1 bg-[#2ca02c] h-6 justify-center items-center`}>
                                <Text style={tw`text-base font-bold text-[#fff]`}>{insurgentes}</Text>
                            </View>
                            <View style={tw`flex-1 bg-[#ff7f0e] h-6 justify-center items-center`}>
                                <Text style={tw`text-base font-bold text-[#fff]`}>{salinillas}</Text>
                            </View>
                            <View style={tw`flex-1 bg-[#808b96] h-6 justify-center items-center`}>
                                <Text style={tw`text-base font-bold text-[#fff]`}>{juarez}</Text>
                            </View>
                            <View style={tw`flex-1 bg-[#ff0000] h-6 justify-center items-center`}>
                                <Text style={tw`text-base font-bold text-[#fff]`}>{home}</Text>
                            </View>
                        </View>
                    :
                        <View style={tw`h-auto self-stretch flex-row`}>
                            <View style={tw`flex-1 bg-[${Blue}] h-6 justify-center items-center rounded-bl-2xl`}>
                                <Text style={[{fontSize: 10}, tw`font-bold text-[#fff]`]}>{altas}</Text>
                            </View>
                            <View style={tw`flex-1 bg-[#2ca02c] h-6 justify-center items-center`}>
                                <Text style={[{fontSize: 10}, tw`font-bold text-[#fff]`]}>{activos}</Text>
                            </View>
                            <View style={tw`flex-1 bg-[#ff0000] h-6 justify-center items-center rounded-br-2xl`}>
                                <Text style={[{fontSize: 10}, tw`font-bold text-[#fff]`]}>{bajas}</Text>
                            </View>
                        </View>
                }
            </View>
        )
    }

    const handleChangeYearUno = (year) => {
        if(hasConnection){
            let nuevos = yearsPickerUno.map(x => x.name === year ? ({...x, selected: true}) : ({...x, selected: false}))
            setYearUno(year)
            setYearsPickerUno(nuevos);
        }
    }

    const handleChangeYearDos = useCallback((year) => {
        let nuevos = yearsPickerDos.map(x => x.name === year ? ({...x, selected: true}) : ({...x, selected: false}))
        setYearDos(year)
        setYearsPickerDos(nuevos);
    })

    const YearsPickerUno = ({name, selected}) => {
        return(
            <RadioButton checked={selected} handleCheck={() => handleChangeYearUno(name)} legend={name} width={1}/>
        )
    }

    const YearsPickerDos = ({name, selected}) => {
        return(
            <RadioButton checked={selected} handleCheck={() => handleChangeYearDos(name)} legend={name} width={1}/>
        )
    }

    const Empleados_Ubicacion = ({name, color, total}) => {
        return(
            <View style={[box, tw`m-1.5 mx-2 pl-1.5 pr-0`]}>
                <View style={tw`w-auto justify-center items-center`}>
                    <Icon name={'building'} size={24} color={color} />
                </View>
                <View style={tw`flex-1 justify-center items-center`}>
                    <View style={tw`justify-start pl-1.5 flex-row h-[100%]`}>
                        <View style={tw`flex-1 justify-center items-start`}>
                            <Text style={tw`text-xs text-[#000]`}>{name}</Text>
                        </View>
                        <View style={tw`w-10 justify-center items-center bg-[#f7f7f7] rounded-tr-2xl rounded-br-2xl border-l border-[#dadada]`}>
                            <Text style={tw`font-bold text-[#000]`}>{total}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const Empleados_Razon_Social = ({name, total}) => {
        return(
            <View style={[box, tw`pr-0 m-2 mx-2.5`]}>
                <View style={tw`w-auto justify-center items-center pl-1`}>
                    <IonIcons name={'account-group'} size={34} color={Blue} />
                </View>
                <View style={tw`flex-1 justify-center items-center`}>
                    <View style={tw`justify-start pl-2 flex-row h-[100%]`}>
                        <View style={tw`flex-1 justify-center items-start`}>
                            <Text style={tw`text-sm text-[#000]`}>{name}</Text>
                        </View>
                        <View style={tw`w-10 bg-[#f7f7f7] justify-center items-center border-l border-l-[#cbcbcb] rounded-tr-2xl rounded-br-2xl`}>
                            <Text style={tw`font-bold text-[#000]`}>{total}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const Header = () => {
        return(
            <>
                <Title title={language === '1' ? 'Detalle de Bajas' : 'Detail of Retirements'} icon={'chart-bar-stacked'} tipo={2} vertical={false} itCloses={() => setInitialState({...initialState, bajas: !bajas})}/>
                <View style={tw`h-auto self-stretch justify-center items-center`}>
                    <View style={tw`h-auto self-stretch bg-[#f7f7f7] border border-[#CBCBCB] border-t border-l border-r justify-center items-center flex-row py-1.5 rounded-tl-2xl rounded-tr-2xl`}>
                        <IonIcons name={'menu'} size={28} color={Blue} />
                        <View style={tw`w-1`} />
                        <Text style={tw`text-[${Blue}] text-xl`}>{language === '1' ? 'Bajas por Subárea' : ''}</Text>
                    </View>
                </View>
                <View style={tw`h-auto self-stretch justify-center items-center`}>
                    {
                        detalle_bajas.length > 0
                        &&
                            detalle_bajas.map(x => 
                                <View key={x.id} style={tw`h-auto self-stretch bg-[#fff] border border-[#cbcbcb] border-t border-b justify-center items-center flex-row p-1`}>
                                    <View style={tw`flex-1 px-2`}>
                                        <Text style={tw`text-[${Blue}]`}>{x.name}</Text>
                                    </View>
                                    <View style={tw`w-${x.total.toString().length === 2 ? 'auto' : 6.5} bg-[${Blue}] justify-center items-center rounded-lg px-1`}>
                                        <Text style={tw`text-base font-bold text-[#fff]`}>{x.total}</Text>
                                    </View>
                                </View>
                            )
                    
                    }
                </View>
                <View style={tw`h-auto self-stretch mb-5 bg-[#f7f7f7] border border-[#CBCBCB] justify-center items-center flex-row p-1 rounded-bl-2xl rounded-br-2xl`}>
                    <View style={tw`flex-1 px-2`}>
                        <Text style={tw`text-[${Blue}] font-bold`}>{language === '1' ? 'Total General' : ''}</Text>
                    </View>
                    <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-2 py-0.5`}>
                        <Text style={tw`text-base font-bold text-[#fff]`}>{altas_bajas_quincenas.bajas && altas_bajas_quincenas.bajas}</Text>
                    </View>
                </View>

                <Title title={'Motivos de Baja'} icon={'chart-line'} tipo={2} vertical={false}/>

                <View style={tw`h-auto justify-center items-center`}>
                    <BarChart
                        withVerticalLabels={false}
                        segments={3}
                        withInnerLines={true}
                        showBarTops={false}
                        showValuesOnTopOfBars={true}
                        fromZero={true}
                        withCustomBarColorFromData={true}
                        flatColor={true}
                        data={data_modal}
                        width={Dimensions.get('screen').width}
                        height={200}
                        chartConfig={{
                            backgroundColor: '#e26a00',
                            propsForLabels: {
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#fff',
                                padding: 0,
                                margin: 0,
                                height: 'auto'
                            },
                            backgroundGradientFrom: '#fff',
                            decimalPlaces: 0,
                            backgroundGradientTo: '#fff',
                            color: (opacity = 1) => '#000',
                            labelColor: (opacity = 1) => `#000`,
                            style: {
                                borderRadius: 50,
                                margin: 0,
                                padding: 0,
                                backgroundColor: 'red'
                                }
                            }}
                    />
                </View>
            </>
        )
    }

    const handleRightSection = useCallback(() => {
        let actual = section === 1 ? 2 : section === 2 ? 3 : 1;
        setInitialState({...initialState, section: actual})
    })

    const handleLeftSection = useCallback(() => {
        let actual = section === 3 ? 2 : section === 2 && 1;
        setInitialState({...initialState, section: actual})
    })

    const handleChangeVisibility = async (title) => {
        try{
            if(title === last){
                setInitialState({...initialState, body_1: body_1_master, body_2: body_2_master, body_horizontal: body_horizontal_master, last: ''})
            }
            else {
                setInitialState({...initialState, loading: false})
                const body = {
                    'action': 'get_tabla_training',
                    'data': {
                        'name_campanna':title,
                        'id_usuario': id_usuario,
                    },
                    'live': live,
                    'login': login
                }
        
                const request = await fetch(urlReportes, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                    body: JSON.stringify(body)
                });
                
                const {response, status} = await request.json();
                if(status === 200){
                    setInitialState({...initialState, body_1: response.body_1, body_2: response.body_2, last: title, body_horizontal: response.body_horizontal, loading: false})
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
                    await AsyncStorage.removeItem(keyUserInfo)
                    await AsyncStorage.removeItem(keyTokenInfo)
                    navigation.navigate('AuthLogin')
                }
            }
        }catch(e){
            console.log('algo pasó con el internet')
            setLoadingContent(false)
            setInitialState({...initialState, loading: false})
        }
    }

    const HeaderTable_uno = ({title}) => {
        return(
            title === 'Next'
            ?
                <TouchableOpacity style={{height: 45, backgroundColor: 'rgba(50,131,197,.1)', width: 'auto', padding: 5, justifyContent: 'center', alignItems: 'center',  borderTopColor: Blue, borderTopWidth: .5, borderBottomColor: Blue, borderBottomWidth: 0.5, borderRightColor: Blue, borderRightWidth: 0.5}} onPress={() => handleRightSection()}>
                    <Icon name={'chevron-right'} size={24} color={Blue} />
                </TouchableOpacity>
            :
                title === 'Back'
                ?
                    <TouchableOpacity style={{height: 45, backgroundColor: 'rgba(50,131,197,.1)', width: 'auto', padding: 5, justifyContent: 'center', alignItems: 'center',  borderTopColor: Blue, borderTopWidth: .5, borderBottomWidth: 0, borderLeftColor: Blue, borderLeftWidth: .5, borderBottomColor: Blue}} onPress={() => handleLeftSection()} >
                        <Icon name={'chevron-left'} size={24} color={Blue} />
                    </TouchableOpacity>
                :
                    <View style={{height: 45, backgroundColor: 'rgba(50,131,197,.1)', flex: 1, padding: 5, borderLeftColor: Blue, borderLeftWidth: .5, borderRightColor: Blue, borderRightWidth: .5, borderTopColor: Blue, borderTopWidth: .5, borderBottomColor: Blue, borderBottomWidth: 0.5, justifyContent: 'center'}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: Blue}}>{title}</Text>
                    </View>
        )
    }

    const BodyTable_uno = ({title, first}) => {
        return(
            title === 'right'
            ?
                <TouchableOpacity style={{height: 45, width: 'auto', padding: 5, justifyContent: 'center', alignItems: 'center', borderRightColor: Blue, borderRightWidth: 0.5, borderBottomColor: Blue, borderBottomWidth: 0.5}}>
                    <Icon name={'chevron-right'} size={24} color='#fff' />
                </TouchableOpacity>
            :
                title === '-'
                ?
                    <TouchableOpacity style={{height: 45, backgroundColor: '#fff', width: 'auto', padding: 5, justifyContent: 'center', alignItems: 'center', borderLeftColor: Blue, borderLeftWidth: .5, borderWidth: .3, borderColor: Blue}}>
                        <Icon name={'chevron-left'} size={24} color='#fff' />
                    </TouchableOpacity>
                :
                    first === 'plus'
                    ?
                        <View style={{height: 45, flex: 1, padding: 5, justifyContent: 'center', borderLeftColor: Blue, borderLeftWidth: .5, borderRightColor: Blue, borderRightWidth: .5, flexDirection: 'row', borderBottomColor: Blue, borderBottomWidth: 0.5}}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000'}}>{title === 'F' ? '-' : title}</Text>
                            </View>
                            <View style={{width: 'auto', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={() => handleChangeVisibility(title)}>
                                    <Icon name={'plus-circle'} size={24} color={Blue} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    :
                        first === 'plus_opened'
                        ?
                            <View style={{height: 45, flex: 1, padding: 5, justifyContent: 'center', borderLeftColor: Blue, borderLeftWidth: .5, borderRightColor: Blue, borderRightWidth: .5, flexDirection: 'row', borderBottomColor: Blue, borderBottomWidth: 0.5}}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000'}}>{title === 'F' ? '-' : title}</Text>
                                </View>
                                <View style={{width: 'auto', justifyContent: 'center'}}>
                                    <TouchableOpacity onPress={() =>  handleChangeVisibility(title)}>
                                        <Icon name={'minus-circle'} size={24} color={Blue} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        :
                            <View style={{height: 45, flex: 1, padding: 5, justifyContent: 'center', borderLeftColor: Blue, borderLeftWidth: .5, borderRightColor: Blue, borderRightWidth: .5, borderBottomColor: Blue, borderBottomWidth: .5}}>
                                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000'}}>{title === 'F' ? '-' : title}</Text>
                            </View>
        )
    }

    const Year = ({year, checked}) => {
        return (
            <CheckBox checked={checked} onChecked={() => handleSelectedYear(year, checked)} legend={year} fontSize={14} color={'#000'}/>
        )
    }

    const LandscapeTabletAndPhone = () => {
        return(
            <>
                <View style={tw`mt-[1.5%]`}></View>
                <Title icon={'timer-sand'} title={'Información en Tiempo Real'} tipo={2} vertical={false}/>
                <View style={tw`h-auto self-stretch`}>
                    <View style={tw`flex-row mb-4`}>
                        <Box color={Blue} title={language === '1' ? 'Empleados' : 'Empleados'} countTitle={tiempo_real.empleados && tiempo_real.empleados} iconLeft={'account'} lateral={tiempo_real.empleados_periodo_ant && tiempo_real.empleados_periodo_ant}/>
                        <Box color={'#2CA02C'} title={language === '1' ? 'Altas' : 'Altas'} countTitle={tiempo_real.altas_real && tiempo_real.altas_real} iconLeft={'account-plus'} lateral={tiempo_real.altas_real_porcentaje && `${tiempo_real.altas_real_porcentaje}%`} iconLateral={'menu-up'}/>
                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : ''} countTitle={tiempo_real.bajas_real && tiempo_real.bajas_real} iconLeft={'account-minus'} lateral={tiempo_real.bajas_real_porcentaje && `${tiempo_real.bajas_real_porcentaje}%`} iconLateral={'menu-down'}/>
                    </View>
                </View>

                <Title title={'Altas y Bajas por Quincena'} icon={'chart-line'} tipo={2} vertical={false}/>
                <TouchableOpacity style={[picker, tw`shadow-md bg-white flex-row`]} onPress={() => handleVisiblePeriodos()}>
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Text style={tw`text-[#000]`}>{currentQuincena}</Text>
                    </View>
                    <View style={tw`w-auto`}>
                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                    </View>
                </TouchableOpacity>

                <View style={tw`h-auto self-stretch`}>
                    <View style={tw`flex-row mb-4`}>
                        <Box color={Blue} title={language === '1' ? 'Empleados' : 'Empleados'} countTitle={altas_bajas_quincenas.empleados_periodo && altas_bajas_quincenas.empleados_periodo} iconLeft={'account'} lateral={altas_bajas_quincenas.activos_semana_ant && altas_bajas_quincenas.activos_semana_ant}/>
                        <Box color={'#2CA02C'} title={language === '1' ? 'Altas' : 'Altas'} countTitle={altas_bajas_quincenas.altas && altas_bajas_quincenas.altas} iconLeft={'account-plus'} lateral={altas_bajas_quincenas.altas_porcentaje && `${altas_bajas_quincenas.altas_porcentaje}%`} iconLateral={'menu-up'}/>
                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : 'Bajas'} countTitle={altas_bajas_quincenas.bajas && altas_bajas_quincenas.bajas} iconLeft={'account-minus'} lateral={altas_bajas_quincenas.bajas_porcentaje && `${altas_bajas_quincenas.bajas_porcentaje}%`} iconLateral={'menu-down'}/>
                        <Box color={'#808B96'} title={'IRP'} countTitle={altas_bajas_quincenas.irp_porcentaje && `${altas_bajas_quincenas.irp_porcentaje}%`} iconLeft={'calculator'} />
                    </View>
                </View>

                <Title title={'Altas - Bajas - IRP'} icon={'chart-bar-stacked'} tipo={2} vertical={false}/>
                <BarChart
                    segments={2}
                    withInnerLines={true}
                    xAxisSuffix='k'
                    showBarTops={false}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    withCustomBarColorFromData={true}
                    flatColor={true}
                    style={tw`h-auto`}
                    yLabelsOffset={30}
                    data={data_altas_bajas_irp}
                    width={Dimensions.get('screen').width - 25}
                    height={200}
                    chartConfig={{backgroundColor: '#e26a00',
                    propsForLabels: {
                        fontSize: 15,
                        fontWeight: 'bold'
                    },
                    backgroundGradientFrom: '#fff',
                    decimalPlaces: 0,
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => '#000',
                    labelColor: (opacity = 1) => `#000`,
                    style: {
                        borderRadius: 50,
                        margin: 0,
                        padding: 0,
                    }}}
                    verticalLabelRotation={0}
                />
                
                <View style={tw`h-auto self-stretch px-2`}>
                    <View style={tw`flex-row justify-center items-center`}>
                        <View style={tw`flex-1 justify-center items-start px-2`}>
                            <Text style={tw`font-bold text-[#000] text-lg`}>Altas</Text>
                        </View>
                        <TouchableOpacity onPress={() => setInitialState({...initialState, altas: !altas})} style={tw`h-12.5 w-auto justify-center items-center`}>
                            <View style={tw`h-auto w-auto rounded-lg p-1.5 bg-[${Blue}] justify-center items-center flex-row`}>
                                <IonIcons name={'file-document-outline'} size={20} color='#fff' />
                                <Text style={tw`font-bold text-[#fff]`}>{language === '1' ? 'Ver detalle de altas' : 'Resume'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={tw`h-auto justify-start items-start mb-4 flex-1`}>
                    <PieChart
                        paddingLeft={'0'}
                        data={altas_grafico}
                        width={Dimensions.get('window').width-50} // from react-native
                        height={180}
                        chartConfig={{
                            backgroundColor: '#EC33FF',
                            backgroundGradientFrom: '#FF5733',
                            backgroundGradientTo: '#FF5770',
                            color: () => 'yellow',
                            labelColor: () => 'black',
                        }}
                        style={tw`self-stretch justify-start items-start`}
                        accessor={'product'}
                        backgroundColor={'transparent'}
                    />
                </View>

                <View style={tw`h-auto self-stretch px-2`}>
                    <View style={tw`flex-row justify-center items-center`}>
                        <View style={tw`flex-1 justify-center items-start px-2`}>
                            <Text style={tw`font-bold text-[#000] text-lg`}>Bajas</Text>
                        </View>
                        <TouchableOpacity onPress={() => setInitialState({...initialState, bajas: !bajas})} style={tw`h-12.5 w-auto justify-center items-center`}>
                            <View style={tw`h-auto w-auto rounded-lg p-1.5 bg-[${Blue}] justify-center items-center flex-row`}>
                                <IonIcons name={'file-document-outline'} size={20} color='#fff' />
                                <Text style={tw`font-bold text-[#fff]`}>{language === '1' ? 'Ver detalle de bajas' : 'Resume'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={tw`h-auto justify-start items-start self-stretch mb-4 flex-1`}>
                    <PieChart
                        absolute={true}
                        paddingLeft={'0'}
                        data={bajas_grafico}
                        width={Dimensions.get('screen').width - 50} // from react-native
                        height={180}
                        chartConfig={{
                            propsForHorizontalLabels: {
                                color: 'red',
                                backgroundColor: 'green'
                            },
                            paddingRight: 0,
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            color: () => 'yellow',
                            labelColor: () => 'black',
                        }}
                        style={tw`flex-1 justify-start items-start bg-[#fff]`}
                        backgroundColor={'transparent'}
                        accessor={'product'}
                    />
                </View>

                <Title title={'Training'} icon={'chart-bar-stacked'} tipo={2} vertical={false}/>
                <View style={tw`h-auto self-stretch`}>
                    <View style={tw`flex-row mb-4`}>
                        <Box color={Blue} title={language === '1' ? 'Altas' : 'Altas'} countTitle={training.altas && training.altas} iconLeft={'account'} lateral={altas_bajas_quincenas.activos_semana_ant && altas_bajas_quincenas.activos_semana_ant}/>
                        <Box color={'#2CA02C'} title={language === '1' ? 'Activos' : 'Activos'} countTitle={training.activos && training.activos} iconLeft={'account-plus'} lateral={training.activos_porcentaje && `${training.activos_porcentaje}%`} iconLateral={'menu-up'}/>
                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : 'Bajas'} countTitle={training.activos && training.activos} iconLeft={'account-minus'} lateral={training.bajas_porcentaje && `${training.bajas_porcentaje}%`} iconLateral={'menu-down'}/>
                    </View>
                </View>

                <View style={tw`h-9 self-stretch px-2 bg-[rgba(50,131,197,.1)] border border-[${Blue}] justify-center items-center mx-0.5 mb-2`}>
                    <View style={tw`flex-row`}>
                        <View style={tw`w-auto justify-center`}>
                            <Icon name={'info'} size={24} color={Blue} />
                        </View>
                        <View style={tw`flex-1 justify-center px-2`}>
                            <Text style={tw`font-bold text-[${Blue}] text-lg`}>Detalles</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={[list, {marginBottom: 10}]}
                    data={training_categorias}
                    numColumns={4}
                    renderItem={({item}) => <Detalle_Gerencia id={item.id} campanna={item.campanna} altas={item.altas} activos={item.activos} bajas={item.bajas} total={item.total} tipo={2}/>}
                    keyExtractor={item => String(item.id)}
                    key={'__'}
                />
                
                <View style={tw`h-auto mb-4`}>
                    <View style={tw`h-auto self-stretch`}>
                        <FlatList
                            key={'__1'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={list}
                            data={hearder_all}
                            numColumns={5}
                            renderItem={({item}) => <HeaderTable_uno title={item.title}/>}
                            keyExtractor={item => String(item.id)}
                        />
                    </View>
                    <View style={tw`h-auto self-stretch`}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={list}
                            data={body_horizontal}
                            numColumns={5}
                            renderItem={({item}) => <BodyTable_uno title={item.fecha} first={item.first}/>}
                            keyExtractor={item => String(item.id)}
                            key={'_1'}
                        />
                    </View>
                    
                </View>

                <Title title={'Empleados por Ubicación'} icon={'building'} tipo={1} vertical={false}/>
                {
                    !isTablet()
                    ?
                        <FlatList
                            key={'__$'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={list}
                            data={empleados_ubicacion}
                            numColumns={4}
                            renderItem={({item}) => <Empleados_Ubicacion name={item.name} total={item.total} color={item.color}/>}
                            keyExtractor={item => String(item.id)}
                        />
                    :
                        <FlatList
                            key={'__$'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={list}
                            data={empleados_ubicacion}
                            numColumns={5}
                            renderItem={({item}) => <Empleados_Ubicacion name={item.name} total={item.total} color={item.color}/>}
                            keyExtractor={item => String(item.id)}
                        />

                }
                <View style={tw`mb-4`}></View>
                <Title title={'Empleados por Razón Social'} icon={'account-multiple'} tipo={2} vertical={false}/>
                {
                    !isTablet()
                    ?
                        <FlatList
                            key={'_$_'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={list}
                            data={empleados_razon_social}
                            numColumns={2}
                            renderItem={({item}) => <Empleados_Razon_Social name={item.name} total={item.total}/>}
                            keyExtractor={item => String(item.id)}
                        />
                    :
                        orientationInfo.initial === 'PORTRAIT'
                        ?
                            <FlatList
                                key={'_$_'}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={list}
                                data={empleados_razon_social}
                                numColumns={2}
                                renderItem={({item}) => <Empleados_Razon_Social name={item.name} total={item.total}/>}
                                keyExtractor={item => String(item.id)}
                            />
                        :
                            <FlatList
                                key={'_$_'}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={list}
                                data={empleados_razon_social}
                                numColumns={3}
                                renderItem={({item}) => <Empleados_Razon_Social name={item.name} total={item.total}/>}
                                keyExtractor={item => String(item.id)}
                            />
                }

                <View style={tw`mb-4`}></View>
                <Title title={title} icon={'finance'} tipo={2} vertical={false}/>
                <View style={tw`h-auto bg-[rgba(50,131,197,.1)] border border-[${Blue}] p-1 mb-2 mx-1.5`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-2 py-0.5 mr-1.5`}>
                            <Text style={tw`text-base font-bold text-[#fff]`}>{total}</Text>
                        </View>
                        <Text style={tw`font-bold text-[${Blue}] text-lg`}>Detalle de Área</Text>
                    </View>
                </View>
                <TouchableOpacity style={[picker, tw`shadow-md bg-white`, {flexDirection: 'row'}]} onPress={() => handleVisibleArea()}>
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Text style={tw`text-[#000]`}>{currentArea}</Text>
                    </View>
                    <View style={tw`w-auto`}>
                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                    </View>
                </TouchableOpacity>

                <View style={tw`flex-1 h-auto mx-0.5`}>
                    <PieChart
                        absolute={true}
                        paddingLeft={'0'}
                        data={data_grafico}
                        width={Dimensions.get('window').width-50} // from react-native
                        height={180}
                        chartConfig={{
                            backgroundColor: '#EC33FF',
                            backgroundGradientFrom: '#FF5733',
                            backgroundGradientTo: '#FF5770',
                            color: () => 'yellow',
                            labelColor: () => 'black',
                        }}
                        style={tw`self-stretch justify-start items-start`}
                        accessor={'product'}
                        backgroundColor={'transparent'}
                    />
                </View>

                <View style={tw`h-9 self-stretch px-2 bg-[rgba(50,131,197,.1)] border border-[${Blue}] justify-center items-center mb-2 mt-5 mx-1.5`}>
                    <View style={tw`flex-row`}>
                        <View style={tw`w-auto justify-center`}>
                            <Icon name={'info'} size={24} color={Blue} />
                        </View>
                        <View style={tw`flex-1 justify-center px-2`}>
                            <Text style={tw`font-bold text-[${Blue}] text-lg`}>Detalle de Subárea</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={[picker, tw`shadow-md bg-white flex-row`]} onPress={() => handleVisibleSubarea()}>
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Text style={tw`text-[#000]`}>{currentSubarea}</Text>
                    </View>
                    <View style={tw`w-auto`}>
                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                    </View>
                </TouchableOpacity>

                <PieChart
                    absolute={true}
                    paddingLeft={'0'}
                    data={dataGraficoSubarea}
                    width={Dimensions.get('window').width-50} // from react-native
                    height={180}
                    chartConfig={{
                        backgroundColor: '#EC33FF',
                        backgroundGradientFrom: '#FF5733',
                        backgroundGradientTo: '#FF5770',
                        color: () => 'yellow',
                        labelColor: () => 'black',
                    }}
                    style={tw`self-stretch justify-start items-start`}
                    accessor={'product'}
                    backgroundColor={'transparent'}
                />

                <View style={tw`h-auto self-stretch justify-center items-center mt-2 rounded-tl-2xl rounded-tr-2xl`}>
                    <View style={tw`h-auto self-stretch bg-[#f7f7f7] border-[#CBCBCB] border justify-center items-center flex-row py-0.5 rounded-tl-2xl rounded-tr-2xl`}>
                        <IonIcons name={'menu'} size={28} color={Blue} />
                        <View style={tw`w-1`} />
                        <Text style={tw`text-[${Blue}] text-base font-bold`}>Empleados por Razón Social</Text>
                    </View>
                </View>
                <View style={tw`h-auto self-stretch justify-center items-center`}>
                    {
                        total_razon_social.length > 0
                        &&
                            total_razon_social.map(x => 
                                <View key={x.id} style={tw`h-auto self-stretch bg-[#fff] border-b border-[#CBCBCB] border-l border-r justify-center items-center flex-row p-1`}>
                                    <View style={tw`flex-1 px-2`}>
                                        <Text style={tw`text-[${Blue}] text-xs`}>{x.name}</Text>
                                    </View>
                                    <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-1`}>
                                        <Text style={tw`text-base font-bold text-[#fff]`}>{x.total}</Text>
                                    </View>
                                </View>
                            )
                    }
                </View>
                <View style={tw`h-auto self-stretch bg-[#f7f7f7] border border-[#CBCBCB] justify-center items-center flex-row p-1 rounded-bl-2xl rounded-br-2xl`}>
                    <View style={tw`flex-1 px-1`}>
                        <Text style={tw`text-[${Blue}] text-sm font-bold`}>Total General</Text>
                    </View>
                    <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-2 py-0.5`}>
                        <Text style={tw`text-base font-bold text-[#fff]`}>{total}</Text>
                    </View>
                </View>

                <View style={tw`mb-4`}></View>
                <Title title={'Índice de Rotación de Personal'} icon={'finance'} tipo={2} vertical={false}/>
                <View style={tw`h-auto self-stretch mb-4`}>
                    <FlatList
                        key={'_$%_'}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={list}
                        data={legendsIRP}
                        numColumns={4}
                        renderItem={({item}) => <Year year={item.year} checked={item.checked}/>}
                        keyExtractor={item => String(item.id)}
                    />
                </View>
                <View style={tw`justify-center items-center`}>
                    {
                        content
                        ?
                            <>
                                <View style={tw`h-auto self-stretch`}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        style={list}
                                        data={legendsGraphicIRP}
                                        numColumns={4}
                                        renderItem={({item}) => 
                                            item.visible
                                            ?
                                                <View style={tw`flex-1 justify-center items-center h-auto flex-row py-2`}>
                                                    <View style={tw`w-5 h-5 rounded-full bg-[${item.color}] border border-[#dadada]`} />
                                                    <Text style={tw`ml-1.5 font-bold text-xs text-[#000]`}>{item.year}</Text>
                                                </View>
                                            :
                                                <></>    
                                        }
                                        keyExtractor={item => String(item.id)}
                                    />
                                </View>
                                <LineChart
                                    fromZero={true}
                                    style={tw`justify-center items-center`}
                                    data={{
                                        labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
                                        datasets: dataIRP,
                                        legend: [] // optional
                                    }}
                                    width={Dimensions.get('window').width - 50}
                                    yLabelsOffset={30}
                                    height={220}
                                    chartConfig={{
                                        decimalPlaces: 0,
                                        propsForLabels: {
                                            fontSize: 14,
                                            fontWeight: 'bold'
                                        },
                                        backgroundGradientFrom: '#fff',
                                        backgroundGradientTo: '#fff',
                                        color: () => '#000',
                                        labelColor: () => '#000',
                                    }}
                                />
                            </>
                        :
                            <></>
                    }
                </View>

                <View style={tw`mb-4`}></View>
                <Title title={'Gráficas Comparativas Altas-Bajas-IRP'} icon={'finance'} tipo={2} vertical={false}/>
                <View style={tw`h-auto self-stretch mb-4`}>
                    <View style={tw`h-auto self-stretch mb-2.5`}>
                        <FlatList
                            key={'_8$_'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={list}
                            data={yearsPickerUno}
                            numColumns={5}
                            renderItem={({item}) => <YearsPickerUno name={item.name} selected={item.selected}/>}
                            keyExtractor={item => String(item.id)}
                        />
                    </View>
                    <MultiSelect handleAddElement={handleAddElement} information={meses} label={count === 0 ? 'Seleccionar Meses' : `Meses seleccionados: ${count}`}/>
                </View>

                <BarChart
                    segments={2}
                    withInnerLines={true}
                    xAxisSuffix='k'
                    showBarTops={false}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    withCustomBarColorFromData={true}
                    flatColor={true}
                    style={tw`h-auto`}
                    yLabelsOffset={30}
                    data={data_grafica_comparativa_uno}
                    width={Dimensions.get('screen').width - 25}
                    height={200}
                    chartConfig={{backgroundColor: '#e26a00',
                    propsForLabels: {
                        fontSize: 15,
                        fontWeight: 'bold'
                    },
                    backgroundGradientFrom: '#fff',
                    decimalPlaces: 0,
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => '#000',
                    labelColor: (opacity = 1) => `#000`,
                    style: {
                        borderRadius: 50,
                        margin: 0,
                        padding: 0,
                    }}}
                    verticalLabelRotation={0}
                />

                <View style={tw`h-auto self-stretch px-2 pb-2 border border-[#dadada] my-4`} />

                <View style={tw`h-auto self-stretch mb-4`}>
                    <View style={tw`h-auto self-stretch mb-2.5`}>
                        <FlatList
                            key={'_$$'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={list}
                            data={yearsPickerDos}
                            numColumns={5}
                            renderItem={({item}) => <YearsPickerDos name={item.name} selected={item.selected}/>}
                            keyExtractor={item => String(item.id)}
                        />
                    </View>
                    <MultiSelect handleAddElement={handleAddElementDos} information={mesesDos} label={countDos === 0 ? 'Seleccionar Meses' : `Meses seleccionados: ${countDos}`}/>
                </View>

                <BarChart
                    segments={2}
                    withInnerLines={true}
                    xAxisSuffix='k'
                    showBarTops={false}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    withCustomBarColorFromData={true}
                    flatColor={true}
                    style={tw`h-auto`}
                    yLabelsOffset={30}
                    data={data_grafica_comparativa_dos}
                    width={Dimensions.get('screen').width - 25}
                    height={200}
                    chartConfig={{backgroundColor: '#e26a00',
                    propsForLabels: {
                        fontSize: 15,
                        fontWeight: 'bold'
                    },
                    backgroundGradientFrom: '#fff',
                    decimalPlaces: 0,
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => '#000',
                    labelColor: (opacity = 1) => `#000`,
                    style: {
                        borderRadius: 50,
                        margin: 0,
                        padding: 0,
                    }}}
                    verticalLabelRotation={0}
                />
            </>
        )
    }

    const Box = ({iconLeft, title, countTitle, lateral, iconLateral, color}) => {
        return(
            <View style={box}>
                <View style={tw`w-auto justify-center items-center`}>
                    <IonIcons name={iconLeft} size={22} color={color} />
                </View>
                <View style={tw`w-auto justify-center items-center`}>
                    <View style={tw`justify-start pl-1`}>
                        <Text style={[tw`text-base text-[${color}]`, {fontSize: 15}]}>{countTitle}</Text>
                        <Text style={[tw`text-xs text-[#000]`, {fontSize: 10}]}>{title}</Text>
                    </View>
                </View>
                <View style={tw`flex-1 justify-center items-center`}>
                    <View style={tw`flex-1 justify-center items-end self-stretch`}>
                        <Text style={[tw`text-xs text-[${color}] font-bold`, {fontSize: 10}]}>{lateral}</Text>
                    </View>
                    <View style={tw`flex-1 justify-center items-end self-stretch`}>
                        {
                            iconLateral
                            &&
                                <IonIcons name={iconLateral} size={24} color={color} />
                        }
                    </View>
                </View>
            </View>
        )
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            <View style={[container]}>
                {
                    hasConnection
                    ?
                        <>
                            {orientationInfo.initial === 'PORTRAIT'
                            ?
                                <HeaderPortrait title={'Reportes Estadísticos'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                            :
                                <HeaderLandscape title={'Reportes Estadísticos'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>}
                            
                            <ScrollView
                                /* onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}} */
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch', paddingHorizontal: orientationInfo.initial === 'PORTRAIT' ? '3%' : isIphone ? '5%' : '1.5%'}}
                            >
                                {
                                    !isTablet()
                                    ?
                                        orientationInfo.initial === 'PORTRAIT'
                                        ?
                                            <>
                                                <View style={{marginTop: '3%'}}></View>
                                                <Title icon={'timer-sand'} title={'Información en Tiempo Real'} tipo={2} vertical={false}/>
                                                <View style={tw`h-auto self-stretch`}>
                                                    <View style={tw`flex-row mb-4`}>
                                                        <Box color={Blue} title={language === '1' ? 'Empleados' : 'Empleados'} countTitle={tiempo_real.empleados && tiempo_real.empleados} iconLeft={'account'} lateral={tiempo_real.empleados_periodo_ant && tiempo_real.empleados_periodo_ant}/>
                                                        <Box color={'#2CA02C'} title={language === '1' ? 'Altas' : 'Altas'} countTitle={tiempo_real.altas_real && tiempo_real.altas_real} iconLeft={'account-plus'} lateral={tiempo_real.altas_real_porcentaje && `${tiempo_real.altas_real_porcentaje}%`} iconLateral={'menu-up'}/>
                                                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : ''} countTitle={tiempo_real.bajas_real && tiempo_real.bajas_real} iconLeft={'account-minus'} lateral={tiempo_real.bajas_real_porcentaje && `${tiempo_real.bajas_real_porcentaje}%`} iconLateral={'menu-down'}/>
                                                    </View>
                                                </View>

                                                <Title title={'Altas y Bajas por Quincena'} icon={'chart-line'} tipo={2} vertical={false}/>

                                                <TouchableOpacity style={[picker, tw`shadow-md bg-white`, {flexDirection: 'row'}]} onPress={() => handleVisiblePeriodos()}>
                                                    <View style={tw`flex-1 justify-center items-center`}>
                                                        <Text style={tw`text-[#000]`}>{currentQuincena}</Text>
                                                    </View>
                                                    <View style={tw`w-auto`}>
                                                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                                    </View>
                                                </TouchableOpacity>

                                                <View style={tw`h-auto self-stretch`}>
                                                    <View style={tw`flex-row mb-4`}>
                                                        <Box color={Blue} title={language === '1' ? 'Empleados' : 'Empleados'} countTitle={altas_bajas_quincenas.empleados_periodo && altas_bajas_quincenas.empleados_periodo} iconLeft={'account'} lateral={altas_bajas_quincenas.activos_semana_ant && altas_bajas_quincenas.activos_semana_ant}/>
                                                        <Box color={'#2CA02C'} title={language === '1' ? 'Altas' : 'Altas'} countTitle={altas_bajas_quincenas.altas && altas_bajas_quincenas.altas} iconLeft={'account-plus'} lateral={altas_bajas_quincenas.altas_porcentaje && `${altas_bajas_quincenas.altas_porcentaje}%`} iconLateral={'menu-up'}/>
                                                    </View>
                                                </View>

                                                <View style={tw`h-auto self-stretch`}>
                                                    <View style={tw`flex-row mb-4`}>
                                                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : 'Bajas'} countTitle={altas_bajas_quincenas.bajas && altas_bajas_quincenas.bajas} iconLeft={'account-minus'} lateral={altas_bajas_quincenas.bajas_porcentaje && `${altas_bajas_quincenas.bajas_porcentaje}%`} iconLateral={'menu-down'}/>
                                                        <Box color={'#808B96'} title={'IRP'} countTitle={altas_bajas_quincenas.irp_porcentaje && `${altas_bajas_quincenas.irp_porcentaje}%`} iconLeft={'calculator'} />
                                                    </View>
                                                </View>

                                                <Title title={'Altas - Bajas - IRP'} icon={'chart-bar-stacked'} tipo={2} vertical={false}/>
                                                <View style={{height:'auto', justifyContent: 'center', alignItems: 'center', marginBottom: 15}}>
                                                    <BarChart
                                                        segments={2}
                                                        withInnerLines={true}
                                                        xAxisSuffix='k'
                                                        showBarTops={false}
                                                        showValuesOnTopOfBars={true}
                                                        fromZero={true}
                                                        withCustomBarColorFromData={true}
                                                        flatColor={true}
                                                        style={tw`h-auto`}
                                                        yLabelsOffset={30}
                                                        data={data_altas_bajas_irp}
                                                        width={Dimensions.get('screen').width - 25}
                                                        height={200}
                                                        chartConfig={{backgroundColor: '#e26a00',
                                                        propsForLabels: {
                                                            fontSize: 15,
                                                            fontWeight: 'bold'
                                                        },
                                                        backgroundGradientFrom: '#fff',
                                                        decimalPlaces: 0,
                                                        backgroundGradientTo: '#fff',
                                                        color: (opacity = 1) => '#000',
                                                        labelColor: (opacity = 1) => `#000`,
                                                        style: {
                                                            borderRadius: 50,
                                                            margin: 0,
                                                            padding: 0,
                                                        }}}
                                                        verticalLabelRotation={0}
                                                    />
                                                </View>

                                                <View style={tw`h-auto self-stretch px-2`}>
                                                    <View style={tw`flex-row justify-center items-center`}>
                                                        <View style={tw`flex-1 justify-center items-start px-2`}>
                                                            <Text style={tw`font-bold text-[#000] text-lg`}>Altas</Text>
                                                        </View>
                                                        <TouchableOpacity onPress={() => setInitialState({...initialState, altas: !altas})} style={tw`h-12.5 w-auto justify-center items-center`}>
                                                            <View style={tw`h-auto w-auto rounded-lg p-1.5 bg-[${Blue}] justify-center items-center flex-row`}>
                                                                <IonIcons name={'file-document-outline'} size={20} color='#fff' />
                                                                <Text style={tw`font-bold text-[#fff]`}>{language === '1' ? 'Ver detalle de altas' : 'Resume'}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                
                                                <View style={tw`h-auto justify-start items-start mb-4 flex-1`}>
                                                    <PieChart
                                                        absolute={true}
                                                        paddingLeft={'0'}
                                                        data={altas_grafico}
                                                        width={Dimensions.get('window').width-50} // from react-native
                                                        height={180}
                                                        chartConfig={{
                                                            backgroundColor: '#EC33FF',
                                                            backgroundGradientFrom: '#FF5733',
                                                            backgroundGradientTo: '#FF5770',
                                                            color: () => 'yellow',
                                                            labelColor: () => 'black',
                                                        }}
                                                        style={tw`self-stretch justify-start items-start`}
                                                        accessor={'product'}
                                                        backgroundColor={'transparent'}
                                                    />
                                                </View>

                                                <View style={tw`h-auto self-stretch px-2`}>
                                                    <View style={tw`flex-row justify-center items-center`}>
                                                        <View style={tw`flex-1 justify-center items-start px-2`}>
                                                            <Text style={tw`font-bold text-[#000] text-lg`}>Bajas</Text>
                                                        </View>
                                                        <TouchableOpacity onPress={() => setInitialState({...initialState, bajas: !bajas})} style={tw`h-12.5 w-auto justify-center items-center`}>
                                                            <View style={tw`h-auto w-auto rounded-lg p-1.5 bg-[${Blue}] justify-center items-center flex-row`}>
                                                                <IonIcons name={'file-document-outline'} size={20} color='#fff' />
                                                                <Text style={tw`font-bold text-[#fff]`}>{language === '1' ? 'Ver detalle de bajas' : 'Resume'}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                <View style={tw`h-auto justify-start items-start self-stretch mb-4 flex-1`}>
                                                    <PieChart
                                                        absolute={true}
                                                        paddingLeft={'0'}
                                                        data={bajas_grafico}
                                                        width={Dimensions.get('screen').width - 50} // from react-native
                                                        height={180}
                                                        chartConfig={{
                                                            propsForHorizontalLabels: {
                                                                color: 'red',
                                                                backgroundColor: 'green'
                                                            },
                                                            paddingRight: 0,
                                                            backgroundColor: '#EC33FF',
                                                            backgroundGradientFrom: '#FF5733',
                                                            backgroundGradientTo: '#FF5770',
                                                            color: () => 'yellow',
                                                            labelColor: () => 'black',
                                                        }}
                                                        style={tw`flex-1 justify-start items-start`}
                                                        backgroundColor={'transparent'}
                                                        accessor={'product'}
                                                    />
                                                </View>

                                                <Title title={'Training'} icon={'chart-bar-stacked'} tipo={2} vertical={false}/>
                                                <View style={tw`h-auto self-stretch`}>
                                                    <View style={tw`flex-row mb-4`}>
                                                        <Box color={Blue} title={language === '1' ? 'Altas' : 'Altas'} countTitle={training.altas && training.altas} iconLeft={'account'} lateral={altas_bajas_quincenas.activos_semana_ant && altas_bajas_quincenas.activos_semana_ant}/>
                                                        <Box color={'#2CA02C'} title={language === '1' ? 'Activos' : 'Activos'} countTitle={training.activos && training.activos} iconLeft={'account-plus'} lateral={training.activos_porcentaje && `${training.activos_porcentaje}%`} iconLateral={'menu-up'}/>
                                                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : 'Bajas'} countTitle={training.activos && training.activos} iconLeft={'account-minus'} lateral={training.bajas_porcentaje && `${training.bajas_porcentaje}%`} iconLateral={'menu-down'}/>
                                                    </View>
                                                </View>

                                                <View style={tw`h-9 self-stretch px-2 bg-[rgba(50,131,197,.1)] border border-[${Blue}] justify-center items-center mx-0.5 mb-2`}>
                                                    <View style={tw`flex-row`}>
                                                        <View style={tw`w-auto justify-center`}>
                                                            <Icon name={'info'} size={24} color={Blue} />
                                                        </View>
                                                        <View style={tw`flex-1 justify-center px-2`}>
                                                            <Text style={tw`font-bold text-[${Blue}] text-lg`}>Detalles</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <FlatList
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={[list, {marginBottom: 10}]}
                                                    data={training_categorias}
                                                    numColumns={2}
                                                    renderItem={({item}) => <Detalle_Gerencia id={item.id} campanna={item.campanna} altas={item.altas} activos={item.activos} bajas={item.bajas} total={item.total} tipo={2}/>}
                                                    keyExtractor={item => String(item.id)}
                                                />
                                                

                                                <View style={tw`h-auto mb-4`}>
                                                    <View style={tw`h-auto self-stretch`}>
                                                        <FlatList
                                                            showsVerticalScrollIndicator={false}
                                                            showsHorizontalScrollIndicator={false}
                                                            style={list}
                                                            data={section === 1 ? headers_1 : section === 2 ? headers_2 : section === 3 ? headers_3 : headers_1}
                                                            numColumns={5}
                                                            renderItem={({item}) => <HeaderTable_uno title={item.title}/>}
                                                            keyExtractor={item => String(item.id)}
                                                        />
                                                    </View>
                                                    {
                                                        section === 3
                                                        ?
                                                            <FlatList
                                                                showsVerticalScrollIndicator={false}
                                                                showsHorizontalScrollIndicator={false}
                                                                style={list}
                                                                data={section === 1 ? body_1 : section === 2 ? body_2 : section === 3 ? body_3 : headers_1}
                                                                numColumns={2}
                                                                renderItem={({item}) => <BodyTable_uno title={item.fecha} first={item.first}/>}
                                                                keyExtractor={item => String(item.id)}
                                                                key={'_'}
                                                            />
                                                        :
                                                            section === 2
                                                            ?
                                                                <FlatList
                                                                    showsVerticalScrollIndicator={false}
                                                                    showsHorizontalScrollIndicator={false}
                                                                    style={list}
                                                                    data={section === 1 ? body_1 : section === 2 ? body_2 : section === 3 ? body_3 : headers_1}
                                                                    numColumns={4}
                                                                    renderItem={({item}) => <BodyTable_uno title={item.fecha} first={item.first}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                    key={'#_'}
                                                                />
                                                            :
                                                                <FlatList
                                                                    showsVerticalScrollIndicator={false}
                                                                    showsHorizontalScrollIndicator={false}
                                                                    style={list}
                                                                    data={section === 1 ? body_1 : section === 2 ? body_2 : section === 3 ? body_3 : headers_1}
                                                                    numColumns={3}
                                                                    renderItem={({item}) => <BodyTable_uno title={item.fecha} first={item.first}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                    key={'#'}
                                                                />
                                                    }
                                                </View>

                                                <Title title={'Empleados por Ubicación'} icon={'building'} tipo={1} vertical={false}/>
                                                <FlatList
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={list}
                                                    data={empleados_ubicacion}
                                                    numColumns={2}
                                                    renderItem={({item}) => <Empleados_Ubicacion name={item.name} total={item.total} color={item.color}/>}
                                                    keyExtractor={item => String(item.id)}
                                                />

                                                <View style={tw`mb-4`}></View>
                                                <Title title={'Empleados por Razón Social'} icon={'account-multiple'} tipo={2} vertical={false}/>
                                                <FlatList
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={list}
                                                    data={empleados_razon_social}
                                                    numColumns={1}
                                                    renderItem={({item}) => <Empleados_Razon_Social name={item.name} total={item.total}/>}
                                                    keyExtractor={item => String(item.id)}
                                                />
                                                
                                                <View style={tw`mb-4`}></View>
                                                <Title title={title} icon={'finance'} tipo={2} vertical={false}/>
                                                <View style={tw`h-auto bg-[rgba(50,131,197,.1)] border border-[${Blue}] p-1 mb-2 mx-1.5`}>
                                                    <View style={tw`flex-row items-center`}>
                                                        <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-2 py-0.5 mr-1.5`}>
                                                            <Text style={tw`text-base font-bold text-[#fff]`}>{total}</Text>
                                                        </View>
                                                        <Text style={tw`font-bold text-[${Blue}] text-lg`}>Detalle de Área</Text>
                                                    </View>
                                                </View>
                                                <TouchableOpacity style={[picker, tw`shadow-md bg-white`, {flexDirection: 'row'}]} onPress={() => handleVisibleArea()}>
                                                    <View style={tw`flex-1 justify-center items-center`}>
                                                        <Text style={tw`text-[#000]`}>{currentArea}</Text>
                                                    </View>
                                                    <View style={tw`w-auto`}>
                                                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                                    </View>
                                                </TouchableOpacity>

                                                <View style={tw`flex-1 h-auto mx-0.5`}>

                                                    <PieChart
                                                        absolute={true}
                                                        paddingLeft={'0'}
                                                        data={data_grafico}
                                                        width={Dimensions.get('window').width-50} // from react-native
                                                        height={180}
                                                        chartConfig={{
                                                            backgroundColor: '#EC33FF',
                                                            backgroundGradientFrom: '#FF5733',
                                                            backgroundGradientTo: '#FF5770',
                                                            color: () => 'yellow',
                                                            labelColor: () => 'black',
                                                        }}
                                                        style={tw`self-stretch justify-start items-start`}
                                                        accessor={'product'}
                                                        backgroundColor={'transparent'}
                                                    />
                                                </View>

                                                <View style={tw`h-9 self-stretch px-2 bg-[rgba(50,131,197,.1)] border border-[${Blue}] justify-center items-center mb-2 mt-5 mx-1.5`}>
                                                    <View style={tw`flex-row`}>
                                                        <View style={tw`w-auto justify-center`}>
                                                            <Icon name={'info'} size={24} color={Blue} />
                                                        </View>
                                                        <View style={tw`flex-1 justify-center px-2`}>
                                                            <Text style={tw`font-bold text-[${Blue}] text-lg`}>Detalle de Subárea</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                                <TouchableOpacity style={[picker, tw`shadow-md bg-white`, {flexDirection: 'row'}]} onPress={() => handleVisibleSubarea()}>
                                                    <View style={tw`flex-1 justify-center items-center`}>
                                                        <Text style={tw`text-[#000]`}>{currentSubarea}</Text>
                                                    </View>
                                                    <View style={tw`w-auto`}>
                                                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                                    </View>
                                                </TouchableOpacity>

                                                <PieChart
                                                    absolute={true}
                                                    paddingLeft={'0'}
                                                    data={dataGraficoSubarea}
                                                    width={Dimensions.get('window').width-50} // from react-native
                                                    height={180}
                                                    chartConfig={{
                                                        backgroundColor: '#EC33FF',
                                                        backgroundGradientFrom: '#FF5733',
                                                        backgroundGradientTo: '#FF5770',
                                                        color: () => 'yellow',
                                                        labelColor: () => 'black',
                                                    }}
                                                    style={tw`self-stretch justify-start items-start`}
                                                    accessor={'product'}
                                                    backgroundColor={'transparent'}
                                                />

                                                <View style={tw`h-auto self-stretch justify-center items-center mt-2 rounded-tl-2xl rounded-tr-2xl`}>
                                                    <View style={tw`h-auto self-stretch bg-[#f7f7f7] border-[#CBCBCB] border justify-center items-center flex-row py-0.5 rounded-tl-2xl rounded-tr-2xl`}>
                                                        <IonIcons name={'menu'} size={28} color={Blue} />
                                                        <View style={tw`w-1`} />
                                                        <Text style={tw`text-[${Blue}] text-base font-bold`}>Empleados por Razón Social</Text>
                                                    </View>
                                                </View>
                                                <View style={tw`h-auto self-stretch justify-center items-center`}>
                                                    {
                                                        total_razon_social.length > 0
                                                        &&
                                                            total_razon_social.map(x => 
                                                                <View key={x.id} style={tw`h-auto self-stretch bg-[#fff] border-b border-[#CBCBCB] border-l border-r justify-center items-center flex-row p-1`}>
                                                                    <View style={tw`flex-1 px-2`}>
                                                                        <Text style={tw`text-[${Blue}] text-xs`}>{x.name}</Text>
                                                                    </View>
                                                                    <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-1`}>
                                                                        <Text style={tw`text-base font-bold text-[#fff]`}>{x.total}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                    }
                                                </View>
                                                <View style={tw`h-auto self-stretch bg-[#f7f7f7] border border-[#CBCBCB] justify-center items-center flex-row p-1 rounded-bl-2xl rounded-br-2xl`}>
                                                    <View style={tw`flex-1 px-1`}>
                                                        <Text style={tw`text-[${Blue}] text-sm font-bold`}>Total General</Text>
                                                    </View>
                                                    <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-2 py-0.5`}>
                                                        <Text style={tw`text-base font-bold text-[#fff]`}>{total}</Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={tw`mb-4`}></View>
                                                <Title title={'Índice de Rotación de Personal'} icon={'finance'} tipo={2} vertical={false}/>
                                                <View style={tw`h-auto self-stretch mb-2.5`}>
                                                    <FlatList
                                                        showsVerticalScrollIndicator={false}
                                                        showsHorizontalScrollIndicator={false}
                                                        style={list}
                                                        data={legendsIRP}
                                                        numColumns={4}
                                                        renderItem={({item}) => <Year year={item.year} checked={item.checked}/>}
                                                        keyExtractor={item => String(item.id)}
                                                    />
                                                </View>
                                                <View style={tw`justify-center items-center`}>
                                                    {
                                                        content
                                                        ?
                                                            <>
                                                                <View style={tw`h-auto self-stretch`}>
                                                                    <FlatList
                                                                        showsVerticalScrollIndicator={false}
                                                                        showsHorizontalScrollIndicator={false}
                                                                        style={list}
                                                                        data={legendsGraphicIRP}
                                                                        numColumns={4}
                                                                        renderItem={({item}) => 
                                                                            item.visible
                                                                            ?
                                                                                <View style={tw`flex-1 justify-center items-center h-auto flex-row py-2`}>
                                                                                    <View style={tw`w-5 h-5 rounded-full bg-[${item.color}] border border-[#dadada]`} />
                                                                                    <Text style={tw`ml-1.5 font-bold text-xs text-[#000]`}>{item.year}</Text>
                                                                                </View>
                                                                            :
                                                                                <></>    
                                                                        }
                                                                        keyExtractor={item => String(item.id)}
                                                                    />
                                                                </View>
                                                                <LineChart
                                                                    fromZero={true}
                                                                    style={tw`justify-center items-center`}
                                                                    data={{
                                                                        labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
                                                                        datasets: dataIRP,
                                                                        legend: [] // optional
                                                                    }}
                                                                    width={Dimensions.get('window').width}
                                                                    yLabelsOffset={30}
                                                                    height={200}
                                                                    chartConfig={{
                                                                        decimalPlaces: 0,
                                                                        propsForLabels: {
                                                                            fontSize: 14,
                                                                            fontWeight: 'bold'
                                                                        },
                                                                        backgroundGradientFrom: '#fff',
                                                                        backgroundGradientTo: '#fff',
                                                                        color: () => '#000',
                                                                        labelColor: () => '#000',
                                                                    }}
                                                                />
                                                            </>
                                                        :
                                                            <></>
                                                    }
                                                </View>
                                                
                                                <View style={tw`mb-4`}></View>
                                                <Title title={'Gráficas Comparativas Altas-Bajas-IRP'} icon={'finance'} tipo={2} vertical={false}/>
                                                <View style={tw`h-auto self-stretch px-2 mt-4 mb-1`} />
                                                <View style={tw`h-auto self-stretch mb-4`}>
                                                    <View style={tw`h-auto self-stretch mb-2.5`}>
                                                        <FlatList
                                                            showsVerticalScrollIndicator={false}
                                                            showsHorizontalScrollIndicator={false}
                                                            style={list}
                                                            data={yearsPickerUno}
                                                            numColumns={5}
                                                            renderItem={({item}) => <YearsPickerUno name={item.name} selected={item.selected}/>}
                                                            keyExtractor={item => String(item.id)}
                                                        />
                                                    </View>
                                                    <MultiSelect handleAddElement={handleAddElement} information={meses} label={count === 0 ? 'Seleccionar Meses' : `Meses seleccionados: ${count}`}/>
                                                </View>

                                                <BarChart
                                                    segments={2}
                                                    withInnerLines={true}
                                                    xAxisSuffix='k'
                                                    showBarTops={false}
                                                    showValuesOnTopOfBars={true}
                                                    fromZero={true}
                                                    withCustomBarColorFromData={true}
                                                    flatColor={true}
                                                    style={tw`h-auto`}
                                                    yLabelsOffset={30}
                                                    data={data_grafica_comparativa_uno}
                                                    width={Dimensions.get('screen').width - 25}
                                                    height={200}
                                                    chartConfig={{backgroundColor: '#e26a00',
                                                    propsForLabels: {
                                                        fontSize: 15,
                                                        fontWeight: 'bold'
                                                    },
                                                    backgroundGradientFrom: '#fff',
                                                    decimalPlaces: 0,
                                                    backgroundGradientTo: '#fff',
                                                    color: (opacity = 1) => '#000',
                                                    labelColor: (opacity = 1) => `#000`,
                                                    style: {
                                                        borderRadius: 50,
                                                        margin: 0,
                                                        padding: 0,
                                                    }}}
                                                    verticalLabelRotation={0}
                                                />

                                                <View style={tw`h-auto self-stretch px-2 pb-2 my-4`} />

                                                <View style={tw`h-auto self-stretch mb-4`}>
                                                    <View style={tw`h-auto self-stretch mb-2.5`}>
                                                        <FlatList
                                                            showsVerticalScrollIndicator={false}
                                                            showsHorizontalScrollIndicator={false}
                                                            style={list}
                                                            data={yearsPickerDos}
                                                            numColumns={5}
                                                            renderItem={({item}) => <YearsPickerDos name={item.name} selected={item.selected}/>}
                                                            keyExtractor={item => String(item.id)}
                                                        />
                                                    </View>
                                                    <MultiSelect handleAddElement={handleAddElementDos} information={mesesDos} label={countDos === 0 ? 'Seleccionar Meses' : `Meses seleccionados: ${countDos}`}/>
                                                </View>

                                                <BarChart
                                                    segments={2}
                                                    withInnerLines={true}
                                                    xAxisSuffix='k'
                                                    showBarTops={false}
                                                    showValuesOnTopOfBars={true}
                                                    fromZero={true}
                                                    withCustomBarColorFromData={true}
                                                    flatColor={true}
                                                    style={tw`h-auto`}
                                                    yLabelsOffset={30}
                                                    data={data_grafica_comparativa_dos}
                                                    width={Dimensions.get('screen').width - 25}
                                                    height={200}
                                                    chartConfig={{backgroundColor: '#e26a00',
                                                    propsForLabels: {
                                                        fontSize: 15,
                                                        fontWeight: 'bold'
                                                    },
                                                    backgroundGradientFrom: '#fff',
                                                    decimalPlaces: 0,
                                                    backgroundGradientTo: '#fff',
                                                    color: (opacity = 1) => '#000',
                                                    labelColor: (opacity = 1) => `#000`,
                                                    style: {
                                                        borderRadius: 50,
                                                        margin: 0,
                                                        padding: 0,
                                                    }}}
                                                    verticalLabelRotation={0}
                                                />
                                            </>
                                        :
                                            <LandscapeTabletAndPhone />
                                    :
                                        <LandscapeTabletAndPhone />
                                }
                                <View style={{marginBottom: 25}}></View>
                            </ScrollView>
                            <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                        </>
                    :
                        <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>}
            </View>

            <Modal visibility={altas} orientation={orientationInfo.initial} handleDismiss={() => setInitialState({...initialState, altas: !altas})}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Title title={language === '1' ? 'Detalle de Altas' : 'Resume'} icon={'chart-bar-stacked'} tipo={2} vertical={false} itCloses={() => setInitialState({...initialState, altas: !altas})}/>
                    <View style={tw`h-auto self-stretch justify-center items-center`}>
                        <View style={tw`h-auto self-stretch bg-[#f7f7f7] border border-[#CBCBCB] border-t border-l border-r justify-center items-center flex-row py-1.5 rounded-tl-2xl rounded-tr-2xl`}>
                            <IonIcons name={'menu'} size={28} color={Blue} />
                            <View style={tw`w-1`} />
                            <Text style={{color: Blue, fontSize: 16}}>Altas por Subárea</Text>
                        </View>
                    </View>
                    <View style={tw`h-auto self-stretch justify-center items-center`}>
                    {
                        detalle_altas.length > 0
                        &&
                            detalle_altas.map(x => 
                                <View key={x.id} style={tw`h-auto self-stretch bg-[#fff] border border-[#CBCBCB] justify-center items-center flex-row p-1`}>
                                    <View style={tw`flex-1 px-2`}>
                                        <Text style={tw`text-[${Blue}]`}>{x.name}</Text>
                                    </View>
                                    <View style={{width: x.total.toString().length === 2 ? 'auto' : 25, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 4}}>
                                        <Text style={tw`text-base font-bold text-[#fff]`}>{x.total}</Text>
                                    </View>
                                </View>
                            )
                    }
                        
                    </View>
                    <View style={tw`h-auto self-stretch bg-[#f7f7f7] border border-[#CBCBCB] justify-center items-center flex-row p-1 rounded-bl-2xl rounded-br-2xl`}>
                        <View style={tw`flex-1 px-2`}>
                            <Text style={tw`text-[${Blue}] font-bold`}>{language === '1' ? 'Total General' : ''}</Text>
                        </View>
                        <View style={tw`w-auto bg-[${Blue}] justify-center items-center rounded-lg px-2 py-0.5`}>
                            <Text style={tw`text-base font-bold text-[#fff]`}>{altas_bajas_quincenas.altas && altas_bajas_quincenas.altas}</Text>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

            <Modal visibility={bajas} orientation={orientationInfo.initial} handleDismiss={() => setInitialState({...initialState, bajas: !bajas})}>
                <FlatList
                    key={'$__'}
                    ListHeaderComponent={<Header />}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={list}
                    data={legends_motivo_baja}
                    numColumns={2}
                    renderItem={({item}) => <Motivo legend={item.text} color={item.color}/>}
                    keyExtractor={item => String(item.id)}
                />
            </Modal>

            <Modal orientation={orientationInfo.initial} visibility={visiblePeriodo} handleDismiss={handleVisiblePeriodos} >
                <Select data={periodos} handleVisiblePeriodos={handleVisiblePeriodos} handleActionUno={handleActionUno} />
            </Modal>

            <Modal orientation={orientationInfo.initial} visibility={visibleArea} handleDismiss={handleVisibleArea}> 
                <Select data={areas} handleVisibleArea={handleVisibleArea} handleActionDos={handleActionDos} />
            </Modal>

            <Modal orientation={orientationInfo.initial} visibility={visibleSubarea} handleDismiss={handleVisibleSubarea}>
                <Select data={subareas} handleVisibleArea={handleVisibleSubarea} handleActionDos={handleActionTres} />
            </Modal>

            {
                !loadingContent && !isIphone
                ?
                    <ModalLoading visibility={loading}/>
                :
                    <ModalLoading visibility={loadingContent}/>
            }

            {
                isIphone
                &&
                    <ModalLoading visibility={loadingContent}/>
            }
        </>
    )
}

const box = tw`flex-1 h-15 bg-[#fff] flex-row px-1 shadow-md rounded-2xl mx-1.5`
const picker = tw`justify-center items-center mb-4 h-12.5 px-4 self-stretch rounded-2xl mx-1.5`
const container = tw`flex-1 items-center justify-center bg-[#fff]`
const list = tw`h-auto self-stretch`