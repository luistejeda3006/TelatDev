import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderLandscape, HeaderPortrait, Title} from '../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useOrientation} from '../../../hooks'
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground, Yellow} from '../../../colors/colorsApp';
import { isIphone } from '../../../access/requestedData';

export default ({navigation, route: {params: {language, orientation}}}) => {
    const {handlePath} = useNavigation()
    const {isTablet} = DeviceInfo;
    const [info, setInfo] = useState({})
    const [contador, setContador] = useState(0)

    navigation.addListener('focus', () => {
        setContador(contador + 1);
    });

    useEffect(() => {
        handlePath('Dashboard')
    },[contador])

    useEffect(async ()=> {
        let keyAccessed = 'keyAccess';
        let datita = await AsyncStorage.getItem(keyAccessed) || '0';
        
        if(datita) {
            await AsyncStorage.removeItem(keyAccessed).then( () => AsyncStorage.setItem(keyAccessed, '1'));
        }
        else {
            await AsyncStorage.setItem(keyAccessed, AsyncStorage.setItem(keyAccessed, '1'));
        }
    },[contador])

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });

    useEffect(async () => {
        let data = null;
        let keyUserInfo = 'userInfo';
        data = await AsyncStorage.getItem(keyUserInfo) || '[]';
        data = JSON.parse(data);
        let obj = {
            emp_numero: data.data.datos_laborales.emp_numero ? data.data.datos_laborales.emp_numero : 'N/A',
            fecha_ingreso: data.data.datos_laborales.fecha_ingreso ? data.data.datos_laborales.fecha_ingreso : 'N/A',
            antiquity: data.data.datos_laborales.antiguedad ? data.data.datos_laborales.antiguedad : 'N/A',
            
            position: data.data.datos_laborales.puesto ? data.data.datos_laborales.puesto : 'N/A',
            area: data.data.datos_laborales.area ? data.data.datos_laborales.area : 'N/A',
            subarea: data.data.datos_laborales.subarea ? data.data.datos_laborales.subarea : 'N/A',
            
            agreement: data.data.datos_laborales.tipo_contrato ? data.data.datos_laborales.tipo_contrato : 'N/A',
            emp_nss: data.data.datos_laborales.emp_nss ? data.data.datos_laborales.emp_nss : 'N/A',
            payroll: data.data.datos_laborales.tipo_nomina ? data.data.datos_laborales.tipo_nomina : 'N/A',
            
            bussiness_name: data.data.datos_laborales.razon_social ? data.data.datos_laborales.razon_social : 'N/A',
            laboral_location: data.data.datos_laborales.sede_nombre ? data.data.datos_laborales.sede_nombre : 'N/A',
            intranet_user: data.data.datos_laborales.usuario ? data.data.datos_laborales.usuario : 'N/A',
        }
        setInfo(obj)

        return undefined
    },[])

    const Contenedor = ({title, leftPosition = true, hasBottomLine = true}) => {
        return (
            <View style={{alignSelf: 'stretch', borderColor: '#CBCBCB', alignItems: leftPosition ? 'flex-start' : 'flex-end', justifyContent: 'center', paddingBottom: 7, marginLeft: hasBottomLine ? 7 : 0}}>
                <Text style={{fontSize: 14}}>{title}</Text>
            </View>
        )
    }

    const LascapePhoneAndTablet = () => {
        return (
            <View style={styles.container}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{alignSelf: 'stretch'}}
                >
                    <View style={{marginTop: '3%'}}></View>
                    <Title title={'ASSOCIATED'} icon={'account-tie'} tipo={2}/>
                    <View style={{flexDirection: 'row', padding: 7}}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}>{'Employee Number'}</Text>
                                    <Contenedor title={info.emp_numero} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}>{'Date of Admission'}</Text>
                                    <Contenedor title={info.fecha_ingreso} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}>{'Antiquity'}</Text>
                                    <Contenedor title={info.antiquity} hasBottomLine={false}/>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', padding: 7}}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}>{'Position'}</Text>
                                    <Contenedor title={info.position} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}>{'Area'}</Text>
                                    <Contenedor title={info.area} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}>{'Sub-Area'}</Text>
                                    <Contenedor title={info.subarea} hasBottomLine={false}/>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', marginBottom: 7, padding: 7}}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 14}}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}>{'Business Name'}</Text>
                                    <Contenedor title={info.bussiness_name} hasBottomLine={false}/>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 7}}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}>{'Laboral Location'}</Text>
                                    <Contenedor title={info.laboral_location} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 2}}>
                                    <Text style={styles.title}>{'Intranet User'}</Text>
                                    <Contenedor title={info.intranet_user} hasBottomLine={false}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            {
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <HeaderPortrait title={'Employment Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
                :
                    <HeaderLandscape title={'Employment Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
            }
            {
                isTablet()
                ?
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <View style={styles.container}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch'}}
                            >
                                <View style={{marginTop: '3%'}}></View>
                                <Title title={'ASSOCIATED'} icon={'account-tie'} tipo={2}/>
                                <View style={{flexDirection: 'row', paddingHorizontal: 7, paddingTop: 7}}>
                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Employee Number'}</Text>
                                                <Contenedor title={info.emp_numero} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Date of Admission'}</Text>
                                                <Contenedor title={info.fecha_ingreso} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Antiquity'}</Text>
                                                <Contenedor title={info.antiquity} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row', padding: 7}}>
                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Position'}</Text>
                                                <Contenedor title={info.position} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 2}}>
                                                <Text style={styles.title}>{'Area'}</Text>
                                                <Contenedor title={info.area} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Sub-Area'}</Text>
                                                <Contenedor title={info.subarea} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row', marginBottom: 7, paddingHorizontal: 7, paddingBottom: 7}}>
                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Business Name'}</Text>
                                                <Contenedor title={info.bussiness_name} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Laboral Location'}</Text>
                                                <Contenedor title={info.laboral_location} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Intranet User'}</Text>
                                                <Contenedor title={info.intranet_user} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    :
                        <LascapePhoneAndTablet />
                :
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <View style={styles.container}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch'}}
                            >
                                <View style={{marginTop: '3%'}}></View>
                                <Title title={'ASSOCIATED'} icon={'account-tie'} tipo={2}/>
                                <View style={{flexDirection: 'row', padding: 7}}>
                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Employee Number'}</Text>
                                                <Contenedor title={info.emp_numero} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Date of Admission'}</Text>
                                                <Contenedor title={info.fecha_ingreso} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Antiquity'}</Text>
                                                <Contenedor title={info.antiquity} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row', paddingHorizontal: 7, paddingBottom: 7}}>
                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Position'}</Text>
                                                <Contenedor title={info.position} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Area'}</Text>
                                                <Contenedor title={info.area} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Sub-Area'}</Text>
                                                <Contenedor title={info.subarea} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row', marginBottom: 7, paddingHorizontal: 7, paddingBottom: 7}}>
                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Business Name'}</Text>
                                                <Contenedor title={info.bussiness_name} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 7}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Laboral Location'}</Text>
                                                <Contenedor title={info.laboral_location} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.title}>{'Intranet User'}</Text>
                                                <Contenedor title={info.intranet_user} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    :
                        <LascapePhoneAndTablet />
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: isIphone ? '5%' : '3%',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 13,
        color: '#1177E9',
        fontWeight:'500'
    },
    image: {
        width: 165,
        height: 165,
        borderRadius: 85,
    },
    gradient: {
        width: 185,
        height: 185,
        borderRadius: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
})