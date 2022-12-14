import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderLandscape, HeaderPortrait, Title} from '../../../components';
import {useNavigation} from '../../../hooks'
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, SafeAreaBackground} from '../../../colors/colorsApp';
import {isIphone} from '../../../access/requestedData';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectLanguageApp, selectUserInfo} from '../../../slices/varSlice';
import {selectOrientation} from '../../../slices/orientationSlice';
import tw from 'twrnc';

let data = ''

export default ({navigation}) => {
    data = useSelector(selectUserInfo)
    const {handlePath} = useNavigation()
    const {isTablet} = DeviceInfo;
    const [info, setInfo] = useState({})
    const [contador, setContador] = useState(0)
    const orientation = useSelector(selectOrientation)
    const language = useSelector(selectLanguageApp)

    const [antiguedad, setAntiguedad] = useState({
        years: 0,
        months: 1,
        days: 0,
    })

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    useEffect(() => {
        const spt = data.data.datos_laborales.antiguedad.split(' ')
        setAntiguedad({...antiguedad, years: spt[0], months: spt[2], days: spt[4]})

        let obj = {
            emp_numero: data.data.datos_laborales.emp_numero,
            puesto: data.data.datos_laborales.puesto,
            area: data.data.datos_laborales.area,
            subarea: data.data.datos_laborales.subarea,
            fecha_ingreso: data.data.datos_laborales.fecha_ingreso,
            antiguedad: antiguedad ? antiguedad : 'N/A',
            tipo_contrato: data.data.datos_laborales.tipo_contrato ? data.data.datos_laborales.tipo_contrato : 'N/A',
            razon_social: data.data.datos_laborales.razon_social ? data.data.datos_laborales.razon_social : 'N/A',
            clasificacion: data.data.datos_laborales.clasificacion ? data.data.datos_laborales.clasificacion : 'N/A',
            emp_nss: data.data.datos_laborales.emp_nss ? data.data.datos_laborales.emp_nss : 'N/A',
            emp_tipo_nomina: data.data.datos_laborales.emp_tipo_nomina ? data.data.datos_laborales.emp_tipo_nomina : 'N/A',
            cand_ubicacion: data.data.datos_laborales.cand_ubicacion ? data.data.datos_laborales.cand_ubicacion : 'N/A',
            usuario_intranet: data.data.datos_laborales.usuario_intranet ? data.data.datos_laborales.usuario_intranet : 'N/A',
            hta_asignadas: data.data.datos_laborales.hta_asignadas ? data.data.datos_laborales.hta_asignadas : 'N/A',
            prestaciones: data.data.datos_laborales.prestaciones ? data.data.datos_laborales.prestaciones : 'N/A',
            credito: data.data.datos_laborales.credito ? data.data.datos_laborales.credito : 'N/A',
            numero_infonavit: data.data.datos_laborales.credito_infonavit ? data.data.datos_laborales.credito_infonavit : '',
            tipo_descuento: data.data.datos_laborales.credito_infonavit_tipo_desc ? data.data.datos_laborales.credito_infonavit_tipo_desc : 'N/A',
            importe_descuento_infonavit: data.data.datos_laborales.credito_infonavit_descto ? data.data.datos_laborales.credito_infonavit_descto : 'N/A',
            numero_fonacot: data.data.datos_laborales.credito_fonacot ? data.data.datos_laborales.credito_fonacot : '',
            importe_descuento_fonacot: data.data.datos_laborales.credito_fonacot_descto ? data.data.datos_laborales.aseguradora : 'N/A',
            aseguradora: data.data.datos_laborales.aseguradora ? data.data.datos_laborales.aseguradora : 'N/A',
            poliza: data.data.datos_laborales.poliza ? data.data.datos_laborales.poliza : 'N/A',
            numero_poliza: data.data.datos_laborales.poliza ? data.data.datos_laborales.poliza : 'N/A',
            numero_certificado: data.data.datos_laborales.poliza_nocertificado ? data.data.datos_laborales.poliza_nocertificado : 'N/A',
            fecha_alta_poliza: data.data.datos_laborales.fecha_alta_poliza ? data.data.datos_laborales.fecha_alta_poliza : 'N/A',
            banco: data.data.datos_laborales.banco ? data.data.datos_laborales.banco : 'N/A',
            no_cuenta: data.data.datos_laborales.no_cuenta ? data.data.datos_laborales.no_cuenta : 'N/A',
            clabe_banco: data.data.datos_laborales.clabe_banco ? data.data.datos_laborales.clabe_banco : 'N/A',
        }
        setInfo(obj)

        return undefined
    },[])

    const Contenedor = ({title, leftPosition = true, hasBottomLine = true}) => {
        return (
            <View style={tw`self-stretch items-${leftPosition ? 'start' : 'end'} justify-center pb-2 ml-${hasBottomLine ? 2 : 0}`}>
                <Text style={tw`text-sm text-[#000]`}>{title}</Text>
            </View>
        )
    }

    const LascapePhoneAndTablet = () => {
        return (
            <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={tw`self-stretch`}
                >
                    <View style={{marginTop: '3%'}}></View>
                    <Title title={language === '1' ? 'DATOS LABORALES' : 'LABORAL INFORMATION'} icon={'briefcase'} tipo={1}/>
                    <View style={tw`flex-row mb-4 mt-2.5`}>
                        <View style={tw`justify-start items-start w-[100%]`}>
                            <View style={tw`flex-row self-stretch justify-start items-start px-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'N??mero de Empleado' : 'Employee Number'}</Text>
                                    <Contenedor title={info.emp_numero} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Puesto' : 'Position'}</Text>
                                    <Contenedor title={info.puesto} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? '??rea' : 'Area'}</Text>
                                    <Contenedor title={info.area} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Sub-??rea' : 'Sub-Area'}</Text>
                                    <Contenedor title={info.subarea} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Admission'}</Text>
                                    <Contenedor title={info.fecha_ingreso} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Antig??edad' : 'Antiquity'}</Text>
                                    <Contenedor title={`${antiguedad.years} ${antiguedad.years === '1' ? 'A??o,' : 'A??os,'} ${antiguedad.months} ${antiguedad.months === '1' ? 'Mes,' : 'Meses,'} ${antiguedad.days} ${antiguedad.days === '1' ? 'D??a' : 'D??as'}`} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Contrato' : 'Contract'}</Text>
                                    <Contenedor title={info.tipo_contrato} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Raz??n Social' : 'Corporate Name'}</Text>
                                    <Contenedor title={info.razon_social} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`pb-2`}>
                                <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'Clasificaci??n' : 'Classification'}</Text>
                                <Contenedor title={info.clasificacion}/>
                            </View>
                            
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>No.NSS</Text>
                                    <Contenedor title={info.emp_nss} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'N??mina' : 'Payroll'}</Text>
                                    <Contenedor title={info.emp_tipo_nomina} hasBottomLine={false}/>
                                </View>

                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Ubicaci??n Laboral' : 'Laboral Location'}</Text>
                                    <Contenedor title={info.cand_ubicacion} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Usuario Intranet' : 'Intranet User'}</Text>
                                    <Contenedor title={info.usuario_intranet} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Herramientas Asignadas' : 'Assigned Tools'}</Text>
                                    <Contenedor title={info.hta_asignadas} hasBottomLine={false}/>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Title title={language === '1' ? 'PRESTACIONES LABORALES' : 'EMPLOYMENT BENEFITS'} icon={'list-ul'} tipo={1}/>
                    <View style={tw`flex-row mb-4 mt-2.5`}>
                        <View style={tw`justify-start items-start w-[100%]`}>
                            <Contenedor title={info.prestaciones}/>
                        </View>
                    </View>

                    {
                        info.credito === 'N/A'
                        ?
                            info.numero_infonavit !== '' && info.numero_fonacot !== ''
                            ?
                                <>
                                    <View style={tw`flex-row justify-center items-center`}>
                                        <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                            <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                <Icon name={'home'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                            </View>
                                        </View>
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <Title type={'title'} title={language === '1' ? 'DATOS DE INFONAVIT' : 'INFONAVIT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row my-2.5`}>
                                        <View style={tw`justify-start items-start w-[100%]`}>
                                            <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                            <Contenedor title={info.numero_infonavit}/>
                                            <View style={tw`flex-row self-stretch justify-start items-start px-2`}>
                                                <View style={tw`flex-1`}>
                                                    <Text style={titleStyle}>{language === '1' ? 'Tipo de Descuento' : 'Type Discount'}</Text>
                                                    <Contenedor title={info.tipo_descuento} hasBottomLine={false}/>
                                                </View>
                                                <View style={tw`flex-1 ml-1.5`}>
                                                    <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                    <Contenedor title={info.importe_descuento_infonavit} hasBottomLine={false}/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row justify-center items-center`}>
                                        <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                            <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                <IonIcons name={'cash-100'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                            </View>
                                        </View>
                                        <View style={tw`flex-1 justify-center items-center`}>
                                            <Title type={'title'} title={language === '1' ? 'DATOS DE FONACOT' : 'FONACOT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row mb-4`}>
                                        <View style={tw`justify-start items-start w-[100%]`}>
                                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                <View style={tw`flex-1`}>
                                                    <Text style={titleStyle}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                    <Contenedor title={info.numero_fonacot} hasBottomLine={false}/>
                                                </View>
                                                <View style={tw`flex-1 ml-1.5`}>
                                                    <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                    <Contenedor title={info.importe_descuento_fonacot} hasBottomLine={false}/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            :
                                info.numero_infonavit !== '' && info.numero_fonacot === ''
                                ?
                                    <>
                                        <View style={tw`flex-row justify-center items-center`}>
                                            <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                    <Icon name={'home'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                </View>
                                            </View>
                                            <View style={tw`flex-1 justify-center items-center`}>
                                                <Title type={'title'} title={language === '1' ? 'DATOS DE INFONAVIT' : 'INFONAVIT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row my-2.5`}>
                                            <View style={tw`justify-start items-start w-[100%]`}>
                                                <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                <Contenedor title={info.numero_infonavit}/>
                                                <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                    <View style={tw`flex-1`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Tipo de Descuento' : 'Type Discount'}</Text>
                                                        <Contenedor title={info.tipo_descuento} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={tw`flex-1 ml-1.5`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                        <Contenedor title={info.importe_descuento_infonavit} hasBottomLine={false}/>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                :
                                    info.numero_infonavit === '' && info.numero_fonacot !== ''
                                    &&
                                        <>
                                            <View style={tw`flex-row justify-center items-center`}>
                                                <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                    <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                        <IonIcons name={'cash-100'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                    </View>
                                                </View>
                                                <View style={tw`flex-1 justify-center items-center`}>
                                                    <Title type={'title'} title={language === '1' ? 'DATOS DE FONACOT' : 'FONACOT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                </View>
                                            </View>

                                            <View style={tw`flex-row mb-4`}>
                                                <View style={tw`justify-start items-start w-[100%]`}>
                                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                            <Contenedor title={info.numero_fonacot} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={tw`flex-1 ml-1.5`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                            <Contenedor title={info.importe_descuento_fonacot} hasBottomLine={false}/>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </>
                        :
                            <>
                                <View style={tw`flex-row justify-center items-center pb-2`}>
                                    <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                        <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                            <IonIcons name={'credit-card'} size={isTablet() ? 40 : 24} color='#fcb43c' />
                                        </View>
                                    </View>
                                    <View style={tw`flex-1 justify-center items-center`}>
                                        <Title type={'title'} title={language === '1' ? 'CR??DITO VIVIENDA' : 'HOME CREDIT'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                    </View>
                                </View>
                                <View style={tw`px-2 mb-4`}>
                                    <Contenedor title={'Cuenta con cr??dito para la vivienda'} hasBottomLine={false}/>
                                </View>
                            </>
                    }
                    
                    <Title title={language === '1' ? 'DATOS DE LA P??LIZA' : 'POLICY INFORMATION'} icon={'heart-pulse'} tipo={2}/>
                    <View style={tw`flex-row mb-2.5`}>
                        <View style={tw`justify-start items-start w-[100%]`}>
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Aseguradora' : 'Insurance Carrier'}</Text>
                                    <Contenedor title={info.aseguradora} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'N??mero de P??liza' : 'Policy Number'}</Text>
                                    <Contenedor title={info.numero_poliza} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start px-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'N??mero de Certificado' : 'Certificate Number'}</Text>
                                    <Contenedor title={info.numero_certificado} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Fecha de Alta' : 'Entry Date'}</Text>
                                    <Contenedor title={info.fecha_alta_poliza} hasBottomLine={false}/>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Title title={language === '1' ? 'DATOS BANCARIOS' : 'BANK DATA'} icon={'bank'} tipo={2}/>
                    <View style={tw`flex-row mt-2.5 mb-[3%]`}>
                        <View style={tw`justify-start items-start w-[100%]`}>
                            
                            <View style={tw`flex-row self-stretch justify-start items-start px-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Banco Emisor' : 'Insurance Carrier'}</Text>
                                    <Contenedor title={info.banco} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'N??mero de Cuenta' : 'Policy Number'}</Text>
                                    <Contenedor title={info.no_cuenta} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Clabe Interbancaria' : 'Interbank Clabe'}</Text>
                                    <Contenedor title={info.clabe_banco} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            {
                orientation === 'PORTRAIT'
                ?
                    <HeaderPortrait title={language === '1' ? 'Datos Laborales' : 'Laboral Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} />
                :
                    <HeaderLandscape title={language === '1' ? 'Datos Laborales' : 'Laboral Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} />
            }
            {
                isTablet()
                ?
                    orientation === 'PORTRAIT'
                    ?
                        <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false} 
                                style={tw`self-stretch`}
                                /* onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}} */
                            >
                                <View style={tw`mt-[3%]`} />
                                <Title title={language === '1' ? 'DATOS LABORALES' : 'LABORAL INFORMATION'} icon={'briefcase'} tipo={1}/>
                                <View style={tw`flex-row mb-4`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de Empleado' : 'Employee Number'}</Text>
                                                <Contenedor title={info.emp_numero} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Puesto' : 'Position'}</Text>
                                                <Contenedor title={info.puesto} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? '??rea' : 'Area'}</Text>
                                                <Contenedor title={info.area} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Sub-??rea' : 'Sub-Area'}</Text>
                                                <Contenedor title={info.subarea} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Admission'}</Text>
                                                <Contenedor title={info.fecha_ingreso} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Antig??edad' : 'Antiquity'}</Text>
                                                <Contenedor title={`${antiguedad.years} ${antiguedad.years === '1' ? 'A??o,' : 'A??os,'} ${antiguedad.months} ${antiguedad.months === '1' ? 'Mes,' : 'Meses,'} ${antiguedad.days} ${antiguedad.days === '1' ? 'D??a' : 'D??as'}`} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={[titleStyle]}>{language === '1' ? 'Contrato' : 'Contract'}</Text>
                                                <Contenedor title={info.tipo_contrato} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        
                                        <View style={tw`py-2`}>
                                            <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'Raz??n Social' : 'Corporate Name'}</Text>
                                            <Contenedor title={info.razon_social}/>
                                        </View>
                                        <View style={tw`py-2`}>
                                            <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'Clasificaci??n' : 'Classification'}</Text>
                                            <Contenedor title={info.clasificacion}/>
                                        </View>
                                        
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>No.NSS</Text>
                                                <Contenedor title={info.emp_nss} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mina' : 'Payroll'}</Text>
                                                <Contenedor title={info.emp_tipo_nomina} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={[titleStyle]}>{language === '1' ? 'Ubicaci??n Laboral' : 'Laboral Location'}</Text>
                                                <Contenedor title={info.cand_ubicacion} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={[titleStyle]}>{language === '1' ? 'Usuario Intranet' : 'Intranet User'}</Text>
                                                <Contenedor title={info.usuario_intranet} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`py-2`}>
                                            <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'Herramientas Asignadas' : 'Assigned Tools'}</Text>
                                            <Contenedor title={info.hta_asignadas}/>
                                        </View>
                                    </View>
                                </View>

                                <Title title={language === '1' ? 'PRESTACIONES LABORALES' : 'EMPLOYMENT BENEFITS'} icon={'list-ul'} tipo={1}/>
                                <View style={tw`flex-row mb-4 p-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <Contenedor title={info.prestaciones} hasBottomLine={false}/>
                                    </View>
                                </View>

                                {
                                    info.credito === 'N/A'
                                    ?
                                        info.numero_infonavit !== '' && info.numero_fonacot !== ''
                                        ?
                                            <>
                                                <View style={tw`flex-row justify-center items-center`}>
                                                    <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                        <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                            <Icon name={'home'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                        </View>
                                                    </View>
                                                    <View style={tw`flex-1 justify-center items-center`}>
                                                        <Title type={'title'} title={language === '1' ? 'DATOS DE INFONAVIT' : 'INFONAVIT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                    </View>
                                                </View>

                                                <View style={tw`flex-row py-2`}>
                                                    <View style={tw`justify-start items-start w-[100%]`}>
                                                        <View style={tw`py-2`}>
                                                            <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                            <Contenedor title={info.numero_infonavit}/>
                                                        </View>

                                                        <View style={tw`flex-row self-stretch justify-start items-start pt-2 px-2`}>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Tipo de Descuento' : 'Type Discount'}</Text>
                                                                <Contenedor title={info.tipo_descuento} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={tw`flex-1 ml-1.5`}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                                <Contenedor title={info.importe_descuento_infonavit} hasBottomLine={false}/>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={tw`flex-row justify-center items-center`}>
                                                    <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                        <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                            <IonIcons name={'cash-100'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                        </View>
                                                    </View>
                                                    <View style={tw`flex-1 justify-center items-center`}>
                                                        <Title type={'title'} title={language === '1' ? 'DATOS DE FONACOT' : 'FONACOT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                    </View>
                                                </View>

                                                <View style={tw`flex-row mb-4 pt-2`}>
                                                    <View style={tw`justify-start items-start w-[100%]`}>
                                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                                <Contenedor title={info.numero_fonacot} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={tw`flex-1 ml-1.5`}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                                <Contenedor title={info.importe_descuento_fonacot} hasBottomLine={false}/>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </>
                                        :
                                            info.numero_infonavit !== '' && info.numero_fonacot === ''
                                            ?
                                                <>
                                                    <View style={tw`flex-row justify-center items-center`}>
                                                        <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                            <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                                <Icon name={'home'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                            </View>
                                                        </View>
                                                        <View style={tw`flex-1 justify-center items-center`}>
                                                            <Title type={'title'} title={language === '1' ? 'DATOS DE INFONAVIT' : 'INFONAVIT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                        </View>
                                                    </View>

                                                    <View style={tw`flex-row py-2`}>
                                                        <View style={tw`justify-start items-start w-[100%]`}>
                                                            <View style={tw`py-2`}>
                                                                <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                                <Contenedor title={info.numero_infonavit}/>
                                                            </View>

                                                            <View style={tw`flex-row self-stretch justify-start items-start pt-2 px-2`}>
                                                                <View style={tw`flex-1`}>
                                                                    <Text style={titleStyle}>{language === '1' ? 'Tipo de Descuento' : 'Type Discount'}</Text>
                                                                    <Contenedor title={info.tipo_descuento} hasBottomLine={false}/>
                                                                </View>
                                                                <View style={tw`flex-1 ml-1.5`}>
                                                                    <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                                    <Contenedor title={info.importe_descuento_infonavit} hasBottomLine={false}/>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </>
                                            :
                                                info.numero_infonavit === '' && info.numero_fonacot !== ''
                                                &&
                                                    <>
                                                        <View style={tw`flex-row justify-center items-center`}>
                                                            <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                                <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                                    <IonIcons name={'cash-100'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                                </View>
                                                            </View>
                                                            <View style={tw`flex-1 justify-center items-center`}>
                                                                <Title type={'title'} title={language === '1' ? 'DATOS DE FONACOT' : 'FONACOT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex-row mb-4 pt-2`}>
                                                            <View style={tw`justify-start items-start w-[100%]`}>
                                                                <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                                    <View style={tw`flex-1`}>
                                                                        <Text style={titleStyle}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                                        <Contenedor title={info.numero_fonacot} hasBottomLine={false}/>
                                                                    </View>
                                                                    <View style={tw`flex-1 ml-1.5`}>
                                                                        <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                                        <Contenedor title={info.importe_descuento_fonacot} hasBottomLine={false}/>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </>
                                    :
                                        <>
                                            <View style={tw`flex-row justify-center items-center pb-2`}>
                                                <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                    <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                        <IonIcons name={'credit-card'} size={isTablet() ? 40 : 24} color='#fcb43c' />
                                                    </View>
                                                </View>
                                                <View style={tw`flex-1 justify-center items-center`}>
                                                    <Title type={'title'} title={language === '1' ? 'CR??DITO VIVIENDA' : 'HOME CREDIT'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                </View>
                                            </View>
                                            <View style={tw`px-2 mb-4`}>
                                                <Contenedor title={'Cuenta con cr??dito para la vivienda'} hasBottomLine={false}/>
                                            </View>
                                        </>
                                }
                                

                                <Title title={language === '1' ? 'DATOS DE LA P??LIZA' : 'POLICY INFORMATION'} icon={'heart-pulse'} tipo={2}/>
                                <View style={tw`flex-row mb-4`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Aseguradora' : 'Insurance Carrier'}</Text>
                                                <Contenedor title={info.aseguradora} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de P??liza' : 'Policy Number'}</Text>
                                                <Contenedor title={info.numero_poliza} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de Certificado' : 'Certificate Number'}</Text>
                                                <Contenedor title={info.numero_certificado} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Fecha de Alta' : 'Entry Date'}</Text>
                                                <Contenedor title={info.fecha_alta_poliza} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <Title title={language === '1' ? 'DATOS BANCARIOS' : 'BANK DATA'} icon={'bank'} tipo={2}/>
                                <View style={tw`flex-row mt-2.5 mb-[3%]`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={[titleStyle]}>{language === '1' ? 'Banco Emisor' : 'Insurance Carrier'}</Text>
                                                <Contenedor title={info.banco} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de Cuenta' : 'Policy Number'}</Text>
                                                <Contenedor title={info.no_cuenta} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Clabe Interbancaria' : 'Interbank Clabe'}</Text>
                                                <Contenedor title={info.clabe_banco} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    :
                        <LascapePhoneAndTablet />
                :
                    orientation === 'PORTRAIT'
                    ?
                        <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={tw`self-stretch`}
                                /* onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}} */
                            >
                                <View style={tw`mt-[3%]`} />
                                <Title title={language === '1' ? 'DATOS LABORALES' : 'LABORAL INFORMATION'} icon={'briefcase'} tipo={1}/>
                                <View style={tw`flex-row mb-4 p-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de Empleado' : 'Employee Number'}</Text>
                                                <Contenedor title={info.emp_numero} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Puesto' : 'Position'}</Text>
                                                <Contenedor title={info.puesto} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? '??rea' : 'Area'}</Text>
                                                <Contenedor title={info.area} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Sub-??rea' : 'Sub-Area'}</Text>
                                                <Contenedor title={info.subarea} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Fecha de Ingreso' : 'Date of Admission'}</Text>
                                                <Contenedor title={info.fecha_ingreso} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Antig??edad' : 'Antiquity'}</Text>
                                                <Contenedor title={`${antiguedad.years} ${antiguedad.years === '1' ? 'A??o,' : 'A??os,'} ${antiguedad.months} ${antiguedad.months === '1' ? 'Mes,' : 'Meses,'} ${antiguedad.days} ${antiguedad.days === '1' ? 'D??a' : 'D??as'}`} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Contrato' : 'Contract'}</Text>
                                            <Contenedor title={info.tipo_contrato} hasBottomLine={false}/>
                                        </View>

                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Raz??n Social' : 'Corporate Name'}</Text>
                                            <Contenedor title={info.razon_social} hasBottomLine={false}/>
                                        </View>
                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Clasificaci??n' : 'Classification'}</Text>
                                            <Contenedor title={info.clasificacion} hasBottomLine={false}/>
                                        </View>
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>No.NSS</Text>
                                                <Contenedor title={info.emp_nss} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mina' : 'Payroll'}</Text>
                                                <Contenedor title={info.emp_tipo_nomina} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Ubicaci??n Laboral' : 'Laboral Location'}</Text>
                                            <Contenedor title={info.cand_ubicacion} hasBottomLine={false}/>
                                        </View>
                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Usuario Intranet' : 'Intranet User'}</Text>
                                            <Contenedor title={info.usuario_intranet} hasBottomLine={false}/>
                                        </View>
                                        <Text style={[titleStyle]}>{language === '1' ? 'Herramientas Asignadas' : 'Assigned Tools'}</Text>
                                        <Contenedor title={info.hta_asignadas} hasBottomLine={false}/>
                                    </View>
                                </View>

                                <Title title={language === '1' ? 'PRESTACIONES LABORALES' : 'EMPLOYMENT BENEFITS'} icon={'list-ul'} tipo={1}/>
                                <View style={tw`flex-row mb-4 px-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <Contenedor title={info.prestaciones} hasBottomLine={false}/>
                                    </View>
                                </View>

                                {
                                    info.credito === 'N/A'
                                    ?
                                        info.numero_infonavit !== '' && info.numero_fonacot !== ''
                                        ?
                                            <>
                                                <View style={tw`flex-row justify-center items-center pb-2`}>
                                                    <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                        <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                            <Icon name={'home'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                        </View>
                                                    </View>
                                                    <View style={tw`flex-1 justify-center items-center`}>
                                                        <Title type={'title'} title={language === '1' ? 'DATOS DE INFONAVIT' : 'INFONAVIT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                    </View>
                                                </View>

                                                <View style={tw`flex-row mb-4 px-2`}>
                                                    <View style={tw`justify-start items-start w-[100%]`}>
                                                        <View style={tw`pb-2`}>
                                                            <Text style={[titleStyle]}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                            <Contenedor title={info.numero_infonavit} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={tw`flex-row self-stretch justify-start items-start`}>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Tipo de Descuento' : 'Type Discount'}</Text>
                                                                <Contenedor title={info.tipo_descuento} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={tw`flex-1 ml-1.5`}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                                <Contenedor title={info.importe_descuento_infonavit} hasBottomLine={false}/>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={tw`flex-row justify-center items-center pb-2`}>
                                                    <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                        <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                            <IonIcons name={'cash-100'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                        </View>
                                                    </View>
                                                    <View style={tw`flex-1 justify-center items-center`}>
                                                        <Title type={'title'} title={language === '1' ? 'DATOS DE FONACOT' : 'FONACOT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                    </View>
                                                </View>

                                                <View style={tw`flex-row mb-4 px-2`}>
                                                    <View style={tw`justify-start items-start w-[100%]`}>
                                                        <View style={tw`flex-row self-stretch justify-start items-start`}>
                                                            <View style={tw`flex-1`}>
                                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                                <Contenedor title={info.numero_fonacot} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={tw`flex-1 ml-1.5`}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                                <Contenedor title={info.importe_descuento_fonacot} hasBottomLine={false}/>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </>
                                        :
                                            info.numero_infonavit !== '' && info.numero_fonacot === ''
                                            ?
                                                <>
                                                    <View style={tw`flex-row justify-center items-center pb-2`}>
                                                        <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                            <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                                <Icon name={'home'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                            </View>
                                                        </View>
                                                        <View style={tw`flex-1 justify-center items-center`}>
                                                            <Title type={'title'} title={language === '1' ? 'DATOS DE INFONAVIT' : 'INFONAVIT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                        </View>
                                                    </View>

                                                    <View style={tw`flex-row mb-4 px-2`}>
                                                        <View style={tw`justify-start items-start w-[100%]`}>
                                                            <View style={tw`pb-2`}>
                                                                <Text style={[titleStyle]}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                                <Contenedor title={info.numero_infonavit} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={tw`flex-row self-stretch justify-start items-start`}>
                                                                <View style={tw`flex-1`}>
                                                                    <Text style={titleStyle}>{language === '1' ? 'Tipo de Descuento' : 'Type Discount'}</Text>
                                                                    <Contenedor title={info.tipo_descuento} hasBottomLine={false}/>
                                                                </View>
                                                                <View style={tw`flex-1 ml-1.5`}>
                                                                    <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                                    <Contenedor title={info.importe_descuento_infonavit} hasBottomLine={false}/>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </>
                                            :
                                                info.numero_infonavit === '' && info.numero_fonacot !== ''
                                                &&
                                                    <>
                                                        <View style={tw`flex-row justify-center items-center pb-2`}>
                                                            <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                                <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                                    <IonIcons name={'cash-100'} size={isTablet() ? 40 : 28} color='#fcb43c' />
                                                                </View>
                                                            </View>
                                                            <View style={tw`flex-1 justify-center items-center`}>
                                                                <Title type={'title'} title={language === '1' ? 'DATOS DE FONACOT' : 'FONACOT INFORMATION'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex-row mb-4 px-2`}>
                                                            <View style={tw`justify-start items-start w-[100%]`}>
                                                                <View style={tw`flex-row self-stretch justify-start items-start`}>
                                                                    <View style={tw`flex-1`}>
                                                                        <Text style={titleStyle}>{language === '1' ? 'N??mero de Cr??dito' : 'Credit Number'}</Text>
                                                                        <Contenedor title={info.numero_fonacot} hasBottomLine={false}/>
                                                                    </View>
                                                                    <View style={tw`flex-1 ml-1.5`}>
                                                                        <Text style={titleStyle}>{language === '1' ? 'Importe de Descuento' : 'Discount Amount'}</Text>
                                                                        <Contenedor title={info.importe_descuento_fonacot} hasBottomLine={false}/>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </>
                                    :
                                        <>
                                            <View style={tw`flex-row justify-center items-center pb-2`}>
                                                <View style={tw`w-[${orientation === 'PORTRAIT' ? '9%' : '5%'}] pr-1.5`}>
                                                    <View style={tw`w-[100%] h-10 justify-center items-center`}>
                                                        <IonIcons name={'credit-card'} size={isTablet() ? 40 : 24} color='#fcb43c' />
                                                    </View>
                                                </View>
                                                <View style={tw`flex-1 justify-center items-center`}>
                                                    <Title type={'title'} title={language === '1' ? 'CR??DITO VIVIENDA' : 'HOME CREDIT'} color={'#1177E9'} fontSize={isTablet() ? 24 : 20}/>
                                                </View>
                                            </View>
                                            <View style={tw`px-2 mb-4`}>
                                                <Contenedor title={'Cuenta con cr??dito para la vivienda'} hasBottomLine={false}/>
                                            </View>
                                        </>
                                }
                                
                                <Title title={language === '1' ? 'DATOS DE LA P??LIZA' : 'POLICY INFORMATION'} icon={'heart-pulse'} tipo={2}/>
                                <View style={tw`flex-row mb-4 px-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Aseguradora' : 'Insurance Carrier'}</Text>
                                                <Contenedor title={info.aseguradora} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de P??liza' : 'Policy Number'}</Text>
                                                <Contenedor title={info.numero_poliza} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row self-stretch justify-start items-start`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de Certificado' : 'Certificate Number'}</Text>
                                                <Contenedor title={info.numero_certificado} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Fecha de Alta' : 'Entry Date'}</Text>
                                                <Contenedor title={info.fecha_alta_poliza} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                                <Title title={language === '1' ? 'DATOS BANCARIOS' : 'BANK DATA'} icon={'bank'} tipo={2}/>
                                <View style={tw`flex-row pb-2 px-2 mb-[3%]`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Banco Emisor' : 'Insurance Carrier'}</Text>
                                            <Contenedor title={info.banco} hasBottomLine={false}/>
                                        </View>
                                        <View style={tw`flex-row self-stretch justify-start items-start`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'N??mero de Cuenta' : 'Policy Number'}</Text>
                                                <Contenedor title={info.no_cuenta} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Clabe Interbancaria' : 'Interbank Clabe'}</Text>
                                                <Contenedor title={info.clabe_banco} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    :
                        <LascapePhoneAndTablet />
            }
        </>
    );
}

const titleStyle = tw`text-sm text-[#1177E9] font-medium`