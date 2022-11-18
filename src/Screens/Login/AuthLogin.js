import React, {useEffect, useCallback} from 'react';
import {View, StatusBar, SafeAreaView, Image} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {barStyle} from '../../colors/colorsApp';
import {selectChange} from '../../slices/navigationSlice';
import {useFocusEffect} from '@react-navigation/native';
import Orientation from 'react-native-orientation';
import {useSelector} from 'react-redux';
import tw from 'twrnc';

let keyTokenInfo = 'tokenInfo';
let current = '';
let orientation = 'PORTRAIT';
let focus = null;

export default ({navigation}) => {
    focus = useSelector(selectChange)

    useFocusEffect(
        useCallback(async () => {
            let data = null;
            data = await AsyncStorage.getItem(keyTokenInfo) || '';
            if(data){
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

    useEffect(() => {
        Orientation.lockToPortrait()
    }, [])

    const removeNotification = async () => {
        let dataNotification = 'dataNotification'
        await AsyncStorage.removeItem(dataNotification)
    }

    useEffect(() => {
        removeNotification()
    })

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