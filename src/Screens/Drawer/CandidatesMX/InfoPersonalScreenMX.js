import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Image, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderPortrait, HeaderLandscape, Title} from '../../../components';
import DeviceInfo from 'react-native-device-info';
import {useNavigation, useOrientation, useScroll} from '../../../hooks'
import {barStyle, barStyleBackground, SafeAreaBackground} from '../../../colors/colorsApp';
import {isIphone} from '../../../access/requestedData';
import {useFocusEffect} from '@react-navigation/native';
import {selectUserInfo} from '../../../slices/varSlice'
import {useSelector} from 'react-redux';
import tw from 'twrnc';

let user = '';

export default ({navigation, route: {params: {language, orientation}}}) => {
    user = useSelector(selectUserInfo)

    const {handlePath} = useNavigation();
    const {isTablet} = DeviceInfo;
    const [info, setInfo] = useState({})

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)

    useEffect(() => {
        let obj = {
            picture: user.data.datos_personales.foto ? `https://telat.mx/intranet/upload/fotos/${user.data.datos_personales.foto}` : '',
            name: user.data.datos_personales.nombre_completo,
            birth_date: user.data.datos_personales.fecha_nacimiento,
            age: user.data.datos_personales.edad,
            gender: user.data.datos_personales.genero === 'H' ? language === '1' ? 'MASCULINO' : 'MALE' : language === '1' ? 'FEMENINO' : 'FEMALE',
            curp: user.data.datos_personales.curp,
            rfc: user.data.datos_personales.rfc,
            homoclave: user.data.datos_personales.homoclave,
            birth_place: user.data.datos_personales.lugar_nacimiento ? user.data.datos_personales.lugar_nacimiento : 'N/A',
            country: user.data.datos_personales.info_pais ? user.data.datos_personales.info_pais : 'N/A',
            nationality: user.data.datos_personales.nacionalidad ? user.data.datos_personales.nacionalidad : 'N/A',
            residence_time: user.data.datos_personales.tiempo_residencia ? user.data.datos_personales.tiempo_residencia : 'N/A',
            laboral_permission: user.data.datos_personales.permiso_laboral ? user.data.datos_personales.permiso_laboral === '0' ? language === '1' ? 'NO' : 'NO' : language === '1' ? 'SÍ' : 'YES' : 'N/A',
            migratory_document_type: user.data.datos_personales.tipo_documento ? user.data.datos_personales.tipo_documento.toUpperCase() : 'N/A' ,
            document_number: user.data.datos_personales.num_documento ? user.data.datos_personales.num_documento : 'N/A',
            marital_status: user.data.datos_personales.estado_civil ? language === '1' ? user.data.datos_personales.estado_civil : user.data.datos_personales.estado_civil === 'SOLTERO' ? 'SINGLE' : 'MARRIED' : 'N/A',
            children_number: user.data.datos_personales.info_hijos ? user.data.datos_personales.info_hijos : 'N/A',
            economic_dependents: user.data.datos_personales.info_depen_economicos ? user.data.datos_personales.info_depen_economicos : 'N/A',
            lived_abroad: user.data.datos_personales.info_vivio_extranjero === '0' ? language === '1' ? 'NO' : 'NO' : language === '1' ? 'SÍ' : 'YES',
            time_abroad: user.data.datos_personales.info_tiempo_extranjero ? user.data.datos_personales.info_tiempo_extranjero : 'N/A',
            return_motives: user.data.datos_personales.info_motivo_regreso ? user.data.datos_personales.info_motivo_regreso : 'N/A' ,
            abroad_place: user.data.datos_personales.info_lugar_extranjero ? user.data.datos_personales.info_lugar_extranjero : 'N/A',
            cand_medio_reclutamiento: user.data.datos_personales.cand_medio_reclutamiento ? language === '1' ? user.data.datos_personales.cand_medio_reclutamiento : user.data.datos_personales.cand_medio_reclutamiento === 'Bolsa de Empleo' ? 'Job Board' : user.data.datos_personales.cand_medio_reclutamiento === 'Redes Sociales' ? 'Social media' : user.data.datos_personales.cand_medio_reclutamiento === 'Referido' ? 'Referred' : user.data.datos_personales.cand_medio_reclutamiento === 'Otro' ? 'Other' : user.data.datos_personales.cand_medio_reclutamiento : 'N/A',
            cand_medio_reclutamiento_desc: user.data.datos_personales.cand_medio_reclutamiento_descripcion ? user.data.datos_personales.cand_medio_reclutamiento_descripcion : 'N/A',
            alta_datos: user.data.datos_personales.alta_datos ? user.data.datos_personales.alta_datos : 'N/A',
            city: user.data.datos_personales.ciudad ? user.data.datos_personales.ciudad : 'N/A',
            delegacion_municipio: user.data.datos_personales.delegacion ? user.data.datos_personales.delegacion : 'N/A',
            colonia: user.data.datos_personales.colonia ? user.data.datos_personales.colonia : 'N/A',
            calle: user.data.datos_personales.calle ? user.data.datos_personales.calle : 'N/A' ,
            int_number: user.data.datos_personales.numero_int ? user.data.datos_personales.numero_int : 'N/A',
            ext_number: user.data.datos_personales.numero_ext ? user.data.datos_personales.numero_ext : 'N/A',
            references: user.data.datos_personales.referencias ? user.data.datos_personales.referencias : 'N/A',
            cp: user.data.datos_personales.cp ? user.data.datos_personales.cp : 'N/A',
            email: user.data.datos_personales.info_email ? user.data.datos_personales.info_email : 'N/A',
            personal_phone: user.data.datos_personales.info_telefono_celular ? user.data.datos_personales.info_telefono_celular : 'N/A',
            home_phone: user.data.datos_personales.info_telefono_fijo ? user.data.datos_personales.info_telefono_fijo : 'N/A',
            ciudad_fiscal: user.data.datos_personales.ciudad_fiscal ? user.data.datos_personales.ciudad_fiscal : 'N/A',
            delegacion_fiscal: user.data.datos_personales.delegacion_fiscal ? user.data.datos_personales.delegacion_fiscal : 'N/A',
            colonia_fiscal: user.data.datos_personales.colonia_fiscal ? user.data.datos_personales.colonia_fiscal : 'N/A',
            calle_fiscal: user.data.datos_personales.calle_fiscal ? user.data.datos_personales.calle_fiscal : 'N/A',
            numero_ext_fiscal: user.data.datos_personales.numero_ext_fiscal ? user.data.datos_personales.numero_ext_fiscal : 'N/A',
            numero_int_fiscal: user.data.datos_personales.numero_int_fiscal ? user.data.datos_personales.numero_int_fiscal : 'N/A',
            cp_fiscal: user.data.datos_personales.cp_fiscal ? user.data.datos_personales.cp_fiscal : 'N/A',
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

    const LandscapePhoneAndTablet = () => {
        return(
            <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}]`}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={tw`self-stretch`}
                    onScroll={handleScroll}
                    contentContainerStyle={{paddingTop: paddingTop}}
                >
                    <View style={tw`flex-2 items-center justify-center mb-5 mt-[3%]`}>
                        <View style={tw`w-47.5 h-47.5 rounded-full justify-center items-center border-8 border-[#dadada] my-5`}>
                        {
                            info.picture
                            ?
                                <Image
                                    style={imageStyle}
                                    resizeMode={'cover'}
                                    source={{uri: `${info.picture}`}}
                                />
                            :
                                <Image
                                    style={imageStyle}
                                    resizeMode={'cover'}
                                    source={require('../../../../assets/user.png')}
                                />
                        }
                    </View>
                    </View>
                    <Title title={language === '1' ? 'INFORMACIÓN PERSONAL' : 'PERSONAL INFORMATION'} icon={'user'}/>
                    <View style={tw`flex-row mb-4`}>
                        <View style={tw`justify-start items-start w-[100%]`}>
                            
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Nombre' : 'Name'}</Text>
                                    <Contenedor title={info.name} hasBottomLine={false}/>
                                </View>

                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Fecha de Nacimiento' : 'Date of Birth'}</Text>
                                    <Contenedor title={info.birth_date && info.birth_date.toUpperCase()} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Edad' : 'Age'}</Text>
                                    <Contenedor title={info.age} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Género' : 'Gender'}</Text>
                                    <Contenedor title={info.gender} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>CURP</Text>
                                    <Contenedor title={info.curp} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>RFC</Text>
                                    <Contenedor title={info.rfc} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>Homoclave</Text>
                                    <Contenedor title={info.homoclave} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Lugar de Nacimiento' : 'Place of Birth'}</Text>
                                    <Contenedor title={info.birth_place} hasBottomLine={false}/>
                                </View>
                                {
                                    info.nationality === 'MEXICANA'
                                    &&
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nacionalidad' : 'Nationality'}</Text>
                                            <Contenedor title={info.nationality ? language === '1' ? 'MEXICANA' : 'MEXICAN' : 'N/A'} hasBottomLine={false}/>
                                        </View>
                                }


                                <View style={tw`flex-1 ml-1.5`}>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                </View>
                            </View>

                            {
                                info.nationality !== 'MEXICANA' && info.nationality !== 'MEXICAN'
                                &&
                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={titleStyle}>{language === '1' ? 'País' : 'Country'}</Text>
                                            <Contenedor title={info.country} hasBottomLine={false}/>
                                        </View>
                                        <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nacionalidad' : 'Nationality'}</Text>
                                            <Contenedor title={info.nationality} hasBottomLine={false}/>
                                        </View>
                                    </View>
                            }

                            {
                                info.nationality !== 'MEXICANA' && info.nationality !== 'MEXICAN'
                                &&
                                    <>
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Tiempo de Residencia' : 'Time in Mexico'}</Text>
                                                <Contenedor title={info.residence_time} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Permiso Laboral' : 'Permission to work'}</Text>
                                                <Contenedor title={info.laboral_permission} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={[titleStyle]}>{language === '1' ? 'Tipo Documento Migratorio' : 'Document Migratory Type'}</Text>
                                                <Contenedor title={info.migratory_document_type} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={[titleStyle]}>No. Doc INM</Text>
                                                <Contenedor title={info.document_number} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </>
                            }
                            

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Estado Civil' : 'Marital Status'}</Text>
                                    <Contenedor title={info.marital_status} hasBottomLine={false}/>
                                </View>

                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Dep. Económicos' : 'Economic Dep.'}</Text>
                                    <Contenedor title={info.economic_dependents} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Número de Hijos' : 'Number of Children'}</Text>
                                    <Contenedor title={info.children_number} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1`}>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Vivió Extranjero' : 'Lived Abroad'}</Text>
                                    <Contenedor title={info.lived_abroad} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Tiempo' : 'Time'}</Text>
                                    <Contenedor title={info.time_abroad} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1`}>

                                </View>
                            </View>
                            
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Motivo de Regreso' : 'Reasons for Coming Back'}</Text>
                                    <Contenedor title={info.return_motives} hasBottomLine={false}/>
                                </View>

                                <View style={tw`flex-1 ml-1.5`}>
                                <Text style={[titleStyle]}>{language === '1' ? 'Lugar Dónde Vivió' : 'Place'}</Text>
                                    <Contenedor title={info.abroad_place} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                <Text style={titleStyle}>{language === '1' ? 'Medio de Reclutamiento' : 'Recruitment Platform'}</Text>
                                    <Contenedor title={info.cand_medio_reclutamiento} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Descripción' : 'Description'}</Text>
                                    <Contenedor title={info.cand_medio_reclutamiento_desc} hasBottomLine={false}/>
                                </View>
                            </View>

                            <Text style={[titleStyle, {paddingLeft: 7, paddingTop: 7}]}>{language === '1' ? 'Alta de Datos' : 'Registration Date'}</Text>
                            <Contenedor title={info.alta_datos}/>
                        </View>
                    </View>
                    <Title title={language === '1' ? 'DOMICILIO PERSONAL' : 'PERSONAL ADRESS'} icon={'caret-right'} tipo={1} main={14}/>
                    <View style={tw`flex-row mb-4`}>
                        <View style={tw`justify-start items-start w-[100%]`}>
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                    <Contenedor title={info.city} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Delegación/Municipio' : 'Municipality/Locality'}</Text>
                                    <Contenedor title={info.delegacion_municipio} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Colonia' : 'Neighborhood'}</Text>
                                    <Contenedor title={info.colonia} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Calle' : 'Street Name'}</Text>
                                    <Contenedor title={info.calle} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'No. Exterior' : 'Apt Number (External)'}</Text>
                                    <Contenedor title={info.ext_number} hasBottomLine={false}/>
                                </View>

                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'No. Interior' : 'Apt Number (Internal)'}</Text>
                                    <Contenedor title={info.int_number} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>{language === '1' ? 'Entre Calles' : 'Between Streets'}</Text>
                                    <Contenedor title={info.references === 'y' ? 'N/A' : info.references} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={[titleStyle]}>CP</Text>
                                    <Contenedor title={info.cp} hasBottomLine={false}/>
                                </View>

                                <View style={tw`flex-1 ml-1.5`}>

                                </View>
                            </View>
                        </View>
                    </View>

                    <Title title={language === '1' ? 'DOMICILIO FISCAL' : 'FISCAL ADRESS'} icon={'caret-right'} tipo={1} main={14}/>
                    <View style={tw`flex-row mb-4`}>
                        <View style={tw`justify-start items-start w-[100%]`}>
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                    <Contenedor title={info.ciudad_fiscal} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Delegación/Municipio' : 'Municipality/Locality'}</Text>
                                    <Contenedor title={info.delegacion_fiscal} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Colonia' : 'Neighborhood'}</Text>
                                    <Contenedor title={info.colonia_fiscal} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{language === '1' ? 'Calle' : 'Street Name'}</Text>
                                    <Contenedor title={info.calle_fiscal} hasBottomLine={false}/>
                                </View>
                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'No. Exterior' : 'Apt Number (External)'}</Text>
                                    <Contenedor title={info.numero_ext_fiscal} hasBottomLine={false}/>
                                </View>

                                <View style={tw`flex-1 ml-1.5`}>
                                    <Text style={titleStyle}>{language === '1' ? 'No. Interior' : 'Apt Number (Internal)'}</Text>
                                    <Contenedor title={info.numero_int_fiscal} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>CP</Text>
                                    <Contenedor title={info.cp_fiscal} hasBottomLine={false}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    

                    <Title title={language === '1' ? 'INFORMACIÓN DE CONTACTO' : 'CONTACT INFORMATION'} icon={'phone'}/>
                    <View style={tw`flex-row self-stretch justify-start items-start px-2 mb-[3%]`}>
                        <View style={tw`flex-1`}>
                            <Text style={[titleStyle]}>{language === '1' ? 'Correo Electrónico' : 'Email'}</Text>
                            <Contenedor title={info.email} hasBottomLine={false}/>
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={titleStyle}>{language === '1' ? 'Teléfono Celular' : 'Phone Number'}</Text>
                            <Contenedor title={info.personal_phone} hasBottomLine={false}/>
                        </View>
                        <View style={tw`flex-1 ml-1.5`}>
                            <Text style={titleStyle}>{language === '1' ? 'Teléfono Fijo' : 'Landline Number'}</Text>
                            <Contenedor title={info.home_phone} hasBottomLine={false}/>
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
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <HeaderPortrait title={language === '1' ? 'Datos Personales' : 'Personal Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                :
                    <HeaderLandscape title={language === '1' ? 'Datos Personales' : 'Personal Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
            }
            {
                isTablet()
                ?
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={tw`self-stretch`}
                                onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}}
                            >
                                <View style={tw`flex-2 items-center justify-center mb-5 mt-[3%]`}>
                                    <View style={tw`w-47.5 h-47.5 rounded-full justify-center items-center border-8 border-[#dadada] my-5 bg-[#dadada]`}>
                                        {
                                                info.picture
                                                ?
                                                    <Image
                                                        style={imageStyle}
                                                        resizeMode={'cover'}
                                                        source={{uri: `${info.picture}`}}
                                                    />
                                                :
                                                    <Image
                                                        style={imageStyle}
                                                        resizeMode={'cover'}
                                                        source={require('../../../../assets/user.png')}
                                                    />
                                            }
                                    </View>
                                </View>

                                <Title title={language === '1' ? 'INFORMACIÓN PERSONAL' : 'PERSONAL INFORMATION'} icon={'user'}/>
                                <View style={tw`flex-row mb-4`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`p-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Nombre' : 'Name'}</Text>
                                            <Contenedor title={info.name} hasBottomLine={false}/>
                                        </View>
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>

                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Fecha de Nacimiento' : 'Date of Birth'}</Text>
                                                <Contenedor title={info.birth_date && info.birth_date.toUpperCase()} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Edad' : 'Age'}</Text>
                                                <Contenedor title={info.age} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Género' : 'Gender'}</Text>
                                                <Contenedor title={info.gender} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>CURP</Text>
                                                <Contenedor title={info.curp} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>RFC</Text>
                                                <Contenedor title={info.rfc} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>Homoclave</Text>
                                                <Contenedor title={info.homoclave} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={{flex: .5}}>
                                                <Text style={titleStyle}>{language === '1' ? 'Lugar de Nacimiento' : 'Place of Birth'}</Text>
                                                <Contenedor title={info.birth_place} hasBottomLine={false}/>
                                            </View>
                                            {
                                                info.nationality === 'MEXICANA'
                                                &&
                                                    <View style={tw`flex-1 ml-1.5`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Nacionalidad' : 'Nationality'}</Text>
                                                        <Contenedor title={info.nationality ? language === '1' ? 'MEXICANA' : 'MEXICAN' : 'N/A'} hasBottomLine={false}/>
                                                    </View>
                                            }
                                        </View>

                                        {
                                            info.nationality !== 'MEXICANA' && info.nationality !== 'MEXICAN'
                                            &&
                                                <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                    <View style={tw`flex-1`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'País' : 'Country'}</Text>
                                                        <Contenedor title={info.country} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={tw`flex-1 ml-1.5`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Nacionalidad' : 'Nationality'}</Text>
                                                        <Contenedor title={info.nationality} hasBottomLine={false}/>
                                                    </View>
                                                </View>
                                        }
            
                                        {
                                            info.nationality !== 'MEXICANA' && info.nationality !== 'MEXICAN'
                                            &&
                                                <>
                                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Tiempo de Residencia' : 'Time in Mexico'}</Text>
                                                            <Contenedor title={info.residence_time} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={tw`flex-1 ml-1.5`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Permiso Laboral' : 'Permission to work'}</Text>
                                                            <Contenedor title={info.laboral_permission} hasBottomLine={false}/>
                                                        </View>
                                                    </View>

                                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={[titleStyle, {marginLeft: 6}]}>{language === '1' ? 'Tipo Documento Migratorio' : 'Document Migratory Type'}</Text>
                                                            <Contenedor title={info.migratory_document_type} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={[titleStyle]}>No. Doc INM</Text>
                                                            <Contenedor title={info.document_number} hasBottomLine={false}/>
                                                        </View>
                                                    </View>
                                                </>
                                        }
                                        

                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Estado Civil' : 'Marital Status'}</Text>
                                                <Contenedor title={info.marital_status} hasBottomLine={false}/>
                                            </View>

                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Dep. Económicos' : 'Economic Dep.'}</Text>
                                                <Contenedor title={info.economic_dependents} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Número de Hijos' : 'Number of Children'}</Text>
                                                <Contenedor title={info.children_number} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        
            
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Vivió Extranjero' : 'Lived Abroad'}</Text>
                                                <Contenedor title={info.lived_abroad} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Tiempo' : 'Time'}</Text>
                                                <Contenedor title={info.time_abroad} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={[titleStyle]}>{language === '1' ? 'Motivo de Regreso' : 'Reasons for Coming Back'}</Text>
                                                <Contenedor title={info.return_motives} hasBottomLine={false}/>
                                            </View>

                                            <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Lugar Dónde Vivió' : 'Place'}</Text>
                                                <Contenedor title={info.abroad_place} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                            <Text style={titleStyle}>{language === '1' ? 'Medio de Reclutamiento' : 'Recruitment Platform'}</Text>
                                                <Contenedor title={info.cand_medio_reclutamiento} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Descripción' : 'Description'}</Text>
                                                <Contenedor title={info.cand_medio_reclutamiento_desc} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'Alta de Datos' : 'Registration Date'}</Text>
                                        <Contenedor title={info.alta_datos}/>
                                    </View>
                                </View>
            

                                <Title title={language === '1' ? 'DIRECCIÓN' : 'ADDRESS'} icon={'map'}/>
                                <View style={tw`flex-row mb-4`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                                <Contenedor title={info.city} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Delegación/Municipio' : 'Municipality/Locality'}</Text>
                                                <Contenedor title={info.delegacion_municipio} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Colonia' : 'Neighborhood'}</Text>
                                                <Contenedor title={info.colonia} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Calle' : 'Street Name'}</Text>
                                                <Contenedor title={info.calle} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'No. Exterior' : 'Apt Number (External)'}</Text>
                                                <Contenedor title={info.ext_number} hasBottomLine={false}/>
                                            </View>

                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'No. Interior' : 'Apt Number (Internal)'}</Text>
                                                <Contenedor title={info.int_number} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={[titleStyle]}>{language === '1' ? 'Entre Calles' : 'Between Streets'}</Text>
                                                <Contenedor title={info.references === 'y' ? 'N/A' : info.references} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={[titleStyle]}>CP</Text>
                                                <Contenedor title={info.cp} hasBottomLine={false}/>
                                            </View>

                                            <View style={tw`flex-1 ml-1.5`}>

                                            </View>
                                        </View>
            
                                    </View>
                                </View>
            
                                <Title title={language === '1' ? 'INFORMACIÓN DE CONTACTO' : 'CONTACT INFORMATION'} icon={'phone'}/>
                                <View style={tw`flex-row self-stretch justify-start items-start p-2 mb-[3%]`}>
                                    <View style={tw`flex-1`}>
                                        <Text style={[titleStyle]}>{language === '1' ? 'Correo Electrónico' : 'Email'}</Text>
                                        <Contenedor title={info.email} hasBottomLine={false}/>
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={titleStyle}>{language === '1' ? 'Teléfono Celular' : 'Phone Number'}</Text>
                                        <Contenedor title={info.personal_phone} hasBottomLine={false}/>
                                    </View>
                                    <View style={tw`flex-1 ml-1.5`}>
                                        <Text style={titleStyle}>{language === '1' ? 'Teléfono Fijo' : 'Landline Number'}</Text>
                                        <Contenedor title={info.home_phone} hasBottomLine={false}/>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    :
                        <LandscapePhoneAndTablet />
                :
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={tw`self-stretch`}
                                onScroll={handleScroll}
                                contentContainerStyle={{paddingTop: paddingTop}}
                            >
                                <View style={tw`flex-2 items-center justify-center mb-5 mt-[3%]`}>
                                    <View style={tw`w-47.5 h-47.5 rounded-full justify-center items-center border-8 border-[#dadada] my-5`}>
                                        {
                                            info.picture
                                            ?
                                                <Image
                                                    style={imageStyle}
                                                    resizeMode={'cover'}
                                                    source={{uri: `${info.picture}`}}
                                                />
                                            :
                                                <Image
                                                    style={imageStyle}
                                                    resizeMode={'cover'}
                                                    source={require('../../../../assets/user.png')}
                                                />
                                        }
                                    </View>
                                </View>
                                
                                <Title title={language === '1' ? 'INFORMACIÓN PERSONAL' : 'PERSONAL INFORMATION'} icon={'user'}/>
                                <View style={tw`flex-row mb-2.5 p-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Nombre' : 'Name'}</Text>
                                            <Contenedor title={info.name} hasBottomLine={false}/>
                                        </View>

                                        <View style={tw`flex-row self-stretch justify-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Fecha de Nacimiento' : 'Date of Birth'}</Text>
                                                <Contenedor title={info.birth_date && info.birth_date.toUpperCase()} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Edad' : 'Age'}</Text>
                                                <Contenedor title={info.age} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Género' : 'Gender'}</Text>
                                                <Contenedor title={info.gender} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>CURP</Text>
                                                <Contenedor title={info.curp} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>RFC</Text>
                                                <Contenedor title={info.rfc} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>Homoclave</Text>
                                                <Contenedor title={info.homoclave} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Lugar de Nacimiento' : 'Place of Birth'}</Text>
                                                <Contenedor title={info.birth_place} hasBottomLine={false}/>
                                            </View>
                                            {
                                                info.nationality === 'MEXICANA'
                                                &&
                                                    <View style={tw`flex-1 ml-1.5`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Nacionalidad' : 'Nationality'}</Text>
                                                        <Contenedor title={info.nationality ? info.nationality ? language === '1' ? 'MEXICANA' : 'MEXICAN' : 'N/A' : 'N/A'} hasBottomLine={false}/>
                                                    </View>
                                            }
                                        </View>

                                        {
                                            info.nationality !== 'MEXICANA' && info.nationality !== 'MEXICAN'
                                            &&
                                                <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                                    <View style={tw`flex-1`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'País' : 'Country'}</Text>
                                                        <Contenedor title={info.country} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={tw`flex-1 ml-1.5`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Nacionalidad' : 'Nationality'}</Text>
                                                        <Contenedor title={info.nationality} hasBottomLine={false}/>
                                                    </View>
                                                </View>

                                        }
            
                                        {
                                            info.nationality !== 'MEXICANA' && info.nationality !== 'MEXICAN'
                                            &&
                                                <>
                                                    <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Tiempo de Residencia' : 'Time in Mexico'}</Text>
                                                            <Contenedor title={info.residence_time} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={tw`flex-1 ml-1.5`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Permiso Laboral' : 'Permission to work'}</Text>
                                                            <Contenedor title={info.laboral_permission} hasBottomLine={false}/>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Text style={[titleStyle]}>{language === '1' ? 'Tipo Documento Migratorio' : 'Document Migratory Type'}</Text>
                                                        <Contenedor title={info.migratory_document_type} hasBottomLine={false}/>
                                                    </View>

                                                    <View style={tw`py-2`}>
                                                        <Text style={[titleStyle]}>No. Doc INM</Text>
                                                        <Contenedor title={info.document_number} hasBottomLine={false}/>
                                                    </View>
                                                </>
                                        }
                                        
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Estado Civil' : 'Marital Status'}</Text>
                                                <Contenedor title={info.marital_status} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Dep. Económicos' : 'Economic Dep.'}</Text>
                                                <Contenedor title={info.economic_dependents} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Número de Hijos' : 'Number of Children'}</Text>
                                                <Contenedor title={info.children_number} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Vivió Extranjero' : 'Lived Abroad'}</Text>
                                                <Contenedor title={info.lived_abroad} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Tiempo' : 'Time'}</Text>
                                                <Contenedor title={info.time_abroad} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <Text style={[titleStyle]}>{language === '1' ? 'Motivo de Regreso' : 'Reasons for Coming Back'}</Text>
                                        <Contenedor title={info.return_motives} hasBottomLine={false}/>
                                        <View style={tw`py-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Lugar Dónde Vivió' : 'Place'}</Text>
                                            <Contenedor title={info.abroad_place} hasBottomLine={false}/>
                                        </View>
            
            
                                        <View style={tw`flex-row self-stretch justify-start items-start`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Medio de Reclutamiento' : 'Recruitment Platform'}</Text>
                                                <Contenedor title={info.cand_medio_reclutamiento} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Descripción' : 'Description'}</Text>
                                                <Contenedor title={info.cand_medio_reclutamiento_desc} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <View style={tw`pt-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Alta de Datos' : 'Registration Date'}</Text>
                                            <Contenedor title={info.alta_datos} hasBottomLine={false}/>
                                        </View>
                                    </View>
                                </View>

                                <Title title={language === '1' ? 'DOMICILIO PERSONAL' : 'PERSONAL ADRESS'} icon={'caret-right'} tipo={1} main={14}/>
                                <View style={tw`flex-row mb-2.5 p-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                                <Contenedor title={info.city} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Delegación/Municipio' : 'Municipality/Locality'}</Text>
                                                <Contenedor title={info.delegacion_municipio} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Colonia' : 'Neighborhood'}</Text>
                                                <Contenedor title={info.colonia} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Calle' : 'Street Name'}</Text>
                                                <Contenedor title={info.calle} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'No. Exterior' : 'Apt Number (External)'}</Text>
                                                <Contenedor title={info.ext_number} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'No. Interior' : 'Apt Number (Internal)'}</Text>
                                                <Contenedor title={info.int_number} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Entre Calles' : 'Between Streets'}</Text>
                                            <Contenedor title={info.references === 'y' ? 'N/A' : info.references} hasBottomLine={false}/>
                                        </View>
                                        <Text style={[titleStyle]}>CP</Text>
                                        <Contenedor title={info.cp} hasBottomLine={false}/>
                                    </View>
                                </View>

                                <Title title={language === '1' ? 'DOMICILIO FISCAL' : 'FISCAL ADRESS'} icon={'caret-right'} tipo={1} main={14}/>
                                <View style={tw`flex-row mb-2.5 p-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Ciudad' : 'City'}</Text>
                                                <Contenedor title={info.ciudad_fiscal} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Delegación/Municipio' : 'Municipality/Locality'}</Text>
                                                <Contenedor title={info.delegacion_fiscal} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Colonia' : 'Neighborhood'}</Text>
                                                <Contenedor title={info.colonia_fiscal} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Calle' : 'Street Name'}</Text>
                                                <Contenedor title={info.calle_fiscal} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={tw`flex-row self-stretch justify-start items-start pb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'No. Exterior' : 'Apt Number (External)'}</Text>
                                                <Contenedor title={info.numero_ext_fiscal} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'No. Interior' : 'Apt Number (Internal)'}</Text>
                                                <Contenedor title={info.numero_int_fiscal} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                        <Text style={[titleStyle]}>CP</Text>
                                        <Contenedor title={info.cp_fiscal} hasBottomLine={false}/>
                                    </View>
                                </View>

                                <Title title={language === '1' ? 'INFORMACIÓN DE CONTACTO' : 'CONTACT INFORMATION'} icon={'phone'}/>
                                <View style={tw`flex-row p-2 mb-[3%]`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={tw`pb-2`}>
                                            <Text style={[titleStyle]}>{language === '1' ? 'Correo Electrónico' : 'Email'}</Text>
                                            <Contenedor title={info.email} hasBottomLine={false}/>
                                        </View>
                                        <View style={tw`flex-row self-stretch justify-start items-start`} >
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono Celular' : 'Phone Number'}</Text>
                                                <Contenedor title={info.personal_phone} hasBottomLine={false}/>
                                            </View>
                                            <View style={tw`flex-1 ml-1.5`}>
                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono Fijo' : 'Landline Number'}</Text>
                                                <Contenedor title={info.home_phone} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    :
                        <LandscapePhoneAndTablet />
                    
            }
        </>
    );
}

const titleStyle = tw`text-sm text-[#1177E9] font-medium`
const imageStyle = tw`w-43 h-43 rounded-full`