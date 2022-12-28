import React, { useState } from 'react'
import {View, Text, TouchableOpacity, StatusBar, SafeAreaView, ImageBackground, TouchableWithoutFeedback, StyleSheet, Alert, Image, FlatList} from 'react-native'
import {HeaderPortrait, MultiText} from '../../components'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground, Yellow} from '../../colors/colorsApp'
import {useDispatch, useSelector} from 'react-redux'
import {selectLanguageApp} from '../../slices/varSlice'
import * as Animatable from 'react-native-animatable';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {isIphone} from '../../access/requestedData'
import {selectOrientation} from '../../slices/orientationSlice'
import {useForm} from '../../hooks'
import {RNCamera} from 'react-native-camera';
import {selectFlash, selectType, setFlash, setType} from '../../slices/cameraSlice'
import tw from 'twrnc'

export default ({navigation, route: {params: {title, description, image, hasQR, date, rated, hasDecimal}}}) => {
    const dispatch = useDispatch()
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)
    const type = useSelector(selectType)
    const flash = useSelector(selectFlash)

    const [initialState, setInitialState] = useState({
        current: 1,
        active: false,
        selected: undefined,
        list: [
            {
                id: 1,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones Móviles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
            {
                id: 2,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones Móviles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
            {
                id: 3,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones Móviles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
            {
                id: 4,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones Móviles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
            {
                id: 5,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones Móviles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
        ],
    })

    const {current, active, selected, list} = initialState

    const {handleInputChange, values, handleSetState, handleSubmitForm} = useForm({
        question_1: '',
        question_2: '',
        question_3: '',
    })

    const {question_1, question_2, question_3} = values

    const handleSave = () => {
        if(question_1 && question_2){
            console.log('va a guardar con exito')
        } else {
            Alerta()
        }
    }

    const Alerta = () => {
        Alert.alert(
            language === '1' ? 'Campos Vacíos' : 'Empty Fields',
            language === '1' ? 'Revise y llene los campos faltantes' : 'Review and fill in the missing fields',
            [
                { text: 'OK'}
            ]
        )
    }

    const Item = ({id, picture, name, puesto}) => {
        return(
            <View style={tw`h-auto self-stretch flex-row justify-center items-center border-b border-b-[${id === list.length ? '#dadada' : '#fff'}] p-2.5 bg-white`}>
                <View style={tw`justify-center items-center w-10 h-10 pr-2.5`}>
                    <View style={tw`bg-[#f7f7f7] justify-center items-center rounded-full`}>
                        <Image
                            style={tw`h-10 w-10 rounded-full border-2 border-[#dadada]`}
                            source={{uri: picture}}
                        />
                    </View>
                </View>
                <View style={tw`flex-1 justify-center items-start pt-px`}>
                    <Text style={[tw`text-[#000] font-bold`, {fontSize: 16}]}>{name}</Text>
                    <Text style={tw`text-sm text-[#adadad]`}>{puesto}</Text>
                </View>
                <View style={tw`w-auto justify-center items-center rounded border border-[#adadad] bg-[#f7f7f7] px-px`}>
                    <Text style={tw`text-xs text-[#adadad]`}>10:58 am</Text>
                </View>
            </View>
        )
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
            {
                current !== 2
                &&
                    <HeaderPortrait title={language === '1' ? 'Evaluación' : 'Assessment'} screenToGoBack={'Choose'} navigation={navigation} normal={true}/>
            }
            <View style={{backgroundColor: '#fff', flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center'}}>
                {
                    current === 1 || current === 3
                    ?
                        <>
                            <View style={tw`h-12.5 self-stretch flex-row border-b border-b-[${Blue}]`}>
                                <TouchableWithoutFeedback onPress={() => setInitialState({...initialState, current: 1})}>
                                    <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                                        <IonIcons name={'bullseye-arrow'} size={28} color={current === 1 ? Blue : '#adadad'} />
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    dispatch(setType('back'))
                                    dispatch(setFlash('off'))
                                    setInitialState({...initialState, current: 2})
                                }}>
                                    <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                                        <IonIcons name={'qrcode-scan'} size={28} color={current === 2 ? Blue : '#adadad'} />
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => setInitialState({...initialState, current: 3})}>
                                    <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                                        <IonIcons name={'text-box-check-outline'} size={28} color={current === 3 ? Blue : '#adadad'} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <KeyboardAwareScrollView
                                style={tw`h-auto self-stretch`}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                {
                                    current === 1
                                    ?
                                        <>
                                            <View style={tw`shadow-md h-auto self-stretch bg-white`}>
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
                                                        <View style={tw`w-auto h-auto justify-center items-center rounded bg-[rgba(0,0,0,.6)] px-1 flex-row`}>
                                                            <Animatable.View
                                                                duration={2000}	
                                                                animation={'tada'}
                                                                iterationCount={'infinite'}
                                                                style={tw`justify-center items-center rounded-full`}
                                                            >
                                                                <IonIcons name={'bullhorn-outline'} size={20} color={'#fff'} />
                                                            </Animatable.View>
                                                            <Text style={tw`text-xl font-bold text-[#fff] ml-1`}>{title}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={tw`h-7 self-stretch justify-center items-end`}>
                                                        <View style={tw`h-[100%] w-[15%] justify-center items-center rounded-bl-xl flex-row`}>
                                                            <IonIcons name={'heart'} size={14} color={'transparent'} />
                                                        </View>
                                                    </View>
                                                </ImageBackground>
                                                <View style={tw`h-auto self-stretch bg-[#fff] justify-center items-start px-2 py-1.5`}>
                                                    <Text style={[{fontSize: 14}, tw`text-[#adadad]`]}>{description}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`h-auto self-stretch justify-center items-center my-2 bg-white py-1 px-2.5`}>
                                                <View style={tw`self-stretch flex-row pt-0.5`}>
                                                    <View style={tw`flex-1 justify-center items-start`}>
                                                        <Text style={tw`text-[#000] text-sm font-bold`}>Dejános saber tu opinión</Text>
                                                    </View>
                                                    <Animatable.View
                                                        duration={2000}	
                                                        animation={!active ? 'tada' : undefined}
                                                        iterationCount={'infinite'}
                                                        style={tw`h-6.5 w-6.5 justify-center items-center bg-[${active ? Blue : '#f7f7f7'}] rounded-full border border-[#adadad]`}
                                                    >
                                                        <TouchableOpacity style={tw`flex-1 justify-center items-center`} onPress={() => setInitialState({...initialState, active: !active})}>
                                                            <IonIcons name={'incognito'} size={16} color={active ? '#fff' : '#adadad'} />
                                                        </TouchableOpacity>
                                                    </Animatable.View>
                                                </View>
                                                <View style={tw`h-auto self-stretch justify-center items-start`}>
                                                    <Text style={[{fontSize: 12}, tw`text-[#adadad]`]}>{`Tu respuesta es `}<Text style={tw`font-bold`}>{`${!active ? 'pública' : 'anónima'}`}</Text></Text>
                                                </View>
                                                <View style={tw`h-auto self-stretch flex-row justify-center items-center pt-2`}>
                                                    <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 1 ? setInitialState({...initialState, selected: 1}) : {}}>
                                                        <IonIcons name={'emoticon-angry-outline'} size={38} color={selected === 1 ? '#dd5a43' : '#777'} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 2 ? setInitialState({...initialState, selected: 2}) : {}}>
                                                        <IonIcons name={'emoticon-sad-outline'} size={38} color={selected === 2 ? '#ff892a' : '#777'} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 3 ? setInitialState({...initialState, selected: 3}) : {}}>
                                                        <IonIcons name={'emoticon-neutral-outline'} size={38} color={selected === 3 ? Yellow : '#777'} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 4 ? setInitialState({...initialState, selected: 4}) : {}}>
                                                        <IonIcons name={'emoticon-happy-outline'} size={38} color={selected === 4 ? '#69aa46' : '#777'} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={tw`flex-1 justify-center items-center p-1`} onPress={() => selected !== 5 ? setInitialState({...initialState, selected: 5}) : {}}>
                                                        <IonIcons name={'emoticon-excited-outline'} size={38} color={selected === 5 ? Blue : '#777'} />
                                                    </TouchableOpacity>
                                                </View>

                                                <View style={tw`justify-start items-center h-12 self-stretch mt-1`}>
                                                    <View style={{width: 'auto', borderBottomWidth: selected ? 1 : 0, borderBottomColor: selected === 1 ? '#dd5a43' : selected === 2 ? '#ff892a' : selected === 3 ? Yellow : selected === 4 ? '#69aa46' : selected === 5 ? Blue : '#777'}}>
                                                        <Text style={{fontSize: 15, fontWeight: 'normal', textAlign: 'center', color: selected === 1 ? '#dd5a43' : selected === 2 ? '#ff892a' : selected === 3 ? Yellow : selected === 4 ? '#69aa46' : selected === 5 ? Blue : '#777'}}>{selected === 1 ? 'Muy Insatisfecho' : selected === 2 ? 'Insatisfecho' : selected === 3 ? 'Neutral' : selected === 4 ? 'Satisfecho' : selected === 5 ? 'Excelente' : '------'}</Text>
                                                    </View>
                                                </View>

                                                <View style={tw`h-auto self-stretch`}>
                                                    <Text style={titleStyle}>¿Qué te gustó de esta dinámica?</Text>
                                                    <MultiText
                                                        required={true}
                                                        value={question_1}
                                                        onChangeText={(e) => handleInputChange(e, 'question_1')}
                                                        placeholder={'Especifica qué fue lo que más te gusto de esta dinámica'}
                                                        multiline={true}
                                                        numberOfLines={3}
                                                    />
                                                    <View style={tw`h-1.5`}/>
                                                    <Text style={titleStyle}>¿Qué mejorarías?</Text>
                                                    <MultiText
                                                        required={true}
                                                        value={question_2}
                                                        onChangeText={(e) => handleInputChange(e, 'question_2')}
                                                        placeholder={'Especifica qué sería lo que mejorarías para futuras dinámicas'}
                                                        multiline={true}
                                                        numberOfLines={3}
                                                    />
                                                    <View style={tw`h-1.5`}/>
                                                    <Text style={titleStyle}>Comentarios</Text>
                                                    <MultiText
                                                        required={false}
                                                        value={question_3}
                                                        onChangeText={(e) => handleInputChange(e, 'question_3')}
                                                        placeholder={'Comentarios adicionales en caso de haberlos'}
                                                        multiline={true}
                                                        numberOfLines={3}
                                                    />
                                                </View>
                                                <View style={tw`h-auto self-stretch justify-center items-end mb-[${isIphone ? 12 : 0}]`}>
                                                    {
                                                        selected
                                                        ?
                                                            <TouchableOpacity onPress={() => handleSave()} style={tw`h-auto w-auto bg-[${Blue}] rounded border border-[#adadad] justify-center items-center pl-2.5 pr-2 py-2 mt-3 flex-row`}>
                                                                <Text style={tw`font-bold text-[#fff] mr-1.5`}>Envíar</Text>
                                                                <IonIcons name={'chat-question-outline'} size={20} color={'#fff'} />
                                                            </TouchableOpacity>
                                                        :
                                                            <View style={tw`h-auto w-auto bg-[#dadada] rounded border border-[#adadad] justify-center items-center pl-2.5 pr-2 py-2 mt-3 flex-row`}>
                                                                <Text style={tw`font-bold text-[#fff] mr-1.5`}>Envíar</Text>
                                                                <IonIcons name={'chat-question-outline'} size={20} color={'#fff'} />
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                        </>
                                    :
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            data={list}
                                            ItemSeparatorComponent={<View style={tw`h-px self-stretch bg-[#dadada]`} />}
                                            renderItem={({item}) => <Item {...item}/>}
                                            keyExtractor={item => String(item.id)}
                                        />
                                }
                            </KeyboardAwareScrollView>
                        </>
                    :
                        <RNCamera
                            flashMode={flash}
                            type={type}
                            ratio='16:9'
                            onBarCodeRead={active ? undefined : (e) => console.log('e: ', e)}
                            style={[StyleSheet.absoluteFill, {backgroundColor: 'transparent', justifyContent: 'center'}]}
                        >
                            <View style={tw`h-12.5 self-stretch justify-start items-center flex-row`}>
                                <TouchableOpacity style={tw`w-12.5 h-[100%] justify-center items-center`} onPress={() => setInitialState({...initialState, current: 1})}>
                                    <IonIcons name={'arrow-left-circle'} size={26} color={'#fff'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50}}>
                                <Animatable.Image
                                    duration={2000}	
                                    animation={'bounceIn'}
                                    iterationCount={'infinite'}
                                    style={tw`h-30 w-30`}
                                    source={require('../../../assets/photo-capture.png')}
                                />
                            </View>
                            <View style={tw`h-${isIphone ? 35 : 25} self-stretch justify-center items-center flex-row absolute bottom-0 right-0 left-0`}>
                                {
                                    type === 'back'
                                    ?
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <TouchableOpacity style={tw`w-12.5 h-12.5 justify-center items-center pt-px border border-[#fff]`} onPress={() => dispatch(setFlash(flash === 'off' ? 'torch' : 'off'))}>
                                                <IonIcons name={flash === 'off' ? 'flash' : 'flash-off'} size={26} color={'#fff'} />
                                            </TouchableOpacity>
                                        </View>
                                    :
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <View style={tw`w-12.5 h-12.5 justify-center items-center pt-px border border-[#adadad]`}>
                                                <IonIcons name={flash === 'off' ? 'flash' : 'flash-off'} size={26} color={'#adadad'} />
                                            </View>
                                        </View>
                                }
                                <View style={tw`flex-1 justify-center items-center`}>
                                    <TouchableOpacity style={tw`w-12.5 h-12.5 justify-center items-center pb-px border border-[#fff]`} onPress={() => {
                                        dispatch(setType(type === 'front' ? 'back' : 'front'))
                                        dispatch(setFlash('off'))
                                    }}>
                                        <IonIcons name={'camera-retake'} size={26} color={'#fff'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </RNCamera>
                }
            </View>
        </>
    )
}

const titleStyle = tw`text-sm text-[${Blue}] mb-1.5`