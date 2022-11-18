import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Alert, Linking, BackHandler} from 'react-native';
import {InputForm, Politics, Picker, TitleForms, CheckBox} from '../../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import {ProgressStep} from 'react-native-progress-steps';
import DeviceInfo from 'react-native-device-info';
import {baseUrl, live, login, siteKey, urlJobs, contactEmail} from '../../../../access/requestedData';
import {useOrientation} from '../../../../hooks';
import {useFormikContext} from 'formik';
import {Blue} from '../../../../colors/colorsApp';

export default ({navigation, language, orientation, ...rest}) => {
    const {isTablet} = DeviceInfo;
    const input_nom = useRef()
    const input_last = useRef()
    const input_email = useRef()
    const input_phone_number = useRef()
    const input_home_number = useRef()
    const input_address = useRef()
    const input_city = useRef()
    const input_state = useRef()
    const input_zip = useRef()
    const input_position = useRef()
    const input_salary = useRef()

    const first = {label: 'Select', value: 'SEL'};
    const [verified, setVerified] = useState('')
    const [recruitmentData, setRecruitmentData] = useState([])
    const [checked, setChecked] = useState(false);

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    useEffect(() => {
        setRecruitmentData([
            first,
            {label: 'Job Board', value: 'Job Board'},
            {label: 'Social Media', value: 'Social Media'},
            {label: 'Referred', value: 'Referred'},
            {label: 'Other', value: 'Other'},
        ])
    },[])

    const jobBoardData = [
        first,
        {label: 'Indeed', value: 'INDEED'},
        {label: 'Glassdoor', value: 'GLASSDOOR'},
        {label: 'LinkedIn', value: 'LINKEDIN'},
        {label: 'Monster', value: 'MONSTER'},
    ]

    const socialNetworksData = [
        first,
        {label: 'Facebook', value: 'FACEBOOK'},
        {label: 'Instagram', value: 'INSTAGRAM'},
        {label: 'Google', value: 'GOOGLE'},
    ]

    const closeOptions = [
        first,
        {label: 'NO', value: '0'},
        {label: 'YES', value: '1'},
    ]

    const handleAction_dos = (index) => {
        setFilters({...filters, recruitment: index})
    }

    const [filters, setFilters] = useState({
        recruitment: 'Select option',
        visibility: false,
        show: false,
        politics: false,
        error: false,
    });
    const {recruitment, politics, visibility, error} = filters;
    
    const {submitForm, values} = useFormikContext();
    
    const {
        nombre_1_US,
        lastName_1_US,
        email_1_US,
        phone_number_1_US,
        home_number_1_US,
        address_1_US,
        city_1_US,
        state_1_US,
        zip_1_US,
        position_1_US,
        recruitment_1_US,
        recruitmentDesc_1_US,
        Is18_1_US,
        legally_1_US

    } = values;

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

    const handleValues = async () => {
        let key = 'stepOne'
        if(address_1_US === undefined || address_1_US === '' || city_1_US === undefined || city_1_US === '' || email_1_US === undefined || email_1_US === '' || lastName_1_US === undefined || lastName_1_US === '' || nombre_1_US === undefined || nombre_1_US === '' || phone_number_1_US === undefined || phone_number_1_US === '' || recruitment_1_US === undefined || recruitment_1_US === '' || recruitmentDesc_1_US === undefined || recruitmentDesc_1_US === '' || state_1_US === undefined || state_1_US === '' || zip_1_US === undefined || zip_1_US === '' || position_1_US === undefined || position_1_US === ''|| Is18_1_US === undefined || Is18_1_US === 'SEL' || legally_1_US === undefined || legally_1_US === 'SEL'){
            Alert.alert(
                'Empty Fields',
                'Review and fill in the missing fields',
                [
                    { text: 'OK'}
                ]
            )
        }
        else {
            if(verified) {
                let obj_1 = {
                    info_nombre: nombre_1_US,
                    info_apellido_p: lastName_1_US,
                    info_email: email_1_US,
                    info_telefono_fijo: home_number_1_US,
                    info_telefono_celular: phone_number_1_US,
                    info_ciudad: city_1_US,
                    info_estado: state_1_US,
                    info_calle: address_1_US,
                    info_cp: zip_1_US,
                    cand_puesto_solicitado: position_1_US,
                    cand_medio_reclutamiento: recruitment_1_US,
                    cand_reclutamiento_desc: recruitmentDesc_1_US,
                    cand_prueba_edad:Is18_1_US,
                    cand_legal:legally_1_US
                }

                try{
                    const body = {
                        'action': 'get_email',
                        'data': email_1_US,
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
            
                    const {response} = await request.json();
                    if(response.status === 200){
                        let data = await AsyncStorage.getItem(key) || '';
                        if(data) {
                            await AsyncStorage.removeItem(key).then(() => AsyncStorage.setItem(key, JSON.stringify(obj_1)));
                        }
                        else {
                            await AsyncStorage.setItem(key, JSON.stringify(obj_1));
                        }
                        setFilters({...filters, error: false});
                    }

                    else if(response.status === 400) {
                        setFilters({...filters, error: true})
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
    }, [language]);

    const onMessage = event => {
        if (event && event.nativeEvent.data) {
            if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
                setFilters({...filters, politics: !politics})
                setChecked(!checked)
                captchaForm.hide();
                return;
            } else {
                setVerified(event.nativeEvent.data)
                captchaForm.hide()
            }
        }
    }

    const handleChecked = () => {
        setChecked(!checked)
        setFilters({...filters, politics: !politics})
        if(!politics && !verified) captchaForm.show()
    }

    return (
        <>
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <ProgressStep
                    errors={error}
                    {...rest}
                    nextBtnText={'Next'}
                    nextBtnTextStyle={{color: '#fff', backgroundColor: '#1177E9', padding: 12, borderRadius: 15, fontWeight: 'bold'}}
                    nextBtnStyle={{ textAlign: 'center', padding: 0 }}
                    previousBtnStyle={{ textAlign: 'center', padding: 0 }}
                    nextBtnDisabled={!politics} //!politics
                    onNext={() => handleValues()}
                >
                    <View style={{alignSelf: 'stretch', paddingHorizontal: 18}}>
                        {
                            orientationInfo.initial === 'PORTRAIT'
                            ?
                                !isTablet()
                                ?
                                    <>
                                        <TitleForms type={'title'} title={'Personal Information'}/>
                                        <TitleForms type={'subtitle'} title={'Name(s)'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'NAME(S)'}
                                            fieldName={'nombre_1_US'}
                                            ref={input_nom}
                                            onSubmitEditing={() => input_last.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'Last name'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'LAST NAME'}
                                            fieldName={'lastName_1_US'}
                                            ref={input_last}
                                            onSubmitEditing={() => input_email.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'E-mail'} />
                                        <InputForm 
                                            keyboardType='email-address'
                                            status={true} 
                                            placeholder='example@example.com'
                                            fieldName={'email_1_US'} 
                                            ref={input_email}
                                            autoCapitalize = 'none'
                                            onSubmitEditing={() => input_phone_number.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'Phone Number'} />
                                        <InputForm 
                                            keyboardType='numeric'
                                            status={true} 
                                            placeholder='PHONE NUMBER '
                                            fieldName={'phone_number_1_US'} 
                                            ref={input_phone_number}
                                            onSubmitEditing={() => input_home_number.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'Landline'} />
                                        <InputForm 
                                            keyboardType='numeric'
                                            status={true} 
                                            placeholder='LANDLINE NUMBER'
                                            fieldName={'home_number_1_US'} 
                                            ref={input_home_number}
                                            onSubmitEditing={() => input_address.current.focus()}
                                        />

                                        <TitleForms type={'title'} title={'Address'}/>
                                        <TitleForms type={'subtitle'} title={'Address'} />
                                        <InputForm
                                            status={true} 
                                            placeholder='ADDRESS'
                                            fieldName={'address_1_US'} 
                                            ref={input_address}
                                            onSubmitEditing={() => input_city.current.focus()}
                                        />

                                        <TitleForms type={'subtitle'} title={'City'} />
                                        <InputForm
                                            status={true} 
                                            placeholder='CITY'
                                            fieldName={'city_1_US'} 
                                            ref={input_city}
                                            onSubmitEditing={() => input_state.current.focus()}
                                        />

                                        <TitleForms type={'subtitle'} title={'State'} />
                                        <InputForm
                                            status={true} 
                                            placeholder='STATE'
                                            fieldName={'state_1_US'} 
                                            ref={input_state}
                                            onSubmitEditing={() => input_zip.current.focus()}
                                        />

                                        <TitleForms type={'subtitle'} title={'Zip Code'} />
                                        <InputForm
                                            maxLength={5}
                                            keyboardType='numeric'
                                            status={true} 
                                            placeholder='ZIP CODE'
                                            fieldName={'zip_1_US'} 
                                            ref={input_zip}
                                            onSubmitEditing={() => input_position.current.focus()}
                                        />
                                        
                                        <TitleForms type={'title'} title={'Application Information'}/>
                                        <TitleForms type={'subtitle'} title={'Position of Interest'} />
                                        <InputForm
                                            status={true} 
                                            placeholder='POSITION'
                                            fieldName={'position_1_US'} 
                                            ref={input_position}
                                            onSubmitEditing={() => input_salary.current.focus()}
                                        />
                                        <TitleForms type={'subtitle'} title={'What are your salary expectations for this position?'} />
                                        <InputForm
                                            status={true}
                                            placeholder={'$0.00'}
                                            keyboardType="numeric"
                                            fieldName={'salary_1_US'}
                                            ref={input_salary}
                                        />
                                        <TitleForms type={'subtitle'} title={'Are you at least 18 years old?'} />
                                        <Picker
                                            fieldName={'Is18_1_US'}
                                            items={closeOptions}
                                        />
                                        <TitleForms type={'subtitle'} title={'Are you legally eligible for employment in the United States?'} />
                                        <Picker
                                            fieldName={'legally_1_US'}
                                            items={closeOptions}
                                        />
                                        <TitleForms type={'subtitle'} title={'How did you hear about this position?'} />
                                        <Picker
                                            fieldName={'recruitment_1_US'}
                                            items={recruitmentData}
                                            handleAction_dos={handleAction_dos}
                                            contador={2}
                                        />

                                        {
                                            recruitment === 1 || recruitment === 2
                                            ?
                                                recruitment === 1
                                                ?
                                                    <>
                                                        <TitleForms type={'subtitle'} title={'Job Board'} />
                                                        <Picker
                                                            fieldName={'recruitmentDesc_1_US'}
                                                            items={jobBoardData}
                                                        />
                                                    </>
                                                :
                                                    <>
                                                        <TitleForms type={'subtitle'} title={'Social Media'} />
                                                        <Picker
                                                            fieldName={'recruitmentDesc_1_US'}
                                                            items={socialNetworksData}
                                                        />
                                                    </>
                                            :
                                                recruitment === 3 || recruitment === 4
                                                ?
                                                    recruitment === 3
                                                    ?
                                                        <>
                                                            <TitleForms type={'subtitle'} title={'Name of the employee that is referring you'} />
                                                            <InputForm
                                                                status={true} 
                                                                placeholder='Enter the full name'
                                                                fieldName={'recruitmentDesc_1_US'} 
                                                                ref={input_email}
                                                            />
                                                        </>
                                                    :
                                                        <>
                                                            <TitleForms type={'subtitle'} title={'Other'} />
                                                            <InputForm
                                                                status={true} 
                                                                placeholder='Specify'
                                                                fieldName={'recruitmentDesc_1_US'} 
                                                                ref={input_email}
                                                            />
                                                        </>
                                                :
                                                    <></>
                                        }
                                        <CheckBox onChecked={() => handleChecked()} checked={checked} legend={'I’ve read and accepted the Privacy Policy'} color={Blue} isUnderline={true} fontSize={15} unique={true} handlePress={async () => await Linking.openURL('https://telat-group.com/en/privacity')}/>
                                    </>
                                :
                                    <>
                                        <TitleForms type={'title'} title={'Personal Information'}/>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Name(s)'} />
                                                <InputForm
                                                    status={true}
                                                    placeholder={'NAME(S)'}
                                                    fieldName={'nombre_1_US'}
                                                    ref={input_nom}
                                                    onSubmitEditing={() => input_last.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Last name'} />
                                                <InputForm
                                                    status={true}
                                                    placeholder={'LAST NAME'}
                                                    fieldName={'lastName_1_US'}
                                                    ref={input_last}
                                                    onSubmitEditing={() => input_email.current.focus()}
                                                />
                                            </View>
                                        </View>
                                        
                                        <TitleForms type={'subtitle'} title={'E-mail'} />
                                        <InputForm 
                                            keyboardType='email-address'
                                            status={true} 
                                            placeholder='example@example.com'
                                            fieldName={'email_1_US'} 
                                            ref={input_email}
                                            autoCapitalize = 'none'
                                            onSubmitEditing={() => input_phone_number.current.focus()}
                                        />

                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Phone Number'} />
                                                <InputForm 
                                                    keyboardType='numeric'
                                                    status={true}
                                                    placeholder='PHONE NUMBER '
                                                    fieldName={'phone_number_1_US'} 
                                                    ref={input_phone_number}
                                                    onSubmitEditing={() => input_home_number.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Landline'} />
                                                <InputForm 
                                                    keyboardType='numeric'
                                                    status={true} 
                                                    placeholder='LANDLINE NUMBER'
                                                    fieldName={'home_number_1_US'} 
                                                    ref={input_home_number}
                                                    onSubmitEditing={() => input_address.current.focus()}
                                                />
                                            </View>
                                        </View>

                                        <TitleForms type={'title'} title={'Address'}/>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Address'} />
                                                <InputForm
                                                    status={true} 
                                                    placeholder='ADDRESS'
                                                    fieldName={'address_1_US'} 
                                                    ref={input_address}
                                                    onSubmitEditing={() => input_city.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'City'} />
                                                <InputForm
                                                    status={true} 
                                                    placeholder='CITY'
                                                    fieldName={'city_1_US'} 
                                                    ref={input_city}
                                                    onSubmitEditing={() => input_state.current.focus()}
                                                />
                                            </View>
                                        </View>

                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'State'} />
                                                <InputForm
                                                    status={true} 
                                                    placeholder='STATE'
                                                    fieldName={'state_1_US'} 
                                                    ref={input_state}
                                                    onSubmitEditing={() => input_zip.current.focus()}
                                                    />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Zip Code'} />
                                                <InputForm
                                                    maxLength={5}
                                                    keyboardType='numeric'
                                                    status={true} 
                                                    placeholder='ZIP CODE'
                                                    fieldName={'zip_1_US'} 
                                                    ref={input_zip}
                                                    onSubmitEditing={() => input_position.current.focus()}
                                                />
                                            </View>
                                        </View>

                                        <TitleForms type={'title'} title={'Application Information'}/>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'\nPosition of Interest'} />
                                                <InputForm
                                                    status={true} 
                                                    placeholder='POSITION'
                                                    fieldName={'position_1_US'} 
                                                    ref={input_position}
                                                    onSubmitEditing={() => input_salary.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'What are your salary expectations for this position?'} />
                                                <InputForm
                                                    status={true}
                                                    placeholder={'$0.00'}
                                                    keyboardType="numeric"
                                                    fieldName={'salary_1_US'}
                                                    ref={input_salary}
                                                />
                                            </View>
                                        </View>
                                        
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'\nAre you at least 18 years old?'} />
                                                <Picker
                                                    fieldName={'Is18_1_US'}
                                                    items={closeOptions}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Are you legally eligible for employment in the United States?'} />
                                                <Picker
                                                    fieldName={'legally_1_US'}
                                                    items={closeOptions}
                                                />
                                            </View>
                                        </View>

                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'\nHow did you hear about this position?'} />
                                                <Picker
                                                    fieldName={'recruitment_1_US'}
                                                    items={recruitmentData}
                                                    handleAction_dos={handleAction_dos}
                                                    contador={2}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                {
                                                    recruitment === 1 || recruitment === 2
                                                    ?
                                                        recruitment === 1
                                                        ?
                                                            <>
                                                                <TitleForms type={'subtitle'} title={'Job Board'} />
                                                                <Picker
                                                                    fieldName={'recruitmentDesc_1_US'}
                                                                    items={jobBoardData}
                                                                />
                                                            </>
                                                        :
                                                            <>
                                                                <TitleForms type={'subtitle'} title={'Social Media'} />
                                                                <Picker
                                                                    fieldName={'recruitmentDesc_1_US'}
                                                                    items={socialNetworksData}
                                                                />
                                                            </>
                                                    :
                                                        recruitment === 3 || recruitment === 4
                                                        ?
                                                            recruitment === 3
                                                            ?
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={'Name of the employee that is referring you'} />
                                                                    <InputForm
                                                                        status={true} 
                                                                        placeholder='Enter the full name'
                                                                        fieldName={'recruitmentDesc_1_US'} 
                                                                        ref={input_email}
                                                                    />
                                                                </>
                                                            :
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={'Other'} />
                                                                    <InputForm
                                                                        status={true} 
                                                                        placeholder='Specify'
                                                                        fieldName={'recruitmentDesc_1_US'} 
                                                                        ref={input_email}
                                                                    />
                                                                </>
                                                        :
                                                            <></>
                                                }
                                            </View>
                                        </View>
                                        <CheckBox onChecked={() => handleChecked()} checked={checked} legend={'I’ve read and accepted the Privacy Policy'} color={Blue} isUnderline={true} fontSize={15} unique={true} handlePress={async () => await Linking.openURL('https://telat-group.com/en/privacity')}/>
                                    </>
                            :
                                !isTablet()
                                ?
                                    <>
                                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                                            <TitleForms type={'title'} title={'Personal Information'}/>
                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                <View style={{flex: 1, marginRight: '3%'}}>
                                                    <TitleForms type={'subtitle'} title={'Name(s)'} />
                                                    <InputForm
                                                        status={true}
                                                        placeholder={'NAME(S)'}
                                                        fieldName={'nombre_1_US'}
                                                        ref={input_nom}
                                                        onSubmitEditing={() => input_last.current.focus()}
                                                    />
                                                </View>
                                                <View style={{flex: 1, marginRight: '3%'}}>
                                                    <TitleForms type={'subtitle'} title={'Last name'} />
                                                    <InputForm
                                                        status={true}
                                                        placeholder={'LAST NAME'}
                                                        fieldName={'lastName_1_US'}
                                                        ref={input_last}
                                                        onSubmitEditing={() => input_email.current.focus()}
                                                    />
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <TitleForms type={'subtitle'} title={'E-mail'} />
                                                    <InputForm 
                                                        keyboardType='email-address'
                                                        status={true} 
                                                        placeholder='example@example.com'
                                                        fieldName={'email_1_US'} 
                                                        ref={input_email}
                                                        autoCapitalize = 'none'
                                                        onSubmitEditing={() => input_phone_number.current.focus()}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                <View style={{flex: 1, marginRight: '3%'}}>
                                                    <TitleForms type={'subtitle'} title={'Phone Number'} />
                                                    <InputForm 
                                                        keyboardType='numeric'
                                                        status={true} 
                                                        placeholder='PHONE NUMBER '
                                                        fieldName={'phone_number_1_US'} 
                                                        ref={input_phone_number}
                                                        onSubmitEditing={() => input_home_number.current.focus()}
                                                    />
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <TitleForms type={'subtitle'} title={'Landline'} />
                                                    <InputForm 
                                                        keyboardType='numeric'
                                                        status={true} 
                                                        placeholder='LANDLINE NUMBER'
                                                        fieldName={'home_number_1_US'} 
                                                        ref={input_home_number}
                                                        onSubmitEditing={() => input_address.current.focus()}
                                                    />
                                                </View>
                                            </View>
                                            <TitleForms type={'title'} title={'Address'}/>
                                            
                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                <View style={{flex: 1, marginRight: '3%'}}>
                                                    <TitleForms type={'subtitle'} title={'Address'} />
                                                    <InputForm
                                                        status={true} 
                                                        placeholder='ADDRESS'
                                                        fieldName={'address_1_US'} 
                                                        ref={input_address}
                                                        onSubmitEditing={() => input_city.current.focus()}
                                                    />
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <TitleForms type={'subtitle'} title={'City'} />
                                                    <InputForm
                                                        status={true} 
                                                        placeholder='CITY'
                                                        fieldName={'city_1_US'} 
                                                        ref={input_city}
                                                        onSubmitEditing={() => input_state.current.focus()}
                                                    />
                                                </View>
                                            </View>

                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                <View style={{flex: 1, marginRight: '3%'}}>
                                                    <TitleForms type={'subtitle'} title={'State'} />
                                                    <InputForm
                                                        status={true} 
                                                        placeholder='STATE'
                                                        fieldName={'state_1_US'} 
                                                        ref={input_state}
                                                        onSubmitEditing={() => input_zip.current.focus()}
                                                    />
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <TitleForms type={'subtitle'} title={'Zip Code'} />
                                                    <InputForm
                                                        maxLength={5}
                                                        keyboardType='numeric'
                                                        status={true} 
                                                        placeholder='ZIP CODE'
                                                        fieldName={'zip_1_US'} 
                                                        ref={input_zip}
                                                        onSubmitEditing={() => input_position.current.focus()}
                                                    />
                                                </View>
                                            </View>
                                            
                                            <TitleForms type={'title'} title={'Application Information'}/>
                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                <View style={{flex: 1, marginRight: '3%'}}>
                                                    <TitleForms type={'subtitle'} title={'Position of Interest'} />
                                                    <InputForm
                                                        status={true} 
                                                        placeholder='POSITION'
                                                        fieldName={'position_1_US'} 
                                                        ref={input_position}
                                                        onSubmitEditing={() => input_salary.current.focus()}
                                                    />
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <TitleForms type={'subtitle'} title={'What are your salary expectations for this position?'} />
                                                    <InputForm
                                                        status={true}
                                                        placeholder={'$0.00'}
                                                        keyboardType="numeric"
                                                        fieldName={'salary_1_US'}
                                                        ref={input_salary}
                                                    />
                                                </View>
                                            </View>
                                            
                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                <View style={{flex: 1, marginRight: '3%'}}>
                                                    <TitleForms type={'subtitle'} title={'\nAre you at least 18 years old?'} />
                                                    <Picker
                                                        fieldName={'Is18_1_US'}
                                                        items={closeOptions}
                                                    />
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <TitleForms type={'subtitle'} title={'Are you legally eligible for employment in the United States?'} />
                                                    <Picker
                                                        fieldName={'legally_1_US'}
                                                        items={closeOptions}
                                                    />
                                                </View>
                                            </View>

                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                                <View style={{flex: 1, marginRight: '3%'}}>
                                                    <TitleForms type={'subtitle'} title={'How did you hear about this position?'} />
                                                    <Picker
                                                        fieldName={'recruitment_1_US'}
                                                        items={recruitmentData}
                                                        handleAction_dos={handleAction_dos}
                                                        contador={2}
                                                    />
                                                </View>
                                                <View style={{flex: 1}}>
                                                    {
                                                        recruitment === 1 || recruitment === 2
                                                        ?
                                                            recruitment === 1
                                                            ?
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={'Job Board'} />
                                                                    <Picker
                                                                        fieldName={'recruitmentDesc_1_US'}
                                                                        items={jobBoardData}
                                                                    />
                                                                </>
                                                            :
                                                                <>
                                                                    <TitleForms type={'subtitle'} title={'Social Media'} />
                                                                    <Picker
                                                                        fieldName={'recruitmentDesc_1_US'}
                                                                        items={socialNetworksData}
                                                                    />
                                                                </>
                                                        :
                                                            recruitment === 3 || recruitment === 4
                                                            ?
                                                                recruitment === 3
                                                                ?
                                                                    <>
                                                                        <TitleForms type={'subtitle'} title={'Name of the employee that is referring you'} />
                                                                        <InputForm
                                                                            status={true} 
                                                                            placeholder='Enter the full name'
                                                                            fieldName={'recruitmentDesc_1_US'} 
                                                                            ref={input_email}
                                                                        />
                                                                    </>
                                                                :
                                                                    <>
                                                                        <TitleForms type={'subtitle'} title={'Other'} />
                                                                        <InputForm
                                                                            status={true} 
                                                                            placeholder='Specify'
                                                                            fieldName={'recruitmentDesc_1_US'} 
                                                                            ref={input_email}
                                                                        />
                                                                    </>
                                                            :
                                                                <></>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                        <CheckBox onChecked={() => handleChecked()} checked={checked} legend={'I’ve read and accepted the Privacy Policy'} color={Blue} isUnderline={true} fontSize={15} unique={true} handlePress={async () => await Linking.openURL('https://telat-group.com/en/privacity')}/>
                                    </>
                                :
                                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                                        <TitleForms type={'title'} title={'Personal Information'}/>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Name(s)'} />
                                                <InputForm
                                                    status={true}
                                                    placeholder={'NAME(S)'}
                                                    fieldName={'nombre_1_US'}
                                                    ref={input_nom}
                                                    onSubmitEditing={() => input_last.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Last name'} />
                                                <InputForm
                                                    status={true}
                                                    placeholder={'LAST NAME'}
                                                    fieldName={'lastName_1_US'}
                                                    ref={input_last}
                                                    onSubmitEditing={() => input_email.current.focus()}
                                                />
                                            </View>
                                        </View>
                                        
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'E-mail'} />
                                                <InputForm 
                                                    keyboardType='email-address'
                                                    status={true} 
                                                    placeholder='example@example.com'
                                                    fieldName={'email_1_US'} 
                                                    ref={input_email}
                                                    autoCapitalize = 'none'
                                                    onSubmitEditing={() => input_phone_number.current.focus()}
                                                />
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Phone Number'} />
                                                <InputForm 
                                                    keyboardType='numeric'
                                                    status={true} 
                                                    placeholder='PHONE NUMBER '
                                                    fieldName={'phone_number_1_US'} 
                                                    ref={input_phone_number}
                                                    onSubmitEditing={() => input_home_number.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Landline'} />
                                                <InputForm 
                                                    keyboardType='numeric'
                                                    status={true} 
                                                    placeholder='LANDLINE NUMBER'
                                                    fieldName={'home_number_1_US'} 
                                                    ref={input_home_number}
                                                    onSubmitEditing={() => input_address.current.focus()}
                                                />
                                            </View>
                                        </View>

                                        {/* //aqui vamos con el resto en telefono */}
                                        <TitleForms type={'title'} title={'Address'}/>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Address'} />
                                                <InputForm
                                                    status={true} 
                                                    placeholder='ADDRESS'
                                                    fieldName={'address_1_US'} 
                                                    ref={input_address}
                                                    onSubmitEditing={() => input_city.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'City'} />
                                                <InputForm
                                                    status={true} 
                                                    placeholder='CITY'
                                                    fieldName={'city_1_US'} 
                                                    ref={input_city}
                                                    onSubmitEditing={() => input_state.current.focus()}
                                                />
                                            </View>
                                        </View>

                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'State'} />
                                                <InputForm
                                                    status={true} 
                                                    placeholder='STATE'
                                                    fieldName={'state_1_US'} 
                                                    ref={input_state}
                                                    onSubmitEditing={() => input_zip.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Zip Code'} />
                                                <InputForm
                                                    maxLength={5}
                                                    keyboardType='numeric'
                                                    status={true} 
                                                    placeholder='ZIP CODE'
                                                    fieldName={'zip_1_US'} 
                                                    ref={input_zip}
                                                    onSubmitEditing={() => input_position.current.focus()}
                                                />
                                            </View>
                                        </View>
                                        
                                        <TitleForms type={'title'} title={'Application Information'}/>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Position of Interest'} />
                                                <InputForm
                                                    status={true} 
                                                    placeholder='POSITION'
                                                    fieldName={'position_1_US'} 
                                                    ref={input_position}
                                                    onSubmitEditing={() => input_salary.current.focus()}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'What are your salary expectations for this position?'} />
                                                <InputForm
                                                    status={true}
                                                    placeholder={'$0.00'}
                                                    keyboardType="numeric"
                                                    fieldName={'salary_1_US'}
                                                    ref={input_salary}
                                                />
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Are you at least 18 years old?'} />
                                                <Picker
                                                    fieldName={'Is18_1_US'}
                                                    items={closeOptions}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Are you legally eligible for employment in the United States?'} />
                                                <Picker
                                                    fieldName={'legally_1_US'}
                                                    items={closeOptions}
                                                />
                                            </View>
                                        </View>

                                        <TitleForms type={'subtitle'} title={'How did you hear about this position?'} />
                                        <Picker
                                            fieldName={'recruitment_1_US'}
                                            items={recruitmentData}
                                            handleAction_dos={handleAction_dos}
                                            contador={2}
                                        />

                                        <View style={{flex: 1}}>
                                            {
                                                recruitment === 1 || recruitment === 2
                                                ?
                                                    recruitment === 1
                                                    ?
                                                        <>
                                                            <TitleForms type={'subtitle'} title={'Job Board'} />
                                                            <Picker
                                                                fieldName={'job_board_1_USA'}
                                                                items={jobBoardData}
                                                            />
                                                        </>
                                                    :
                                                        <>
                                                            <TitleForms type={'subtitle'} title={'Social Media'} />
                                                            <Picker
                                                                fieldName={'social_media_1_USA'}
                                                                items={socialNetworksData}
                                                            />
                                                        </>
                                                :
                                                    recruitment === 3 || recruitment === 4
                                                    ?
                                                        recruitment === 3
                                                        ?
                                                            <>
                                                                <TitleForms type={'subtitle'} title={'Name of the employee that is referring you'} />
                                                                <InputForm
                                                                    status={true} 
                                                                    placeholder='Enter the full name'
                                                                    fieldName={'referred_1_USA'} 
                                                                    ref={input_email}
                                                                    onSubmitEditing={() => input_telefono_personal.current.focus()}
                                                                />
                                                            </>
                                                        :
                                                            <>
                                                                <TitleForms type={'subtitle'} title={'Other'} />
                                                                <InputForm
                                                                    status={true} 
                                                                    placeholder='Specify'
                                                                    fieldName={'other_1_USA'} 
                                                                    ref={input_email}
                                                                    onSubmitEditing={() => input_telefono_personal.current.focus()}
                                                                />
                                                            </>
                                                    :
                                                        <></>   
                                            }
                                        </View>
                                        <CheckBox onChecked={() => handleChecked()} checked={checked} legend={'I’ve read and accepted the Privacy Policy'} color={Blue} isUnderline={true} fontSize={15} unique={true} handlePress={async () => await Linking.openURL('https://telat-group.com/en/privacity')}/>
                                    </View>
                        }
                    </View>
                </ProgressStep>
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
            <Politics language={language} orientation={orientationInfo.initial} visibility={visibility}  handleDismiss={() => setFilters({...filters, visibility: !visibility})}/>
        </>
    )
}

const styles = StyleSheet.create({
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