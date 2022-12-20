import React, { useState, useEffect, useCallback } from 'react'
import {StyleSheet, View, Text, TouchableOpacity, StatusBar, SafeAreaView, TouchableWithoutFeedback, ScrollView, FlatList} from 'react-native'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Title, BottomNavBar, FailedNetwork, HeaderLandscape, HeaderPortrait, ModalLoading} from '../../../components'
import {useConnection, useNavigation, useOrientation, useScroll} from '../../../hooks'
import {isIphone, live, login, urlNomina} from '../../../access/requestedData';
import {useDispatch, useSelector} from 'react-redux';
import {handleHideNomina, selectNominas, setNominas} from '../../../slices/nominaSlice';
import * as Animatable from 'react-native-animatable';
import {useFocusEffect} from '@react-navigation/native';
import {selectTokenInfo, selectUserInfo} from '../../../slices/varSlice';

let cuenta = 0;
let token = null;
let user = null;

export default ({navigation, route: {params: {language, orientation}}}) => {
    const dispatch = useDispatch()

    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)

    data = useSelector(selectNominas)

    const [longitud, setLongitud] = useState(0)
    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });
    const {handleScroll, translateY, paddingTop} = useScroll(orientationInfo.initial)

    const [initialState, setInitialState] = useState({
        info: {},
        responsable: '-',
        fecha_inicio: '-',
        fecha_fin: '-',
        periodo: '-',
        loading: false,
    })

    const {info, responsable, fecha_inicio, fecha_fin, periodo, loading} = initialState

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    const getInformation = async () => {
        try{
            params = {
                id_usuario: user.data.datos_personales.id_usuario,
                id_puesto: user.data.datos_laborales.id_puesto,
            }
    
            if(cuenta === 0){
                setInitialState({...initialState, loading: true})
                cuenta = cuenta + 1;
            }

            const body = {
                'action': 'get_prenomina_users',
                'data': {
                    'id_usuario': params.id_usuario,
                    'id_puesto': params.id_puesto,
                    'idioma': language,
                },
                'live': live,
                'login': login
            }

            console.log('body: ', body)
    
            const request = await fetch(urlNomina, {
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
                    setLongitud(response.prenomina.length)
                    let period = response.info.periodo;
                    period = period.split('-')
                    dispatch(setNominas(response.prenomina))
                    setInitialState({...initialState, info: response.info, loading: false})
                }, 800)
            }
        }catch(e){
            console.log(e)
            askForConnection()
        }
    }

    useEffect(() => {
        getInformation()
    },[hasConnection])

    const Contenedor = ({title, leftPosition = true, hasBottomLine = true, down = true}) => {
        return (
            <Animatable.View 
                animation={longitud > 1 ? 'fadeIn' : undefined} duration={1000}
                style={{alignSelf: 'stretch', borderColor: '#CBCBCB', alignItems: leftPosition ? 'flex-start' : 'center', justifyContent: 'center', paddingBottom: down ? 7 : 0, marginLeft: hasBottomLine ? 7 : 0}}
            >
                <Text style={{fontSize: 14, color: '#000'}}>{title}</Text>
            </Animatable.View>
        )
    }

    const handleHide = (id, responsable, fecha_inicio, fecha_fin, periodo) => {
        const actual = data.find(x => x.id === id)
        dispatch(handleHideNomina(id))
        setInitialState({...initialState, responsable: !actual.oculta ? '-' : responsable, fecha_inicio: !actual.oculta ? '-' : fecha_inicio, fecha_fin: !actual.oculta ? '-' : fecha_fin, periodo: !actual.oculta ? '-' : periodo})
    }

    const Prenomina = ({id, prenomina, empleados, responsable, fecha_inicio, fecha_fin, periodo, oculta}) => {
        return(
            <>
                <TouchableWithoutFeedback onPress={() => empleados.length >= 1 ? handleHide(id, responsable, fecha_inicio, fecha_fin, periodo) : {}}>
                    <View style={{flex: 1, height: 'auto', marginBottom: 25, borderWidth: 1, borderColor: '#adadad', flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 12, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRadius: 15}}>
                        <View style={{flex: 2, padding: 4, justifyContent: 'center', alignItems: (empleados.length >= 1) ? 'flex-start' : 'center'}}>
                            <Text style={{fontWeight: 'bold', color: Blue, fontSize: 16, padding: 4}}>{prenomina}</Text>
                        </View>
                        {
                            empleados.length >= 1
                            ?
                                <View style={{width: 30, height: 30, backgroundColor: Blue, borderRadius: 35, justifyContent: 'center', alignItems: 'center', paddingTop: oculta ? 1 : 0, paddingBottom: !oculta ? 1 : 0, paddingLeft: isIphone ? .5 : 0}}>
                                    <IonIcons name={oculta ? 'chevron-down' : 'chevron-up'} size={30} color={'#fff'} />
                                </View>
                            :
                                <></>
                        }
                    </View>
                </TouchableWithoutFeedback>
                
                {
                    empleados.length >= 1
                    ?
                        !oculta
                        ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={styles.list}
                                data={empleados}
                                numColumns={1}
                                renderItem={({item}) =>
                                <View
                                    animation='bounceIn'
                                    duration={800}
                                >
                                    <TouchableOpacity style={{height: 'auto', alignSelf: 'stretch', marginBottom: 10}} onPress={() => navigation.navigate('Prenomine', {id_usuario: item.id_usuario, id_puesto: item.id_puesto, btn_editar: true, origin: 2})}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', height: 30, justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{height: 'auto', flex: 1, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                                <View style={{width: item.numero.length <= 3 ? 40 : 45, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingHorizontal: 6, borderRadius: 5}}>
                                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{item.numero}</Text>
                                                </View>
                                                <View style={{flex: 1, height: 30, marginLeft: 4, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: '#dadada', borderRadius: 5}}>
                                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>{item.empleado}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>}
                                keyExtractor={item => String(item.id_empleado)}
                            />
                        :
                            <></>
                    :
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.list}
                            data={empleados}
                            numColumns={1}
                            renderItem={({item}) =>
                            <View
                                animation='bounceIn'
                                duration={800}
                            >
                                <TouchableOpacity style={{height: 'auto', alignSelf: 'stretch', marginBottom: 10}} onPress={() => navigation.navigate('Prenomine', {id_usuario: item.id_usuario, id_puesto: item.id_puesto, btn_editar: true, origin: 2})}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', height: 30, justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{height: 'auto', flex: 1, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{width: item.numero.length <= 3 ? 40 : 45, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingHorizontal: 6, borderRadius: 5}}>
                                                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{item.numero}</Text>
                                            </View>
                                            <View style={{flex: 1, height: 30, marginLeft: 4, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: '#dadada', borderRadius: 5}}>
                                                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000'}}>{item.empleado}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>}
                            keyExtractor={item => String(item.id_empleado)}
                        />
                }
            </>
        )
    }

    return(
        hasConnection
        ?
            <View style={{backgroundColor: '#fff', flex: 1}}>
                <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
                    {
                        orientationInfo.initial === 'PORTRAIT'
                        ?
                            <HeaderPortrait title={language === '1' ? 'Pre-nómina' : 'Pre-nomine'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                        :
                            <HeaderLandscape title={language === '1' ? 'Pre-nómina' : 'Pre-nomine'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                    }
                    <View style={styles.container}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={{alignSelf: 'stretch'}}
                            /* onScroll={handleScroll}
                            contentContainerStyle={{paddingTop: paddingTop}} */
                        >
                            <Title icon={'user'} tipo={1} hasBottom={false} title={language === '1' ? 'INFORMACIÓN GENERAL' : 'GENERAL INFORMATION'}/>
                            <View style={{flexDirection: 'row', marginBottom: 8}}>
                                <View style={{flex: 1, marginLeft: 5}}>
                                    <Text style={styles.title}>{language === '1' ? 'Responsable' : 'Resposible'}</Text>
                                    <Contenedor title={longitud > 1 ? responsable : info.responsable} hasBottomLine={false} down={false}/>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 8}}>
                                <View style={{flex: 1, marginLeft: 5}}>
                                    <Text style={styles.title}>{language === '1' ? 'Fecha Inicio' : 'Start Date'}</Text>
                                    <Contenedor title={longitud > 1 ? fecha_inicio : info.fecha_inicio} hasBottomLine={false} down={false}/>
                                </View>
                                <View style={{flex: 1, paddingHorizontal: 10}}>
                                    <Text style={styles.title}>{language === '1' ? 'Fecha Final' : 'End Date'}</Text>
                                    <Contenedor title={longitud > 1 ? fecha_fin : info.fecha_fin} hasBottomLine={false} down={false} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 15}}>
                                <View style={{width: 'auto', marginLeft: 5}}>
                                    <Text style={styles.title}>{language === '1' ? 'Periodo' : 'Period'}</Text>
                                    <Contenedor title={longitud > 1 ? periodo : info.periodo} hasBottomLine={false} down={false} />
                                </View>
                            </View>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={styles.list}
                                data={data}
                                numColumns={1}
                                renderItem={({item}) => <Prenomina id={item.id} prenomina={item.nombre} empleados={item.empleados} oculta={item.oculta} responsable={item.responsable} fecha_inicio={item.fecha_inicio} fecha_fin={item.fecha_fin} periodo={item.periodo}/>}
                                keyExtractor={item => String(item.id)}
                            />
                        </ScrollView>
                    </View>
                    <ModalLoading visibility={loading}/>
                    <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial}/>
            </View>
        :
            orientationInfo.initial === 'PORTRAIT'
            ?
                <>
                    <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
                    <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                </>
            :
                <>
                    <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
                    <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
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
})