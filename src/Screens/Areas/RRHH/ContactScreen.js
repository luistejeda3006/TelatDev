import React, {useRef, useState, useEffect} from 'react'
import {View, Text, TouchableWithoutFeedback, ScrollView, Platform, Image, Alert, BackHandler, SafeAreaView, StatusBar} from 'react-native'
import {useConnection, useOrientation, useNavigation, useForm, useScroll} from '../../../hooks'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp'
import {HeaderPortrait, HeaderLandscape, Input, Modal, MultiText, ModalLoading, FailedNetwork, Title} from '../../../components'
import Picker from 'react-native-picker-select';
import {isIphone, live, login, urlJobs} from '../../../access/requestedData';
import tw from 'twrnc'

export default ({navigation, route: {params: {language, country, id_sede}}}) => {
    const speaking_level = useRef()
    const writing_level  = useRef()
    const handle_programs  = useRef()
    const full_name  = useRef()
    const correo  = useRef()
    const phone_1  = useRef()
    const phone_2  = useRef()

    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const {handlePath} = useNavigation()
    const {hasConnection, askForConnection} = useConnection();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)
    const [successVisibility, setSuccessVisibility] = useState(false)
    const {handleInputChange, values, handleSetState, handleSubmitForm} = useForm({
        currentCity: (id_sede === '1' || id_sede === '2' || id_sede === '3') ? 'Mexico City' : id_sede === '4' ? 'Juárez' : 'El Paso, TX.',
        currentCityOption: (id_sede === '1' || id_sede === '2' || id_sede === '3') ? 0 : id_sede === '4' ? 1 : 2,
        currentAboutUs: '',
        currentAboutUsOption: 0,
        speakingLevel: '',
        writingLevel: '',
        programs: '',
        currentClose: 0,
        currentCloseOption: 0,
        companies_time: '',
        fullName: '',
        email: '',
        telefono_1: '',
        telefono_2: '',
        other: '',
        currentContact: '',
        currentContactOption: 0,

        currentSchedule: '',
        currentScheduleOption: 0,

        currentLevelEnglish: '',
        currentLevelOptionEnglish: 0,

        currentLevelSpanish: '',
        currentLevelOptionSpanish: 0,
    })

    const {currentCity, currentContact, currentCityOption, currentAboutUs, currentAboutUsOption, speakingLevel, writingLevel, programs, currentClose, currentCloseOption, companies_time, fullName, email, telefono_1, telefono_2, other, currentContactOption, currentSchedule, currentScheduleOption, currentLevelEnglish, currentLevelOptionEnglish, currentLevelSpanish, currentLevelOptionSpanish} = values

    const [initialState, setInitialState] = useState({
        loading: false,
        cityOptions: [
            {value: 'Mexico City', label: 'Mexico City'},
            {value: 'Juárez', label: 'Juárez'},
            {value: 'El Paso, TX.', label: 'El Paso, TX.'},
        ],
        
        closeOptions: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: language === '1' ? 'SI' : 'YES', label: language === '1' ? 'SI' : 'YES'},
            {value: 'NO', label: 'NO'},
        ],

        optionsAboutMX: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: 'Facebook/Instagram', label: 'Facebook/Instagram'},
            {value: 'Indeed', label: 'Indeed'},
            {value: 'OCC Mundial', label: 'OCC Mundial'},
            {value: language === '1' ? 'Referido' : 'Referral', label: language === '1' ? 'Referido' : 'Referral'},
            {value: language === '1' ? 'Trabajé antes en Telat' :'I previously worked in Telat', label: language === '1' ? 'Trabajé antes en Telat' :'I previously worked in Telat'},
            {value: language === '1' ? 'Otro' : 'Other', label: language === '1' ? 'Otro' : 'Other'},
        ],

        optionsAboutUS: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: 'Facebook/Instagram', label: 'Facebook/Instagram'},
            {value: 'Indeed', label: 'Indeed'},
            {value: language === '1' ? 'Referido' : 'Referral', label: language === '1' ? 'Referido' : 'Referral'},
            {value: language === '1' ? 'Trabajé antes en Telat/Dataxport' : 'I previously worked in Telat/Dataxport', label: language === '1' ? 'Trabajé antes en Telat/Dataxport' : 'I previously worked in Telat/Dataxport'},
            {value: language === '1' ? 'Otro' : 'Other', label: language === '1' ? 'Otro' : 'Other'},
        ],
        
        levels: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: language === '1' ? 'Básico' : 'Basic', label: language === '1' ? 'Básico' : 'Basic'},
            {value: language === '1' ? 'Intermedio' :'Intermediate', label: language === '1' ? 'Intermedio' :'Intermediate'},
            {value: language === '1' ? 'Avanzado' : 'Advanced', label: language === '1' ? 'Avanzado' : 'Advanced'},
        ],

        contactOptions: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: language === '1' ? 'Llamada' : 'Call', label: language === '1' ? 'Llamada' : 'Call'},
            {value: 'WhatsApp', label: 'WhatsApp'},
            {value: language === '1' ? 'Email' : 'E-mail', label: language === '1' ? 'Email' : 'E-mail'},
        ],
        
        scheduleOptions: [
            {value: language === '1' ? 'Seleccionar opción' : 'Select option', label: language === '1' ? 'Seleccionar opción' : 'Select option'},
            {value: '8:00a.m. - 11:00a.m.', label: '8:00a.m. - 11:00a.m.'},
            {value: '11:00a.m. - 1:00p.m.', label: '11:00a.m. - 1:00p.m.'},
            {value: '1:00p.m. - 4:00p.m.', label: '1:00p.m. - 4:00p.m.'},
        ],
        isRecording: '1',
        isPlaying: '1',
    })

    useEffect(() => {
        const backAction = () => {
        Alert.alert(
            language === '1' ? 'Cancelar Solicitud' : 'Cancel Request',
            language === '1' ? '¿Estás seguro(a), que desea cancelar tu solicitud? \n\nSe perderán los datos ingresados\n' : 'Are you sure you want to cancel your request? \n\nThe data entered will be lost\n', 
            [
                {
                    text: language === '1' ? 'Cancelar' : 'Cancel',
                    onPress: () => null,
                    style: 'cancel'
                },
                {text: language === '1' ? 'Sí, estoy seguro' : 'Yes, I am sure', onPress: () => navigation.navigate('VacantDetail')}
            ]
        );
        return true;
    };
    
    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );
    
    return () => backHandler.remove();
    }, [language]);

    const {cityOptions, closeOptions, optionsAboutMX, optionsAboutUS, levels, contactOptions, scheduleOptions, loading} = initialState
    
    const handleActionUno = (value, label) => {
        handleSetState({...values, currentCity: value, currentCityOption: label})
    }
    
    const handleActionDos = (value, label) => {
        handleSetState({...values, currentAboutUs: value, currentAboutUsOption: label})
    }
    
    const handleActionTres = (value, label) => {
        handleSetState({...values, currentClose: value, currentCloseOption: label})
    }
    
    const handleActionCuatro = (value, label) => {
        handleSetState({...values, currentContact: value, currentContactOption: label})
    }
    
    const handleActionCinco = (value, label) => {
        handleSetState({...values, currentSchedule: value, currentScheduleOption: label})
    }
    
    const handleActionSeis = (value, label) => {
        handleSetState({...values, currentLevelEnglish: value, currentLevelOptionEnglish: label})
    }

    const handleActionSiete = (value, label) => {
        handleSetState({...values, currentLevelSpanish: value, currentLevelOptionSpanish: label})
    }

    const handleSave = async (tipo) => {
        if(email.includes('@') && email.includes('.')){
            setInitialState({...initialState, loading: true})
            let body = null;
            if(tipo === 1){
                body = {
                    'action': 'send_formulario_contacto',
                    'data': {
                        "info_ciudad":currentCity,
                        "info_contacto":currentAboutUs,
                        "nivel_conversacional":speakingLevel,
                        "nivel_escritura":writingLevel,
                        "programas_computadora": programs,
                        "experiencia_job_bool": currentClose,
                        "info_contacto_otro": other,
                        "experiencia_job":companies_time,
                        "info_nombre":fullName,
                        "info_email":email,
                        "info_telefono1": telefono_1,
                        "info_telefono2":telefono_2,
                        "opcion_contacto": currentContact,
                        "horario_contacto":currentSchedule
                    },
                    'login': login,
                    'live': live,
                    'language': language,
                    'pais': country
                }
            } else {
                body = {
                    'action': 'send_formulario_contacto',
                    'data': {
                        "info_ciudad": currentCity,
                        "info_contacto": currentAboutUs,
                        "experiencia_job_bool": currentClose,
                        "experiencia_job": companies_time,
                        "info_contacto_otro": other,
                        "nivel_ingles": currentLevelEnglish,
                        "nivel_espanol": currentLevelSpanish,
                        "programas_computadora": programs,
                        "info_nombre": fullName,
                        "info_email": email,
                        "info_telefono1": telefono_1,
                        "info_telefono2": telefono_2,
                        "opcion_contacto": currentContact,
                        "horario_contacto": currentSchedule
                    },
                    'login': login,
                    'live': live,
                    'language': language,
                    'pais': country
                }
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
                setSuccessVisibility(true)
                setInitialState({...initialState, loading: false})
                setTimeout(() => {
                    setSuccessVisibility(false)
                    navigation.navigate('VacantDetail')
                }, 4500)
            }
        }
        else {
            Alert.alert(
                language === '1' ? 'Correo Inválido' : 'Invalid Email',
                language === '1' ? 'El correo ingresado no es válido' : 'The email entered is invalid',
                [
                    { text: 'OK'}
                ]
            )
        }
    }

    const handleValidateContactInfoMx = () => {
        if(fullName !== '' && email !== '' && telefono_1 !== '' && currentContactOption !== 0 && currentScheduleOption !== 0){
            handleSave(1)
        } else Alerta()
    }

    const handleValidateCompaniesMx = () => {
        if(companies_time !== '') handleValidateContactInfoMx()
        else Alerta()
    }

    const handleValidateLanguagesMx = () => {
        if(currentCloseOption !== 0 && currentCloseOption !== 1) handleValidateContactInfoMx()
        else {
            if(currentCloseOption === 1) handleValidateCompaniesMx()
            else Alerta()
        }
    }

    const handleValidateAboutMx = () => {
        if(currentAboutUsOption !== 0 && currentAboutUsOption !== 6 && speakingLevel !== '' && writingLevel !== '' && programs !== '') handleValidateLanguagesMx()
        else {
            if(currentAboutUsOption === 0) Alerta()
            else {
                if(other !== '') handleValidateLanguagesMx()
                else Alerta()
            }
        }
    }

    const handleValidateCompaniesUS = () => {
        if(currentCloseOption !== 0){
            if(currentCloseOption === 1) {
                if(companies_time !== ''){
                    handleSave(2)
                } else {
                    Alerta()
                }
            }
            else handleSave(2)
        } else Alerta()
    }

    const handleValidateAboutUs = () => {
        if(currentAboutUsOption !== 0 && currentAboutUsOption !== 5 && currentLevelOptionEnglish !== 0 && currentLevelOptionSpanish !== 0 && currentContactOption !== 0 && currentScheduleOption !== 0 && programs !== '' && fullName !== '' && email !== '' && telefono_1 !== '') handleValidateCompaniesUS()
        else {
            if(currentAboutUsOption === 0 || currentLevelOptionEnglish === 0 || currentLevelOptionSpanish === 0 || currentContactOption === 0 || currentScheduleOption === 0 || programs === '' || fullName === '' || email === '' || telefono_1 === '') Alerta()
            else {
                if(other !== '') handleValidateCompaniesUS()
                else Alerta()
            }
        }
    }

    const handleValidate = () => {
        if(currentCityOption === 0 || currentCityOption === 1) handleValidateAboutMx()
        else handleValidateAboutUs()
    }

    const Alerta = () => {
        Alert.alert(
            language === '1' ? 'Campos Vacíos' : 'Empty Fields',
            language === '1' ? 'Revise y llene los campos faltantes' : 'Review and fill in the missing fields',
            [
                { text: 'OK'}
            ]
        )
    }

    return(
        <>
            {
                hasConnection
                ?
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
                        <HeaderPortrait title={language === '1' ? 'Formulario de Contacto' : 'Contact Form'} screenToGoBack={'VacantDetail'} navigation={navigation} visible={true} confirmation={true} currentLanguage={language} translateY={translateY}/>
                        <View style={tw`flex-1 justify-center items-center px-[${isIphone ? '5%' : '4%'}] bg-white`}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={tw`self-stretch`}
                                onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}}
                            >
                                <View style={tw`h-auto self-stretch mb-2 ios:mb-2.5 pb-[1.8%] mt-[1.5%]`}>
                                    <View style={tw`mt-[1.5%]`}/>
                                    <Title title={language === '1' ? 'Información Básica' : 'Basic Information'} tipo={1} icon={'child'} hasBottom={false}/>
                                    <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                    <View style={[pickerStyle, tw`bg-[#f7f7f7]`]}>
                                        <View style={tw`flex-1 justify-center items-start ios:px-1 android:px-4`}>
                                            <Text style={tw`text-[#000] text-base`}>{currentCity}</Text>
                                        </View>
                                    </View>

                                    <Text style={titleStyle}>{language === '1' ? '¿Cómo te enteraste de nosotros?' : 'How did you find out about the job?'}</Text>
                                    <View style={[pickerStyle]} >
                                        <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                            <Picker
                                                value={currentAboutUs}
                                                onValueChange={(itemValue, itemIndex) => handleActionDos(itemValue, itemIndex)}
                                                items={currentCityOption === 0 || currentCityOption === 1 ? optionsAboutMX : optionsAboutUS}
                                                placeholder={{}}
                                            />
                                        </View>
                                        {
                                            currentAboutUsOption === 0
                                            &&
                                                <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                    <IonIcons name='asterisk' color={'red'} size={12}/>
                                                </View>
                                        }
                                    </View>

                                    {
                                        (currentAboutUsOption === 6 || (currentAboutUsOption === 5 && currentCityOption === 2))
                                        &&
                                            <>
                                                <Input
                                                    value={other}
                                                    onChangeText={(e) => handleInputChange(e, 'other')}
                                                    placeholder={language === '1' ? 'Especifica' : 'Specify'}
                                                />
                                            </>
                                    }

                                    {
                                        currentCityOption === 0 || currentCityOption === 1
                                        ?
                                            <>
                                                <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de inglés conversacional?' : `What's your speaking English level?`}</Text>
                                                <Input
                                                    value={speakingLevel}
                                                    onChangeText={(e) => handleInputChange(e, 'speakingLevel')}
                                                    placeholder={language === '1' ? 'Especifica tu nivel de inglés conversacional' : 'Specify your speaking English level'}
                                                    ref={speaking_level}
                                                    onSubmitEditing={() => writing_level.current.focus()}
                                                />

                                                <Text style={titleStyle}>{language === '1' ? '¿Cuál es tu nivel de inglés en escritura?' : `What's your writing English level?`}</Text>
                                                <Input 
                                                    value={writingLevel}
                                                    onChangeText={(e) => handleInputChange(e, 'writingLevel')}
                                                    placeholder={language === '1' ? 'Especifica tu nivel de inglés en escritura' : 'Specify writing English level'}
                                                    ref={writing_level}
                                                    onSubmitEditing={() => handle_programs.current.focus()}
                                                />

                                                <Text style={titleStyle}>{language === '1' ? '¿Puedes manejar distintas aplicaciones y programas en la computadora?' : `Are you able to handle different apps and programs on the computer?`}</Text>
                                                <Input 
                                                    value={programs}
                                                    onChangeText={(e) => handleInputChange(e, 'programs')}
                                                    placeholder={language === '1' ? 'Especifica' : 'Especify'}
                                                    ref={handle_programs}
                                                />

                                                <Text style={titleStyle}>{language === '1' ? '¿Tienes experiencia en empleos bilingües?' : '¿Do you have experience in bilingual jobs?'}</Text>
                                                <View style={[pickerStyle]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentClose}
                                                            onValueChange={(itemValue, itemIndex) => handleActionTres(itemValue, itemIndex)}
                                                            items={closeOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentCloseOption === 0
                                                        &&
                                                            <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                                <IonIcons name='asterisk' color={'red'} size={12}/>
                                                            </View>
                                                    }
                                                </View>
                                                {
                                                    currentCloseOption === 1
                                                    &&
                                                        <>
                                                            <Text style={titleStyle}>{language === '1' ? '¿En qué empresas y por cuánto tiempo?' : 'In which companies and for how long?'}</Text>
                                                            <MultiText
                                                                required={true}
                                                                value={companies_time}
                                                                onChangeText={(e) => handleInputChange(e, 'companies_time')}
                                                                placeholder={language === '1' ? 'Especifica las empresas y el tiempo...' : 'Specify companies and time...'}
                                                                multiline={true}
                                                                numberOfLines={5}
                                                                onSubmitEditing={() => full_name.current.focus()}
                                                            />
                                                        </>
                                                }
                                                
                                                <Title title={language === '1' ? 'Información de Contacto' : 'Contact Information'} tipo={1} icon={'child'} hasBottom={true}/>
                                                <Text style={titleStyle}>{language === '1' ? 'Nombre completo' : `Full name`}</Text>
                                                <Input
                                                    value={fullName}
                                                    autoCapitalize={'words'}
                                                    onChangeText={(e) => handleInputChange(e, 'fullName')}
                                                    placeholder={language === '1' ? 'Especifica tu nombre completo' : 'Specify your full name'}
                                                    ref={full_name}
                                                    onSubmitEditing={() => correo.current.focus()}
                                                />
                                                
                                                <Text style={titleStyle}>{language === '1' ? 'Email' : `E-mail`}</Text>
                                                <Input 
                                                    keyboardType={'email-address'}
                                                    autoCapitalize={'none'}
                                                    value={email}
                                                    onChangeText={(e) => handleInputChange(e, 'email')}
                                                    placeholder={'example@gmailcom'}
                                                    ref={correo}
                                                    onSubmitEditing={() => phone_1.current.focus()}
                                                />

                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono 1' : `Phone number 1`}</Text>
                                                <Input 
                                                    keyboardType={'numeric'}
                                                    value={telefono_1}
                                                    onChangeText={(e) => handleInputChange(e, 'telefono_1')}
                                                    placeholder={language === '1' ? 'Especifica tu número de teléfono' : 'Specify your phone number'}
                                                    ref={phone_1}
                                                    onSubmitEditing={() => phone_2.current.focus()}
                                                />
                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono 2 (opcional)' : `Phone number 2 (optional)`}</Text>
                                                <Input
                                                    keyboardType={'numeric'}
                                                    optional={true}
                                                    value={telefono_2}
                                                    onChangeText={(e) => handleInputChange(e, 'telefono_2')}
                                                    placeholder={language === '1' ? 'Especifica tu número de teléfono (opcional)' : 'Specify your phone number (optional)'}
                                                    ref={phone_2}
                                                />
                                                <Text style={titleStyle}>{language === '1' ? '¿Cómo prefieres que te contactemos?' : 'How do you prefer to be contacted?'}</Text>
                                                <View style={[pickerStyle]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentContact}
                                                            onValueChange={(itemValue, itemIndex) => handleActionCuatro(itemValue, itemIndex)}
                                                            items={contactOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentContactOption === 0
                                                        &&
                                                            <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                                <IonIcons name='asterisk' color={'red'} size={12}/>
                                                            </View>
                                                    }
                                                </View>
                                                <Text style={titleStyle}>{language === '1' ? '¿En qué horario podemos contactarte?' : 'At what time can we reach you?'}</Text>
                                                <View style={[pickerStyle]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentSchedule}
                                                            onValueChange={(itemValue, itemIndex) => handleActionCinco(itemValue, itemIndex)}
                                                            items={scheduleOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentScheduleOption === 0
                                                        &&
                                                            <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                                <IonIcons name='asterisk' color={'red'} size={12}/>
                                                            </View>
                                                    }
                                                </View>
                                            </>
                                        :
                                            <>
                                                <Text style={titleStyle}>{language === '1' ? '¿Tienes experiencia en Call Center o empleos de Atención a Clientes?' : 'Do you have experience in Call Center or Customer Service jobs?'}</Text>
                                                <View style={[pickerStyle]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentClose}
                                                            onValueChange={(itemValue, itemIndex) => handleActionTres(itemValue, itemIndex)}
                                                            items={closeOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentCloseOption === 0
                                                        &&
                                                            <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                                <IonIcons name='asterisk' color={'red'} size={12}/>
                                                            </View>
                                                    }
                                                </View>
                                                {
                                                    currentCloseOption === 1
                                                    &&
                                                        <>
                                                            <Text style={titleStyle}>{language === '1' ? '¿En qué empresas y por cuánto tiempo?' : 'In which companies and for how long?'}</Text>
                                                            <MultiText
                                                                required={true}
                                                                value={companies_time}
                                                                onChangeText={(e) => handleInputChange(e, 'companies_time')}
                                                                placeholder={language === '1' ? 'Especifica las empresas y el tiempo...' : 'Specify companies and time...'}
                                                                multiline={true}
                                                                numberOfLines={5}
                                                                /* ref={input_empresas} */
                                                                />
                                                        </>
                                                }
                                                
                                                <View style={tw`mt-[${currentCloseOption === 1 ? 2.5 : 0}]`} />
                                                <Text style={titleStyle}>{language === '1' ? 'Nivel de Inglés' : 'English profiency'}</Text>
                                                <View style={[pickerStyle]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentLevelEnglish}
                                                            onValueChange={(itemValue, itemIndex) => handleActionSeis(itemValue, itemIndex)}
                                                            items={levels}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentLevelOptionEnglish === 0
                                                        &&
                                                            <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                                <IonIcons name='asterisk' color={'red'} size={12}/>
                                                            </View>
                                                    }
                                                </View>
                                                <Text style={titleStyle}>{language === '1' ? 'Nivel de Español' : 'Spanish profiency'}</Text>
                                                <View style={[pickerStyle]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentLevelSpanish}
                                                            onValueChange={(itemValue, itemIndex) => handleActionSiete(itemValue, itemIndex)}
                                                            items={levels}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentLevelOptionSpanish === 0
                                                        &&
                                                            <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                                <IonIcons name='asterisk' color={'red'} size={12}/>
                                                            </View>
                                                    }
                                                </View>

                                                <Text style={titleStyle}>{language === '1' ? '¿Puedes manejar distintas aplicaciones y programas en la computadora?' : `Are you able to handle different apps and programs on the computer?`}</Text>
                                                <Input
                                                    value={programs}
                                                    onChangeText={(e) => handleInputChange(e, 'programs')}
                                                    placeholder={language === '1' ? 'Especifica' : 'Especify'}
                                                    onSubmitEditing={() => full_name.current.focus()}
                                                />

                                                <Title title={language === '1' ? 'Información de Contacto' : 'Contact Information'} tipo={1} icon={'child'} hasBottom={false}/>
                                                <Text style={titleStyle}>{language === '1' ? 'Nombre completo' : `Full name`}</Text>
                                                <Input
                                                    value={fullName}
                                                    autoCapitalize={'words'}
                                                    onChangeText={(e) => handleInputChange(e, 'fullName')}
                                                    placeholder={language === '1' ? 'Especifica tu nombre completo' : 'Specify your full name'}
                                                    ref={full_name}
                                                    onSubmitEditing={() => correo.current.focus()}
                                                />
                                                
                                                <Text style={titleStyle}>{language === '1' ? 'Email' : `E-mail`}</Text>
                                                <Input 
                                                    keyboardType={'email-address'}
                                                    autoCapitalize={'none'}
                                                    value={email}
                                                    onChangeText={(e) => handleInputChange(e, 'email')}
                                                    placeholder={'example@gmailcom'}
                                                    ref={correo}
                                                    onSubmitEditing={() => phone_1.current.focus()}
                                                />

                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono 1' : `Phone number 1`}</Text>
                                                <Input 
                                                    keyboardType={'numeric'}
                                                    value={telefono_1}
                                                    onChangeText={(e) => handleInputChange(e, 'telefono_1')}
                                                    placeholder={language === '1' ? 'Especifica tu número de teléfono' : 'Specify your phone number'}
                                                    ref={phone_1}
                                                    onSubmitEditing={() => phone_2.current.focus()}
                                                />
                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono 2 (opcional)' : `Phone number 2 (optional)`}</Text>
                                                <Input
                                                    keyboardType={'numeric'}
                                                    optional={true}
                                                    value={telefono_2}
                                                    onChangeText={(e) => handleInputChange(e, 'telefono_2')}
                                                    placeholder={language === '1' ? 'Especifica tu número de teléfono (opcional)' : 'Specify your phone number (optional)'}
                                                    ref={phone_2} 
                                                />
                                                <Text style={titleStyle}>{language === '1' ? '¿Cómo prefieres que te contactemos?' : 'How do you prefer to be contacted?'}</Text>
                                                <View style={[pickerStyle]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentContact}
                                                            onValueChange={(itemValue, itemIndex) => handleActionCuatro(itemValue, itemIndex)}
                                                            items={contactOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentContactOption === 0
                                                        &&
                                                            <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                                <IonIcons name='asterisk' color={'red'} size={12}/>
                                                            </View>
                                                    }
                                                </View>
                                                <Text style={titleStyle}>{language === '1' ? '¿En qué horario podemos contactarte?' : 'At what time can we reach you?'}</Text>
                                                <View style={[pickerStyle]} >
                                                    <View style={tw`flex-1 justify-center items-center ios:pl-1`}>
                                                        <Picker
                                                            value={currentSchedule}
                                                            onValueChange={(itemValue, itemIndex) => handleActionCinco(itemValue, itemIndex)}
                                                            items={scheduleOptions}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                    {
                                                        currentScheduleOption === 0
                                                        &&
                                                            <View style={tw`h-[100%] w-[${!isIphone ? 12.5 : 7.5}] justify-center items-center rounded-3xl`}>
                                                                <IonIcons name='asterisk' color={'red'} size={12}/>
                                                            </View>
                                                    }
                                                </View>

                                            </>
                                    }
                                    <TouchableWithoutFeedback onPress={() => handleValidate()}>
                                        <View style={tw`bg-[${Blue}] h-11 justify-center items-center rounded-3xl self-stretch flex-row mb-${isIphone ? 1.5 : 'px'} shadow-md mt-2`}>
                                            <Icon name={'paper-plane'} size={18} color={'#fff'}/>
                                            <Text style={tw`text-white font-bold text-lg ml-2.5`}>{language === '1' ? 'Envíar' : 'Send'}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </ScrollView>
                        </View>
                    </>
                :
                    <>
                        <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                        <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
                        <FailedNetwork askForConnection={askForConnection} language={language} orientation={orientationInfo.initial}/>
                    </>
            }
            
            <Modal orientation={orientationInfo.initial} visibility={successVisibility} handleDismiss={() => setSuccessVisibility(!successVisibility)}>
                <View style={tw`justify-center items-center self-stretch h-auto mt-3`}>
                    <Image
                        style={tw`w-25 h-25`}
                        resizeMode='stretch'
                        source={require('../../../../assets/correct.gif')}
                    />
                </View>
                <View style={tw`h-auto justify-center items-center p-4`}>
                    <Text style={tw`font-bold text-xl text-center text-black`}>{language === '1' ? '¡Gracias por tu interés en Telat!' : 'Thank you for your interest in Telat!'}</Text>
                    <Text style={tw`text-base text-center text-black mt-2`}>{language === '1' ? 'Pronto nos pondremos en contacto contigo para darle seguimiento a tu aplicación.' : `We'll contact you soon to follow up your application.`}</Text>
                </View>
            </Modal>
            <ModalLoading visibility={loading}/>
        </>
    )
}

const titleStyle = tw`text-sm text-[${Blue}] mb-1.5`
const pickerStyle = tw`justify-center border border-[#CBCBCB] mb-2.5 h-12.5 rounded-3xl px-${isIphone ? '2.5' : 'px'} w-[99%] flex-row`
const boxStyle = tw`h-auto justify-center items-center border border-[#CBCBCB] bg-white p-2.5 self-stretch rounded-3xl`