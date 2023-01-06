import React, {useState, useEffect, useCallback} from 'react';
import {TouchableOpacity, View, Text, FlatList, Image, Keyboard, StatusBar, SafeAreaView, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {HeaderPortrait, HeaderLandscape, FailedNetwork, InputFilter, RadioButton, NotResults} from '../../components';
import DeviceInfo from 'react-native-device-info';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useOrientation, useConnection, useNavigation} from '../../hooks';
import {isIphone, live, login, urlJobs} from '../../access/requestedData';
import {BallIndicator} from 'react-native-indicators';
import {barStyle, barStyleBackground, SafeAreaBackground} from '../../colors/colorsApp';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectLanguageApp} from '../../slices/varSlice';
import {selectOrientation} from '../../slices/orientationSlice';
import tw from 'twrnc';

let temporales = null;

export default ({navigation, route: {params: {valueNotificationToken}}}) => {
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)

    const [random, setRandom] = useState(1)
    const [section, setSection] = useState(1)
    const [filterUno, setFilterUno] = useState(true)
    const [filterDos, setFilterDos] = useState(false)
    const [filterTres, setFilterTres] = useState(false)

    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();

    const headers = [{nombre: language === '1' ? 'México' : 'Mexico', tipo: 'header', region: 'MX'}, {nombre: language === '1' ? 'Estados Unidos' : 'United States', tipo: 'header', region: 'US'}]

    useFocusEffect(
        useCallback(() => {
            handlePath('Choose')
        }, [])
    );
    
    const {isTablet} = DeviceInfo;
    const [filter, setFilter] = useState('');
    const [currentFilter, setCurrentFilter] = useState({
        position: language === '1' ? 'Puesto...' : 'Position...',
        iconName: 'badge-account-outline'
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(0)
    const [visible, setVisible] = useState(false)

    const [masterDataMX, setMasterDataMX] = useState([]);
    const [masterDataUSA, setMasterDataUSA] = useState([]);

    const [filteredDataMX, setFilteredDataMX] = useState([]);
    const [filteredDataUSA, setFilteredDataUSA] = useState([]);

    const [data, setData] = useState([])
    const [masterData, setMasterData] = useState([])

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
                temporales = response.sort((a, b) => b.prioridad.localeCompare(a.prioridad));
                temporales = temporales.map(x => ({...x, hide: false}))
                
                const justMX = temporales.filter(x => x.region === 'MX' && x)
                const justUSA = temporales.filter(x => x.region === 'US' && x)

                let nuevos = ''
                if(justMX.length > 0) nuevos = [headers[0], ...justMX]
                if(justUSA.length > 0) nuevos = [headers[1], ...justUSA, ...nuevos]
                setData(nuevos)
                setMasterData(nuevos)
    
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

    useEffect(() => {
        if(data){
            setFilter('')
            setData(masterData)
            Keyboard.dismiss()
        }
    }, [random])

    useEffect(() => {
        if(section === 1){
            setData(masterData)
        } else if(section === 2){
            const nuevos = masterData.filter(x => x.region === 'MX')
            setData(nuevos)
        } else {
            const nuevos = masterData.filter(x => x.region === 'US')
            setData(nuevos)
        }
    }, [section])

    const handleFilterChange = (text) => {
        if(currentFilter.iconName === 'badge-account-outline'){
            if(text){
                const bef = masterData.filter(x => x.tipo !== 'header')
                const temporal = bef.filter(item => {
                    const itemData = item.nombre ? item.nombre.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                const justMX = temporal.filter(x => x.region === 'MX' && x)
                const justUSA = temporal.filter(x => x.region === 'US' && x)

                let nuevos = ''
                if(justMX.length > 0) nuevos = [headers[0], ...justMX]
                if(justUSA.length > 0) nuevos = [headers[1], ...justUSA, ...nuevos]
                
                setData(nuevos)
                setFilter(text)
            }
            else {
                setData(masterData)
                setFilter(text)
            }
        }

        else if(currentFilter.iconName === 'map-marker'){
            if(text){
                const bef = masterData.filter(x => x.tipo !== 'header')
                const temporal = bef.filter(item => {
                    const itemData = item.edificio ? item.edificio.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                const justMX = temporal.filter(x => x.region === 'MX' && x)
                const justUSA = temporal.filter(x => x.region === 'US' && x)

                let nuevos = ''
                if(justMX.length > 0) nuevos = [headers[0], ...justMX]
                if(justUSA.length > 0) nuevos = [headers[1], ...justUSA, ...nuevos]
                
                setData(nuevos)
                setFilter(text)
            }
            else {
                setData(masterData)
                setFilter(text)
            }
        }
        else {
            if(text){
                const bef = masterData.filter(x => x.tipo !== 'header')
                const temporal = bef.filter(item => {
                    const itemData = item.sueldo ? item.sueldo.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
                });

                const justMX = temporal.filter(x => x.region === 'MX' && x)
                const justUSA = temporal.filter(x => x.region === 'US' && x)

                let nuevos = ''
                if(justMX.length > 0) nuevos = [headers[0], ...justMX]
                if(justUSA.length > 0) nuevos = [headers[1], ...justUSA, ...nuevos]
                
                setData(nuevos)
                setFilter(text)
            }
            else {
                setData(masterData)
                setFilter(text)
            }
        }
    }
    
    const handleChangeIcon = () => {
        if(currentFilter.iconName === 'badge-account-outline') {
            setCurrentFilter({
                position: language === '1' ? 'Edificio...' : 'Edifice...',
                iconName: 'map-marker'
            })
            setFilter('')
            handleFilterChange('')
            Keyboard.dismiss()
        }
        else if(currentFilter.iconName === 'map-marker'){
            setCurrentFilter({
                position: language === '1' ? 'Salario...' : 'Salary...',
                iconName: 'cash'
            })
            setFilter('')
            handleFilterChange('')
            Keyboard.dismiss()
        }
        else {
            setCurrentFilter({
                position: language === '1' ? 'Puesto...' : 'Position...',
                iconName: 'badge-account-outline'
            })
            setFilter('')
            handleFilterChange('')
            Keyboard.dismiss()
        }
    }

    const handleHide = (region) => {
        const nuevos = data.map(x => x.region === region ? ({...x, hide: !x.hide}) : x)
        setData(nuevos)
    }

    const Vacant = ({id, nombre, sueldo, ubicacion, region, descripcion, requisitos, beneficios, telefono, id_sede, tipo = 'normal', hide}) => {
        return (
            tipo === 'normal'
            ?
                !hide
                ?
                    <View style={{flex: 1, marginVertical: orientation === 'PORTRAIT' ? '2%': '0%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: '2%'}}>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('VacantDetail', {language: language, orientation: orientation, id: id, nombre: nombre, ubicacion: ubicacion, descripcion: descripcion, beneficios: beneficios, requisitos: requisitos, sueldo: sueldo, telefono: telefono, country: region, id_sede: id_sede})} >
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
                                        <View style={tw`w-5 justify-center items-center mb-${orientation === 'PORTRAIT' ? 0 : 8}`}>
                                            <IonIcons name={'clock-outline'} size={20} color='black'/>
                                        </View>
                                        <View style={tw`flex-1 self-stretch justify-center items-start ml-1.5`}>
                                            <Text style={tw`text-[#c1c1c1] text-sm`}>{language === '1' ? 'Se uno de los primeros en postularse' : 'Be one of the first to apply'}</Text>
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
                    <View style={tw`h-2`}/>
            :
                <TouchableOpacity style={[{height: 34, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', paddingHorizontal: '2%', marginHorizontal: '2%', backgroundColor: '#f7f7f7', flexDirection: 'row', paddingTop: 0.5}, tw`shadow`]} 
                    onPress={() => handleHide(region)}>
                    <View style={tw`flex-1 justify-center items-start h-[100%]`}>
                        <Text style={tw`font-bold text-[#000]`}>{nombre}</Text>
                    </View>
                    <View style={tw`h-[100%] w-5 justify-center items-center`}>
                        <IonIcons name={hide ? 'chevron-down' : 'chevron-up'} size={20} color='black'/>
                    </View>
                </TouchableOpacity>
        );
    }

    return (
        hasConnection
        ?
            <>
                <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
                <HeaderPortrait title={language === '1' ? 'Vacantes' : 'Jobs Opening'} screenToGoBack={'Choose'} navigation={navigation} visible={visible} normal={true}/>
                <View style={tw`flex-1 self-stretch justify-start items-center bg-[#fff]`}>
                    {
                        loading
                        ?
                            result !== 0
                            ?
                                <>
                                    <InputFilter handleInputChange={(e) => handleFilterChange(e)} handleFilterChange={() => handleChangeIcon()} value={filter} currentFilter={currentFilter.position} marginTop={true} marginHorizontal={true} marginBottom={false} capitalize={false} handleClean={() => setRandom(Math.random().toString())}/>
                                    <View style={tw`h-10 self-stretch flex-row my-1 items-center justify-center`}>
                                        <RadioButton 
                                            legend={language === '1' ? 'Todas' : 'All'}
                                            checked={section === 1 ? true : false}
                                            width={0}
                                            handleCheck={() => {
                                                setSection(1)
                                                Keyboard.dismiss()
                                            }}/>
                                        <RadioButton 
                                            legend={language === '1' ? 'México' : 'México'}
                                            checked={section === 2 ? true : false}
                                            width={0}
                                            handleCheck={() => {
                                                setSection(2)
                                                Keyboard.dismiss()
                                            }}/>
                                        <RadioButton 
                                            legend={language === '1' ? 'Estados Unidos' : 'United States'}
                                            checked={section === 3 ? true : false}
                                            width={1}
                                            handleCheck={() => {
                                                setSection(3)
                                                Keyboard.dismiss()
                                            }}/>
                                    </View>
                                    <ScrollView 
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        style={tw`self-stretch`}>
                                        <View style={tw`flex-1 self-stretch mx-[2%]`}>
                                            <FlatList
                                                style={tw`h-auto self-stretch`}
                                                data={data}
                                                numColumns={1}
                                                renderItem={({item}) => <Vacant id={item.id} nombre={item.nombre} sueldo={item.sueldo} ubicacion={item.ubicacion} region={item.region} descripcion={item.descripcion} beneficios={item.beneficios} requisitos={item.requisitos} telefono={item.telefono} language={item.tipo_vacante} id_sede={item.id_sede} tipo={item.tipo} hide={item.hide}/>}
                                                keyExtractor={item => String(item.id)}
                                            />
                                        </View>
                                    </ScrollView>
                                </>
                            :
                                <NotResults />
                        :
                                <View style={tw`flex-1 justify-center items-center`}>
                                    <BallIndicator color={'#EC5C25'} size={35} />
                                </View>
                    }
                </View>
            </>
        :
            <>
                <HeaderPortrait title={language === '1' ? 'Vacantes' : 'Jobs Opening'} screenToGoBack={'Choose'} navigation={navigation} visible={!visible} normal={true}/>
                <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientation}/>
            </>
    );
}