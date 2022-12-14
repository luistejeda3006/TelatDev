import React, { useCallback, useEffect, useRef, useState } from 'react'
import {View, Text, TouchableOpacity, StatusBar, SafeAreaView, ImageBackground, TouchableWithoutFeedback, StyleSheet, Alert, Image, FlatList} from 'react-native'
import {HeaderPortrait, Modal, MultiText} from '../../../../components'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground, Yellow} from '../../../../colors/colorsApp'
import {useDispatch, useSelector} from 'react-redux'
import {selectLanguageApp, selectUserInfo} from '../../../../slices/varSlice'
import * as Animatable from 'react-native-animatable';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {isIphone} from '../../../../access/requestedData'
import {selectOrientation} from '../../../../slices/orientationSlice'
import {useForm, useNavigation, useSound} from '../../../../hooks'
import {RNCamera} from 'react-native-camera';
import {selectFlash, selectType, setFlash, setType} from '../../../../slices/cameraSlice'
import {selectCurrent, setCurrent} from '../../../../slices/dynamicsSlice'
import tw from 'twrnc'
import { useFocusEffect } from '@react-navigation/native'

let contador = 0;
let user = null;
let current = null;

export default ({navigation, route: {params: {title, description, image, hasQR, date, rated, hasDecimal, comments}}}) => {
    const dispatch = useDispatch()
    const refDynamics = useRef()
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)
    const {handlePath} = useNavigation()

    current = useSelector(selectCurrent)
    user = useSelector(selectUserInfo)
    const type = useSelector(selectType)
    const flash = useSelector(selectFlash)
    const [admin, setAdmin] = useState(false);
    const [hasCommented, setHasCommented] = useState(false);
    const [visible, setVisible] = useState(false)
    const [visibleAwards, setVisibleAwards] = useState(false)
    const [visibleList, setVisibleList] = useState(false)
    const [valid, setValid] = useState(1)

    const {sound: validSound} = useSound('valid.mp3')
	const {sound: invalidSound} = useSound('invalid.mp3')

    const [initialState, setInitialState] = useState({
        active: false,
        selected: undefined,
        graphics: [
            {
                icon: 'emoticon-excited-outline',
                color: Blue,
                percentage: 15,
                total: 3
            },
            {
                icon: 'emoticon-happy-outline',
                color: '#69aa46',
                percentage: 33,
                total: 5
            },
            {
                icon: 'emoticon-neutral-outline',
                color: Yellow,
                percentage: 12,
                total: 2
            },
            {
                icon: 'emoticon-sad-outline',
                color: '#ff892a',
                percentage: 77,
                total: 6
            },
            {
                icon: 'emoticon-angry-outline',
                color: '#dd5a43',
                percentage: 0,
                total: 0
            },
        ],
        awards: [
            {
                id: 1,
                award: `Televisi??n de Plasma 54'`,
            },
            {
                id: 2,
                award: `Disfraz de Santa Claus`,
            },
            {
                id: 3,
                award: `Kit d??a del ni??o`,
            },
        ],
        award_detail: undefined,
        list: [
            {
                id: 1,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones M??viles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
            {
                id: 2,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones M??viles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
            {
                id: 3,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones M??viles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
            {
                id: 4,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones M??viles',
                picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
            },
            {
                id: 5,
                no_emp: 73,
                name: 'Luis Manuel Tejeda Cano',
                puesto: 'Desarrollador de Aplicaciones M??viles',
                picture: '' 
            },
        ],
        masterData: [
            {
                id: 1,
                active: 1,
                selected: 2,
                question_1: 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo',
                question_2: 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas',
                question_3: '',
                name: 'Luis Manuel Tejeda Cano',
            },
            {
                id: 2,
                active: 2,
                selected: 3,
                question_1: 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo',
                question_2: 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas',
                question_3: '',
                name: 'Joshua Hernandez Martinez',
            },
            {
                id: 3,
                active: 1,
                selected: 4,
                question_1: 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo',
                question_2: 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas',
                question_3: '',
                name: 'Andr??s Camilo Andrade',
            },
            {
                id: 4,
                active: 1,
                selected: 5,
                question_1: 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo',
                question_2: 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas',
                question_3: '',
                name: 'Laura Hernandez Medina C??rdenas',
            },
            {
                id: 5,
                active: 1,
                selected: 3,
                question_1: 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo',
                question_2: 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas',
                question_3: '',
                name: 'Jesus Manuel Tejeda Cano',
            },
            {
                id: 6,
                active: 2,
                selected: 4,
                question_1: 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo',
                question_2: 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas',
                question_3: '',
                name: 'Joshua Hernandez Martinez',
            },
            {
                id: 7,
                active: 1,
                selected: 3,
                question_1: 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo',
                question_2: 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas',
                question_3: '',
                name: 'Andr??s Camilo Andrade',
            },
            {
                id: 8,
                active: 2,
                selected: 2,
                question_1: 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo',
                question_2: 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas',
                question_3: '',
                name: 'Laura Hernandez Medina C??rdenas',
            },
        ],
    })

    const {active, selected, list, masterData, graphics, awards, award_detail} = initialState
 
    useFocusEffect(
        useCallback(() => {
            handlePath('Dynamics')
        }, [])
    );

    useEffect(() => {
        refDynamics.current?.scrollToPosition(0, 0)
    }, [current])

    const {handleInputChange, values, handleSetState, handleSubmitForm} = useForm({
        question_1: '',
        question_2: '',
        question_3: '',
    })

    const {question_1, question_2, question_3} = values

    const Alerta = () => {
        Alert.alert(
            language === '1' ? 'Campos Vac??os' : 'Empty Fields',
            language === '1' ? 'Revise y llene los campos faltantes' : 'Review and fill in the missing fields',
            [
                { text: 'OK'}
            ]
        )
    }

    const Item = ({id, picture, name, puesto, modal = false}) => {
        return(
            <View style={tw`h-auto self-stretch flex-row justify-center items-center pl-${modal ? 1 : 2.5} pr-${modal ? 0 : 2.5} pb-${modal ? 1 : 2} pt-${modal ? 1.5 : 2} bg-white`}>
                <View style={tw`justify-center items-center w-${modal ? 9 : 13} h-${modal ? 9 : 13} pr-2.5`}>
                    <View style={tw`bg-[#f7f7f7] justify-center items-center rounded-full`}>
                        {
                            picture
                            ?
                                <Image
                                    style={[tw`h-${modal ? 8 : 12} w-${modal ? 8 : 12} rounded-full`, {borderWidth: modal ? 1 : 1.5, borderColor: '#dadada'}]}
                                    resizeMode={'cover'}
                                    source={{uri: picture}}
                                />
                            :
                                <Image
                                    style={[tw`h-${modal ? 8 : 12} w-${modal ? 8 : 12} rounded-full`, {borderWidth: modal ? 1 : 1.5, borderColor: '#dadada'}]}
                                    resizeMode={'cover'}
                                    source={require('../../../../../assets/user.png')}
                                />

                        }
                    </View>
                </View>
                <View style={tw`flex-1 justify-center items-start pt-px`}>
                    <Text style={[tw`text-[#000] font-bold`, {fontSize: modal ? 12 : 15}]}>{name}</Text>
                    <Text style={[tw`text-sm text-[#adadad] mt-${modal ? 0 : 1}`, {fontSize: modal ? 12 : 14}]}>{puesto}</Text>
                </View>
                <View style={tw`w-auto justify-center items-center rounded border border-[#adadad] bg-[#f7f7f7] px-px`}>
                    <Text style={[tw`text-[#adadad]`, {fontSize: modal ? 10 : 12}]}>10:58 am</Text>
                </View>
            </View>
        )
    }

    const ItemResponse = ({length, id = 10, name = 'An??nimo', active = active === 1 ? true : false, selected = 3, question_1 = 'Me gust?? mucho la manera en la que se llev?? acabo el sorteo', question_2 = 'Hacer m??s sorteos en las din??micas, eso m??tiva a las personas', question_3 = ''}) => {
        let actived = active === 1 ? true : false
        return(
            <View style={tw`h-auto self-stretch justify-center items-center my-2 bg-white py-1 px-2.5 shadow m-2 rounded`}>
                <View style={tw`self-stretch flex-row pt-0.5 justify-center items-center`}>
                    <View style={tw`flex-1 justify-center items-start`}>
                        <Text style={tw`text-[#000] text-sm font-bold`}>{actived ? 'An??nimo' : name}</Text>
                        <Text style={[{fontSize: 12}, tw`text-[#adadad]`]}>{`La respuesta es `}<Text style={tw`font-bold`}>{`${!actived ? 'p??blica' : 'an??nima'}`}</Text></Text>
                    </View>
                    <View style={tw`h-6.5 w-6.5 justify-center items-center bg-[${actived ? Blue : '#f7f7f7'}] rounded-full border border-[#adadad]`}>
                        <View style={tw`flex-1 justify-center items-center`}>
                            <IonIcons name={'incognito'} size={16} color={actived ? '#fff' : '#777'} />
                        </View>
                    </View>
                </View>
                <View style={tw`h-auto self-stretch flex-row justify-center items-center pt-2`}>
                    <View style={tw`flex-1 justify-center items-center p-1`}>
                        <IonIcons name={'emoticon-angry-outline'} size={38} color={selected === 2 ? '#dd5a43' : '#777'} />
                    </View>
                    <View style={tw`flex-1 justify-center items-center p-1`}>
                        <IonIcons name={'emoticon-sad-outline'} size={38} color={selected === 3 ? '#ff892a' : '#777'} />
                    </View>
                    <View style={tw`flex-1 justify-center items-center p-1`}>
                        <IonIcons name={'emoticon-neutral-outline'} size={38} color={selected === 4 ? Yellow : '#777'} />
                    </View>
                    <View style={tw`flex-1 justify-center items-center p-1`}>
                        <IonIcons name={'emoticon-happy-outline'} size={38} color={selected === 5 ? '#69aa46' : '#777'} />
                    </View>
                    <View style={tw`flex-1 justify-center items-center p-1`}>
                        <IonIcons name={'emoticon-excited-outline'} size={38} color={selected === 6 ? Blue : '#777'} />
                    </View>
                </View>

                <View style={tw`justify-start items-center h-auto mb-3 self-stretch mt-1`}>
                    <View style={{width: 'auto', borderBottomWidth: selected ? 1 : 0, borderBottomColor: selected === 2 ? '#dd5a43' : selected === 3 ? '#ff892a' : selected === 4 ? Yellow : selected === 5 ? '#69aa46' : selected === 6 ? Blue : '#777'}}>
                        <Text style={{fontSize: 15, fontWeight: 'normal', textAlign: 'center', color: selected === 2 ? '#dd5a43' : selected === 3 ? '#ff892a' : selected === 4 ? Yellow : selected === 5 ? '#69aa46' : selected === 6 ? Blue : '#777'}}>{selected === 2 ? 'Muy Insatisfecho' : selected === 3 ? 'Insatisfecho' : selected === 4 ? 'Neutral' : selected === 5 ? 'Satisfecho' : selected === 6 ? 'Excelente' : '------'}</Text>
                    </View>
                </View>

                <View style={tw`h-auto self-stretch`}>
                    <Text style={[titleStyle, tw`text-[#000] font-bold mb-px`]}>??Qu?? te gust?? de esta din??mica?</Text>
                    <Text style={[tw`text-[#adadad] mb-2`, {fontSize: 13}]}>{question_1}</Text>
                    <Text style={[titleStyle, tw`text-[#000] font-bold mb-px`]}>??Qu?? mejorar??as?</Text>
                    <Text style={[tw`text-[#adadad] mb-2`, {fontSize: 13}]}>{question_2}</Text>
                    <Text style={[titleStyle, tw`text-[#000] font-bold mb-px`]}>Comentarios</Text>
                    <Text style={[tw`text-[#adadad] mb-1`, {fontSize: 13}]}>{question_3 ? question_3 : '---'}</Text>
                </View>
            </View>
        )
    }

    const handleScan = ({data}) => {
        console.log('award_detail: ', award_detail)
        if(isNaN(data) && contador === 0 && !visible && data.length >= 15){
            setVisible(true)
            validSound.play()
            setInitialState({...initialState, list: [{
                id: Math.random().toString(),
                no_emp: 73,
                name: 'Este es un nuevo registro',
                puesto: 'Progrador en Sistemas',
                picture: '' 
            }, ...list]})
            setTimeout(() => {
                setVisible(false)
            }, 3500)
        }
    }

    const handleAnswer = () => {
        if(question_1 && question_2 && selected){
            const temporal = {
                active: active ? 1 : 2,
                selected: selected + 1,
                question_1: question_1.trim(),
                question_2: question_2.trim(),
                question_3: question_3.trim(),
                name: 'Luis Manuel Tejeda Cano'/* user.data.datos_personales.nombre_completo */,
            }

            console.log('body: ', temporal)
            
            //aqu?? se tiene que hacer todo el proceso para guardar

            //Mientras hacemos el proceso estatico
            setHasCommented(!hasCommented)
            setInitialState({...initialState, masterData: [{id: 1, ...temporal}]})
        } else Alerta()
    }

    const handleAward = (id, event) => {
        console.log('id: ', id)
        setVisibleAwards(!visibleAwards)
        setInitialState({...initialState, award_detail: {id: id, event: event}})
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }}/>
            {
                current !== 2
                &&
                    <HeaderPortrait title={language === '1' ? 'Evaluaci??n' : 'Assessment'} screenToGoBack={'Dynamics'} navigation={navigation} normal={true}/>
            }
            <View style={{backgroundColor: '#fff', flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center'}}>
                {
                    current === 1 || current === 3
                    ?
                        <>
                            {
                                admin
                                &&
                                    <View style={tw`h-12.5 self-stretch flex-row border-b border-b-[${Blue}]`}>
                                        <TouchableWithoutFeedback onPress={() => dispatch(setCurrent(1))}>
                                            <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                                                <IonIcons name={'bullseye-arrow'} size={28} color={current === 1 ? Blue : '#adadad'} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => {
                                            dispatch(setType('back'))
                                            dispatch(setFlash('off'))
                                            dispatch(setCurrent(2))
                                            setVisibleAwards(!visibleAwards)
                                            setInitialState({...initialState, award_detail: undefined})
                                        }}>
                                            <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                                                <IonIcons name={'qrcode-scan'} size={28} color={current === 2 ? Blue : '#adadad'} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => dispatch(setCurrent(3))}>
                                            <View style={tw`flex-1 justify-center items-center bg-[rgba(50,131,197,.1)]`}>
                                                <IonIcons name={'text-box-check-outline'} size={28} color={current === 3 ? Blue : '#adadad'} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                            }
                            {
                                current === 3
                                &&
                                    <View style={tw`h-8 py-1.5 justify-center items-center self-stretch border-b border-b-[#dadada] bg-[#f7f7f7]`}>
                                        <View style={tw`flex-1 justify-center items-center flex-row`}>
                                            <Text style={[tw`text-xs text-[#777] font-bold`, {fontSize: 14}]}>Total <Text style={tw`font-normal`}>escaneados: </Text></Text>
                                            <Text style={[tw`font-bold text-[#777] text-xs android:pt-px`, {fontSize: 14}]}>{list.length}</Text>
                                        </View>
                                    </View>
                            }
                            <KeyboardAwareScrollView
                                ref={refDynamics}
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
                                                            <Text onPress={() => setAdmin(!admin)} style={tw`text-xl font-bold text-[#fff] ml-1`}>{title}</Text>
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
                                            {
                                                admin
                                                ?
                                                    <>
                                                        <View style={tw`h-auto self-stretch justify-center items-center mt-4`}>
                                                            <View style={tw`w-[20%] h-12.5 bg-[#FEE59A] rounded border border-[#ECD79A] justify-center items-center`}>
                                                                <Text style={tw`text-[#996633] text-lg font-bold`}>{hasDecimal ? rated : rated.toString() + '.0'}</Text>
                                                            </View>
                                                            <View style={tw`h-auto self-stretch py-1.5 justify-center items-center flex-row`}>
                                                                <View style={tw`w-7 h-7 justify-center items-center`}>
                                                                    <IonIcons name={rated >= 1 ? 'star' : rated >= 0.5 ? 'star-half-full' : 'star-outline'} size={21} color={'#FEB902'} />
                                                                </View>
                                                                <View style={tw`w-7 h-7 justify-center items-center`}>
                                                                    <IonIcons name={rated >= 2 ? 'star' : rated >= 1.5 ? 'star-half-full' : 'star-outline'} size={21} color={'#FEB902'} />
                                                                </View>
                                                                <View style={tw`w-7 h-7 justify-center items-center`}>
                                                                    <IonIcons name={rated >= 3 ? 'star' : rated >= 2.5 ? 'star-half-full' : 'star-outline'} size={21} color={'#FEB902'} />
                                                                </View>
                                                                <View style={tw`w-7 h-7 justify-center items-center`}>
                                                                    <IonIcons name={rated >= 4 ? 'star' : rated >= 3.5 ? 'star-half-full' : 'star-outline'} size={21} color={'#FEB902'} />
                                                                </View>
                                                                <View style={tw`w-7 h-7 justify-center items-center`}>
                                                                    <IonIcons name={rated >= 5 ? 'star' : rated >= 4.5 ? 'star-half-full' : 'star-outline'} size={21} color={'#FEB902'} />
                                                                </View>
                                                            </View>
                                                        </View>
                                                        {
                                                            graphics.map(x => 
                                                                <View style={tw`h-10 self-stretch justify-center items-center`}>
                                                                    <View style={tw`h-auto self-stretch justify-center items-center flex-row pr-6 pl-2`}>
                                                                        <View style={tw`w-12 h-10 justify-center items-center`}>
                                                                            <IonIcons name={x.icon} size={25} color={x.color} />
                                                                        </View>
                                                                        <View style={tw`flex-1 justify-start items-start`}>
                                                                            <View style={tw`h-[50%] w-[100%] bg-[#e9e9e9]`}>
                                                                                <View style={tw`h-[100%] w-[${x.percentage + '%'}] bg-[${x.color}] absolute justify-center items-center`}>
                                                                                    {
                                                                                        x.total > 0
                                                                                        &&
                                                                                            <Text style={[tw`text-[#fff] font-bold`, {fontSize: 10}]}>{x.total}</Text>
                                                                                    }
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            )
                                                        }
                                                        <View style={tw`h-auto self-stretch py-1 justify-center items-center`}>
                                                            <Text style={tw`text-[#777] font-bold`}>{`${comments}`}<Text style={tw`font-normal`}> Calificaciones</Text></Text>
                                                        </View>
                                                    </>
                                                :
                                                    <></>
                                            }

                                            {
                                                hasCommented && !admin
                                                ?
                                                    <ItemResponse length={1} single={true} {...masterData[0]}/>
                                                :
                                                    !admin
                                                    ?
                                                        <View style={tw`h-auto self-stretch justify-center items-center my-2 bg-white py-1 px-2.5`}>
                                                            <View style={tw`self-stretch flex-row pt-0.5`}>
                                                                <View style={tw`flex-1 justify-center items-start`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>Dej??nos saber tu opini??n</Text>
                                                                </View>
                                                                <Animatable.View
                                                                    duration={2000}	
                                                                    animation={!active ? 'tada' : undefined}
                                                                    iterationCount={'infinite'}
                                                                    style={tw`h-6.5 w-6.5 justify-center items-center bg-[${active ? Blue : '#f7f7f7'}] rounded-full border border-[#777]`}
                                                                >
                                                                    <TouchableOpacity style={tw`flex-1 justify-center items-center`} onPress={() => setInitialState({...initialState, active: !active})}>
                                                                        <IonIcons name={'incognito'} size={16} color={active ? '#fff' : '#777'} />
                                                                    </TouchableOpacity>
                                                                </Animatable.View>
                                                            </View>
                                                            <View style={tw`h-auto self-stretch justify-center items-start`}>
                                                                <Text style={[{fontSize: 12}, tw`text-[#adadad]`]}>{`Tu respuesta es `}<Text style={tw`font-bold`}>{`${!active ? 'p??blica' : 'an??nima'}`}</Text></Text>
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
                                                                <Text style={titleStyle}>??Qu?? te gust?? de esta din??mica?</Text>
                                                                <MultiText
                                                                    required={true}
                                                                    value={question_1}
                                                                    onChangeText={(e) => handleInputChange(e, 'question_1')}
                                                                    placeholder={'Especifica qu?? fue lo que m??s te gusto de esta din??mica'}
                                                                    multiline={true}
                                                                    numberOfLines={3}
                                                                />
                                                                <View style={tw`h-1.5`}/>
                                                                <Text style={titleStyle}>??Qu?? mejorar??as?</Text>
                                                                <MultiText
                                                                    required={true}
                                                                    value={question_2}
                                                                    onChangeText={(e) => handleInputChange(e, 'question_2')}
                                                                    placeholder={'Especifica qu?? ser??a lo que mejorar??as para futuras din??micas'}
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
                                                                <TouchableOpacity onPress={() => handleAnswer() /* handleSave() */} style={tw`h-auto self-stretch bg-[${Blue}] rounded border border-[#adadad] justify-center items-center pl-2.5 pr-2 py-2 mt-3 flex-row`}>
                                                                    <Text style={tw`font-bold text-[#fff] mr-1.5`}>Env??ar</Text>
                                                                    <IonIcons name={'chat-question-outline'} size={20} color={'#fff'} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    :
                                                        <></>
                                            }

                                        </>
                                    :
                                        <>
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                showsHorizontalScrollIndicator={false}
                                                data={list}
                                                ItemSeparatorComponent={<View style={tw`h-px self-stretch bg-[#dadada]`} />}
                                                renderItem={({item}) => <Item {...item}/>}
                                                keyExtractor={item => String(item.id)}
                                            />
                                        </>
                                }
                            </KeyboardAwareScrollView>
                        </>
                    :
                        <RNCamera
                            flashMode={flash}
                            type={type}
                            ratio='16:9'
                            onBarCodeRead={visible ? undefined : !visibleList ? handleScan : undefined}
                            style={[StyleSheet.absoluteFill, {backgroundColor: 'transparent', justifyContent: 'center'}]}
                        >
                            <View style={tw`h-12.5 self-stretch justify-start items-center flex-row`}>
                                <TouchableOpacity style={tw`w-12.5 h-[100%] justify-center items-center`} onPress={() => dispatch(setCurrent(1))}>
                                    <IonIcons name={'arrow-left-circle'} size={26} color={'#fff'} />
                                </TouchableOpacity>
                                <View style={tw`flex-1 justify-center items-center`}>
                                    <View style={tw`w-auto h-auto py-0.5 px-1.5 bg-[rgba(255,255,255,0.4)] rounded`}>
                                        <Text style={tw`text-base text-[#fff] font-bold`}>{award_detail ? award_detail.event : '---'}</Text>
                                    </View>
                                </View>
                                <View style={tw`w-12.5 h-[100%] justify-center items-center`}>
                                    <IonIcons name={'arrow-left-circle'} size={26} color={'transparent'} />
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50}}>
                                {
                                    visible
                                    ?
                                        <View style={tw`h-50 w-[100%] justify-center items-center absolute top-65 px-10`}>
                                            <View style={tw`h-15 w-[100%] rounded-t overflow-hidden justify-center items-center flex-row bg-white`}>
                                                <Image
                                                    resizeMode='cover'
                                                    style={tw`h-${valid === 1 ? 20 : 13} w-${valid === 1 ? 20 : 13} rounded-full`}
                                                    source={{uri: valid === 1 ? 'https://cdn.dribbble.com/users/2185205/screenshots/7886140/02-lottie-tick-01-instant-2.gif' : 'https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif'}}
                                                />
                                                <View style={tw`h-[100%] self-stretch justify-center items-center mr-7`}>
                                                    <Text style={tw`text-xl text-[#777] font-bold pl-${valid === 1 ? 1 : 3}`}>{valid === 1 ? 'C??digo V??lido' : 'C??digo Inv??lido'}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`h-22 w-[100%] rounded-b bg-white justify-center items-center flex-row border-t border-t-[#dadada]`}>
                                                <View style={tw`w-20 justify-center items-end`}>
                                                    <Image
                                                        style={tw`h-16 w-16 rounded-full border-2 border-[#dadada]`}
                                                        resizeMode={'cover'}
                                                        source={{uri: 'https://telat.mx/intranet/upload/fotos/LUIS_JAVIER_BLANCAS_CAMARENA1.jpg'}}
                                                    />
                                                </View>
                                                <View style={tw`flex-1 self-stretch justify-center items-start px-2.5`}>
                                                    <View style={tw`justify-center items-start h-auto self-stretch`}>
                                                        <Text style={[tw`font-bold text-[#000]`, {fontSize: 16}]}>Jose Javier Blancas</Text>
                                                        <Text style={[tw`text-[#777]`, {fontSize: 14}]}>Soporte</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    :
                                        <Animatable.Image
                                            duration={2000}	
                                            animation={'bounceIn'}
                                            iterationCount={'infinite'}
                                            style={tw`h-30 w-30`}
                                            source={require('../../../../../assets/photo-capture.png')}
                                        />
                                }
                            </View>
                            <View style={tw`h-${isIphone ? 35 : 25} self-stretch justify-center items-center flex-row absolute bottom-0 right-0 left-0`}>
                                {
                                    type === 'back'
                                    ?
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <TouchableOpacity style={tw`w-12.5 h-12.5 justify-center items-center pt-px border border-[#fff] rounded`} onPress={() => dispatch(setFlash(flash === 'off' ? 'torch' : 'off'))}>
                                                <IonIcons name={flash === 'off' ? 'flash' : 'flash-off'} size={26} color={'#fff'} />
                                            </TouchableOpacity>
                                        </View>
                                    :
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <View style={tw`w-12.5 h-12.5 justify-center items-center pt-px border border-[#adadad] rounded`}>
                                                <IonIcons name={flash === 'off' ? 'flash' : 'flash-off'} size={26} color={'#adadad'} />
                                            </View>
                                        </View>
                                }
                                <View style={tw`flex-1 justify-center items-center`}>
                                    <TouchableOpacity style={tw`w-12.5 h-12.5 justify-center items-center pb-px border border-[#fff] rounded`} onPress={() => {
                                        dispatch(setType(type === 'front' ? 'back' : 'front'))
                                        dispatch(setFlash('off'))
                                    }}>
                                        <IonIcons name={'camera-retake'} size={26} color={'#fff'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={tw`flex-1 justify-center items-center`}>
                                    <TouchableOpacity style={tw`w-12.5 h-12.5 justify-center items-center pb-px border border-[#fff] rounded`} onPress={() => list.length > 0 ? setVisibleList(!visibleList) : {}}>
                                        <IonIcons name={'text-box-check-outline'} size={26} color={'#fff'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Modal visibility={visibleList} orientation={orientation} handleDismiss={() => setVisibleList(!visibleList)}>
                                <View style={tw`h-8 py-1.5 justify-center items-center self-stretch border border-[#dadada] bg-[#f7f7f7]`}>
                                    <View style={tw`flex-1 justify-center items-center flex-row`}>
                                        <Text style={[tw`text-xs text-[#777] font-bold`, {fontSize: 14}]}>Total <Text style={tw`font-normal`}>escaneados: </Text></Text>
                                        <Text style={[tw`font-bold text-[#777] text-xs android:pt-px`, {fontSize: 14}]}>{list.length}</Text>
                                    </View>
                                </View>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    data={list}
                                    ItemSeparatorComponent={<View style={tw`h-px self-stretch bg-[#dadada]`} />}
                                    renderItem={({item}) => <Item modal={true} {...item}/>}
                                    keyExtractor={item => String(item.id)}
                                />
                            </Modal>
                        </RNCamera>
                }
            </View>
            <Modal visibility={visibleAwards} except={false}>
                {
                    awards.map(x =>
                        <TouchableOpacity style={tw`h-12.5 self-stretch justify-start items-center flex-row`} key={x.id} onPress={() => handleAward(x.id, x.award)}>
                            <View style={tw`w-6 h-10 justify-center items-center`}>
                                <IonIcons name={'circle-slice-8'} size={14} color={Blue} />
                            </View>
                            <View style={tw`flex-1 justify-center items-start ml-3`}>
                                <Text style={tw`text-lg text-[#000]`}>{x.award}</Text>
                            </View>
                        </TouchableOpacity>    
                    )
                }
            </Modal>
        </>
    )
}

const titleStyle = tw`text-[#000] font-bold mb-1.5`