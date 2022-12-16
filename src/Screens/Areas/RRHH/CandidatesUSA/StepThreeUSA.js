import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Text, Alert, BackHandler, TouchableOpacity, Linking} from 'react-native';
import {DatePicker, InputForm, MultiTextForm, Picker, ProgressStepActions, TitleForms} from '../../../../components';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useOrientation} from '../../../../hooks';
import {useFormikContext} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {contactEmail, isIphone} from '../../../../access/requestedData';
import {Blue} from '../../../../colors/colorsApp';
import {useDispatch} from 'react-redux';
import {setCurriculumUSA, setStatementsVisibility, setStepThreeUSA} from '../../../../slices/applicationForm';
import tw from 'twrnc'

let currentOne = null;
let currentTwo = null;
let currentTwoSchools = null;

let keyOne = 'stepOne'
let keyTwo = 'stepTwo'
let keySchools = 'stepTwoSchools'

export default ({navigation, language}) => {
    const input_company = useRef()
    const input_address = useRef()
    const input_telephone = useRef()
    const input_supervisor = useRef()
    const input_position = useRef()
    const input_average = useRef()

    const dispatch = useDispatch()

    const [jobs, setJobs] = useState([
        {
            id: 2,
            refl_nombre_empresa: 'company_dos_3',
            refl_direccion: 'address_dos_3',
            refl_telefono: 'phone_dos_3',
            refl_jefe_directo: 'supervisor_dos_3',
            refl_puesto: 'position_dos_3',
            refl_hrs_promedio: 'average_dos_3',
            refl_fecha_ingreso: 'starting_dos_3',
            refl_fecha_salida: 'ending_dos_3',
            refl_motivo_salida: 'reason_dos_3',
            refl_actividad: 'summary_dos_3',
            visible: false,
        },
        {
            id: 3,
            refl_nombre_empresa: 'company_tres_3',
            refl_direccion: 'address_tres_3',
            refl_telefono: 'phone_tres_3',
            refl_jefe_directo: 'supervisor_tres_3',
            refl_puesto: 'position_tres_3',
            refl_hrs_promedio: 'average_tres_3',
            refl_fecha_ingreso: 'starting_tres_3',
            refl_fecha_salida: 'ending_tres_3',
            refl_motivo_salida: 'reason_tres_3',
            refl_actividad: 'summary_tres_3',
            visible: false,
        },
        {
            id: 4,
            refl_nombre_empresa: 'company_cuatro_3',
            refl_direccion: 'address_cuatro_3',
            refl_telefono: 'phone_cuatro_3',
            refl_jefe_directo: 'supervisor_cuatro_3',
            refl_puesto: 'position_cuatro_3',
            refl_hrs_promedio: 'average_cuatro_3',
            refl_fecha_ingreso: 'starting_cuatro_3',
            refl_fecha_salida: 'ending_cuatro_3',
            refl_motivo_salida: 'reason_cuatro_3',
            refl_actividad: 'summary_cuatro_3',
            visible: false,
        },
        {
            id: 5,
            refl_nombre_empresa: 'company_cinco_3',
            refl_direccion: 'address_cinco_3',
            refl_telefono: 'phone_cinco_3',
            refl_jefe_directo: 'supervisor_cinco_3',
            refl_puesto: 'position_cinco_3',
            refl_hrs_promedio: 'average_cinco_3',
            refl_fecha_ingreso: 'starting_cinco_3',
            refl_fecha_salida: 'ending_cinco_3',
            refl_motivo_salida: 'reason_cinco_3',
            refl_actividad: 'summary_cinco_3',
            visible: false,
        },
        
    ])

    const getInfo = async () => {
        currentOne = await AsyncStorage.getItem(keyOne) || '[]';
        currentOne = JSON.parse(currentOne);

        currentTwo = await AsyncStorage.getItem(keyTwo) || '[]';
        currentTwo = JSON.parse(currentTwo);

        currentTwoSchools = await AsyncStorage.getItem(keySchools) || '[]';
        currentTwoSchools = JSON.parse(currentTwoSchools);

        all = {...currentOne, ...currentTwo};
    }

    useEffect(() => {
        getInfo()
    },[])

    const first = {label: 'PLEASE SELECT ONE', value: 'SEL'};

    const closeOptions = [
        first,
        {label: 'NO', value: '0'},
        {label: 'YES', value: '1'},
    ]

    const {submitForm, values} = useFormikContext();

    const {
        any_experience_3,

        company_uno_3,
        address_uno_3,
        phone_uno_3,
        supervisor_uno_3,
        position_uno_3,
        average_uno_3,
        starting_uno_3,
        ending_uno_3,
        reason_uno_3,
        summary_uno_3,

        company_dos_3,
        address_dos_3,
        phone_dos_3,
        supervisor_dos_3,
        position_dos_3,
        average_dos_3,
        starting_dos_3,
        ending_dos_3,
        reason_dos_3,
        summary_dos_3,

        company_tres_3,
        address_tres_3,
        phone_tres_3,
        supervisor_tres_3,
        position_tres_3,
        average_tres_3,
        starting_tres_3,
        ending_tres_3,
        reason_tres_3,
        summary_tres_3,

        company_cuatro_3,
        address_cuatro_3,
        phone_cuatro_3,
        supervisor_cuatro_3,
        position_cuatro_3,
        average_cuatro_3,
        starting_cuatro_3,
        ending_cuatro_3,
        reason_cuatro_3,
        summary_cuatro_3,

        company_cinco_3,
        address_cinco_3,
        phone_cinco_3,
        supervisor_cinco_3,
        position_cinco_3,
        average_cinco_3,
        starting_cinco_3,
        ending_cinco_3,
        reason_cinco_3,
        summary_cinco_3
    } = values

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });
    

    const [filters, setFilters] = useState({
        error: true,
        experience: 0,
        contador: 1,
    });

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

    const AlertaEmail = () => {
        Alert.alert(
            'Application Created Successfully!',
            `Please be aware of your phone and email, we'll be contacting you soon to follow up with your application. \n\nFor more information:\n${contactEmail}`,
            [
                {
                    text: 'OK',
                    style: 'OK',
                    onPress: () => navigation.navigate('Choose')
                },
                { 
                    text: 'Send an Email', 
                    onPress: () => handleEmail()
                }
            ]
        )
    }

    const handleEmail = async () => {
        await Linking.openURL(`mailto:${contactEmail}?subject=Schedule an appointment`)
        navigation.navigate('Choose')
    }

    const {contador, experience} = filters;
    const {nombreRelacionUno_4_US, telefonoRelacionUno_4_US, ocupacionRelacionUno_4_US, nombreRelacionDos_4_US, telefonoRelacionDos_4_US, ocupacionRelacionDos_4_US} = values;

    const handleValues = async () => {
        if(any_experience_3 === 'SEL' || any_experience_3 === undefined){
            Alerta()
        }
        else {
            if(any_experience_3 === '0'){
                let curriculum = [];
                let obj_3 = {
                    cand_primer_empleo: any_experience_3 === '1' ? '0' : '1'
                }

                dispatch(setStepThreeUSA(obj_3))
                dispatch(setCurriculumUSA(curriculum))
                dispatch(setStatementsVisibility(true))
            } else {
                if(company_uno_3 === '' || company_uno_3 === undefined || address_uno_3 === '' || address_uno_3 === undefined || phone_uno_3 === '' || phone_uno_3 === undefined || supervisor_uno_3 === '' || supervisor_uno_3 === undefined || position_uno_3 === '' || position_uno_3 === undefined || average_uno_3 === '' || average_uno_3 === undefined || starting_uno_3 === undefined || ending_uno_3 === undefined || reason_uno_3 === '' || reason_uno_3 === undefined || summary_uno_3 === '' || summary_uno_3 === undefined){
                    Alerta()
                } else {
                    let curriculum = [
                        {
                            refl_nombre_empresa: company_uno_3 ? company_uno_3 : '',
                            refl_direccion: address_uno_3 ? address_uno_3 : '',
                            refl_telefono: phone_uno_3 ? phone_uno_3 : '',
                            refl_jefe_directo: supervisor_uno_3 ? supervisor_uno_3 : '',
                            refl_puesto: position_uno_3 ? position_uno_3 : '',
                            refl_hrs_promedio: average_uno_3 ? average_uno_3 : '',
                            refl_fecha_ingreso: starting_uno_3 ? starting_uno_3 : '',
                            refl_fecha_salida: ending_uno_3 ? ending_uno_3 : '',
                            refl_motivo_salida: reason_uno_3 ? reason_uno_3 : '',
                            refl_actividad: summary_uno_3 ? summary_uno_3 : ''
                        },
                        {
                            refl_nombre_empresa: company_dos_3 ? company_dos_3 : '',
                            refl_direccion: address_dos_3 ? address_dos_3 : '',
                            refl_telefono: phone_dos_3 ? phone_dos_3 : '',
                            refl_jefe_directo: supervisor_dos_3 ? supervisor_dos_3 : '',
                            refl_puesto: position_dos_3 ? position_dos_3 : position_dos_3,
                            refl_hrs_promedio: average_dos_3 ? average_dos_3 : '',
                            refl_fecha_ingreso: starting_dos_3 ? starting_dos_3 : null,
                            refl_fecha_salida: ending_dos_3 ? ending_dos_3 : null,
                            refl_motivo_salida: reason_dos_3 ? reason_dos_3 : '',
                            refl_actividad: summary_dos_3 ? summary_dos_3 : ''
                        },
                        {
                            refl_nombre_empresa: company_tres_3 ? company_tres_3 : '',
                            refl_direccion: address_tres_3 ? address_tres_3 : '',
                            refl_telefono: phone_tres_3 ? phone_tres_3 : '',
                            refl_jefe_directo: supervisor_tres_3 ? supervisor_tres_3 : '',
                            refl_puesto: position_tres_3 ? position_tres_3 : position_tres_3,
                            refl_hrs_promedio: average_tres_3 ? average_tres_3 : '',
                            refl_fecha_ingreso: starting_tres_3 ? starting_tres_3 : null,
                            refl_fecha_salida: ending_tres_3 ? ending_tres_3 : null,
                            refl_motivo_salida: reason_tres_3 ? reason_tres_3 : '',
                            refl_actividad: summary_tres_3 ? summary_tres_3 : ''
                        },
                        {
                            refl_nombre_empresa: company_cuatro_3 ? company_cuatro_3 : '',
                            refl_direccion: address_cuatro_3 ? address_cuatro_3 : '',
                            refl_telefono: phone_cuatro_3 ? phone_cuatro_3 : '',
                            refl_jefe_directo: supervisor_cuatro_3 ? supervisor_cuatro_3 : '',
                            refl_puesto: position_cuatro_3 ? position_cuatro_3 : position_cuatro_3,
                            refl_hrs_promedio: average_cuatro_3 ? average_cuatro_3 : '',
                            refl_fecha_ingreso: starting_cuatro_3 ? starting_cuatro_3 : null,
                            refl_fecha_salida: ending_cuatro_3 ? ending_cuatro_3 : null,
                            refl_motivo_salida: reason_cuatro_3 ? reason_cuatro_3 : '',
                            refl_actividad: summary_cuatro_3 ? summary_cuatro_3 : ''
                        },
                        {
                            refl_nombre_empresa: company_cinco_3 ? company_cinco_3 : '',
                            refl_direccion: address_cinco_3 ? address_cinco_3 : '',
                            refl_telefono: phone_cinco_3 ? phone_cinco_3 : '',
                            refl_jefe_directo: supervisor_cinco_3 ? supervisor_cinco_3 : '',
                            refl_puesto: position_cinco_3 ? position_cinco_3 : position_cinco_3,
                            refl_hrs_promedio: average_cinco_3 ? average_cinco_3 : '',
                            refl_fecha_ingreso: starting_cinco_3 ? starting_cinco_3 : null,
                            refl_fecha_salida: ending_cinco_3 ? ending_cinco_3 : null,
                            refl_motivo_salida: reason_cinco_3 ? reason_cinco_3 : '',
                            refl_actividad: summary_cinco_3 ? summary_cinco_3 : ''
                        },
                    ]
                    const newCurriculum = curriculum.filter(x => (x.refl_nombre_empresa !== '' && x.refl_direccion !== '' && x.refl_telefono !== '' && x.refl_jefe_directo !== '' && x.refl_puesto !== '' && x.refl_hrs_promedio !== '' && x.refl_fecha_ingreso !== null && x.refl_fecha_salida !== null && x.refl_motivo_salida !== '' && x.refl_actividad !== '') && x)
                    
                    let obj_3 = {
                        cand_primer_empleo: any_experience_3
                    }

                    dispatch(setStepThreeUSA(obj_3))
                    dispatch(setCurriculumUSA(newCurriculum))
                    dispatch(setStatementsVisibility(true))
                }
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

    const handleAction_uno = (index) => {
        setFilters({...filters, experience: index})
    }
    
    const handleAdd = (current) => {
        if(current <= 5){
            let temporales = jobs.map(x => x.id === current ? ({...x, visible: true}) : x)
            let ordered = temporales.sort((a, b) => a.id - b.id)
            setJobs(ordered)
            setFilters({...filters, contador: contador + 1})
        } else {
            const nuevo = jobs.find(x => !x.visible)
            if(nuevo){
                const withOut = jobs.filter(x => x.id !== nuevo.id)
                let obj = [...withOut, ({...nuevo, visible: true})]
                let ordered = obj.sort((a, b) => a.id - b.id)
                setJobs(ordered)
            }
        }
    }

    const handleHide = (id) => {
        let temporales = jobs.map(x => x.id === id ? ({...x, visible: false}) : x)
        setJobs(temporales)
    }

    const Item = () => {
        return(
            <TouchableOpacity onPress={() => handleAdd(contador + 1)} style={tw`px-3 py-2 border border-[#dadada] rounded bg-[${Blue}] flex-row`}>
                <Text style={tw`text-[#fff] font-bold`}>Add Experience</Text>
            </TouchableOpacity>
        )
    }

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={{alignSelf: 'stretch', paddingHorizontal: 18}}>
                {
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <>
                            <TitleForms type={'title'} title={'Experience'}/>
                            <TitleForms type={'subtitle'} title={'Do you have any work experience?'} />
                            <Picker
                                fieldName={'any_experience_3'}
                                items={closeOptions}
                                contador={1}
                                handleAction_uno={handleAction_uno}
                            />

                            {
                                experience === 2
                                &&
                                    <>
                                        <TitleForms type={'title'} title={'Work Experience'} Item={Item}/>
                                        <Text style={tw`text-[#adadad] text-sm mb-1.5`}>Include all previous work experience. List your most recent employment first. Describe your qualifications and duties in as much detail as possible. Work experience must be recorded here, even if a resume is provided.</Text>
                                        <TitleForms type={'subtitle'} title={'Company Name'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'COMPANY NAME'}
                                            fieldName={'company_uno_3'}
                                            ref={input_company}
                                            onSubmitEditing={() => input_address.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'Address'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'COMPANY ADDRESS'}
                                            fieldName={'address_uno_3'}
                                            ref={input_address}
                                            onSubmitEditing={() => input_telephone.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'Telephone'} />
                                        <InputForm
                                            status={true}
                                            keyboardType='numeric'
                                            returnKeyType={'done'}
                                            placeholder={'PHONE NUMBER'}
                                            fieldName={'phone_uno_3'}
                                            ref={input_telephone}
                                            onSubmitEditing={() => input_supervisor.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'Supervisor Name'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'SUPERVISOR'}
                                            fieldName={'supervisor_uno_3'}
                                            ref={input_supervisor}
                                            onSubmitEditing={() => input_position.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'Title/Position Held'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'TITLE/POSITION HELD'}
                                            fieldName={'position_uno_3'}
                                            ref={input_position}
                                            onSubmitEditing={() => input_average.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'Average Hours Worked Per Week'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'AVERAGE'}
                                            fieldName={'average_uno_3'}
                                            ref={input_average}
                                        />
                                        <TitleForms type={'subtitle'} title={'Starting Date'} />
                                        <DatePicker fieldName={'starting_uno_3'} language={'2'} required={true}/>
                                        <TitleForms type={'subtitle'} title={'Ending Date'} />
                                        <DatePicker fieldName={'ending_uno_3'} language={'2'} required={true}/>
                                        <TitleForms type={'subtitle'} title={'Reason for Leaving'} />
                                        <MultiTextForm
                                            status={true}
                                            placeholder={'REASON FOR LEAVING'}
                                            fieldName={'reason_uno_3'}
                                            isTextArea={true}
                                            required={true}
                                        />
                                        <View style={{marginBottom: 8}}/>
                                        <TitleForms type={'subtitle'} title={'Summary of Experience/Duties Performed'} />
                                        <MultiTextForm
                                            status={true}
                                            placeholder={'SUMMARY OF EXPERIENCE'}
                                            fieldName={'summary_uno_3'}
                                            isTextArea={true}
                                            required={true}
                                        />
                                        <View style={{marginBottom: 8}}/>
                                        {
                                            jobs.map((x,i) =>
                                                x.visible
                                                &&
                                                    <>
                                                        <View style={{flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20, marginBottom: 4}} key={x.id}>
                                                            <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                <Text style={tw`text-base text-[${Blue}] font-bold`}>{`Experience (Optional)`}</Text>
                                                            </View>
                                                            <View style={{width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'flex-end', borderTopEndRadius: 20, borderBottomEndRadius: 20,}}>
                                                                <TouchableOpacity onPress={() => handleHide(x.id)} style={{height: 32, width: 32, backgroundColor: 'rgba(219,62,47,.1)', borderRadius: 25, borderWidth: 1, borderColor: '#DB3E2F', justifyContent: 'center', alignItems: 'center', paddingLeft: isIphone ? 1 : 0}}>
                                                                    <IonIcons name={'trash-can'} size={22} color={'#DB3E2F'} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <TitleForms type={'subtitle'} title={'Company Name'} />
                                                        <InputForm
                                                            status={true}
                                                            placeholder={'COMPANY NAME'}
                                                            fieldName={x.refl_nombre_empresa}
                                                        />
                                                        <TitleForms type={'subtitle'} title={'Address'} />
                                                        <InputForm
                                                            status={true}
                                                            placeholder={'COMPANY ADDRESS'}
                                                            fieldName={x.refl_direccion}
                                                        />
                                                        <TitleForms type={'subtitle'} title={'Telephone'} />
                                                        <InputForm
                                                            status={true}
                                                            keyboardType='numeric'
                                                            returnKeyType={'done'}
                                                            placeholder={'PHONE NUMBER'}
                                                            fieldName={x.refl_telefono}
                                                        />
                                                        <TitleForms type={'subtitle'} title={'Supervisor Name'} />
                                                        <InputForm
                                                            status={true}
                                                            placeholder={'SUPERVISOR'}
                                                            fieldName={x.refl_jefe_directo}
                                                        />
                                                        <TitleForms type={'subtitle'} title={'Title/Position Held'} />
                                                        <InputForm
                                                            status={true}
                                                            placeholder={'TITLE/POSITION HELD'}
                                                            fieldName={x.refl_puesto}
                                                        />
                                                        <TitleForms type={'subtitle'} title={'Average Hours Worked Per Week'} />
                                                        <InputForm
                                                            status={true}
                                                            placeholder={'AVERAGE'}
                                                            fieldName={x.refl_hrs_promedio}
                                                        />
                                                        <TitleForms type={'subtitle'} title={'Starting Date'} />
                                                        <DatePicker fieldName={x.refl_fecha_ingreso} language={'2'} required={false}/>
                                                        <TitleForms type={'subtitle'} title={'Ending Date'} />
                                                        <DatePicker fieldName={x.refl_fecha_salida} language={'2'} required={false}/>
                                                        <TitleForms type={'subtitle'} title={'Reason for Leaving'} />
                                                        <MultiTextForm
                                                            status={true}
                                                            placeholder={'REASON FOR LEAVING'}
                                                            fieldName={x.refl_motivo_salida}
                                                            isTextArea={true}
                                                            required={true}
                                                        />
                                                        <View style={{marginBottom: 8}}/>
                                                        <TitleForms type={'subtitle'} title={'Summary of Experience/Duties Performed'} />
                                                        <MultiTextForm
                                                            status={true}
                                                            placeholder={'SUMMARY OF EXPERIENCE'}
                                                            fieldName={x.refl_actividad}
                                                            isTextArea={true}
                                                            required={true}
                                                        />
                                                        <View style={{marginBottom: 8}}/>
                                                    </>
                                            )
                                        }
                                    </>
                            }
                            <ProgressStepActions language={'2'} handleNext={handleValues} finalStep={true}/>
                        </>
                    :
                        <>
                            <Text>Por definirse el horizontal</Text>
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
    container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c1c1c1',
        marginTop: 20,
        borderRadius: 15
	},
	header: {
		flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
		alignSelf: 'stretch',
        backgroundColor: Blue,
        borderBottomWidth: 1,
        borderColor: '#c1c1c1',
        padding: 10,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15
	},
	body:{
		flex: 3,
		padding: 15,
        alignSelf: 'stretch',
	},
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    }
})