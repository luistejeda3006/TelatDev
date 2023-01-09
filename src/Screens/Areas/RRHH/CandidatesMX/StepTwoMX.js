import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Alert, Text, BackHandler} from 'react-native';
import {InputForm, Picker, DatePicker, TitleForms, ProgressStepActions} from '../../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFormikContext} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import {selectStep, setStep} from '../../../../slices/progressStepSlice';
import {selectOrientation} from '../../../../slices/orientationSlice';
import {selectLanguageApp} from '../../../../slices/varSlice';
import tw from 'twrnc'
import { selectStateOption, setStepTwoMX } from '../../../../slices/applicationForm';

export default ({navigation, handleScrollTop = () => {}}) => {
    const dispatch = useDispatch()
    const LugarNacimiento = useSelector(selectStateOption)
    const orientation = useSelector(selectOrientation)
    const language = useSelector(selectLanguageApp)
    const step = useSelector(selectStep)

    const input_puesto = useRef()
    const input_salario = useRef()
    const input_calle = useRef()
    const input_numero_externo = useRef()
    const input_numero_interno = useRef()
    const input_codigo_postal = useRef()
    const input_barrio = useRef()
    const input_ciudad = useRef()
    const input_estado = useRef()
    const input_calle_uno = useRef()
    const input_calle_dos = useRef()
    const input_email = useRef()
    const input_telefono_personal = useRef()
    const input_telefono_fijo = useRef()
    const input_cuando = useRef()
    const input_motivo_salida = useRef()
    const input_lugar = useRef()
    const input_tiempo = useRef()
    const input_motivo_regreso = useRef()
    const input_lugar_nacimiento = useRef()
    const input_nacionalidad = useRef()
    const input_tiempo_mexico = useRef()

    const {isTablet} = DeviceInfo;
    const {submitForm, values} = useFormikContext();
    const first = {label: language === '1' ? 'Seleccionar' : 'Select', value: 'SEL'};

    const experienceData = [
        first,
        {label: '6m-1', value: '6m-1'},
        {label: '1-2', value: '1-2'},
        {label: '2-3', value: '2-3'},
        {label: '3-más', value: '3-más'},
    ]

    const scheduleData = [
        first,
        {label: language === '1' ? 'Matutino' : 'Morning shift', value: 'Matutino'},
        {label: language === '1' ? 'Vespertino' : 'Evening shift', value: 'Vespertino'},
        {label: language === '1' ? 'Nocturno' : 'Night shift', value: 'Nocturno'},
        {label: language === '1' ? 'Mixto' : 'Mixed shift', value: 'Mixto'},
        {label: language === '1' ? 'Rotar' : 'Alternate shifts', value: 'Rotar'},
        {label: language === '1' ? 'Indistinto' : 'Indistinct', value: 'Indistinto'},
    ]
    
    const closeOptions = [
        first,
        {label: language === '1' ? 'NO' : 'NO', value: '0'},
        {label: language === '1' ? 'SI' : 'YES', value: '1'},
    ]
    
    const numericData = [
        first,
        {label:'0', value: '0'},
        {label:'1', value: '1'},
        {label:'2', value: '2'},
        {label:'3', value: '3'},
        {label:'4', value: '4'},
        {label:'5', value: '5'},
        {label:'6', value: '6'},
        {label:'7', value: '7'},
        {label:'8', value: '8'},
        {label:'9', value: '9'},
    ]
    
    const transportData = [
        first,
        {label: language === '1' ? 'Transporte Público' : 'Public Transport', value: 'TRANSPORTE PUBLICO'},
        {label: language === '1' ? 'Transporte Privado' : 'Private Transport', value: 'TRANSPORTE PRIVADO'},
        {label: language === '1' ? 'Transporte Propio' : 'Personally-Owned Vehicle', value: 'VEHICULO PROPIO'},
    ]
    
    const recruitmentData = [
        first,
        {label: 'Facebook', value: 'FACEBOOK'},
        {label: 'Instagram', value: 'INSTAGRAM'},
        {label: 'Indeed', value: 'INDEED'},
        {label: 'OCC', value: 'OCC'},
        {label: 'Computrabajo', value: 'COMPUTRABAJO'},
        {label: 'LinkedIn', value: 'LINKEDIN'},
        {label: language === '1' ? 'Referido' : 'Referred', value: 'REFERIDO'},
        {label: language === '1' ? 'Reingreso' : 'Re-entry', value: 'REINGRESO'},
        {label: 'App', value: 'APP'},
        {label: language === '1' ? 'Otro' : 'Other', value: 'OTRO'},
    ]
    
    const jobBoardData = [
        first,
        {label: 'OCC', value: 'OCC'},
        {label: 'Indeed', value: 'INDEED'},
        {label: 'LinkedIn', value: 'LINKEDIN'},
        {label: 'Talenteca', value: 'TALENTECA'},
        {label: 'Bolsa Universitaria', value: 'BOLSA UNIVERSITARIA'},
        {label: 'Computrabajo', value: 'COMPUTRABAJO'}
    ]
    
    const socialNetworksData = [
        first,
        {label: 'Facebook', value: 'FACEBOOK'},
        {label: 'Twitter', value: 'TWITTER'},
        {label: 'Instagram', value: 'INSTAGRAM'},
    ]
    
    const estadocvData = [
        first,
        {label: language === '1' ? 'SOLTERO(A)' : 'SINGLE', value: 'SOLTERO'},
        {label: language === '1' ? 'CASADO(A)' : 'MARRIED', value: 'CASADO'},
    ]
    
    const documentData = [
        first,
        {label: language === '1' ? 'Ninguno' : 'None', value: '0'},
        {label: language === '1' ? 'Visitante con permiso para realizar actividades remuneradas (Documento con FMM hasta por 180n días)': 'Visitor With Work Permit', value: '1'},
        {label: language === '1' ? 'Residente temporal (Mayor de 180 días hasta 4 años)' : 'Temporary Resident', value: '2'},
        {label: language === '1' ? 'Residente permanente' : 'Permanent Resident', value: '3'},
    ]
    
    const [filters, setFilters] = useState({
        editable: false,
        recruitment: language === '1' ? 'Seleccionar Opción' : 'Select option',
        worked: false,
        foreigh: false,
        index: 0,
        error: true,
    });
    
    const {recruitment, error, worked, foreigh, index} = filters;
    const {emision_2, expiracion_2, lugarNacimiento_1, nombres_1, apellidoPaterno_1, apellidoMaterno_1, genero_1, puestoSolicitado_2, salario_2, experiencia_2, disponibilidadTurno_2, actualmenteTrabaja_2, horarioLaboral_2, trabajoTelat_2, vivisteExtranjero_2, tipoDocumento_2, estadocv_2, medioReclutamiento_2, numeroHijos_2, dependientesEconomicos_2, tipoTransporte_2, calle_2, numeroExterior_2, codigoPostal_2, colonia_2, ciudad_2, estado_2, email_2, numeroPersonal_2, numeroFijo_2, lugarNacimientoExtranjero_2, nacionalidadExtranjero_2, tiempoMexicoExtranjero_2, numeroInterior_2, calle_uno_2, calle_dos_2} = values;
    const {medioReclutamientoDesc_2, cuandoTrabajo_2, motivosSalida_2, numeroDocumento_2, lugarExtranjero_2, tiempoExtranjero_2, motivoRegresoExtranjero_2} = values;

    /* const getPlace = async () => {
        let keyState = 'place';
        let data = await AsyncStorage.getItem(keyState) || '';
        console.log('lugar', data)
        setLugarNacimiento(data)
    }

    useEffect(() => {
        getPlace()
    },[]) */
    
    const handleAction_dos = (index) => {
        setFilters({...filters, recruitment: index})
    }
    
    const handleAction_tres = (index) => {
        if(index === 2){
            setFilters({...filters, worked: true})
        }
        else {
            setFilters({...filters, worked: false})
        }
    }

    const handleAction_cuatro = (index) => {
        if(index === 3){
            setFilters({...filters, foreigh: true, index: index})
        }
        else {
            setFilters({...filters, foreigh: false, index: index})
        }
    }

    const handleAction_cinco = (index) => {
        if(index === 2){
            setFilters({...filters, foreigh: true, index: index})
        }
        else {
            setFilters({...filters, foreigh: false, index: index})
        }
    }

    const handleValidateVivisteExtranjero = () => {
        if(index !== undefined && index !== 0){
            if(index === 1){
                handleLastPart();
            }
            else {
                if(lugarExtranjero_2 !== undefined && lugarExtranjero_2 !== '' && tiempoExtranjero_2 !==  undefined && tiempoExtranjero_2 !== ''){
                    handleLastPart();
                }
                else {
                    Alerta();
                    console.log('alerta_6')
                }
            }
        }
        else {
            Alerta();
            console.log('alerta_7')
        }
    }

    const handleLastPart = async () => {
        if(email_2.includes('@') && email_2.includes('.')){
            if(numeroPersonal_2.length === 10){
                
                let tipo = '';
                let viviste = '';

                if(LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD'){
                    tipo = tipoDocumento_2
                }

                else {
                    viviste = vivisteExtranjero_2
                }

                const obj_2 = {
                    cand_puesto_solicitado: puestoSolicitado_2 ? puestoSolicitado_2 : '',
                    cand_salario_pretendido: salario_2 ? salario_2 : '',
                    cand_medio_reclutamiento: medioReclutamiento_2 ? medioReclutamiento_2.toUpperCase() : '',
                    cand_reclutamiento_desc: medioReclutamientoDesc_2 ? medioReclutamientoDesc_2.toUpperCase() : '',
                    info_exempleado: trabajoTelat_2 ? trabajoTelat_2 : '',
                    cand_exempleado: trabajoTelat_2 ? trabajoTelat_2 : '',
                    info_exempleado_tiempo: trabajoTelat_2 !== '1' ? '' : cuandoTrabajo_2 ? cuandoTrabajo_2.toUpperCase() : '',
                    info_exempleado_salida: trabajoTelat_2 !== '1' ? '' : motivosSalida_2 ? motivosSalida_2.toUpperCase() : '',
                    info_estado_civil: estadocv_2 ? estadocv_2 : '',
                    info_hijos: numeroHijos_2 ? numeroHijos_2 : '',
                    info_depen_economicos: dependientesEconomicos_2 ? dependientesEconomicos_2 : '',
                    info_vivio_extranjero: viviste ? viviste : '',
                    info_lugar_extranjero: viviste !== '1' ? '' : lugarExtranjero_2 ? lugarExtranjero_2.toUpperCase() : '',
                    info_tiempo_extranjero: viviste !== '1' ? '' : tiempoExtranjero_2 ? tiempoExtranjero_2.toUpperCase() : '',
                    info_calle: calle_2 ? calle_2 : '',
                    info_numero_ext: numeroExterior_2 ? numeroExterior_2.toUpperCase() : '',
                    info_numero_int: numeroInterior_2 ? numeroInterior_2.toUpperCase() : '',
                    info_colonia: colonia_2 ? colonia_2.toUpperCase() : '',
                    info_delegacion: ciudad_2 ? ciudad_2.toUpperCase() : '',
                    info_ciudad: estado_2 ? estado_2.toUpperCase() : '',
                    info_cp: codigoPostal_2,
                    info_dir_referencias: calle_uno_2 && calle_dos_2 ? `${calle_uno_2.toUpperCase()} y ${calle_dos_2.toUpperCase()}` : calle_uno_2 && !calle_dos_2 ? `${calle_uno_2.toUpperCase()}` : !calle_uno_2 && calle_dos_2  ? `${calle_dos_2.toUpperCase()}` : !calle_uno_2 && !calle_dos_2 && '',
                    info_email: email_2 ? email_2 : '',
                    info_telefono_celular: numeroPersonal_2 ? numeroPersonal_2 : '',
                    info_telefono_fijo: numeroFijo_2 ? numeroFijo_2 : '',
                    info_lugar_nac_extranjero: lugarNacimientoExtranjero_2 ? lugarNacimientoExtranjero_2.toUpperCase() : '',
                    info_nacionalidad: LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD' ? nacionalidadExtranjero_2 : 'MEXICANA',
                    info_tiempo_residencia: tiempoMexicoExtranjero_2 ? tiempoMexicoExtranjero_2.toUpperCase() : '',
                    info_permiso_laboral: tipo ? tipo : '',
                    info_documento_inm: tipo === '0' ? '' : numeroDocumento_2 ? numeroDocumento_2 : '',
                    info_doc_emision: tipo === '0' ? null : emision_2 === 'No seleccionada' || emision_2 === 'Not selected' ? null : emision_2,
                    info_doc_expiracion: tipo === '0' ? null : expiracion_2 === 'No seleccionada' || expiracion_2 === 'Not selected' ? null : expiracion_2,
                }
                
                /* let data = null;
                let key = 'stepTwo'
                
                data = await AsyncStorage.getItem(key) || '[]';
                if(data) {
                    await AsyncStorage.removeItem(key).then( () => AsyncStorage.setItem(key, JSON.stringify(obj_2)));
                }
                else {
                    data = await AsyncStorage.setItem(key, JSON.stringify(obj_2));
                } */
                dispatch(setStepTwoMX(obj_2))
                dispatch(setStep(step + 1))
                handleScrollTop()
            }
            else {
                Alert.alert(
                    language === '1' ? 'Número de Teléfono Inválido' : 'Invalid Phone Number',
                    language === '1' ? 'Ingrese un número teléfonico válido' : 'Type a valid phone number',
                    [
                        { text: 'OK'}
                    ]
                )
            }
        }
        else {
            Alert.alert(
                language === '1' ? 'Email Inválido' : 'Invalid Email',
                language === '1' ? 'Ingrese un correo válido' : 'Type a valid email',
                [
                    { text: 'OK'}
                ]
            )
        }
    }
    
    
    const handleValidateTipoDocumento = () => {
        if(index !== undefined && index !== 0){
            if(index === 1 || index === 2 || index === 3){
                if(index === 1){
                    handleLastPart();
                }

                else {
                    if(numeroDocumento_2 !== undefined && numeroDocumento_2 !== '' && emision_2 !== 'No seleccionada' && emision_2 !== 'Not selected' && expiracion_2 !== 'No seleccionada' && expiracion_2 !== 'Not selected'){
                        handleLastPart();
                    }
                    else {
                        Alerta();
                    }
                }
            }
            else {
                if(emision_2 !== 'No seleccionada' && emision_2 !== 'Not selected' && numeroDocumento_2 !== undefined && numeroDocumento_2 !== ''){
                    handleLastPart();
                }

                else {
                    Alerta();
                }
            }
        }
        else {
            Alerta();
        }
    }

    const handleValidateBolsaEmpleo = () => {
        if(recruitment === 7 || recruitment === 10){
            if(medioReclutamientoDesc_2 !== undefined && medioReclutamientoDesc_2 !== ''){
                if(trabajoTelat_2 === '0'){
                    if(LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD'){
                        handleValidateTipoDocumento();
                    }
                    else {
                        handleValidateVivisteExtranjero();
                    }
                }
                else {
                    if(cuandoTrabajo_2 !== '' && cuandoTrabajo_2 !== undefined){
                        if(motivosSalida_2 !== '' && motivosSalida_2 !== undefined){
                            if(LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD'){
                                handleValidateTipoDocumento();
                            }
                            else {
                                handleValidateVivisteExtranjero();
                            }
                        }
                        else{
                            Alerta();
                            console.log('alerta_3')
                        }
                    }
                    else {
                        Alerta();
                        console.log('alerta_4')
                    }
                }
            }
            else {
                Alerta();
                console.log('alerta_5')
            }
        }
        else {
            if(trabajoTelat_2 === '0'){
                if(LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD'){
                    handleValidateTipoDocumento();
                }
                else {
                    handleValidateVivisteExtranjero();
                }
            }
            else {
                if(cuandoTrabajo_2 !== '' && cuandoTrabajo_2 !== undefined){
                    if(motivosSalida_2 !== '' && motivosSalida_2 !== undefined){
                        if(LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD'){
                            handleValidateTipoDocumento();
                        }
                        else {
                            handleValidateVivisteExtranjero();
                        }
                    }
                    else{
                        Alerta();
                        console.log('alerta_3')
                    }
                }
                else {
                    Alerta();
                    console.log('alerta_4')
                }
            }
        }
    }

    const handleValidateMedioReclutamiento = () => {
        if(medioReclutamiento_2 !== '' && medioReclutamiento_2 !== undefined && medioReclutamiento_2 !== 'SEL'){
            handleValidateBolsaEmpleo();
        }
        else {
            Alerta();
            console.log('alerta_3')
        }
    }

    const Alerta = () => {
        return (
            Alert.alert(
                language === '1' ? 'Campos Vacíos' : 'Empty Fields',
                language === '1' ? 'Revise y llene los campos faltantes' : 'Review and fill in the missing fields',
                [
                    { text: 'OK'}
                ]
            )
        )
    }

    const handleValues = () => {
        if(LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD'){
            if(salario_2 === undefined || salario_2 === '', puestoSolicitado_2 === undefined || puestoSolicitado_2 === '' || medioReclutamiento_2 === undefined || medioReclutamiento_2 === 'SEL' || trabajoTelat_2 === undefined || trabajoTelat_2 === 'SEL' || estadocv_2 === undefined || estadocv_2 === 'SEL' || numeroHijos_2 === undefined || numeroHijos_2 === 'SEL' || dependientesEconomicos_2 === undefined || dependientesEconomicos_2 === 'SEL' || calle_2 === '' || calle_2 === undefined || numeroExterior_2 === '' || numeroExterior_2 === undefined || codigoPostal_2 === '' || codigoPostal_2 === undefined || colonia_2 === '' || colonia_2 === undefined || ciudad_2 === '' || ciudad_2 === undefined || estado_2 === '' || estado_2 === undefined || email_2 === '' || email_2 === undefined || numeroPersonal_2 === '' || numeroPersonal_2 === undefined || lugarNacimientoExtranjero_2 === '' || lugarNacimientoExtranjero_2 === undefined || nacionalidadExtranjero_2 === '' || nacionalidadExtranjero_2 === undefined || tiempoMexicoExtranjero_2 === '' || tiempoMexicoExtranjero_2 === undefined) {
                Alerta();
                console.log('alerta_1')
            }
            else {
                handleValidateMedioReclutamiento();
            }
        }
        else {
            if(salario_2 === undefined || salario_2 === '', puestoSolicitado_2 === undefined || puestoSolicitado_2 === '' || medioReclutamiento_2 === undefined || medioReclutamiento_2 === 'SEL' || trabajoTelat_2 === undefined || trabajoTelat_2 === 'SEL' || vivisteExtranjero_2 === undefined || vivisteExtranjero_2 === 'SEL' || estadocv_2 === undefined || estadocv_2 === 'SEL' || numeroHijos_2 === undefined || numeroHijos_2 === 'SEL' || dependientesEconomicos_2 === undefined || dependientesEconomicos_2 === 'SEL' || calle_2 === '' || calle_2 === undefined || numeroExterior_2 === '' || numeroExterior_2 === undefined || codigoPostal_2 === '' || codigoPostal_2 === undefined || colonia_2 === '' || colonia_2 === undefined || ciudad_2 === '' || ciudad_2 === undefined || estado_2 === '' || estado_2 === undefined || email_2 === '' || email_2 === undefined || numeroPersonal_2 === '' || numeroPersonal_2 === undefined) {
                Alerta();
                console.log('alerta_2')
            }
            else {
                handleValidateMedioReclutamiento();
            }
            
        }
    }

    useEffect(() => {
        const backAction = () => {
            Alert.alert(
                language === '1' ? 'Cancelar Solicitud' : 'Cancel Request',
                language === '1' ? '¿Estás seguro(a), que desea cancelar tu solicitud? \n\nSe perderán los datos ingresados\n' : 'Are you sure you want to cancel your request? \n\nThe data entered will be lost\n', [
                {
                    text: language === '1' ? 'Cancelar' : 'Cancel',
                    onPress: () => null,
                    style: 'cancel'
                },
                { text: language === '1' ? 'Sí, estoy seguro' : 'Yes, I am sure', onPress: () => navigation.navigate('Choose') }
            ]);
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
    
        return () => backHandler.remove();
    }, [language]);

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <View style={{alignSelf: 'stretch', paddingHorizontal: 18}}>
                {
                    orientation === 'PORTRAIT'
                    ?
                        <>
                            <TitleForms type={'title'} title={language === '1' ? 'Datos generales' : 'General Information'} />
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto que solicita' : 'Requested position'} />
                            <InputForm 
                                status={true}
                                fieldName={'puestoSolicitado_2'}
                                ref={input_puesto}
                                onSubmitEditing={() => input_salario.current.focus()}
                                placeholder={language === '1' ? 'Puesto que solicitas' : 'Position you are applying for'}
                            />
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Salario pretendido' : 'Expected salary'} />
                            <InputForm keyboardType='number-pad' returnKeyType={'done'} status={true} placeholder='$0.00' fieldName={'salario_2'} ref={input_salario}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Medio de reclutamiento' : 'Recruitment platform'} />
                            <Picker
                                items={recruitmentData}
                                fieldName={'medioReclutamiento_2'}
                                handleAction_dos={handleAction_dos}
                                contador={2}
                            />
                            {
                                recruitment === 7 || recruitment === 10
                                ?
                                    recruitment === 7
                                    ?
                                        <>
                                            <TitleForms type={'subtitle'} title={language === '1' ? '¿Quién te refirío?' : 'Who referred you?'} />
                                            <InputForm 
                                                status={true}
                                                fieldName={'medioReclutamientoDesc_2'}
                                                placeholder={language === '1' ? 'Escribe el nombre completo de tu referido' : 'Enter the full name of the person who referred you'}
                                            />
                                        </>
                                    :
                                        <>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Otro' : 'Other'} />
                                            <InputForm
                                                status={true}
                                                fieldName={'medioReclutamientoDesc_2'}
                                                placeholder={language === '1' ? 'Especifique' : 'Especify'}
                                            />
                                        </>
                                :
                                    <>
                                    </>
                            }
                            <TitleForms type={'subtitle'} title={language === '1' ? '¿Has trabajado anteriormente en esta empresa?' : 'Have you worked with us before?'} />
                            <Picker
                                items={closeOptions}
                                fieldName={'trabajoTelat_2'}
                                handleAction_tres={handleAction_tres}
                                contador={3}
                            />
                            {
                                worked
                                &&
                                    <>
                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Cuándo?' : 'When?'} />
                                        <InputForm status={worked} placeholder={language === '1' ? 'Cuándo trabajaste con nosotros' : 'When did you work with us?'} fieldName={'cuandoTrabajo_2'} ref={input_cuando} onSubmitEditing={() => input_motivo_salida.current.focus()}/>
                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de salida' : 'Leaving reason'} />
                                        <InputForm 
                                            status={worked}
                                            ref={input_motivo_salida}
                                            placeholder={language === '1' ? 'Específica los motivos por los cuales salió' : 'Especify leaving reason'}
                                            fieldName={'motivosSalida_2'}
                                        />
                                    </>
                            }

                            <TitleForms type={'title'} title={language === '1' ? 'Información Personal' : 'Personal Information'} />
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nombre(s)' : 'Name(s)'} />
                            <View style={styles.box}>
                                <Text style={tw`text-[#000]`}>{nombres_1.toUpperCase()}</Text>
                            </View>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Apellido paterno' : 'Last name'} />
                            <View style={styles.box}>
                                <Text style={tw`text-[#000]`}>{apellidoPaterno_1.toUpperCase()}</Text>
                            </View>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Apellido materno' : 'Second last name'} />
                            <View style={styles.box}>
                                <Text style={tw`text-[#000]`}>{apellidoMaterno_1.toUpperCase()}</Text>
                            </View>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Género' : 'Gender'} />
                            <View style={styles.box}>
                                <Text style={tw`text-[#000]`}>{genero_1 === 'H' ? language === '1' ? 'MASCULINO' : 'MALE' : language === '1' ? 'FEMENINO' : 'FEMALE'}</Text>
                            </View>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Lugar de nacimiento' : 'Place of birth'} />
                            <View style={styles.box}>
                                <Text style={tw`text-[#000]`}>{LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD' ? language === '1' ? 'NACIDO EN EL EXTRANJERO' : 'BORN ABROAD' : LugarNacimiento}</Text>
                            </View>
                            {
                                LugarNacimiento !== 'NACIDO EN EL EXTRANJERO'
                                &&
                                    <>
                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Nacionalidad' : 'Nationality'} />
                                        <View style={styles.box}>
                                            <Text style={tw`text-[#000]`}>{language === '1' ? 'MEXICANA' : 'MEXICAN'}</Text>
                                        </View>
                                    </>
                            }
                            {
                                LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD'
                                ?
                                    <>
                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Específica tu lugar de nacimiento' : 'Especify your place of birth'} />                     
                                        <InputForm status={true} placeholder={language === '1' ? 'Específica tu lugar de nacimiento' : 'Especify your place of birth'} fieldName={'lugarNacimientoExtranjero_2'} ref={input_lugar_nacimiento} onSubmitEditing={() => input_nacionalidad.current.focus()}/>
                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Específica tu nacionalidad' : 'Especify your nationality'} />
                                        <InputForm status={true} placeholder={language === '1' ? 'Específica tu nacionalidad' : 'Especify your nationality'} fieldName={'nacionalidadExtranjero_2'} ref={input_nacionalidad} onSubmitEditing={() => input_tiempo_mexico.current.focus()}/>
                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Por cuanto tiempo has vivido en México?' : 'For how long have you lived in Mexico?'} />
                                        <InputForm status={true} placeholder={language === '1' ? 'Específica cuanto tiempo has vivido en México' : 'Especify how long have you lived in Mexico'} fieldName={'tiempoMexicoExtranjero_2'} ref={input_tiempo_mexico}/>
                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Tipo de documento migratorio' : 'Type of immigration document'} />
                                        <Picker
                                            items={documentData}
                                            fieldName={'tipoDocumento_2'}
                                            handleAction_cuatro={handleAction_cuatro}
                                            contador={4}
                                        />
                                        {
                                            index === 2 || index === 3 || index === 4
                                            ?
                                                index === 2 || index == 3
                                                ?
                                                    <>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Número de documento migratorio' : 'Number of migratory document'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica el número de documento migratorio' : 'Especify number of migratory document'} fieldName={'numeroDocumento_2'} maxLength={10} keyboardType='number-pad' returnKeyType={'done'}/>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de emisión del documento' : 'Date of essue of the document'} />
                                                        <DatePicker fieldName={'emision_2'} label={emision_2 ? `${emision_2.substring(8,10)}-${emision_2.substring(5,7)}-${emision_2.substring(0,4)}` : ''} language={language} />
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de expiración del documento' : 'Expiration date of the document'} />
                                                        <DatePicker fieldName={'expiracion_2'} label={expiracion_2 ? `${expiracion_2.substring(8,10)}-${expiracion_2.substring(5,7)}-${expiracion_2.substring(0,4)}` : ''} language={language} />
                                                    </>
                                                :
                                                    <>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Número de documento migratorio' : 'Number of migratory document'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica el número de documento migratorio' : 'Especify number of migratory document'} fieldName={'numeroDocumento_2'} maxLength={10} keyboardType='number-pad' returnKeyType={'done'}/>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de emisión del documento' : 'Date of issue of the document'} />
                                                        <DatePicker fieldName={'emision_2'} label={emision_2 ? `${emision_2.substring(8,10)}-${emision_2.substring(5,7)}-${emision_2.substring(0,4)}` : ''} language={language} />
                                                    </>
                                            :
                                                <></>
                                        }
                                    </>
                                :
                                    <>
                                        {
                                            LugarNacimiento === 'NACIDO EN EL EXTRANJERO' || LugarNacimiento === 'BORN ABROAD'
                                            &&
                                                <>
                                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Nacionalidad' : 'Nationality'} />
                                                    <View style={styles.box}>
                                                        <Text style={tw`text-[#000]`}>{language === '1' ? 'MEXICANA' : 'MEXICAN'}</Text>
                                                    </View>
                                                </>
                                        }
                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Viviste en el extrajero?' : 'Did you live abroad?'} />
                                        <Picker
                                            items={closeOptions}
                                            fieldName={'vivisteExtranjero_2'}
                                            handleAction_cinco={handleAction_cinco}
                                            contador={5}
                                        />
                                        {
                                            foreigh
                                            &&
                                                <>
                                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Específica el lugar' : 'Where?'} />
                                                    <InputForm status={true} placeholder={language === '1' ? 'Especifique' : 'Especify'} fieldName={'lugarExtranjero_2'} ref={input_lugar} onSubmitEditing={() => input_tiempo.current.focus()} />
                                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Tiempo de vivir en el extranjero' : 'How long did you live abroad? '} />
                                                    <InputForm status={true} placeholder={language === '1' ? 'Especifique' : 'Especify'} fieldName={'tiempoExtranjero_2'} ref={input_tiempo} />
                                                </>
                                        }
                                    </>
                            }
                            
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Estado civil' : 'Marital status'} />
                            <Picker
                                items={estadocvData}
                                fieldName={'estadocv_2'}
                            />
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Número de hijos' : 'How many children do you have?'} />
                            <Picker
                                items={numericData}
                                fieldName={'numeroHijos_2'}
                            />
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Dependientes económicos' : 'Economic dependents'} />
                            <Picker
                                items={numericData}
                                fieldName={'dependientesEconomicos_2'}
                            />
                            
                            <TitleForms type={'title'} title={language === '1' ? 'Domicilio' : 'Address'} />
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Calle' : 'Street name'} />
                            <InputForm status={true} placeholder={language === '1' ? 'Calle' : 'Street name'} fieldName={'calle_2'} onSubmitEditing={() => input_numero_externo.current.focus()} ref={input_calle}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Número de casa (externo)' : 'House number (external)'} />
                            <InputForm
                                status={true} 
                                placeholder={language === '1' ? 'Número de casa (externo)' : 'House number (external)'} 
                                fieldName={'numeroExterior_2'}
                                ref={input_numero_externo}
                                onSubmitEditing={() => input_numero_interno.current.focus()}
                            />
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Número de casa (interno)' : 'House number (internal)'} />
                            <InputForm status={true} placeholder={language === '1' ? 'Número de casa (interno)' : 'House number (internal)'} fieldName={'numeroInterior_2'} ref={input_numero_interno} onSubmitEditing={() => input_codigo_postal.current.focus()}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Código postal' : 'Zip code'} />
                            <InputForm status={true} maxLength={5} placeholder={language === '1' ? 'Código postal' : 'Zip code'} fieldName={'codigoPostal_2'} keyboardType='number-pad' returnKeyType={'done'} ref={input_codigo_postal} onSubmitEditing={() => input_barrio.current.focus()}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Barrio (Colonia)' : 'Neighborhood (Colonia)'} />
                            <InputForm status={true} placeholder={language === '1' ? 'Barrio (Colonia)' : 'Neighborhood (Colonia)'} fieldName={'colonia_2'} ref={input_barrio} onSubmitEditing={() => input_ciudad.current.focus()}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Ciudad (Municipio / Delegación)' : 'City (Municipio / Delegación)'} />
                            <InputForm status={true} placeholder={language === '1' ? 'Ciudad (Municipio / Delegación)' : 'City (Municipio / Delegación)'} fieldName={'ciudad_2'} ref={input_ciudad} onSubmitEditing={() => input_estado.current.focus()}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Estado (Estado)' : 'State (Estado)'} />
                            <InputForm status={true} placeholder={language === '1' ? 'Estado (Estado)' : 'State (Estado)'} fieldName={'estado_2'} ref={input_estado} onSubmitEditing={() => input_calle_uno.current.focus()}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Entre calle 1' : 'Between street 1'} />
                            <InputForm status={true} placeholder={language === '1' ? 'Entre calle 1' : 'Between street 1'} fieldName={'calle_uno_2'} ref={input_calle_uno} onSubmitEditing={() => input_calle_dos.current.focus()}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Entre calle 2' : 'Between street 2'} />
                            <InputForm status={true} placeholder={language === '1' ? 'Entre calle 2' : 'Between street 2'} fieldName={'calle_dos_2'} ref={input_calle_dos} onSubmitEditing={() => input_email.current.focus()}/>
                            <TitleForms type={'title'} title={language === '1' ? 'Datos de contacto' : 'Contact details'} />
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Correo electrónico' : 'E-mail address'} />
                            <InputForm keyboardType='email-address' icon={'envelope'} status={true} placeholder='example@example.com' fieldName={'email_2'} ref={input_email} onSubmitEditing={() => input_telefono_personal.current.focus()}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Teléfono celular' : 'Phone number'} />
                            <InputForm icon={'phone'} status={true} maxLength={10} placeholder='55-11-22-33-44' fieldName={'numeroPersonal_2'} keyboardType='number-pad' returnKeyType={'done'} ref={input_telefono_personal} onSubmitEditing={() => input_telefono_fijo.current.focus()}/>
                            <TitleForms type={'subtitle'} title={language === '1' ? 'Teléfono fijo' : 'Landline phone'} />
                            <InputForm icon={'phone'} status={true} maxLength={10} placeholder='55-11-22-33-44' fieldName={'numeroFijo_2'} keyboardType='number-pad' returnKeyType={'done'} ref={input_telefono_fijo}/>
                            <ProgressStepActions handleNext={handleValues} language={language}/>
                        </>
                    :
                        <></>
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
    box: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 45,
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
})