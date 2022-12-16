import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Alert, Text, TouchableOpacity, BackHandler} from 'react-native';
import {InputForm, Picker, TitleForms, ProgressStepActions, MultiTextForm} from '../../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';
import {useOrientation} from '../../../../hooks';
import {useFormikContext} from 'formik';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Blue} from '../../../../colors/colorsApp';
import {isIphone} from '../../../../access/requestedData';
import {useDispatch, useSelector} from 'react-redux';
import {selectStep, setStep} from '../../../../slices/progressStepSlice';
import {setSchoolsUSA, setStepTwoUSA} from '../../../../slices/applicationForm';
import tw from 'twrnc'

export default ({navigation, language, orientation}) => {
    const {isTablet} = DeviceInfo;
    const dispatch = useDispatch()
    const step = useSelector(selectStep)

    const {submitForm, values} = useFormikContext();

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
            curr_nivel_estudio: 'type_school_dos_2',
            curr_institucion: 'school_name_dos_2',
            curr_ubicacion: 'location_dos_2',
            curr_certificado: 'certificate_dos_2',
            curr_titulo: 'graduated_dos_2',
            curr_horario: 'schedule_dos_2',
            visible: false,
        },
        {
            id: 3,
            curr_nivel_estudio: 'type_school_tres_2',
            curr_institucion: 'school_name_tres_2',
            curr_ubicacion: 'location_tres_2',
            curr_certificado: 'certificate_tres_2',
            curr_titulo: 'graduated_tres_2',
            curr_horario: 'schedule_tres_2',
            visible: false,
        },
        {
            id: 4,
            curr_nivel_estudio: 'type_school_cuatro_2',
            curr_institucion: 'school_name_cuatro_2',
            curr_ubicacion: 'location_cuatro_2',
            curr_certificado: 'certificate_cuatro_2',
            curr_titulo: 'graduated_cuatro_2',
            curr_horario: 'schedule_cuatro_2',
            visible: false,
        },
        {
            id: 5,
            curr_nivel_estudio: 'type_school_cinco_2',
            curr_institucion: 'school_name_cinco_2',
            curr_ubicacion: 'location_cinco_2',
            curr_certificado: 'certificate_cinco_2',
            curr_titulo: 'graduated_cinco_2',
            curr_horario: 'schedule_cinco_2',
            visible: false,
        },
    ])

    const [filters, setFilters] = useState({
        error: true,
        pEmpleo: false,
        contador: 1,
    });

    const {
        diploma_2,
        level_2,

        type_school_uno_2,
        school_name_uno_2,
        location_uno_2,
        graduated_uno_2,
        certificate_uno_2,
        schedule_uno_2,

        type_school_dos_2,
        school_name_dos_2,
        location_dos_2,
        graduated_dos_2,
        certificate_dos_2,
        schedule_dos_2,

        type_school_tres_2,
        school_name_tres_2,
        location_tres_2,
        graduated_tres_2,
        certificate_tres_2,
        schedule_tres_2,

        type_school_cuatro_2,
        school_name_cuatro_2,
        location_cuatro_2,
        graduated_cuatro_2,
        certificate_cuatro_2,
        schedule_cuatro_2,

        type_school_cinco_2,
        school_name_cinco_2,
        location_cinco_2,
        graduated_cinco_2,
        certificate_cinco_2,
        schedule_cinco_2,

        qualifications_2,
        english_proficiency_2,
        spanish_proficiency_2,

    } = values;

    const {pEmpleo, contador} = filters;

    const handleValues = async () => {
        if(diploma_2 === '' || diploma_2 === undefined || level_2 === '' || level_2 === undefined || type_school_uno_2 === 'SEL' || type_school_uno_2 === undefined || school_name_uno_2 === '' || school_name_uno_2 === undefined || location_uno_2 === '' || location_uno_2 === undefined || graduated_uno_2 === 'SEL' || graduated_uno_2 === undefined || certificate_uno_2 === '' || certificate_uno_2 === undefined || schedule_uno_2 === '' || schedule_uno_2 === undefined || qualifications_2 === '' || qualifications_2 === undefined || english_proficiency_2 === 'SEL' || english_proficiency_2 === undefined || spanish_proficiency_2 === 'SEL' || spanish_proficiency_2 === undefined){
            Alerta()
        } else {
            let key = 'stepTwo'
            let keySchools = 'stepTwoSchools'
            let schools = [
                {
                    curr_nivel_estudio: type_school_uno_2,
                    curr_institucion: school_name_uno_2,
                    curr_ubicacion: location_uno_2,
                    curr_certificado: graduated_uno_2,
                    curr_titulo: certificate_uno_2,
                    curr_horario: schedule_uno_2,
                },
                {
                    curr_nivel_estudio: (type_school_dos_2 === 'SEL' || type_school_dos_2 === undefined) ? '' : type_school_dos_2,
                    curr_institucion: (school_name_dos_2 === '' || school_name_dos_2 === undefined) ? '' : school_name_dos_2,
                    curr_ubicacion: (location_dos_2 === '' || location_dos_2 === undefined) ? '' : location_dos_2,
                    curr_certificado: (graduated_dos_2 === 'SEL' || graduated_dos_2 === undefined) ? '' : graduated_dos_2,
                    curr_titulo: (certificate_dos_2 === '' || certificate_dos_2 === undefined) ? '' : certificate_dos_2,
                    curr_horario: (schedule_dos_2 === '' || schedule_dos_2 === undefined) ? '' : schedule_dos_2,
                },
                {
                    curr_nivel_estudio: (type_school_tres_2 === 'SEL' || type_school_tres_2 === undefined) ? '' : type_school_tres_2,
                    curr_institucion: (school_name_tres_2 === '' || school_name_tres_2 === undefined) ? '' : school_name_tres_2,
                    curr_ubicacion: (location_tres_2 === '' || location_tres_2 === undefined) ? '' : location_tres_2,
                    curr_certificado: (graduated_tres_2 === 'SEL' || graduated_tres_2 === undefined) ? '' : graduated_tres_2,
                    curr_titulo: (certificate_tres_2 === '' || certificate_tres_2 === undefined) ? '' : certificate_tres_2,
                    curr_horario: (schedule_tres_2 === '' || schedule_tres_2 === undefined) ? '' : schedule_tres_2,
                },
                {
                    curr_nivel_estudio: (type_school_cuatro_2 === 'SEL' || type_school_cuatro_2 === undefined) ? '' : type_school_cuatro_2,
                    curr_institucion: (school_name_cuatro_2 === '' || school_name_cuatro_2 === undefined) ? '' : school_name_cuatro_2,
                    curr_ubicacion: (location_cuatro_2 === '' || location_cuatro_2 === undefined) ? '' : location_cuatro_2,
                    curr_certificado: (graduated_cuatro_2 === 'SEL' || graduated_cuatro_2 === undefined) ? '' : graduated_cuatro_2,
                    curr_titulo: (certificate_cuatro_2 === '' || certificate_cuatro_2 === undefined) ? '' : certificate_cuatro_2,
                    curr_horario: (schedule_cuatro_2 === '' || schedule_cuatro_2 === undefined) ? '' : schedule_cuatro_2,
                },
                {
                    curr_nivel_estudio: (type_school_cinco_2 === 'SEL' || type_school_cinco_2 === undefined) ? '' : type_school_cinco_2,
                    curr_institucion: (school_name_cinco_2 === '' || school_name_cinco_2 === undefined) ? '' : school_name_cinco_2,
                    curr_ubicacion: (location_cinco_2 === '' || location_cinco_2 === undefined) ? '' : location_cinco_2,
                    curr_certificado: (graduated_cinco_2 === 'SEL' || graduated_cinco_2 === undefined) ? '' : graduated_cinco_2,
                    curr_titulo: (certificate_cinco_2 === '' || certificate_cinco_2 === undefined) ? '' : certificate_cinco_2,
                    curr_horario: (schedule_cinco_2 === '' || schedule_cinco_2 === undefined) ? '' : schedule_cinco_2,
                },
            ]
    
            const newSchools = schools.filter(x => (x.curr_nivel_estudio !== '' && x.curr_institucion !== '' && x.curr_ubicacion !== '' && x.curr_certificado !== '' && x.curr_titulo !== '' && x.curr_horario !== '') && x)
            
            let obj_2 = {
                cand_certificaciones: diploma_2,
                cand_mayor_nivel: level_2,
                curr_pkg_computo: qualifications_2,
                eva_ingles: english_proficiency_2,
                eva_espanol: spanish_proficiency_2
            }

            dispatch(setStepTwoUSA(obj_2))
            dispatch(setSchoolsUSA(newSchools))
            dispatch(setStep(step + 1))
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

                                <TitleForms type={'title'} title={'Schools'} Item={Item}/>
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
                                    placeholder={'TYPE OF DEGREE OR CERTIFICATE'}
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
                                                <View style={{flexDirection: 'row', borderTopStartRadius: 20, borderBottomStartRadius: 20, marginBottom: 4}} key={x.id}>
                                                    <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
                                                        <Text style={tw`text-base text-[${Blue}] font-bold`}>{`School (Optional)`}</Text>
                                                    </View>
                                                    <View style={{width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'flex-end', borderTopEndRadius: 20, borderBottomEndRadius: 20,}}>
                                                        <TouchableOpacity onPress={() => handleHide(x.id)} style={{height: 32, width: 32, backgroundColor: 'rgba(219,62,47,.1)', borderRadius: 25, borderWidth: 1, borderColor: '#DB3E2F', justifyContent: 'center', alignItems: 'center', paddingLeft: isIphone ? 1 : 0}}>
                                                            <IonIcons name={'trash-can'} size={22} color={'#DB3E2F'} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <TitleForms type={'subtitle'} title={'Type Of School'} />
                                                <Picker
                                                    fieldName={x.curr_nivel_estudio}
                                                    items={schoolOptions}
                                                    required={false}
                                                />
                                                <TitleForms type={'subtitle'} title={'School Name'} />
                                                <InputForm
                                                    status={true}
                                                    fieldName={x.curr_institucion}
                                                    placeholder={'SCHOOL NAME'}
                                                />
                                                <TitleForms type={'subtitle'} title={'Location'} />
                                                <InputForm
                                                    status={true} 
                                                    fieldName={x.curr_ubicacion}
                                                    placeholder={'LOCATION'}
                                                />
                                                <TitleForms type={'subtitle'} title={'Graduated'} />
                                                <Picker
                                                    fieldName={x.curr_titulo}
                                                    items={closeOptions}
                                                    required={false}
                                                />
                                                <TitleForms type={'subtitle'} title={'Type Of Degree Or Certificate'} />
                                                <InputForm
                                                    status={true}
                                                    fieldName={x.curr_certificado}
                                                    placeholder={'TYPE OF DEGREE OR CERTIFICATE'}
                                                />
                                                <TitleForms type={'subtitle'} title={'Provide Schedule (If Current Student)'} />
                                                <InputForm
                                                    status={true}
                                                    fieldName={x.curr_horario}
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
                                <TitleForms type={'subtitle'} title={'English Proficiency'} />
                                <Picker
                                    fieldName={'english_proficiency_2'}
                                    items={proficiencyOptions}
                                />
                                <TitleForms type={'subtitle'} title={'Spanish Proficiency'} />
                                <Picker
                                    fieldName={'spanish_proficiency_2'}
                                    items={proficiencyOptions}
                                />
                                <ProgressStepActions language={'2'} handleNext={handleValues} type={2}/>
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