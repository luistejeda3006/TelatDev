import React, { useState } from 'react'
import {View, Text, TouchableOpacity, StatusBar, SafeAreaView, ImageBackground, FlatList, TouchableWithoutFeedback} from 'react-native'
import {HeaderPortrait} from '../../components'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../colors/colorsApp'
import {useSelector} from 'react-redux'
import {selectLanguageApp} from '../../slices/varSlice'
import * as Animatable from 'react-native-animatable';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc'
import { isIphone } from '../../access/requestedData'
import { selectOrientation } from '../../slices/orientationSlice'

export default ({navigation}) => {
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)
    const [initialState, setInitialState] = useState({
        data: [
            {
                id: 1,
                title: 'Día de la madre',
                description: 'Se llevará acabo un donativo de juguetes para niños de un orfanato en Santa Clara. Se llevará acabo un donativo de juguetes para niños de un orfanato en Santa Clara. Se llevará acabo un donativo de juguetes para niños de un orfanato en Santa Clara.',
                image: 'https://i.pinimg.com/originals/7c/2f/4b/7c2f4bfbaa411a9ef5b45bd0b4214fba.jpg',
                date: '23/01',
                rated: 2.5,
                comments: 32,
                hasQR: true,
            },
            {
                id: 2,
                title: 'Día del niño',
                description: 'Se llevará acabo un donativo de juguetes para niños de un orfanato en Santa Clara.',
                image: 'https://fondosmil.com/fondo/38780.jpg',
                date: '11/01',
                rated: 4.5,
                comments: 102,
                hasQR: false,
            },
            {
                id: 3,
                title: 'Día del niño',
                description: 'Se llevará acabo un donativo de juguetes para niños de un orfanato en Santa Clara.',
                image: 'https://cdn.wallpapersafari.com/76/19/oTkiJr.jpg',
                date: '11/01',
                rated: 4.5,
                comments: 102,
                hasQR: true,
            },
        ],
    })

    const {data} = initialState

    const Item = ({id, image, title, description, date, rated, comments, hasQR}) => {
        let newRated = parseInt(rated.toFixed())
        let hasDecimal = rated.toString().includes('.')
        return(
            <View style={tw`shadow-md`}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('test_2', {title, image, description, date, rated, comments, hasQR, hasDecimal: hasDecimal})}>
                    <View style={tw`h-auto self-stretch mx-2 mt-2 mb-${id === data.length ? isIphone ? 6 : 2 : 0} rounded-xl overflow-hidden shadow-md`}>
                        <View style={tw`h-50 self-stretch bg-white`}>
                            <ImageBackground style={tw`flex-1 justify-center items-center`} resizeMode='cover' source={{uri: image}}>
                                <View style={tw`h-7 self-stretch justify-center items-center flex-row`}>
                                    <View style={tw`h-[100%] w-auto px-1.5 justify-center items-center rounded-br-xl bg-[rgba(0,0,0,.5)] flex-row`}>
                                        <IonIcons name={'calendar'} size={14} color={'#fff'} />
                                        <Text style={tw`text-[#fff] font-bold ml-1 text-xs`}>{date}</Text>
                                    </View>
                                    <View style={tw`flex-1 justify-center items-center`}/>
                                    <View style={tw`h-[100%] w-auto justify-center items-center rounded-bl-xl bg-[rgba(0,0,0,.5)] flex-row px-1.5`}>
                                        <IonIcons name={`${newRated <= 1 ? 'emoticon-angry-outline' : newRated <= 2 ? 'emoticon-sad-outline' : newRated <= 3 ? 'emoticon-neutral-outline' : newRated <= 4 ? 'emoticon-happy-outline' : 'emoticon-excited-outline'}`} size={14} color={'#fff'} />
                                        <Text style={tw`text-[#fff] font-bold ml-1 text-xs`}>{hasDecimal ? rated : rated.toString() + '.0'}</Text>
                                    </View>
                                </View>
                                <View style={tw`flex-1 justify-center items-center self-stretch`}>
                                    {
                                        hasQR
                                        ?
                                            <Animatable.View 
                                                duration={3500}	
                                                animation={'tada'}
                                                iterationCount={'infinite'}
                                                style={tw`w-12 h-12 justify-center items-center rounded-3xl bg-[rgba(0,0,0,.5)]`}>
                                                <IonIcons name={'qrcode-scan'} size={24} color={'#fff'} />
                                            </Animatable.View>
                                        :
                                            <></>
                                    }
                                </View>
                                <View style={tw`h-7 self-stretch justify-center items-end`}>
                                    <View style={tw`h-[100%] w-[15%] justify-center items-center rounded-bl-xl flex-row`}>
                                        <IonIcons name={'heart'} size={14} color={'transparent'} />
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={tw`h-auto self-stretch bg-white`}>
                            <View style={tw`flex-row px-1`}>
                                <View style={tw`justify-start items-center flex-1 flex-row`}>
                                    <Text style={[{fontSize: 13}, tw`font-normal text-[#383838] font-bold text-sm`]}>{title}</Text>
                                </View>
                                <View style={tw`justify-end items-center flex-1 flex-row`}>
                                    <View style={tw`w-auto h-[100%] pl-1.5 flex-row justify-center items-center`}>
                                        <View style={{paddingTop: 3}}>
                                            <IonIcons name={'comment-processing-outline'} size={12} color={Blue} />
                                        </View>
                                        <Text style={[{fontSize: 10}, tw`font-bold text-[#000] ml-0.5 mt-px`]}>{comments}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={tw`h-auto self-stretch justify-center items-start pb-1 px-1 bg-white`}>
                            <Text style={[{fontSize: 12}, tw`text-[#adadad]`]}>{description.length >= 120 ? `${description.substring(0,105)}...` : description}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
            <HeaderPortrait title={language === '1' ? 'Dinámicas' : 'Dynamics'} screenToGoBack={'Choose'} navigation={navigation} normal={true}/>
            <View style={{backgroundColor: '#f7f7f7', flex: 1, alignSelf: 'stretch'}}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={data}
                    renderItem={({item}) => <Item {...item}/>}
                    keyExtractor={item => String(item.id)}
                />
            </View>
        </>
    )
}