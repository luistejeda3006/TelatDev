import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, View, ScrollView, Image, Text, Keyboard, StatusBar, SafeAreaView, Platform, RefreshControl} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { HeaderPortrait, HeaderLandscape, ModalLoading, FailedNetwork, Title, BottomNavBar, Pagination } from '../../../../components'
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../../colors/colorsApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConnection, useNavigation, useOrientation, useScroll } from '../../../../hooks';
import { isIphone, live, login, urlVacaciones } from '../../../../access/requestedData';
import { hideEmpleado, hideEmpleadoTemporal, selectEmpleados, selectTemporalEmpleados, setEmpleados, setTemporalEmpleado } from '../../../../slices/vacationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

let keyUserInfo = 'userInfo';
let id_usuario = '';
let id_puesto = '';
let data = null;
let token = null;
let keyTokenInfo = 'tokenInfo';
let cuenta = 0;
let filtro = ''
let empleados = null;
let temporalEmpleados = null;

export default ({navigation, route: {params: {language, orientation}}}) => {
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
        'initial': orientation
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
            data = null;
            token = null;
            data = await AsyncStorage.getItem(keyUserInfo) || '[]';
            data = JSON.parse(data);
            id_usuario = data.data.datos_personales.id_usuario
            id_puesto = data.data.datos_laborales.id_puesto
    
            token = await AsyncStorage.getItem(keyTokenInfo) || '{}';
            token = JSON.parse(token);
    
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
                dispatch(setEmpleados(response.empleados))
                dispatch(setTemporalEmpleado(response.empleados))
                setTimeout(() => {
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
            <View style={{alignSelf: 'stretch', borderColor: '#CBCBCB', alignItems: leftPosition ? 'flex-start' : 'center', justifyContent: 'center', paddingBottom: infoDown ? 7 : 0, marginLeft: hasBottomLine ? 7 : 0}}>
                <Text style={{fontSize: 14, color: '#000'}}>{title}</Text>
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
                        <TouchableOpacity style={{flex: 1, height: 30, marginBottom: oculta ? 10 : 0}} onPress={() => handleHideEmployee(id_empleado)}>
                            <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 20}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', height: 30, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{height: 'auto', flex: 1, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{width: num_empleado.length <= 3 ? 40 : 45, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingHorizontal: 6, borderRadius: 5}}>
                                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{num_empleado}</Text>
                                        </View>
                                        <View style={{flex: 1, height: 30, marginLeft: 4, paddingLeft: 10, paddingRight: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: '#dadada', borderRadius: 5, flexDirection: 'row'}}>
                                            <View style={{width: 20, justifyContent: 'center', alignItems: 'center'}}>
                                            {
                                                solicitud_pendiente
                                                &&
                                                    <IonIcons name={'clock'} size={18} color={'#000'} />
                                            }
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>{nombre}</Text>
                                            </View>
                                            <View style={{width: 20, justifyContent: 'center', alignItems: 'center'}}>
                                                <IonIcons name={oculta ? 'chevron-down' : 'chevron-up'} size={18} color={'#000'} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    :
                        <View style={{flex: 1, height: 30, marginBottom: oculta ? 10 : 0}}>
                            <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 20}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', height: 30, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{height: 'auto', flex: 1, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{width: num_empleado.length <= 3 ? 40 : 45, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingHorizontal: 6, borderRadius: 5}}>
                                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{num_empleado}</Text>
                                        </View>
                                        <View style={{flex: 1, height: 30, marginLeft: 4, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: '#dadada', borderRadius: 5, flexDirection: 'row'}}>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>{nombre}</Text>
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
                        <View style={{height: 'auto', padding: 10, marginBottom: 10 }}>
                            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={[styles.title]}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Entry'}</Text>
                                    <Contenedor title={fecha_ingreso} hasBottomLine={false} />
                                </View>
                                <View style={{flex: 1, marginLeft: 6, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={styles.title}>{language === '1' ? 'Años' : 'Years'}</Text>
                                    <Contenedor title={years} hasBottomLine={false}/>
                                </View>
                            </View>
                            {
                                orientationInfo.initial === 'PORTRAIT'
                                ?
                                    <>
                                        <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', marginTop: 5}}>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <View style={styles.legends}>
                                                    <View style={styles.headerLegend}>
                                                        <Text style={{fontSize: 12, color: '#000'}}>DC</Text>
                                                    </View>
                                                    <View style={styles.subHeaderLegend}>
                                                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{dias_correspondientes}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <View style={styles.legends}>
                                                    <View style={styles.headerLegend}>
                                                        <Text style={{fontSize: 12, color: '#000'}}>DD</Text>
                                                    </View>
                                                    <View style={styles.subHeaderLegend}>
                                                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{dias_disfrutados}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <View style={[styles.legends, {backgroundColor: '#BFCCE7'}]}>
                                                    <View style={styles.headerLegend}>
                                                        <Text style={{fontSize: 12, color: '#000'}}>DP</Text>
                                                    </View>
                                                    <View style={styles.subHeaderLegend}>
                                                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{dias_pendientes}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <View style={[styles.legends, {backgroundColor: '#E5E2D2'}]}>
                                                    <View style={styles.headerLegend}>
                                                        <Text style={{fontSize: 12, color: '#000'}}>PA</Text>
                                                    </View>
                                                    <View style={styles.subHeaderLegend}>
                                                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{dias_periodos_anterior}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <View style={[styles.legends, {backgroundColor: '#C3E5C4'}]}>
                                                    <View style={styles.headerLegend}>
                                                        <Text style={{fontSize: 12, color: '#000'}}>TD</Text>
                                                    </View>
                                                    <View style={styles.subHeaderLegend}>
                                                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{total_dias}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', marginTop: 5}}>
                                            <View style={{flex: 1}}/>
                                            <View style={{flex: 1}}>
                                                <TouchableOpacity onPress={() => handleDetail(id_usuario, id_empleado, solicitud_pendiente, language)} style={{flexDirection: 'row', height: 'auto', justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: Blue, paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8}}>
                                                    <Icon name={'folder-open'} size={18} color={'#fff'} />
                                                    <Text style={{fontSize: 14, color: '#fff', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Ver Detalles' : 'View Details'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                :
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                            <View style={[styles.legends, {marginRight: 10}]}>
                                                <View style={styles.headerLegend}>
                                                    <Text style={{fontSize: 12, color: '#000'}}>DC</Text>
                                                </View>
                                                <View style={styles.subHeaderLegend}>
                                                    <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{dias_correspondientes}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.legends, {marginRight: 10}]}>
                                                <View style={styles.headerLegend}>
                                                    <Text style={{fontSize: 12, color: '#000'}}>DD</Text>
                                                </View>
                                                <View style={styles.subHeaderLegend}>
                                                    <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{dias_disfrutados}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.legends, {backgroundColor: '#BFCCE7', marginRight: 10}]}>
                                                <View style={styles.headerLegend}>
                                                    <Text style={{fontSize: 12, color: '#000'}}>DP</Text>
                                                </View>
                                                <View style={styles.subHeaderLegend}>
                                                    <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{dias_pendientes}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.legends, {backgroundColor: '#E5E2D2', marginRight: 10}]}>
                                                <View style={styles.headerLegend}>
                                                    <Text style={{fontSize: 12, color: '#000'}}>PA</Text>
                                                </View>
                                                <View style={styles.subHeaderLegend}>
                                                    <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{dias_periodos_anterior}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.legends, {backgroundColor: '#C3E5C4', marginRight: 10}]}>
                                                <View style={styles.headerLegend}>
                                                    <Text style={{fontSize: 12, color: '#000'}}>TD</Text>
                                                </View>
                                                <View style={styles.subHeaderLegend}>
                                                    <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>{total_dias}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity onPress={() => handleDetail(id_usuario, id_empleado, solicitud_pendiente, language)} style={{height: 35, width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingHorizontal: 20, borderRadius: 8, flexDirection: 'row', }}>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                                    <Icon name={'folder-open'} size={18} color={'#fff'} />
                                                    <Text style={{fontSize: 14, color: '#fff', marginLeft: 12, fontWeight: 'bold'}}>{language === '1' ? 'Ver Detalles' : 'View Details'}</Text>
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
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            {
                hasConnection
                ?
                    <>
                        {
                            orientationInfo.initial === 'PORTRAIT'
                            ?
                                <>
                                    <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                                    <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
                                    <HeaderPortrait title={language === '1' ? 'Vacaciones' : 'Vacation'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                                </>
                            :
                                <HeaderLandscape title={language === '1' ? 'Vacaciones' : 'Vacation'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                        }
                        
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch'}}
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
                                <View style={[styles.container, {marginBottom: isIphone ? 25 : 0}]}>
                                    <View style={{height: 'auto', alignSelf: 'stretch', paddingTop: 5}}>
                                        <Title title={language === '1' ? 'PRIMAS VACACIONALES' : 'VACATION PREMIUMS'} icon={'child'} tipo={1} hasBottom={false} top={true}/>
                                    </View>
                                    {
                                        empleados.length > 0
                                        ?
                                            <Pagination data={empleados} Item={Empleado} SearchInput={true} currentFilter={currentFilter} onChangeFilter={() => handleChangeFilter()} handleClean={handleClean} placeholder={currentFilter} property={currentFilter === 'Número Empleado...' ? 'num_empleado' : 'nombre'} handlePage={handlePage} current={currentPage} changing={changing} temporal={temporalEmpleados}/>
                                        :
                                            !loading
                                            &&
                                                <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: '4%'}}>
                                                    <Image
                                                        style={{width: 150, height: 150, resizeMode:'contain'}}
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
                                                <View style={{flexDirection: 'row', backgroundColor: '#F7F7F7'}} onPress={() => setInitialState({...initialState, areLegendsHiden: !areLegendsHiden})}>
                                                    <View style={{width: '20%', height: 'auto', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>{language === '1' ? 'Tipo' : 'Type'}</Text>
                                                    </View>
                                                    <View style={{flex: 1, height: 'auto', justifyContent: 'center'}}>
                                                        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>{language === '1' ? 'Descripción' : 'Description'}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#dadada'}}>
                                                    <View style={{width: '20%', height: 'auto', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{fontWeight: 'bold', fontSize: 14, color: '#000'}}>DC</Text>
                                                    </View>
                                                    <View style={{flex: 1, height: 'auto', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: 14, color: '#000'}}>{language === '1' ? 'Días Correspondientes al Período (Año Completo)' : 'Days Corresponding to the Period (Full Year)'}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: '#dadada'}}>
                                                    <View style={{width: '20%', height: 'auto', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{fontWeight: 'bold', fontSize: 14, color: '#000'}}>DD</Text>
                                                    </View>
                                                    <View style={{flex: 1, height: 'auto', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: 14, color: '#000'}}>{language === '1' ? 'Días Disfrutados / Días Descontados' : 'Days Enjoyed / Days Discounted'}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: '#dadada'}}>
                                                    <View style={{width: '20%', height: 'auto', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{fontWeight: 'bold', fontSize: 14, color: '#000'}}>DP</Text>
                                                    </View>
                                                    <View style={{flex: 1, height: 'auto', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: 14, color: '#000'}}>{language === '1' ? 'Días Pendientes por Tomar' : 'Days to be Taken'}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: '#dadada'}}>
                                                    <View style={{width: '20%', height: 'auto', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{fontWeight: 'bold', fontSize: 14, color: '#000'}}>PA</Text>
                                                    </View>
                                                    <View style={{flex: 1, height: 'auto', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: 14, color: '#000'}}>{language === '1' ? 'Días Restantes del Período Anterior' : 'Remaining Days of the Previous Period'}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: '#dadada', marginBottom: 10}}>
                                                    <View style={{width: '20%', height: 'auto', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{fontWeight: 'bold', fontSize: 14, color: '#000'}}>TD</Text>
                                                    </View>
                                                    <View style={{flex: 1, height: 'auto', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: 14, color: '#000'}}>{language === '1' ? 'Total de Días Disponibles a Disfrutar' : 'Total Days Available for Enjoyment'}</Text>
                                                    </View>
                                                </View>
                                            </>
                                        :
                                            <View style={{marginBottom: 10}}></View>
                                    }
                                </View>
                            </ScrollView>
                        <ModalLoading visibility={loading}/>
                    </>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			            <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                        <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>
                    </>
            }
            <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
        </View>
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
    box:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
    },
    input:{
        flex: 1,
        height: 50,
        color: '#000',
        fontSize: 15
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