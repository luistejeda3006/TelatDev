import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Alert, Text, TouchableOpacity, BackHandler, FlatList} from 'react-native';
import {InputForm, Picker, Calendar, TitleForms} from '../../../../components';
import {ProgressStep} from 'react-native-progress-steps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';
import {useOrientation} from '../../../../hooks';
import {useFormikContext} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Blue } from '../../../../colors/colorsApp';

let inicial = null;
let terminal = null;
let inicialOpcional = null;
let terminalOpcional = null;
let languagesCompleted = 0;

export default ({navigation, language, orientation, ...rest}) => {
    const {isTablet} = DeviceInfo;
    const {submitForm, values} = useFormikContext();

    const input_nombre_empresa = useRef()
    const input_giro = useRef()
    const input_puesto = useRef()
    const input_nombre_empresa_opcional = useRef()
    const input_giro_opcional = useRef()
    const input_puesto_opcional = useRef()

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });
    
    const first = {label: 'Select', value: 'SEL'};

    const closeOptions = [
        first,
        {label: 'NO', value: '0'},
        {label: 'YES', value: '1'},
    ]

    const englishOptionsData = [
        first,
        {label: 'Basic', value: 'Basic'},
        {label: 'Intermediate', value: 'Intermediate'},
        {label: 'Advanced', value: 'Advanced'},
    ]

    const [languages, setLanguages] = useState([
        {
            id: 1,
            boxName: 'languageUno_3_US',
            button: false,
            visible: true,
        },
        {
            id: 2,
            boxName: 'languageDos_3_US',
            button: false,
            visible: false,
        },
        {
            id: 3,
            boxName: 'languageTres_3_US',
            button: false,
            visible: false,
        },
        {
            id: 4,
            boxName: 'languageCuatro_3_US',
            button: false,
            visible: false,
        },
        {
            id: 5,
            boxName: 'languageCinco_3_US',
            button: false,
            visible: false,
        },
    ])

    const [filters, setFilters] = useState({
        error: true,
        pEmpleo: false,
        contador: 1,
        currentlyStudy: false,

        show_ingreso: false,
        timestamp_ingreso: new Date(),
        initialDate_ingreso: 'Not selected',

        show_salida: false,
        timestamp_salida: new Date(),
        initialDate_salida: 'Not selected',

        show_ingreso_opcional: false,
        timestamp_ingreso_opcional: new Date(),
        initialDate_ingreso_opcional: 'Not selected',

        show_salida_opcional: false,
        timestamp_salida_opcional: new Date(),
        initialDate_salida_opcional: 'Not selected',

        contact: false,
        contactOptional: false,
        studyGrade: 0,
    });

    const {
        languageUno_3_US,
        languageDos_3_US,
        languageTres_3_US,
        languageCuatro_3_US,
        languageCinco_3_US,

        levelComputer_3_US,
        familiarPrograms_3_US,

        workExperience_3_US,
        nombreEmpresa_3_US,
        giroEmpresa_3_US,
        puestoDesempeñado_3_US,
        activities_3_US,

        nombreEmpresaOpcional_3_US,
        giroEmpresaOpcional_3_US,
        puestoDesempeñadoOpcional_3_US,
        activitiesOpcional_3_US,

    } = values;
    const {error, pEmpleo, show_ingreso, timestamp_ingreso, initialDate_ingreso, show_salida, timestamp_salida ,initialDate_salida, show_ingreso_opcional, timestamp_ingreso_opcional, initialDate_ingreso_opcional, show_salida_opcional, timestamp_salida_opcional, initialDate_salida_opcional, contador} = filters;

    const handleValues = async () => {
        let key = 'stepTwo'
        let keyIdiomas = 'stepTwoIdiomas'
        let idiomas = [
            {idioma: languageUno_3_US},
            {idioma: languageDos_3_US ? languageDos_3_US : ''},
            {idioma: languageTres_3_US ? languageTres_3_US : ''},
            {idioma: languageCuatro_3_US ? languageCuatro_3_US : ''},
            {idioma: languageCinco_3_US ? languageCinco_3_US : ''}
        ]

        const newLanguages = idiomas.filter(x => x.idioma !== '' || x.idioma && undefined && x)

        let obj_3 = {
            cand_primer_empleo: workExperience_3_US,
            curr_usa_computadora: levelComputer_3_US,
            curr_pkg_computo: familiarPrograms_3_US,
            refl_nombre_empresa1: nombreEmpresa_3_US,
            refl_giro_empresa1: giroEmpresa_3_US,
            refl_puesto1: puestoDesempeñado_3_US,
            refl_actividades1: activities_3_US,

            refl_fecha_inicio1: initialDate_ingreso === 'Not selected' ? null : initialDate_ingreso,
            refl_fecha_final1: initialDate_salida === 'Not selected' ? null : initialDate_salida,
            refl_nombre_empresa2: nombreEmpresaOpcional_3_US ? nombreEmpresaOpcional_3_US : '',
            refl_giro_empresa2: giroEmpresaOpcional_3_US ? giroEmpresaOpcional_3_US : '',
            refl_puesto2: puestoDesempeñadoOpcional_3_US ? puestoDesempeñadoOpcional_3_US : '',
            refl_actividades2: activitiesOpcional_3_US,

            refl_fecha_inicio2: initialDate_ingreso_opcional === 'Not selected' ? null : initialDate_ingreso_opcional,
            refl_fecha_final2: initialDate_salida_opcional === 'Not selected' ? null : initialDate_salida_opcional,
        }
        
        if(pEmpleo){
            if(levelComputer_3_US === undefined || levelComputer_3_US === 'SEL' || familiarPrograms_3_US === undefined || familiarPrograms_3_US === '' || nombreEmpresa_3_US === undefined || nombreEmpresa_3_US === '' || giroEmpresa_3_US === undefined || giroEmpresa_3_US === '' || puestoDesempeñado_3_US === undefined || puestoDesempeñado_3_US === '' || initialDate_ingreso === 'Not selected' || initialDate_salida === 'Not selected' || activities_3_US === undefined || activities_3_US === ''){
                Alerta()
            }
            else {

                let data = await AsyncStorage.getItem(key) || '';
                if(data) {
                    await AsyncStorage.removeItem(key).then( () => AsyncStorage.setItem(key, JSON.stringify(obj_3)));
                    await AsyncStorage.removeItem(keyIdiomas).then( () => AsyncStorage.setItem(keyIdiomas, JSON.stringify(newLanguages)));
                }
                else {
                    await AsyncStorage.setItem(key, JSON.stringify(obj_3));
                    await AsyncStorage.setItem(keyIdiomas, JSON.stringify(newLanguages));
                }
                setFilters({...filters, error: false});
            }
            
        }
        else {
            if(levelComputer_3_US === undefined || levelComputer_3_US === 'SEL' || familiarPrograms_3_US === undefined || familiarPrograms_3_US === '' || workExperience_3_US === undefined || workExperience_3_US === 'SEL'){
                Alerta()
            }
            else {
                let data = await AsyncStorage.getItem(key) || '';
                if(data) {
                    await AsyncStorage.removeItem(key).then( () => AsyncStorage.setItem(key, JSON.stringify(obj_3)));
                    await AsyncStorage.removeItem(keyIdiomas).then( () => AsyncStorage.setItem(keyIdiomas, JSON.stringify(idiomas)));
                }
                else {
                    await AsyncStorage.setItem(key, JSON.stringify(obj_3));
                    await AsyncStorage.setItem(keyIdiomas, JSON.stringify(idiomas));
                }
                setFilters({...filters, error: false});
            }
        }
    }

    const Alerta = () => {
        return (
            Alert.alert(
                'Empty Fields',
                'Review and fill in the missing fields',
                [
                    { text: 'OK'}
                ]
            )
        )
    }


    const handleAction_uno = (index) => {
        if(index === 1) setFilters({...filters, pEmpleo: true})
        else setFilters({...filters, pEmpleo: false})
    }

    const handleDateOptional_3 = ({nativeEvent: {timestamp}}) => {
        if(timestamp !== undefined){
            let temporal = new Date(timestamp)
            let date = new Date(timestamp)
            let dia = date.toLocaleDateString().substring(3,5)
            let mes = date.toLocaleDateString().substring(0,2)
            let año = date.getFullYear()

            let diaIOS = parseInt(date.getDate())
            let mesIOS = parseInt(date.getMonth() + 1)

            diaIOS = diaIOS < 10 ? `0${diaIOS}` : diaIOS
            mesIOS = mesIOS < 10 ? `0${mesIOS}` : mesIOS
            
            let isIOS = DeviceInfo.getDeviceId().includes('iPhone')

            inicialOpcional = temporal;
            setFilters({...filters, show_ingreso_opcional: !show_ingreso_opcional, timestamp_ingreso_opcional: date, initialDate_ingreso_opcional: !isIOS ? año + '-' + mes + '-' + dia : año + '-' + mesIOS + '-' + diaIOS})
        }
        else {
            setFilters({...filters, show_ingreso_opcional: !show_ingreso_opcional});
        }
    }

    const handleDate = ({nativeEvent: {timestamp}}, type) => {
        if(timestamp !== undefined){
            let temporal = new Date(timestamp)
            let date = new Date(timestamp)
            let dia = date.toLocaleDateString().substring(3,5)
            let mes = date.toLocaleDateString().substring(0,2)
            let año = date.getFullYear()

            let diaIOS = parseInt(date.getDate())
            let mesIOS = parseInt(date.getMonth() + 1)

            diaIOS = diaIOS < 10 ? `0${diaIOS}` : diaIOS
            mesIOS = mesIOS < 10 ? `0${mesIOS}` : mesIOS
            
            let isIOS = DeviceInfo.getDeviceId().includes('iPhone')

            switch (type) {
                case 'ingreso':
                    inicial = temporal;
                    setFilters({...filters, show_ingreso: !show_ingreso, timestamp_ingreso: date, initialDate_ingreso: !isIOS ? año + '-' + mes + '-' + dia : año + '-' + mesIOS + '-' + diaIOS})
                    break;
                case 'salida':
                    terminal = temporal;
                    setFilters({...filters, show_salida: !show_salida, timestamp_salida: date, initialDate_salida: !isIOS ? año + '-' + mes + '-' + dia : año + '-' + mesIOS + '-' + diaIOS})
                    break;
                case 'salida_opcional':
                    terminalOpcional = temporal;
                    setFilters({...filters, show_salida_opcional: !show_salida_opcional, timestamp_salida_opcional: date, initialDate_salida_opcional: !isIOS ? año + '-' + mes + '-' + dia : año + '-' + mesIOS + '-' + diaIOS})
                    break;
                default:
                    break;
            }
        }
        else{
            switch (type) {
                case 'ingreso':
                    setFilters({...filters, show_ingreso: !show_ingreso});
                    break;
                case 'salida':
                    setFilters({...filters, show_salida: !show_salida});
                    break;
                case 'salida_opcional':
                    setFilters({...filters, show_salida_opcional: !show_salida_opcional});
                    break;
                default:
                    break;
            }
        }
    }

    useEffect(() => {
        const backAction = () => {
            Alert.alert(
                'Cancel Request',
                'Are you sure you want to cancel your request? \n\nThe data entered will be lost\n', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel'
                },
                { text: 'Yes, I am sure', onPress: () => navigation.navigate('Choose') }
            ]);
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
    
        return () => backHandler.remove();
    }, [language]);

    const handleAdd = (current) => {
        if(current <= 5){
            let temporales = languages.map(x => x.id === current ? ({...x, visible: true}) : x)
            setLanguages(temporales)
            setFilters({...filters, contador: contador + 1})
        } else {
            const nuevo = languages.find(x => !x.visible)
            if(nuevo){
                const withOut = languages.filter(x => x.id !== nuevo.id)
                let obj = [...withOut, ({...nuevo, visible: true})]
                setLanguages(obj)
            }
        }
    }
    
    const handleHide = (id) => {
        let temporales = languages.map(x => x.id === id ? ({...x, visible: false}) : x)
        setLanguages(temporales)
    }

    const Language = ({id, visible, boxName}) => {
        return(
            <View style={{flex: 1, height: 'auto', marginRight: 10}}>
                {
                    id === 1
                    ?
                        <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={id}>
                            <View style={{flex: 1, alignSelf: 'stretch'}}>
                                <InputForm
                                    radius={false}
                                    status={true}
                                    placeholder={'EXAMPLE. SPANISH'}
                                    fieldName={boxName}
                                />
                            </View>
                            <View style={{width: 50, height: 50, backgroundColor: 'rgba(50,131,197,.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Blue, borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                <IonIcons name={'lock'} size={22} color={id === 1 ? Blue : '#fff'} />
                            </View>
                        </View>
                    :
                        visible
                        &&
                            <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={id}>
                                <View style={{flex: 1, alignSelf: 'stretch'}}>
                                    <InputForm
                                        radius={false}
                                        status={true}
                                        placeholder={'EXAMPLE. SPANISH'}
                                        fieldName={boxName}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => handleHide(id)} style={{width: 50, height: 50, backgroundColor: 'rgba(220,54,68,.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#adadad', borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                    <IonIcons name={'close-thick'} size={22} color={'#DC3644'} />
                                </TouchableOpacity>
                            </View>
                }
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <ProgressStep
                errors={error}
                {...rest}
                nextBtnText={'Next'}
                previousBtnText=''
                nextBtnTextStyle={{color: '#fff', backgroundColor: '#1177E9', padding: 12, borderRadius: 15, fontWeight: 'bold'}}
                previousBtnTextStyle={{color: 'orange'}}
                nextBtnStyle={{ textAlign: 'center', padding: 0 }}
                previousBtnStyle={{ textAlign: 'center', padding: 0 }}
                previousBtnDisabled={true}
                nextBtnDisabled={false}
                onNext={() => handleValues()}
            >
                <View style={{alignSelf: 'stretch', paddingHorizontal: 18}}>
                    {
                        orientationInfo.initial === 'PORTRAIT'
                        ?
                            !isTablet()
                            ?
                                <>
                                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'title'} title={'Abilities'}/>
                                        </View>
                                    </View>

                                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <Text style={{color: Blue}}>What languages do you speak and write fluently</Text>
                                        </View>
                                        <TouchableOpacity style={{height: 28, width: 28, backgroundColor: 'transparent', borderRadius: 25, borderWidth: 1, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                                            <IonIcons name={'plus'} size={20} color={'transparent'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleAdd(contador + 1)} style={{height: 28, width: 28, backgroundColor: 'rgba(50,131,197,.1)', borderRadius: 25, borderWidth: 1, borderColor: Blue, justifyContent: 'center', alignItems: 'center'}}>
                                            <IonIcons name={'plus'} size={20} color={Blue} />
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        languages.map((x,i) =>
                                            x.id === 1
                                            ?
                                                <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                                                        <InputForm
                                                            radius={false}
                                                            status={true}
                                                            placeholder={'EXAMPLE. SPANISH'}
                                                            fieldName={x.boxName}
                                                        />
                                                    </View>
                                                    <View style={{width: 50, height: 50, backgroundColor: 'rgba(50,131,197,.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Blue, borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                                        <IonIcons name={'lock'} size={22} color={x.id === 1 ? Blue : '#fff'} />
                                                    </View>
                                                </View>
                                            :
                                                x.visible
                                                && 
                                                    <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                                                            <InputForm
                                                                radius={false}
                                                                status={true}
                                                                placeholder={'EXAMPLE. SPANISH'}
                                                                fieldName={x.boxName}
                                                            />
                                                        </View>
                                                        <TouchableOpacity onPress={() => handleHide(x.id)} style={{width: 50, height: 50, backgroundColor: '#DC3644', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#adadad', borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                                            <IonIcons name={'close-thick'} size={22} color={'#fff'} />
                                                        </TouchableOpacity>
                                                    </View>
                                        )
                                    }

                                    <TitleForms type={'subtitle'} title={'What is your level of knowledge using computers?'} />
                                    <Picker 
                                        fieldName={'levelComputer_3_US'}
                                        items={englishOptionsData}
                                    />
                                    <TitleForms type={'subtitle'} title={'What programs are you familiar with?'} />
                                    <InputForm
                                        status={true}
                                        placeholder={'Example. Word, Excel...'}
                                        fieldName={'familiarPrograms_3_US'}
                                    />

                                    <TitleForms type={'title'} title={'Work Experience'}/>

                                    <TitleForms type={'subtitle'} title={'Would this be your first job?'} />
                                    <Picker 
                                        fieldName={'workExperience_3_US'}
                                        items={closeOptions}
                                        contador={1}
                                        handleAction_uno={handleAction_uno}
                                    />
                                    
                                    {
                                        pEmpleo
                                        &&
                                            <>
                                                <TitleForms type={'title'} title={'Work Experience (Last Job)'} />
                                                <TitleForms type={'subtitle'} title={'Company (Name)'} />
                                                <InputForm status={true} placeholder={'Company (Name)'} fieldName={'nombreEmpresa_3_US'} ref={input_nombre_empresa} onSubmitEditing={() => input_giro.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={'Line of business'} />
                                                <InputForm status={true} placeholder={'Line of business'} fieldName={'giroEmpresa_3_US'} ref={input_giro} onSubmitEditing={() => input_puesto.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={'Position'} />
                                                <InputForm status={true} placeholder={'Position'} fieldName={'puestoDesempeñado_3_US'} ref={input_puesto}/>
                                                <TitleForms type={'subtitle'} title={'Starting date'} />
                                                <Calendar
                                                    show={show_ingreso}
                                                    initialDate={initialDate_ingreso}
                                                    timestamp={timestamp_ingreso}
                                                    fieldName={'fechaIngreso_3_US'}
                                                    handleDate={e => handleDate(e, 'ingreso')}
                                                    handlePress={() => setFilters({...filters, show_ingreso: !show_ingreso})}
                                                />
                                                <TitleForms type={'subtitle'} title={'End date'} />
                                                <Calendar
                                                    show={show_salida}
                                                    initialDate={initialDate_salida}
                                                    timestamp={timestamp_salida}
                                                    fieldName={'fechaSalida_3_US'}
                                                    handleDate={e => handleDate(e, 'salida')}
                                                    handlePress={() => setFilters({...filters, show_salida: !show_salida})}
                                                />

                                                <TitleForms type={'subtitle'} title={'Activities'} />
                                                <InputForm isTextArea={true} status={true} placeholder={'Main Activies'} fieldName={'activities_3_US'} multiline={true} numberOfLines={10}/>
                         
                                                <TitleForms type={'title'} title={'Second Work Experience (Optional)'} />
                                                <TitleForms type={'subtitle'} title={'Company (Name)'} />
                                                <InputForm status={true} placeholder={'Company (Name)'} fieldName={'nombreEmpresaOpcional_3_US'} ref={input_nombre_empresa_opcional} onSubmitEditing={() => input_giro_opcional.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={'Line of business'} />
                                                <InputForm status={true} placeholder={'Line of business'} fieldName={'giroEmpresaOpcional_3_US'} ref={input_giro_opcional} onSubmitEditing={() => input_puesto_opcional.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={'Position'} />
                                                <InputForm status={true} placeholder={'Position'} fieldName={'puestoDesempeñadoOpcional_3_US'} ref={input_puesto_opcional}/>
                                                <TitleForms type={'subtitle'} title={'Starting date'} />
                                                <Calendar
                                                    required={false}
                                                    show={show_ingreso_opcional}
                                                    initialDate={initialDate_ingreso_opcional}
                                                    timestamp={timestamp_ingreso_opcional}
                                                    fieldName={'fechaIngresoOpcional_3_US'}
                                                    handleDate={e => handleDateOptional_3(e)}
                                                    handlePress={() => setFilters({...filters, show_ingreso_opcional: !show_ingreso_opcional})}
                                                />
                                                <TitleForms type={'subtitle'} title={'End date'} />
                                                <Calendar
                                                    required={false}
                                                    show={show_salida_opcional}
                                                    initialDate={initialDate_salida_opcional}
                                                    timestamp={timestamp_salida_opcional}
                                                    fieldName={'fechaSalidaOpcional_3_US'}
                                                    handleDate={e => handleDate(e, 'salida_opcional')}
                                                    handlePress={() => setFilters({...filters, show_salida_opcional: !show_salida_opcional})}
                                                />
                                                
                                                <TitleForms type={'subtitle'} title={'Activities'} />
                                                <InputForm isTextArea={true} status={true} placeholder={'Main Activities'} fieldName={'activitiesOpcional_3_US'} multiline={true} numberOfLines={10}/>
                                            </>
                                    }
                                </>
                            :
                                <>
                                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'title'} title={'Abilities'}/>
                                        </View>
                                    </View>

                                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <Text style={{color: Blue}}>What languages do you speak and write fluently</Text>
                                        </View>
                                        <TouchableOpacity style={{height: 28, width: 28, backgroundColor: 'transparent', borderRadius: 25, borderWidth: 1, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                                            <IonIcons name={'plus'} size={20} color={'transparent'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleAdd(contador + 1)} style={{height: 28, width: 28, backgroundColor: 'rgba(50,131,197,.1)', borderRadius: 25, borderWidth: 1, borderColor: Blue, justifyContent: 'center', alignItems: 'center'}}>
                                            <IonIcons name={'plus'} size={20} color={Blue} />
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        languages.map((x,i) =>
                                            x.id === 1
                                            ?
                                                <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                                                        <InputForm
                                                            radius={false}
                                                            status={true}
                                                            placeholder={'EXAMPLE. SPANISH'}
                                                            fieldName={x.boxName}
                                                        />
                                                    </View>
                                                    <View style={{width: 50, height: 50, backgroundColor: 'rgba(50,131,197,.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Blue, borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                                        <IonIcons name={'lock'} size={22} color={x.id === 1 ? Blue : '#fff'} />
                                                    </View>
                                                </View>
                                            :
                                                x.visible
                                                && 
                                                    <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                                                            <InputForm
                                                                radius={false}
                                                                status={true}
                                                                placeholder={'EXAMPLE. SPANISH'}
                                                                fieldName={x.boxName}
                                                            />
                                                        </View>
                                                        <TouchableOpacity onPress={() => handleHide(x.id)} style={{width: 50, height: 50, backgroundColor: '#DC3644', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#adadad', borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                                            <IonIcons name={'close-thick'} size={22} color={'#fff'} />
                                                        </TouchableOpacity>
                                                    </View>
                                        )
                                    }

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={'What is your level of knowledge using computers?'} />
                                            <Picker 
                                                fieldName={'levelComputer_3_US'}
                                                items={englishOptionsData}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={'\nWhat programs are you familiar with?'} />
                                            <InputForm
                                                status={true}
                                                placeholder={'Example. Word, Excel...'}
                                                fieldName={'familiarPrograms_3_US'}
                                            />
                                        </View>
                                    </View>

                                    <TitleForms type={'title'} title={'Work Experience'}/>
                                    <TitleForms type={'subtitle'} title={'Would this be your first job?'} />
                                    <Picker 
                                        fieldName={'workExperience_3_US'}
                                        items={closeOptions}
                                        contador={1}
                                        handleAction_uno={handleAction_uno}
                                    />
                                    
                                    {
                                        pEmpleo
                                        &&
                                            <>
                                                <TitleForms type={'title'} title={'Work Experience (Last Job)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Company (Name)'} />
                                                        <InputForm status={true} placeholder={'Company (Name)'} fieldName={'nombreEmpresa_3_US'} ref={input_nombre_empresa} onSubmitEditing={() => input_giro.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={'Line of business'} />
                                                        <InputForm status={true} placeholder={'Line of business'} fieldName={'giroEmpresa_3_US'} ref={input_giro} onSubmitEditing={() => input_puesto.current.focus()}/>
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Position'} />
                                                <InputForm status={true} placeholder={'Position'} fieldName={'puestoDesempeñado_3_US'} ref={input_puesto}/>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Starting date'} />
                                                        <Calendar
                                                            show={show_ingreso}
                                                            initialDate={initialDate_ingreso}
                                                            timestamp={timestamp_ingreso}
                                                            fieldName={'fechaIngreso_3_US'}
                                                            handleDate={e => handleDate(e, 'ingreso')}
                                                            handlePress={() => setFilters({...filters, show_ingreso: !show_ingreso})}
                                                        />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'End date'} />
                                                        <Calendar
                                                            show={show_salida}
                                                            initialDate={initialDate_salida}
                                                            timestamp={timestamp_salida}
                                                            fieldName={'fechaSalida_3_US'}
                                                            handleDate={e => handleDate(e, 'salida')}
                                                            handlePress={() => setFilters({...filters, show_salida: !show_salida})}
                                                        />
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Activities'} />
                                                <InputForm isTextArea={true} status={true} placeholder={'Main Activies'} fieldName={'activities_3_US'} multiline={true} numberOfLines={10}/>

                                                <TitleForms type={'title'} title={'Second Work Experience (Optional)'} />

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Company (Name)'} />
                                                        <InputForm status={true} placeholder={'Company (Name)'} fieldName={'nombreEmpresaOpcional_3_US'} ref={input_nombre_empresa_opcional} onSubmitEditing={() => input_giro_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={'Line of business'} />
                                                        <InputForm status={true} placeholder={'Line of business'} fieldName={'giroEmpresaOpcional_3_US'} ref={input_giro_opcional} onSubmitEditing={() => input_puesto_opcional.current.focus()}/>
                                                    </View>
                                                </View>

                                                <TitleForms type={'subtitle'} title={'Position'} />
                                                <InputForm status={true} placeholder={'Position'} fieldName={'puestoDesempeñadoOpcional_3_US'} ref={input_puesto_opcional}/>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Starting date'} />
                                                        <Calendar
                                                            required={false}
                                                            show={show_ingreso_opcional}
                                                            initialDate={initialDate_ingreso_opcional}
                                                            timestamp={timestamp_ingreso_opcional}
                                                            fieldName={'fechaIngresoOpcional_3_US'}
                                                            handleDate={e => handleDateOptional_3(e)}
                                                            handlePress={() => setFilters({...filters, show_ingreso_opcional: !show_ingreso_opcional})}
                                                        />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'End date'} />
                                                        <Calendar
                                                            required={false}
                                                            show={show_salida_opcional}
                                                            initialDate={initialDate_salida_opcional}
                                                            timestamp={timestamp_salida_opcional}
                                                            fieldName={'fechaSalidaOpcional_3_US'}
                                                            handleDate={e => handleDate(e, 'salida_opcional')}
                                                            handlePress={() => setFilters({...filters, show_salida_opcional: !show_salida_opcional})}
                                                        />
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Activities'} />
                                                <InputForm isTextArea={true} status={true} placeholder={'Main Activities'} fieldName={'activitiesOpcional_3_US'} multiline={true} numberOfLines={10}/>
                                            </>
                                    }
                                </>
                        :
                            !isTablet()
                            ?
                                <>
                                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'title'} title={'Abilities'}/>
                                        </View>
                                    </View>

                                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <Text style={{color: Blue}}>What languages do you speak and write fluently</Text>
                                        </View>
                                        <TouchableOpacity style={{height: 28, width: 28, backgroundColor: 'transparent', borderRadius: 25, borderWidth: 1, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                                            <IonIcons name={'plus'} size={20} color={'transparent'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleAdd(contador + 1)} style={{height: 28, width: 28, backgroundColor: 'rgba(50,131,197,.1)', borderRadius: 25, borderWidth: 1, borderColor: Blue, justifyContent: 'center', alignItems: 'center'}}>
                                            <IonIcons name={'plus'} size={20} color={Blue} />
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        languages.map((x,i) =>
                                            x.id === 1
                                            ?
                                                <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                                                        <InputForm
                                                            radius={false}
                                                            status={true}
                                                            placeholder={'EXAMPLE. SPANISH'}
                                                            fieldName={x.boxName}
                                                        />
                                                    </View>
                                                    <View style={{width: 50, height: 50, backgroundColor: 'rgba(50,131,197,.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Blue, borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                                        <IonIcons name={'lock'} size={22} color={x.id === 1 ? Blue : '#fff'} />
                                                    </View>
                                                </View>
                                            :
                                                x.visible
                                                && 
                                                    <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                                                            <InputForm
                                                                radius={false}
                                                                status={true}
                                                                placeholder={'EXAMPLE. SPANISH'}
                                                                fieldName={x.boxName}
                                                            />
                                                        </View>
                                                        <TouchableOpacity onPress={() => handleHide(x.id)} style={{width: 50, height: 50, backgroundColor: '#DC3644', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#adadad', borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                                            <IonIcons name={'close-thick'} size={22} color={'#fff'} />
                                                        </TouchableOpacity>
                                                    </View>
                                        )
                                    }

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={'What is your level of knowledge using computers?'} />
                                            <Picker 
                                                fieldName={'levelComputer_3_US'}
                                                items={englishOptionsData}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={'What programs are you familiar with?'} />
                                            <InputForm
                                                status={true}
                                                placeholder={'Example. Word, Excel...'}
                                                fieldName={'familiarPrograms_3_US'}
                                            />
                                        </View>
                                    </View>

                                    <TitleForms type={'title'} title={'Work Experience'}/>
                                    <TitleForms type={'subtitle'} title={'Would this be your first job?'} />
                                    <Picker 
                                        fieldName={'workExperience_3_US'}
                                        items={closeOptions}
                                        contador={1}
                                        handleAction_uno={handleAction_uno}
                                    />
                                    
                                    {
                                        pEmpleo
                                        &&
                                            <>
                                                <TitleForms type={'title'} title={'Work Experience (Last Job)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Company (Name)'} />
                                                        <InputForm status={true} placeholder={'Company (Name)'} fieldName={'nombreEmpresa_3_US'} ref={input_nombre_empresa} onSubmitEditing={() => input_giro.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={'Line of business'} />
                                                        <InputForm status={true} placeholder={'Line of business'} fieldName={'giroEmpresa_3_US'} ref={input_giro} onSubmitEditing={() => input_puesto.current.focus()}/>
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Position'} />
                                                <InputForm status={true} placeholder={'Position'} fieldName={'puestoDesempeñado_3_US'} ref={input_puesto}/>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Starting date'} />
                                                        <Calendar
                                                            show={show_ingreso}
                                                            initialDate={initialDate_ingreso}
                                                            timestamp={timestamp_ingreso}
                                                            fieldName={'fechaIngreso_3_US'}
                                                            handleDate={e => handleDate(e, 'ingreso')}
                                                            handlePress={() => setFilters({...filters, show_ingreso: !show_ingreso})}
                                                        />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'End date'} />
                                                        <Calendar
                                                            show={show_salida}
                                                            initialDate={initialDate_salida}
                                                            timestamp={timestamp_salida}
                                                            fieldName={'fechaSalida_3_US'}
                                                            handleDate={e => handleDate(e, 'salida')}
                                                            handlePress={() => setFilters({...filters, show_salida: !show_salida})}
                                                        />
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Activities'} />
                                                <InputForm isTextArea={true} status={true} placeholder={'Main Activies'} fieldName={'activities_3_US'} multiline={true} numberOfLines={10}/>

                                                <TitleForms type={'title'} title={'Second Work Experience (Optional)'} />

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Company (Name)'} />
                                                        <InputForm status={true} placeholder={'Company (Name)'} fieldName={'nombreEmpresaOpcional_3_US'} ref={input_nombre_empresa_opcional} onSubmitEditing={() => input_giro_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={'Line of business'} />
                                                        <InputForm status={true} placeholder={'Line of business'} fieldName={'giroEmpresaOpcional_3_US'} ref={input_giro_opcional} onSubmitEditing={() => input_puesto_opcional.current.focus()}/>
                                                    </View>
                                                </View>

                                                <TitleForms type={'subtitle'} title={'Position'} />
                                                <InputForm status={true} placeholder={'Position'} fieldName={'puestoDesempeñadoOpcional_3_US'} ref={input_puesto_opcional}/>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Starting date'} />
                                                        <Calendar
                                                            required={false}
                                                            show={show_ingreso_opcional}
                                                            initialDate={initialDate_ingreso_opcional}
                                                            timestamp={timestamp_ingreso_opcional}
                                                            fieldName={'fechaIngresoOpcional_3_US'}
                                                            handleDate={e => handleDateOptional_3(e)}
                                                            handlePress={() => setFilters({...filters, show_ingreso_opcional: !show_ingreso_opcional})}
                                                        />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'End date'} />
                                                        <Calendar
                                                            required={false}
                                                            show={show_salida_opcional}
                                                            initialDate={initialDate_salida_opcional}
                                                            timestamp={timestamp_salida_opcional}
                                                            fieldName={'fechaSalidaOpcional_3_US'}
                                                            handleDate={e => handleDate(e, 'salida_opcional')}
                                                            handlePress={() => setFilters({...filters, show_salida_opcional: !show_salida_opcional})}
                                                        />
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Activities'} />
                                                <InputForm isTextArea={true} status={true} placeholder={'Main Activities'} fieldName={'activitiesOpcional_3_US'} multiline={true} numberOfLines={10}/>
                                            </>
                                    }
                                </>
                            :
                                //horizontal tablet
                                <>
                                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'title'} title={'Abilities'}/>
                                        </View>
                                    </View>

                                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <Text style={{color: Blue}}>What languages do you speak and write fluently</Text>
                                        </View>
                                        <TouchableOpacity style={{height: 28, width: 28, backgroundColor: 'transparent', borderRadius: 25, borderWidth: 1, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                                            <IonIcons name={'plus'} size={20} color={'transparent'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleAdd(contador + 1)} style={{height: 28, width: 28, backgroundColor: 'rgba(50,131,197,.1)', borderRadius: 25, borderWidth: 1, borderColor: Blue, justifyContent: 'center', alignItems: 'center'}}>
                                            <IonIcons name={'plus'} size={20} color={Blue} />
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        languages.map((x,i) =>
                                            x.id === 1
                                            ?
                                                <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                                                        <InputForm
                                                            radius={false}
                                                            status={true}
                                                            placeholder={'EXAMPLE. SPANISH'}
                                                            fieldName={x.boxName}
                                                        />
                                                    </View>
                                                    <View style={{width: 50, height: 50, backgroundColor: 'rgba(50,131,197,.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Blue, borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                                        <IonIcons name={'lock'} size={22} color={x.id === 1 ? Blue : '#fff'} />
                                                    </View>
                                                </View>
                                            :
                                                x.visible
                                                && 
                                                    <View style={{marginBottom: 10, flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                                                            <InputForm
                                                                radius={false}
                                                                status={true}
                                                                placeholder={'EXAMPLE. SPANISH'}
                                                                fieldName={x.boxName}
                                                            />
                                                        </View>
                                                        <TouchableOpacity onPress={() => handleHide(x.id)} style={{width: 50, height: 50, backgroundColor: '#DC3644', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#adadad', borderTopEndRadius: 20, borderBottomEndRadius: 20, paddingRight: 3}}>
                                                            <IonIcons name={'close-thick'} size={22} color={'#fff'} />
                                                        </TouchableOpacity>
                                                    </View>
                                        )
                                    }

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={'What is your level of knowledge using computers?'} />
                                            <Picker 
                                                fieldName={'levelComputer_3_US'}
                                                items={englishOptionsData}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={'What programs are you familiar with?'} />
                                            <InputForm
                                                status={true}
                                                placeholder={'Example. Word, Excel...'}
                                                fieldName={'familiarPrograms_3_US'}
                                            />
                                        </View>
                                    </View>

                                    <TitleForms type={'title'} title={'Work Experience'}/>
                                    <TitleForms type={'subtitle'} title={'Would this be your first job?'} />
                                    <Picker 
                                        fieldName={'workExperience_3_US'}
                                        items={closeOptions}
                                        contador={1}
                                        handleAction_uno={handleAction_uno}
                                    />
                                    
                                    {
                                        pEmpleo
                                        &&
                                            <>
                                                <TitleForms type={'title'} title={'Work Experience (Last Job)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Company (Name)'} />
                                                        <InputForm status={true} placeholder={'Company (Name)'} fieldName={'nombreEmpresa_3_US'} ref={input_nombre_empresa} onSubmitEditing={() => input_giro.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={'Line of business'} />
                                                        <InputForm status={true} placeholder={'Line of business'} fieldName={'giroEmpresa_3_US'} ref={input_giro} onSubmitEditing={() => input_puesto.current.focus()}/>
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Position'} />
                                                <InputForm status={true} placeholder={'Position'} fieldName={'puestoDesempeñado_3_US'} ref={input_puesto}/>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Starting date'} />
                                                        <Calendar
                                                            show={show_ingreso}
                                                            initialDate={initialDate_ingreso}
                                                            timestamp={timestamp_ingreso}
                                                            fieldName={'fechaIngreso_3_US'}
                                                            handleDate={e => handleDate(e, 'ingreso')}
                                                            handlePress={() => setFilters({...filters, show_ingreso: !show_ingreso})}
                                                        />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'End date'} />
                                                        <Calendar
                                                            show={show_salida}
                                                            initialDate={initialDate_salida}
                                                            timestamp={timestamp_salida}
                                                            fieldName={'fechaSalida_3_US'}
                                                            handleDate={e => handleDate(e, 'salida')}
                                                            handlePress={() => setFilters({...filters, show_salida: !show_salida})}
                                                        />
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Activities'} />
                                                <InputForm isTextArea={true} status={true} placeholder={'Main Activies'} fieldName={'activities_3_US'} multiline={true} numberOfLines={10}/>

                                                <TitleForms type={'title'} title={'Second Work Experience (Optional)'} />

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Company (Name)'} />
                                                        <InputForm status={true} placeholder={'Company (Name)'} fieldName={'nombreEmpresaOpcional_3_US'} ref={input_nombre_empresa_opcional} onSubmitEditing={() => input_giro_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={'Line of business'} />
                                                        <InputForm status={true} placeholder={'Line of business'} fieldName={'giroEmpresaOpcional_3_US'} ref={input_giro_opcional} onSubmitEditing={() => input_puesto_opcional.current.focus()}/>
                                                    </View>
                                                </View>

                                                <TitleForms type={'subtitle'} title={'Position'} />
                                                <InputForm status={true} placeholder={'Position'} fieldName={'puestoDesempeñadoOpcional_3_US'} ref={input_puesto_opcional}/>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'Starting date'} />
                                                        <Calendar
                                                            required={false}
                                                            show={show_ingreso_opcional}
                                                            initialDate={initialDate_ingreso_opcional}
                                                            timestamp={timestamp_ingreso_opcional}
                                                            fieldName={'fechaIngresoOpcional_3_US'}
                                                            handleDate={e => handleDateOptional_3(e)}
                                                            handlePress={() => setFilters({...filters, show_ingreso_opcional: !show_ingreso_opcional})}
                                                        />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={'End date'} />
                                                        <Calendar
                                                            required={false}
                                                            show={show_salida_opcional}
                                                            initialDate={initialDate_salida_opcional}
                                                            timestamp={timestamp_salida_opcional}
                                                            fieldName={'fechaSalidaOpcional_3_US'}
                                                            handleDate={e => handleDate(e, 'salida_opcional')}
                                                            handlePress={() => setFilters({...filters, show_salida_opcional: !show_salida_opcional})}
                                                        />
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Activities'} />
                                                <InputForm isTextArea={true} status={true} placeholder={'Main Activities'} fieldName={'activitiesOpcional_3_US'} multiline={true} numberOfLines={10}/>
                                            </>
                                    }
                                </>
                    }
                </View>
            </ProgressStep>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: '#1177E9',
        fontWeight: '100',
        marginBottom: 5,
    },
    picker: {
        borderColor: '#f1f1f1',
        borderWidth: 1,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        color: 'orange',
        fontWeight:'bold'
    },
    list: {
        height: 'auto',
        alignSelf: 'stretch'
    }
})