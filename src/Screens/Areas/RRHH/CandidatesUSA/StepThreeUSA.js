import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, Alert, BackHandler, Linking} from 'react-native';
import {InputForm, TitleForms} from '../../../../components';
import {ProgressStep} from 'react-native-progress-steps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useOrientation} from '../../../../hooks';
import {useFormikContext} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {contactEmail, live, login, origen, urlJobs} from '../../../../access/requestedData';
import {getCurrentDate} from '../../../../js/dates';
import {Blue} from '../../../../colors/colorsApp';

let currentOne = null;
let currentTwo = null;
let currentTwoLanguages = null;
let all = null;

let keyOne = 'stepOne'
let keyTwo = 'stepTwo'
let keyIdiomas = 'stepTwoIdiomas'

export default ({navigation, language, orientation, ...rest}) => {
    const input_nombre_uno = useRef()
    const input_ocupacion_uno = useRef()
    const input_telefono_uno = useRef()
    const input_nombre_dos = useRef()
    const input_ocupacion_dos = useRef()
    const input_telefono_dos = useRef()

    const getInfo = async () => {
        currentOne = await AsyncStorage.getItem(keyOne) || '[]';
        currentOne = JSON.parse(currentOne);

        currentTwo = await AsyncStorage.getItem(keyTwo) || '[]';
        currentTwo = JSON.parse(currentTwo);

        currentTwoLanguages = await AsyncStorage.getItem(keyIdiomas) || '[]';
        currentTwoLanguages = JSON.parse(currentTwoLanguages);

        all = {...currentOne, ...currentTwo};
    }

    useEffect(() => {
        getInfo()
    },[])

    const {submitForm, values} = useFormikContext();
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const [filters, setFilters] = useState({
        error: true,
    });

    const Alerta = () => {
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

    const AlertaEmail = () => {
        Alert.alert(
            'Application Created Successfully!',
            `Please be aware of your phone and email, we'll be contacting you soon to follow up with your application. \n\nFor more information:\n${contactEmail}`,
            [
                {
                    text: 'OK',
                    style: 'OK',
                    onPress: () => navigation.navigate('Choose')
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

    const {error} = filters;
    const {nombreRelacionUno_4_US, telefonoRelacionUno_4_US, ocupacionRelacionUno_4_US, nombreRelacionDos_4_US, telefonoRelacionDos_4_US, ocupacionRelacionDos_4_US} = values;

    const handleValues = async () => {
        if(nombreRelacionUno_4_US === undefined || nombreRelacionUno_4_US === '' || telefonoRelacionUno_4_US === undefined || telefonoRelacionUno_4_US === '' || ocupacionRelacionUno_4_US === undefined || ocupacionRelacionUno_4_US === '' || nombreRelacionDos_4_US === undefined || nombreRelacionDos_4_US === '' || telefonoRelacionDos_4_US === undefined || telefonoRelacionDos_4_US === '' || ocupacionRelacionDos_4_US === undefined || ocupacionRelacionDos_4_US === ''){
            Alerta()
        }
        else {
            let obj_3 = {
                refp_nombre1: nombreRelacionUno_4_US,
                refp_telefono1: telefonoRelacionUno_4_US,
                refp_ocupacion1: ocupacionRelacionUno_4_US,
                refp_nombre2: nombreRelacionDos_4_US,
                refp_telefono2: telefonoRelacionDos_4_US,
                refp_ocupacion2: ocupacionRelacionDos_4_US,
                cand_fecha_creacion: getCurrentDate(),
                cand_origen: origen
            }

            all = {...all, ...obj_3};

            console.log('all: ', all)
            console.log('currentTwoLanguages: ', currentTwoLanguages)
            const body = {
                'action': 'insert_precandidato',
                'data': all,
                'idiomas': currentTwoLanguages.filter(x => x.idioma !== '' && x),
                'login': login,
                'live': live,
                'country': 'US',
            }

            console.log('body: ', body)

            const request = await fetch(urlJobs, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const {response} = await request.json();

            if(response.status === 201){
                setFilters({...filters, error: false})
                await AsyncStorage.removeItem(keyOne);
                await AsyncStorage.removeItem(keyTwo);
                await AsyncStorage.removeItem(keyIdiomas);
                AlertaEmail()
                navigation.navigate('Choose')
            }

            else if(response.status === 400){
                await AsyncStorage.removeItem(keyOne);
                await AsyncStorage.removeItem(keyTwo);
                await AsyncStorage.removeItem(keyIdiomas);

                Alert.alert(
                    language === 1 ? 'Error al envíar su solicitud' : 'Error to send your request',
                    language === 1 ? 'Inténtelo de nuevo más tarde.' : 'Try later, again.',
                    [
                        { text: 'OK'}
                    ]
                )
                navigation.navigate('Choose')
            }

            else if(response.status === 405) {
                console.log('se ejecutó la acción 2 veces pero se guardó solo una vez')
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

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <ProgressStep
                errors={error}
                {...rest}
                nextBtnText={'Next'}
                previousBtnText=''
                nextBtnTextStyle={{color: '#fff', backgroundColor: '#1177E9', padding: 12, borderRadius: 15, fontWeight: 'bold'}}
                previousBtnTextStyle={{color: 'orange'}}
                nextBtnStyle={{ textAlign: 'center', padding: 0 }}
                previousBtnStyle={{ textAlign: 'center', padding: 0 }}
                previousBtnDisabled={true}
                nextBtnDisabled={false}
                onSubmit={() => handleValues()}
            >
                <View style={{alignSelf: 'stretch', paddingHorizontal: 18}}>
                    {
                        orientationInfo.initial === 'PORTRAIT'
                        ?
                            <>
                                <TitleForms type={'title'} title={'References'}/>
                                <View style={[styles.container, {marginTop: 10}]}>
                                    <View style={styles.header}>
                                        <Text style={styles.title}>Reference 1 </Text>
                                    </View>
                                    <View style={styles.body}>
                                        <TitleForms type={'subtitle'} title={'Name'} />
                                        <InputForm status={true} placeholder={'NAME'} fieldName={'nombreRelacionUno_4_US'} ref={input_nombre_uno} onSubmitEditing={() => input_telefono_uno.current.focus()}/>
                                        <TitleForms type={'subtitle'} title={'Phone number'}/>
                                        <InputForm keyboardType='numeric' status={true} placeholder={'PHONE NUMBER'} fieldName={'telefonoRelacionUno_4_US'} ref={input_telefono_uno} onSubmitEditing={() => input_ocupacion_uno.current.focus()}/>
                                        <TitleForms type={'subtitle'} title={'Occupation'}/>
                                        <InputForm status={true} placeholder={'OCCUPATION'} fieldName={'ocupacionRelacionUno_4_US'} ref={input_ocupacion_uno} onSubmitEditing={() => input_nombre_dos.current.focus()}/>
                                    </View>
                                </View>
                                <View style={[styles.container, {marginBottom: 15}]}>
                                    <View style={styles.header}>
                                        <Text style={styles.title}>Reference 2</Text>
                                    </View>
                                    <View style={styles.body}>
                                        <TitleForms type={'subtitle'} title={'Name'} />
                                        <InputForm status={true} placeholder={'NAME'} fieldName={'nombreRelacionDos_4_US'} ref={input_nombre_dos} onSubmitEditing={() => input_telefono_dos.current.focus()}/>
                                        <TitleForms type={'subtitle'} title={'Phone number'}/>
                                        <InputForm keyboardType='numeric' status={true} placeholder={'PHONE NUMBER'} fieldName={'telefonoRelacionDos_4_US'} ref={input_telefono_dos} onSubmitEditing={() => input_ocupacion_dos.current.focus()}/>
                                        <TitleForms type={'subtitle'} title={'Occupation'}/>
                                        <InputForm status={true} placeholder={'OCCUPATION'} fieldName={'ocupacionRelacionDos_4_US'} ref={input_ocupacion_dos}/>
                                    </View>
                                </View>
                            </>
                        :
                            <>
                                <TitleForms type={'title'} title={'References'}/>
                                <View style={styles.container}>
                                    <View style={styles.header}>
                                        <Text style={styles.title}> {'Reference 1'} </Text>
                                    </View>
                                    <View style={styles.body}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Name'} />
                                                <InputForm status={true} placeholder={'NAME'} fieldName={'nombreRelacionUno_4_US'} ref={input_nombre_uno} onSubmitEditing={() => input_telefono_uno.current.focus()}/>
                                            </View>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Phone number'}/>
                                                <InputForm keyboardType='numeric' status={true} placeholder={'PHONE NUMBER'} fieldName={'telefonoRelacionUno_4_US'} ref={input_telefono_uno} onSubmitEditing={() => input_ocupacion_uno.current.focus()}/>
                                            </View>
                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Occupation'}/>
                                                <InputForm status={true} placeholder={'OCCUPATION'} fieldName={'ocupacionRelacionUno_4_US'} ref={input_ocupacion_uno} onSubmitEditing={() => input_nombre_dos.current.focus()}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.container, {marginBottom: 15}]}>
                                    <View style={styles.header}>
                                        <Text style={styles.title}> {'Reference 2'} </Text>
                                    </View>
                                    <View style={styles.body}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Name'} />
                                                <InputForm status={true} placeholder={'NAME'} fieldName={'nombreRelacionDos_4_US'} ref={input_nombre_dos} onSubmitEditing={() => input_telefono_dos.current.focus()}/>
                                            </View>
                                            <View style={{flex: 1, marginRight: '3%'}}>
                                                <TitleForms type={'subtitle'} title={'Phone number'}/>
                                                <InputForm keyboardType='numeric' status={true} placeholder={'PHONE NUMBER'} fieldName={'telefonoRelacionDos_4_US'} ref={input_telefono_dos} onSubmitEditing={() => input_ocupacion_dos.current.focus()}/>
                                            </View>

                                            <View style={{flex: 1}}>
                                                <TitleForms type={'subtitle'} title={'Occupation'}/>
                                                <InputForm status={true} placeholder={'OCCUPATION'} fieldName={'ocupacionRelacionDos_4_US'} ref={input_ocupacion_dos}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </>
                    }
                </View>
            </ProgressStep>
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
    }
})