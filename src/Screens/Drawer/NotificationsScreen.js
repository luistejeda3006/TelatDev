import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, StatusBar, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import {HeaderPortrait, HeaderLandscape, FailedNetwork, BottomNavBar} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useConnection, useNavigation, useOrientation, useScroll} from '../../hooks'
import {BallIndicator} from 'react-native-indicators';
import {isIphone, live, login, urlApp} from '../../access/requestedData';
import messaging from '@react-native-firebase/messaging'
import {barStyle, barStyleBackground, Orange, SafeAreaBackground} from '../../colors/colorsApp';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectTokenInfo, setNotification} from '../../slices/varSlice';
import tw from 'twrnc';

let token = null;
let lastNotify = 'lastNotify';
let pendingNotify = 'pendingNotify';
let lastNotifyCand = 'lastNotifyCand';

export default ({navigation, route: {params: {language, orientation, origin = 1}}}) => {
    const dispatch = useDispatch()
    const {handlePath} = useNavigation()
    const {askForConnection, hasConnection} = useConnection()
    token = useSelector(selectTokenInfo)
    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState([])

    useFocusEffect(
        useCallback(() => {
            handlePath(origin === 1 ? 'Logged' : 'Choose')
        }, [])
    );

    const getNotificaciones = async () => {
        try{
            setLoading(true)
            let valueNotificationToken = null
            valueNotificationToken = await messaging().getToken();
            const body = {
                "login": login,
                "action": "get_notificaciones",
                "live": live,
                "data": {
                    "token": valueNotificationToken
                }
            }

            console.log('body:', body)
    
            const request = await fetch(urlApp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            const {response, status} = await request.json();
            if(status === 200){
                if(response.length > 0){
                    setLoading(false)
                    setNotifications(response)
                    dispatch(setNotification(false))
                    await AsyncStorage.setItem(lastNotify, String(response[0].id))
                } else setLoading(false)
            }
            else setLoading(false)
        }catch(e){
            console.log('algo pasó con el internet')
        }
    }

    useEffect(() => {
        getNotificaciones()
    },[hasConnection])

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)

    const reloading = () => {
        setLoading(true)
    }

    const handleOcultar = (id) => {
        const nuevas = notifications.map(x => x.id === id ? ({...x, oculta: !x.oculta}) : ({...x, oculta: true}))
        setNotifications(nuevas)
    }

    const Notification = ({id, title, body, dia, numero, oculta}) => {
        return(
            body.length > 105
            ?
                <TouchableOpacity style={tw`h-${body.length > 26 ? oculta ? 42 : 'auto' : 42} self-stretch bg-[#f1f1f1] px-5 mb-1.5 mt-4`} onPress={() => handleOcultar(id)}>
                    <View style={tw`flex-row h-${body.length > 26 ? oculta ? 42 : 'auto' : 42} self-stretch bg-white justify-center items-center rounded-2xl`}>
                        <View style={tw`w-27.5 justify-center items-center h-${body.length > 26 ? oculta ? 42 : 'auto' : 42}`}>
                            <View style={tw`w-16 h-21 py-2.5 bg-[#FEE188] justify-center items-center rounded-lg`}>
                                <View style={tw`flex-1 self-stretch justify-end items-center`}>
                                    <Text style={tw`text-base text-[#000]`}>{dia}</Text>
                                </View>
                                <View style={tw`flex-1.2 justify-start items-center`}>
                                    <Text style={tw`font-bold text-2xl text-[#000]`}>{numero}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={tw`flex-1 self-stretch py-4 pr-4`}>
                            <View style={tw`flex-1 justify-center items-start`}>
                                <Text style={[{fontSize: 16}, tw`font-bold text-black text-left mb-2`]}>{title}</Text>
                                {
                                    oculta
                                    ?
                                        body.length > 105
                                        ?
                                            <Text style={tw`text-[#adadad] font-bold text-sm text-left`}>{`${body.substring(0,100).trim()}...`}</Text>
                                        :
                                            <Text style={tw`text-[#adadad] font-bold text-sm text-left`}>{body.trim()}</Text>
                                    :
                                        <Text style={tw`text-[#adadad] font-bold text-sm text-left`}>{body.trim()}</Text>
                                }
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            :
                <View style={tw`h-${body.length > 26 ? oculta ? 42 : 'auto' : 42} self-stretch bg-[#f1f1f1] px-5 mb-1.5 mt-4`} onPress={() => handleOcultar(id)}>
                    <View style={tw`flex-row h-${body.length > 26 ? oculta ? 42 : 'auto' : 42} self-stretch bg-white justify-center items-center rounded-3xl`}>
                        <View style={tw`w-27.5 justify-center items-center h-${body.length > 26 ? oculta ? 42 : 'auto' : 42}`}>
                            <View style={tw`w-16 h-21 py-2.5 bg-[#FEE188] justify-center items-center rounded-lg`}>
                                <View style={tw`flex-1 self-stretch justify-end items-center`}>
                                    <Text style={tw`text-base text-[#000]`}>{dia}</Text>
                                </View>
                                <View style={tw`flex-1.2 justify-start items-center`}>
                                    <Text style={tw`font-bold text-2xl text-[#000]`}>{numero}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={tw`flex-1 self-stretch py-4 pr-4`}>
                            <View style={tw`flex-1 justify-center items-start`}>
                                <Text style={[{fontSize: 16}, tw`font-bold text-black text-left mb-2`]}>{title}</Text>
                                <Text style={tw`text-[#adadad] font-bold text-left`}>{body.trim()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
        )
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            <View style={tw`flex-1 justify-start items-center bg-[#f1f1f1] bg-[${hasConnection ? '#f1f1f1' : '#fff'}]`}>
                <>
                    {
                        hasConnection
                        ?
                            <>
                                {
                                    orientationInfo.initial === 'PORTRAIT'
                                    ?
                                        <HeaderPortrait title={language === '1' ? 'Notificaciones' : 'Notifications'} screenToGoBack={origin === 1 ? 'Dashboard' : 'Choose'} navigation={navigation} visible={true} translateY={translateY}/>
                                    :
                                        <HeaderLandscape title={language === '1' ? 'Notificaciones' : 'Notifications'} screenToGoBack={origin === 1 ? 'Dashboard' : 'Choose'} navigation={navigation} visible={true} translateY={translateY}/>
                                }
                                {
                                    loading
                                    ?
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <BallIndicator color={Orange} size={35} />
                                        </View>
                                    :
                                        notifications.length > 0
                                        ?
                                            <>
                                                <FlatList
                                                    showsVerticalScrollIndicator={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    style={tw`h-auto self-stretch px-[${isIphone ? '5%' : '3%'}]`}
                                                    data={notifications}
                                                    numColumns={1}
                                                    renderItem={({item}) => <Notification id={item.id} title={item.title} body={item.body} created={item.created} sent={item.sent} dia={item.dia} numero={item.numero} oculta={item.oculta}/>}
                                                    keyExtractor={item => String(item.id)}
                                                    onScroll={handleScroll}
                                                    contentContainerStyle={{paddingTop: paddingTop}}
                                                />
                                            </>
                                        :
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <Image
                                                    style={tw`w-31 h-31`}
                                                    resizeMode={'contain'}
                                                    source={require('../../../assets/silent.png')}
                                                />
                                                <Text style={tw`mt-4 text-lg text-[#adadad]`}>{language === '1' ? 'No hay notificaciones por mostrar' : 'No notifications to display'}</Text>
                                            </View>
                                }
                                {
                                    origin === 1
                                    &&
                                        <BottomNavBar navigation={navigation} language={language} orientation={orientationInfo.initial} screen={4}/>
                                }
                            </>
                        :
                            <FailedNetwork askForConnection={askForConnection} reloading={reloading} language={language} orientation={orientationInfo.initial}/>
                    }
                </>
                
            </View>
        </>
    );
}