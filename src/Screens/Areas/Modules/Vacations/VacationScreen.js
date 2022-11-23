import React, {useState, useEffect, useCallback} from 'react'
import {StyleSheet, View, ScrollView, Image, Text, Keyboard, StatusBar, SafeAreaView, Platform, RefreshControl} from 'react-native'
import {TouchableOpacity } from 'react-native-gesture-handler'
import {HeaderPortrait, HeaderLandscape, ModalLoading, FailedNetwork, Title, BottomNavBar, Pagination} from '../../../../components'
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../../colors/colorsApp';
import {useConnection, useNavigation, useOrientation, useScroll} from '../../../../hooks';
import {isIphone, live, login, urlVacaciones} from '../../../../access/requestedData';
import {hideEmpleado, hideEmpleadoTemporal, selectEmpleados, selectTemporalEmpleados, setEmpleados, setTemporalEmpleado} from '../../../../slices/vacationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {selectLanguageApp, selectTokenInfo, selectUserInfo} from '../../../../slices/varSlice';
import tw from 'twrnc';

let id_usuario = '';
let id_puesto = '';
let token = null;
let user = null;
let cuenta = 0;
let filtro = ''
let empleados = null;
let temporalEmpleados = null;
let language = ''

export default ({navigation, route: {params: {orientation}}}) => {
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)
    language = useSelector(selectLanguageApp)
    
    empleados = useSelector(selectEmpleados)
    temporalEmpleados = useSelector(selectTemporalEmpleados)
    const dispatch = useDispatch()

    const [contador, setContador] = useState(1)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const {handlePath} = useNavigation();
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });
    const {handleScroll, translateY, paddingTop} = useScroll(orientationInfo.initial)

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    const [initialState, setInitialState] = useState({
        data: [],
        areLegendsHiden: false,
        currentFilter: language === '1' ? 'Nombre Empleado...' : 'Employee Name...',
        filter: '',
    })

    const {areLegendsHiden, currentFilter, filter} = initialState

    const getInformation = async () => {
        if(cuenta === 0){
            setLoading(true)
            cuenta = cuenta + 1;
        }
        try{
            id_usuario = user.data.datos_personales.id_usuario
            id_puesto = user.data.datos_laborales.id_puesto
    
            const body = {
                'action': 'get_vacaciones',
                'data': {
                    'id_usuario':id_usuario,
                    'id_puesto':id_puesto,
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
                setTimeout(() => {
                    dispatch(setEmpleados(response.empleados))
                    dispatch(setTemporalEmpleado(response.empleados))
                    setLoading(false)
                }, 500)
            }
        }catch(e){
            console.log('algo pasó con el internet')
            askForConnection()
            setLoading(false)
        }
    }
    
    useEffect(() => {
        getInformation()
    },[hasConnection])

    const handleDetail = useCallback((id_usuario, id_empleado, solicitud_pendiente, language) => {
        setInitialState({...initialState, filter: ''});
        navigation.navigate('VacationDetail', {id_usuario: id_usuario, id_empleado: id_empleado, language: language, solicitud_pendiente: solicitud_pendiente})
    })
    
    const Contenedor = ({title, leftPosition = false, hasBottomLine = true, infoDown = true}) => {
        return (
            <View style={tw`self-stretch ${leftPosition ? 'items-start' : 'items-center'} justify-center pb-[${infoDown ? 2 : 0}] ml-[${hasBottomLine ? 2 : 0}] mb-1`}>
                <Text style={tw`text-sm text-[#000]`}>{title}</Text>
            </View>
        )
    }

    const changing = (temporal, filter) => {
        filtro = filter
        dispatch(setTemporalEmpleado(temporal))
    }
    
    const handlePage = (tipo, defined = undefined) => setCurrentPage(tipo === '+' ? currentPage + 1 : tipo === '-' ? currentPage - 1 : defined)

    const Empleado = ({num_empleado, id_empleado, nombre, oculta, fecha_ingreso, years, dias_correspondientes, dias_disfrutados, dias_pendientes, dias_periodos_anterior, total_dias, solicitud_pendiente}) => {
        return(
            <>
                {
                    empleados.length > 1
                    ?
                        <TouchableOpacity style={tw`flex-1 h-7.5 mb-[${oculta ? 2.5 : 0}]`} onPress={() => handleHideEmployee(id_empleado)}>
                            <View style={tw`h-auto self-stretch mb-5`}>
                                <View style={tw`flex-row items-center h-7.5 justify-center items-center`}>
                                    <View style={tw`h-auto flex-1 flex-row bg-white justify-center items-center`}>
                                        <View style={tw`w-[${num_empleado.length <= 3 ? 10 : 11.5}] h-7.5 justify-center items-center bg-[${Blue}] px-1.5 rounded-md`}>
                                            <Text style={tw`text-xs font-bold text-[#fff]`}>{num_empleado}</Text>
                                        </View>
                                        <View style={tw`flex-1 h-7.5 ml-1 pl-2.5 pr-2 justify-center items-center bg-[#f7f7f7] border border-[#dadada] rounded-md flex-row`}>
                                            <View style={tw`w-5 justify-center items-center`}>
                                            {
                                                solicitud_pendiente
                                                &&
                                                    <IonIcons name={'clock'} size={18} color={'#000'} />
                                            }
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <Text style={tw`text-sm font-bold text-[#000]`}>{nombre}</Text>
                                            </View>
                                            <View style={tw`w-5 justify-center items-center`}>
                                                <IonIcons name={oculta ? 'chevron-down' : 'chevron-up'} size={18} color={'#000'} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    :
                        <View style={tw`flex-1 h-7.5 mb-[${oculta ? 2.5 : 0}]`}>
                            <View style={tw`h-auto self-stretch mb-5`}>
                                <View style={tw`flex-row items-center h-7.5 justify-center items-center`}>
                                    <View style={tw`h-auto flex-1 flex-row bg-white justify-center items-center`}>
                                        <View style={tw`w-[${num_empleado.length <= 3 ? 10 : 11.5}] h-7.5 justify-center items-center bg-[${Blue}] px-1.5 rounded-md`}>
                                            <Text style={tw`text-xs font-bold text-[#fff]`}>{num_empleado}</Text>
                                        </View>
                                        <View style={tw`flex-1 h-7.5 ml-1 px-2 justify-center items-center bg-[#f7f7f7] border border-[#dadada] rounded-md flex-row`}>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <Text style={tw`text-sm font-bold text-[#000]`}>{nombre}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                }
                
                {
                    !oculta
                    &&
                        <View style={tw`h-auto p-2.5 mb-2.5`}>
                            <View style={tw`flex-row self-stretch justify-start items-start`}>
                                <View style={tw`flex-1 justify-center items-center`}>
                                    <Text style={[title]}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Entry'}</Text>
                                    <Contenedor title={fecha_ingreso} hasBottomLine={false} />
                                </View>
                                <View style={tw`flex-1 ml-1.5 justify-center items-center`}>
                                    <Text style={title}>{language === '1' ? 'Años' : 'Years'}</Text>
                                    <Contenedor title={years} hasBottomLine={false}/>
                                </View>
                            </View>
                            {
                                orientationInfo.initial === 'PORTRAIT'
                                ?
                                    <>
                                        <View style={tw`h-auto self-stretch flex-row mt-1.5`}>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <View style={legends}>
                                                    <View style={legendHeader}>
                                                        <Text style={tw`text-xs text-[#000]`}>DC</Text>
                                                    </View>
                                                    <View style={subHeaderLegend}>
                                                        <Text style={tw`text-xl font-bold text-[#000]`}>{dias_correspondientes}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <View style={legends}>
                                                    <View style={legendHeader}>
                                                        <Text style={tw`text-xs text-[#000]`}>DD</Text>
                                                    </View>
                                                    <View style={subHeaderLegend}>
                                                        <Text style={tw`text-xl font-bold text-[#000]`}>{dias_disfrutados}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <View style={[legends, {backgroundColor: '#BFCCE7'}]}>
                                                    <View style={legendHeader}>
                                                        <Text style={tw`text-xs text-[#000]`}>DP</Text>
                                                    </View>
                                                    <View style={subHeaderLegend}>
                                                        <Text style={tw`text-xl font-bold text-[#000]`}>{dias_pendientes}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <View style={[legends, {backgroundColor: '#E5E2D2'}]}>
                                                    <View style={legendHeader}>
                                                        <Text style={tw`text-xs text-[#000]`}>PA</Text>
                                                    </View>
                                                    <View style={subHeaderLegend}>
                                                        <Text style={tw`text-xl font-bold text-[#000]`}>{dias_periodos_anterior}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <View style={[legends, {backgroundColor: '#C3E5C4'}]}>
                                                    <View style={legendHeader}>
                                                        <Text style={tw`text-xs text-[#000]`}>TD</Text>
                                                    </View>
                                                    <View style={subHeaderLegend}>
                                                        <Text style={tw`text-xl font-bold text-[#000]`}>{total_dias}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={tw`flex-row mt-1.5`}>
                                            <View style={tw`flex-1`}/>
                                            <View style={tw`flex-1`}>
                                                <TouchableOpacity onPress={() => handleDetail(id_usuario, id_empleado, solicitud_pendiente, language)} style={tw`flex-row h-auto justify-center items-center mt-2.5 bg-[${Blue}] py-1.5 px-5 rounded-lg`}>
                                                    <Icon name={'folder-open'} size={18} color={'#fff'} />
                                                    <Text style={tw`text-sm text-[#fff] ml-3 font-bold`}>{language === '1' ? 'Ver Detalles' : 'View Details'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                :
                                    <View style={tw`flex-row`}>
                                        <View style={tw`flex-1 justify-center items-center flex-row`}>
                                            <View style={[legends, {marginRight: 10}]}>
                                                <View style={legendHeader}>
                                                    <Text style={tw`text-xs text-[#000]`}>DC</Text>
                                                </View>
                                                <View style={subHeaderLegend}>
                                                    <Text style={tw`text-xl font-bold text-[#000]`}>{dias_correspondientes}</Text>
                                                </View>
                                            </View>
                                            <View style={[legends, {marginRight: 10}]}>
                                                <View style={legendHeader}>
                                                    <Text style={tw`text-xs text-[#000]`}>DD</Text>
                                                </View>
                                                <View style={subHeaderLegend}>
                                                    <Text style={tw`text-xl font-bold text-[#000]`}>{dias_disfrutados}</Text>
                                                </View>
                                            </View>
                                            <View style={[legends, {backgroundColor: '#BFCCE7', marginRight: 10}]}>
                                                <View style={legendHeader}>
                                                    <Text style={tw`text-xs text-[#000]`}>DP</Text>
                                                </View>
                                                <View style={subHeaderLegend}>
                                                    <Text style={tw`text-xl font-bold text-[#000]`}>{dias_pendientes}</Text>
                                                </View>
                                            </View>
                                            <View style={[legends, {backgroundColor: '#E5E2D2', marginRight: 10}]}>
                                                <View style={legendHeader}>
                                                    <Text style={tw`text-xs text-[#000]`}>PA</Text>
                                                </View>
                                                <View style={subHeaderLegend}>
                                                    <Text style={tw`text-xl font-bold text-[#000]`}>{dias_periodos_anterior}</Text>
                                                </View>
                                            </View>
                                            <View style={[legends, {backgroundColor: '#C3E5C4', marginRight: 10}]}>
                                                <View style={legendHeader}>
                                                    <Text style={tw`text-xs text-[#000]`}>TD</Text>
                                                </View>
                                                <View style={subHeaderLegend}>
                                                    <Text style={tw`text-xl font-bold text-[#000]`}>{total_dias}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <TouchableOpacity onPress={() => handleDetail(id_usuario, id_empleado, solicitud_pendiente, language)} style={tw`h-9 w-[50%] justify-center items-center bg-[${Blue}] px-5 rounded-lg flex-row`}>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                                    <Icon name={'folder-open'} size={18} color={'#fff'} />
                                                    <Text style={tw`text-sm text-[#fff] ml-3 font-bold`}>{language === '1' ? 'Ver Detalles' : 'View Details'}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                            }
                        </View>
                }
            </>
        )
    }
    
    const handleHideEmployee = (id_empleado) => {
        if(filtro.length === 1 || filtro.length === 0){
            dispatch(hideEmpleado(id_empleado))
        } else {
            dispatch(hideEmpleadoTemporal(id_empleado))
        }
    }

    const reloading = () => {
        setLoading(true)
    }

    const handleChangeFilter = () => {
        setInitialState({...initialState, filter: '', currentFilter: currentFilter === 'Número Empleado...' || currentFilter === 'Employee Number...' ? language === '1' ? 'Nombre Empleado...' : 'Employee Name...' : language === '1' ? 'Número Empleado...' : 'Employee Number...'})
        Keyboard.dismiss()
    }

    const handleClean = () => filtro = ''

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
            <View style={tw`flex-1 bg-white`}>
            {
                hasConnection
                ?
                    <>
                        {
                            orientationInfo.initial === 'PORTRAIT'
                            ?
                                <HeaderPortrait title={language === '1' ? 'Vacaciones' : 'Vacation'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                            :
                                <HeaderLandscape title={language === '1' ? 'Vacaciones' : 'Vacation'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                        }
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={tw`self-stretch`}
                            onScroll={handleScroll}
                            refreshControl={
                                <RefreshControl
                                    progressBackgroundColor={'#EC5C25'}
                                    colors={['#fff']}
                                    refreshing={false}
                                    onRefresh={() => getInformation()}
                                />
                            }
                            contentContainerStyle={{paddingTop: paddingTop}}
                        >
                            <View style={[container, {marginBottom: isIphone ? 25 : 0}]}>
                                <View style={tw`h-auto self-stretch pt-1.5`}>
                                    <Title title={language === '1' ? 'PRIMAS VACACIONALES' : 'VACATION PREMIUMS'} icon={'child'} tipo={1} hasBottom={false} top={true}/>
                                </View>
                                {
                                    empleados.length > 0
                                    ?
                                        <Pagination data={empleados} Item={Empleado} SearchInput={true} currentFilter={currentFilter} onChangeFilter={() => handleChangeFilter()} handleClean={handleClean} placeholder={currentFilter} property={currentFilter === 'Número Empleado...' ? 'num_empleado' : 'nombre'} handlePage={handlePage} current={currentPage} changing={changing} temporal={temporalEmpleados}/>
                                    :
                                        !loading
                                        &&
                                            <View style={tw`mt-5 justify-center items-center self-stretch mx-[4%]`}>
                                                <Image
                                                    style={tw`w-42.5 h-42.5`}
                                                    resizeMode={'contain'}
                                                    source={require('../../../../../assets/not-found.png')}
                                                />
                                            </View>
                                }
                                {
                                    empleados.length > 1
                                    ?
                                        <Title title={language === '1' ? 'LEYENDAS' : 'LEGENDS'} icon={'list-ul'} tipo={1} hasBottom={false} isButton={true} areHiden={areLegendsHiden} handleAction={() => setInitialState({...initialState, areLegendsHiden: !areLegendsHiden})}/>
                                    :
                                        <Title title={language === '1' ? 'LEYENDAS' : 'LEGENDS'} icon={'list-ul'} tipo={1} hasBottom={false} isButton={false} areHiden={areLegendsHiden} handleAction={() => setInitialState({...initialState, areLegendsHiden: !areLegendsHiden})}/>
                                }
                                {
                                    !areLegendsHiden
                                    ?
                                        <>        
                                            <View style={tw`flex-row bg-[#f7f7f7]`} onPress={() => setInitialState({...initialState, areLegendsHiden: !areLegendsHiden})}>
                                                <View style={tw`w-[20%] h-auto p-4 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-base text-[#000]`}>{language === '1' ? 'Tipo' : 'Type'}</Text>
                                                </View>
                                                <View style={tw`flex-1 h-auto justify-center`}>
                                                    <Text style={tw`font-bold text-base text-[#000]`}>{language === '1' ? 'Descripción' : 'Description'}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`flex-row border-t border-t-[#dadada] border-b border-b-[#dadada]`}>
                                                <View style={tw`w-[20%] h-auto p-4 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-sm text-[#000]`}>DC</Text>
                                                </View>
                                                <View style={tw`flex-1 h-auto justify-center`}>
                                                    <Text style={tw`text-sm text-[#000]`}>{language === '1' ? 'Días Correspondientes al Período (Año Completo)' : 'Days Corresponding to the Period (Full Year)'}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`flex-row border-b border-b-[#dadada]`}>
                                                <View style={tw`w-[20%] h-auto p-4 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-sm text-[#000]`}>DD</Text>
                                                </View>
                                                <View style={tw`flex-1 h-auto justify-center`}>
                                                    <Text style={tw`text-sm text-[#000]`}>{language === '1' ? 'Días Disfrutados / Días Descontados' : 'Days Enjoyed / Days Discounted'}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`flex-row border-b border-b-[#dadada]`}>
                                                <View style={tw`w-[20%] h-auto p-4 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-sm text-[#000]`}>DP</Text>
                                                </View>
                                                <View style={tw`flex-1 h-auto justify-center`}>
                                                    <Text style={tw`text-sm text-[#000]`}>{language === '1' ? 'Días Pendientes por Tomar' : 'Days to be Taken'}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`flex-row border-b border-b-[#dadada]`}>
                                                <View style={tw`w-[20%] h-auto p-4 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-sm text-[#000]`}>PA</Text>
                                                </View>
                                                <View style={tw`flex-1 h-auto justify-center`}>
                                                    <Text style={tw`text-sm text-[#000]`}>{language === '1' ? 'Días Restantes del Período Anterior' : 'Remaining Days of the Previous Period'}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`flex-row border-b border-[#dadada] mb-2.5`}>
                                                <View style={tw`w-[20%] h-auto p-4 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-sm text-[#000]`}>TD</Text>
                                                </View>
                                                <View style={tw`flex-1 h-auto justify-center`}>
                                                    <Text style={tw`text-sm text-[#000]`}>{language === '1' ? 'Total de Días Disponibles a Disfrutar' : 'Total Days Available for Enjoyment'}</Text>
                                                </View>
                                            </View>
                                        </>
                                    :
                                        <View style={tw`mb-2.5`}></View>
                                }
                            </View>
                        </ScrollView>
                        <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                        <ModalLoading visibility={loading}/>
                    </>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                        <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>
                    </>
            }
            </View>
        </>
    )
}

const title = tw`text-sm text-[${Blue}]`
const legends = tw`h-16.5 w-13.5 bg-[#f7f7f7] rounded-xl justify-center items-center shadow-md `
const legendHeader = tw`h-5 self-stretch justify-end items-center`
const subHeaderLegend = tw`flex-1 self-stretch justify-center items-center pb-1.5`
const container = tw`flex-1 justify-center items-center bg-[#fff] px-[${isIphone ? '5%' : '3%'}]`