import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Alert, Text, TouchableOpacity, BackHandler} from 'react-native';
import {InputForm, Picker, Calendar, TitleForms, DatePicker, ProgressStepActions, MultiTextForm} from '../../../../components';
import tw from 'twrnc'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';
import {useOrientation} from '../../../../hooks';
import {useFormikContext} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Blue} from '../../../../colors/colorsApp';
import { isIphone } from '../../../../access/requestedData';

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
        'initial': 'PORTRAIT'
    });
    
    const first = {label: 'Select', value: 'SEL'};

    const closeOptions = [
        first,
        {label: 'NO', value: '0'},
        {label: 'YES', value: '1'},
    ]

    const proficiencyOptions = [
        first,
        {label: 'EXCELLENT', value: 'EXCELLENT'},
        {label: 'GOOD', value: 'GOOD'},
        {label: 'FAIR', value: 'FAIR'},
        {label: 'POOR', value: 'POOR'},
        {label: 'NONE', value: 'NONE'},
    ]

    const schoolOptions = [
        first,
        {label: 'TECHNICAL OR VOCATIONAL', value: 'TECHNICAL OR VOCATIONA'},
        {label: 'COLLEGE OR UNIVERSITY', value: 'COLLEGE OR UNIVERSITY'},
    ]

    const [schools, setSchools] = useState([
        {
            id: 2,
            type: 'type_school_dos_2',
            school: 'school_name_uno_2',
            location: 'location_uno_2',
            graduated: 'graduated_uno_2',
            certificate: 'certificate_uno_2',
            schedule: 'schedule_uno_2',
            visible: false,
        },
        {
            id: 3,
            type: 'type_school_tres_2',
            school: 'school_name_tres_2',
            location: 'location_tres_2',
            graduated: 'graduated_tres_2',
            certificate: 'certificate_tres_2',
            schedule: 'schedule_tres_2',
            visible: false,
        },
        {
            id: 4,
            type: 'type_school_cuatro_2',
            school: 'school_name_cuatro_2',
            location: 'location_cuatro_2',
            graduated: 'graduated_cuatro_2',
            certificate: 'certificate_cuatro_2',
            schedule: 'schedule_cuatro_2',
            visible: false,
        },
        {
            id: 5,
            type: 'type_school_cinco_2',
            school: 'school_name_cinco_2',
            location: 'location_cinco_2',
            graduated: 'graduated_cinco_2',
            certificate: 'certificate_cinco_2',
            schedule: 'schedule_cinco_2',
            visible: false,
        },
    ])

    const [filters, setFilters] = useState({
        error: true,
        pEmpleo: false,
        contador: 1,
    });

    const {
        fechaIngreso_3_US,
        fechaSalida_3_US,
        fechaIngresoOpcional_3_US,
        fechaSalidaOpcional_3_US,

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
    const {error, pEmpleo, contador} = filters;

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

            refl_fecha_inicio1: fechaIngreso_3_US === 'Not selected' ? null : fechaIngreso_3_US,
            refl_fecha_final1: fechaSalida_3_US === 'Not selected' ? null : fechaSalida_3_US,
            refl_nombre_empresa2: nombreEmpresaOpcional_3_US ? nombreEmpresaOpcional_3_US : '',
            refl_giro_empresa2: giroEmpresaOpcional_3_US ? giroEmpresaOpcional_3_US : '',
            refl_puesto2: puestoDesempeñadoOpcional_3_US ? puestoDesempeñadoOpcional_3_US : '',
            refl_actividades2: activitiesOpcional_3_US,

            refl_fecha_inicio2: fechaIngresoOpcional_3_US === 'Not selected' ? null : fechaIngresoOpcional_3_US,
            refl_fecha_final2: fechaSalidaOpcional_3_US === 'Not selected' ? null : fechaSalidaOpcional_3_US,
        }
        
        if(pEmpleo){
            if(levelComputer_3_US === undefined || levelComputer_3_US === 'SEL' || familiarPrograms_3_US === undefined || familiarPrograms_3_US === '' || nombreEmpresa_3_US === undefined || nombreEmpresa_3_US === '' || giroEmpresa_3_US === undefined || giroEmpresa_3_US === '' || puestoDesempeñado_3_US === undefined || puestoDesempeñado_3_US === '' || fechaIngreso_3_US === '' || fechaIngreso_3_US === undefined || fechaSalida_3_US === '' || fechaSalida_3_US === undefined || activities_3_US === undefined || activities_3_US === ''){
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
            let temporales = schools.map(x => x.id === current ? ({...x, visible: true}) : x)
            let ordered = temporales.sort((a, b) => a.id - b.id)
            setSchools(ordered)
            setFilters({...filters, contador: contador + 1})
        } else {
            const nuevo = schools.find(x => !x.visible)
            if(nuevo){
                const withOut = schools.filter(x => x.id !== nuevo.id)
                let obj = [...withOut, ({...nuevo, visible: true})]
                let ordered = obj.sort((a, b) => a.id - b.id)
                setSchools(ordered)
            }
        }
    }
    
    const handleHide = (id) => {
        let temporales = schools.map(x => x.id === id ? ({...x, visible: false}) : x)
        setSchools(temporales)
    }

    const Item = () => {
        return(
            <TouchableOpacity onPress={() => handleAdd(contador + 1)} style={{height: 28, width: 28, backgroundColor: 'rgba(50,131,197,.1)', borderRadius: 25, borderWidth: 1, borderColor: Blue, justifyContent: 'center', alignItems: 'center', paddingLeft: isIphone ? 1 : 0}}>
                <IonIcons name={'plus'} size={20} color={Blue} />
            </TouchableOpacity>
        )
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            
            <View style={{alignSelf: 'stretch', paddingHorizontal: 18}}>
                {
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        !isTablet()
                        ?
                            <>
                                <TitleForms type={'title'} title={'Education'}/>
                                <Text style={tw`text-[#adadad] text-sm mb-1.5`}>(You may be required to provide proof of diploma, degree, transcripts, licenses, and certifications)</Text>

                                <TitleForms type={'subtitle'} title={'Have you ever received a High School Diploma or GED? (Please specify which)'} />
                                <InputForm
                                    status={true}
                                    placeholder={'DIPLOMA OR GED'}
                                    fieldName={'diploma_2'}
                                />
                                <TitleForms type={'subtitle'} title={'If not, what is the highest level completed?'} />
                                <InputForm
                                    status={true}
                                    placeholder={'HIGHEST GRADE LEVEL COMPLETED'}
                                    fieldName={'level_2'}
                                />

                                <TitleForms type={'title'} title={'School'} Item={Item}/>
                                <TitleForms type={'subtitle'} title={'Type Of School'} />
                                <Picker 
                                    fieldName={'type_school_uno_2'}
                                    items={schoolOptions}
                                />
                                <TitleForms type={'subtitle'} title={'School Name'} />
                                <InputForm
                                    status={true}
                                    placeholder={'SCHOOL NAME'}
                                    fieldName={'school_name_uno_2'}
                                />
                                <TitleForms type={'subtitle'} title={'Location'} />
                                <InputForm
                                    status={true}
                                    placeholder={'LOCATION'}
                                    fieldName={'location_uno_2'}
                                />
                                <TitleForms type={'subtitle'} title={'Graduated'} />
                                <Picker 
                                    fieldName={'graduated_uno_2'}
                                    items={closeOptions}
                                />
                                <TitleForms type={'subtitle'} title={'Type Of Degree Or Certificate'} />
                                <InputForm
                                    status={true}
                                    placeholder={'TYPE OF DEGREE OR CERTIFICA'}
                                    fieldName={'certificate_uno_2'}
                                />
                                <TitleForms type={'subtitle'} title={'Provide Schedule (If Current Student)'} />
                                <InputForm
                                    status={true}
                                    placeholder={'SCHEDULE'}
                                    fieldName={'schedule_uno_2'}
                                />
                                {
                                    schools.map((x,i) =>
                                        x.visible
                                        &&
                                            <>
                                                <View style={{flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20}} key={x.id}>
                                                    <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                                        <Text style={tw`text-base text-[${Blue}] font-bold`}>{`Option(${x.id})`}</Text>
                                                    </View>
                                                    <View style={{width: 'auto', height: 40, justifyContent: 'center', alignItems: 'flex-end', borderTopEndRadius: 20, borderBottomEndRadius: 20}}>
                                                        <TouchableOpacity onPress={() => handleHide(x.id)} style={{height: 28, width: 28, backgroundColor: 'rgba(219,62,47,.1)', borderRadius: 25, borderWidth: 1, borderColor: '#DB3E2F', justifyContent: 'center', alignItems: 'center', paddingLeft: isIphone ? 1 : 0}}>
                                                            <IonIcons name={'close'} size={18} color={'#DB3E2F'} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Type Of School'} />
                                                <Picker 
                                                    fieldName={x.type}
                                                    items={schoolOptions}
                                                />
                                                <TitleForms type={'subtitle'} title={'School Name'} />
                                                <InputForm
                                                    status={true}
                                                    fieldName={x.school}
                                                    placeholder={'SCHOOL NAME'}
                                                />
                                                <TitleForms type={'subtitle'} title={'Location'} />
                                                <InputForm
                                                    status={true}
                                                    fieldName={x.location}
                                                    placeholder={'LOCATION'}
                                                />
                                                <TitleForms type={'subtitle'} title={'Graduated'} />
                                                <Picker 
                                                    fieldName={x.graduated}
                                                    items={closeOptions}
                                                />
                                                <TitleForms type={'subtitle'} title={'Type Of Degree Or Certificate'} />
                                                <InputForm
                                                    status={true}
                                                    fieldName={x.certificate}
                                                    placeholder={'TYPE OF DEGREE OR CERTIFICA'}
                                                />
                                                <TitleForms type={'subtitle'} title={'Provide Schedule (If Current Student)'} />
                                                <InputForm
                                                    status={true}
                                                    fieldName={x.schedule}
                                                    placeholder={'SCHEDULE'}
                                                />
                                            </>
                                    )
                                }
                                <TitleForms type={'title'} title={'Special Training / Skills / Qualification'}/>
                                <TitleForms type={'subtitle'} title={'List all job related training or skills you process and office/computer equipment you can use, including types of software and hardware.'} />
                                <MultiTextForm
                                    status={true}
                                    placeholder={'SPECIAL TRAINING / SKILLS / QUALIFICATION'}
                                    fieldName={'qualifications_2'}
                                    isTextArea={true}
                                    required={true}
                                />
                                
                                <TitleForms type={'title'} title={'Assessment Scores'}/>
                                <TitleForms type={'subtitle'} title={'Graduated'} />
                                <Picker 
                                    fieldName={'english_proficiency_2'}
                                    items={proficiencyOptions}
                                />
                                <TitleForms type={'subtitle'} title={'Graduated'} />
                                <Picker 
                                    fieldName={'spanish_proficiency_2'}
                                    items={proficiencyOptions}
                                />
                                <ProgressStepActions language={'2'} handleNext={handleValues}/>
                            </>
                        :
                            <>
                                <Text>Por definirse</Text>
                            </>
                    :
                        !isTablet()
                        ?
                            <>
                                <Text>Por definirse</Text>
                            </>
                        :
                            //horizontal tablet
                            <>
                                <Text>Por definirse</Text>
                            </>
                }
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow:1,
    },
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