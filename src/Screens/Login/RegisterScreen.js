import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, StatusBar, SafeAreaView, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Image} from 'react-native';
import {HeaderLandscape, HeaderPortrait, FailedNetwork, ProgressStep, Modal, RadioButton, FooterForm} from '../../components';
import {StepOneMX, StepTwoMX, StepThreeMX, StepFourMX} from '../Areas/RRHH/CandidatesMX';
import {StepOneUSA, StepTwoUSA, StepThreeUSA} from '../Areas/RRHH/CandidatesUSA';
import {useConnection, useNavigation} from '../../hooks';
import {Formik} from 'formik';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../colors/colorsApp';
import {useFocusEffect} from '@react-navigation/native';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {selectStep} from '../../slices/progressStepSlice';
import {selectCurriculumUSA, selectSchoolsUSA, selectStatements, selectStatementsVisibility, selectStepOneUSA, selectStepThreeUSA, selectStepTwoUSA, selectSuccessVisibility, setStatements, setStatementsVisibility, setSuccessVisibility} from '../../slices/applicationForm';
import {selectOrientation} from '../../slices/orientationSlice';
import {live, login, urlJobs} from '../../access/requestedData';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {selectLanguageApp} from '../../slices/varSlice';
import tw from 'twrnc';

let step = null;
let data = []
export default ({navigation, route: {params: {country}}}) => {
    const refSteps = useRef()
    const dispatch = useDispatch()
    step = useSelector(selectStep)

    const orientation = useSelector(selectOrientation)
    const language = useSelector(selectLanguageApp)

    const statementsVisibility = useSelector(selectStatementsVisibility)
    const statements = useSelector(selectStatements)
    const successVisibility = useSelector(selectSuccessVisibility)
    const schools = useSelector(selectSchoolsUSA)
    const curriculum = useSelector(selectCurriculumUSA)
    const stepOneInfo = useSelector(selectStepOneUSA)
    const stepTwoInfo = useSelector(selectStepTwoUSA)
    const stepThreeInfo = useSelector(selectStepThreeUSA)

    const [data, setData] = useState([])
    const required = '*';
    const invalidEmail = country === 'US' ? 'Invalid Email' : language === '1' ? 'Correo Inválido' : 'Invalid Email';
    const invalidNumber = country === 'US' ? 'Invalid Number' : language === '1' ? 'Número Inválido' : 'Invalid Number';
    const invalidYear = country === 'US' ? 'Invalid Year' : language === '1' ? 'Año Inválido' : 'Invalid Year';

    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();

    const handleScrollTop = () => {
        refSteps.current?.scrollToPosition(0, 0)
    }

    useFocusEffect(
        useCallback(() => {
            if(country === 'US'){
                setData([
                    {id: 1, title: 'Basic Information'},
                    {id: 2, title: 'Competences and Abilities'},
                    {id: 3, title: 'Employment History'}
                ])
            } else {
                setData([
                    {id: 1, title: language === '1' ? 'Información Básica' : 'Basic Information'},
                    {id: 2, title: language === '1' ? 'Información Personal' : 'Personal Information'},
                    {id: 3, title: language === '1' ? 'Curriculum' : 'Resume'},
                    {id: 4, title: language === '1' ? 'Referencias Personales' : 'Personal References'}
                ])
            }
            handlePath('Choose')
        }, [])
    );
    
    const handleSave = async () => {
        let cand_statement = !statements ? 0 : 1
        let all = {...stepOneInfo, ...stepTwoInfo, ...stepThreeInfo, ...cand_statement}

        const body = {
            action: 'insert_precandidato',
            country: 'US',
            data: {
                info: all,
                curriculum: schools,
                referencias_laborales: curriculum
            },
            live: live,
            login: login
        }

        console.log('body: ', body)
        
        try{
            const request = await fetch(urlJobs, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const {response, status} = await request.json();

            if(status === 200){
                dispatch(setStatementsVisibility(false))
                dispatch(setSuccessVisibility(true))
                setTimeout(() => {
                    dispatch(setSuccessVisibility(false))
                    navigation.navigate('Choose')
                }, 7000)
            }

            else if(status === 400){
                Alert.alert(
                    language === '1' ? 'Error al envíar su solicitud' : 'Error to send your request',
                    language === '1' ? 'Inténtelo de nuevo más tarde.' : 'Try later, again.',
                    [
                        { text: 'OK'}
                    ]
                )
                navigation.navigate('Choose')
            }

            else if(status === 405) {
                console.log('se ejecutó la acción 2 veces pero se guardó solo una vez')
            }
        }catch(e){
            Alert.alert(
                language === '1' ? 'Error de Conexión' : 'Connection Failed',
                language === '1' ? 'Por favor, Verifique su Conexión de Internet' : 'Please, Verify Internet Connection',
                [
                    { text: 'OK'}
                ]
            )
            navigation.navigate('Choose')
        }
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            <View style={tw`flex-1 bg-[#fff]`}>
            {
                orientation === 'PORTRAIT'
                ?
                    <HeaderPortrait title={country === 'US' ? 'Job Application' : language === '1' ? 'Solicitud de Empleo' : 'Job Application'} navigation={navigation} screenToGoBack={'Choose'} visible={true} confirmation={true} currentLanguage={country === 'US' ? '2' : '1'} normal={true}/>
                :
                    <HeaderLandscape title={country === 'US' ? 'Job Application' : language === '1' ? 'Solicitud de Empleo' : 'Job Application'} navigation={navigation} screenToGoBack={'Choose'} visible={true} confirmation={true} currentLanguage={country === 'US' ? '2' : '1'} normal={true}/>
            }
            {
                country === 'US'
                ?
                    <Formik
                        onSubmit={() => {}}
                        initialValues={{}}
                        validationSchema={Yup.object({
                            //PASO 1
                            //Personal Information
                            nombre_1: Yup.string()
                            .required(required),
                            last_1: Yup.string()
                            .required(required),
                            ssn_1: Yup.string()
                            .required(required),
                            email_1: Yup.string()
                            .required(required)
                            .email(invalidEmail),
                            phone_1: Yup.string()
                            .required(required),
                            alt_phone_1: Yup.string(),

                            //Mailing Address
                            street_1: Yup.string()
                            .required(required),
                            city_1: Yup.string()
                            .required(required),
                            state_1: Yup.string()
                            .required(required),
                            zipcode_1: Yup.string()
                            .required(required),
                            
                            //Emergency Contact
                            emer_name_1: Yup.string()
                            .required(required),
                            emer_phone_1: Yup.string()
                            .required(required),
                            id_1: Yup.string()
                            .required(required),
                            id_state_1: Yup.string()
                            .required(required),
                            id_exp_date_1: Yup.date()
                            .required(required),
                            
                            //Position
                            referred_by_1: Yup.string()
                            .required(required),
                            desired_position_1: Yup.string()
                            .required(required),
                            date_available_1: Yup.string()
                            .required(required),
                            willing_work_1: Yup.string()
                            .required(required),
                            
                            //Restrictions
                            list_any_1: Yup.string()
                            .required(required),

                            //Important
                            misdemeanor_1: Yup.string()
                            .required(required),
                            misdemeanor_detail_1: Yup.string()
                            .required(required),
                            adjudication_1: Yup.string()
                            .required(required),
                            adjudication_detail_1: Yup.string()
                            .required(required),

                            //PASO 2

                            diploma_2: Yup.string()
                            .required(required),
                            level_2: Yup.string()
                            .required(required),

                            //School
                            type_school_uno_2: Yup.string()
                            .required(required),
                            school_name_uno_2: Yup.string()
                            .required(required),
                            location_uno_2: Yup.string()
                            .required(required),
                            graduated_uno_2: Yup.string(),
                            certificate_uno_2: Yup.string(),
                            schedule_uno_2: Yup.string(),

                            type_school_dos_2: Yup.string(),
                            school_name_dos_2: Yup.string(),
                            location_dos_2: Yup.string(),
                            graduated_dos_2: Yup.string(),
                            certificate_dos_2: Yup.string(),
                            schedule_dos_2: Yup.string(),

                            type_school_tres_2: Yup.string(),
                            school_name_tres_2: Yup.string(),
                            location_tres_2: Yup.string(),
                            graduated_tres_2: Yup.string(),
                            certificate_tres_2: Yup.string(),
                            schedule_tres_2: Yup.string(),
                            
                            type_school_cuatro_2: Yup.string(),
                            school_name_cuatro_2: Yup.string(),
                            location_cuatro_2: Yup.string(),
                            graduated_cuatro_2: Yup.string(),
                            certificate_cuatro_2: Yup.string(),
                            schedule_cuatro_2: Yup.string(),
                            
                            type_school_cinco_2: Yup.string(),
                            school_name_cinco_2: Yup.string(),
                            location_cinco_2: Yup.string(),
                            graduated_cinco_2: Yup.string(),
                            certificate_cinco_2: Yup.string(),
                            schedule_cinco_2: Yup.string(),
                            
                            //Qualifications
                            qualifications_2: Yup.string()
                            .required(required),
                            
                            //Scores
                            english_proficiency_2: Yup.string()
                            .required(required),
                            spanish_proficiency_2: Yup.string()
                            .required(required),
                            
                            //PASO 3
                            
                            //Experience
                            any_experience_3: Yup.string()
                            .required(required),

                            //Work Experience
                            
                            company_uno_3: Yup.string()
                            .required(required),
                            address_uno_3: Yup.string()
                            .required(required),
                            phone_uno_3: Yup.string()
                            .required(required),
                            supervisor_uno_3: Yup.string()
                            .required(required),
                            position_uno_3: Yup.string()
                            .required(required),
                            average_uno_3: Yup.string()
                            .required(required),
                            starting_uno_3: Yup.string()
                            .required(required),
                            ending_uno_3: Yup.string()
                            .required(required),
                            reason_uno_3: Yup.string()
                            .required(required),
                            summary_uno_3: Yup.string()
                            .required(required),

                            company_dos_3: Yup.string(),
                            address_dos_3: Yup.string(),
                            phone_dos_3: Yup.string(),
                            supervisor_dos_3: Yup.string(),
                            position_dos_3: Yup.string(),
                            average_dos_3: Yup.string(),
                            starting_dos_3: Yup.string(),
                            ending_dos_3: Yup.string(),
                            reason_dos_3: Yup.string(),
                            summary_dos_3: Yup.string(),

                            company_tres_3: Yup.string(),
                            address_tres_3: Yup.string(),
                            phone_tres_3: Yup.string(),
                            supervisor_tres_3: Yup.string(),
                            position_tres_3: Yup.string(),
                            average_tres_3: Yup.string(),
                            starting_tres_3: Yup.string(),
                            ending_tres_3: Yup.string(),
                            reason_tres_3: Yup.string(),
                            summary_tres_3: Yup.string(),

                            company_cuatro_3: Yup.string(),
                            address_cuatro_3: Yup.string(),
                            phone_cuatro_3: Yup.string(),
                            supervisor_cuatro_3: Yup.string(),
                            position_cuatro_3: Yup.string(),
                            average_cuatro_3: Yup.string(),
                            starting_cuatro_3: Yup.string(),
                            ending_cuatro_3: Yup.string(),
                            reason_cuatro_3: Yup.string(),
                            summary_cuatro_3: Yup.string(),

                            company_cinco_3: Yup.string(),
                            address_cinco_3: Yup.string(),
                            phone_cinco_3: Yup.string(),
                            supervisor_cinco_3: Yup.string(),
                            position_cinco_3: Yup.string(),
                            average_cinco_3: Yup.string(),
                            starting_cinco_3: Yup.string(),
                            ending_cinco_3: Yup.string(),
                            reason_cinco_3: Yup.string(),
                            summary_cinco_3: Yup.string(),

                            temporal: Yup.string()
                            .required(required)
                        })}
                    >
                        {
                            hasConnection
                            ?
                                <ProgressStep data={data}>
                                    <KeyboardAwareScrollView
                                        ref={refSteps}
                                        contentContainerStyle={styles.scrollContainer}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                    {
                                        step === 1
                                        ?
                                            <StepOneUSA navigation={navigation} language={language} orientation={orientation} handleScrollTop={handleScrollTop}/>
                                        :
                                            step === 2
                                            ?
                                                <StepTwoUSA navigation={navigation} language={language} orientation={orientation} handleScrollTop={handleScrollTop}/>
                                            :
                                                <StepThreeUSA navigation={navigation} language={language} orientation={orientation} handleScrollTop={handleScrollTop}/>
                                    }
                                    <FooterForm country={'US'}/>
                                    </KeyboardAwareScrollView>
                                </ProgressStep>
                            :
                                <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientation}/>
                        }

                    </Formik>
                :
                    <Formik
                        onSubmit={() => {}}
                        initialValues={{}}
                        validationSchema={Yup.object({
                            //Campos primer paso
                            nombres_1: Yup.string()
                            .required(required),
                            apellidoPaterno_1: Yup.string()
                            .required(required),
                            apellidoMaterno_1: Yup.string()
                            .required(required),
                            fechaNacimiento_1: Yup.date()
                            .required(required),
                            genero_1: Yup.string()
                            .required(required),
                            lugarNacimiento_1: Yup.string()
                            .required(required),

                            //Campos segundo paso datos generales
                            puestoSolicitado_2: Yup.string()
                            .required(required),
                            salario_2: Yup.string()
                            .required(required),
                            experiencia_2: Yup.string()
                            .required(required),
                            disponibilidadTurno_2: Yup.string()
                            .required(required),
                            actualmenteTrabaja_2: Yup.string()
                            .required(required),
                            horarioLaboral_2: Yup.string()
                            .required(required),
                            medioReclutamiento_2: Yup.string()
                            .required(required),
                            medioReclutamientoDesc_2: Yup.string()
                            .required(required),
                            trabajoTelat_2: Yup.string()
                            .required(required),
                            cuandoTrabajo_2: Yup.string()
                            .required(required),
                            motivosSalida_2: Yup.string()
                            .required(required),
                            lugarNacimientoExtranjero_2: Yup.string()
                            .required(required),
                            nacionalidadExtranjero_2: Yup.string()
                            .required(required),
                            tiempoMexicoExtranjero_2: Yup.string()
                            .required(required),
                            motivosSalida_2: Yup.string()
                            .required(required),
                            estadocv_2: Yup.string()
                            .required(required),
                            numeroHijos_2: Yup.string()
                            .required(required),
                            dependientesEconomicos_2: Yup.string()
                            .required(required),
                            tipoTransporte_2: Yup.string()
                            .required(required),
                            vivisteExtranjero_2: Yup.string()
                            .required(required),
                            lugarExtranjero_2: Yup.string()
                            .required(required),
                            tiempoExtranjero_2: Yup.string()
                            .required(required),
                            motivoRegresoExtranjero_2: Yup.string()
                            .required(required),
                            calle_2: Yup.string()
                            .required(required),
                            numeroExterior_2: Yup.string()
                            .required(required),
                            numeroInterior_2: Yup.string(),
                            codigoPostal_2: Yup.string()
                            .required(required),
                            colonia_2: Yup.string()
                            .required(required),
                            ciudad_2: Yup.string()
                            .required(required),
                            estado_2: Yup.string()
                            .required(required),
                            calle_uno_2: Yup.string(),
                            calle_dos_2: Yup.string(),
                            email_2: Yup.string()
                            .email(invalidEmail)
                            .required(required),
                            numeroPersonal_2: Yup.string()
                            .required(required)
                            .max(10, invalidNumber)
                            .min(10, invalidNumber),
                            numeroFijo_2: Yup.string()
                            .max(10, invalidNumber)
                            .min(10, invalidNumber),
                            tipoDocumento_2: Yup.string()
                            .required(required),
                            numeroDocumento_2: Yup.string()
                            .max(10, invalidNumber)
                            .min(10, invalidNumber)
                            .required(required),
                            emision_2: Yup.string()
                            .required(required),
                            expiracion_2: Yup.string()
                            .required(required),

                            //Campos tercer paso
                            nivelEscolar_3: Yup.string()
                            .required(required),
                            esCertificado_3: Yup.string()
                            .required(required),
                            gradoAvance_3: Yup.string(),
                            tituloAcademico_3: Yup.string(),
                            institucion_3: Yup.string(),
                            añoGraduacion_3: Yup.string()
                            .max(4, invalidYear),
                            estudiasActualmente_3: Yup.string(),
                            horarioTurno_3: Yup.string(),
                            otrosEstudios_3: Yup.string(),
                            paquetesComputacionales_3: Yup.string(),
                            nivelEscritura_3: Yup.string()
                            .required(required),
                            nivelLectura_3: Yup.string()
                            .required(required),
                            nivelComprension_3: Yup.string()
                            .required(required),
                            nivelConversacional_3: Yup.string(),
                            dondeAprendio_3: Yup.string()
                            .required(required),
                            primerEmpleo_3: Yup.string()
                            .required(required),
                            nombreEmpresa_3: Yup.string()
                            .required(required),
                            giroEmpresa_3: Yup.string()
                            .required(required),
                            puestoDesempeñado_3: Yup.string()
                            .required(required),
                            salarioInicial_3: Yup.string()
                            .required(required),
                            salarioFinal_3: Yup.string()
                            .required(required),
                            fechaIngreso_3: Yup.string()
                            .required(required),
                            fechaSalida_3: Yup.string()
                            .required(required),
                            motivoSalida_3: Yup.string()
                            .required(required),
                            jefeDirecto_3: Yup.string()
                            .required(required),
                            jefeDirectoTelefono_3: Yup.string()
                            .max(10, invalidNumber)
                            .min(10, invalidNumber),
                            contactar_3: Yup.string()
                            .required(required),
                            porque_3: Yup.string()
                            .required(required),
                            expiracion_3: Yup.string()
                            .required(required),

                            nombreEmpresaOpcional_3: Yup.string(),
                            giroEmpresaOpcional_3: Yup.string(),
                            puestoDesempeñadoOpcional_3: Yup.string(),
                            salarioInicialOpcional_3: Yup.string(),
                            salarioFinalOpcional_3: Yup.string(),
                            fechaIngresoOpcional_3: Yup.string(),
                            fechaSalidaOpcional_3: Yup.string(),
                            motivoSalidaOpcional_3: Yup.string(),
                            jefeDirectoOpcional_3: Yup.string(),
                            jefeDirectoTelefonoOpcional_3: Yup.string()
                            .max(10, invalidNumber)
                            .min(10, invalidNumber),
                            contactarOpcional_3: Yup.string(),
                            porqueOpcional_3: Yup.string(),


                            //Campos cuarto paso
                            nombreRelacion_1: Yup.string()
                            .required(required),
                            ocupacionRelacion_1: Yup.string()
                            .required(required),
                            relacion_1: Yup.string()
                            .required(required),
                            telefonoRelacion_1: Yup.string()
                            .required(required)
                            .max(10, invalidNumber)
                            .min(10, invalidNumber),
                            nombreRelacion_2: Yup.string()
                            .required(required),
                            ocupacionRelacion_2: Yup.string()
                            .required(required),
                            relacion_2: Yup.string()
                            .required(required),
                            telefonoRelacion_2: Yup.string()
                            .required(required)
                            .max(10, invalidNumber)
                            .min(10, invalidNumber),
                            
                            //para inicio de sesion
                            username: Yup.string()
                            .required(required),
                        })}>
                        
                        {
                            hasConnection
                            ?
                                <ProgressStep data={data}>
                                    <KeyboardAwareScrollView
                                        ref={refSteps}
                                        contentContainerStyle={styles.scrollContainer}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                    {
                                        step === 1
                                        ?
                                            <StepOneMX navigation={navigation} language={language} orientation={orientation} handleScrollTop={handleScrollTop}/>
                                        :
                                            step === 2
                                            ?
                                                <StepTwoMX navigation={navigation} language={language} orientation={orientation} handleScrollTop={handleScrollTop}/>
                                            :
                                                step === 3
                                                ?
                                                    <StepThreeMX navigation={navigation} language={language} orientation={orientation} handleScrollTop={handleScrollTop}/>
                                                :
                                                    <StepFourMX navigation={navigation} language={language} orientation={orientation} handleScrollTop={handleScrollTop}/>
                                    }
                                    <FooterForm country={language === '1' ? 'MX' : 'US'}/>
                                    </KeyboardAwareScrollView>
                                </ProgressStep>
                            :
                                <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientation}/>
                        }
                </Formik>
            }

            <Modal visibility={statementsVisibility} orientation={orientation}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={tw`h-auto self-stretch px-4`}>
                    <View style={tw`h-auto self-stretch justify-start items-center`}>
                        <Text style={tw`text-[${Blue}] font-bold text-xl`}>Statements</Text>
                    </View>
                    <View style={tw`h-auto self-stretch items-start justify-center text-justify mt-1.5 mb-2`}>
                        <Text style={tw`text-sm text-[#000] font-bold text-justify`}>Please read the following statements carefully. By signing this application, you indicate your understanding and acceptance of the following:</Text>
                    </View>
                    <View style={tw`h-auto self-stretch items-start justify-center text-justify pt-2.5 mb-1.5 border-b border-b-[#dadada] border-t border-t-[#dadada]`}>
                        <Text style={tw`text-xs text-[#000] text-justify`}><Text style={tw`font-bold`}>1. </Text>I authorize any of the persons or organizations referenced in this application to provide <Text style={tw`font-bold text-[${Blue}]`}>DataXport.Net</Text>, LLC any and all information concerning my previous employment, education, or any other information, personal or otherwise, with regards to any of the subjects covered by this application, and I hereby release all such parties from all liability from any damages which may result from furnishing such information.
I certify that all the information provided by me in connection with my application, whether on this document or provided separately, is true and complete, and I understand that any misstatement or falsification of information may be grounds for refusal to hire, or if hired, termination.</Text>
                    </View>
                    <View style={tw`h-auto self-stretch items-start justify-center text-justify py-2.5 border-b border-b-[#dadada]`}>
                        <Text style={tw`text-xs text-[#000] text-justify`}><Text style={tw`font-bold`}>2. </Text>I understand that as a condition of employment, I will be required to provide legal proof of authorization to work in the United States. If I am offered employment at DataXport, I MUST provide these documents on or before my first day of employment. Documents must be on USCIS's list of acceptable documents for establishing identity and employment authorization. Expired documents will NOT be accepted. The most common documents • A valid U.S. passport, U.S. passport card, or permanent resident card; OR • A valid photo ID AND one of the following: Social Security Card, birth certificate, or employment authorization document issued by the Department of Homeland Security.</Text>
                    </View>
                    <View style={tw`h-auto self-stretch items-start justify-center text-justify py-2.5 border-b border-b-[#dadada]`}>
                        <Text style={tw`text-xs text-[#000] text-justify`}><Text style={tw`font-bold`}>3. </Text>I authorize any of the persons or organizations referenced in this application to provide <Text style={tw`font-bold text-[${Blue}]`}>DataXport.Net</Text>, LLC any and all information concerning my previous employment, education, or any other information, personal or otherwise, with regards to any of the subjects covered by this application, and I hereby release all such parties from all liability from any damages which may result from furnishing such information.</Text>
                    </View>
                    <View style={tw`h-auto self-stretch items-start justify-center text-justify py-2.5 border-b border-b-[#dadada]`}>
                        <Text style={tw`text-xs text-[#000] text-justify`}><Text style={tw`font-bold`}>4. </Text>I understand that given the nature of work at DataXport and in order to be considered for employment, I will be responsible for obtaining a pre-employment background check and drug test at my expense. I understand that by signing below, I give consent to DataXport to request my full criminal background information from the Texas Department of Public Safety if necessary.</Text>
                    </View>
                    <View style={tw`h-auto self-stretch items-start justify-center text-justify py-2.5 border-b border-b-[#dadada]`}>
                        <Text style={tw`text-xs text-[#000] text-justify`}><Text style={tw`font-bold`}>5. </Text>I understand that I may need to provide additional documentation in order to be considered for certain positions, such as a valid driver license and driving record, or applicable certifications.</Text>
                    </View>
                    <View style={tw`h-auto self-stretch items-start justify-center text-justify py-2.5 border-b border-b-[#dadada] mt-1.5`}>
                        <Text style={tw`text-xs text-[#000] text-justify`}>I am aware of the statements above and I agree with them.</Text>
                        <View style={tw`h-1.5`}/>
                        <RadioButton 
                            legend={'NO'}
                            checked={!statements ? true : false}
                            width={0}
                            handleCheck={() => dispatch(setStatements(false))}
                        />
                        <View style={tw`h-1.5`}/>
                        <RadioButton 
                            legend={'YES'}
                            checked={!statements ? false : true}
                            width={0}
                            handleCheck={() => dispatch(setStatements(true))}
                        />
                        <View style={tw`h-2`}/>
                    </View>
                    <View style={tw`h-12.5 flex-row items-center justify-end`}>
                        <TouchableOpacity style={tw`px-3 py-2 border border-[#dadada] rounded bg-[#6C757D]`} onPress={() => dispatch(setStatementsVisibility(false))}>
                            <Text style={tw`text-[#fff] font-bold`}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={tw`w-3`}/>
                        <TouchableOpacity style={tw`px-3 py-2 border border-[#dadada] rounded bg-[${Blue}]`} onPress={handleSave}>
                            <Text style={tw`text-[#fff] font-bold`}>Submit Application</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </Modal>

            <Modal orientation={orientation} visibility={successVisibility} handleDismiss={() => {}}>
                <View style={tw`h-auto self-stretch justify-center items-center`}>
                    <Image
                        style={tw`w-70 h-20`}
                        resizeMode='stretch'
                        source={{uri: 'https://telat.us/assets/img/dx-logo.png'}}
                    />
                </View>
                <View style={tw`h-auto self-stretch justify-center items-center py-2.5`}>
                    <Text style={tw`text-lg text-[${Blue}] font-bold`}>Successful Registration</Text>
                    <Text style={tw`text-sm text-[#000] mt-2`}>Thank you for your information.</Text>
                    <Text style={tw`text-sm text-[#000]`}>Your application has been successfully sent!</Text>
                </View>
                <View style={tw`justify-center items-center self-stretch h-auto mt-3`}>
                    <Image
                        style={tw`w-25 h-25`}
                        resizeMode='stretch'
                        source={require('../../../assets/correct.gif')}
                    />
                </View>
                <View style={tw`h-auto justify-center items-center mt-6`}>
                    <Text style={tw`text-sm text-center text-black`}>Please be aware of your phone and email, we'll be contacting you soon to follow up with your application.</Text>
                    <Text style={tw`text-sm text-center text-black mt-2.5`}>{'For more information contact us:\n'} <Text style={tw`font-bold`}>talent@telat-group.com</Text></Text>
                </View>
            </Modal>

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow:1,
    }
})