import React, {useCallback, useEffect, useState} from 'react';
import {View, StatusBar, SafeAreaView} from 'react-native';
import {HeaderLandscape, HeaderPortrait, FailedNetwork} from '../../components';
import {ProgressSteps} from 'react-native-progress-steps';
import {StepOneMX, StepTwoMX, StepThreeMX, StepFourMX} from '../Areas/RRHH/CandidatesMX';
import {StepOneUSA, StepTwoUSA, StepThreeUSA} from '../Areas/RRHH/CandidatesUSA';
import {useOrientation, useConnection, useNavigation} from '../../hooks';
import {Formik} from 'formik';
import {barStyle, barStyleBackground, SafeAreaBackground} from '../../colors/colorsApp';
import {useFocusEffect} from '@react-navigation/native';
import * as Yup from 'yup';
import tw from 'twrnc';

export default ({navigation, route: {params: {language, orientation, country}}}) => {
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
            handlePath('Choose')
        }, [])
    );

    useEffect(() => {
        askForConnection()
    },[])

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
                            //paso 1 USA
                            nombre_1_US: Yup.string()
                            .required(required),
                            lastName_1_US: Yup.string()
                            .required(required),
                            email_1_US: Yup.string()
                            .email(invalidEmail)
                            .required(required),
                            phone_number_1_US: Yup.string()
                            .required(required),
                            home_number_1_US: Yup.string(),
                            address_1_US: Yup.string()
                            .required(required),
                            city_1_US: Yup.string()
                            .required(required),
                            state_1_US: Yup.string()
                            .required(required),
                            zip_1_US: Yup.string()
                            .required(required),
                            position_1_US: Yup.string()
                            .required(required),
                            recruitment_1_US: Yup.string()
                            .required(required),
                            recruitmentDesc_1_US: Yup.string()
                            .required(required),
                            job_board_1_USA: Yup.string()
                            .required(required),
                            social_media_1_USA: Yup.string()
                            .required(required),
                            referred_1_USA: Yup.string()
                            .required(required),
                            other_1_USA: Yup.string()
                            .required(required),
                            Is18_1_US: Yup.string()
                            .required(required),

                            salary_1_US: Yup.string()
                            .required(required),
                            
                            legally_1_US: Yup.string()
                            .required(required),
                            
                            //paso 3
                            languageUno_3_US: Yup.string()
                            .required(required),
                            languageDos_3_US: Yup.string()
                            .required(required),
                            languageTres_3_US: Yup.string()
                            .required(required),
                            languageCuatro_3_US: Yup.string()
                            .required(required),
                            languageCinco_3_US: Yup.string()
                            .required(required),
                            
                            levelComputer_3_US: Yup.string()
                            .required(required),
                            familiarPrograms_3_US: Yup.string()
                            .required(required),
                            workExperience_3_US: Yup.string()
                            .required(required),

                            nombreEmpresa_3_US: Yup.string()
                            .required(required),
                            giroEmpresa_3_US: Yup.string()
                            .required(required),
                            puestoDesempeñado_3_US: Yup.string()
                            .required(required),
                            fechaIngreso_3_US: Yup.string()
                            .required(required),
                            fechaSalida_3_US: Yup.string()
                            .required(required),
                            activities_3_US: Yup.string()
                            .required(required),

                            nombreEmpresaOpcional_3_US:Yup.string(),
                            giroEmpresaOpcional_3_US: Yup.string(),
                            puestoDesempeñadoOpcional_3_US: Yup.string(),
                            fechaIngresoOpcional_3_US: Yup.string(),
                            fechaSalidaOpcional_3_US: Yup.string(),
                            activitiesOpcional_3_US: Yup.string(),

                            nombreRelacionUno_4_US: Yup.string()
                            .required(required),
                            telefonoRelacionUno_4_US: Yup.string()
                            .required(required),
                            ocupacionRelacionUno_4_US: Yup.string()
                            .required(required),

                            nombreRelacionDos_4_US: Yup.string()
                            .required(required),
                            telefonoRelacionDos_4_US: Yup.string()
                            .required(required),
                            ocupacionRelacionDos_4_US: Yup.string()
                            .required(required),
                        })}
                    >
                        {
                            hasConnection
                            ?
                                <View style={tw`flex-1 px-2`}>
                                    <ProgressSteps
                                        labelFontSize={11}
                                        activeStepIconBorderColor={'#3283C5'}
                                        activeLabelColor={'#3283C5'}
                                        completedProgressBarColor={'#3283C5'}
                                        completedStepIconColor={'#3283C5'}
                                        activeStepNumColor={'#3283C5'}
                                        completedLabelColor={'#3283C5'}
                                        topOffset={15}
                                        marginBottom={30}
                                        scrollable={true}>
                                            <StepOneUSA navigation={navigation} label={orientationInfo.initial === 'PORTRAIT' ? 'Basic Info.' : 'Basic Information'} language={language} orientation={orientationInfo.initial}/>
                                            {/* <StepTwoUSA navigation={navigation} label={orientationInfo.initial === 'PORTRAIT' ? 'Employment Info.' : 'Employment Information'} language={language} orientation={orientationInfo.initial}/> */}
                                            <StepTwoUSA navigation={navigation} label={orientationInfo.initial === 'PORTRAIT' ? 'Competences Abilities' : 'Competences Abilities'} language={language} orientation={orientationInfo.initial}/>
                                            <StepThreeUSA navigation={navigation} label={orientationInfo.initial === 'PORTRAIT' ? 'References Info.' : 'References Information'} language={language} orientation={orientationInfo.initial}/>
                                    </ProgressSteps>
                                </View>
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
                                <View style={tw`flex-1 px-2`}>
                                    <ProgressSteps
                                        labelFontSize={11}
                                        activeStepIconBorderColor={'#3283C5'}
                                        activeLabelColor={'#3283C5'}
                                        completedProgressBarColor={'#3283C5'}
                                        completedStepIconColor={'#3283C5'}
                                        activeStepNumColor={'#3283C5'}
                                        completedLabelColor={'#3283C5'}
                                        topOffset={15}
                                        marginBottom={30}
                                        scrollable={true}>
                                            <StepOneMX navigation={navigation} label={language === '1' ? orientationInfo.initial === 'PORTRAIT' ? 'Inf. Básica' : 'Información Básica' : orientationInfo.initial === 'PORTRAIT' ? 'Basic Info.' : 'Basic Information'} language={language} orientation={orientationInfo.initial}/>
                                            <StepTwoMX navigation={navigation} label={language === '1' ? orientationInfo.initial === 'PORTRAIT' ? 'Inf. Personal' : 'Información Personal' : orientationInfo.initial === 'PORTRAIT' ? 'Personal Info.' : 'Personal Information'} language={language} orientation={orientationInfo.initial}/>
                                            <StepThreeMX navigation={navigation} label={language === '1' ? 'Currículum' : 'Resume'} language={language} orientation={orientationInfo.initial}/>
                                            <StepFourMX navigation={navigation} label={language === '1' ? orientationInfo.initial === 'PORTRAIT' ? 'Ref. Personales' : 'Referencias Personales' : orientationInfo.initial === 'PORTRAIT' ? 'Personal Ref.' : 'Personal References'} language={language} orientation={orientationInfo.initial}/>
                                    </ProgressSteps>
                                </View>
                            :
                                <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                        }
                </Formik>
            }
            </View>
        </>
    );
}