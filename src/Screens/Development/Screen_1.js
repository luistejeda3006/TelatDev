import React, { useState } from 'react'
import {View, ScrollView, Text, StatusBar, SafeAreaView, Image, FlatList, StyleSheet, RefreshControl, TouchableOpacity} from 'react-native'
import {barStyle, barStyleBackground, Blue, Orange, SafeAreaBackground} from '../../colors/colorsApp'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import HTMLView from 'react-native-htmlview'
import tw from 'twrnc'
import { useSelector } from 'react-redux';
import { selectOrientation } from '../../slices/orientationSlice';
import { isIphone } from '../../access/requestedData';
import { getCurrentDate } from '../../js/dates';

export default ({is_table = false}) => {
    const {isTablet} = DeviceInfo;
    const orientation = useSelector(selectOrientation)
    const spliterData = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}, {id: 12}, {id: 13}, {id: 14}, {id: 15}, {id: 16}, {id: 17}, {id: 18}, {id: 19}, {id: 20}, {id: 21}, {id: 22}, {id: 23}, {id: 24}, {id: 25}, {id: 26}, {id: 27}, {id: 28}, {id: 29}, {id: 30}, {id: 31}, {id: 32}, {id: 33}, {id: 34}, {id: 35}]
    const [initialState, setInitialState] = useState({
        chat: [
            {
                "id": 1,
                "fecha": "20 Dec 2022",
                "mensajes": [
                    {
                        "id": 0,
                        "usuario": "Luis Manuel Tejeda Cano",
                        "picture": "https://telat.mx/intranet/upload/fotos/LUIS_MANUEL_TEJEDA_CANO.jpg",
                        "title": "Seguridad Informática / Alta Usuario Aspel",
                        "body": "<div>De prueba&nbsp;</div>",
                        "hora": "13:41",
                        "url": "",
                        "nombre": "",
                        "has_filtro": true,
                        "filtro_autorizacion": 2,
                        "filtro_confirmacion": 2
                    },
                    {
                        "id": 1,
                        "usuario": "Diana Cortina Zamudio",
                        "picture": "https://telat.mx/intranet/upload/fotos/CORTINA_ZAMUDIO_DIANA_MARIA_01_GG.jpg",
                        "title": "",
                        "body": "<div>Ok</div>",
                        "hora": "13:42",
                        "url": "",
                        "nombre": "",
                        "has_filtro": false,
                        "filtro_autorizacion": false,
                        "filtro_confirmacion": false
                    },
                    {
                        "id": 2,
                        "usuario": "Ivonne Catalina Santibañez Garcia",
                        "picture": "https://telat.mx/intranet/upload/fotos/IVONNE_CATALINA_SANTIBAÑEZ_GARCIA.jpg",
                        "title": "",
                        "body": "<div>Sipi</div>",
                        "hora": "13:43",
                        "url": "",
                        "nombre": "",
                        "has_filtro": false,
                        "filtro_autorizacion": false,
                        "filtro_confirmacion": false
                    },
                    {
                        "id": 3,
                        "usuario": "Luis Manuel Tejeda Cano",
                        "picture": "https://telat.mx/intranet/upload/fotos/LUIS_MANUEL_TEJEDA_CANO.jpg",
                        "title": "",
                        "body": "<div>Ayudenme</div>",
                        "hora": "13:46",
                        "url": "",
                        "nombre": "",
                        "has_filtro": false,
                        "filtro_autorizacion": false,
                        "filtro_confirmacion": false
                    },
                    {
                        "id": 4,
                        "usuario": "Jose Javier Jacinto",
                        "picture": "https://telat.mx/intranet/upload/fotos/JOSE_JAVIER_JACINTO_ESPINOZA1.jpg",
                        "title": "",
                        "body": "<div>No quiero</div><div><br></div>",
                        "hora": "13:47",
                        "url": "",
                        "nombre": "",
                        "has_filtro": false,
                        "filtro_autorizacion": false,
                        "filtro_confirmacion": false
                    },
                    {
                        "id": 5,
                        "usuario": "Jose Javier Jacinto",
                        "picture": "https://telat.mx/intranet/upload/fotos/JOSE_JAVIER_JACINTO_ESPINOZA1.jpg",
                        "title": "",
                        "body": "<div>Listo</div>",
                        "hora": "13:47",
                        "url": "",
                        "nombre": "",
                        "has_filtro": false,
                        "filtro_autorizacion": false,
                        "filtro_confirmacion": false
                    },
                    {
                        "id": 6,
                        "usuario": "Luis Manuel Tejeda Cano",
                        "picture": "https://telat.mx/intranet/upload/fotos/LUIS_MANUEL_TEJEDA_CANO.jpg",
                        "title": "",
                        "body": "<div>Se cierra</div>",
                        "hora": "13:47",
                        "url": "",
                        "nombre": "",
                        "has_filtro": false,
                        "filtro_autorizacion": false,
                        "filtro_confirmacion": false
                    }
                ]
            }
        ]
    })

    const {chat} = initialState

    const Chat = ({fecha, mensajes}) => {
        return(
            <>
                <View style={{flexDirection: 'row', height: 'auto', alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 6, marginTop: 8}}>
                    <Icon name={'calendar'} size={15} color={Blue} />
                    <Text style={{fontSize: 12, marginLeft: 5, color: Blue, borderRadius: 8}}>{fecha}</Text>
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{height: 'auto', alignSelf: 'stretch'}}
                    data={mensajes}
                    numColumns={1}
                    renderItem={({item}) =>
                    <View style={{borderWidth: 1.5, borderColor: '#f1f1f1', flex: 1, justifyContent: 'center', alignItems: 'center', height: 'auto', marginVertical: '2%', borderRadius: 14, padding: 4, paddingTop: 8, marginBottom: 10, backgroundColor: '#fff'}} onPress={() => navigation.navigate('test_2')}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 5, backgroundColor: '#dadada', borderRadius: 35, width: 38, height: 38}}>
                                        {
                                            item.picture !== ''
                                            ?
                                                <Image
                                                    style={[image, {width: !isTablet() ? orientation === 'PORTRAIT' ? 35 : 25 : orientation === 'PORTRAIT' ? 35 : 25, height: !isTablet() ? orientation === 'PORTRAIT' ? 35 : 25 : orientation === 'PORTRAIT' ? 35 : 35}]}
                                                    resizeMode={'cover'}
                                                    source={{uri: `${item.picture}`}}
                                                />
                                            :
                                                <Image
                                                    style={[image, {width: !isTablet() ? orientation === 'PORTRAIT' ? 35 : 25 : orientation === 'PORTRAIT' ? 35 : 25, height: !isTablet() ? orientation === 'PORTRAIT' ? 35 : 25 : orientation === 'PORTRAIT' ? 35 : 35}]}
                                                    resizeMode={'cover'}
                                                    source={require('../../../assets/user.png')}
                                                />
                                        }
                                    </View>
                                    <View style={{flex: 1, alignSelf:'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                        <Text style={{fontSize: 15, fontWeight: 'bold', color: Blue}}>{item.usuario}</Text>
                                    </View>
                                    <View style={{width: 'auto', height: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                        <IonIcons name={'clock-outline'} size={15} color={Blue} />
                                        <Text style={{color: Blue, fontSize: 10, marginLeft: 2}}>{item.hora}</Text>
                                    </View>
                                </View>
                                <View style={{height: item.title ? 'auto' : 0, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 14, color: Blue}}>{item.title}</Text>
                                </View>
                                {
                                    item.has_filtro
                                    &&
                                        <View style={{marginTop: 10}}>
                                            <View style={{height: item.filtro_autorizacion ? 'auto' : 0, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
                                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>{item.filtro_autorizacion && 'Ticket Autorizado: '}</Text>
                                                {
                                                    item.filtro_autorizacion === 1
                                                    ?
                                                        <IonIcons name={'clock'} size={22} color={Orange} />
                                                    :
                                                        <View style={{width: 20, height: 20, backgroundColor: item.filtro_autorizacion === 2 ? '#629b58' : '#cf513d', borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                            <IonIcons name={item.filtro_autorizacion === 2 ? 'check' : 'close'} size={item.filtro_autorizacion === 2 ? 14 : 16} color={'#fff'} />
                                                        </View>
                                                }
                                            </View>
                                            {
                                                item.filtro_autorizacion === 2
                                                &&
                                                    <View style={{height: item.filtro_confirmacion ? 'auto' : 0, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 3}}>
                                                        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>{item.filtro_confirmacion && 'Confirmación de Seguridad: '}</Text>
                                                        {
                                                            item.filtro_confirmacion === 1
                                                            ?
                                                                <IonIcons name={'clock'} size={22} color={Orange} />
                                                            :
                                                                <View style={{width: 20, height: 20, backgroundColor: item.filtro_confirmacion === 2 ? '#629b58' : '#cf513d', borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                                    <IonIcons name={item.filtro_confirmacion === 2 ? 'check' : 'close'} size={item.filtro_confirmacion === 2 ? 14 : 16} color={'#fff'} />
                                                                </View>
                                                        }
                                                    </View>
                                            }
                                        </View>
                                }
                                <ScrollView style={{height: 'auto', paddingTop: 10}}>
                                    {
                                        item.id === 0 && is_table
                                        ?
                                            <HTML source={{ html }} {...htmlProps} contentWidth={Dimensions.get('screen').width}/>
                                        :
                                            <HTMLView
                                                value={'<div style="color: black">' + item.body.trim() + '</div>'}
                                                stylesheet={styles}
                                            />
                                    }
                                </ScrollView>
                                {
                                    item.url
                                    ?
                                        !item.url.includes('.jpg') && !item.url.includes('.png') && !item.url.includes('.jpeg') 
                                        ?
                                            <View style={{height: 'auto', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 5, borderTopColor: '#f7f7f7', borderTopWidth: 2.5}}>
                                                <TouchableOpacity onPress={async () => await Linking.openURL(item.url)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <View style={{height: 'auto', width: 'auto', justifyContent: 'center', alignItems: 'center'}} >
                                                        <View style={{height: 'auto', width: 'auto', borderWidth: 1, borderColor: '#dadada'}}>
                                                            <IonIcons name={item.url.includes('.pdf') ? 'file-pdf' : (item.url.includes('.docx') || item.url.includes('.doc')) ? 'file-word' : 'file-excel'} size={32} color={item.url.includes('.pdf') ? '#d53f40' : (item.url.includes('.docx') || item.url.includes('.doc')) ? '#185abd' : '#107c41'} />
                                                        </View>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={{color: Blue, fontSize: 13, marginLeft: 4, textDecorationColor: Blue, textDecorationLine: 'underline', textDecorationStyle: 'solid'}}>{item.nombre}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        :
                                            <View style={{height: 'auto', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 5, borderTopColor: '#f7f7f7', borderTopWidth: 2.5}}>
                                                <TouchableOpacity onPress={async () => await Linking.openURL(item.url)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <View style={{height: 'auto', width: 'auto', justifyContent: 'center', alignItems: 'center'}} >
                                                        <View style={{height: 'auto', width: 'auto', paddingHorizontal: 2, paddingVertical: 1, borderWidth: 1, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
                                                            <Image 
                                                                style={{
                                                                    alignSelf: 'center',
                                                                    height: 30,
                                                                    width: 30
                                                                }}
                                                                source={require('../../../assets/image.png')}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={{color: Blue, fontSize: 13, marginLeft: 4, textDecorationColor: Blue, textDecorationLine: 'underline', textDecorationStyle: 'solid'}}>{item.nombre}</Text>
                                                    </View> 
                                                </TouchableOpacity>
                                            </View>
                                    :
                                        <></>
                                }
                            </View>
                        </View>
                    </View>}
                    keyExtractor={item => String(item.id)}
                    />
            </>
        )
    }

    const Spliter = ({color = Blue}) => {
        return(
            <View style={tw`flex-row justify-center items-center mx-${color === Blue ? 0 : 4}`}>
                <View style={tw`h-4 w-4 rounded-full bg-[${color}] absolute left-[-6]`}></View>
                <View style={tw`h-2 self-stretch justify-center items-center flex-row`}>
                    {
                        spliterData.map(x => x.id <= 35 && <View style={tw`w-0.5 h-0.5 rounded-full bg-[#adadad] mx-1`} />)
                    }
                </View>
                <View style={tw`h-4 w-4 rounded-full bg-[${color}] absolute right-[-6]`}></View>
            </View>
        )
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <ScrollView
                    refreshControl={<RefreshControl
                        style={tw`bg-[${Blue}]`}
                        progressBackgroundColor={Blue}
                        colors={['#fff']}
                        tintColor={'#fff'}
                        refreshing={false}
                        onRefresh={() => {}}
                    />}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`justify-center items-center`}
                    style={tw`self-stretch bg-[#f1f1f1]`}>
                        <View style={tw`h-70 self-stretch justify-start items-center bg-[${Blue}]`}>
                            <View style={tw`h-16 self-stretch justify-center items-center`}>
                                <TouchableOpacity style={tw`rounded-full justify-center items-center bg-[rgba(255,255,255,0.4)] w-14 h-14`}>
                                    <IonIcons name='close' size={23} color={'#fff'} />
                                </TouchableOpacity>
                            </View>
                            <View style={tw`h-15 self-stretch justify-center items-center`}>
                                <Text style={tw`text-white font-bold text-2xl`}>Detalle de Ticket</Text>
                            </View>
                        </View>
                        <View style={[tw`flex-1 self-stretch justify-center items-center mx-[5%] relative top-[-38] z-10 bg-white`, {borderRadius: 22}]}>
                            <View style={[tw`justify-center items-center h-auto self-stretch`, {borderRadius: 22}]}>
                                <View style={tw`h-auto self-stretch flex-row px-5 pt-3 justify-end items-center`}>
                                    <View style={tw`h-auto self-stretch justify-center items-end`}>
                                        <Text style={tw`text-xs font-bold text-[#000]`}>No. Ticket: <Text style={tw`text-[${Orange}]`}>{'SOPI-287'}</Text></Text>
                                    </View>
                                    <View style={tw`w-px h-5 bg-[#dadada] mx-2`} />
                                    <View style={tw`bg-[${Blue ? Blue : '#fff'}] py-px px-1 rounded`}>
                                        <Text style={tw`text-[#fff] font-bold text-xs`}>{'Cerrado'}</Text>   
                                    </View>
                                </View>
                                <View style={[tw`h-auto self-stretch justify-start items-center mt-5 mb-3 px-4`, {borderRadius: 22}]}>
                                    <View style={tw`flex-row self-stretch mb-3`}>
                                        <Image
                                            style={tw`h-12 w-12 rounded-full border-2 border-[#dadada]`}
                                            resizeMode={'cover'}
                                            source={{uri: 'https://cdn.forbes.com.mx/2019/04/blackrrock-invertir-1-640x360.jpg'}}
                                        />
                                        <View style={tw`ml-4 flex-1 justify-center items-start`}>
                                            <Text style={tw`text-[#adadad] text-sm`}>Solicitado por:</Text>
                                            <Text style={tw`text-[#000] font-bold text-sm`}>Luis Manuel Tejeda Cano</Text>
                                        </View>
                                        <View style={tw`h-12 w-14 justify-center items-center pl-px`}>
                                            <View style={tw`w-auto h-auto p-1 justify-center items-center bg-[${Blue}] rounded`}>
                                                <Text style={tw`text-[#fff] font-bold text-xs`}>Media</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Spliter />
                                </View>
                                <View style={tw`flex-row self-stretch mb-3 px-4`}>
                                    <Image
                                        style={tw`h-12 w-12 rounded-full border-2 border-[#dadada]`}
                                        resizeMode={'cover'}
                                        source={{uri: 'https://cdn.forbes.com.mx/2019/04/blackrrock-invertir-1-640x360.jpg'}}
                                    />
                                    <View style={tw`ml-4 flex-1 justify-center items-start`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Asignado a:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>Jose Javier Andrade</Text>
                                    </View>
                                </View>
                                <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mb-2.5`}>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Tipo de Ticket:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>Soporte Intranet</Text>
                                    </View>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Concepto:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>Actualización Incidencias Prenómina</Text>
                                    </View>
                                </View>
                                <Spliter color={'#f1f1f1'}/>
                                <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mt-2.5`}>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Creado:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>2023-01-02 15:16:59</Text>
                                    </View>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Asignado:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>2023-01-02 15:16:59</Text>
                                    </View>
                                </View>
                                <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mt-2.5`}>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Terminado:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>---</Text>
                                    </View>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Cerrado:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>---</Text>
                                    </View>
                                </View>
                                <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mt-2.5`}>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Archivado:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>2023-01-02 15:16:59</Text>
                                    </View>
                                </View>
                                <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 mt-2.5`}>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>T. Atención:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>0:1:12:8</Text>
                                    </View>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>T. Resolución:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>0:0:7:3</Text>
                                    </View>
                                </View>
                                <View style={tw`h-auto self-stretch justify-center items-start flex-row mx-4 my-2.5`}>
                                    <View style={tw`flex-1 justify-start items-start h-auto`}>
                                        <Text style={tw`text-[#adadad] text-sm`}>Detalle:</Text>
                                        <Text style={tw`text-[#000] font-bold text-sm`}>---</Text>
                                    </View>
                                </View>
                                {
                                    chat.length > 0
                                    &&
                                        <Spliter color={'#f1f1f1'}/>
                                }
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{paddingHorizontal: 10}}
                                    style={{height: 'auto', alignSelf: 'stretch'}}
                                    data={chat}
                                    numColumns={1}
                                    renderItem={({item}) => <Chat mensajes={item.mensajes} fecha={item.fecha}/>}
                                    keyExtractor={item => String(item.id)}
                                />
                            </View>
                        </View>
                        <View style={tw`h-70 self-stretch justify-end items-center bg-[#f1f1f1] absolute bottom-0 w-[100%] px-[5%]`}>
                            <TouchableOpacity style={tw`flex-row h-10 bg-[${Blue}] rounded-lg self-stretch w-[100%] items-center justify-center absolute top-35 right-5`}>
                                <IonIcons name={'keyboard-return'} size={22} color={'#fff'} />
                                <Text style={tw`text-[#fff] font-bold text-sm ml-1.5`}>Responder</Text>
                            </TouchableOpacity>
                            <View style={tw`flex-row h-10 rounded-lg self-stretch w-[100%] items-center justify-center absolute bottom-10 right-5`}>
                                <Image
                                    style={tw`h-8 w-8`}
                                    resizeMode={'contain'}
                                    source={require('../../../assets/logo_telat.png')}
                                />
                                <Text style={tw`font-bold text-base text-[#000] ml-2`}>Telat Group<Text style={tw`font-normal`}> © {`${getCurrentDate().substring(0,4)}`}</Text></Text>
                            </View>
                        </View>
                </ScrollView>
            </View>
        </>
    )
}

const image = tw`w-7.5 h-7.5 rounded-full`

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow:1,
    },
    div: {
        color: '#000'
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        height: 45,
        borderRadius: 4,
        paddingHorizontal: isIphone ? 14 : 12
    },
})