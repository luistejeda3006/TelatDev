import React, {useCallback, useEffect, useState, useRef} from 'react'
import {View, Text, StatusBar, SafeAreaView, FlatList, Image, TouchableOpacity, Alert} from 'react-native'
import {isIphone, live, login, urlQuiniela } from '../../../access/requestedData'
import {barStyle, barStyleBackground, Blue, Orange, SafeAreaBackground} from '../../../colors/colorsApp'
import {HeaderPortrait, HeaderLandscape, FailedNetwork, Modal, ModalLoading} from '../../../components'
import {useConnection, useNavigation, useOrientation} from '../../../hooks'
import * as Animatable from 'react-native-animatable';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome'
import {useDispatch, useSelector} from 'react-redux'
import {actionItem, selectData, selectPoints, selectFilteredData, selectQuinielas, setData, setFilteredData, setDataSelected, setQuinielas, setFilteredSelected, setPoints, selectGlobal, setGlobal, selectInstructions, setInstructions} from '../../../slices/worldCupSlice'
import {useFocusEffect} from '@react-navigation/native'
import {selectTokenInfo, selectUserInfo} from '../../../slices/varSlice'
import tw from 'twrnc';

let data = [];
let points = [];
let global = [];
let instructions = [];
let teamUno = []
let teamDos = []
let game = undefined;

let filteredData = [];
let quinielas = [];

let id_usuario = null;
let token = ''
let user = ''
let cuenta = 0;

