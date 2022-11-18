import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Alert, BackHandler} from 'react-native';
import {InputForm, Picker, TitleForms, DatePicker} from '../../../../components';
import {ProgressStep} from 'react-native-progress-steps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';
import {useOrientation} from '../../../../hooks';
import {useFormikContext} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {diffBetweenDates} from '../../../../js/dates'

let inicial = null;
let terminal = null;
let inicialOpcional = null;
let terminalOpcional = null;
export default ({navigation, language, orientation, ...rest}) => {
    const {isTablet} = DeviceInfo;
    const {submitForm, values} = useFormikContext();

    const input_titulo_academico = useRef()
    const input_año = useRef()
    const input_institucion = useRef()
    const input_horario_turno = useRef()
    const input_otros_estudios = useRef()
    const input_paquetes_computacionales = useRef()
    const input_nombre_empresa = useRef()
    const input_giro = useRef()
    const input_puesto = useRef()
    const input_salario_inicial = useRef()
    const input_salario_final = useRef()
    const input_motivo_salida = useRef()
    const input_jefe_directo = useRef()
    const input_telefono_contacto = useRef()
    const input_nombre_empresa_opcional = useRef()
    const input_giro_opcional = useRef()
    const input_puesto_opcional = useRef()
    const input_salario_inicial_opcional = useRef()
    const input_salario_final_opcional = useRef()
    const input_motivo_salida_opcional = useRef()
    const input_jefe_directo_opcional = useRef()
    const input_telefono_contacto_opcional = useRef()

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });
    
    const first = {label: language === '1' ? 'Seleccionar' : 'Select', value: 'SEL'};

    const schoolLevelData = [
        first,
        {label: language === '1' ? 'Primaria' : 'Elementary School', value: 'Primaria'},
        {label: language === '1' ? 'Secundaria' : 'Middle School', value: 'Secundaria'},
        {label: language === '1' ? 'Preparatoria' : 'Highschool', value: 'Preparatoria'},
        {label: language === '1' ? 'Licenciatura' : 'Bachelor’s Degree', value: 'Licenciatura'},
        {label: language === '1' ? 'Posgrado' : 'Postgraduate Studies', value: 'Postgrado'},
    ]

    const closeOptions = [
        first,
        {label: language === '1' ? 'NO' : 'NO', value: '0'},
        {label: language === '1' ? 'SI' : 'YES', value: '1'},
    ]

    const englishOptionsData = [
        first,
        {label: language === '1' ? 'Básico' : 'Basic', value: 'Básico'},
        {label: language === '1' ? 'Intermedio' : 'Intermediate', value: 'Intermedio'},
        {label: language === '1' ? 'Avanzado' : 'Advanced', value: 'Avanzado'},
    ]
    
    const dAprendioData = [
        first,
        {label: language === '1' ? 'ESCUELA (MÉXICO)' : 'SCHOOL (MEXICO)', value: 'ESCUELA (MÉXICO)'},
        {label: language === '1' ? 'ESTADOS UNIDOS' : 'USA', value: 'ESTADOS UNIDOS'},
        {label: language === '1' ? 'INDEPENDIENTE' : 'INDEPENDENT', value: 'INDEPENDIENTE'},
    ]

    const gradoAvanceData = [
        first,
        {label: language === '1' ? 'Trunco' : 'Unfinished', value: 'Trunco'},
        {label: language === '1' ? 'Pasante' : 'In process of Certification', value: 'Pasante'},
        {label: language === '1' ? 'Titular' : 'Certified', value: 'Titular'},
    ]

    const [filters, setFilters] = useState({
        error: true,
        currentlyStudy: false,
        pEmpleo: false,
        contact: false,
        contactOptional: false,
        studyGrade: 0
    });
    
    const {fechaIngreso_3, fechaSalida_3, fechaIngresoOpcional_3, fechaSalidaOpcional_3, nivelEscolar_3, institucion_3, añoGraduacion_3, horarioTurno_3, otrosEstudios_3, paquetesComputacionales_3, nivelEscritura_3, nivelLectura_3, nivelComprension_3, nivelConversacional_3, dondeAprendio_3, nombreEmpresa_3, giroEmpresa_3, puestoDesempeñado_3, jefeDirectoTelefono_3, estudiasActualmente_3, esCertificado_3, gradoAvance_3, primerEmpleo_3, contactarOpcional_3, contactar_3, salarioInicial_3, salarioFinal_3, motivoSalida_3, jefeDirecto_3, porque_3, nombreEmpresaOpcional_3, giroEmpresaOpcional_3, puestoDesempeñadoOpcional_3, salarioInicialOpcional_3, salarioFinalOpcional_3, motivoSalidaOpcional_3, jefeDirectoOpcional_3, jefeDirectoTelefonoOpcional_3, contactarOpcional, porqueOpcional_3, tituloAcademico_3} = values;
    const {error, currentlyStudy, pEmpleo, contact, contactOptional, studyGrade} = filters;

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

    const handleValidatePhoneNumber = () => {
        if(jefeDirectoTelefono_3 !== undefined && jefeDirectoTelefono_3 !== ''){
            if(jefeDirectoTelefono_3.length === 10){
                handleValidateSchoolLevel();
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
            handleValidateSchoolLevel();
        }
    }

    const handleData = async () => {
        let certified = '';
        let grade = '';
        let contactar = '';
        let contactarOpcional = '';
        
        if(primerEmpleo_3 === '0'){
            contactar = contactar_3;
        }

        if(contactarOpcional_3){
            contactarOpcional = contactarOpcional_3;
        }

        if(studyGrade === 1 || studyGrade === 2 || studyGrade === 3 || studyGrade === 4 || studyGrade === 5){
            if(studyGrade === 1 || studyGrade === 2 || studyGrade === 3){
                certified = esCertificado_3;
            }
            else {
                grade = studyGrade;
            }
        }
        
        const obj_3 = {
            curr_nivel_estudio: nivelEscolar_3 ? nivelEscolar_3 : '',
            curr_certificado: studyGrade === 1 ? certified ? certified : '' : '',
            curr_institucion: institucion_3 ? institucion_3.toUpperCase() : '' ,
            curr_anno: añoGraduacion_3 ? añoGraduacion_3 : '',
            
            curr_titulo: studyGrade === 5 || studyGrade === 4 ? tituloAcademico_3 ? tituloAcademico_3 : '' : '',
            curr_estatus: studyGrade === 4 ? grade ? grade : '' : '',
            curr_cursando: estudiasActualmente_3,
            curr_horario: horarioTurno_3 ? horarioTurno_3.toUpperCase() : '',
            curr_otros_estudios: otrosEstudios_3 ? otrosEstudios_3.toUpperCase() : '',
            curr_pkg_computo: paquetesComputacionales_3 ? paquetesComputacionales_3.toUpperCase() : '',

            idioma: 'INGLÉS',
            nivel_escritura: nivelEscritura_3 ? nivelEscritura_3 : '',
            nivel_lectura: nivelLectura_3 ? nivelLectura_3 : '',
            nivel_comprension: nivelComprension_3 ? nivelComprension_3 : '',
            nivel_conversacional: nivelConversacional_3 ? nivelConversacional_3 : '',
            lugar_aprendizaje: dondeAprendio_3 ? dondeAprendio_3 : '',
            cand_primer_empleo: primerEmpleo_3 ? primerEmpleo_3 : '',
            refl_nombre_empresa1: nombreEmpresa_3 ? nombreEmpresa_3.toUpperCase() : '',
            refl_giro_empresa1: giroEmpresa_3 ? giroEmpresa_3.toUpperCase() : '',
            refl_actividad1: puestoDesempeñado_3 ? puestoDesempeñado_3.toUpperCase() : '',
            refl_sueldo_inicial1: salarioInicial_3 ? salarioInicial_3 : '',
            refl_sueldo_final1: salarioFinal_3 ? salarioFinal_3 : '',
            refl_fecha_ingreso1: fechaIngreso_3 === '' || fechaIngreso_3 === undefined ? null : fechaIngreso_3,
            refl_fecha_salida1: fechaSalida_3 === '' || fechaSalida_3 === undefined ? null : fechaSalida_3,
            refl_motivo_salida1: motivoSalida_3 ? motivoSalida_3.toUpperCase() : '',
            refl_jefe_directo1: jefeDirecto_3 ? jefeDirecto_3.toUpperCase() : '',
            refl_telefono1: jefeDirectoTelefono_3 ? jefeDirectoTelefono_3 : '',
            refl_contactar1: contactar ? contactar : '',
            refl_motivos1: porque_3 ? porque_3.toUpperCase() : '',
            refl_permanencia1: inicial && terminal ? diffBetweenDates(inicial, terminal): '', //esta por definirse
            refl_ultima_empresa1: 0,

            refl_nombre_empresa2: nombreEmpresaOpcional_3 ? nombreEmpresaOpcional_3.toUpperCase() : '',
            refl_giro_empresa2: giroEmpresaOpcional_3 ? giroEmpresaOpcional_3.toUpperCase() : '',
            refl_actividad2: puestoDesempeñadoOpcional_3 ? puestoDesempeñadoOpcional_3.toUpperCase() : '',
            refl_sueldo_inicial2: salarioInicialOpcional_3 ? salarioInicialOpcional_3 : '',
            refl_sueldo_final2: salarioFinalOpcional_3 ? salarioFinalOpcional_3 : '',
            refl_fecha_ingreso2: fechaIngresoOpcional_3 === '' || fechaIngresoOpcional_3 === undefined ? null : fechaIngresoOpcional_3,
            refl_fecha_salida2: fechaSalidaOpcional_3 === '' || fechaSalidaOpcional_3 === undefined ? null : fechaSalidaOpcional_3,
            refl_motivo_salida2: motivoSalidaOpcional_3 ? motivoSalidaOpcional_3.toUpperCase() : '',
            refl_jefe_directo2: jefeDirectoOpcional_3 ? jefeDirectoOpcional_3.toUpperCase() : '',
            refl_telefono2: jefeDirectoTelefonoOpcional_3 ? jefeDirectoTelefonoOpcional_3 : '',
            refl_contactar2: contactarOpcional ? contactarOpcional : '',
            refl_motivos2: porqueOpcional_3 ? porqueOpcional_3.toUpperCase() : '',
            refl_permanencia2: inicialOpcional && terminalOpcional ? diffBetweenDates(inicialOpcional, terminalOpcional) : '', //esta por definirse
            refl_ultima_empresa2: 0,
        }
        
        inicial = null;
        terminal = null;
        inicialOpcional = null;
        terminalOpcional = null;

        let data = null;
        let key = 'stepThree'

        data = await AsyncStorage.getItem(key) || '[]';
        if(data) {
            await AsyncStorage.removeItem(key).then( () => AsyncStorage.setItem(key, JSON.stringify(obj_3)));
        }
        else {
            data = await AsyncStorage.setItem(key, JSON.stringify(obj_3));
        }
        
    }

    const handleValidateSchoolLevel = () => {
        if(studyGrade === 1 || studyGrade === 2 || studyGrade === 3){
            if(esCertificado_3 !== undefined && esCertificado_3 !== 'SEL'){
                handleData()
                setFilters({...filters, error: false})
            }
            else {
                Alerta();
            }
        }

        else {
            handleData();
            setFilters({...filters, error: false})
        }

    }

    const handleValues = () => {
        if(primerEmpleo_3 !== undefined && primerEmpleo_3 !== 'SEL' && dondeAprendio_3 !== undefined && dondeAprendio_3 !== 'SEL' && nivelEscolar_3 !== undefined && nivelEscolar_3 !== 'SEL' && nivelEscritura_3 !== undefined && nivelEscritura_3 !== 'SEL' && nivelLectura_3 !== undefined && nivelLectura_3 !== 'SEL' && nivelComprension_3 !== undefined && nivelComprension_3 !== 'SEL' && nivelConversacional_3 !== undefined && nivelConversacional_3 !== 'SEL'){
            if(primerEmpleo_3 === '0'){
                if(nombreEmpresa_3 === undefined || nombreEmpresa_3 === '' || giroEmpresa_3 === undefined || giroEmpresa_3 === '' || puestoDesempeñado_3 === undefined || puestoDesempeñado_3 === '' || salarioInicial_3 === undefined || salarioInicial_3 === '' || salarioFinal_3 === undefined || salarioFinal_3 === '' || fechaIngreso_3 === '' || fechaIngreso_3 === undefined || fechaSalida_3 === '' || fechaSalida_3 === undefined || motivoSalida_3 === undefined || motivoSalida_3 === '' || jefeDirecto_3 === undefined || jefeDirecto_3 === '' || contactar_3 === undefined || contactar_3 === ''){
                    Alerta();
                }
                else {
                    if(contact){
                        if(porque_3 === undefined || porque_3 === ''){
                            Alerta();
                        }
                        else {
                            handleValidatePhoneNumber();
                        }
                    }
                    else {
                        handleValidatePhoneNumber();
                    }
                }
            }
            else {
                handleValidateSchoolLevel();
            }
        }
        else {
            Alerta();
        }
    }

    const handleAction_uno = (index) => {
        if(index === 0 || index === 1){
            setFilters({...filters, currentlyStudy: false})
        }
        else{
            setFilters({...filters, currentlyStudy: true})
        }
    }

    const handleAction_dos = (index) => {
        if(index === 1){
            setFilters({...filters, pEmpleo: true})
        }
        else{
            setFilters({...filters, pEmpleo: false})
        }
    }

    const handleAction_tres = (index) => {
        if(index === 2 || index === 0){
            setFilters({...filters, contact: false})
        }
        else{
            setFilters({...filters, contact: true})
        }
    }

    const handleAction_cuatro = (index) => {
        if(index === 2){
            setFilters({...filters, contactOptional: false})
        }
        else{
            setFilters({...filters, contactOptional: true})
        }
    }

    const handleAction_cinco = (index) => {
        if(index === 1 || index === 2 || index === 3) setFilters({...filters, studyGrade: 1})
        else if(index === 4) setFilters({...filters, studyGrade: 4})
        else if(index === 5) setFilters({...filters, studyGrade: 5})
        else setFilters({...filters, studyGrade: 0})
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
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <ProgressStep
                errors={error}
                {...rest}
                nextBtnText={language === '1' ? 'Siguiente' : 'Next'}
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
                                    <TitleForms type={'title'} title={language === '1' ? 'Formación académica' : 'Education'} />
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel escolar' : 'School level'} />
                                    <Picker 
                                        fieldName={'nivelEscolar_3'}
                                        items={schoolLevelData}
                                        required={true}
                                        handleAction_cinco={handleAction_cinco}
                                        contador={5}
                                    />
                                    {
                                        studyGrade === 1 || studyGrade === 2 || studyGrade === 3
                                        ?
                                            <>
                                                <TitleForms type={'subtitle'} title={language === '1' ? '¿Tienes un certificado?' : 'Do you have a study certificate?'} />
                                                <Picker 
                                                    fieldName={'esCertificado_3'}
                                                    items={closeOptions}
                                                    required={true}
                                                />
                                            </>
                                        :
                                            <></>
                                    }
                                    
                                    {
                                        studyGrade === 1 || studyGrade === 2 || studyGrade === 3 || studyGrade === 4 || studyGrade === 5 
                                        ?
                                            studyGrade === 1 || studyGrade === 2 || studyGrade === 3
                                            ?
                                                <>
                                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Institución dónde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                    <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                    <InputForm keyboardType='numeric' maxLength={4} status={true} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año}/>
                                                </>
                                            :
                                                studyGrade === 4
                                                ?
                                                    <>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Grado de Avance' : 'Degree of progress'} />
                                                        <Picker
                                                            fieldName={'gradoAvance_3'}
                                                            items={gradoAvanceData}
                                                        />
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Título académico' : 'Degree'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica tu título académico' : 'Especify degree'} fieldName={'tituloAcademico_3'} ref={input_titulo_academico} onSubmitEditing={() => input_institucion.current.focus()}/>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Institución dónde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                        <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año} />
                                                    </>
                                                :
                                                    <>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Título académico' : 'Degree'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica tu título académico' : 'Especify degree'} fieldName={'tituloAcademico_3'} ref={input_titulo_academico} onSubmitEditing={() => input_institucion.current.focus()}/>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Institución dónde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                        <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año} />
                                                    </>
                                        :
                                            <></>
                                    }
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Estudias actualmente' : 'Are you studying at the moment?'} />
                                    <Picker 
                                        fieldName={'estudiasActualmente_3'}
                                        items={closeOptions} 
                                        handleAction_uno={handleAction_uno}
                                        contador={1}
                                        required={false}
                                    />
                                    {
                                        currentlyStudy
                                        &&
                                            <>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Específica tu horario' : 'Especify schedule'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'horarioTurno_3'} ref={input_horario_turno} onSubmitEditing={() => input_otros_estudios.current.focus()}/>
                                            </>
                                    }
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Otros estudios' : 'Other studies'} />
                                    <InputForm status={true} placeholder={language === '1' ? 'Otros estudios' : 'Other studies'} fieldName={'otrosEstudios_3'} ref={input_otros_estudios} onSubmitEditing={() => input_paquetes_computacionales.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Paquetes computacionales que manejas' : 'Computer programs that you handle'} />
                                    <InputForm status={true} placeholder='EXCEL, WORD, ETC ...' fieldName={'paquetesComputacionales_3'} ref={input_paquetes_computacionales} />
                                    <TitleForms type={'title'} title={language === '1' ? 'Nivel de Inglés' : 'English level'} />
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de escritura' : 'Writing'} />
                                    <Picker
                                        fieldName={'nivelEscritura_3'}
                                        items={englishOptionsData} 
                                        required={true}
                                    />
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de lectura' : 'Reading'} />
                                    <Picker 
                                        fieldName={'nivelLectura_3'}
                                        items={englishOptionsData}
                                        required={true}
                                    />
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de comprensión' : 'Comprehension'} />
                                    <Picker
                                        fieldName={'nivelComprension_3'}
                                        items={englishOptionsData}
                                        required={true}
                                    />
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel conversacional' : 'Speaking'} />
                                    <Picker 
                                        fieldName={'nivelConversacional_3'}
                                        items={englishOptionsData}
                                        required={true}
                                    />
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Dónde lo aprendiste' : 'Where did you learn it?'} />
                                    <Picker
                                        fieldName={'dondeAprendio_3'}
                                        items={dAprendioData}
                                    />
                
                                    <TitleForms type={'title'} title={language === '1' ? 'Experiencia laboral' : 'Work experience'} />
                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Este sería tu primer empleo?' : 'This would be your first job?'} />
                                    <Picker 
                                        fieldName={'primerEmpleo_3'}
                                        items={closeOptions}
                                        handleAction_dos={handleAction_dos}
                                        contador={2}
                                    />
                                    {/* {segunda accion de picker} */}
                                    {
                                        pEmpleo
                                        &&
                                            <>
                                                <TitleForms type={'title'} title={language === '1' ? 'Experiencia Laboral (Último Empleo)' : 'Work Experience (Last Job)'} />
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} fieldName={'nombreEmpresa_3'} ref={input_nombre_empresa} onSubmitEditing={() => input_giro.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Giro de la empresa' : 'Line of business'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Giro de la empresa' : 'Line of business'} fieldName={'giroEmpresa_3'} ref={input_giro} onSubmitEditing={() => input_puesto.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto' : 'Position'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Puesto' : 'Position'} fieldName={'puestoDesempeñado_3'} ref={input_puesto} onSubmitEditing={() => input_salario_inicial.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo inicial' : 'Starting salary'} />
                                                <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioInicial_3'} ref={input_salario_inicial} onSubmitEditing={() => input_salario_final.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo final' : 'Final salary'} />
                                                <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioFinal_3'} ref={input_salario_final}/>

                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de ingreso' : 'Starting date'} />
                                                <DatePicker fieldName={'fechaIngreso_3'} language={language} />
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de Salida' : 'End date'} />
                                                <DatePicker fieldName={'fechaSalida_3'} language={language} />

                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} fieldName={'motivoSalida_3'} ref={input_motivo_salida} onSubmitEditing={() => input_jefe_directo.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Jefe directo' : 'Direct manager'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Nombre completo jefe directo' : 'Full name direct manager'} fieldName={'jefeDirecto_3'} ref={input_jefe_directo} onSubmitEditing={() => input_telefono_contacto.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Número teléfonico' : 'Phone number'} />
                                                <InputForm maxLength={10} keyboardType='numeric' status={true} placeholder={language === '1' ? 'Teléfono de Contacto' : 'Contact Phone Number'} fieldName={'jefeDirectoTelefono_3'} ref={input_telefono_contacto}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? '¿Podemos contactarlo?' : 'Can we contact them?'} />
                                                <Picker 
                                                    fieldName={'contactar_3'}
                                                    items={closeOptions}
                                                    handleAction_tres={handleAction_tres}
                                                    contador={3}
                                                />
                                                {
                                                    contact
                                                    ?
                                                        <>
                                                            <TitleForms type={'subtitle'} title={language === '1' ? '¿Por qué?' : 'Why?'} />
                                                            <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'porque_3'}/>
                                                        </>
                                                    :
                                                    <></>
                                                }
                                                
                                                <TitleForms type={'title'} title={language === '1' ? 'Segunda Experiencia Laboral (Opcional)' : 'Second Work Experience (Optional)'} />
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} fieldName={'nombreEmpresaOpcional_3'} ref={input_nombre_empresa_opcional} onSubmitEditing={() => input_giro_opcional.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Giro de la empresa' : 'Line of business'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Giro de la empresa' : 'Line of business'} fieldName={'giroEmpresaOpcional_3'} ref={input_giro_opcional} onSubmitEditing={() => input_puesto_opcional.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto' : 'Position'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Puesto' : 'Position'} fieldName={'puestoDesempeñadoOpcional_3'} ref={input_puesto_opcional} onSubmitEditing={() => input_salario_inicial_opcional.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo inicial' : 'Starting salary'} />
                                                <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioInicialOpcional_3'} ref={input_salario_inicial_opcional} onSubmitEditing={() => input_salario_final_opcional.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo final' : 'Final salary'} />
                                                <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioFinalOpcional_3'} ref={input_salario_final_opcional} />
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de ingreso' : 'Starting date'} />
                                                <DatePicker fieldName={'fechaIngresoOpcional_3'} language={language} />
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de Salida' : 'End date'} />
                                                <DatePicker fieldName={'fechaSalidaOpcional_3'} language={language} />
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de salida' : 'Reason for exit'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} fieldName={'motivoSalidaOpcional_3'} ref={input_motivo_salida_opcional} onSubmitEditing={() => input_jefe_directo_opcional.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Jefe directo' : 'Direct manager'} />
                                                <InputForm status={true} placeholder={language === '1' ? 'Jefe directo' : 'Full name direct manager'} fieldName={'jefeDirectoOpcional_3'} ref={input_jefe_directo_opcional} onSubmitEditing={() => input_telefono_contacto_opcional.current.focus()}/>
                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Número teléfonico' : 'Phone number'} />
                                                <InputForm keyboardType='numeric' maxLength={10} status={true} placeholder={language === '1' ? 'Número teléfonico' : 'Phone number'}  fieldName={'jefeDirectoTelefonoOpcional_3'} ref={input_telefono_contacto_opcional} />
                                                <TitleForms type={'subtitle'} title={language === '1' ? '¿Podemos contactarlo?' : 'Can we contact them?'} />
                                                <Picker 
                                                    fieldName={'contactarOpcional_3'}
                                                    items={closeOptions}
                                                    handleAction_cuatro={handleAction_cuatro}
                                                    contador={4}
                                                    required={false}
                                                />
                                                {
                                                    contactOptional
                                                    ?
                                                        <>
                                                            <TitleForms type={'subtitle'} title={language === '1' ? '¿Por qué?' : 'Why?'} />
                                                            <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'porqueOpcional_3'}/>
                                                        </>
                                                    :
                                                        <></>
                                                }
                                        </>
                                    }
                                </>
                            :
                                <>
                                    <TitleForms type={'title'} title={language === '1' ? 'Formación académica' : 'Education'} />
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel escolar' : 'School level'} />
                                            <Picker 
                                                fieldName={'nivelEscolar_3'}
                                                items={schoolLevelData}
                                                required={true}
                                                handleAction_cinco={handleAction_cinco}
                                                contador={5}
                                            />
                                        </View>
                                        {
                                            studyGrade === 1 || studyGrade === 2 || studyGrade === 3
                                            ?
                                                
                                                <View style={{flex: 1}}>
                                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Tienes un certificado?' : 'Do you have a study certificate?'} />
                                                    <Picker 
                                                        fieldName={'esCertificado_3'}
                                                        items={closeOptions}
                                                        required={true}
                                                    />
                                                </View>
                                            :
                                                <></>
                                        }
                                    </View>
                                    
                                    
                                    {
                                        studyGrade === 1 || studyGrade === 2 || studyGrade === 3 || studyGrade === 4 || studyGrade === 5 
                                        ?
                                            studyGrade === 1 || studyGrade === 2 || studyGrade === 3
                                            ?
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                        <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año}/>
                                                    </View>
                                                </View>
                                            :
                                                studyGrade === 4
                                                ?
                                                    <>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Grado de Avance' : 'Degree of progress'} />
                                                                <Picker
                                                                    fieldName={'gradoAvance_3'}
                                                                    items={gradoAvanceData}
                                                                />
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Título académico' : 'Degree'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica tu título académico' : 'Especify degree'} fieldName={'tituloAcademico_3'} ref={input_titulo_academico} onSubmitEditing={() => input_institucion.current.focus()}/>
                                                            </View>
                                                        </View>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                                <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año}/>
                                                            </View>
                                                        </View>
                                                    </>
                                                :
                                                    <>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Título académico' : 'Degree'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica tu título académico' : 'Especify degree'} fieldName={'tituloAcademico_3'} ref={input_titulo_academico} onSubmitEditing={() => input_institucion.current.focus()}/>
                                                            </View>
                                                        </View>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                                <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año} />
                                                            </View>
                                                        </View>
                                                    </>
                                        :
                                            <></>
                                    }
                                    
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Estudias actualmente' : 'Are you studying at the moment?'} />
                                            <Picker 
                                                fieldName={'estudiasActualmente_3'}
                                                items={closeOptions} 
                                                handleAction_uno={handleAction_uno}
                                                contador={1}
                                                required={false}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            {
                                                currentlyStudy
                                                &&
                                                    <>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Específica tu horario' : 'Especify schedule'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'horarioTurno_3'} ref={input_horario_turno} onSubmitEditing={() => input_otros_estudios.current.focus()}/>
                                                    </>
                                            }
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Otros estudios' : 'Other studies'} />
                                            <InputForm status={true} placeholder={language === '1' ? 'Otros estudios' : 'Other studies'} fieldName={'otrosEstudios_3'} ref={input_otros_estudios} onSubmitEditing={() => input_paquetes_computacionales.current.focus()}/>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Paquetes computacionales que manejas' : 'Computer programs that you handle'} />
                                            <InputForm status={true} placeholder='EXCEL, WORD, ETC ...' fieldName={'paquetesComputacionales_3'} ref={input_paquetes_computacionales}/>
                                        </View>
                                    </View>

                                    <TitleForms type={'title'} title={language === '1' ? 'Nivel de Inglés' : 'English level'} />
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de escritura' : 'Writing'} />
                                            <Picker
                                                fieldName={'nivelEscritura_3'}
                                                items={englishOptionsData} 
                                                required={true}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de lectura' : 'Reading'} />
                                            <Picker 
                                                fieldName={'nivelLectura_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de comprensión' : 'Comprehension'} />
                                            <Picker
                                                fieldName={'nivelComprension_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel conversacional' : 'Speaking'} />
                                            <Picker 
                                                fieldName={'nivelConversacional_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Dónde lo aprendiste' : 'Where did you learn it?'} />
                                            <Picker
                                                fieldName={'dondeAprendio_3'}
                                                items={dAprendioData}
                                            />
                                        </View>
                                    </View>

                                    <TitleForms type={'title'} title={language === '1' ? 'Experiencia laboral' : 'Work experience'} />

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? '¿Este sería tu primer empleo?' : 'This would be your first job?'} />
                                            <Picker 
                                                fieldName={'primerEmpleo_3'}
                                                items={closeOptions}
                                                handleAction_dos={handleAction_dos}
                                                contador={2}
                                            />
                                        </View>
                                    </View>
                                    {
                                        pEmpleo
                                        &&
                                            <>
                                                <TitleForms type={'title'} title={language === '1' ? 'Experiencia Laboral (Último Empleo)' : 'Work Experience (Last Job)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} fieldName={'nombreEmpresa_3'} ref={input_nombre_empresa} onSubmitEditing={() => input_giro.current.focus()}/>
                                                    </View>

                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Giro de la empresa' : 'Line of business'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Giro de la empresa' : 'Line of business'} fieldName={'giroEmpresa_3'} ref={input_giro} onSubmitEditing={() => input_puesto.current.focus()}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto' : 'Position'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Puesto' : 'Position'} fieldName={'puestoDesempeñado_3'} ref={input_puesto} onSubmitEditing={() => input_salario_inicial.current.focus()}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo inicial' : 'Starting salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioInicial_3'} ref={input_salario_inicial} onSubmitEditing={() => input_salario_final.current.focus()}/>
                                                    </View>

                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo final' : 'Final salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioFinal_3'} ref={input_salario_final}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de ingreso' : 'Starting date'} />
                                                        <DatePicker fieldName={'fechaIngreso_3'} language={language} />
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de Salida' : 'End date'} />
                                                        <DatePicker fieldName={'fechaSalida_3'} language={language} />
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} fieldName={'motivoSalida_3'} ref={input_motivo_salida} onSubmitEditing={() => input_jefe_directo.current.focus()}/>
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Jefe directo' : 'Direct manager'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Nombre completo jefe directo' : 'Full name direct manager'} fieldName={'jefeDirecto_3'} ref={input_jefe_directo} onSubmitEditing={() => input_telefono_contacto.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Número teléfonico' : 'Phone number'} />
                                                        <InputForm maxLength={10} keyboardType='numeric' status={true} placeholder={language === '1' ? 'Teléfono de Contacto' : 'Contact Phone Number'} fieldName={'jefeDirectoTelefono_3'} ref={input_telefono_contacto}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Podemos contactarlo?' : 'Can we contact them?'} />
                                                        <Picker 
                                                            fieldName={'contactar_3'}
                                                            items={closeOptions}
                                                            handleAction_tres={handleAction_tres}
                                                            contador={3}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        {
                                                            contact
                                                            ?
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Por qué?' : 'Why?'} />
                                                                    <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'porque_3'} />
                                                                </>
                                                            :
                                                                <></>
                                                        }
                                                    </View>
                                                </View>

                                                <TitleForms type={'title'} title={language === '1' ? 'Segunda Experiencia Laboral (Opcional)' : 'Second Work Experience (Optional)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} fieldName={'nombreEmpresaOpcional_3'} ref={input_nombre_empresa_opcional} onSubmitEditing={() => input_giro_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Giro de la empresa' : 'Line of business'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Giro de la empresa' : 'Line of business'} fieldName={'giroEmpresaOpcional_3'} ref={input_giro_opcional} onSubmitEditing={() => input_puesto_opcional.current.focus()}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto' : 'Position'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Puesto' : 'Position'} fieldName={'puestoDesempeñadoOpcional_3'} ref={input_puesto_opcional} onSubmitEditing={() => input_salario_inicial_opcional.current.focus()}/>
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo inicial' : 'Starting salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioInicialOpcional_3'} ref={input_salario_inicial_opcional} onSubmitEditing={() => input_salario_final_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo final' : 'Final salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioFinalOpcional_3'} ref={input_salario_final_opcional} />
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de ingreso' : 'Starting date'} />
                                                        <DatePicker fieldName={'fechaIngresoOpcional_3'} language={language} />
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de Salida' : 'End date'} />
                                                        <DatePicker fieldName={'fechaSalidaOpcional_3'} language={language} />
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de salida' : 'Reason for exit'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} fieldName={'motivoSalidaOpcional_3'} ref={input_motivo_salida_opcional} onSubmitEditing={() => input_jefe_directo_opcional.current.focus()}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Jefe directo' : 'Direct manager'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Jefe directo' : 'Full name direct manager'} fieldName={'jefeDirectoOpcional_3'} ref={input_jefe_directo_opcional} onSubmitEditing={() => input_telefono_contacto_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Número teléfonico' : 'Phone number'} />
                                                        <InputForm keyboardType='numeric' maxLength={10} status={true} placeholder={language === '1' ? 'Número teléfonico' : 'Phone number'}  fieldName={'jefeDirectoTelefonoOpcional_3'} ref={input_telefono_contacto_opcional}/>
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Podemos contactarlo?' : 'Can we contact them?'} />
                                                        <Picker 
                                                            fieldName={'contactarOpcional_3'}
                                                            items={closeOptions}
                                                            handleAction_cuatro={handleAction_cuatro}
                                                            contador={4}
                                                            required={false}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        {
                                                            contactOptional
                                                            ?
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Por qué?' : 'Why?'} />
                                                                    <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'porqueOpcional_3'} />
                                                                </>
                                                            :
                                                                <></>
                                                        }
                                                    </View>
                                                </View>
                                        </>
                                    }
                                </>
                        :
                            isTablet()
                            ?
                                <View style={{flex: 1, alignSelf: 'stretch'}}>
                                    
                                    <TitleForms type={'title'} title={language === '1' ? 'Formación académica' : 'Education'} />
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel escolar' : 'School level'} />
                                            <Picker 
                                                fieldName={'nivelEscolar_3'}
                                                items={schoolLevelData}
                                                required={true}
                                                handleAction_cinco={handleAction_cinco}
                                                contador={5}
                                            />
                                        </View>
                                        {
                                            studyGrade === 1 || studyGrade === 2 || studyGrade === 3 || studyGrade === 4
                                            ?
                                                studyGrade === 1 || studyGrade === 2 || studyGrade === 3
                                                ?
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Tienes un certificado?' : 'Do you have a study certificate?'} />
                                                        <Picker 
                                                            fieldName={'esCertificado_3'}
                                                            items={closeOptions}
                                                            required={true}
                                                        />
                                                    </View>
                                                :
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Grado de Avance' : 'Degree of progress'} />
                                                        <Picker
                                                            fieldName={'gradoAvance_3'}
                                                            items={gradoAvanceData}
                                                        />
                                                    </View>
                                            :
                                                <></>
                                        }
                                    </View>
                           
                                    {
                                        studyGrade === 1 || studyGrade === 2 || studyGrade === 3 || studyGrade === 4 || studyGrade === 5 
                                        ?
                                            studyGrade === 1 || studyGrade === 2 || studyGrade === 3
                                            ?
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                        <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año}/>
                                                    </View>
                                                </View>
                                            :
                                                studyGrade === 4
                                                ?
                                                    <>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Título académico' : 'Degree'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica tu título académico' : 'Especify degree'} fieldName={'tituloAcademico_3'} ref={input_titulo_academico} onSubmitEditing={() => input_institucion.current.focus()}/>
                                                            </View>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                            </View>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                                <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año}/>
                                                            </View>
                                                        </View>
                                                    </>
                                                :
                                                    <>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Título académico' : 'Degree'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica tu título académico' : 'Especify degree'} fieldName={'tituloAcademico_3'} ref={input_titulo_academico} onSubmitEditing={() => input_institucion.current.focus()}/>
                                                            </View>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                                <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año} />
                                                            </View>
                                                        </View>
                                                    </>
                                        :
                                            <></>
                                    }

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Estudias actualmente' : 'Are you studying at the moment?'} />
                                            <Picker 
                                                fieldName={'estudiasActualmente_3'}
                                                items={closeOptions} 
                                                handleAction_uno={handleAction_uno}
                                                contador={1}
                                                required={false}
                                            />
                                        </View>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                        {
                                            currentlyStudy
                                            &&
                                                <>
                                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Específica tu horario' : 'Especify schedule'} />
                                                    <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'horarioTurno_3'} ref={input_horario_turno} onSubmitEditing={() => input_otros_estudios.current.focus()}/>
                                                </>
                                        }
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Otros estudios' : 'Other studies'} />
                                            <InputForm status={true} placeholder={language === '1' ? 'Otros estudios' : 'Other studies'} fieldName={'otrosEstudios_3'} ref={input_otros_estudios} onSubmitEditing={() => input_paquetes_computacionales.current.focus()}/>
                                        </View>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Paquetes computacionales que manejas' : 'Computer programs that you handle'} />
                                            <InputForm status={true} placeholder='EXCEL, WORD, ETC ...' fieldName={'paquetesComputacionales_3'} ref={input_paquetes_computacionales}/>
                                        </View>
                                    </View>
                                    <TitleForms type={'title'} title={language === '1' ? 'Nivel de Inglés' : 'English level'} />
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de escritura' : 'Writing'} />
                                            <Picker
                                                fieldName={'nivelEscritura_3'}
                                                items={englishOptionsData} 
                                                required={true}
                                            />
                                        </View>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de lectura' : 'Reading'} />
                                            <Picker 
                                                fieldName={'nivelLectura_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de comprensión' : 'Comprehension'} />
                                            <Picker
                                                fieldName={'nivelComprension_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel conversacional' : 'Speaking'} />
                                            <Picker 
                                                fieldName={'nivelConversacional_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Dónde lo aprendiste' : 'Where did you learn it?'} />
                                            <Picker
                                                fieldName={'dondeAprendio_3'}
                                                items={dAprendioData}
                                            />
                                        </View>
                                    </View>
                                    <TitleForms type={'title'} title={language === '1' ? 'Experiencia laboral' : 'Work experience'} />
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? '¿Este sería tu primer empleo?' : 'This would be your first job?'} />
                                            <Picker 
                                                fieldName={'primerEmpleo_3'}
                                                items={closeOptions}
                                                handleAction_dos={handleAction_dos}
                                                contador={2}
                                            />
                                        </View>
                                    </View>
                                    {
                                        pEmpleo
                                        &&
                                            <>
                                                <TitleForms type={'title'} title={language === '1' ? 'Experiencia Laboral (Último Empleo)' : 'Work Experience (Last Job)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} fieldName={'nombreEmpresa_3'} ref={input_nombre_empresa} onSubmitEditing={() => input_giro.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Giro de la empresa' : 'Line of business'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Giro de la empresa' : 'Line of business'} fieldName={'giroEmpresa_3'} ref={input_giro} onSubmitEditing={() => input_puesto.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto' : 'Position'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Puesto' : 'Position'} fieldName={'puestoDesempeñado_3'} ref={input_puesto} onSubmitEditing={() => input_salario_inicial.current.focus()}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo inicial' : 'Starting salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioInicial_3'} ref={input_salario_inicial} onSubmitEditing={() => input_salario_final.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo final' : 'Final salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioFinal_3'} ref={input_salario_final}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de ingreso' : 'Starting date'} />
                                                        <DatePicker fieldName={'fechaIngreso_3'} language={language} />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de Salida' : 'End date'} />
                                                        <DatePicker fieldName={'fechaSalida_3'} language={language} />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'flex-start'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} fieldName={'motivoSalida_3'} ref={input_motivo_salida} onSubmitEditing={() => input_jefe_directo.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Jefe directo' : 'Direct manager'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Nombre completo jefe directo' : 'Full name direct manager'} fieldName={'jefeDirecto_3'} ref={input_jefe_directo} onSubmitEditing={() => input_telefono_contacto.current.focus()}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Número teléfonico' : 'Phone number'} />
                                                        <InputForm maxLength={10} keyboardType='numeric' status={true} placeholder={language === '1' ? 'Teléfono de Contacto' : 'Contact Phone Number'} fieldName={'jefeDirectoTelefono_3'} ref={input_telefono_contacto} />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Podemos contactarlo?' : 'Can we contact them?'} />
                                                        <Picker 
                                                            fieldName={'contactar_3'}
                                                            items={closeOptions}
                                                            handleAction_tres={handleAction_tres}
                                                            contador={3}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        {
                                                            contact
                                                            ?
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Por qué?' : 'Why?'} />
                                                                    <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'porque_3'} />
                                                                </>
                                                            :
                                                            <></>
                                                        }
                                                    </View>
                                                </View>
                                                <TitleForms type={'title'} title={language === '1' ? 'Segunda Experiencia Laboral (Opcional)' : 'Second Work Experience (Optional)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} fieldName={'nombreEmpresaOpcional_3'} ref={input_nombre_empresa_opcional} onSubmitEditing={() => input_giro_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Giro de la empresa' : 'Line of business'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Giro de la empresa' : 'Line of business'} fieldName={'giroEmpresaOpcional_3'} ref={input_giro_opcional} onSubmitEditing={() => input_puesto_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto' : 'Position'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Puesto' : 'Position'} fieldName={'puestoDesempeñadoOpcional_3'} ref={input_puesto_opcional} onSubmitEditing={() => input_salario_inicial_opcional.current.focus()}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo inicial' : 'Starting salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioInicialOpcional_3'} ref={input_salario_inicial_opcional} onSubmitEditing={() => input_salario_final_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo final' : 'Final salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioFinalOpcional_3'} ref={input_salario_final_opcional}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de ingreso' : 'Starting date'} />
                                                        <DatePicker fieldName={'fechaIngresoOpcional_3'} language={language} />
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de Salida' : 'End date'} />
                                                        <DatePicker fieldName={'fechaSalidaOpcional_3'} language={language} />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'flex-start'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de salida' : 'Reason for exit'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} fieldName={'motivoSalidaOpcional_3'} ref={input_motivo_salida_opcional} onSubmitEditing={() => input_jefe_directo_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Jefe directo' : 'Direct manager'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Jefe directo' : 'Full name direct manager'} fieldName={'jefeDirectoOpcional_3'} ref={input_jefe_directo_opcional} onSubmitEditing={() => input_telefono_contacto_opcional.current.focus()}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Número teléfonico' : 'Phone number'} />
                                                        <InputForm keyboardType='numeric' maxLength={10} status={true} placeholder={language === '1' ? 'Número teléfonico' : 'Phone number'}  fieldName={'jefeDirectoTelefonoOpcional_3'} ref={input_telefono_contacto_opcional}/>     
                                                    </View>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Podemos contactarlo?' : 'Can we contact them?'} />
                                                        <Picker 
                                                            fieldName={'contactarOpcional_3'}
                                                            items={closeOptions}
                                                            handleAction_cuatro={handleAction_cuatro}
                                                            contador={4}
                                                            required={false}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        {
                                                            contactOptional
                                                            ?
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Por qué?' : 'Why?'} />
                                                                    <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'porqueOpcional_3'} />
                                                                </>
                                                            :
                                                            <></>
                                                        }
                                                    </View>
                                                </View>
                                                
                                            </>
                                    }
                                </View>
                            :
                                <>
                                    <TitleForms type={'title'} title={language === '1' ? 'Formación académica' : 'Education'} />
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel escolar' : 'School level'} />
                                            <Picker 
                                                fieldName={'nivelEscolar_3'}
                                                items={schoolLevelData}
                                                required={true}
                                                handleAction_cinco={handleAction_cinco}
                                                contador={5}
                                            />
                                        </View>
                                        {
                                            studyGrade === 1 || studyGrade === 2 || studyGrade === 3
                                            ?
                                                
                                                <View style={{flex: 1}}>
                                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Tienes un certificado?' : 'Do you have a study certificate?'} />
                                                    <Picker 
                                                        fieldName={'esCertificado_3'}
                                                        items={closeOptions}
                                                        required={true}
                                                    />
                                                </View>
                                            :
                                                <></>
                                        }
                                    </View>
                                    
                                    
                                    {
                                        studyGrade === 1 || studyGrade === 2 || studyGrade === 3 || studyGrade === 4 || studyGrade === 5 
                                        ?
                                            studyGrade === 1 || studyGrade === 2 || studyGrade === 3
                                            ?
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                        <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año} />
                                                    </View>
                                                </View>
                                            :
                                                studyGrade === 4
                                                ?
                                                    <>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Grado de Avance' : 'Degree of progress'} />
                                                                <Picker
                                                                    fieldName={'gradoAvance_3'}
                                                                    items={gradoAvanceData}
                                                                />
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Título académico' : 'Degree'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica tu título académico' : 'Especify degree'} fieldName={'tituloAcademico_3'} ref={input_titulo_academico} onSubmitEditing={() => input_institucion.current.focus()}/>
                                                            </View>
                                                            
                                                        </View>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                                <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año}/>
                                                            </View>
                                                        </View>
                                                    </>
                                                :
                                                    <>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Título académico' : 'Degree'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica tu título académico' : 'Especify degree'} fieldName={'tituloAcademico_3'} ref={input_titulo_academico} onSubmitEditing={() => input_institucion.current.focus()}/>
                                                            </View>
                                                        </View>
                                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Institución donde estudiaste' : 'Where did you study? (Institution’s name)'} />
                                                                <InputForm status={true} placeholder={language === '1' ? 'Específica el nombre de la institución' : 'Especify where did you study? (Institution’s name)'} fieldName={'institucion_3'} ref={input_institucion} onSubmitEditing={() => input_año.current.focus()}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <TitleForms type={'subtitle'} title={language === '1' ? 'Graduado(a)(año)' : 'Year of graduation'} />
                                                                <InputForm keyboardType='numeric' status={true} maxLength={4} placeholder={'(e. g. 2011)'} fieldName={'añoGraduacion_3'} ref={input_año}/>
                                                            </View>
                                                        </View>
                                                    </>
                                        :
                                            <></>
                                    }
                                    
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Estudias actualmente' : 'Are you studying at the moment?'} />
                                            <Picker 
                                                fieldName={'estudiasActualmente_3'}
                                                items={closeOptions} 
                                                handleAction_uno={handleAction_uno}
                                                contador={1}
                                                required={false}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            {
                                                currentlyStudy
                                                &&
                                                    <>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Específica tu horario' : 'Especify schedule'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'horarioTurno_3'} ref={input_horario_turno} onSubmitEditing={() => input_otros_estudios.current.focus()}/>
                                                    </>
                                            }
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Otros estudios' : 'Other studies'} />
                                            <InputForm status={true} placeholder={language === '1' ? 'Otros estudios' : 'Other studies'} fieldName={'otrosEstudios_3'} ref={input_otros_estudios} onSubmitEditing={() => input_paquetes_computacionales.current.focus()}/>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Paquetes computacionales que manejas' : 'Computer programs that you handle'} />
                                            <InputForm status={true} placeholder='EXCEL, WORD, ETC ...' fieldName={'paquetesComputacionales_3'} ref={input_paquetes_computacionales}/>
                                        </View>
                                    </View>

                                    <TitleForms type={'title'} title={language === '1' ? 'Nivel de Inglés' : 'English level'} />
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de escritura' : 'Writing'} />
                                            <Picker
                                                fieldName={'nivelEscritura_3'}
                                                items={englishOptionsData} 
                                                required={true}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de lectura' : 'Reading'} />
                                            <Picker 
                                                fieldName={'nivelLectura_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel de comprensión' : 'Comprehension'} />
                                            <Picker
                                                fieldName={'nivelComprension_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Nivel conversacional' : 'Speaking'} />
                                            <Picker 
                                                fieldName={'nivelConversacional_3'}
                                                items={englishOptionsData}
                                                required={true}
                                            />
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Dónde lo aprendiste' : 'Where did you learn it?'} />
                                            <Picker
                                                fieldName={'dondeAprendio_3'}
                                                items={dAprendioData}
                                            />
                                        </View>
                                    </View>

                                    <TitleForms type={'title'} title={language === '1' ? 'Experiencia laboral' : 'Work experience'} />

                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? '¿Este sería tu primer empleo?' : 'This would be your first job?'} />
                                            <Picker 
                                                fieldName={'primerEmpleo_3'}
                                                items={closeOptions}
                                                handleAction_dos={handleAction_dos}
                                                contador={2}
                                            />
                                        </View>
                                    </View>
                                    {
                                        pEmpleo
                                        &&
                                            <>
                                                <TitleForms type={'title'} title={language === '1' ? 'Experiencia Laboral (Último Empleo)' : 'Work Experience (Last Job)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} fieldName={'nombreEmpresa_3'} ref={input_nombre_empresa} onSubmitEditing={() => input_giro.current.focus()}/>
                                                    </View>

                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Giro de la empresa' : 'Line of business'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Giro de la empresa' : 'Line of business'} fieldName={'giroEmpresa_3'} ref={input_giro} onSubmitEditing={() => input_puesto.current.focus()}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto' : 'Position'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Puesto' : 'Position'} fieldName={'puestoDesempeñado_3'} ref={input_puesto} onSubmitEditing={() => input_salario_inicial.current.focus()}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo inicial' : 'Starting salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioInicial_3'} ref={input_salario_inicial} onSubmitEditing={() => input_salario_final.current.focus()}/>
                                                    </View>

                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo final' : 'Final salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioFinal_3'} ref={input_salario_final}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de ingreso' : 'Starting date'} />
                                                        <DatePicker fieldName={'fechaIngreso_3'} language={language} />
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de Salida' : 'End date'} />
                                                        <DatePicker fieldName={'fechaSalida_3'} language={language} />
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} fieldName={'motivoSalida_3'} ref={input_motivo_salida} onSubmitEditing={() => input_jefe_directo.current.focus()}/>
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Jefe directo' : 'Direct manager'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Nombre completo jefe directo' : 'Full name direct manager'} fieldName={'jefeDirecto_3'} ref={input_jefe_directo} onSubmitEditing={() => input_telefono_contacto.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Número teléfonico' : 'Phone number'} />
                                                        <InputForm maxLength={10} keyboardType='numeric' status={true} placeholder={language === '1' ? 'Teléfono de Contacto' : 'Contact Phone Number'} fieldName={'jefeDirectoTelefono_3'} ref={input_telefono_contacto}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Podemos contactarlo?' : 'Can we contact them?'} />
                                                        <Picker 
                                                            fieldName={'contactar_3'}
                                                            items={closeOptions}
                                                            handleAction_tres={handleAction_tres}
                                                            contador={3}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        {
                                                            contact
                                                            ?
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Por qué?' : 'Why?'} />
                                                                    <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'porque_3'} />
                                                                </>
                                                            :
                                                                <></>
                                                        }
                                                    </View>
                                                </View>

                                                <TitleForms type={'title'} title={language === '1' ? 'Segunda Experiencia Laboral (Opcional)' : 'Second Work Experience (Optional)'} />
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Empresa (Nombre)' : 'Company (Name)'} fieldName={'nombreEmpresaOpcional_3'} ref={input_nombre_empresa_opcional} onSubmitEditing={() => input_giro_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Giro de la empresa' : 'Line of business'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Giro de la empresa' : 'Line of business'} fieldName={'giroEmpresaOpcional_3'} ref={input_giro_opcional} onSubmitEditing={() => input_puesto_opcional.current.focus()}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Puesto' : 'Position'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Puesto' : 'Position'} fieldName={'puestoDesempeñadoOpcional_3'} ref={input_puesto_opcional} onSubmitEditing={() => input_salario_inicial_opcional.current.focus()}/>
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo inicial' : 'Starting salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioInicialOpcional_3'} ref={input_salario_inicial_opcional} onSubmitEditing={() => input_salario_final_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Sueldo final' : 'Final salary'} />
                                                        <InputForm keyboardType='numeric' status={true} placeholder='$0.00' fieldName={'salarioFinalOpcional_3'} ref={input_salario_final_opcional} />
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de ingreso' : 'Starting date'} />
                                                        <DatePicker fieldName={'fechaIngresoOpcional_3'} language={language} />
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de Salida' : 'End date'} />
                                                        <DatePicker fieldName={'fechaSalidaOpcional_3'} language={language} />
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Motivo de salida' : 'Reason for exit'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Motivo de Salida' : 'Reason for exit'} fieldName={'motivoSalidaOpcional_3'} ref={input_motivo_salida_opcional} onSubmitEditing={() => input_jefe_directo_opcional.current.focus()}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Jefe directo' : 'Direct manager'} />
                                                        <InputForm status={true} placeholder={language === '1' ? 'Jefe directo' : 'Full name direct manager'} fieldName={'jefeDirectoOpcional_3'} ref={input_jefe_directo_opcional} onSubmitEditing={() => input_telefono_contacto_opcional.current.focus()}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? 'Número teléfonico' : 'Phone number'} />
                                                        <InputForm keyboardType='numeric' maxLength={10} status={true} placeholder={language === '1' ? 'Número teléfonico' : 'Phone number'}  fieldName={'jefeDirectoTelefonoOpcional_3'} ref={input_telefono_contacto_opcional} />
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        <TitleForms type={'subtitle'} title={language === '1' ? '¿Podemos contactarlo?' : 'Can we contact them?'} />
                                                        <Picker 
                                                            fieldName={'contactarOpcional_3'}
                                                            items={closeOptions}
                                                            handleAction_cuatro={handleAction_cuatro}
                                                            contador={4}
                                                            required={false}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                    <View style={{flex: 1, marginRight: '3%'}}>
                                                        {
                                                            contactOptional
                                                            ?
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Por qué?' : 'Why?'} />
                                                                    <InputForm status={true} placeholder={language === '1' ? 'Específica' : 'Especify'} fieldName={'porqueOpcional_3'} />
                                                                </>
                                                            :
                                                                <></>
                                                        }
                                                    </View>
                                                </View>
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
})