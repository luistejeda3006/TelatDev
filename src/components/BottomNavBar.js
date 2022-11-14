import React, { useEffect, useState } from 'react'
import {View, Image, TouchableOpacity} from 'react-native'
import { isIphone } from '../access/requestedData'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const thereAre = 'thereAre';

export default ({navigation, language, orientation, notify = undefined, screen = undefined}) => {
    const [notificacion, setNotificacion] = useState(notify)

    useEffect(async () => {
        if(!notify){
            let exists = await AsyncStorage.getItem(thereAre) || undefined;
            if(exists === '1') setNotificacion(true)
            else setNotificacion(false)
        } else {
            setNotificacion(notify ? true : false)
        }
    }, [notify])

    return(
        <View style={{height: isIphone ? 70 : 50, alignSelf: 'stretch', backgroundColor: '#383838', flexDirection: 'row'}}>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: isIphone ? 13 : 0}} onPress={() => (screen === 3 || screen === 4) ? navigation.navigate('Logged') : navigation.navigate('Dashboard', {language, orientation})}>
                <Image
                    style={{width: 25, height: 25}}
                    resizeMode={'contain'}
                    source={screen === 1 ? require( '../../assets/designing/bottomMenu/home.png') : require('../../assets/designing/bottomMenu/home_light.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: isIphone ? 13 : 0}} onPress={() => navigation.navigate('Gazette', {language, orientation})}>
                <Image
                    style={{width: 25, height: 25}}
                    resizeMode={'contain'}
                    source={screen === 2 ? require( '../../assets/designing/bottomMenu/gaceta.png') : require('../../assets/designing/bottomMenu/gaceta_light.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: isIphone ? 13 : 0}} onPress={() => navigation.navigate('Notifications', {language, orientation})}>
                <View>
                    <Image
                        style={{width: 25, height: 25}}
                        resizeMode={'contain'}
                        source={screen === 4 ? require( '../../assets/designing/bottomMenu/bell.png') : require('../../assets/designing/bottomMenu/bell_light.png')}
                    />
                    {
                        notificacion
                        &&
                            <View style={{width: 10, height: 10, backgroundColor: 'red', borderWidth: 1, borderColor: '#383838', borderRadius: 20, position: 'absolute', top: 0, right: 0, justifyContent: 'center', alignItems: 'center'}} />
                    }
                </View>
            </TouchableOpacity>
        </View>
        )
    }