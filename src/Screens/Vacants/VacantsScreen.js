import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, FlatList, Image, Keyboard, StatusBar, SafeAreaView, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {HeaderPortrait, HeaderLandscape, FailedNetwork, InputFilter, RadioButton} from '../../components';
import DeviceInfo from 'react-native-device-info';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useOrientation, useConnection, useNavigation} from '../../hooks';
import {isIphone, live, login, urlJobs} from '../../access/requestedData';
import {BallIndicator} from 'react-native-indicators';
import { barStyle, barStyleBackground, SafeAreaBackground } from '../../colors/colorsApp';
import tw from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';

let data = null;

export default ({navigation, route: {params: {language, orientation, valueNotificationToken}}}) => {
    const [langua, setLanguage] = useState(language)
    const [random, setRandom] = useState(1)
    const [filterUno, setFilterUno] = useState(true)
    const [filterDos, setFilterDos] = useState(false)
    const [filterTres, setFilterTres] = useState(false)

    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    useFocusEffect(
        useCallback(() => {
            handlePath('Choose')
        }, [])
    );
    
    const {isTablet} = DeviceInfo;
    const [filter, setFilter] = useState('');
    const [currentFilter, setCurrentFilter] = useState({
        position: langua === '1' ? 'Puesto...' : 'Position...',
        iconName: 'badge-account-outline'
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(0)
    const [visible, setVisible] = useState(false)

    const [masterDataMX, setMasterDataMX] = useState([]);
    const [masterDataUSA, setMasterDataUSA] = useState([]);

    const [filteredDataMX, setFilteredDataMX] = useState([]);
    const [filteredDataUSA, setFilteredDataUSA] = useState([]);

    const getVacantes = async () => {
        try{
            const body = {
                'action': 'get_vacantes',
                'data': {
                    'idioma': language,
                    'token': valueNotificationToken
                },
                'login': login,
                'live': live
            }
            
            const request = await fetch(urlJobs, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
        
            const {response, status} = await request.json();

            if(status === 200){
                setResult(1)
                data = response.sort((a, b) => b.prioridad.localeCompare(a.prioridad));
                const justMX = data.filter(x => x.region === 'MX' && x)
                const justUSA = data.filter(x => x.region === 'US' && x)
                
                setFilteredDataMX(justMX)
                setMasterDataMX(justMX)
    
                setFilteredDataUSA(justUSA)
                setMasterDataUSA(justUSA)
    
                setLoading(!loading)
                setVisible(!visible)
            }
            if(status === 404){
                setResult(0)
                setLoading(!loading)
            }
        }catch(e){
            askForConnection()
            console.log('algo pasó con el internet')
            setLoading(false)
        }
    }

    useEffect(() => {
        getVacantes()
    },[hasConnection])

    const handleReload = () => {
        const justMX = data.filter(x => x.region === 'MX' && x)
        const justUSA = data.filter(x => x.region === 'US' && x)
        
        setFilteredDataMX(justMX)
        setMasterDataMX(justMX)

        setFilteredDataUSA(justUSA)
        setMasterDataUSA(justUSA)
    }

    useEffect(() => {
        if(data){
            setFilter('')
            handleReload()
            Keyboard.dismiss()
        }
    }, [random])

    const handleFilterChange = (text) => {
        if(currentFilter.iconName === 'badge-account-outline'){
            if(text){
                const newDataMX = masterDataMX.filter(item => {
                    const itemData = item.nombre ? item.nombre.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                const newDataUSA = masterDataUSA.filter(item => {
                    const itemData = item.nombre ? item.nombre.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                setFilteredDataMX(newDataMX);
                setFilteredDataUSA(newDataUSA);
                setFilter(text)
            }
            else {
                setFilteredDataMX(masterDataMX);
                setFilteredDataUSA(masterDataUSA)
                setFilter(text)
            }
        }

        else if(currentFilter.iconName === 'map-marker'){
            if(text){
                const newDataMX = masterDataMX.filter(item => {
                    const itemData = item.edificio ? item.edificio.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                const newDataUSA = masterDataUSA.filter(item => {
                    const itemData = item.edificio ? item.edificio.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                setFilteredDataMX(newDataMX);
                setFilteredDataUSA(newDataUSA);
                setFilter(text)
            }
            else {
                setFilteredDataMX(masterDataMX);
                setFilteredDataUSA(masterDataUSA);
                setFilter(text)
            }
        }
        else {
            if(text){
                const newDataMX = masterDataMX.filter(item => {
                    const itemData = item.sueldo ? item.sueldo.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                const newDataUSA = masterDataUSA.filter(item => {
                    const itemData = item.sueldo ? item.sueldo.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                setFilteredDataMX(newDataMX);
                setFilteredDataUSA(newDataUSA);
                setFilter(text)
            }
            else {
                setFilteredDataMX(masterDataMX);
                setFilteredDataUSA(masterDataUSA);
                setFilter(text)
            }

        }
    }
    
    const handleChangeIcon = () => {
        if(currentFilter.iconName === 'badge-account-outline') {
            setCurrentFilter({
                position: langua === '1' ? 'Edificio...' : 'Edifice...',
                iconName: 'map-marker'
            })
            setFilter('')
            handleFilterChange('')
            Keyboard.dismiss()
        }
        else if(currentFilter.iconName === 'map-marker'){
            setCurrentFilter({
                position: langua === '1' ? 'Salario...' : 'Salary...',
                iconName: 'cash'
            })
            setFilter('')
            handleFilterChange('')
            Keyboard.dismiss()
        }
        else {
            setCurrentFilter({
                position: langua === '1' ? 'Puesto...' : 'Position...',
                iconName: 'badge-account-outline'
            })
            setFilter('')
            handleFilterChange('')
            Keyboard.dismiss()
        }
    }

    const Vacant = ({id, nombre, sueldo, ubicacion, region, descripcion, requisitos, beneficios, telefono, id_sede}) => {
        return (
            orientationInfo.initial === 'PORTRAIT'
            ?
                <View style={tw`flex-1 my-[${orientationInfo.initial === 'PORTRAIT' ? '2%': '0%'}] h-auto justify-center items-center bg-white mx-[2%]`}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('VacantDetail', {language: langua, orientation: orientationInfo.initial, id: id, nombre: nombre, ubicacion: ubicacion, descripcion: descripcion, beneficios: beneficios, requisitos: requisitos, sueldo: sueldo, telefono: telefono, country: region, id_sede: id_sede})} >
                        <View style={tw`h-auto self-stretch justify-center items-start p-2.5 rounded-md shadow-md bg-white`}>
                            <Text style={tw`text-[#000] text-base font-bold`}>{nombre}</Text>
                            <View style={tw`h-auto justify-center items-center mt-1.5`}>
                                <Text style={tw`text-[#000] bg-[#dadada] text-sm`}>{sueldo}</Text>
                            </View>
                            <View style={tw`h-auto self-stretch mt-1.5 self-stretch`}>
                                <Text style={tw`text-[#000]`}>{ubicacion}</Text>
                            </View>
                            <View style={tw`h-auto self-stretch mt-2.5 justify-start items-end`}>
                                <View style={tw`flex-1`}></View>
                                <View  style={tw`h-auto self-stretch justify-center items-center flex-row`}>
                                    <View style={tw`w-5 justify-center items-center mb-${orientationInfo.initial === 'PORTRAIT' ? 0 : 8}`}>
                                        <IonIcons name={'clock-outline'} size={20} color='black'/>
                                    </View>
                                    <View style={tw`flex-1 self-stretch justify-center items-start ml-1.5`}>
                                        <Text style={tw`text-[#c1c1c1] text-sm`}>{langua === '1' ? 'Se uno de los primeros en postularse' : 'Be one of the first to apply'}</Text>
                                    </View>
                                    <View style={tw`justify-center items-center p-1`}>
                                        {
                                            region === 'MX'
                                            ?
                                                <Image
                                                    style={tw`w-6 h-6 border border-[#dadada] rounded-full m-[1%]`}
                                                    resizeMode={'contain'}
                                                    source={require('../../../assets/language_mx.png')}
                                                />
                                            :
                                                <Image
                                                    style={tw`w-6 h-6 border border-[#dadada] rounded-full m-[1%]`}
                                                    resizeMode={'contain'}
                                                    source={require('../../../assets/language_us.png')}
                                                />    
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            :
                <View style={tw`w-[100%] h-auto my-[0.7%]`}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('VacantDetail', {language: langua, orientation: orientationInfo.initial, id: id, nombre: nombre, ubicacion: ubicacion, descripcion: descripcion, beneficios: beneficios, requisitos: requisitos, sueldo: sueldo, telefono: telefono, country: region, id_sede: id_sede})} >
                        <View style={tw`flex-1 justify-start items-start p-2.5 border border-[#dadada] rounded-md`}>
                            <Text style={tw`text-[#000] text-base font-bold`}>{nombre}</Text>
                            <View style={tw`h-auto justify-center items-center mt-1.5`}>
                                <Text style={tw`text-[#000] bg-[#d1d1d1]`}>{sueldo}</Text>
                            </View>
                            <Text style={tw`text-[#000] flex-1 mt-1.5 text-sm`}>{ubicacion}</Text>
                            <View style={tw`h-auto mt-2.5 self-stretch justify-start items-end`}>
                                <View style={tw`h-auto self-stretch justify-center items-center flex-row`}>
                                    <View style={tw`w-5 justify-center items-center`}>
                                        <IonIcons name={'clock-outline'} size={20} color='black'/>
                                    </View>
                                    <View
                                        style={tw`flex-1 self-stretch justify-center items-start ml-2`}>
                                        <Text style={tw`text-[#c1c1c1] text-sm`}>{langua === '1' ? 'Se uno de los primeros en postularse' : 'Be one of the first to apply'}</Text>
                                    </View>
                                    <View style={tw`justify-center items-center`}>
                                        {
                                            region === 'MX'
                                            ?
                                                <Image
                                                    style={tw`w-6 h-6 border border-[#dadada] rounded-full m-[1%]`}
                                                    resizeMode={'cover'}
                                                    source={require('../../../assets/language_mx.png')}
                                                />
                                            :
                                                <Image
                                                    style={tw`w-6 h-6 border border-[#dadada] rounded-full m-[1%]`}
                                                    resizeMode={'cover'}
                                                    source={require('../../../assets/language_us.png')}
                                                />    
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
        );
    }

    return (
        orientationInfo.initial === 'PORTRAIT'
        ?
            !isTablet()
            ?
                hasConnection
                ?
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
                        <HeaderPortrait title={langua === '1' ? 'Vacantes' : 'Jobs Opening'} screenToGoBack={'Choose'} navigation={navigation} visible={visible} normal={true}/>
                        <View style={tw`flex-1 self-stretch justify-start items-center bg-[#fff]`}>
                            {
                                loading
                                ?
                                    result !== 0
                                    &&
                                        <InputFilter handleInputChange={(e) => handleFilterChange(e)} handleFilterChange={() => handleChangeIcon()} value={filter} currentFilter={currentFilter.position} marginTop={true} marginHorizontal={true} marginBottom={false} capitalize={false} handleClean={() => setRandom(Math.random().toString())}/>
                                : 
                                    <></>
                            }
                            {
                                loading
                                ?
                                    result !== 0
                                    ?
                                        <>
                                            <View style={tw`h-10 self-stretch flex-row my-1 items-center justify-center`}>
                                                <RadioButton 
                                                    legend={langua === '1' ? 'Todas' : 'All'}
                                                    checked={filterUno}
                                                    width={0}
                                                    handleCheck={() => {
                                                        setFilterUno(true)
                                                        setFilterDos(false)
                                                        setFilterTres(false)
                                                        Keyboard.dismiss()
                                                    }}/>
                                                <RadioButton 
                                                    legend={langua === '1' ? 'México' : 'México'}
                                                    checked={filterDos}
                                                    width={0}
                                                    handleCheck={() => {
                                                        setFilterUno(false)
                                                        setFilterDos(true)
                                                        setFilterTres(false)
                                                        Keyboard.dismiss()
                                                    }}/>
                                                <RadioButton 
                                                    legend={langua === '1' ? 'Estados Unidos' : 'United States'}
                                                    checked={filterTres}
                                                    width={1}
                                                    handleCheck={() => {
                                                        setFilterUno(false)
                                                        setFilterDos(false)
                                                        setFilterTres(true)
                                                        Keyboard.dismiss()
                                                    }}/>
                                            </View>
                                            <ScrollView 
                                                showsVerticalScrollIndicator={false}
                                                showsHorizontalScrollIndicator={false}
                                                style={tw`self-stretch`}>
                                                <View style={tw`flex-1 self-stretch mx-[2%]`}>
                                                    {
                                                        filteredDataMX.length >= 1 && filterDos
                                                        &&
                                                            <>
                                                                <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center mx-[2%]`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'México' : 'México'}</Text>
                                                                </View>
                                                                <FlatList
                                                                    style={tw`h-auto self-stretch`}
                                                                    data={filteredDataMX}
                                                                    numColumns={1}
                                                                    renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante} id_sede={item.id_sede}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                />
                                                            </>
                                                    }

                                                    {
                                                        filteredDataUSA.length >= 1 && filterTres
                                                        &&
                                                            <>
                                                                <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center mx-[2%]`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'Estados Unidos' : 'United States'}</Text>
                                                                </View>
                                                                <FlatList
                                                                    style={tw`h-auto self-stretch`}
                                                                    data={filteredDataUSA}
                                                                    numColumns={1}
                                                                    renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante} id_sede={item.id_sede}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                />
                                                            </>
                                                    }       
                                                    {
                                                        filterUno && filteredDataMX.length >= 1
                                                        &&
                                                            <>
                                                                <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center mx-[2%]`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'México' : 'México'}</Text>
                                                                </View>
                                                                <FlatList
                                                                    style={tw`h-auto self-stretch`}
                                                                    data={filteredDataMX}
                                                                    numColumns={1}
                                                                    renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante} id_sede={item.id_sede}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                />
                                                            </>
                                                    }
                                                    {
                                                        filterUno && filteredDataUSA.length >= 1
                                                        &&
                                                            <>
                                                                <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center mx-[2%]`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'Estados Unidos' : 'United States'}</Text>
                                                                </View>
                                                                <FlatList
                                                                    style={tw`h-auto self-stretch`}
                                                                    data={filteredDataUSA}
                                                                    numColumns={1}
                                                                    renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante} id_sede={item.id_sede}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                />
                                                            </>
                                                    }
                                                    {
                                                        (filterUno || filterDos) && filteredDataMX.length === 0
                                                        &&
                                                            <View style={tw`flex-1 justify-center items-center self-stretch mt-[30%]`}>
                                                                <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                                                <Text style={tw`text-base text-[#adadad] mt-2.5 text-center`}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                                                <View style={tw`w-37.5 h-37.5 mt-2.5 justify-center items-center px-[4%]`}>
                                                                    <Image
                                                                        style={tw`flex-1`}
                                                                        resizeMode={'contain'}
                                                                        source={require('../../../assets/not-found.png')}
                                                                    />
                                                                </View>
                                                            </View>
                                                    }
                                                    {
                                                        (filterTres) && filteredDataUSA.length === 0
                                                        &&
                                                            <View style={tw`flex-1 justify-center items-center self-stretch mt-[30%]`}>
                                                                <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                                                <Text style={tw`text-base text-[#adadad] mt-2.5 text-center`}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                                                <View style={tw`w-37.5 h-37.5 mt-2.5 justify-center items-center px-[4%]`}>
                                                                    <Image
                                                                        style={tw`flex-1`}
                                                                        resizeMode={'contain'}
                                                                        source={require('../../../assets/not-found.png')}
                                                                    />
                                                                </View>
                                                            </View>
                                                    }
                                                </View>
                                            </ScrollView>
                                        </>
                                    :
                                        <>
                                            <View style={tw`flex-1 justify-center items-center self-stretch`}>
                                                <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                                <Text style={{fontSize: 16, color: '#adadad', marginTop: 10, textAlign: 'center'}}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                                <View style={tw`w-37.5 h-37.5 mt-2.5 justify-center items-center px-[4%]`}>
                                                    <Image
                                                        style={tw`flex-1`}
                                                        resizeMode={'contain'}
                                                        source={require('../../../assets/not-found.png')}
                                                    />
                                                </View>
                                            </View>
                                        </>
                                :
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <BallIndicator color={'#EC5C25'} size={35} />
                                        </View>
                            }
                        </View>
                    </>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
                        <HeaderPortrait title={langua === '1' ? 'Vacantes' : 'Jobs Opening'} screenToGoBack={'Choose'} navigation={navigation} visible={!visible} normal={true}/>
                        <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                    </>
            :
                hasConnection
                ?
                    <>
                        <HeaderPortrait title={langua === '1' ? 'Vacantes' : 'Jobs Opening'} screenToGoBack={'Choose'} navigation={navigation} visible={visible} normal={true}/>
                        <View style={tw`flex-1 self-stretch justify-start items-center bg-white`}>
                            <>
                                {
                                    loading
                                    ?
                                        result !== 0
                                        &&
                                            <InputFilter handleInputChange={(e) => handleFilterChange(e)} handleFilterChange={() => handleChangeIcon()} value={filter} currentFilter={currentFilter.position} marginTop={true} marginHorizontal={true} marginBottom={true} capitalize={false} handleClean={() => setRandom(Math.random().toString())}/>
                                    :
                                        <></>
                                }
                            </>
                            {
                                loading
                                ?
                                    result !== 0
                                    ?
                                        <>
                                            <View style={tw`h-10 self-stretch flex-row my-1 items-center justify-center`}>
                                                <RadioButton 
                                                    legend={langua === '1' ? 'Todas' : 'All'}
                                                    checked={filterUno}
                                                    width={0}
                                                    handleCheck={() => {
                                                        setFilterUno(true)
                                                        setFilterDos(false)
                                                        setFilterTres(false)
                                                        Keyboard.dismiss()
                                                    }}/>
                                                <RadioButton 
                                                    legend={langua === '1' ? 'México' : 'México'}
                                                    checked={filterDos}
                                                    width={0}
                                                    handleCheck={() => {
                                                        setFilterUno(false)
                                                        setFilterDos(true)
                                                        setFilterTres(false)
                                                        Keyboard.dismiss()
                                                    }}/>
                                                <RadioButton 
                                                    legend={langua === '1' ? 'Estados Unidos' : 'United States'}
                                                    checked={filterTres}
                                                    width={1}
                                                    handleCheck={() => {
                                                        setFilterUno(false)
                                                        setFilterDos(false)
                                                        setFilterTres(true)
                                                        Keyboard.dismiss()
                                                    }}/>
                                            </View>
                                            <ScrollView 
                                                style={{alignSelf: 'stretch'}}
                                                showsVerticalScrollIndicator={false}
                                                showsHorizontalScrollIndicator={false}>
                                                <View style={{flex: 1, alignSelf:'stretch', marginHorizontal: '2%'}}>
                                                    {
                                                        filteredDataMX.length >= 1 && filterDos
                                                        &&
                                                            <>
                                                                <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-start items-center mx-[2%]`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'México' : 'México'}</Text>
                                                                </View>
                                                                <FlatList
                                                                    style={tw`h-auto self-stretch`}
                                                                    data={filteredDataMX}
                                                                    numColumns={1}
                                                                    renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={language} id_sede={item.id_sede}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                />
                                                            </>
                                                    }

                                                    {
                                                        filteredDataUSA.length >= 1 && filterTres
                                                        &&
                                                            <>
                                                                <View style={tw`h-auto mt-1 mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center mx-[2%]`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'Estados Unidos' : 'United States'}</Text>
                                                                </View>
                                                                <FlatList
                                                                    style={tw`h-auto self-stretch`}
                                                                    data={filteredDataUSA}
                                                                    numColumns={1}
                                                                    renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={language} id_sede={item.id_sede}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                />
                                                            </>
                                                    }       
                                                    {
                                                        filterUno && filteredDataMX.length >= 1
                                                        &&
                                                            <>
                                                                <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center mx-[2%]`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'México' : 'México'}</Text>
                                                                </View>
                                                                <FlatList
                                                                    style={tw`h-auto self-stretch`}
                                                                    data={filteredDataMX}
                                                                    numColumns={1}
                                                                    renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={language} id_sede={item.id_sede}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                />
                                                            </>
                                                    }
                                                    {
                                                        filterUno && filteredDataUSA.length >= 1
                                                        &&
                                                            <>
                                                                <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center mx-[2%]`}>
                                                                    <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'Estados Unidos' : 'United States'}</Text>
                                                                </View>
                                                                <FlatList
                                                                    style={tw`h-auto self-stretch`}
                                                                    data={filteredDataUSA}
                                                                    numColumns={1}
                                                                    renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={language} id_sede={item.id_sede}/>}
                                                                    keyExtractor={item => String(item.id)}
                                                                />
                                                            </>
                                                    }
                                                    {
                                                        (filterUno || filterDos) && filteredDataMX.length === 0
                                                        &&
                                                            <View style={tw`flex-1 justify-center items-center self-stretch mt-[30%]`}>
                                                                <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                                                <Text style={tw`text-base text-[#adadad] mt-2.5 text-center`}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                                                <View style={tw`w-37.5 h-37.5 mt-12.5 justify-center items-center px-[4%]`}>
                                                                    <Image
                                                                        style={tw`flex-1`}
                                                                        resizeMode={'contain'}
                                                                        source={require('../../../assets/not-found.png')}
                                                                    />
                                                                </View>
                                                            </View>
                                                    }
                                                    {
                                                        (filterTres) && filteredDataUSA.length === 0
                                                        &&
                                                            <View style={tw`flex-1 justify-center items-center self-stretch mt-[30%]`}>
                                                                <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                                                <Text style={tw`text-base text-[#adadad] mt-2.5 text-center`}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                                                <View style={tw`w-37.5 h-37.5 mt-12.5 justify-center items-center px-[4%]`}>
                                                                    <Image
                                                                        style={tw`flex-1`}
                                                                        resizeMode={'contain'}
                                                                        source={require('../../../assets/not-found.png')}
                                                                    />
                                                                </View>
                                                            </View>
                                                    }
                                                </View>
                                            </ScrollView>
                                        </>
                                    :
                                        <View style={tw`flex-1 justify-center items-center self-stretch mt-[30%]`}>
                                            <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                            <Text style={tw`text-base text-[#adadad] mt-2.5 text-center`}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                            <View style={tw`w-37.5 h-37.5 mt-12.5 justify-center items-center px-[4%]`}>
                                                <Image
                                                    style={tw`flex-1`}
                                                    resizeMode={'contain'}
                                                    source={require('../../../assets/not-found.png')}
                                                />
                                            </View>
                                        </View>
                                :
                                    <View style={tw`flex-1 justify-center items-center`}>
                                        <BallIndicator color={'#EC5C25'} size={35} />
                                    </View>
                            }
                        </View>
                    </>
                :
                    <>
                        <HeaderPortrait title={langua === '1' ? 'Vacantes' : 'Jobs Opening'} screenToGoBack={'Choose'} navigation={navigation} visible={!visible} normal={true}/>
                        <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                    </>
        :
            hasConnection
            ?
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <HeaderLandscape title={langua === '1' ? 'Vacantes' : 'Jobs Opening'} screenToGoBack={'Choose'} navigation={navigation} visible={visible} normal={true}/>
                    <View style={tw`flex-1 self-stretch justify-start items-center mb-[2%] mx-[${isIphone ? '5%' : '3%'}]`}>
                        <>
                            {
                                loading
                                ?
                                    result !== 0
                                    &&
                                        <InputFilter handleInputChange={(e) => handleFilterChange(e)} handleFilterChange={() => handleChangeIcon()} value={filter} currentFilter={currentFilter.position} marginTop={true} marginHorizontal={true} marginBottom={false} capitalize={false} handleClean={() => setRandom(Math.random().toString())}/>
                                :
                                    <></>
                            }
                        </>
                        {
                            loading
                            ?
                                result !== 0
                                ?
                                    <>
                                        <View style={tw`h-10 self-stretch flex-row my-1 items-center justify-center`}>
                                            <RadioButton 
                                                legend={langua === '1' ? 'Todas' : 'All'}
                                                checked={filterUno}
                                                width={0}
                                                handleCheck={() => {
                                                    setFilterUno(true)
                                                    setFilterDos(false)
                                                    setFilterTres(false)
                                                    Keyboard.dismiss()
                                                }}/>
                                            <RadioButton 
                                                legend={langua === '1' ? 'México' : 'México'}
                                                checked={filterDos}
                                                width={0}
                                                handleCheck={() => {
                                                    setFilterUno(false)
                                                    setFilterDos(true)
                                                    setFilterTres(false)
                                                    Keyboard.dismiss()
                                                }}/>
                                            <RadioButton 
                                                legend={langua === '1' ? 'Estados Unidos' : 'United States'}
                                                checked={filterTres}
                                                width={1}
                                                handleCheck={() => {
                                                    setFilterUno(false)
                                                    setFilterDos(false)
                                                    setFilterTres(true)
                                                    Keyboard.dismiss()
                                                }}/>
                                        </View>
                                        <ScrollView 
                                            style={{alignSelf: 'stretch'}}
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}>
                                            <View style={tw`flex-1 self-stretch mx-[2%]`}>
                                                {
                                                    filteredDataMX.length >= 1 && filterDos
                                                    &&
                                                        <>
                                                            <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center`}>
                                                                <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'México' : 'México'}</Text>
                                                            </View>
                                                            <FlatList
                                                                style={tw`h-auto self-stretch`}
                                                                data={filteredDataMX}
                                                                numColumns={1}
                                                                renderItem={({item}) => <Vacant nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante}/>}
                                                                keyExtractor={item => String(item.id)}
                                                            />
                                                        </>
                                                }

                                                {
                                                    filteredDataUSA.length >= 1 && filterTres
                                                    &&
                                                        <>
                                                            <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center`}>
                                                                <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'Estados Unidos' : 'United States'}</Text>
                                                            </View>
                                                            <FlatList
                                                                style={tw`h-auto self-stretch`}
                                                                data={filteredDataUSA}
                                                                numColumns={2}
                                                                renderItem={({item}) => <Vacant nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante}/>}
                                                                keyExtractor={item => String(item.id)}
                                                            />
                                                        </>
                                                }       
                                                {
                                                    filterUno && filteredDataMX.length >= 1
                                                    &&
                                                        <>
                                                            <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center`}>
                                                                <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'México' : 'México'}</Text>
                                                            </View>
                                                            <FlatList
                                                                style={tw`h-auto self-stretch`}
                                                                data={filteredDataMX}
                                                                numColumns={1}
                                                                renderItem={({item}) => <Vacant nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante}/>}
                                                                keyExtractor={item => String(item.id)}
                                                            />
                                                        </>
                                                }
                                                {
                                                    filterUno && filteredDataUSA.length >= 1
                                                    &&
                                                        <>
                                                            <View style={tw`h-auto mx-[${orientationInfo.initial === 'PORTRAIT' ? isTablet() ? '0.5%' : 0 : '.3%'}] bg-[#f7f7f7] border border-[#dadada] p-1 flex-row justify-center items-center`}>
                                                                <Text style={tw`text-[#000] text-sm font-bold`}>{langua === '1' ? 'Estados Unidos' : 'United States'}</Text>
                                                            </View>
                                                            <FlatList
                                                                style={tw`h-auto self-stretch`}
                                                                data={filteredDataUSA}
                                                                numColumns={1}
                                                                renderItem={({item}) => <Vacant nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante}/>}
                                                                keyExtractor={item => String(item.id)}
                                                            />
                                                        </>
                                                }
                                                {
                                                        (filterUno || filterDos) && filteredDataMX.length === 0
                                                        &&
                                                            <View style={tw`flex-1 justify-center items-center self-stretch mt-${isTablet() ? 6 : 2.5}`}>
                                                                <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                                                <Text style={tw`text-base text-[#adadad] mt-2.5 text-center`}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                                                <View style={tw`w-37.5 h-37.5 mt-2.5 justify-center items-center px-[4%]`}>
                                                                    <Image
                                                                        style={tw`flex-1`}
                                                                        resizeMode={'contain'}
                                                                        source={require('../../../assets/not-found.png')}
                                                                    />
                                                                </View>
                                                            </View>
                                                    }
                                                    {
                                                        (filterTres) && filteredDataUSA.length === 0
                                                        &&
                                                            <View style={tw`flex-1 justify-center items-center self-stretch mt-${isTablet() ? 6 : 2.5}`}>
                                                                <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                                                <Text style={tw`text-base text-[#adadad] mt-2.5 text-center`}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                                                <View style={tw`w-37.5 h-37.5 mt-2.5 justify-center items-center px-[4%]`}>
                                                                    <Image
                                                                        style={tw`flex-1`}
                                                                        resizeMode={'contain'}
                                                                        source={require('../../../assets/not-found.png')}
                                                                    />
                                                                </View>
                                                            </View>
                                                    }
                                            </View>
                                        </ScrollView>
                                    </>
                                :
                                    <View style={tw`flex-1 justify-center items-center self-stretch mt-${isTablet() ? 6 : 2.5}`}>
                                        <Text style={tw`text-black font-bold text-2xl`}>{langua === '1' ? 'Sin resultados' : 'No results'}</Text>
                                        <Text style={tw`text-base text-[#adadad] mt-2.5 text-center`}>{langua === '1' ? 'Por el momento no hay vacantes disponibles' : 'There are no vacancies available at this time'}</Text>
                                        <View style={tw`w-37.5 h-37.5 mt-2.5 justify-center items-center px-[4%]`}>
                                            <Image
                                                style={tw`flex-1`}
                                                resizeMode={'contain'}
                                                source={require('../../../assets/not-found.png')}
                                            />
                                        </View>
                                    </View>
                            :
                                <View style={tw`flex-1 justify-center items-center`}>
                                    <BallIndicator color={'#EC5C25'} size={35} />
                                </View>
                        }
                    </View>
                </View>
            :
                <>
                    <HeaderLandscape title={langua === '1' ? 'Vacantes' : 'Jobs Opening'} screenToGoBack={'Choose'} navigation={navigation} visible={!visible} normal={true}/>
                    <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                </>
                
    );
}