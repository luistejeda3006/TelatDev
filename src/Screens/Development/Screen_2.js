import React, { useState } from 'react'
import {View, Text, TouchableOpacity, StatusBar, SafeAreaView, ImageBackground, TouchableWithoutFeedback} from 'react-native'
import {HeaderPortrait} from '../../components'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../colors/colorsApp'
import {useSelector} from 'react-redux'
import {selectLanguageApp} from '../../slices/varSlice'
import * as Animatable from 'react-native-animatable';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc'
import { isIphone } from '../../access/requestedData'
import { selectOrientation } from '../../slices/orientationSlice'

export default ({navigation, route: {params: {title, description, image, hasQR, date, rated, hasDecimal}}}) => {
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)
    const [current, setCurrent] = useState(1)
    
    const handleChange = (curr) => {
        setCurrent(curr)
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
            <HeaderPortrait title={language === '1' ? 'Evaluación' : 'Assessment'} screenToGoBack={'Choose'} navigation={navigation} normal={true}/>
            <View style={{backgroundColor: '#f7f7f7', flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center'}}>
                <View style={tw`h-12.5 self-stretch flex-row`}>
                    <TouchableWithoutFeedback onPress={() => setCurrent(1)}>
                        <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                            <IonIcons name={'bullseye-arrow'} size={28} color={current === 1 ? Blue : '#adadad'} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setCurrent(2)}>
                        <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                            <IonIcons name={'qrcode-scan'} size={28} color={current === 2 ? Blue : '#adadad'} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setCurrent(3)}>
                        <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                            <IonIcons name={'text-box-check-outline'} size={28} color={current === 3 ? Blue : '#adadad'} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={tw`shadow-md h-auto self-stretch bg-red-400`}>
                    <ImageBackground style={tw`h-50 self-stretch justify-center items-center`} resizeMode='cover' source={{uri: image}}>
                        <View style={tw`h-7 self-stretch justify-center items-center flex-row`}>
                            <View style={tw`h-[100%] w-auto px-1.5 justify-center items-center rounded-br-xl bg-[rgba(0,0,0,.5)] flex-row`}>
                                <IonIcons name={'calendar'} size={14} color={'#fff'} />
                                <Text style={tw`text-[#fff] font-bold ml-1 text-xs`}>{date}</Text>
                            </View>
                            <View style={tw`flex-1 justify-center items-center`}/>
                            <View style={tw`h-[100%] w-auto justify-center items-center rounded-bl-xl bg-[rgba(0,0,0,.5)] flex-row px-1.5`}>
                                <IonIcons name={`${rated <= 1 ? 'emoticon-angry-outline' : rated <= 2 ? 'emoticon-sad-outline' : rated <= 3 ? 'emoticon-neutral-outline' : rated <= 4 ? 'emoticon-happy-outline' : 'emoticon-excited-outline'}`} size={14} color={'#fff'} />
                                <Text style={tw`text-[#fff] font-bold ml-1 text-xs`}>{hasDecimal ? rated : rated.toString() + '.0'}</Text>
                            </View>
                        </View>
                        <View style={tw`flex-1 justify-center items-center self-stretch`}>
                            <View 
                                style={tw`w-auto h-auto justify-center items-center rounded bg-[rgba(0,0,0,.5)] px-1`}>
                                <Text style={tw`text-xl font-bold text-[#fff]`}>{title}</Text>
                            </View>
                        </View>
                        <View style={tw`h-7 self-stretch justify-center items-end`}>
                            <View style={tw`h-[100%] w-[15%] justify-center items-center rounded-bl-xl flex-row`}>
                                <IonIcons name={'heart'} size={14} color={'transparent'} />
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={tw`h-auto self-stretch bg-[#fff] justify-center items-start px-2`}>
                        <Text style={[{fontSize: 14}, tw`text-[#adadad]`]}>{description}</Text>
                    </View>
                </View>
                <View style={tw`h-auto self-stretch justify-center items-center my-2`}>
                    <Text style={tw`text-[#adadad] text-sm`}>Dejános tu opinión</Text>
                </View>
            </View>
        </>
    )
}