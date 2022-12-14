import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, Alert, BackHandler, TouchableOpacity, Linking} from 'react-native';
import {DatePicker, InputForm, MultiTextForm, Picker, ProgressStepActions, TitleForms} from '../../../../components';
import {ProgressStep} from 'react-native-progress-steps';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useOrientation} from '../../../../hooks';
import {useFormikContext} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {contactEmail, isIphone, live, login, origen, urlJobs} from '../../../../access/requestedData';
import {getCurrentDate} from '../../../../js/dates';
import {Blue} from '../../../../colors/colorsApp';
import tw from 'twrnc'

let currentOne = null;
let currentTwo = null;
let currentTwoLanguages = null;
let all = null;

let keyOne = 'stepOne'
let keyTwo = 'stepTwo'
let keyIdiomas = 'stepTwoIdiomas'

export default ({navigation, language}) => {

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

        currentTwoLanguages = await AsyncStorage.getItem(keyIdiomas) || '[]';
        currentTwoLanguages = JSON.parse(currentTwoLanguages);

        all = {...currentOne, ...currentTwo};
    }

    useEffect(() => {
        getInfo()
    },[])

    const first = {label: 'Select', value: 'SEL'};

    const closeOptions = [
        first,
        {label: 'NO', value: '0'},
        {label: 'YES', value: '1'},
    ]

    const {submitForm, values} = useFormikContext();
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
        if(nombreRelacionUno_4_US === undefined || nombreRelacionUno_4_US === '' || telefonoRelacionUno_4_US === undefined || telefonoRelacionUno_4_US === '' || ocupacionRelacionUno_4_US === undefined || ocupacionRelacionUno_4_US === '' || nombreRelacionDos_4_US === undefined || nombreRelacionDos_4_US === '' || telefonoRelacionDos_4_US === undefined || telefonoRelacionDos_4_US === '' || ocupacionRelacionDos_4_US === undefined || ocupacionRelacionDos_4_US === ''){
            Alerta()
        }
        else {
            let obj_3 = {
                refp_nombre1: nombreRelacionUno_4_US,
                refp_telefono1: telefonoRelacionUno_4_US,
                refp_ocupacion1: ocupacionRelacionUno_4_US,
                refp_nombre2: nombreRelacionDos_4_US,
                refp_telefono2: telefonoRelacionDos_4_US,
                refp_ocupacion2: ocupacionRelacionDos_4_US,
                cand_fecha_creacion: getCurrentDate(),
                cand_origen: origen
            }

            all = {...all, ...obj_3};

            console.log('all: ', all)
            console.log('currentTwoLanguages: ', currentTwoLanguages)
            const body = {
                'action': 'insert_precandidato',
                'data': all,
                'idiomas': currentTwoLanguages.filter(x => x.idioma !== '' && x),
                'login': login,
                'live': live,
                'country': 'US',
            }

            console.log('body: ', body)

            const request = await fetch(urlJobs, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const {response} = await request.json();

            if(response.status === 201){
                setFilters({...filters, error: false})
                await AsyncStorage.removeItem(keyOne);
                await AsyncStorage.removeItem(keyTwo);
                await AsyncStorage.removeItem(keyIdiomas);
                AlertaEmail()
                navigation.navigate('Choose')
            }

            else if(response.status === 400){
                await AsyncStorage.removeItem(keyOne);
                await AsyncStorage.removeItem(keyTwo);
                await AsyncStorage.removeItem(keyIdiomas);

                Alert.alert(
                    language === 1 ? 'Error al envíar su solicitud' : 'Error to send your request',
                    language === 1 ? 'Inténtelo de nuevo más tarde.' : 'Try later, again.',
                    [
                        { text: 'OK'}
                    ]
                )
                navigation.navigate('Choose')
            }

            else if(response.status === 405) {
                console.log('se ejecutó la acción 2 veces pero se guardó solo una vez')
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
            <TouchableOpacity onPress={() => handleAdd(contador + 1)} style={{height: 35, width: 'auto', flexDirection: 'row', backgroundColor: Blue, borderRadius: 25, borderWidth: 1, borderColor: Blue, justifyContent: 'center', alignItems: 'center', paddingLeft: 6, paddingRight: 10}}>
                <IonIcons name={'plus'} size={20} color={'#fff'} />
                <Text style={tw`text-[#fff] font-bold text-sm ml-1`}>Add Experience</Text>
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
                                        />
                                        <TitleForms type={'subtitle'} title={'Address'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'COMPANY ADDRESS'}
                                            fieldName={'address_uno_3'}
                                        />
                                        <TitleForms type={'subtitle'} title={'Telephone'} />
                                        <InputForm
                                            status={true}
                                            keyboardType='number-pad' 
                                            returnKeyType={'done'}
                                            placeholder={'PHONE NUMBER'}
                                            fieldName={'phone_uno_3'}
                                        />
                                        <TitleForms type={'subtitle'} title={'Supervisor Name'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'SUPERVISOR'}
                                            fieldName={'supervisor_uno_3'}
                                        />
                                        <TitleForms type={'subtitle'} title={'Title/Position Held'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'TITLE/POSITION HELD'}
                                            fieldName={'position_uno_3'}
                                        />
                                        <TitleForms type={'subtitle'} title={'Average Hours Worked Per Week'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'AVERAGE'}
                                            fieldName={'average_uno_3'}
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
                                                            keyboardType='number-pad' 
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
                                                        <DatePicker fieldName={x.refl_fecha_ingreso} language={'2'} required={true}/>
                                                        <TitleForms type={'subtitle'} title={'Ending Date'} />
                                                        <DatePicker fieldName={x.refl_fecha_salida} language={'2'} required={true}/>
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