import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderPortrait, HeaderLandscape} from '../../../components';
import DeviceInfo from 'react-native-device-info';
import {useNavigation, useOrientation} from '../../../hooks'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp';
import {isIphone} from '../../../access/requestedData';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '../../../slices/varSlice';

let data = ''

export default ({navigation, route: {params: {language, orientation}}}) => {
    data = useSelector(selectUserInfo)
    const {handlePath} = useNavigation()
    const {isTablet} = DeviceInfo;
    const [info, setInfo] = useState({})

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    useEffect(() => {
        let obj = {referencias_personales: data.data.referencias_personales ? data.data.referencias_personales : ''}
        setInfo(obj)
    },[])

    const status = true;
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });

    const Contenedor = ({title, leftPosition = true, hasBottomLine = true}) => {
        return (
            <View style={{alignSelf: 'stretch', borderColor: '#CBCBCB', alignItems: leftPosition ? 'flex-start' : 'flex-end', justifyContent: 'center', marginBottom: hasBottomLine ? 7 : 0, marginLeft: hasBottomLine ? 7 : 0}}>
                <Text style={{fontSize: 14, color: '#000'}}>{title}</Text>
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
                    <HeaderPortrait title={'Personal References'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
                :
                    <HeaderLandscape title={'Personal References'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
            }

            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{alignSelf: 'stretch'}}
                >
                    <View style={{marginTop: '3%'}}/>
                    {
                        info.referencias_personales 
                        &&
                            info.referencias_personales.map(x => 
                                <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', marginBottom: !isTablet() ? 20 : 35}} key={x.nombre}>
                                    <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: Blue, borderColor: Blue, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 6, borderTopStartRadius: 15, borderTopEndRadius: 15}}>
                                        <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>{`Reference ${x.id}`}</Text>
                                    </View>
                                    {
                                        orientationInfo.initial === 'PORTRAIT'
                                        ?
                                            <>
                                                <View style={{borderColor: Blue, borderWidth: 1, alignSelf:'stretch', borderBottomStartRadius: 15, borderBottomEndRadius: 15}}>
                                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 7}}>
                                                        <View style={{flex: 1}}>
                                                            <Text style={styles.title}>{'Name'}</Text>
                                                            <Contenedor title={x.nombre} hasBottomLine={false}/>
                                                        </View>
                                                    </View>

                                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 7}}>
                                                        <View style={{flex: 1}}>
                                                            <Text style={styles.title}>{'Position'}</Text>
                                                            <Contenedor title={x.ocupacion} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={{flex: 1, marginLeft: 6}}>
                                                            <Text style={styles.title}>{'Phone Number'}</Text>
                                                            <Contenedor title={x.telefono} hasBottomLine={false}/>
                                                        </View>
                                                    </View>
                                                </View>
                                            </>
                                        :
                                            <View style={{borderColor: Blue, borderWidth: 1, alignSelf:'stretch', borderBottomStartRadius: 15, borderBottomEndRadius: 15}}>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 7}}>
                                                    <View style={{flex: 1}}>
                                                    <Text style={styles.title}>{'Name'}</Text>
                                                            <Contenedor title={x.nombre} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={{flex: 1, marginLeft: 6}}>
                                                    <Text style={styles.title}>{'Position'}</Text>
                                                            <Contenedor title={x.ocupacion} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={{flex: 1, marginLeft: 6}}>
                                                        <Text style={styles.title}>{'Phone Number'}</Text>
                                                        <Contenedor title={x.telefono} hasBottomLine={false}/>
                                                    </View>
                                                </View>
                                            </View>
                                    }
                                </View>
                            )
                    }
                    
                </ScrollView>
            </View>
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