import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Alert, Linking, BackHandler} from 'react-native';
import {InputForm, Picker, TitleForms, CheckBox, ProgressStepActions, DatePicker, MultiTextForm} from '../../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import {baseUrl, live, login, siteKey, urlJobs, contactEmail} from '../../../../access/requestedData';
import {useFormikContext} from 'formik';
import {Blue} from '../../../../colors/colorsApp';
import {useDispatch, useSelector} from 'react-redux';
import {selectError, selectStep, selectVerified, selectChecked, setError, setStep, setChecked, setVerified} from '../../../../slices/progressStepSlice';
import {selectOrientation} from '../../../../slices/orientationSlice';
import {setStepOneUSA} from '../../../../slices/applicationForm';
import tw from 'twrnc'

export default ({navigation, handleScrollTop = () => {}}) => {
    const orientation = useSelector(selectOrientation)
    const [statesData, setStatesData] = useState([])
    const [hiden, setHiden] = useState(true)
    const dispatch = useDispatch()
    const step = useSelector(selectStep)
    const error = useSelector(selectError)
    const verified = useSelector(selectVerified)
    const checked = useSelector(selectChecked)

    const input_nombre = useRef()
    const input_last = useRef()
    const input_ssn = useRef()
    const input_email = useRef()
    const input_phone = useRef()
    const input_alt_phone = useRef()
    const input_street = useRef()
    const input_city = useRef()
    const input_state = useRef()
    const input_zipcode = useRef()
    
    const input_emer_name = useRef()
    const input_emer_phone = useRef()
    const input_id = useRef()
    const input_id_state = useRef()
    const input_referred_by = useRef()
    const input_desired_position = useRef()

    const first = {label: 'PLEASE SELECT ONE', value: 'SEL'};

    const closeOptions = [
        first,
        {label: 'NO', value: '0'},
        {label: 'YES', value: '1'},
    ]

    useEffect(() => {
        if(statesData.length > 0){
            setHiden(false)
        }
    }, [statesData])
    
    const handleAction_uno = (index) => {
        setFilters({...filters, misdemeanor: index})
    }
    
    const handleAction_dos = (index) => {
        setFilters({...filters, adjudication: index})
    }

    const [filters, setFilters] = useState({
        visibility: false,
        show: false,
        politics: false,
        misdemeanor: 0,
        adjudication: 0
    });
    const {misdemeanor, adjudication, politics, visibility} = filters;
    
    const {submitForm, values} = useFormikContext();
    
    const {nombre_1, last_1, ssn_1, email_1, phone_1, alt_phone_1, street_1, city_1, state_1, zipcode_1, emer_name_1, emer_phone_1, id_1, id_state_1, id_exp_date_1, referred_by_1, desired_position_1, date_available_1, willing_work_1, list_any_1, misdemeanor_1, misdemeanor_detail_1, adjudication_1, adjudication_detail_1} = values;

    const Alerta = () => {
        Alert.alert(
            'Make an appointment',
            `Please be aware of your phone and email, we'll be contacting you soon to follow up with your application. \n\nFor more information:\n${contactEmail}`,
            [
                {
                    text: 'OK',
                    style: 'OK'
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

    const AlertaEmpty = () => {
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

    const handleFinal = async () => {
        let obj_1 = {
            info_nombre: nombre_1,
            info_apellido_p: last_1,
            info_ssn: ssn_1,
            info_email: email_1,
            info_telefono_celular: phone_1,
            info_telefono_fijo: alt_phone_1,
            info_calle: street_1,
            info_ciudad: city_1,
            info_estado: state_1,
            info_cp: zipcode_1,
            infom_contacto: emer_name_1,
            infom_telefono: emer_phone_1,
            info_curp: id_1,
            info_doc_state_id: id_state_1,
            info_doc_expiracion: id_exp_date_1,
            cand_reclutamiento_desc: referred_by_1,
            cand_puesto_solicitado: desired_position_1,
            cand_fecha_disponibilidad: date_available_1,
            cand_disponibilidad_turno: willing_work_1,
            cand_list_disponibilidad: list_any_1,
            info_convicto: misdemeanor_1,
            info_convicto_details: misdemeanor_detail_1,
            info_adjudicacion: adjudication_1,
            info_adjudication_details: adjudication_detail_1
        }

        try{
            const body = {
                'action': 'get_email',
                'data': {
                    'email': email_1,
                    'telefono': phone_1
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
                dispatch(setStepOneUSA(obj_1))
                dispatch(setStep(step + 1))
                handleScrollTop()
            }

            else if(status === 400) {
                Alerta()
            }
        }catch(e){
            console.log('error: ', e)
            Alert.alert(
                'Connection Failed',
                'Please, Verify Internet Connection',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    const handleValidateAdjudication = () => {
        if(adjudication_1 === undefined || adjudication_1 === 'SEL'){
            AlertaEmpty()
        } else {
            if(adjudication_1 === '0'){
                handleFinal()
            } else {
                if(adjudication_detail_1 === undefined || adjudication_detail_1 === ''){
                    AlertaEmpty()
                } else {
                    handleFinal()
                }
            }
        }
    }

    const handleValidateMisdemeanor = () => {
        if(misdemeanor_1 === undefined || misdemeanor_1 === 'SEL'){
            AlertaEmpty()
        } else {
            if(misdemeanor_1 === '0'){
                handleValidateAdjudication()
            } else {
                if(misdemeanor_detail_1 === undefined || misdemeanor_detail_1 === ''){
                    AlertaEmpty()
                } else {
                    handleValidateAdjudication()
                }
            }
        }
    }

    const handleValues = () => {
        let key = 'stepOne'
        if(nombre_1 === undefined || nombre_1 === '' || last_1 === undefined || last_1 === '' || ssn_1 === undefined || ssn_1 === '' || email_1 === undefined || email_1 === '' || phone_1 === undefined || phone_1 === '' || street_1 === undefined || street_1 === '' || city_1 === undefined || city_1 === '' || state_1 === undefined || state_1 === '' || zipcode_1 === undefined || zipcode_1 === '' || emer_name_1 === undefined || emer_phone_1 === '' || id_1 === undefined || id_1 === '' || id_state_1 === undefined || id_state_1 === '' || id_exp_date_1 === undefined || id_exp_date_1 === '' || referred_by_1 === undefined || referred_by_1 === '' || desired_position_1 === undefined || desired_position_1 === '' || date_available_1 === undefined || date_available_1 === '' || willing_work_1 === undefined || willing_work_1 === '' || list_any_1 === undefined || list_any_1 === ''){
            AlertaEmpty()
        }
        else {
            if(verified) {
                handleValidateMisdemeanor()
            }
            else {
                Alert.alert(
                    'Incomplete Captcha',
                    'Please, review and complete captcha verification',
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
    }, []);
    
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
                newArray = [...newArray]
                setStatesData(newArray)
            }
        }catch(e){
            Alert.alert(
                'Connection Failed',
                'Please, Verify Internet Connection',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    useEffect(() => {
        getStates()
    },[])

    const birthPlaceData = statesData

    return (
        <>
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
                                <TitleForms type={'title'} title={'Personal Information'}/>
                                <TitleForms type={'subtitle'} title={'Name(s)'} />
                                <InputForm
                                    status={true}
                                    placeholder={'NAME(S)'}
                                    fieldName={'nombre_1'}
                                    ref={input_nombre}
                                    onSubmitEditing={() => input_last.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'Last Name'} />
                                <InputForm
                                    status={true}
                                    placeholder={'LAST NAME'}
                                    fieldName={'last_1'}
                                    ref={input_last}
                                    onSubmitEditing={() => input_ssn.current.focus()}
                                />
                                
                                <TitleForms type={'subtitle'} title={'SSN'} />
                                <InputForm
                                    status={true}
                                    placeholder={'SSN'}
                                    fieldName={'ssn_1'}
                                    ref={input_ssn}
                                    onSubmitEditing={() => input_email.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'E-mail Address'} />
                                <InputForm
                                    status={true}
                                    keyboardType='email-address'
                                    placeholder={'example@example.com'}
                                    fieldName={'email_1'}
                                    capitalize={false}
                                    ref={input_email}
                                    onSubmitEditing={() => input_phone.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'Phone Number'} />
                                <InputForm
                                    status={true}
                                    keyboardType='number-pad' 
                                    returnKeyType={'done'}
                                    placeholder={'PHONE NUMBER'}
                                    fieldName={'phone_1'}
                                    ref={input_phone}
                                    onSubmitEditing={() => input_alt_phone.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'Alternate Phone'} />
                                <InputForm
                                    status={true}
                                    keyboardType='number-pad' 
                                    returnKeyType={'done'}
                                    placeholder={'ALTERNATE NUMBER'}
                                    fieldName={'alt_phone_1'}
                                    ref={input_alt_phone}
                                    onSubmitEditing={() => input_street.current.focus()}
                                />

                                <TitleForms type={'title'} title={'Mailing Address'}/>

                                <TitleForms type={'subtitle'} title={'Street'} />
                                <InputForm
                                    status={true}
                                    placeholder={'STREET'}
                                    fieldName={'street_1'}
                                    ref={input_street}
                                    onSubmitEditing={() => input_city.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'City'} />
                                <InputForm
                                    status={true}
                                    placeholder={'CITY'}
                                    fieldName={'city_1'}
                                    ref={input_city}
                                    onSubmitEditing={() => input_state.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'State'} />
                                <InputForm
                                    status={true}
                                    placeholder={'STATE'}
                                    fieldName={'state_1'}
                                    ref={input_state}
                                    onSubmitEditing={() => input_zipcode.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'Zip Code'} />
                                <InputForm
                                    status={true}
                                    keyboardType='number-pad' 
                                    returnKeyType={'done'}
                                    placeholder={'ZIP CODE'}
                                    fieldName={'zipcode_1'}
                                    maxLength={5}
                                    ref={input_zipcode}
                                    onSubmitEditing={() => input_emer_name.current.focus()}
                                />

                                <TitleForms type={'title'} title={'Emergency Contact'}/>
                                
                                <TitleForms type={'subtitle'} title={'Name'} />
                                <InputForm
                                    status={true}
                                    placeholder={'EMERGENCY CONTACT NAME'}
                                    fieldName={'emer_name_1'}
                                    ref={input_emer_name}
                                    onSubmitEditing={() => input_emer_phone.current.focus()}
                                />
                                
                                <TitleForms type={'subtitle'} title={'Phone'} />
                                <InputForm
                                    status={true}
                                    keyboardType='number-pad' 
                                    returnKeyType={'done'}
                                    placeholder={'EMERGENCY PHONE NUMBER'}
                                    fieldName={'emer_phone_1'}
                                    ref={input_emer_phone}
                                    onSubmitEditing={() => input_id.current.focus()}
                                />

                                <TitleForms type={'title'} title={'ID'}/>

                                <TitleForms type={'subtitle'} title={'Valid Driver License or ID No.'} />
                                <InputForm
                                    status={true}
                                    placeholder={'VALID ID'}
                                    fieldName={'id_1'}
                                    ref={input_id}
                                    onSubmitEditing={() => input_id_state.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'ID State'} />
                                <InputForm
                                    status={true}
                                    placeholder={'ID STATE'}
                                    fieldName={'id_state_1'}
                                    ref={input_id_state}
                                />

                                <TitleForms type={'subtitle'} title={'ID Expiration Date'} />
                                <DatePicker fieldName={'id_exp_date_1'} language={'2'} required={true}/>

                                <TitleForms type={'title'} title={'Position'}/>
                                <TitleForms type={'subtitle'} title={'Referred by? Or how did you hear about DataXport/Telat Project?'} />
                                <InputForm
                                    status={true}
                                    placeholder={'REFERRED BY? OR HOW DID YOU HEAR ABOUT DATAXPORT/TELAT PROJECT'}
                                    fieldName={'referred_by_1'}
                                    ref={input_referred_by}
                                    onSubmitEditing={() => input_desired_position.current.focus()}
                                />

                                <TitleForms type={'subtitle'} title={'Position Desired'} />
                                <InputForm
                                    status={true}
                                    placeholder={'POSITION DESIRED'}
                                    fieldName={'desired_position_1'}
                                    ref={input_desired_position}
                                />

                                <TitleForms type={'subtitle'} title={'Date Available to Start'} />
                                <DatePicker fieldName={'date_available_1'} language={'2'} required={true}/>

                                <TitleForms type={'subtitle'} title={'Willing to Work Overtime'} />
                                <DatePicker fieldName={'willing_work_1'} language={'2'} required={true}/>

                                <TitleForms type={'title'} title={'Restrictions'}/>
                                
                                <TitleForms type={'subtitle'} title={'List any schedule restrictions, including dates/times unavailable to work'} />
                                <MultiTextForm
                                    status={true}
                                    placeholder={'LIST ANY SCHEDULE RESTRICTIONS, INCLUDING DATES/TIMES UNAVAILABLE TO WORK'}
                                    fieldName={'list_any_1'}
                                    isTextArea={true}
                                    required={true}
                                    ref={input_referred_by}
                                />

                                <TitleForms type={'title'} title={'Important'}/>
                                <TitleForms type={'subtitle'} title={'A conviction itself may or may not disqualify you from employment, however, a false statement will disqualify you'} />
                                <TitleForms type={'subtitle'} title={'Have you ever been convicted of a misdemeanor or felony?'} />
                                <Picker
                                    fieldName={'misdemeanor_1'}
                                    items={closeOptions}
                                    handleAction_uno={handleAction_uno}
                                    contador={1}
                                />
                                {
                                    misdemeanor === 2
                                    &&
                                        <>
                                            <TitleForms type={'subtitle'} title={'If you answered "yes", please explain in concise detail giving dates and nature of the offence(s), name and location of court(s), and disposition of case(s). A conviction alone may or may not disqualify you from employment. However, a false statement will disqualify you.'} />
                                            <MultiTextForm
                                                status={true}
                                                placeholder={'EXPLAIN IN CONCISE DETAIL'}
                                                fieldName={'misdemeanor_detail_1'}
                                                isTextArea={true}
                                                required={true}
                                                ref={input_referred_by}
                                            />
                                            <View style={tw`h-3 self-stretch`}/>
                                        </>
                                }
                                <TitleForms type={'subtitle'} title={'Have you ever been subjected to a deferred adjudication (sentenced to probation) of any charge'} />
                                <Picker
                                    fieldName={'adjudication_1'}
                                    items={closeOptions}
                                    handleAction_uno={handleAction_dos}
                                    contador={1}
                                />
                                {
                                    adjudication === 2
                                    &&
                                        <>
                                            <TitleForms type={'subtitle'} title={'If you answered "yes", please explain in concise detail giving dates and nature of the offence(s), name and location of court(s), and disposition of case(s). A conviction alone may or may not disqualify you from employment. However, a false statement will disqualify you.'} />
                                            <MultiTextForm
                                                status={true}
                                                placeholder={'EXPLAIN IN CONCISE DETAIL'}
                                                fieldName={'adjudication_detail_1'}
                                                isTextArea={true}
                                                required={true}
                                                ref={input_referred_by}
                                            />
                                            <View style={tw`h-3 self-stretch`}/>
                                        </>
                                }

                                {
                                    hiden
                                    &&
                                        <Picker 
                                            fieldName={'temporal'}
                                            items={birthPlaceData}
                                        />
                                }
                                <CheckBox onChecked={() => handleChecked()} checked={checked} legend={'I’ve read and accepted the Privacy Policy'} color={Blue} isUnderline={true} fontSize={15} unique={true} handlePress={async () => await Linking.openURL('https://telat-group.com/aviso-de-privacidad')}/>
                                <ProgressStepActions handleNext={() => handleValues()} language={'2'} type={2}/>
                            </>
                        :
                            <></>
                    }
                </View>
            </KeyboardAwareScrollView>
            <View style={styles.container}>
                <ConfirmGoogleCaptcha
                    ref={_ref => captchaForm = _ref}
                    siteKey={siteKey}
                    baseUrl={baseUrl}
                    languageCode={'en'}
                    onMessage={e => onMessage(e)}
                />
            </View>
        </>
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
    box: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: '#EAEAEA',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        backgroundColor: '#fff',
        marginBottom: 10
    },
    picker: {
        borderColor: '#f1f1f1',
        borderWidth: 1,
        marginBottom: 10,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagen: {
        width: '65%',
        height: '65%',
        borderRadius: 25,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modal: {
        flex: 1,
        padding: 15,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: {
            height: 0,
            width: 3,
        },
    },
})