export default ({navigation, route: {params: {language, orientation}}}) => {
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)

    const refGroup = useRef()
    const refQuiniela = useRef()
    const dispatch = useDispatch()
    data = useSelector(selectData)
    points = useSelector(selectPoints)
    global = useSelector(selectGlobal)
    filteredData = useSelector(selectFilteredData)
    quinielas = useSelector(selectQuinielas)
    instructions = useSelector(selectInstructions)

    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [temporalId, setTemporalId] = useState(0)
    const {hasConnection, askForConnection} = useConnection()
    const [section, setSection] = useState(1)
    const [initialState, setInitialState] = useState({
        visibleInstructions: false,
        sectionOpened: 1,
    })

    const {sectionOpened, visibleInstructions} = initialState
 
    const {handlePath} = useNavigation();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const getInformation = async () => {
        id_usuario = user.data.datos_personales.id_usuario
        
        try{
            if(cuenta === 0){
                cuenta = cuenta + 1;
                setLoading(true)
            }   
            const body = {
                "action": "get_quiniela",
                "data": {
                    "id_usuario": id_usuario,
                    "language": language
                },
                "live": live,
                "login": login
            }

            const request = await fetch(urlQuiniela, {
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
                    dispatch(setData(response.quiniela))
                    dispatch(setPoints(response.puntos))
                    dispatch(setGlobal(response.posiciones))
                    dispatch(setInstructions(response.instructions))
                    setLoading(false)
                    setLoaded(true)
                }, 500)
                
            }
        }
        catch(e){
            console.log('Algo pasó con el internet')
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    useEffect(() => {
        getInformation()
    }, [])

    useEffect(() => {
        if((section === 1 || section === 2) && data.length > 0){
            const clasified_1 = section === 1 ? 'G' : 'F'
            const clasified_2 = section === 1 ? 'F' : 'G'
            const nuevos = data.filter(x => x.clasified === clasified_1)
            const otras = data.filter(x => x.clasified === clasified_2)
            const found_1 = data.find(x => x.clasified === 'G')
            const found_2 = data.find(x => x.clasified === 'F')
            const finals = nuevos.map(x => (x.id === found_1.id) || (x.id === found_2.id) ? ({...x, selected: true}) : ({...x, selected: false}))
            const quinielas = finals[0]
            setTemporalId(quinielas.id)
            dispatch(setQuinielas(quinielas.partidos.map(x => ({...x, oculta: true, total_1: !x.completed ? 0 : x.total_1, total_2: !x.completed ? 0 : x.total_2, lock: !x.completed && false}))))
            dispatch(setData([...finals, ...otras]))
            dispatch(setFilteredData(finals))
        }
    },[section, loaded])

    const handleOculta = (id, id_game) => {
        game = id_game;
        const nuevos = quinielas.map(x => x.id === id ? ({...x, oculta: false}) : ({...x, oculta: true}))
        const edited = data.find(x => x.id === temporalId)

        const obj = {
            id: edited.id,
            name: edited.name,
            selected: true,
            partidos: nuevos
        }
        
        dispatch(setQuinielas(nuevos))
        dispatch(actionItem({id: temporalId, item: obj}))
    }

    const handleErase = (id, appear) => {
        if(appear){
            Alert.alert(

                'Borrar resultados',
                '¿Seguro que deseas borrar tus resultados?',
                [
                    {
                        text: 'Cancelar',
                        style: "cancel"
                    },
                    { 
                        text: "Sí, estoy seguro", 
                        onPress: () => {
                            const nuevos = quinielas.map(x => x.id === id ? ({...x, total_1: 0, total_2: 0, empate: 0, lock: false}) : ({...x, lock: false}))
                            const edited = data.find(x => x.id === temporalId)
                            const obj = {
                                id: edited.id,
                                name: edited.name,
                                selected: true,
                                partidos: nuevos
                            }
                            
                            dispatch(actionItem({id: temporalId, item: obj}))
                            dispatch(setQuinielas(nuevos))
                        }
                    }
                ]
            )
        }
    }

    const handleActionTeamUno = useCallback((id, tipo, total_1, total_2) => {
        teamUno = quinielas.map(x => x.id === id ? ({...x, total_1: tipo === '+' ? (total_1 < 20) ? (total_1 + 1) : total_1 : (total_1 > 0) ? (total_1 - 1) : 0}) : ({...x, lock: tipo === '+' ? ((total_1 + 1) !== 0) ? true : false : (((total_1 - 1) !== 0) && (total_1 > 0) || (total_2 !== 0)) ? true : false}))
        const edited = data.find(x => x.id === temporalId)

        const obj = {
            id: edited.id,
            name: edited.name,
            selected: true,
            partidos: teamUno
        }
        
        dispatch(actionItem({id: temporalId, item: obj}))
        dispatch(setQuinielas(teamUno))
    })

    const handleActionTeamDos = useCallback((id, tipo, total_2, total_1) => {
        teamDos = quinielas.map(x => x.id === id ? ({...x, total_2: tipo === '+' ? (total_2 < 20) ? (total_2 + 1) : total_2 : (total_2 > 0) ? (total_2 - 1) : 0}) : ({...x, lock: tipo === '+' ? ((total_2 + 1) !== 0) ? true : false : (((total_2 - 1) !== 0) && (total_2 > 0) || (total_1 !== 0)) ? true : false}))
        const edited = data.find(x => x.id === temporalId)

        const obj = {
            id: edited.id,
            name: edited.name,
            selected: true,
            partidos: teamDos
        }
        
        dispatch(actionItem({id: temporalId, item: obj}))
        dispatch(setQuinielas(teamDos))
    })

    const handleCompleted = (id) => {
        Alert.alert(
            'Guardar quiniela',
            '¿Seguro que deseas guardar tus resultados?\n\nUna vez guardados, no podrás cambiarlos.',
            [
                {
                    text: 'Cancelar',
                    style: "cancel"
                },
                { 
                    text: "Sí, estoy seguro", 
                    onPress: async () => {
                        const total_1 = teamUno.find(x => x.id === id)
                        const total_2 = teamDos.find(x => x.id === id)
                        
                        let final_total_1 = total_1 ? total_1.total_1 : 0
                        let final_total_2 = total_2 ? total_2.total_2 : 0
                        
                        /* setLoading(true) */
                        try{
                            const body = {
                                "action": "save_resultado",
                                "data": {
                                    "id_usuario": id_usuario,
                                    "id_game": game,
                                    "goles_local": final_total_1,
                                    "goles_visit": final_total_2
                                },
                                "live": live,
                                "login": login
                            }
                            
                            const request = await fetch(urlQuiniela, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    token: token,
                                },
                                body: JSON.stringify(body)
                            });
                            
                            const {response, status} = await request.json();
                            if(status){
                                let nuevos = quinielas.map(x => x.id === id ? ({...x, completed: true, oculta: true, lock: true, fill: status !== 200 ? true : false}) : ({...x, lock: false}))
                                const edited = data.find(x => x.id === temporalId)

                                const uncompleted = nuevos.find(x => !x.completed)
                                
                                const obj = {
                                    id: edited.id,
                                    name: edited.name,
                                    completed: uncompleted ? false : true,
                                    selected: true,
                                    partidos: nuevos
                                }
                                
                                const finales = data.map(x => x.id !== temporalId ? x : ({...x, ...obj}))

                                const ocup = section === 1 ? 'G' : 'F'
                                let filtered = finales.filter(x => x.clasified === ocup)

                                if(status === 200 || status === 400){
                                    dispatch(actionItem({id: temporalId, item: obj}))
                                    dispatch(setFilteredData(filtered))
                                    dispatch(setQuinielas(nuevos))
                                    if(status === 400){
                                        Alert.alert(
                                            'Partido en proceso',
                                            'No puedes llenar la quiniela una vez que el partido ha comenzado',
                                            [
                                                { 
                                                    text: "OK"
                                                }
                                            ]
                                        )
                                    }
                                }
                            }
                        }catch(e){
                            console.log('Algo pasó con el internet')
                        }
                    }
                }
            ]
        )
    }

    const handleGrupo = (id, partidos) => {
        setTemporalId(id)
        dispatch(setQuinielas(partidos.map(x => ({...x, oculta: true, total_1: !x.completed ? 0 : x.total_1, total_2: !x.completed ? 0 : x.total_2, lock: !x.completed && false}))))
        dispatch(setDataSelected(id))
        dispatch(setFilteredSelected(id))
        refQuiniela.current?.scrollToOffset({ animated: true, offset: 0 })
    }

    const GlobalPodium = ({id, position, name, record, color}) => {
		return(
			<Animatable.View 
				duration={2000}	
				animation={'fadeInDownBig'}
                style={tw`h-9 self-stretch border-b-[#dadada] border-b border-t-[#dadada] ${id === 1 ? 'border-t' : ''} justify-center items-center flex-row bg-[${id % 2 === 1 ? '#f7f7f7' : '#fff'}]`}
			>
				<View style={tw`h-14 w-14 justify-center items-center`}>
					<Text style={tw`text-[${color}] text-sm font-${color === Blue ? 'bold' : 'normal'}`}>{position}</Text>
				</View>
                <View style={tw`flex-row flex-1`}>
                    <View style={tw`flex-1 justify-center items-start`}>
                        <Text style={tw`text-[${color}] text-sm font-${color === Blue ? 'bold' : 'normal'}`}>{name}</Text>
                    </View>
                    <View style={tw`w-24 justify-center items-center`}>
                        <Text style={tw`text-[${color}] text-sm font-${color === Blue ? 'bold' : 'normal'}`}>{record}</Text>
                    </View>
                </View>
                <View style={tw`h-14 w-14 justify-center items-center`}>
                    <View 
                        style={tw`h-6 w-6 rounded-3xl bg-[${(id === 1 || id === 2 || id === 3) ? id === 1 ? '#FFD700' : id === 2 ? '#A8B4B9' : '#C36C3F' : '#'}] justify-center items-center pt-0.5 ios:pl-px`}>
                        <IonIcons size={16} color={(id === 1 || id === 2 || id === 3) ? '#fff' : 'transparent'} name={'trophy-variant'}/>
                    </View>
                </View>
			</Animatable.View>
		)
	}

    const Grupo = ({id, name, selected, completed, partidos}) => {
        return(
            <>
                <TouchableOpacity onPress={() => handleGrupo(id, partidos)}
                    style={tw`h-auto w-auto p-2 justify-center items-center bg-[${selected ? Orange : 'rgba(225,89,37,.5)'}] border border-[${Orange}] ml-${id === 1 ? 2.5 : 1.5} mr-2.5 z-0 rounded-xl`}
                >
                    <Text style={tw`font-bold text-[${selected ? '#fff' : '#dadada'}] text-base`}>{name}</Text>
                </TouchableOpacity>
                {
                    !completed
                    &&
                        <Animatable.View
                            duration={1500}	
                            animation={'rubberBand'}
                            iterationCount={'infinite'}
                            style={tw`w-4 h-4 bg-white rounded-3xl absolute right-0 justify-center items-center ios:pl-px border border-[${Orange}]`}
                        >
                            <Icon name={'exclamation'} size={9} color={Orange} />
                        </Animatable.View>
                }
            </>
        )
    }
    
    const Quiniela = ({id, id_game, fill, equipo_1, equipo_2, total_1, total_2, img_1, img_2, oculta, completed, lock, backgroundColor, total_color, text_color, fecha, instruction = false}) => {
        return(
            equipo_1.includes('Jornada') || equipo_1.includes('Day')
            ?
                <View style={tw`h-12.5 self-stretch bg-[rgba(247,247,247,.5)] justify-center items-center border-b border-b-[#dadada] border-t border-t-[#dadada] mb-2.5`}> 
                    <Text style={tw`text-[#adadad] font-bold text-base`}>{equipo_1}</Text>
                </View>
            :
                !oculta
                ?
                    <>
                        <View style={tw`justify-center items-center h-auto self-stretch flex-row mx-2.5 ${id === 1 ? 'mt-2.5' : ''}`}>
                            <View 
                                style={tw`w-auto h-auto bg-[#f7f7f7] justify-center items-center px-1.5 py-1 border-l border-l-[#dadada] border-r border-r-[#dadada] border-t border-t-[#dadada] flex-row rounded-t-xl`}>
                                <IonIcons name={'calendar-clock'} size={16} color={Blue} />
                                <Text style={tw`text-xs text-black ml-1.5`}>{fecha}</Text>
                            </View>
                        </View>
                        <View style={tw`px-1.5 pb-1.5 mb-${oculta ? 1.5 : 2.5} mx-2.5 h-auto self-stretch border border-[#dadada] rounded-3xl bg-white`}>
                            <View style={tw`h-auto self-stretch flex-row justify-center items-center`}>
                                <View style={tw`flex-1 h-12.5 justify-center items-center flex-row`}>
                                    <View style={tw`h-[100%] self-stretch flex-row justify-center items-center`}>
                                        <View 
                                            
                                            style={tw`flex-row rounded-3xl h-9.5 w-[100%] justify-center items-center`}>
                                            <View 
                                                style={tw`h-9 w-9 justify-center items-center rounded-3xl p-1.5 border border-[#dadada]`}>
                                                <Image
                                                    style={tw`w-7.5 h-7.5 rounded-3xl`}
                                                    resizeMode={'cover'}
                                                    source={{uri: img_1}}
                                                />
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <Text style={tw`text-sm text-center font-bold text-[#000]`}>{equipo_1}</Text>
                                            </View>
                                            <View style={tw`h-8 w-8 justify-center items-center bg-[${Orange}] rounded-3xl ios:pl-px border border-[#dadada]`}>
                                                <Text style={tw`font-bold text-white text-xs`}>{total_1}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={tw`w-2.5`} />
                                <View style={tw`flex-1 h-12.5 justify-center items-center flex-row`}>
                                    <View style={tw`flex-row rounded-3xl h-9.5 w-[100%] justify-center items-center`}>
                                        <View 
                                            style={tw`h-8 w-8 justify-center items-center bg-[${Orange}] rounded-3xl ios:pl-px border border-[#dadada]`}>
                                            <Text style={tw`font-bold text-white text-xs`}>{total_2}</Text>
                                        </View>
                                        <View style={tw`flex-1 justify-center items-center`} >
                                            <Text style={tw`text-sm text-center font-bold text-[#000]`}>{equipo_2}</Text>
                                        </View>
                                        <View style={tw`h-9 w-9 justify-center items-center rounded-3xl border border-[#dadada]`}>
                                            <Image
                                                style={tw`w-7.5 h-7.5 rounded-3xl`}
                                                resizeMode={'cover'}
                                                source={{uri: img_2}}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={tw`flex-row h-auto self-stretch`}>
                                <View style={tw`flex-1 h-9 mx-2.5 justify-center items-center flex-row`}>
                                    <View style={tw`flex-1 flex-row justify-center items-center`}>
                                        <TouchableOpacity 
                                            onPress={() => handleActionTeamUno(id, '-', total_1, total_2)}
                                            style={tw`w-9 h-9 bg-[#f7f7f7] rounded-3xl justify-center items-center ios:pl-px border border-[#dadada]`}>
                                            <IonIcons name={'minus'} size={25} color={'#000'} />
                                        </TouchableOpacity>
                                        <View style={tw`w-2.5`} />
                                        <TouchableOpacity 
                                            onPress={() => handleActionTeamUno(id, '+', total_1, total_2)}
                                            style={tw`w-9 h-9 bg-[${Blue}] rounded-3xl justify-center items-center ios:pl-px border border-[${barStyleBackground}]`}>
                                            <IonIcons name={'plus'} size={25} color={'#fff'} />
                                        </TouchableOpacity>
                                        <View style={tw`w-2.5`} />
                                    </View>
                                </View>
                                <View style={tw`flex-1 h-9 mx-2.5 justify-center items-center flex-row`}>
                                    <View style={tw`flex-1 flex-row justify-center items-center`}>
                                        <TouchableOpacity onPress={() => handleActionTeamDos(id, '-', total_2, total_1)}
                                            style={tw`w-9 h-9 bg-[#f7f7f7] rounded-3xl justify-center items-center ios:pl-px border border-[#dadada]`}>
                                            <IonIcons name={'minus'} size={25} color={'#000'} />
                                        </TouchableOpacity>
                                        <View style={tw`w-2.5`} />
                                        <TouchableOpacity
                                            onPress={() => handleActionTeamDos(id, '+', total_2, total_1)}
                                            style={tw`w-9 h-9 bg-[${Blue}] rounded-3xl justify-center items-center ios:pl-px border border-[${barStyleBackground}]`}>
                                            <IonIcons name={'plus'} size={25} color={'#fff'} />
                                        </TouchableOpacity>
                                        <View style={tw`w-2.5`} />
                                    </View>
                                </View>
                            </View>
                            <View 
                                style={tw`flex-1 justify-center items-center flex-row mt-2.5 pb-1.5`}>
                                <TouchableOpacity onPress={() => handleErase(id, (total_1 === 0 && total_2 === 0) ? false : true)}
                                    style={tw`h-auto flex-1 py-1.5 bg-[#f7f7f7] rounded-xl justify-center items-center pl-px border border-[#dadada] flex-row`}>
                                    <IonIcons name={'eraser'} size={22} color={'#000'} />
                                    <Text style={tw`font-bold text-sm text-black ml-1.5`}>{language === '1' ? 'Limpiar' : 'Clean'}</Text>
                                </TouchableOpacity>
                                <View style={{width: 5}}/>
                                <TouchableOpacity 
                                    onPress={() => handleCompleted(id)}
                                    style={tw`h-auto flex-1 py-1.5 bg-[${Blue}] rounded-xl justify-center items-center pl-px border border-[${Blue}] flex-row`}>
                                    <IonIcons name={'check-bold'} size={20} color={'#fff'} />
                                    <Text style={tw`font-bold text-sm text-white ml-1.5`}>{language === '1' ? 'Guardar' : 'Save'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                :
                    (completed || lock)
                    ?
                        <>
                            <View style={tw`justify-center items-center h-auto self-stretch mt-${id === 1 ? '2.5' : 'px'} flex-row mx-2.5`}>
                                <View style={tw`w-auto h-auto bg-[#f7f7f7] justify-center items-center px-1.5 py-1 border-l border-l-[#dadada] border-r border-r-[#dadada] border-t border-t-[#dadada] flex-row rounded-t-xl`}>
                                    <IonIcons name={'calendar-clock'} size={16} color={Blue} />
                                    <Text style={tw`text-xs text-black ml-1.5`}>{fecha}</Text>
                                </View>
                            </View>
                            <View style={tw`h-auto self-stretch bg-[${completed ? backgroundColor : '#f7f7f7'}] flex-row justify-center items-center px-1.5 border border-[#dadada] mb-2.5 rounded-3xl mx-2.5`}>
                                <View style={tw`flex-1 h-12.5 justify-center items-center flex-row`}>
                                    <View style={tw`h-[100%] self-stretch flex-row justify-center items-center`}>
                                        <View style={tw`flex-row rounded-3xl h-9.5 w-[100%] justify-center items-center`}>
                                            <View style={tw`h-9 w-9 justify-center items-center rounded-3xl ios:pl-px border border-[#dadada]`}>
                                                {
                                                    equipo_1
                                                    ?
                                                        <Image
                                                            style={tw`w-7.5 h-7.5 rounded-3xl`}
                                                            resizeMode={'cover'}
                                                            source={{uri: img_1}}
                                                        />
                                                    :
                                                        <IonIcons name={equipo_1 ? 'clock-outline' : 'help'} size={18} color={completed ? text_color : '#000'} />
                                                }
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`} >
                                                <Text style={tw`text-sm text-center font-bold text-[#000]`}>{equipo_1 ? equipo_1 : '--------'}</Text>
                                            </View>
                                            <View
                                                style={tw`h-8 w-8 justify-center items-center bg-[${completed ? total_color : '#f7f7f7'}] rounded-3xl ios:pl-px border border-[#dadada]`}>
                                                {
                                                    completed
                                                    ?
                                                        fill
                                                        ?
                                                            <Icon name={'minus'} size={10} color={'#000'} />
                                                        :
                                                            <Text style={tw`font-bold text-[${instruction ? '#fff' : completed ? text_color : '#000'}] text-xs`}>{total_1}</Text>
                                                    :
                                                        <></>
                                                }
                                                {
                                                    lock && !completed
                                                    &&
                                                        <IonIcons name={equipo_1 ? 'clock-outline' : 'help'} size={18} color={completed ? text_color : '#000'} />
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={tw`w-2.5`} />
                                <View style={tw`flex-1 h-12.5 justify-center items-center flex-row`}>
                                    <View style={tw`flex-row rounded-3xl h-10 w-[100%] justify-center items-center`}>
                                        <View style={tw`h-8 w-8 justify-center items-center bg-[${completed ? total_color : '#f7f7f7'}] rounded-3xl ios:pl-px border border-[#dadada]`}>
                                            {
                                                completed
                                                ?
                                                    fill
                                                    ?
                                                        <Icon name={'minus'} size={10} color={'#000'} />
                                                    :
                                                        <Text style={tw`font-bold text-[${instruction ? '#fff' : completed ? text_color : '#000'}] text-xs`}>{total_2}</Text>
                                                :
                                                    <></>
                                            }
                                            {
                                                lock && !completed
                                                &&
                                                    <IonIcons name={equipo_2 ? 'clock-outline' : 'help'} size={18} color={completed ? text_color : '#000'} />
                                            }
                                        </View>
                                        <View style={tw`flex-1 justify-center items-center`} >
                                            <Text style={tw`text-sm text-center font-bold text-[#000]`}>{equipo_2 ? equipo_2 : '--------'}</Text>
                                        </View>
                                        <View style={tw`h-9 w-9 justify-center items-center rounded-3xl ios:pl-px border border-[#dadada]`}>
                                            {
                                                equipo_2
                                                ?
                                                    <Image
                                                        style={tw`w-7.5 h-7.5 rounded-3xl`}
                                                        resizeMode={'cover'}
                                                        source={{uri: img_2}}
                                                    />
                                                :
                                                    <IonIcons name={equipo_2 ? 'clock-outline' : 'help'} size={18} color={completed ? text_color : '#000'} />
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </>
                    :
                        <>
                            <View style={tw`justify-center items-center h-auto self-stretch flex-row mx-2.5 ${id === 1 ? 'mt-2.5' : ''}`}>
                                <View style={tw`w-auto h-auto bg-[#f7f7f7] justify-center items-center px-1.5 py-1 border-l border-l-[#dadada] border-r border-r-[#dadada] border-t border-t-[#dadada] flex-row rounded-t-xl`}>
                                    <IonIcons name={'calendar-clock'} size={16} color={Blue} />
                                    <Text style={tw`text-xs text-black ml-1.5`}>{fecha}</Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                onPress={() => handleOculta(id, id_game)}
                                style={tw`h-auto self-stretch bg-white flex-row justify-center items-center px-1.5 border border-[#dadada] mx-2.5 mb-2.5 rounded-3xl bg-white`}>
                                <View style={tw`flex-1 h-12.5 justify-center items-center flex-row`}>
                                    <View
                                        style={tw`h-[100%] self-stretch flex-row justify-center items-center`}>
                                        <View style={tw`flex-row rounded-3xl h-9.5 w-[100%] justify-center items-center`}>
                                            <View style={tw`h-9 w-9 justify-center items-center rounded-3xl p-1.5 border border-[#dadada]`}>
                                                <Image
                                                    style={tw`w-7.5 h-7.5 rounded-3xl`}
                                                    resizeMode={'cover'}
                                                    source={{uri: img_1}}
                                                />
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`} >
                                                <Text style={tw`text-sm text-center font-bold text-[#000]`}>{equipo_1}</Text>
                                            </View>
                                            <View style={tw`h-8 w-8 justify-center items-center bg-[${Orange}] rounded-3xl ios:pl-px border border-[#dadada]`}>
                                                <Text style={tw`font-bold text-white text-xs`}>{total_1}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={tw`w-2.5`} />
                                <View style={tw`flex-1 h-12.5 justify-center items-center flex-row`}>
                                    <View style={tw`flex-row rounded-3xl h-9.5 w-[100%] justify-center items-center`}>
                                        <View style={tw`h-8 w-8 justify-center items-center bg-[${Orange}] rounded-3xl ios:pl-px border border-[#dadada]`}>
                                            <Text style={tw`font-bold text-white text-xs`}>{total_2}</Text>
                                        </View>
                                        <View style={tw`flex-1 justify-center items-center`} >
                                            <Text style={tw`text-sm text-center font-bold text-[#000]`}>{equipo_2}</Text>
                                        </View>
                                        <View style={tw`h-9 w-9 justify-center items-center rounded-3xl border border-[#dadada]`}>
                                            <Image
                                                style={tw`w-7.5 h-7.5 rounded-3xl`}
                                                resizeMode={'cover'}
                                                source={{uri: img_2}}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </>
        )
    }

    const reloading = () => {
        setLoaded(true)
    }

    const Instructions = ({id, total, tipo, tipo_en, example}) => {
        return(
            <>
                <View style={tw`border border-[#dadada] shadow-md bg-white m-1 mb-${id !== total ? 5 : 2}`}>
                    <View style={tw`px-2.5 py-1.5 mb-2.5 border-b border-b-[#dadada] justify-center items-center bg-[rgba(247,247,247,.5)]`}>
                        <Text style={tw`text-xs text-[#000] font-bold`}>{language === '1' ? tipo : tipo_en}</Text>
                    </View>
                    <Quiniela {...example}/>
                </View>
            </>
        )
    }

    const Points = ({type, pointsWinner, pointsResult}) => {
        return(
            <View style={tw`h-12.5 self-stretch flex-row border-b border-b-[#dadada] border-l border-l-[#dadada] border-r border-r-[#dadada] mx-1`}>
                <View style={tw`flex-2 justify-center pl-2.5 text-xs`}>
                    <Text style={tw`text-[#000]`}>{type}</Text>
                </View>
                <View style={tw`flex-1 justify-center items-center`}>
                    <Text style={tw`text-[${Blue}] font-bold text-xs`}>{pointsWinner}</Text>
                </View>
                <View style={tw`flex-1 justify-center items-center`}>
                    <Text style={tw`text-[${Blue}] font-bold text-xs`}>{pointsResult}</Text>
                </View>
            </View>
        )
    }

    return(
        hasConnection
        ?
            <>
                {
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <>
                            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                            <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }}/>
                            <HeaderPortrait title={'Quiniela Mundialista'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
                        </>
                    :
                        <HeaderLandscape title={'Quiniela Mundialista'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
                }
                <View style={tw`flex-1 items-center bg-white`}>
                    <View style={tw`h-11 flex-row items-center justify-center border-b-[#dadada] border-b`}>
                        <View style={tw`flex-1 pl-2`}>
                            <TouchableOpacity style={tw`w-9 h-9 items-center justify-center`}>
                                <IonIcons name={'book'} size={20} color={'transparent'} />
                            </TouchableOpacity>
                        </View>
                        <IonIcons name={section === 1 ? 'order-bool-ascending-variant' : section === 2 ? 'trophy-outline' : 'account-details-outline'} size={isIphone ? 25 : 23} color={'#000'} />
                        <Text style={tw`font-bold text-black text-lg ml-1.5`}>{section === 1 ? language === '1' ? 'Fase de Grupos' : 'Group Stage' : section === 2 ? language === '1' ? 'Fase Final' : 'Final Stage' : language === '1' ? 'Tabla de Posiciones' : 'Position Table'}</Text>
                        <View style={tw`flex-1 h-[100%] justify-center items-end pr-2`}>
                            {
                                (section === 1 || section === 2) 
                                && 
                                    <Animatable.View
                                        duration={1000}	
                                        animation={!visibleInstructions ? 'pulse' : undefined}
                                        iterationCount={'infinite'}
                                    >
                                        <TouchableOpacity style={tw`w-8 h-8 bg-[rgba(50,131,197,.1)] items-center justify-center border-[#3384C6] border rounded-3xl`} onPress={() => setInitialState({...initialState, visibleInstructions: !visibleInstructions, sectionOpened: 1})}>
                                            <Icon name={'book'} size={15} color={Blue} />
                                        </TouchableOpacity>
                                    </Animatable.View>
                            }
                        </View>
                    </View>
                    {
                        (section === 1 || section === 2)
                        ?
                            <>
                                <View style={tw`h-16 justify-center items-center bg-white border-b-[#dadada] border-b`}>
                                    <FlatList
                                        ref={refGroup}
                                        pagingEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={tw`justify-start items-center ios:pl-[${orientationInfo.initial !== 'PORTRAIT' ? '4%' : 0}]`}
                                        data={filteredData}
                                        horizontal={true}
                                        renderItem={({item}) => <Grupo id={item.id} name={item.name} selected={item.selected} completed={item.completed} partidos={item.partidos}/>}
                                        keyExtractor={item => String(item.id)}
                                        key={'_2'}
                                    />
                                </View>
                                <FlatList
                                    ref={refQuiniela}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={tw`h-auto self-stretch bg-white ios:pl-[${orientationInfo.initial !== 'PORTRAIT' ? '4%' : 0}]`}
                                    data={quinielas}
                                    numColumns={1}
                                    renderItem={({item}) => <Quiniela {...item}/>}
                                    keyExtractor={item => String(item.id)}
                                    key={'_3'}
                                />
                            </>
                        :
                            <>
                                {
                                    global.length > 0
                                    ?
                                        <>
                                            <View style={tw`flex-row bg-white ios:pl-[${orientationInfo.initial !== 'PORTRAIT' ? '4%' : 0}]`}>
                                                <View style={tw`h-14 w-14 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-base text-black`}>-</Text>
                                                </View>
                                                <View style={tw`flex-1 h-14 justify-center items-start`}>
                                                    <Text style={tw`font-bold text-base text-black`}>{language === '1' ? 'Nombre' : 'Name'}</Text>
                                                </View>
                                                <View style={tw`w-24 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-base text-black`}>{language === '1' ? 'Puntos' : 'Points'}</Text>
                                                </View>
                                                <View style={tw`h-14 w-14 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-base`}></Text>
                                                </View>
                                            </View>
                                            <FlatList
                                                style={tw`h-auto self-stretch bg-white ios:pl-[${orientationInfo.initial !== 'PORTRAIT' ? '4%' : 0}]`}
                                                showsVerticalScrollIndicator={false}
                                                showsHorizontalScrollIndicator={false}
                                                data={global}
                                                renderItem={({item}) => <GlobalPodium id={item.id} position={item.position} name={item.name} color={item.color} record={item.record}/>}
                                                keyExtractor={item => String(item.id)}
                                                key={'_4'}
                                            />
                                        </>
                                    :
                                        <View style={tw`flex-1 self-stretch justify-center items-center`}>
                                            <Image 
                                                resizeMode='contain'
                                                style={tw`w-35 h-35`}
                                                source={{uri: 'https://i.ibb.co/Vq5V0TL/winning.png'}}
                                            />
                                            <Text style={tw`text-base text-[#adadad] mt-5`}>{language === '1' ? 'Sin ganadores por el momento.' : 'No winners so far.'}</Text>
                                        </View>
                                }
                            </>
                    }
                    <View style={tw`android:h-14 ios:h-18 ios:pb-2.5 self-stretch flex-row bg-[#f7f7f7] border-t border-t-[#dadada] justify-center items-center px-4`}>
                        <TouchableOpacity 
                            style={tw`flex-1 justify-center items-center flex-row h-[100%]`}
                            onPress={() => {
                                if(section !== 1){
                                    refGroup.current?.scrollToOffset({ animated: true, offset: 0 })
                                    refQuiniela.current?.scrollToOffset({ animated: true, offset: 0 })
                                    setSection(1)
                                }
                            }}
                        >
                            <IonIcons name={'order-bool-ascending-variant'} size={isIphone ? 25 : 23} color={section === 1 ? '#000' : '#c1c1c1'} />
                            <Text style={tw`font-bold text-base text-[${section === 1 ? '#000' : '#c1c1c1'}] ml-1.5 text-sm`}>{language === '1' ? 'Fase Grupos' : 'Group Stage'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={tw`flex-1 justify-center items-center flex-row h-[100%]`}
                            onPress={() => {
                                if(section !== 2){
                                    refGroup.current?.scrollToOffset({ animated: true, offset: 0 })
                                    refQuiniela.current?.scrollToOffset({ animated: true, offset: 0 })
                                    setSection(2)
                                }
                            }}>
                            <IonIcons name={section !== 2 ? 'trophy-outline' : 'trophy'} size={isIphone ? 25 : 23} color={section === 2 ? '#000' : '#c1c1c1'} />
                            <Text style={tw`font-bold text-base text-[${section === 2 ? '#000' : '#c1c1c1'}] ml-1.5 text-sm`}>{language === '1' ? 'Fase Final' : 'Final Stage'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`flex-1 justify-center items-center flex-row h-[100%]`}
                            onPress={() => {
                                if(section !== 3){
                                    refGroup.current?.scrollToOffset({ animated: true, offset: 0 })
                                    refQuiniela.current?.scrollToOffset({ animated: true, offset: 0 })
                                    setSection(3)
                                }
                            }}>
                            <IonIcons name={section !== 3 ? 'account-details-outline' : 'account-details'} size={isIphone ? 25 : 23} color={section === 3 ? '#000' : '#c1c1c1'} />
                            <Text style={tw`font-bold text-base text-[${section === 3 ? '#000' : '#c1c1c1'}] ml-1.5 text-sm`}>{language === '1' ? 'Posiciones' : 'Positions'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal visibility={visibleInstructions} orientation={orientationInfo.initial} handleDismiss={() => setInitialState({...initialState, visibleInstructions: !visibleInstructions})}>
                    {
                        <>
                            <View style={tw`flex-row h-12.5 self-stretch bg-[rgba(50,131,197,.1)] justify-center items-center mb-4 rounded-3xl border border-[${Blue}]`}>
                                <TouchableOpacity 
                                    onPress={() => sectionOpened !== 1 && setInitialState({...initialState, sectionOpened: 1})}
                                    style={tw`flex-1 self-stretch justify-center items-center flex-row`}
                                >
                                    <IonIcons name={`${sectionOpened === 1 ? 'format-list-bulleted-square' : 'format-list-checkbox'}`} size={23} color={`${sectionOpened === 1 ? Blue : '#adadad'}`} />
                                    <Text style={tw`text-base font-bold text-[${sectionOpened === 1 ? Blue : '#adadad'}] ml-2`}>{language === '1' ? 'Instrucciones' : 'Instructions'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => sectionOpened !== 2 && setInitialState({...initialState, sectionOpened: 2})}
                                    style={tw`flex-1 self-stretch justify-center items-center flex-row`}
                                >
                                    <IonIcons name={`${sectionOpened === 2 ? 'check-circle' : 'check-circle-outline'}`} size={23} color={`${sectionOpened === 2 ? Blue : '#adadad'}`} />
                                    <Text style={tw`text-base font-bold text-[${sectionOpened === 2 ? Blue : '#adadad'}] ml-2`}>{language === '1' ? 'Puntos' : 'Points'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={tw`bg-[rgba(50,131,197,.1)] mx-1 justify-center items-center border border-[${Blue}] mb-4 flex-row`}>
                                <View style={tw`w-10 h-10 justify-center items-center pl-1`}>
                                    <Icon name={'info'} size={20} color={Blue} />
                                </View>
                                <View style={tw`flex-1 py-1.5`}>
                                    <Text style={tw`text-xs text-[${Blue}]`}>{sectionOpened === 1 ? instructions.title : points.title}</Text>
                                </View>
                            </View>
                        </>
                    }
                    {
                        sectionOpened === 1
                        &&
                            <>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={tw`h-auto self-stretch bg-white`}
                                    data={instructions.info}
                                    numColumns={1}
                                    renderItem={({item}) => <Instructions id={item.id} total={instructions.length} {...item}/>}
                                    keyExtractor={item => String(item.id)}
                                    key={'_5'}
                                />
                            </>
                    }
                    {
                        sectionOpened === 2
                        &&
                            <>
                                <View style={tw`flex-row h-12.5 self-stretch bg-[#f7f7f7] justify-center items-center border border-[#dadada] mx-1`}>
                                    <View style={tw`flex-2 justify-center items-start pl-2.5`}>
                                        <Text style={tw`text-xs text-center font-bold text-[#000]`}>{language === '1' ? 'Fase' : 'Stage'}</Text>
                                    </View>
                                    <View style={tw`flex-1 justify-center items-center`}>
                                        <Text style={tw`text-xs text-center font-bold text-[#000]`}>{language === '1' ? 'Acertar ganador' : 'Guess winner'}</Text>
                                    </View>
                                    <View style={tw`flex-1 justify-center items-center`}>
                                        <Text style={tw`text-xs text-center font-bold text-[#000]`}>{language === '1' ? 'Acertar resultado' : 'Guess result'}</Text>
                                    </View>
                                </View>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={tw`h-auto self-stretch bg-white`}
                                    data={points.info}
                                    numColumns={1}
                                    renderItem={({item}) => <Points {...item}/>}
                                    keyExtractor={item => String(item.id)}
                                    key={'_1'}
                                />
                            </>
                    }
                </Modal>
                <ModalLoading visibility={loading}/>
            </>
        :
            <>
                <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>
            </>
    )
}