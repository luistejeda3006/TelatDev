import React from 'react';
import {View, Animated, Platform, Image, Text, Alert} from 'react-native';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import {Blue, Yellow} from '../colors/colorsApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler'

export default ({navigation, title = '', screenToGoBack = undefined, enabled = false, confirmation = false, currentLanguage = '1', extraAction = undefined, titleAlert = undefined, subtitleAlert = undefined, tipo = 1, news = undefined, SubHeader = undefined, normal = Platform.OS === 'ios' ? true : false, translateY = undefined}) => {
    const {isTablet} = DeviceInfo;
    const handleConfirm = () => {
        Alert.alert(
            !titleAlert ? currentLanguage === '1' ? 'Cancelar Solicitud' : 'Cancel Request' : titleAlert,
            !subtitleAlert ? currentLanguage === '1' ? '¿Estás seguro(a), que desea cancelar tu solicitud? \n\nSe perderán los datos ingresados\n' : 'Are you sure you want to cancel your request? \n\nThe data entered will be lost\n' : subtitleAlert,
            [
                {
                    text: currentLanguage === '1' ? 'Cancelar' : 'Cancel',
                    style: 'cancel'
                },
                { 
                    text: currentLanguage === '1' ? 'Sí, estoy seguro' : 'Yes, I am sure', 
                    onPress: () => {
                        if(!screenToGoBack.includes('_')){
                            navigation.navigate(screenToGoBack)
                        } else {
                            const temporal = screenToGoBack.split('_')
                            navigation.navigate(temporal[0])
                        }
                    }
                }
            ]
        )
    }

    const handleNavigate = async () => {
        let keyAccessed = 'keyAccess';
        await AsyncStorage.setItem(keyAccessed, '0');
        if(extraAction){
            extraAction()
        }
        navigation.goBack()
    }

    const handleOpen = () => {
        if(extraAction){
            extraAction()
        }
        navigation.openDrawer()
    }
    
    return(
        !normal
        ?
            <Animated.View
                style={{
                    transform: [
                        {translateY:  translateY}
                    ],
                    elevation: 4,
                    zIndex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0
                }}
            >
                {
                    tipo === 1
                    ?
                        <View style={{alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, height: isTablet() ? 52 : 58}}>
                            <View style={{ borderRadius: 30, overflow: 'hidden'}}>
                                {
                                    screenToGoBack !== undefined
                                    ?
                                        <TouchableOpacity onPress={() => !confirmation ? handleNavigate() : handleConfirm()}>
                                            <View style={{width: 45, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                                <IonIcons name={'arrow-left'} size={30} color='white' />
                                            </View>
                                        </TouchableOpacity>
                                    :
                                        <TouchableOpacity onPress={() => enabled && handleOpen()}>
                                            <View style={{width: 45, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                                <IonIcons name={'menu'} size={30} color='white' />
                                                {
                                                    news
                                                    &&
                                                        <View style={{width: 19, height: 19, borderColor: '#fff', paddingLeft: .5, borderWidth: 1, backgroundColor: '#EE1717', borderRadius: 10, position: 'absolute', right: 3, top: 6, justifyContent: 'center', alignItems: 'center'}}>
                                                            <IonIcons name={'bell'} size={12} color='white' />
                                                        </View>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                }
                            </View>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch'}}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', height: 'auto', textAlign: 'center'}}>{title}</Text>
                            </View>
                            
                            <View style={{width: 65, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                <Image
                                    style={{width: 45, height: 45}}
                                    resizeMode={'contain'}
                                    source={require('../../assets/logo_telat.png')}
                                />
                            </View>
                        </View>
                    :
                        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: Yellow, height: isTablet() ? '12%' : '15%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#dadada',}}>
                            <View style={{ borderRadius: 30, overflow: 'hidden'}}>
                                <TouchableOpacity onPress={() => !confirmation ? handleNavigate() : handleConfirm()}>
                                    <View style={{height: 'auto', alignSelf: 'stretch', padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                                        <IonIcons name={'arrow-left'} size={30} color={'#fff'} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 5, color: '#fff'}}>{title}</Text>
                        </View>
                }
                {
                    SubHeader
                    &&
                        <SubHeader />
                }
            </Animated.View>
        :
            tipo === 1
            ?
                <View style={{alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, height: isTablet() ? 52 : 58}}>
                    <View style={{ borderRadius: 30, overflow: 'hidden'}}>
                        {
                            screenToGoBack !== undefined
                            ?
                                <TouchableOpacity onPress={() => !confirmation ? handleNavigate() : handleConfirm()}>
                                    <View style={{width: 45, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                        <IonIcons name={'arrow-left'} size={30} color='white' />
                                    </View>
                                </TouchableOpacity>
                            :
                                <TouchableOpacity onPress={() => enabled && handleOpen()}>
                                    <View style={{width: 45, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                        <IonIcons name={'menu'} size={30} color='white' />
                                        {
                                            news
                                            &&
                                                <View style={{width: 19, height: 19, borderColor: '#fff', paddingLeft: .5, borderWidth: 1, backgroundColor: '#EE1717', borderRadius: 10, position: 'absolute', right: 3, top: 6, justifyContent: 'center', alignItems: 'center'}}>
                                                    <IonIcons name={'bell'} size={12} color='white' />
                                                </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch'}}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', height: 'auto', textAlign: 'center'}}>{title}</Text>
                    </View>
                    
                    <View style={{width: 65, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                            style={{width: 40, height: 35}}
                            resizeMode={'contain'}
                            source={require('../../assets/logo_telat.png')}
                        />
                    </View>
                </View>
            :
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: Yellow, height: isTablet() ? '12%' : '15%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#dadada',}}>
                    <View style={{ borderRadius: 30, overflow: 'hidden'}}>
                        <TouchableOpacity onPress={() => !confirmation ? handleNavigate() : handleConfirm()}>
                            <View style={{height: 'auto', alignSelf: 'stretch', padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                                <IonIcons name={'arrow-left'} size={30} color={'#fff'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 5, color: '#fff'}}>{title}</Text>
                </View>
            
    );
}