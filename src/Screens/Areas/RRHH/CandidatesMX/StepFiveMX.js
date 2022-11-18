import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Alert, Text, TouchableOpacity, Image, Modal, Linking, BackHandler} from 'react-native';
import {InputForm, TitleForms, Picker} from '../../../../components';
import {getCurrentDate} from '../../../../js/dates';
import {ProgressStep} from 'react-native-progress-steps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useOrientation} from '../../../../hooks';
import {live, login, urlJobs, origen, contactPhoneNumber} from '../../../../access/requestedData';
import {useFormikContext} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

let currentOne = null;
let currentTwo = null;
let currentThree = null;
let currentFour = null;
let all = null;

let keyOne = 'stepOne'
let keyTwo = 'stepTwo'
let keyThree = 'stepThree'
let keyFour = 'stepFour'

export default ({language, orientation, navigation, ...rest}) => {
    const {isTablet} = DeviceInfo;

    const input_contacto = useRef()
    const input_numero = useRef()
    const input_alergias = useRef()
    const input_enfermedades = useRef()
    const input_medicamentos = useRef()

    useEffect(async () => {
        currentOne = await AsyncStorage.getItem(keyOne) || '[]';
        currentOne = JSON.parse(currentOne);

        currentTwo = await AsyncStorage.getItem(keyTwo) || '[]';
        currentTwo = JSON.parse(currentTwo);

        currentThree = await AsyncStorage.getItem(keyThree) || '[]';
        currentThree = JSON.parse(currentThree);

        currentFour = await AsyncStorage.getItem(keyFour) || '[]';
        currentFour = JSON.parse(currentFour);

        all = {...currentOne, ...currentTwo};
        all = {...all, ...currentThree};
        all = {...all, ...currentFour};
    },[appointment])

    const {submitForm, values} = useFormikContext();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });
    const {contactoEmergencia_5, telefonoEmergencia_5, tipoSangre_5, alergias_5, medicamentos_5, enfermedades_5} = values;

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

    const tipoSangreData = [
        {label: language === '1' ? 'Seleccionar' : 'Select', value: 'SEL'},
        {label: language === '1' ? 'O +' : 'O +', value: 'O POSITIVO'},
        {label: language === '1' ? 'O -' : 'O -', value: 'O NEGATIVO'},
        {label: language === '1' ? 'A +' : 'A +', value: 'A POSITIVO'},
        {label: language === '1' ? 'A -' : 'A -', value: 'A NEGATIVO'},
        {label: language === '1' ? 'B +' : 'B +', value: 'B POSITIVO'},
        {label: language === '1' ? 'B -' : 'B -', value: 'B NEGATIVO'},
        {label: language === '1' ? 'AB +' : 'AB +', value: 'AB POSITIVO'},
        {label: language === '1' ? 'AB -' : 'AB -', value: 'AB NEGATIVO'},
        {label: language === '1' ? 'BRH +' : 'BRH +', value: 'BRH POSITIVO'},
        {label: language === '1' ? 'No Clasificado' : 'Not qualified', value: 'NO CLASIFICADO'},
    ]

    const [filters, setFilters] = useState({
        error: true,
        appointment: false
    });

    const {error, appointment} = filters;

    const handleValues = async () => {
        if(tipoSangre_5 === undefined || tipoSangre_5 === 'SEL' || contactoEmergencia_5 === undefined || contactoEmergencia_5 === '' || telefonoEmergencia_5 === undefined || telefonoEmergencia_5 === '' || tipoSangre_5 === undefined || tipoSangre_5 === '' || alergias_5 === undefined || alergias_5 === '' || medicamentos_5 === undefined || medicamentos_5 === '' || enfermedades_5 === undefined || enfermedades_5 === ''){
            Alerta();
        }
        else {
            if(telefonoEmergencia_5.length === 10){
                var d = new Date();

                const obj_5 = {
                    infom_contacto: contactoEmergencia_5.toUpperCase(),
                    infom_telefono: telefonoEmergencia_5,
                    infom_tipo_sangre: tipoSangre_5.toUpperCase(),
                    infom_alergias: alergias_5.toUpperCase(),
                    infom_medicamentos: medicamentos_5.toUpperCase(),
                    infom_enfermedad: enfermedades_5.toUpperCase(),
                    cand_fecha_creacion: getCurrentDate(),
                    cand_origen: origen
                }
    
                all = {...all, ...obj_5};
                
                try{
                    const body = {
                        'action': 'insert_precandidato',
                        'data': all,
                        'login': login,
                        'live': live,
                        'country': 'MX'
                    }
        
                    const request = await fetch(urlJobs, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body)
                    });
                    const {response} = await request.json();

                    if(response.status === 201){
                        setFilters({...filters, error: false, appointment: false})
                        Alert.alert(
                            language === '1' ? '¡Solicitud Creada Correctamente!' : 'Application Created Successfully!',
                            language === '1' ? 'Se ha registrado correctamente su solicitud.' : 'Your request has been successfully registered.',
                            [
                                { text: 'OK'}
                            ]
                        )
                        await AsyncStorage.removeItem(keyOne);
                        await AsyncStorage.removeItem(keyTwo);
                        await AsyncStorage.removeItem(keyThree);
                        await AsyncStorage.removeItem(keyFour);
                        navigation.navigate('Choose')
                    }

                    else if(response.status === 400){
                        await AsyncStorage.removeItem(keyOne);
                        await AsyncStorage.removeItem(keyTwo);
                        await AsyncStorage.removeItem(keyThree);
                        await AsyncStorage.removeItem(keyFour);

                        Alert.alert(
                            language === '1' ? 'Error al envíar su solicitud' : 'Error to send your request',
                            language === '1' ? 'Inténtelo de nuevo más tarde.' : 'Try later, again.',
                            [
                                { text: 'OK'}
                            ]
                        )
                        navigation.navigate('Choose')
                    }

                    else if(response.status === 405) {
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
            
            else {
                Alert.alert(
                    language === '1' ? 'Número de Teléfono Inválido' : 'Invalid Phone Number',
                    language === '1' ? 'Ingrese un número teléfonico válido' : 'Type a valid phone number',
                    [
                        { text: 'OK'}
                    ]
                )
                setFilters({...filters, error: true})
            }
        }
    }

    const handleLinking = () => {
        //aqui se va a hacer todo lo de whatsapp
        setFilters({...filters, appointment: !appointment})
        navigation.navigate('Vacants')
    }

    const handleWhatsApp = async () => {
        await Linking.openURL(`https://wa.me/+52${contactPhoneNumber}?text=Agendar una cita`)
        navigation.navigate('Vacants')
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
        <>
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <ProgressStep
                    errors={error}
                    {...rest}
                    previousBtnText=''
                    nextBtnTextStyle={{color: '#fff', backgroundColor: '#1177E9', padding: 12, borderRadius: 15, fontWeight: 'bold'}}
                    previousBtnTextStyle={{color: 'orange'}}
                    nextBtnStyle={{ textAlign: 'center', padding: 0 }}
                    previousBtnStyle={{ textAlign: 'center', padding: 0 }}
                    previousBtnDisabled={true}
                    nextBtnDisabled={false}
                    onSubmit={() => handleValues()}
                    finishBtnText={language === '1' ? 'Finalizar' : 'Finish'}
                >
                    <View style={{alignSelf: 'stretch', paddingHorizontal: 18}}>
                        {
                            orientationInfo.initial === 'PORTRAIT'
                            ?
                                <>
                                    <TitleForms type={'title'} title={language === '1' ? 'Información Médica' : 'Medical Information'}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Contacto de emergencia (Nombre completo)' : 'Emergency contact (Full name)'}/>
                                    <InputForm status={true} placeholder={language === '1' ? 'Nombre completo' : 'Full name'} fieldName={'contactoEmergencia_5'} ref={input_contacto} onSubmitEditing={() => input_numero.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Número telefónico de emergencia' : 'Emergency phone number'}/>
                                    <InputForm status={true} maxLength={10} placeholder='55-11-22-33-44' fieldName={'telefonoEmergencia_5'} keyboardType='numeric' ref={input_numero} />
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Tipo de sangre' : 'Blood type'}/>
                                    <Picker
                                        fieldName={'tipoSangre_5'}
                                        items={tipoSangreData} 
                                    />
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Alergias' : 'Allergies'}/>
                                    <InputForm status={true} placeholder={language === '1' ? 'Especifique el tipo de alergia' : 'Especify allergie type'} fieldName={'alergias_5'} ref={input_alergias} onSubmitEditing={() => input_medicamentos.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Medicamentos (Controlados)' : 'Prescripted medication'}/>
                                    <InputForm status={true} placeholder={language === '1' ? 'Especifique si tomas medicamentos controlados' : 'Especify if you take controlled medication'} fieldName={'medicamentos_5'} ref={input_medicamentos} onSubmitEditing={() => input_enfermedades.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Alguna enfermedad que deba conocer la empresa para tu bienestar? (Especifique)' : 'Do you have any illness that we should know about? (Specify)'}/>
                                    <InputForm status={true} placeholder={language === '1' ? '¿Alguna enfermedad que deba conocer la empresa para tu bienestar? (Especifique)' : 'Do you have any illness that we should know about? (Specify)'} fieldName={'enfermedades_5'} ref={input_enfermedades}/>
                                </>
                            :
                                <>
                                    <TitleForms type={'title'} title={language === '1' ? 'Información Médica' : 'Medical Information'}/>
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Contacto de emergencia (Nombre completo)' : 'Emergency contact (Full name)'}/>
                                            <InputForm status={true} placeholder={language === '1' ? 'Nombre completo' : 'Full name'} fieldName={'contactoEmergencia_5'} ref={input_contacto} onSubmitEditing={() => input_numero.current.focus()}/>
                                        </View>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Número telefónico de emergencia' : 'Emergency phone number'}/>
                                            <InputForm status={true} maxLength={10} placeholder='55-11-22-33-44' fieldName={'telefonoEmergencia_5'} keyboardType='numeric' ref={input_numero}/>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'flex-start'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Tipo de sangre' : 'Blood type'}/>
                                            <Picker
                                                fieldName={'tipoSangre_5'}
                                                items={tipoSangreData}
                                            />
                                        </View>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? 'Alergias' : 'Allergies'}/>
                                            <InputForm status={true} placeholder={language === '1' ? 'Especifique el tipo de alergia' : 'Especify allergie type'} fieldName={'alergias_5'} ref={input_alergias} onSubmitEditing={() => input_medicamentos.current.focus()}/>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? '\nMedicamentos (Controlados)' : 'Prescripted medication'}/>
                                            <InputForm status={true} placeholder={language === '1' ? 'Especifique si tomas medicamentos controlados' : 'Especify if you take controlled medication'} fieldName={'medicamentos_5'} ref={input_medicamentos} onSubmitEditing={() => input_enfermedades.current.focus()}/>
                                        </View>
                                        <View style={{flex: 1, marginRight: '3%'}}>
                                            <TitleForms type={'subtitle'} title={language === '1' ? '¿Alguna enfermedad que deba conocer la empresa para tu bienestar? (Especifique)' : 'Do you have any illness that we should know about? (Specify)'}/>
                                            <InputForm status={true} placeholder={language === '1' ? '¿Alguna enfermedad que deba conocer la empresa para tu bienestar? (Especifique)' : 'Do you have any illness that we should know about? (Specify)'} fieldName={'enfermedades_5'} ref={input_enfermedades}/>
                                        </View>
                                    </View>
                                </>
                        }
                    </View>
                </ProgressStep>
            </KeyboardAwareScrollView>
            <Modal animationType='slide' transparent={true} visible={appointment}>
                <View style={styles.center}>
                    <View style={[styles.modal,{maxHeight: orientationInfo.initial === 'PORTRAIT' ? '41%' : '85%', maxWidth: orientationInfo.initial === 'PORTRAIT' ? '100%' : '70%' }]}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                                <Text style={{color: '#000', fontWeight: 'bold', fontSize: orientationInfo.initial === 'PORTRAIT' ? 18 : 20 }}>{language === '1' ? 'Si aún no tienes una cita programada con nosotros, por favor agéndala aquí.' : 'If you still do not have an appointment scheduled with us, please save it here.'}</Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch'}}>
                                <TouchableOpacity
                                    style={{flex: 1, marginVertical: 10, alignItems: 'center', justifyContent: 'center'}}
                                    onPress={() => handleWhatsApp()}
                                >
                                    <Image
                                        style={{width: !isTablet() ? 85 : orientationInfo.initial === 'PORTRAIT' ? 85 : 125, height: !isTablet() ? 85 : orientationInfo.initial === 'PORTRAIT' ? 85 : 125}}
                                        resizeMode='stretch'
                                        source={require('../../../../../assets/whatsapp.gif')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'stretch'}}>
                                <TouchableOpacity
                                    style={{height: 35, backgroundColor: '#1177E9', borderRadius: 8, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center'}}
                                    onPress={() => handleLinking()}
                                >
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: orientationInfo.initial === 'PORTRAIT' ? 15 : 20}}>{language === '1' ? 'En otro momento' : 'At another time'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c1c1c1',
        marginTop: 20,
	},
	header: {
		flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
		alignSelf: 'stretch',
        backgroundColor: '#f3f3f3',
        borderBottomWidth: 1,
        borderColor: '#c1c1c1',
        padding: 10,
	},
	body:{
		flex: 3,
		padding: 15,
        alignSelf: 'stretch',
	},
    title: {
        fontSize: 15,
        fontWeight: 'bold'
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