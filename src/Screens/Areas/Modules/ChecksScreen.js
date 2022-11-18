import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, FlatList, StatusBar, SafeAreaView, Image, Alert, TouchableOpacity, ScrollView} from 'react-native'
import {FailedNetwork, HeaderLandscape, HeaderPortrait, ModalLoading} from '../../../components'
import {useConnection, useNavigation, useOrientation} from '../../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isIphone, live, login, urlNomina} from '../../../access/requestedData';
import {getCurrentDate} from '../../../js/dates';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectTokenInfo, selectUserInfo} from '../../../slices/varSlice';
import tw from 'twrnc';

let keyUserInfo = 'userInfo';
let keyTokenInfo = 'tokenInfo';
let token = null;
let user = null;

export default ({navigation, route: {params: {language, orientation}}}) => {
    token = useSelector(selectTokenInfo)
    user = useSelector(selectUserInfo)

    const {handlePath} = useNavigation();
    const {hasConnection, askForConnection} = useConnection();

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    const [initialState, setInitialState] = useState({
        loading: false,
        dias: [],
        año: getCurrentDate().substring(0,4),
        mes: parseInt(getCurrentDate().substring(5,7)),
        dia: 0,
        checadas: [],
        completa: false,
        current: 2
    })

    const {dias, año, mes, completa, checadas, current} = initialState

    const getInformation = async () => {
        try{
            setInitialState({...initialState, loading: true})
            const body = {
                'action': 'get_calendario',
                'data': {
                    'id_usuario': user.data.datos_personales.id_usuario,
                    'fecha_inicio': completa
                },
                'live': live,
                'login': login
            }
    
            const request = await fetch(urlNomina, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify(body)
            });
            
            const {response} = await request.json();
            if(response.status === 200){
                setInitialState({...initialState, dias: response.dias, checadas: response.current})
            }
            else if(response.status === 401){
                Alert.alert(
                    language === 1 ? 'Sesión Expirada' : 'Expired Session',
                    language === 1 ? 'Su sesión ha expirado' : 'Your session has expired',
                    [
                        { text: 'OK'}
                    ]
                )
                await AsyncStorage.removeItem(keyTokenInfo)
                await AsyncStorage.removeItem(keyUserInfo)
                navigation.navigate('AuthLogin')
            }
    
            else if(response.status === 406){
                Alert.alert(
                    language === 1 ? 'Acceso Inválido' : 'Invalid Access', 
                    language === 1 ? 'Acceso denegado, comuniquese con un administrador.' : 'Access denied, contact an administrator',
                    [
                        {
                            text: language === 1 ? 'Entendido' : 'OK',
                            style: 'OK'
                        }
                    ]
                )
                await AsyncStorage.removeItem(keyUserInfo)
                await AsyncStorage.removeItem(keyTokenInfo)
                navigation.navigate('AuthLogin')
            }
        }catch(e){
            setInitialState({...initialState, loading: false})
            askForConnection()
        }
    }

    useEffect(() => {
        getInformation()
    },[completa, hasConnection])

    const handleChangeMonth = useCallback((type) => {
        let finMes = type === '+' ? mes === 12 ? 1 : (mes + 1) : mes === 1 ? 12 : (mes - 1)
        let finAño = type === '+' ? finMes === 1 ? (parseInt(año) + 1) : año : finMes === 12 ? (parseInt(año) - 1) : año
        let completita = `${finAño}-${finMes < 10 ? `0${finMes}` : finMes}-01`
        setInitialState({...initialState, mes: finMes, año: finAño, completa: completita, checadas: []})
    })

    const handleChangeYear = useCallback((type) => {
        let finAño = type === '+' ? (parseInt(año) + 1) : (parseInt(año) - 1)
        let completita = `${finAño}-${mes < 10 ? `0${mes}` : mes}-01`
        setInitialState({...initialState, mes: mes, año: finAño, completa: completita, checadas: []})
    })

    const Mes = ({day}) => {
        return (
            <View style={tw`flex-1 h-12.5 justify-center items-center`}>
                <Text style={tw`font-bold text-black`}>{day}</Text>
            </View>
        )
    }

    const handleHolder = (id, checadas) => {
        const nuevos = dias.map(x => x.id === id ? ({...x, holder: true}) : ({...x, holder: false}))
        setInitialState({...initialState, dias: nuevos, checadas: checadas})
    }

    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            {
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <HeaderPortrait title={language === '1' ? 'Mis Checadas' : 'My Check-Ins'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
                :
                    <HeaderLandscape title={language === '1' ? 'Mis Checadas' : 'My Check-Ins'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
            }
            {
                hasConnection
                ? 
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <>
                            <View style={tw`w-[100%] h-auto bg-[#383838]`}>
                                <View style={tw`h-14 self-stretch flex-row`}>
                                    <View style={tw`flex-1 flex-row justify-start items-center`}>
                                        <TouchableOpacity onPress={() => current !== 1 && setInitialState({...initialState, current: 1})} style={tw`h-[100%] w-auto px-1.5 justify-center items-center`}>
                                            <Text style={tw`font-bold text-lg text-[${current === 1 ? '#fff' : '#adadad'}]`}>{`${año}`}</Text>
                                        </TouchableOpacity>
                                        <Text style={{color: 'white'}}> | </Text>
                                        <TouchableOpacity onPress={() => current !== 2 && setInitialState({...initialState, current: 2})} style={tw`h-[100%] w-auto px-1.5 justify-center items-center`}>
                                            <Text style={tw`font-bold text-lg text-[${current === 2 ? '#fff' : '#adadad'}]`}>{mes === 1 ? language === '1' ? 'Enero' : 'January' : mes === 2 ? language === '1' ? 'Febrero' : 'February' : mes === 3 ? language === '1' ? 'Marzo' : 'March' : mes === 4 ? language === '1' ? 'Abril' : 'April' : mes === 5 ? language === '1' ? 'Mayo' : 'May' : mes === 6 ? language === '1' ? 'Junio' : 'June' : mes === 7 ? language === '1' ? 'Julio' : 'July' : mes === 8 ? language === '1' ? 'Agosto' : 'August' : mes === 9 ? language === '1' ? 'Septiembre' : 'September' : mes === 10 ? language === '1' ? 'Octubre' : 'October' : mes === 11 ? language === '1' ? 'Noviembre' : 'November' : language === '1' ? 'Diciembre' : 'December'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={tw`h-[100%] w-auto justify-center items-center flex-row`}>
                                        {
                                            initialState.loading
                                            ?
                                                <>
                                                    <View style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('-') : handleChangeYear('-')}>
                                                        <IonIcons name={'chevron-left'} size={26} color={'#fff'} />
                                                    </View>
                                                    <View style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('+') : handleChangeYear('+')}>
                                                        <IonIcons name={'chevron-right'} size={26} color={'#fff'} />
                                                    </View>
                                                </>
                                            :
                                                <>
                                                    <TouchableOpacity style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('-') : handleChangeYear('-')}>
                                                        <IonIcons name={'chevron-left'} size={26} color={'#fff'} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('+') : handleChangeYear('+')}>
                                                        <IonIcons name={'chevron-right'} size={26} color={'#fff'} />
                                                    </TouchableOpacity>
                                                </>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={tw`flex-row border border-[#dadada] bg-[#f7f7f7]`}>
                                <Mes day={language === '1' ? 'Lun' : 'Mon'}/>
                                <Mes day={language === '1' ? 'Mar' : 'Tue'}/>
                                <Mes day={language === '1' ? 'Mie' : 'Wed'}/>
                                <Mes day={language === '1' ? 'Jue' : 'Thu'}/>
                                <Mes day={language === '1' ? 'Vie' : 'Fri'}/>
                                <Mes day={language === '1' ? 'Sáb' : 'Sat'}/>
                                <Mes day={language === '1' ? 'Dom' : 'Sun'}/>
                            </View>
                            <View style={tw`h-auto self-stretch border border-[#dadada] bg-white`}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={tw`h-auto self-stretch bg-white`}
                                    data={dias}
                                    numColumns={7}
                                    renderItem={({item}) => 
                                        item.current
                                        ?
                                            <TouchableOpacity style={tw`flex-1 h-12.5 justify-center items-center`} onPress={() => handleHolder(item.id, item.checks)}>
                                                <View style={tw`${item.holder ? `border border-[${Blue}]` : 'border rounded-3xl border-[rgba(249,249,249,0.1)]'} w-9 h-9 justify-center items-center rounded-3xl`}>
                                                    <View style={tw`w-7 h-7 justify-center items-center ${item.selected ? `bg-[${Blue}]` : ''} rounded-3xl ios:pl-px`}>
                                                        <Text style={tw`text-[${!item.selected ? item.current ? item.holder ? Blue : '#383838' : '#adadad' : '#fff'}] text-${(item.selected || item.holder) ? 'xs' : 'sm'} font-${(item.selected || item.holder) ? 'bold' : 'normal'}`}>{item.dia}</Text>
                                                        {
                                                            item.checks.length > 0
                                                            &&
                                                                <View style={tw`w-1.5 h-1.5 rounded-3xl bg-[#39c23b]`}/>
                                                        }
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        :
                                            <View style={tw`flex-1 h-12.5 justify-center items-center`}>
                                                <Text style={tw`text-[#adadad] text-sm`}>{item.dia}</Text>
                                            </View>
                                    }
                                    keyExtractor={item => String(item.id)}
                                />
                            </View>
                            <View style={tw`flex-1 justify-center items-center bg-white`}>
                                {
                                    checadas.length > 0
                                    ?
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            style={tw`h-auto self-stretch bg-white`}
                                            data={checadas}
                                            numColumns={1}
                                            renderItem={({item}) => 
                                                <View style={tw`h-7 self-stretch bg-[#fEE188] mx-2.5 mt-2.5 mb-2 px-px mt-2.5 mb-1.5 px-px flex-row rounded-3xl shadow-md`}>
                                                    <View style={tw`h-7 w-7 justify-center items-center`}>
                                                        <View style={tw`bg-[#00B800] rounded-full w-4 h-4`}/>
                                                    </View>
                                                    <View style={tw`flex-1 justify-center items-center`}>
                                                        <Text style={tw`text-base font-bold text-[#000]`}>{item.hora}</Text>
                                                    </View>
                                                    <View style={tw`h-7 w-7 justify-center items-center`}>
                                                        <View style={tw`rounded-full w-4 h-4`} />
                                                    </View>
                                                </View>
                                            }
                                            keyExtractor={item => String(item.hora)}
                                        />
                                    :
                                        <Image
                                            style={tw`w-62.5 h-62.5`}
                                            resizeMode={'stretch'}
                                            source={{uri: 'https://i.pinimg.com/originals/e3/fe/b0/e3feb005c7be486dbed5e1aa032a4dbb.gif'}}
                                        />
                                }
                            </View>
                        </>
                    :
                        <>
                            <View style={{flexDirection: 'row', backgroundColor: '#fff', flex: 1}}>
                                <View style={{flex: 1.7, backgroundColor: '#fff', paddingLeft: isIphone ? '5%' : 0}}>
                                    <View style={tw`w-[100%] h-auto bg-[#383838]`}>
                                        <View style={tw`h-14 self-stretch flex-row`}>
                                            <View style={tw`flex-1 flex-row justify-start items-center`}>
                                                <TouchableOpacity onPress={() => current !== 1 && setInitialState({...initialState, current: 1})} style={tw`h-[100%] w-auto px-1.5 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-lg text-[${current === 1 ? '#fff' : '#adadad'}]`}>{`${año}`}</Text>
                                                </TouchableOpacity>
                                                <Text style={{color: 'white'}}> | </Text>
                                                <TouchableOpacity onPress={() => current !== 2 && setInitialState({...initialState, current: 2})} style={tw`h-[100%] w-auto px-1.5 justify-center items-center`}>
                                                    <Text style={tw`font-bold text-lg text-[${current === 2 ? '#fff' : '#adadad'}]`}>{mes === 1 ? language === '1' ? 'Enero' : 'January' : mes === 2 ? language === '1' ? 'Febrero' : 'February' : mes === 3 ? language === '1' ? 'Marzo' : 'March' : mes === 4 ? language === '1' ? 'Abril' : 'April' : mes === 5 ? language === '1' ? 'Mayo' : 'May' : mes === 6 ? language === '1' ? 'Junio' : 'June' : mes === 7 ? language === '1' ? 'Julio' : 'July' : mes === 8 ? language === '1' ? 'Agosto' : 'August' : mes === 9 ? language === '1' ? 'Septiembre' : 'September' : mes === 10 ? language === '1' ? 'Octubre' : 'October' : mes === 11 ? language === '1' ? 'Noviembre' : 'November' : language === '1' ? 'Diciembre' : 'December'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={tw`h-[100%] w-auto justify-center items-center flex-row`}>
                                                {
                                                    initialState.loading
                                                    ?
                                                        <>
                                                            <View style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('-') : handleChangeYear('-')}>
                                                                <IonIcons name={'chevron-left'} size={26} color={'#fff'} />
                                                            </View>
                                                            <View style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('+') : handleChangeYear('+')}>
                                                                <IonIcons name={'chevron-right'} size={26} color={'#fff'} />
                                                            </View>
                                                        </>
                                                    :
                                                        <>
                                                            <TouchableOpacity style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('-') : handleChangeYear('-')}>
                                                                <IonIcons name={'chevron-left'} size={26} color={'#fff'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={tw`w-12.5 h-14 justify-center items-center`} onPress={() => current === 2 ? handleChangeMonth('+') : handleChangeYear('+')}>
                                                                <IonIcons name={'chevron-right'} size={26} color={'#fff'} />
                                                            </TouchableOpacity>
                                                        </>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View style={tw`flex-row border border-[#dadada] bg-[#f7f7f7]`}>
                                        <Mes day={language === '1' ? 'Lun' : 'Mon'}/>
                                        <Mes day={language === '1' ? 'Mar' : 'Tue'}/>
                                        <Mes day={language === '1' ? 'Mie' : 'Wed'}/>
                                        <Mes day={language === '1' ? 'Jue' : 'Thu'}/>
                                        <Mes day={language === '1' ? 'Vie' : 'Fri'}/>
                                        <Mes day={language === '1' ? 'Sáb' : 'Sat'}/>
                                        <Mes day={language === '1' ? 'Dom' : 'Sun'}/>
                                    </View>
                                    <ScrollView 
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        style={tw`h-auto self-stretch border border-[#dadada] bg-white`}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            style={tw`h-auto self-stretch bg-white`}
                                            data={dias}
                                            numColumns={7}
                                            renderItem={({item}) => 
                                                item.current
                                                ?
                                                    <TouchableOpacity style={tw`flex-1 h-12.5 justify-center items-center`} onPress={() => handleHolder(item.id, item.checks)}>
                                                        <View style={tw`${item.holder ? `border border-[${Blue}]` : 'border rounded-3xl border-[rgba(249,249,249,0.1)]'} w-9 h-9 justify-center items-center rounded-3xl`}>
                                                            <View style={tw`w-7 h-7 justify-center items-center ${item.selected ? `bg-[${Blue}]` : ''} rounded-3xl ios:pl-px`}>
                                                                <Text style={tw`text-[${!item.selected ? item.current ? item.holder ? Blue : '#383838' : '#adadad' : '#fff'}] text-${(item.selected || item.holder) ? 'xs' : 'sm'} font-${(item.selected || item.holder) ? 'bold' : 'normal'}`}>{item.dia}</Text>
                                                                {
                                                                    item.checks.length > 0
                                                                    &&
                                                                        <View style={tw`w-1.5 h-1.5 rounded-3xl bg-[#39c23b]`}/>
                                                                }
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                :
                                                    <View style={tw`flex-1 h-12.5 justify-center items-center`}>
                                                        <Text style={tw`text-[#adadad] text-sm`}>{item.dia}</Text>
                                                    </View>
                                            }
                                            keyExtractor={item => String(item.id)}
                                        />
                                    </ScrollView>
                                </View>
                                <View style={tw`flex-1 bg-white`}>
                                    {
                                        checadas.length > 0
                                        ?
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                showsHorizontalScrollIndicator={false}
                                                style={tw`h-auto self-stretch bg-white`}
                                                data={checadas}
                                                numColumns={1}
                                                renderItem={({item}) => 
                                                    <View style={tw`h-7 self-stretch bg-[#fEE188] mx-2.5 mt-2.5 mb-2 px-px mt-2.5 mb-1.5 px-px flex-row rounded-3xl shadow-md`}>
                                                        <View style={tw`h-7 w-7 justify-center items-center`}>
                                                            <View style={tw`bg-[#00B800] rounded-full w-4 h-4`}/>
                                                        </View>
                                                        <View style={tw`flex-1 justify-center items-center`}>
                                                            <Text style={tw`text-base font-bold text-[#000]`}>{item.hora}</Text>
                                                        </View>
                                                        <View style={tw`h-7 w-7 justify-center items-center`}>
                                                            <View style={tw`rounded-full w-4 h-4`} />
                                                        </View>
                                                    </View>
                                                }
                                                keyExtractor={item => String(item.hora)}
                                            />
                                        :
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <Image
                                                    style={tw`w-62.5 h-62.5`}
                                                    resizeMode={'stretch'}
                                                    source={{uri: 'https://i.pinimg.com/originals/e3/fe/b0/e3feb005c7be486dbed5e1aa032a4dbb.gif'}}
                                                />
                                            </View>
                                    }
                                </View>
                            </View>
                        </>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                        <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                    </>
            }
            <ModalLoading visibility={initialState.loading}/>
        </>
    )
}