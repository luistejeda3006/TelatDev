import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, Alert, BackHandler} from 'react-native';
import {InputForm, ProgressStepActions, TitleForms} from '../../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFormikContext} from 'formik';
import {Blue} from '../../../../colors/colorsApp';
import {live, login, urlJobs, origen} from '../../../../access/requestedData';
import {getCurrentDate} from '../../../../js/dates';
import {useSelector} from 'react-redux';
import {selectOrientation} from '../../../../slices/orientationSlice';
import {selectLanguageApp} from '../../../../slices/varSlice';
import { selectStepOneMX, selectStepThreeMX, selectStepTwoMX } from '../../../../slices/applicationForm';

let stepOneInfo = null;
let stepTwoInfo = null;
let stepThreeInfo = null;
let all = null;

export default ({navigation}) => {
    stepOneInfo = useSelector(selectStepOneMX)
    stepTwoInfo = useSelector(selectStepTwoMX)
    stepThreeInfo = useSelector(selectStepThreeMX)

    const orientation = useSelector(selectOrientation)
    const language = useSelector(selectLanguageApp)

    const input_nombre_uno = useRef()
    const input_ocupacion_uno = useRef()
    const input_relacion_uno = useRef()
    const input_telefono_uno = useRef()
    const input_nombre_dos = useRef()
    const input_ocupacion_dos = useRef()
    const input_relacion_dos = useRef()
    const input_telefono_dos = useRef()

    const {submitForm, values} = useFormikContext();

    const [filters, setFilters] = useState({
        error: true,
    });

    const {error} = filters;
    const {nombreRelacion_1, ocupacionRelacion_1, relacion_1, telefonoRelacion_1, nombreRelacion_2, ocupacionRelacion_2, relacion_2, telefonoRelacion_2} = values;

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

    const handleValues = async () => {
        if(nombreRelacion_1 === undefined || nombreRelacion_1 === '' || ocupacionRelacion_1 === undefined || ocupacionRelacion_1 === '' || relacion_1 === undefined || relacion_1 === '' || telefonoRelacion_1 === undefined || telefonoRelacion_1 === '' || nombreRelacion_2 === undefined || nombreRelacion_2 === '' || ocupacionRelacion_2 === undefined || ocupacionRelacion_2 === '' || relacion_2 === undefined || relacion_2 === '' || telefonoRelacion_2 === undefined || telefonoRelacion_2 === ''){
            Alerta();
        }
        else {
            if(telefonoRelacion_1.length === 10 && telefonoRelacion_2.length === 10){
                const obj_4 = {
                    refp_nombre1: nombreRelacion_1.toUpperCase(),
                    refp_ocupacion1: ocupacionRelacion_1.toUpperCase(),
                    refp_relacion1: relacion_1.toUpperCase(),
                    refp_telefono: telefonoRelacion_1,
                    refp_nombre2: nombreRelacion_2.toUpperCase(),
                    refp_ocupacion2: ocupacionRelacion_2.toUpperCase(),
                    refp_relacion2: relacion_2.toUpperCase(),
                    refp_telefono2: telefonoRelacion_2,
                    cand_fecha_creacion: getCurrentDate(),
                    cand_origen: origen
                }

                all = {...stepOneInfo, ...stepTwoInfo, ...stepThreeInfo, ...obj_4}

                const body = {
                    'action': 'insert_precandidato',
                    'country': 'MX',
                    'data': all,
                    'login': login,
                    'live': live,
                }

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
                        setFilters({...filters, error: false, appointment: false})
                        Alert.alert(
                            language === '1' ? '¡Solicitud Creada Correctamente!' : 'Application Created Successfully!',
                            language === '1' ? 'Se ha registrado correctamente su solicitud.' : 'Your request has been successfully registered.',
                            [
                                { text: 'OK'}
                            ]
                        )
                        navigation.navigate('Choose')
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
                            <TitleForms type={'title'} title={language === '1' ? 'Referencias Personales (No Familiares)' : 'Personal References (non-family members)'}/>
                            <View style={[styles.container, {marginTop: 5}]}>
                                <View style={styles.header}>
                                    <Text style={styles.title}> {language === '1' ? 'Referencia No.1' : 'Reference Number 1'} </Text>
                                </View>
                                <View style={styles.body}>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Nombre' : 'Name'} />
                                    <InputForm status={true} placeholder={language === '1' ? 'Nombre completo' : 'Full name'} fieldName={'nombreRelacion_1'} ref={input_nombre_uno} onSubmitEditing={() => input_ocupacion_uno.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Ocupación' : 'Occupation'}/>
                                    <InputForm status={true} placeholder={language === '1' ? 'Específica ocupación' : 'Especify occupation'} fieldName={'ocupacionRelacion_1'} ref={input_ocupacion_uno} onSubmitEditing={() => input_relacion_uno.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Cómo los conoces?' : 'How do you know them?'}/>
                                    <InputForm status={true} placeholder={language === '1' ? 'Específica la relación' : 'Especify how do you know them'} fieldName={'relacion_1'}ref={input_relacion_uno} onSubmitEditing={() => input_telefono_uno.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Número telefónico' : 'Phone number'}/>
                                    <InputForm keyboardType='number-pad' returnKeyType={'done'} maxLength={10} status={true} placeholder={language === '1' ? 'Número telefónico' : 'Phone number'} fieldName={'telefonoRelacion_1'}ref={input_telefono_uno} onSubmitEditing={() => input_nombre_dos.current.focus()}/>
                                </View>
                            </View>
                            <View style={[styles.container, {marginBottom: 15}]}>
                                <View style={styles.header}>
                                    <Text style={styles.title}> {language === '1' ? 'Referencia No.2' : 'Reference Number 2'} </Text>
                                </View>
                                <View style={styles.body}>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Nombre' : 'Name'}/>
                                    <InputForm status={true} placeholder={language === '1' ? 'Nombre completo' : 'Full name'} fieldName={'nombreRelacion_2'} ref={input_nombre_dos} onSubmitEditing={() => input_ocupacion_dos.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Ocupación' : 'Occupation'}/>
                                    <InputForm status={true} placeholder={language === '1' ? 'Específica ocupación' : 'Especify occupation'} fieldName={'ocupacionRelacion_2'} ref={input_ocupacion_dos} onSubmitEditing={() => input_relacion_dos.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? '¿Cómo los conoces?' : 'How do you know them?'}/>
                                    <InputForm status={true} placeholder={language === '1' ? 'Específica la relación' : 'Especify how do you know them'} fieldName={'relacion_2'} ref={input_relacion_dos} onSubmitEditing={() => input_telefono_dos.current.focus()}/>
                                    <TitleForms type={'subtitle'} title={language === '1' ? 'Número telefónico' : 'Phone number'}/>
                                    <InputForm keyboardType='number-pad' returnKeyType={'done'} maxLength={10} status={true} placeholder={language === '1' ? 'Número telefónico' : 'Phone number'} fieldName={'telefonoRelacion_2'} ref={input_telefono_dos}/>
                                </View>
                            </View>
                            <ProgressStepActions handleNext={handleValues} language={language} finalStep={true}/>
                        </>
                    :
                        <></>
                }
            </View>
        </KeyboardAwareScrollView>
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
        borderRadius: 15
	},
	header: {
		flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
		alignSelf: 'stretch',
        backgroundColor: Blue,
        borderBottomWidth: 1,
        borderColor: '#c1c1c1',
        padding: 10,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15
	},
	body:{
		flex: 3,
		padding: 15,
        alignSelf: 'stretch',
	},
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    scrollContainer: {
        flexGrow:1,
    },
})