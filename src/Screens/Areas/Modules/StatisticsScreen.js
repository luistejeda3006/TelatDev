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
import { useDispatch, useSelector } from 'react-redux';
import { selectAltasBajasIRP, selectAltasBajasQuincenas, selectAltasGrafico, selectBajasGrafico, selectBodyDos, selectBodyMasterDos, selectBodyMasterUno, selectBodyUno, selectDetalleAltas, selectDetalleBajas, selectEdificios, selectEmpleadosAreas, selectEmpleadosRazonSocial, selectEmpleadosUbicacion, selectLegendsMotivoBaja, selectMotivoBajasValue, selectTiempoReal, selectTraining, selectTrainingCategorias, selectTrainingGrafico } from '../../../slices/statisticsSlice';
import { selectPeriodos } from '../../../slices/moneySlice';

let keyUserInfo = 'userInfo';
let keyTokenInfo = 'tokenInfo';
let token = null;
let temporal = null;
let id_usuario = null;
let cuenta = 0;
let data = {}

export default ({navigation, route: {params: {orientation}}}) => {
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
        'initial': orientation
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)
    
    const getUserInfo = async () => {
        data = await AsyncStorage.getItem(keyUserInfo) || '[]';
        data = JSON.parse(data);
        id_usuario = data.data.datos_personales.id_usuario
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
        legendsGraphicIRP: [getCurrentDate().substring(0,4)],
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
            token = await AsyncStorage.getItem(keyTokenInfo) || '{}';
            token = JSON.parse(token);
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

            const {response} = await request.json();
            if(response.status === 200){
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

                add_color = res.data.map(x => ({'data': x.data, color: () => x.color}))
                add_color_general = res.data2.map((x,i,a) => ({'data': x.data, color: () => x.color, id: i}))
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

                add_color_2 = {...res.data2[res.data2.length - 1], color: () => res.data2[res.data2.length - 1].color}
                fin = [...add_color, ...odi]
                
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
                    legends: res.legends,
                    legendsIRP: res.legends_index,
                    generalIRP: finGeneral,
                    dataIRP: finito,
                    body_horizontal: response.training.body_horizontal,
                    body_horizontal_master: response.training.body_horizontal,
                })

                //información con redux, nada más llegar acomodar y hacer que ya no cargue,  unica recarga con refresh control

                setLoadingContent(false)
                setCurrentQuincena(!currentQuincena ? respuestita.periodos[0].label : currentQuincena)
                setCurrentArea(response.areas[0].label)
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
            setInitialState({...initialState, loading: false})
        }
    }

    useEffect(() => {
        getInformation()
    },[id_periodo, años, contador, hasConnection])

    const getYears = async () => {
        try{
            token = await AsyncStorage.getItem(keyTokenInfo) || '{}';
            token = JSON.parse(token);
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
    
            let n_1 = response.years.map(x => String(x.year) === es_1 ? ({'id': x.id, 'name': String(x.year), 'selected': true}) : ({'id': x.id, 'name': String(x.year), 'selected': false}))
            let n_2 = response.years.map(x => String(x.year) === es_2 ? ({'id': x.id, 'name': String(x.year), 'selected': true}) : ({'id': x.id, 'name': String(x.year), 'selected': false}))
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
            setInitialState({...initialState, loading: true})
            token = await AsyncStorage.getItem(keyTokenInfo) || '{}';
            token = JSON.parse(token);
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
            
            const {response} = await request.json();
            if(response.status === 200){
                const data = response.data_grafico.map(x => x.name === '--PRESA SALINILLAS' ? ({...x, name: '--SALINILLAS'}) : x.name === '--CIUDAD JUAREZ' ? ({...x, name: '--JUAREZ'}) : x)
                setAreasGeneral({...areasGeneral, total_razon_social: response.empleados_razon_social, data_grafico: data, total: response.total, subareas: response.subareas})
                setInitialState({...initialState, loading: false})
                const nuevita = response.data_grafico_subarea.map(x => x.name === '--PRESA SALINILLAS' ? ({...x, name: '--SALINILLAS'}) : x.name === '--CIUDAD JUAREZ' ? ({...x, name: '--JUAREZ'}) : x)
                setDataGraficoSubarea(nuevita)
                setCurrentSubarea(response.subareas[0].label)
            }
            else if(response.status === 406){
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
            token = await AsyncStorage.getItem(keyTokenInfo) || '{}';
            token = JSON.parse(token);
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
            
            const {response} = await request.json();
            if(response.status === 200){
                const data = response.data_grafico.map(x => x.name === '--PRESA SALINILLAS' ? ({...x, name: '--SALINILLAS'}) : x.name === '--CIUDAD JUAREZ' ? ({...x, name: '--JUAREZ'}) : x)
                setDataGraficoSubarea(data)
                setInitialState({...initialState, loading: false})
            }
            else if(response.status === 406){
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
            console.log('algo pasó con el internet que pienso')
            setLoadingContent(false)
            setInitialState({...initialState, loading: false})
        }
    }

    useEffect(() => {
        getDetalleEmpleadoSubarea()
    },[id_subarea, hasConnection])

    const getComparativasUno = async () => {
        try{
            token = await AsyncStorage.getItem(keyTokenInfo) || '{}';
            token = JSON.parse(token);
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
            if(response.hasOwnProperty('data_grafica')){
                setDataGraficoUno(response.data_grafica)
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
            token = await AsyncStorage.getItem(keyTokenInfo) || '{}';
            token = JSON.parse(token);
    
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
            if(response.hasOwnProperty('data_grafica')){
                setDataGraficoDos(response.data_grafica)
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
            const legend = legendsGraphicIRP.find(x => String(x) === String(year))
            let legends = null
            let nuevaData = []
            const search = nuevos.find(x => String(x.year) === String(year))
            if(legend){
                legends = legendsGraphicIRP.filter(x => String(x) !== String(year))
                nuevaData = dataIRP.filter(x => String(x.id) !== String(search.id) && String(x.id) !== '4')
            } else {
                nuevaData = generalIRP.find(x => x.id === search.id)
                nuevaData = [...dataIRP, nuevaData]
                nuevaData = nuevaData.sort((a, b) => a.id > b.id)
                legends = [...legendsGraphicIRP, String(year)]
            }

            const ordenadas = legends.sort()
            
            setInitialState({...initialState, legendsIRP: nuevos, legendsGraphicIRP: ordenadas, dataIRP: nuevaData})
        }
    })

    const Motivo = ({legend, color, tipo = 1}) => {
        return(
            <View style={{height: 'auto', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 4}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: tipo === 1 ? 'flex-start' : 'center', alignItems: 'center'}}>
                    <View style={{width: 15, height: 15, backgroundColor: color, borderRadius: 20}}></View>
                    <View style={{width: 4}}></View>
                    <Text style={{fontSize: tipo === 2 ? 14 : 12}}>{legend}</Text>
                </View>
            </View>
        )
    }

    const Detalle_Gerencia = ({id, campanna, altas = null, activos = null, bajas = null, monterrey = null, insurgentes = null, salinillas = null, juarez = null, home = null, total, tipo = 1}) => {
        return(
            <View style={{flex: 1, height: 'auto', marginBottom: 14, marginHorizontal: 1.5, borderRadius: 16}}>
                <View style={{height: 'auto', backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderWidth: 1, padding: 3, borderTopStartRadius: 16, borderTopEndRadius: 16}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        {
                            tipo === 1
                            ?
                                <>
                                    <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6}}>
                                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{total}</Text>
                                    </View>
                                    <Text style={{fontWeight: 'bold', fontSize: 12, color: '#000'}}>{campanna}</Text>
                                </>
                            :
                                <Text style={{fontSize: 14, color: '#000'}}>{campanna}</Text>
                        }
                    </View>
                </View>
                {
                    tipo === 1
                    ?
                        <View style={{height: 'auto', alignSelf: 'stretch', borderColor: '#CBCBCB', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1, backgroundColor: '#1f77b4', height: 35, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 11, fontWeight: 'bold', color: '#fff'}}>{monterrey}</Text>
                            </View>
                            <View style={{flex: 1, backgroundColor: '#2ca02c', height: 35, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 11, fontWeight: 'bold', color: '#fff'}}>{insurgentes}</Text>
                            </View>
                            <View style={{flex: 1, backgroundColor: '#ff7f0e', height: 35, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 11, fontWeight: 'bold', color: '#fff'}}>{salinillas}</Text>
                            </View>
                            <View style={{flex: 1, backgroundColor: '#808b96', height: 35, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 11, fontWeight: 'bold', color: '#fff'}}>{juarez}</Text>
                            </View>
                            <View style={{flex: 1, backgroundColor: '#ff0000', height: 35, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 11, fontWeight: 'bold', color: '#fff'}}>{home}</Text>
                            </View>
                        </View>
                    :
                        <View style={{height: 'auto', alignSelf: 'stretch', borderColor: '#CBCBCB', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, flexDirection: 'row', borderBottomStartRadius: 16, borderBottomEndRadius: 16}}>
                            <View style={{flex: 1, backgroundColor: Blue, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomStartRadius: 16}}>
                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}>{altas}</Text>
                            </View>
                            <View style={{flex: 1, backgroundColor: '#2ca02c', height: 30, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}>{activos}</Text>
                            </View>
                            <View style={{flex: 1, backgroundColor: '#ff0000', height: 30, justifyContent: 'center', alignItems: 'center', borderBottomEndRadius: 16}}>
                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}>{bajas}</Text>
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
            <View style={[styles.box, {margin: 5, marginHorizontal: 7, paddingLeft: 6, paddingRight: 0}]}>
                <View style={{width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name={'building'} size={24} color={color} />
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'flex-start', paddingLeft: 5, flexDirection: 'row', height: '100%'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text style={{fontSize: 12, color: '#000'}}>{name}</Text>
                        </View>
                        <View style={{width: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7', borderTopEndRadius: 16, borderBottomEndRadius: 16, borderLeftColor: '#dadada', borderLeftWidth: 1}}>
                            <Text style={{fontWeight: 'bold', color: '#000'}}>{total}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const Empleados_Razon_Social = ({name, total}) => {
        return(
            <View style={[styles.box, {paddingRight: 0, margin: 7, marginHorizontal: 10}]}>
                <View style={{width: 'auto', justifyContent: 'center', alignItems: 'center', paddingLeft: 4}}>
                    <IonIcons name={'account-group'} size={34} color={Blue} />
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'flex-start', paddingLeft: 8, flexDirection: 'row', height: '100%'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text style={{fontSize: 14, color: '#000'}}>{name}</Text>
                        </View>
                        <View style={{width: 40, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center', borderLeftColor: '#CBCBCB', borderLeftWidth: 1, borderTopEndRadius: 16, borderBottomEndRadius: 16}}>
                            <Text style={{fontWeight: 'bold', color: '#000'}}>{total}</Text>
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
                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 6, borderTopStartRadius: 16, borderTopEndRadius: 16}}>
                        <IonIcons name={'menu'} size={28} color={Blue} />
                        <View style={{width: 4}}></View>
                        <Text style={{color: Blue, fontSize: 20}}>{language === '1' ? 'Bajas por Subárea' : ''}</Text>
                    </View>
                </View>
                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                    {
                        detalle_bajas.length > 0
                        &&
                            detalle_bajas.map(x => 
                                <View key={x.id} style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#fff', borderColor: '#CBCBCB', borderWidth: 1, borderTopWidth: 0.5, borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4}}>
                                    <View style={{flex: 1, paddingHorizontal: 8}}>
                                        <Text style={{color: Blue}}>{x.name}</Text>
                                    </View>
                                    <View style={{width: x.total.toString().length === 2 ? 'auto' : 25, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 4}}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>{x.total}</Text>
                                    </View>
                                </View>
                            )
                    
                    }
                </View>
                <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 20, backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopWidth: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4, borderBottomStartRadius: 16, borderBottomEndRadius: 16}}>
                    <View style={{flex: 1, paddingHorizontal: 8}}>
                        <Text style={{color: Blue, fontWeight: 'bold'}}>{language === '1' ? 'Total General' : ''}</Text>
                    </View>
                    <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>{altas_bajas_quincenas.bajas && altas_bajas_quincenas.bajas}</Text>
                    </View>
                </View>

                <Title title={'Motivos de Baja'} icon={'chart-line'} tipo={2} vertical={false}/>

                <View style={{height:'auto', justifyContent: 'center', alignItems: 'center'}}>
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

    const Footer = () => {
        return(
            <>
                <View style={{height: 1, alignSelf: 'stretch', backgroundColor: Blue}}></View>
                <TouchableOpacity
                    style={{flexDirection: 'row', height: 40, backgroundColor: Blue, borderRadius: 8, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', marginTop: 10}}
                    onPress={() => setInitialState({...initialState, bajas: !bajas})}
                >
                    <Icon name={'times'} size={22} color={'#fff'} />
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 6}}>{language === '1' ? 'Cerrar' : 'Close'}</Text>
                </TouchableOpacity>
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
                
                const {response} = await request.json();
                if(response.status === 200){
                    setInitialState({...initialState, body_1: response.body_1, body_2: response.body_2, last: title, body_horizontal: response.body_horizontal, loading: false})
                }
                else if(response.status === 406){
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
                <View style={{marginTop: '1.5%'}}></View>
                <Title icon={'timer-sand'} title={'Información en Tiempo Real'} tipo={2} vertical={false}/>
                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                    <View style={{flexDirection: 'row', marginBottom: 15}}>
                        <Box color={Blue} title={language === '1' ? 'Empleados' : 'Empleados'} countTitle={tiempo_real.empleados && tiempo_real.empleados} iconLeft={'account'} lateral={tiempo_real.empleados_periodo_ant && tiempo_real.empleados_periodo_ant}/>
                        <Box color={'#2CA02C'} title={language === '1' ? 'Altas' : 'Altas'} countTitle={tiempo_real.altas_real && tiempo_real.altas_real} iconLeft={'account-plus'} lateral={tiempo_real.altas_real_porcentaje && `${tiempo_real.altas_real_porcentaje}%`} iconLateral={'menu-up'}/>
                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : ''} countTitle={tiempo_real.bajas_real && tiempo_real.bajas_real} iconLeft={'account-minus'} lateral={tiempo_real.bajas_real_porcentaje && `${tiempo_real.bajas_real_porcentaje}%`} iconLateral={'menu-down'}/>
                    </View>
                </View>

                <Title title={'Altas y Bajas por Quincena'} icon={'chart-line'} tipo={2} vertical={false}/>
                <TouchableOpacity style={[styles.picker, {flexDirection: 'row'}]} onPress={() => handleVisiblePeriodos()}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#000'}}>{currentQuincena}</Text>
                    </View>
                    <View style={{width: 'auto'}}>
                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                    </View>
                </TouchableOpacity>

                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                    <View style={{flexDirection: 'row', marginBottom: 15}}>
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
                    style={{height: 'auto'}}
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
                
                <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 8}}>
                            <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>Altas</Text>
                        </View>
                        <TouchableOpacity onPress={() => setInitialState({...initialState, altas: !altas})} style={{height: 50, width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: 'auto', width: 'auto', borderRadius: 8, padding: 6, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <IonIcons name={'file-document-outline'} size={20} color='#fff' />
                                <Text style={{fontWeight: 'bold', color: '#fff'}}>{language === '1' ? 'Ver detalle de altas' : 'Resume'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={{height:'auto', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 15, flex: 1}}>
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
                        style={{
                            alignSelf: 'stretch',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}
                        accessor={'product'}
                        backgroundColor={'transparent'}
                    />
                </View>

                <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 8}}>
                            <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>Bajas</Text>
                        </View>
                        <TouchableOpacity onPress={() => setInitialState({...initialState, bajas: !bajas})} style={{height: 50, width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: 'auto', width: 'auto', borderRadius: 8, padding: 6, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <IonIcons name={'file-document-outline'} size={20} color='#fff' />
                                <Text style={{fontWeight: 'bold', color: '#fff'}}>{language === '1' ? 'Ver detalle de bajas' : 'Resume'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{height:'auto', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'stretch', marginBottom: 15, flex: 1}}>
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
                        style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            backgroundColor: '#fff',
                        }}
                        backgroundColor={'transparent'}
                        accessor={'product'}
                    />
                </View>

                <Title title={'Training'} icon={'chart-bar-stacked'} tipo={2} vertical={false}/>
                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                    <View style={{flexDirection: 'row', marginBottom: 15}}>
                        <Box color={Blue} title={language === '1' ? 'Altas' : 'Altas'} countTitle={training.altas && training.altas} iconLeft={'account'} lateral={altas_bajas_quincenas.activos_semana_ant && altas_bajas_quincenas.activos_semana_ant}/>
                        <Box color={'#2CA02C'} title={language === '1' ? 'Activos' : 'Activos'} countTitle={training.activos && training.activos} iconLeft={'account-plus'} lateral={training.activos_porcentaje && `${training.activos_porcentaje}%`} iconLateral={'menu-up'}/>
                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : 'Bajas'} countTitle={training.activos && training.activos} iconLeft={'account-minus'} lateral={training.bajas_porcentaje && `${training.bajas_porcentaje}%`} iconLateral={'menu-down'}/>
                    </View>
                </View>

                <View style={{height: 35, alignSelf: 'stretch', paddingHorizontal: 8, backgroundColor: 'rgba(50,131,197,.1)', borderColor: Blue, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center', marginHorizontal: 1.5, marginBottom: 8}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{width: 'auto', justifyContent: 'center'}}>
                            <Icon name={'info'} size={24} color={Blue} />
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 8}}>
                            <Text style={{fontWeight: 'bold', color: Blue, fontSize: 18}}>Detalles</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={[styles.list, {marginBottom: 10}]}
                    data={training_categorias}
                    numColumns={4}
                    renderItem={({item}) => <Detalle_Gerencia id={item.id} campanna={item.campanna} altas={item.altas} activos={item.activos} bajas={item.bajas} total={item.total} tipo={2}/>}
                    keyExtractor={item => String(item.id)}
                    key={'__'}
                />
                
                <View style={{height: 'auto', marginBottom: 15}}>
                    <View style={{height: 'auto', alignSelf: 'stretch'}}>
                        <FlatList
                            key={'__1'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.list}
                            data={hearder_all}
                            numColumns={5}
                            renderItem={({item}) => <HeaderTable_uno title={item.title}/>}
                            keyExtractor={item => String(item.id)}
                        />
                    </View>
                    <View style={{height: 'auto', alignSelf: 'stretch'}}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.list}
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
                            style={styles.list}
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
                            style={styles.list}
                            data={empleados_ubicacion}
                            numColumns={5}
                            renderItem={({item}) => <Empleados_Ubicacion name={item.name} total={item.total} color={item.color}/>}
                            keyExtractor={item => String(item.id)}
                        />

                }
                <View style={{marginBottom: 15}}></View>
                <Title title={'Empleados por Razón Social'} icon={'account-multiple'} tipo={2} vertical={false}/>
                {
                    !isTablet()
                    ?
                        <FlatList
                            key={'_$_'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.list}
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
                                style={styles.list}
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
                                style={styles.list}
                                data={empleados_razon_social}
                                numColumns={3}
                                renderItem={({item}) => <Empleados_Razon_Social name={item.name} total={item.total}/>}
                                keyExtractor={item => String(item.id)}
                            />
                }

                <View style={{marginBottom: 15}}></View>
                <Title title={title} icon={'finance'} tipo={2} vertical={false}/>
                <View style={{height: 'auto',  backgroundColor: 'rgba(50,131,197,.1)', borderColor: Blue, borderWidth: .5, padding: 3, marginBottom: 8}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6}}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>{total}</Text>
                        </View>
                        <Text style={{fontWeight: 'bold', color: Blue, fontSize: 18}}>Detalle de Área</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.picker, {flexDirection: 'row'}]} onPress={() => handleVisibleArea()}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#000'}}>{currentArea}</Text>
                    </View>
                    <View style={{width: 'auto'}}>
                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                    </View>
                </TouchableOpacity>

                <View style={{flex: 1, height: 'auto', marginHorizontal: 1.5}}>
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
                        style={{
                            alignSelf: 'stretch',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}
                        accessor={'product'}
                        backgroundColor={'transparent'}
                    />
                </View>

                <View style={{height: 35, alignSelf: 'stretch', paddingHorizontal: 8, backgroundColor: 'rgba(50,131,197,.1)', borderColor: Blue, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginTop: 20}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{width: 'auto', justifyContent: 'center'}}>
                            <Icon name={'info'} size={24} color={Blue} />
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 8}}>
                            <Text style={{fontWeight: 'bold', color: Blue, fontSize: 18}}>Detalle de Subárea</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={[styles.picker, {flexDirection: 'row'}]} onPress={() => handleVisibleSubarea()}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                        <Text style={{color: '#000'}}>{currentSubarea}</Text>
                    </View>
                    <View style={{width: 'auto'}}>
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
                    style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                    }}
                    accessor={'product'}
                    backgroundColor={'transparent'}
                />

                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 16, borderTopEndRadius: 16}}>
                    <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 2, borderTopStartRadius: 16, borderTopEndRadius: 16}}>
                        <IonIcons name={'menu'} size={28} color={Blue} />
                        <View style={{width: 4}}></View>
                        <Text style={{color: Blue, fontSize: 16, fontWeight: 'bold'}}>Empleados por Razón Social</Text>
                    </View>
                </View>
                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                    {
                        total_razon_social.length > 0
                        &&
                            total_razon_social.map(x => 
                                <View key={x.id} style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#fff', borderColor: '#CBCBCB', borderWidth: 1, borderTopWidth: 0.5, borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4}}>
                                    <View style={{flex: 1, paddingHorizontal: 8}}>
                                        <Text style={{color: Blue, fontSize: 12}}>{x.name}</Text>
                                    </View>
                                    <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 4}}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>{x.total}</Text>
                                    </View>
                                </View>
                            )
                    }
                </View>
                <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopWidth: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4, borderBottomStartRadius: 16, borderBottomEndRadius: 16}}>
                    <View style={{flex: 1, paddingHorizontal: 4}}>
                        <Text style={{color: Blue, fontSize: 14, fontWeight: 'bold'}}>Total General</Text>
                    </View>
                    <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>{total}</Text>
                    </View>
                </View>

                <View style={{marginBottom: 15}}></View>
                <Title title={'Índice de Rotación de Personal'} icon={'finance'} tipo={2} vertical={false}/>
                <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 15}}>
                    <FlatList
                        key={'_$%_'}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={styles.list}
                        data={legendsIRP}
                        numColumns={4}
                        renderItem={({item}) => <Year year={item.year} checked={item.checked}/>}
                        keyExtractor={item => String(item.id)}
                    />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    {
                        content
                        ?
                            <LineChart
                                fromZero={true}
                                style={{justifyContent: 'center', alignItems: 'center'}}
                                data={{
                                    labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
                                    datasets: dataIRP,
                                    legend: legendsGraphicIRP // optional
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
                        :
                            <></>
                    }
                </View>

                <View style={{marginBottom: 15}}></View>
                <Title title={'Gráficas Comparativas Altas-Bajas-IRP'} icon={'finance'} tipo={2} vertical={false}/>
                <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 15}}>
                    <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 10}}>
                        <FlatList
                            key={'_8$_'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.list}
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
                    style={{height: 'auto'}}
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

                <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8, paddingBottom: 8, borderBottomColor: '#dadada', borderBottomWidth: 1, marginBottom: 15, marginTop: 15}}/>

                <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 15}}>
                    <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 10}}>
                        <FlatList
                            key={'_$$'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.list}
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
                    style={{height: 'auto'}}
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
            <View style={styles.box}>
                <View style={{width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                    <IonIcons name={iconLeft} size={22} color={color} />
                </View>
                <View style={{width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'flex-start', paddingLeft: 4}}>
                        <Text style={{fontSize: 15, color: color}}>{countTitle}</Text>
                        <Text style={{fontSize: 10, color:'#000'}}>{title}</Text>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', alignSelf: 'stretch'}}>
                        <Text style={{fontSize: 10, color: color, fontWeight: 'bold'}}>{lateral}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', alignSelf: 'stretch'}}>
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

                {
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <HeaderPortrait title={'Reportes Estadísticos'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                    :
                        <HeaderLandscape title={'Reportes Estadísticos'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                }
                
                <View style={[styles.container, {paddingHorizontal: orientationInfo.initial === 'PORTRAIT' ? '3%' : isIphone ? '5%' : '1.5%'}]}>
                    {
                        hasConnection
                        ?
                            <ScrollView
                                onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch'}}
                            >
                                {
                                    !isTablet()
                                    ?
                                        orientationInfo.initial === 'PORTRAIT'
                                        ?
                                            <>
                                                <View style={{marginTop: '3%'}}></View>
                                                <Title icon={'timer-sand'} title={'Información en Tiempo Real'} tipo={2} vertical={false}/>
                                                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                                                    <View style={{flexDirection: 'row', marginBottom: 15}}>
                                                        <Box color={Blue} title={language === '1' ? 'Empleados' : 'Empleados'} countTitle={tiempo_real.empleados && tiempo_real.empleados} iconLeft={'account'} lateral={tiempo_real.empleados_periodo_ant && tiempo_real.empleados_periodo_ant}/>
                                                        <Box color={'#2CA02C'} title={language === '1' ? 'Altas' : 'Altas'} countTitle={tiempo_real.altas_real && tiempo_real.altas_real} iconLeft={'account-plus'} lateral={tiempo_real.altas_real_porcentaje && `${tiempo_real.altas_real_porcentaje}%`} iconLateral={'menu-up'}/>
                                                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : ''} countTitle={tiempo_real.bajas_real && tiempo_real.bajas_real} iconLeft={'account-minus'} lateral={tiempo_real.bajas_real_porcentaje && `${tiempo_real.bajas_real_porcentaje}%`} iconLateral={'menu-down'}/>
                                                    </View>
                                                </View>

                                                <Title title={'Altas y Bajas por Quincena'} icon={'chart-line'} tipo={2} vertical={false}/>

                                                <TouchableOpacity style={[styles.picker, {flexDirection: 'row'}]} onPress={() => handleVisiblePeriodos()}>
                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{color: '#000'}}>{currentQuincena}</Text>
                                                    </View>
                                                    <View style={{width: 'auto'}}>
                                                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                                    </View>
                                                </TouchableOpacity>

                                                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                                                    <View style={{flexDirection: 'row', marginBottom: 15}}>
                                                        <Box color={Blue} title={language === '1' ? 'Empleados' : 'Empleados'} countTitle={altas_bajas_quincenas.empleados_periodo && altas_bajas_quincenas.empleados_periodo} iconLeft={'account'} lateral={altas_bajas_quincenas.activos_semana_ant && altas_bajas_quincenas.activos_semana_ant}/>
                                                        <Box color={'#2CA02C'} title={language === '1' ? 'Altas' : 'Altas'} countTitle={altas_bajas_quincenas.altas && altas_bajas_quincenas.altas} iconLeft={'account-plus'} lateral={altas_bajas_quincenas.altas_porcentaje && `${altas_bajas_quincenas.altas_porcentaje}%`} iconLateral={'menu-up'}/>
                                                    </View>
                                                </View>

                                                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                                                    <View style={{flexDirection: 'row', marginBottom: 15}}>
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
                                                        style={{height: 'auto'}}
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

                                                <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8}}>
                                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 8}}>
                                                            <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>Altas</Text>
                                                        </View>
                                                        <TouchableOpacity onPress={() => setInitialState({...initialState, altas: !altas})} style={{height: 50, width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                                                            <View style={{height: 'auto', width: 'auto', borderRadius: 8, padding: 6, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                                                <IonIcons name={'file-document-outline'} size={20} color='#fff' />
                                                                <Text style={{fontWeight: 'bold', color: '#fff'}}>{language === '1' ? 'Ver detalle de altas' : 'Resume'}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                
                                                <View style={{height:'auto', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 15, flex: 1}}>
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
                                                        style={{
                                                            alignSelf: 'stretch',
                                                            justifyContent: 'flex-start',
                                                            alignItems: 'flex-start',
                                                        }}
                                                        accessor={'product'}
                                                        backgroundColor={'transparent'}
                                                    />
                                                </View>

                                                <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8}}>
                                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 8}}>
                                                            <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>Bajas</Text>
                                                        </View>
                                                        <TouchableOpacity onPress={() => setInitialState({...initialState, bajas: !bajas})} style={{height: 50, width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                                                            <View style={{height: 'auto', width: 'auto', borderRadius: 8, padding: 6, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                                                <IonIcons name={'file-document-outline'} size={20} color='#fff' />
                                                                <Text style={{fontWeight: 'bold', color: '#fff'}}>{language === '1' ? 'Ver detalle de bajas' : 'Resume'}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                <View style={{height:'auto', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'stretch', marginBottom: 15, flex: 1}}>
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
                                                        style={{
                                                            flex: 1,
                                                            justifyContent: 'flex-start',
                                                            alignItems: 'flex-start',
                                                        }}
                                                        backgroundColor={'transparent'}
                                                        accessor={'product'}
                                                    />
                                                </View>

                                                <Title title={'Training'} icon={'chart-bar-stacked'} tipo={2} vertical={false}/>
                                                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                                                    <View style={{flexDirection: 'row', marginBottom: 15}}>
                                                        <Box color={Blue} title={language === '1' ? 'Altas' : 'Altas'} countTitle={training.altas && training.altas} iconLeft={'account'} lateral={altas_bajas_quincenas.activos_semana_ant && altas_bajas_quincenas.activos_semana_ant}/>
                                                        <Box color={'#2CA02C'} title={language === '1' ? 'Activos' : 'Activos'} countTitle={training.activos && training.activos} iconLeft={'account-plus'} lateral={training.activos_porcentaje && `${training.activos_porcentaje}%`} iconLateral={'menu-up'}/>
                                                        <Box color={'#FF0000'} title={language === '1' ? 'Bajas' : 'Bajas'} countTitle={training.activos && training.activos} iconLeft={'account-minus'} lateral={training.bajas_porcentaje && `${training.bajas_porcentaje}%`} iconLateral={'menu-down'}/>
                                                    </View>
                                                </View>

                                                <View style={{height: 35, alignSelf: 'stretch', paddingHorizontal: 8, backgroundColor: 'rgba(50,131,197,.1)', borderColor: Blue, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center', marginHorizontal: 1.5, marginBottom: 8}}>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: 'auto', justifyContent: 'center'}}>
                                                            <Icon name={'info'} size={24} color={Blue} />
                                                        </View>
                                                        <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 8}}>
                                                            <Text style={{fontWeight: 'bold', color: Blue, fontSize: 18}}>Detalles</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <FlatList
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={[styles.list, {marginBottom: 10}]}
                                                    data={training_categorias}
                                                    numColumns={2}
                                                    renderItem={({item}) => <Detalle_Gerencia id={item.id} campanna={item.campanna} altas={item.altas} activos={item.activos} bajas={item.bajas} total={item.total} tipo={2}/>}
                                                    keyExtractor={item => String(item.id)}
                                                />
                                                

                                                <View style={{height: 'auto', marginBottom: 15}}>
                                                    <View style={{height: 'auto', alignSelf: 'stretch'}}>
                                                        <FlatList
                                                            showsVerticalScrollIndicator={false}
                                                            showsHorizontalScrollIndicator={false}
                                                            style={styles.list}
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
                                                                style={styles.list}
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
                                                                    style={styles.list}
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
                                                                    style={styles.list}
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
                                                    style={styles.list}
                                                    data={empleados_ubicacion}
                                                    numColumns={2}
                                                    renderItem={({item}) => <Empleados_Ubicacion name={item.name} total={item.total} color={item.color}/>}
                                                    keyExtractor={item => String(item.id)}
                                                />

                                                <View style={{marginBottom: 15}}></View>
                                                <Title title={'Empleados por Razón Social'} icon={'account-multiple'} tipo={2} vertical={false}/>
                                                <FlatList
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={styles.list}
                                                    data={empleados_razon_social}
                                                    numColumns={1}
                                                    renderItem={({item}) => <Empleados_Razon_Social name={item.name} total={item.total}/>}
                                                    keyExtractor={item => String(item.id)}
                                                />
                                                
                                                <View style={{marginBottom: 15}}></View>
                                                <Title title={title} icon={'finance'} tipo={2} vertical={false}/>
                                                <View style={{height: 'auto',  backgroundColor: 'rgba(50,131,197,.1)', borderColor: Blue, borderWidth: .5, padding: 3, marginBottom: 8}}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6}}>
                                                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>{total}</Text>
                                                        </View>
                                                        <Text style={{fontWeight: 'bold', color: Blue, fontSize: 18}}>Detalle de Área</Text>
                                                    </View>
                                                </View>
                                                <TouchableOpacity style={[styles.picker, {flexDirection: 'row'}]} onPress={() => handleVisibleArea()}>
                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{color: '#000'}}>{currentArea}</Text>
                                                    </View>
                                                    <View style={{width: 'auto'}}>
                                                        <Icon name='caret-down' size={15} color={'#4F4F4F'} />
                                                    </View>
                                                </TouchableOpacity>

                                                <View style={{flex: 1, height: 'auto', marginHorizontal: 1.5}}>

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
                                                        style={{
                                                            alignSelf: 'stretch',
                                                            justifyContent: 'flex-start',
                                                            alignItems: 'flex-start',
                                                        }}
                                                        accessor={'product'}
                                                        backgroundColor={'transparent'}
                                                    />
                                                </View>

                                                <View style={{height: 35, alignSelf: 'stretch', paddingHorizontal: 8, backgroundColor: 'rgba(50,131,197,.1)', borderColor: Blue, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginTop: 8}}>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: 'auto', justifyContent: 'center'}}>
                                                            <Icon name={'info'} size={24} color={Blue} />
                                                        </View>
                                                        <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 8}}>
                                                            <Text style={{fontWeight: 'bold', color: Blue, fontSize: 18}}>Detalle de Subárea</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                                <TouchableOpacity style={[styles.picker, {flexDirection: 'row'}]} onPress={() => handleVisibleSubarea()}>
                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{color: '#000'}}>{currentSubarea}</Text>
                                                    </View>
                                                    <View style={{width: 'auto'}}>
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
                                                    style={{
                                                        alignSelf: 'stretch',
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'flex-start',
                                                    }}
                                                    accessor={'product'}
                                                    backgroundColor={'transparent'}
                                                />

                                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 8, borderTopStartRadius: 16, borderTopEndRadius: 16}}>
                                                    <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 2, borderTopStartRadius: 16, borderTopEndRadius: 16}}>
                                                        <IonIcons name={'menu'} size={28} color={Blue} />
                                                        <View style={{width: 4}}></View>
                                                        <Text style={{color: Blue, fontSize: 16, fontWeight: 'bold'}}>Empleados por Razón Social</Text>
                                                    </View>
                                                </View>
                                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                                    {
                                                        total_razon_social.length > 0
                                                        &&
                                                            total_razon_social.map(x => 
                                                                <View key={x.id} style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#fff', borderColor: '#CBCBCB', borderWidth: 1, borderTopWidth: 0.5, borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4}}>
                                                                    <View style={{flex: 1, paddingHorizontal: 8}}>
                                                                        <Text style={{color: Blue, fontSize: 12}}>{x.name}</Text>
                                                                    </View>
                                                                    <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 4}}>
                                                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>{x.total}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                    }
                                                </View>
                                                <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopWidth: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4, borderBottomStartRadius: 16, borderBottomEndRadius: 16}}>
                                                    <View style={{flex: 1, paddingHorizontal: 4}}>
                                                        <Text style={{color: Blue, fontSize: 14, fontWeight: 'bold'}}>Total General</Text>
                                                    </View>
                                                    <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2}}>
                                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>{total}</Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={{marginBottom: 15}}></View>
                                                <Title title={'Índice de Rotación de Personal'} icon={'finance'} tipo={2} vertical={false}/>
                                                <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 15}}>
                                                    <FlatList
                                                        showsVerticalScrollIndicator={false}
                                                        showsHorizontalScrollIndicator={false}
                                                        style={styles.list}
                                                        data={legendsIRP}
                                                        numColumns={4}
                                                        renderItem={({item}) => <Year year={item.year} checked={item.checked}/>}
                                                        keyExtractor={item => String(item.id)}
                                                    />
                                                </View>
                                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                                    {
                                                        content
                                                        ?
                                                            <LineChart
                                                                fromZero={true}
                                                                style={{justifyContent: 'center', alignItems: 'center'}}
                                                                data={{
                                                                    labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
                                                                    datasets: dataIRP,
                                                                    legend: legendsGraphicIRP // optional
                                                                }}
                                                                width={Dimensions.get('window').width}
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
                                                        :
                                                            <></>
                                                    }
                                                </View>
                                                
                                                <View style={{marginBottom: 15}}></View>
                                                <Title title={'Gráficas Comparativas Altas-Bajas-IRP'} icon={'finance'} tipo={2} vertical={false}/>
                                                <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 15}}>
                                                    <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 10}}>
                                                        <FlatList
                                                            showsVerticalScrollIndicator={false}
                                                            showsHorizontalScrollIndicator={false}
                                                            style={styles.list}
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
                                                    style={{height: 'auto'}}
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

                                                <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8, paddingBottom: 8, borderBottomColor: '#dadada', borderBottomWidth: 1, marginBottom: 15, marginTop: 15}} />

                                                <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 15}}>
                                                    <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 10}}>
                                                        <FlatList
                                                            showsVerticalScrollIndicator={false}
                                                            showsHorizontalScrollIndicator={false}
                                                            style={styles.list}
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
                                                    style={{height: 'auto'}}
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
                        :
                            <>
                                <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			                    <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                                <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>
                            </>
                    }
                </View>
                <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>

                <Modal visibility={altas} orientation={orientationInfo.initial} handleDismiss={() => setInitialState({...initialState, altas: !altas})}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <Title title={language === '1' ? 'Detalle de Altas' : 'Resume'} icon={'chart-bar-stacked'} tipo={2} vertical={false} itCloses={() => setInitialState({...initialState, altas: !altas})}/>
                        <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 6, borderTopStartRadius: 16, borderTopEndRadius: 16}}>
                                <IonIcons name={'menu'} size={28} color={Blue} />
                                <View style={{width: 4}}></View>
                                <Text style={{color: Blue, fontSize: 16}}>Altas por Subárea</Text>
                            </View>
                        </View>
                        <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                        {
                            detalle_altas.length > 0
                            &&
                                detalle_altas.map(x => 
                                    <View key={x.id} style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#fff', borderColor: '#CBCBCB', borderWidth: 1, borderTopWidth: 0.5, borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4}}>
                                        <View style={{flex: 1, paddingHorizontal: 8}}>
                                            <Text style={{color: Blue}}>{x.name}</Text>
                                        </View>
                                        <View style={{width: x.total.toString().length === 2 ? 'auto' : 25, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 2, paddingHorizontal: 4}}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>{x.total}</Text>
                                        </View>
                                    </View>
                                )
                        }
                            
                        </View>
                        <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#f7f7f7', borderColor: '#CBCBCB', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopWidth: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4, borderBottomStartRadius: 16, borderBottomEndRadius: 16}}>
                            <View style={{flex: 1, paddingHorizontal: 8}}>
                                <Text style={{color: Blue, fontWeight: 'bold'}}>{language === '1' ? 'Total General' : ''}</Text>
                            </View>
                            <View style={{width: 'auto', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2}}>
                                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>{altas_bajas_quincenas.altas && altas_bajas_quincenas.altas}</Text>
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
                        style={styles.list}
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
                    <Select dataArea={areas} handleVisibleArea={handleVisibleArea} handleActionDos={handleActionDos} />
                </Modal>

                <Modal orientation={orientationInfo.initial} visibility={visibleSubarea} handleDismiss={handleVisibleSubarea}>
                    <Select dataArea={subareas} handleVisibleArea={handleVisibleSubarea} handleActionDos={handleActionTres} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: isIphone ? '5%' : '3%',
        backgroundColor: '#fff'
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 15,
        height: 50,
        paddingHorizontal: 16,
        alignSelf: 'stretch',
        borderRadius: 16
    },
    list:{
        height: 'auto',
        alignSelf: 'stretch',
    },
    box: {
        flex: 1,
        borderColor: '#CBCBCB',
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingHorizontal: 4,
        shadowColor: '#000',
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        borderRadius: 16,
        marginHorizontal: 5
    }
})