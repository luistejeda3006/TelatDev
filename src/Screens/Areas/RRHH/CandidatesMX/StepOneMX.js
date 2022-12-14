import React, {useEffect, useState, useRef} from 'react';
import {View, Alert, Linking, BackHandler, StyleSheet} from 'react-native';
import {InputForm, Picker, TitleForms, CheckBox, DatePicker, ProgressStepActions} from '../../../../components';
import generateCurp from '../../../../js/generateCurp'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import DeviceInfo from 'react-native-device-info';
import {baseUrl, live, login, siteKey, urlJobs} from '../../../../access/requestedData';
import {useConnection} from '../../../../hooks';
import {useFormikContext} from 'formik';
import {Blue} from '../../../../colors/colorsApp';
import {useDispatch, useSelector} from 'react-redux';
import {selectChecked, selectError, selectStep, selectVerified, setChecked, setError, setStep, setVerified} from '../../../../slices/progressStepSlice';
import {selectOrientation} from '../../../../slices/orientationSlice';
import {selectLanguageApp} from '../../../../slices/varSlice';
import {setStateOption, setStepOneMX} from '../../../../slices/applicationForm';
import tw from 'twrnc'

export default ({navigation, handleScrollTop = () => {}}) => {
    const dispatch = useDispatch()
    const orientation = useSelector(selectOrientation)
    const language = useSelector(selectLanguageApp)
    const input_nom = useRef()
    const input_pat = useRef()
    const input_mat = useRef()
    const step = useSelector(selectStep)
    const error = useSelector(selectError)
    const verified = useSelector(selectVerified)
    const checked = useSelector(selectChecked)


    const first = {label: language === '1' ? 'Seleccionar' : 'Select', value: 'SEL'}; 
    const NE = {label: language === '1' ? 'NACIDO EN EL EXTRANJERO' : 'BORN ABROAD', value: 'NE'};
    const [statesData, setStatesData] = useState([])
    
    const {hasConnection} = useConnection();

    const handleChecked = () => {
        dispatch(setChecked(!checked))
        dispatch(setError(!error))
        setFilters({...filters, politics: !politics})
        if(!politics && !verified) captchaForm.show()
    }

    const getStates = async () => {
        try{
            const body = {
                'action': 'get_estados',
                'login': login,
                'live': live
            }
    
            const request = await fetch(urlJobs, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
    
            const {response, status} = await request.json();
            if(status === 200){
                let newArray = response
                newArray = [first, ...newArray]
                newArray = [...newArray, NE]
                setStatesData(newArray)
            }
        }catch(e){
            Alert.alert(
                language === '1' ? 'Error de Conexi??n' : 'Connection Failed',
                language === '1' ? 'Por favor, Verifique su Conexi??n de Internet' : 'Please, Verify Internet Connection',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    useEffect(() => {
        getStates()
    },[hasConnection])
    
    const genderData = [
        first,
        {label: language === '1' ? 'FEMENINO' : 'FEMALE', value: 'M'},
        {label: language === '1' ? 'MASCULINO' : 'MALE', value: 'H'},
    ]

    const birthPlaceData = statesData

    const [filters, setFilters] = useState({
        show: false,
        politics: false,
        timestamp: new Date(),
        initialDate: language === '1' ? 'No seleccionada' : 'Not selected',
        initialDateShow: language === '1' ? 'No seleccionada' : 'Not selected',
        initialGender: language === '1' ? 'Seleccionar' : 'Select',
        initialPlace: language === '1' ? 'Seleccionar' : 'Select',
        visibility: false,
        current: new Date(),
        savedDate: '',
    });
    const {initialDate, show, politics, visibility} = filters;
    
    const {submitForm, values} = useFormikContext();
    const {nombres_1, apellidoPaterno_1, apellidoMaterno_1, genero_1, lugarNacimiento_1, fechaNacimiento_1} = values;
    
    const Alerta = () => {
        Alert.alert(
            language === '1' ? 'Agendar una cita' : 'Make an appointment', 
            language === '1' ? 'Ya existe un registro con esta informaci??n, por favor verifique sus datos.' : 'There is already a record with this information, please verify your data.',
            [
                {
                    text: language === '1' ? 'Entendido' : 'OK',
                    style: 'OK'
                },
            ]
        )
    }

    const handleValues = async () => {
        if(nombres_1 === undefined || nombres_1 === '' || fechaNacimiento_1 === undefined || fechaNacimiento_1 === '' || apellidoPaterno_1 === undefined || apellidoPaterno_1 === '' || apellidoMaterno_1 === undefined || apellidoMaterno_1 === '' || genero_1 === undefined || genero_1 === 'SEL' || lugarNacimiento_1 === undefined || lugarNacimiento_1 === 'SEL'){
            Alert.alert(
                language === '1' ? 'Campos Vac??os' : 'Empty Fields',
                language === '1' ? 'Revise y llene los campos faltantes' : 'Review and fill in the missing fields',
                [
                    { text: 'OK'}
                ]
            )
        }

        else {
            if(verified) {
                let curp = generateCurp(nombres_1, apellidoPaterno_1, apellidoMaterno_1, fechaNacimiento_1, genero_1, lugarNacimiento_1)
                const obj_1 = {
                    info_nombre: nombres_1.toUpperCase(),
                    info_apellido_p: apellidoPaterno_1.toUpperCase(),
                    info_apellido_m: apellidoMaterno_1.toUpperCase(),
                    info_fecha_nacimiento: fechaNacimiento_1,
                    info_sexo: genero_1,
                    info_lugar_nacimiento: lugarNacimiento_1,
                    info_curp: curp,
                    info_rfc: curp.substring(0,10),
                    /* info_edad: age, este se tiene que descomentar para que funcione*/
                }

                console.log('obj: ', obj_1)
                
                let data = null;
                let key = 'stepOne'
                let keyState = 'place';

                const stateSend = statesData.find(x => x.value === lugarNacimiento_1 && x.label)
                
                try{
                    const body = {
                        'action': 'get_rfc',
                        'data':{
                            'rfc': obj_1.info_rfc,
                        },
                        'login': login,
                        'live': live
                    }
        
                    const request = await fetch(urlJobs, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body)
                    });
            
                    const {response, status} = await request.json();
                    if(status === 200){
                        dispatch(setStateOption(stateSend.label))
                        dispatch(setStepOneMX(obj_1))
                        dispatch(setStep(step + 1))
                        handleScrollTop()
                    }

                    else if(status === 400){
                        Alerta()
                    }
                }catch(e){
                    Alert.alert(
                        language === '1' ? 'Error de Conexi??n' : 'Connection Failed',
                        language === '1' ? 'Por favor, Verifique su Conexi??n de Internet' : 'Please, Verify Internet Connection',
                        [
                            { text: 'OK'}
                        ]
                    )
                }
            }
            else {
                Alert.alert(
                    language === '1' ? 'Captcha Incompleto' : 'Incomplete Captcha',
                    language === '1' ? 'Por favor, revise y complete la verificaci??n del captcha' : 'Please, review and complete captcha verification',
                    [
                        { text: 'OK'}
                    ]
                )
            }
        }
    }

    useEffect(() => {
        const backAction = () => {
            Alert.alert(
                language === '1' ? 'Cancelar Solicitud' : 'Cancel Request',
                language === '1' ? '??Est??s seguro(a), que desea cancelar tu solicitud? \n\nSe perder??n los datos ingresados\n' : 'Are you sure you want to cancel your request? \n\nThe data entered will be lost\n', [
                {
                    text: language === '1' ? 'Cancelar' : 'Cancel',
                    onPress: () => null,
                    style: 'cancel'
                },
                { text: language === '1' ? 'S??, estoy seguro' : 'Yes, I am sure', onPress: () => navigation.navigate('Choose') }
            ]);
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
    
        return () => backHandler.remove();
    }, [language]);

    const onMessage = event => {
        if (event && event.nativeEvent.data) {
            if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
                setFilters({...filters, politics: !politics})
                dispatch(setError(true))
                dispatch(setChecked(!checked))
                captchaForm.hide();
                return;
            } else {
                dispatch(setVerified(event.nativeEvent.data))
                dispatch(setError(false))
                captchaForm.hide()
            }
        }
    }

    return (
        <>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={tw`self-stretch px-4.5`}>
                    {
                        orientation === 'PORTRAIT'
                        ?
                            <>
                                <TitleForms type={'title'} title={language === '1' ? 'Informaci??n B??sica' : 'Basic Information'}/>
                                <TitleForms type={'subtitle'} title={language === '1' ? 'Nombre(s)' : 'Name(s)'} />
                                <InputForm
                                    status={true}
                                    placeholder={language === '1' ? 'Nombre(s)' : 'Name(s)'}
                                    fieldName={'nombres_1'}
                                    ref={input_nom}
                                    onSubmitEditing={() => input_pat.current.focus()}
                                />
                                <TitleForms type={'subtitle'} title={language === '1' ? 'Apellido paterno' : 'Last name'} />
                                <InputForm
                                    status={true}
                                    placeholder={language === '1' ? 'Apellido paterno' : 'Last name'}
                                    fieldName={'apellidoPaterno_1'}
                                    ref={input_pat}
                                    onSubmitEditing={() => input_mat.current.focus()}
                                />
                                <TitleForms type={'subtitle'} title={language === '1' ? 'Apellido materno' : 'Second last name'} />
                                <InputForm 
                                    status={true} 
                                    placeholder={language === '1' ? 'Apellido materno' : 'Second last name'}
                                    fieldName={'apellidoMaterno_1'}
                                    ref={input_mat}
                                />
                                <TitleForms type={'subtitle'} title={language === '1' ? 'Fecha de nacimiento' : 'Date of birth'} />
                                <DatePicker label={fechaNacimiento_1 ? `${fechaNacimiento_1.substring(8,10)}-${fechaNacimiento_1.substring(5,7)}-${fechaNacimiento_1.substring(0,4)}` : ''} fieldName={'fechaNacimiento_1'} language={language} required={true}/>
                                <TitleForms type={'subtitle'} title={language === '1' ? 'G??nero' : 'Gender'} />
                                <Picker
                                    fieldName={'genero_1'}
                                    items={genderData}
                                />
                                <TitleForms type={'subtitle'} title={language === '1' ? 'Lugar de nacimiento' : 'Place of birth'} />
                                <Picker 
                                    fieldName={'lugarNacimiento_1'}
                                    items={birthPlaceData}
                                />
                                <CheckBox onChecked={() => handleChecked()} checked={checked} legend={language === '1' ? 'He le??do y acepto la Pol??tica de Privacidad' : 'I???ve read and accepted the Privacy Policy'} color={Blue} isUnderline={true} fontSize={15} unique={true} handlePress={async () => await Linking.openURL('https://telat-group.com/aviso-de-privacidad')}/>
                                <ProgressStepActions language={language} handleNext={handleValues} />
                            </>
                        :
                            <></>
                    }
                </View>
            </KeyboardAwareScrollView>
            <View style={tw`flex-1 justify-center items-center`}>
                <ConfirmGoogleCaptcha
                    ref={_ref => captchaForm = _ref}
                    siteKey={siteKey}
                    baseUrl={baseUrl}
                    languageCode={language === '1' ? 'es' : 'en'}
                    onMessage={e => onMessage(e)}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow:1,
    }
})