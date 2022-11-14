import React, {useEffect, useState, useCallback} from 'react';
import {View, StatusBar, SafeAreaView, Image} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {barStyle} from '../../colors/colorsApp';
import {useDispatch, useSelector} from 'react-redux';
import {selectOrientation} from '../../slices/orientationSlice';
import { selectChange, setChange } from '../../slices/navigationSlice';
import { useFocusEffect } from '@react-navigation/native';

import tw from 'twrnc';

let keyTokenInfo = 'tokenInfo';
let key = 'Language'
let current = '';
let orientation = 'PORTRAIT';
let focus = null;

export default ({navigation}) => {
    const dispatch = useDispatch()
    orientation = useSelector(selectOrientation)
    focus = useSelector(selectChange)

    const [language, setLanguage] = useState(current);
    const [contador, setContador] = useState(0);

    useFocusEffect(
        useCallback(async () => {
            let data = null;
            data = await AsyncStorage.getItem(keyTokenInfo) || '';
            if(data){
                if(contador === 1) setContador(contador + 1)
                setTimeout(() => {
                    navigation.navigate('Logged', {language: current, orientation: orientation});
                }, 100) //estaba en 5600
            }
            else {
                setTimeout(() => {
                    navigation.navigate('Unlogged', {language: current, orientation: orientation});
                }, 100) //estaba en 5600
            }
        }, [])
      );

    useEffect(async () => {
        let dataNotification = 'dataNotification'
        await AsyncStorage.removeItem(dataNotification)
    })

    /* useEffect(async () => {
        let data = null;
        data = await AsyncStorage.getItem(keyTokenInfo) || '';
        if(data){
            if(contador === 1) setContador(contador + 1)
            setTimeout(() => {
                navigation.navigate('Logged', {language: current, orientation: orientation});
            }, 5600) //estaba en 5600
        }
        else {
            setTimeout(() => {
                navigation.navigate('Unlogged', {language: current, orientation: orientation});
            }, 5600) //estaba en 5600
        }
    },[contador]) */

    return (
        <>
            <StatusBar barStyle={barStyle} />
            <SafeAreaView style={tw`flex-1 bg-[#fff]`}>
                <View style={tw`flex-1 justify-center items-center`}>
                    {
                        orientation === 'PORTRAIT'
                        ?
                            <Image
                                style={tw`w-[38%] h-[38%] rounded-3xl`}
                                resizeMode={'contain'}
                                source={require('../../../assets/loading.gif')}
                            />
                        :
                            <Image
                                style={tw`w-[40%] h-[40%] rounded-3xl`}
                                resizeMode={'contain'}
                                source={require('../../../assets/loading.gif')}
                            />
                    }
                </View>
            </SafeAreaView>
        </>
    )
}