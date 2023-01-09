import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {isTablet} from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {selectOrientation} from '../slices/orientationSlice';
import {selectLanguageApp} from '../slices/varSlice';

export default ({askForConnection, reloading = null}) => {
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)

    return (
        orientation === 'PORTRAIT'
        ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 15}}>
                <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Image
                        style={[styles.imagen]}
                        resizeMode={'contain'}
                        source={require('../../assets/wifi.gif')}
                    />
                </View>
                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 10}}>
                    <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000', textAlign: 'center'}}>{language === '1' ? 'No hay conexión a Internet' : 'There is no internet connection'}</Text>
                    <Text style={{fontSize: 17, fontWeight: '100', color: '#373737', textAlign: 'center'}}>{language === '1' ? 'Prueba estos pasos para volver a conectarte:' : 'Try these steps to reconnect'}</Text>
                    {
                        !isTablet()
                        ?
                            <View style={{height: 'auto', justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'stretch', padding: 18}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name={'check-circle'} size={24} color='#373737' />
                                    <Text style={{marginLeft: 8, fontSize: 16, color: '#000'}}>{language === '1' ? 'Comprueba el módem y el router' : 'Check the modem and router'}</Text>
                                </View>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name={'check-circle'} size={24} color='#373737' />
                                    <Text style={{marginLeft: 8, fontSize: 16, color: '#000'}}>{language === '1' ? 'Vuelve a conectarte al wifi' : 'Reconnect to Wi-Fi'}</Text>
                                </View>
                            </View>
                        :
                            <View style={{flexDirection: 'row', alignSelf: 'stretch'}}>
                                <View style={{flex:1}}></View>
                                    <View style={{alignSelf: 'stretch', height: 'auto', justifyContent: 'center', alignItems: 'flex-start', padding: 18}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Icon name={'check-circle'} size={24} color='#373737' />
                                            <Text style={{marginLeft: 8, fontSize: 16, color: '#000'}}>{language === '1' ? 'Comprueba el módem y el router' : 'Check the modem and router'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', marginTop: 10}}>
                                            <Icon name={'check-circle'} size={24} color='#373737' />
                                            <Text style={{marginLeft: 8, fontSize: 16, color: '#000'}}>{language === '1' ? 'Vuelve a conectarte al wifi' : 'Reconnect to Wi-Fi'}</Text>
                                        </View>
                                    </View>
                                <View style={{flex:1}}></View>
                            </View>
                    }
                </View>
                <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', marginTop: 30}}>
                    <TouchableOpacity style={{backgroundColor: '#fff', borderColor: '#1177E9', borderWidth: 1, height: 'auto', borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 3}} onPress={() => {
                        askForConnection()
                        reloading && reloading()
                    }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1177E9', textAlign: 'center'}}>{language === '1' ? 'Volver a cargar la página' : 'Reload the page'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        :
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 15}}>
                <View style={{height: '25%', alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10}}>
                    <Image
                        style={[styles.imagen,{width: '100%', height: '100%'}]}
                        resizeMode={'contain'}
                        source={require('../../assets/wifi.gif')}
                    />
                </View>
                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}}>
                    <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000', textAlign: 'center'}}>{language === '1' ? 'No hay conexión a Internet' : 'There is no internet connection'}</Text>
                    <Text style={{fontSize: 17, fontWeight: '100', color: '#373737', textAlign: 'center'}}>{language === '1' ? 'Prueba estos pasos para volver a conectarte:' : 'Try these steps to reconnect'}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex:1}}></View>
                        <View style={{alignSelf: 'stretch', height: 'auto', justifyContent: 'center', alignItems: 'flex-start', padding: 18}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name={'check-circle'} size={24} color='#373737' />
                                <Text style={{marginLeft: 8, fontSize: 16, color: '#000'}}>{language === '1' ? 'Comprueba el módem y el router' : 'Check the modem and router'}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name={'check-circle'} size={24} color='#373737' />
                                <Text style={{marginLeft: 8, fontSize: 16, color: '#000'}}>{language === '1' ? 'Vuelve a conectarte al wifi' : 'Reconnect to Wi-Fi'}</Text>
                            </View>
                        </View>
                        <View style={{flex:1}}></View>
                    </View>
                </View>
                <View style={{height: '15%', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <TouchableOpacity style={{backgroundColor: '#fff', borderColor: '#1177E9', borderWidth: 1, height: 'auto', borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 3}} onPress={() => {
                        askForConnection()
                        reloading && reloading()
                    }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1177E9', textAlign: 'center'}}>{language === '1' ? 'Volver a cargar la página' : 'Reload the page'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    imagen: {
        width: '80%',
        height: '80%',
        borderRadius: 25,
    },
})