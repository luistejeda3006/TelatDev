import React, {useCallback, useEffect, useState} from 'react';
import {View, StatusBar, SafeAreaView} from 'react-native';
import {HeaderLandscape, HeaderPortrait, FailedNetwork, ProgressStep} from '../../components';
import {StepOneMX, StepTwoMX, StepThreeMX, StepFourMX} from '../Areas/RRHH/CandidatesMX';
import {StepOneUSA, StepTwoUSA, StepThreeUSA} from '../Areas/RRHH/CandidatesUSA';
import {useOrientation, useConnection, useNavigation} from '../../hooks';
import {Formik} from 'formik';
import {barStyle, barStyleBackground, SafeAreaBackground} from '../../colors/colorsApp';
import {useFocusEffect} from '@react-navigation/native';
import * as Yup from 'yup';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {selectStep} from '../../slices/progressStepSlice';

let step = null;
let data = []
export default ({navigation, route: {params: {language, orientation, country}}}) => {
    const dispatch = useDispatch()
    step = useSelector(selectStep)

    const [data, setData] = useState([])
    const required = '*';
    const invalidEmail = country === 'US' ? 'Invalid Email' : language === '1' ? 'Correo Inválido' : 'Invalid Email';
    const invalidNumber = country === 'US' ? 'Invalid Number' : language === '1' ? 'Número Inválido' : 'Invalid Number';
    const invalidYear = country === 'US' ? 'Invalid Year' : language === '1' ? 'Año Inválido' : 'Invalid Year';

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
    


    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            <View style={tw`flex-1 bg-[#fff]`}>
            {
                orientationInfo.initial === 'PORTRAIT'
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
                            desired_position: Yup.string()
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
                            graduated_uno_2: Yup.string()
                            .required(required),
                            certificate_uno_2: Yup.string()
                            .required(required),
                            schedule_uno_2: Yup.string()
                            .required(required),

                            type_school_dos_2: Yup.string()
                            .required(required),
                            school_name_dos_2: Yup.string()
                            .required(required),
                            location_dos_2: Yup.string()
                            .required(required),
                            graduated_dos_2: Yup.string()
                            .required(required),
                            certificate_dos_2: Yup.string()
                            .required(required),
                            schedule_dos_2: Yup.string()
                            .required(required),

                            type_school_tres_2: Yup.string()
                            .required(required),
                            school_name_tres_2: Yup.string()
                            .required(required),
                            location_tres_2: Yup.string()
                            .required(required),
                            graduated_tres_2: Yup.string()
                            .required(required),
                            certificate_tres_2: Yup.string()
                            .required(required),
                            schedule_tres_2: Yup.string()
                            .required(required),
                            
                            type_school_cuatro_2: Yup.string()
                            .required(required),
                            school_name_cuatro_2: Yup.string()
                            .required(required),
                            location_cuatro_2: Yup.string()
                            .required(required),
                            graduated_cuatro_2: Yup.string()
                            .required(required),
                            certificate_cuatro_2: Yup.string()
                            .required(required),
                            schedule_cuatro_2: Yup.string()
                            .required(required),
                            
                            type_school_cinco_2: Yup.string()
                            .required(required),
                            school_name_cinco_2: Yup.string()
                            .required(required),
                            location_cinco_2: Yup.string()
                            .required(required),
                            graduated_cinco_2: Yup.string()
                            .required(required),
                            certificate_cinco_2: Yup.string()
                            .required(required),
                            schedule_cinco_2: Yup.string()
                            .required(required),
                            
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

                            company_dos_3: Yup.string()
                            .required(required),
                            address_dos_3: Yup.string()
                            .required(required),
                            phone_dos_3: Yup.string()
                            .required(required),
                            supervisor_dos_3: Yup.string()
                            .required(required),
                            position_dos_3: Yup.string()
                            .required(required),
                            average_dos_3: Yup.string()
                            .required(required),
                            starting_dos_3: Yup.string()
                            .required(required),
                            ending_dos_3: Yup.string()
                            .required(required),
                            reason_dos_3: Yup.string()
                            .required(required),
                            summary_dos_3: Yup.string()
                            .required(required),

                            company_tres_3: Yup.string()
                            .required(required),
                            address_tres_3: Yup.string()
                            .required(required),
                            phone_tres_3: Yup.string()
                            .required(required),
                            supervisor_tres_3: Yup.string()
                            .required(required),
                            position_tres_3: Yup.string()
                            .required(required),
                            average_tres_3: Yup.string()
                            .required(required),
                            starting_tres_3: Yup.string()
                            .required(required),
                            ending_tres_3: Yup.string()
                            .required(required),
                            reason_tres_3: Yup.string()
                            .required(required),
                            summary_tres_3: Yup.string()
                            .required(required),

                            company_cuatro_3: Yup.string()
                            .required(required),
                            address_cuatro_3: Yup.string()
                            .required(required),
                            phone_cuatro_3: Yup.string()
                            .required(required),
                            supervisor_cuatro_3: Yup.string()
                            .required(required),
                            position_cuatro_3: Yup.string()
                            .required(required),
                            average_cuatro_3: Yup.string()
                            .required(required),
                            starting_cuatro_3: Yup.string()
                            .required(required),
                            ending_cuatro_3: Yup.string()
                            .required(required),
                            reason_cuatro_3: Yup.string()
                            .required(required),
                            summary_cuatro_3: Yup.string()
                            .required(required),

                            company_cinco_3: Yup.string()
                            .required(required),
                            address_cinco_3: Yup.string()
                            .required(required),
                            phone_cinco_3: Yup.string()
                            .required(required),
                            supervisor_cinco_3: Yup.string()
                            .required(required),
                            position_cinco_3: Yup.string()
                            .required(required),
                            average_cinco_3: Yup.string()
                            .required(required),
                            starting_cinco_3: Yup.string()
                            .required(required),
                            ending_cinco_3: Yup.string()
                            .required(required),
                            reason_cinco_3: Yup.string()
                            .required(required),
                            summary_cinco_3: Yup.string()
                            .required(required),
                        })}
                    >
                        {
                            hasConnection
                            ?
                                <ProgressStep data={data}>
                                    {
                                        step === 1
                                        ?
                                            <StepOneUSA navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                                        :
                                            step === 2
                                            ?
                                                <StepTwoUSA navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                                            :
                                                <StepThreeUSA navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                                    }
                                </ProgressStep>
                            :
                                <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
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
                                    {
                                        step === 1
                                        ?
                                            <StepOneMX navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                                        :
                                            step === 2
                                            ?
                                                <StepTwoMX navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                                            :
                                                step === 3
                                                ?
                                                    <StepThreeMX navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                                                :
                                                    <StepFourMX navigation={navigation} language={language} orientation={orientationInfo.initial}/>
                                    }
                                </ProgressStep>
                            :
                                <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                        }
                </Formik>
            }
            </View>
        </>
    );
}