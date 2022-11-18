import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderPortrait, HeaderLandscape, Title} from '../../../components';
import {useNavigation, useOrientation, useScroll} from '../../../hooks'
import {barStyle, barStyleBackground, SafeAreaBackground} from '../../../colors/colorsApp';
import {isIphone} from '../../../access/requestedData';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '../../../slices/varSlice';
import tw from 'twrnc';

let data = ''

export default ({navigation, route: {params: {language, orientation}}}) => {
    data = useSelector(selectUserInfo)
    const {handlePath} = useNavigation()
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
            nivel_estudio: data.data.curriculum.curr_nivel_estudio ? language === '1' ? data.data.curriculum.curr_nivel_estudio : data.data.curriculum.curr_nivel_estudio === 'Primaria' ? 'Elementary School' : data.data.curriculum.curr_nivel_estudio === 'Secundaria' ? 'Middle School' : data.data.curriculum.curr_nivel_estudio === 'Preparatoria' ? 'Highschool' : data.data.curriculum.curr_nivel_estudio === 'Licenciatura' ? 'Bachelor’s Degree': data.data.curriculum.curr_nivel_estudio === 'Postgrado' ? 'Postgraduate Studies' : data.data.curriculum.curr_nivel_estudio : 'N/A',
            graduacion: data.data.curriculum.curr_anno ? data.data.curriculum.curr_anno : 'N/A',
            titulo_academico: data.data.curriculum.curr_titulo ? data.data.curriculum.curr_titulo : 'N/A',
            institucion: data.data.curriculum.curr_institucion ? data.data.curriculum.curr_institucion : 'N/A',
            cursando: data.data.curriculum.curr_cursando === '0' ? language === '1' ? 'NO' : 'NO' : language === '1' ? 'SÍ' : 'YES',
            horario: data.data.curriculum.curr_horario ? data.data.curriculum.curr_horario : 'N/A',
            otros_estudios: data.data.curriculum.curr_otros_estudios ? data.data.curriculum.curr_otros_estudios : 'N/A',
            paquetes_computacionales: data.data.curriculum.curr_pkg_computo ? data.data.curriculum.curr_pkg_computo : 'N/A',
            lugar_aprendizaje: data.data.curriculum.lugar_aprendizaje ? language === '1' ? data.data.curriculum.lugar_aprendizaje : data.data.curriculum.lugar_aprendizaje === 'ESCUELA (MÉXICO)' ? 'SCHOOL (MEXICO)' : data.data.curriculum.lugar_aprendizaje === 'ESTADOS UNIDOS' ? 'USA' : data.data.curriculum.lugar_aprendizaje === 'INDEPENDIENTE' ? 'INDEPENDENT' : data.data.curriculum.lugar_aprendizaje : 'N/A',
            nivel_escritura: data.data.curriculum.nivel_escritura ? language === '1' ? data.data.curriculum.nivel_escritura.toUpperCase() : data.data.curriculum.nivel_escritura.toUpperCase() === 'BÁSICO' ? 'BASIC' : data.data.curriculum.nivel_escritura.toUpperCase() === 'INTERMEDIO' ? 'INTERMEDIATE' : data.data.curriculum.nivel_escritura.toUpperCase() === 'AVANZADO' && 'ADVANCED' : 'N/A',
            nivel_lectura: data.data.curriculum.nivel_lectura ? language === '1' ? data.data.curriculum.nivel_lectura.toUpperCase() : data.data.curriculum.nivel_lectura.toUpperCase() === 'BÁSICO' ? 'Basic' : data.data.curriculum.nivel_lectura.toUpperCase() === 'INTERMEDIO' ? 'INTERMEDIATE' : data.data.curriculum.nivel_lectura.toUpperCase() === 'AVANZADO' && 'ADVANCED' : 'N/A',
            nivel_comprension: data.data.curriculum.nivel_comprension ? language === '1' ? data.data.curriculum.nivel_comprension.toUpperCase() : data.data.curriculum.nivel_comprension.toUpperCase() === 'BÁSICO' ? 'BASIC' : data.data.curriculum.nivel_comprension.toUpperCase() === 'INTERMEDIO' ? 'INTERMEDIATE' : data.data.curriculum.nivel_comprension.toUpperCase() === 'AVANZADO' && 'ADVANCED' : 'N/A',
            nivel_conversacional: data.data.curriculum.nivel_conversacional ? language === '1' ? data.data.curriculum.nivel_conversacional.toUpperCase() : data.data.curriculum.nivel_conversacional.toUpperCase() === 'BÁSICO' ? 'BASIC' : data.data.curriculum.nivel_conversacional.toUpperCase() === 'INTERMEDIO' ? 'INTERMEDIATE' : data.data.curriculum.nivel_conversacional.toUpperCase() === 'AVANZADO' && 'ADVANCED' : 'N/A',
            referencias_laborales: data.data.curriculum.referencias_laborales.filter(x => x.refl_nombre_empresa !== '' && x),
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

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            {
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <HeaderPortrait title={language === '1' ? 'Currículum' : 'Resume'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                :
                    <HeaderLandscape title={language === '1' ? 'Currículum' : 'Resume'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
            }
            {
                orientationInfo.initial === 'PORTRAIT'
                ?
                    <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}]`}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={{alignSelf: 'stretch'}}
                            onScroll={handleScroll}
                            contentContainerStyle={{paddingTop: paddingTop}}
                        >
                            <View style={tw`mt-[3%]`}></View>
                            <Title title={language === '1' ? 'FORMACIÓN ACADÉMICA' : 'EDUCATION'} icon={'graduation-cap'} tipo={1}/>

                            <View style={tw`flex-row mb-4`}>
                                <View style={tw`justify-start items-start w-[100%]`}>
                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel Escolar' : 'School Level'}</Text>
                                            <Contenedor title={info.nivel_estudio} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Año de Graduación' : 'Year of Graduation'}</Text>
                                            <Contenedor title={info.graduacion} hasBottomLine={false}/>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Titulo Académico' : 'Degree'}</Text>
                                            <Contenedor title={info.titulo_academico} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Institución' : 'Institution'}</Text>
                                            <Contenedor title={info.institucion} hasBottomLine={false}/>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                        <View style={{flex: 1}}>
                                        <Text style={titleStyle}>{language === '1' ? 'Estudia' : 'Studying'}</Text>
                                            <Contenedor title={info.cursando} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                        <Text style={titleStyle}>{language === '1' ? 'Horario' : 'Schedule'}</Text>
                                            <Contenedor title={info.horario} hasBottomLine={false}/>
                                        </View>
                                    </View>
                                    
                                    <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Otros Estudios' : 'Other Studies'}</Text>
                                            <Contenedor title={info.otros_estudios} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Paquetes Computacionales' : 'Computer Programs'}</Text>
                                            <Contenedor title={info.paquetes_computacionales} hasBottomLine={false}/>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <Title title={language === '1' ? 'IDIOMAS' : 'LANGUAGES'} icon={'language'} tipo={1}/>
                            <View style={tw`flex-row mb-4`}>
                                <View style={tw`justify-start items-start w-[100%]`}>
                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Idioma' : 'Language'}</Text>
                                            <Contenedor title={language === '1' ? 'INGLÉS' : 'ENGLISH'} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Lugar de Aprendizaje' : 'Place of Learning'}</Text>
                                            <Contenedor title={info.lugar_aprendizaje} hasBottomLine={false}/>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel de Escritura' : 'Writing'}</Text>
                                            <Contenedor title={info.nivel_escritura} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel de Lectura' : 'Reading'}</Text>
                                            <Contenedor title={info.nivel_lectura} hasBottomLine={false}/>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                        <View style={{flex: 1}}>
                                        <Text style={titleStyle}>{language === '1' ? 'Nivel de Comprensión' : 'Comprehension'}</Text>
                                            <Contenedor title={info.nivel_comprension} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel Conversacional' : 'Speaking'}</Text>
                                            <Contenedor title={info.nivel_conversacional} hasBottomLine={false}/>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {
                                info.referencias_laborales
                                &&
                                    info.referencias_laborales.length > 0 
                                    &&
                                        <>
                                            <Title title={language === '1' ? 'REFERENCIAS LABORALES': 'LABORAL REFERENCES'} icon={'clipboard'} tipo={1}/>
                                            <View style={{marginTop: 5}}></View>
                                        </>
                            }
                            <View style={{marginBottom: 7}}></View>
                            {
                                info.referencias_laborales 
                                &&
                                    info.referencias_laborales.map(x => 
                                        x.refl_nombre_empresa !== ''
                                        ?
                                            <View style={{flex: 1}} key={x.id}>
                                                <Title title={language === '1' ? `REFERENCIA ${x.id}` : `REFERENCE ${x.id}`} icon={'caret-right'} tipo={1} main={14}/>
                                                <Text style={[titleStyle, {paddingLeft: 7, marginTop: 10}]}>{language === '1' ? 'Nombre de la Empresa' : 'Company Name'}</Text>
                                                <Contenedor title={x.refl_nombre_empresa ? x.refl_nombre_empresa : 'N/A'} />
                                                <View style={tw`flex-row mb-4`}>
                                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', marginTop: 10}}>
                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                                            <View style={{flex: 1}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Giro de la Empresa' : 'Line of Business'}</Text>
                                                                <Contenedor title={x.refl_giro_empresa ? x.refl_giro_empresa : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Actividad que Realizaba' : 'Activity'}</Text>
                                                                <Contenedor title={x.refl_actividad ? x.refl_actividad : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                                            <View style={{flex: 1}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Sueldo Inicial' : 'Starting Salary'}</Text>
                                                                <Contenedor title={x.refl_sueldo_inicial ? `$${x.refl_sueldo_inicial}` : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Sueldo Final' : 'Final Salary'}</Text>
                                                                <Contenedor title={x.refl_sueldo_final ? `$${x.refl_sueldo_final}` : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                                            <View style={{flex: 1}}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Fecha de Ingreso' : 'Starting Date'}</Text>
                                                                <Contenedor title={x.refl_fecha_ingreso ? x.refl_fecha_ingreso : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Fecha de Salida' : 'End Date'}</Text>
                                                                <Contenedor title={x.refl_fecha_salida ? x.refl_fecha_salida : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>

                                                        <View style={{paddingHorizontal: 7, paddingBottom: 7}}>
                                                            <Text style={[titleStyle]}>{language === '1' ? 'Motivo de Salida' : 'Reason for Exit'}</Text>
                                                            <Contenedor title={x.refl_motivo_salida ? x.refl_motivo_salida : 'N/A'} hasBottomLine={false}/>
                                                        </View>

                                                        <View style={{paddingHorizontal: 7, paddingBottom: 7}}>
                                                            <Text style={[titleStyle]}>{language === '1' ? 'Permanencia' : 'Permanence'}</Text>
                                                            <Contenedor title={x.refl_permanencia ? x.refl_permanencia : 'N/A'} hasBottomLine={false}/>
                                                        </View>
                                                    
                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                                            <View style={{flex: 1}}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Jefe Directo' : 'Direct Manager'}</Text>
                                                                <Contenedor title={x.refl_jefe_directo ? x.refl_jefe_directo : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono' : 'Phone Number'}</Text>
                                                                <Contenedor title={x.refl_telefono ? x.refl_telefono : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2`}>
                                                            <View style={{flex: 1}}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Permiso de Contactar' : 'Direct Manager'}</Text>
                                                                <Contenedor title={x.refl_contactar ? language === '1' ? x.refl_contactar === '1' ? 'SÍ' : 'NO' : x.refl_contactar === '1' ? 'YES' : 'NO' : 'N/A' } hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Motivos' : 'Reasons'}</Text>
                                                                <Contenedor title={x.refl_motivos ? x.refl_motivos : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        :
                                            <View key={x.id_ref_laborales}></View>
                                    )
                            }
                        </ScrollView>
                    </View>
                :
                    <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}]`}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={{alignSelf: 'stretch'}}
                            onScroll={handleScroll}
                            contentContainerStyle={{paddingTop: paddingTop}}
                        >
                            <View style={{marginTop: '3%'}}></View>
                            <Title title={language === '1' ? 'FORMACIÓN ACADÉMICA' : 'EDUCATION'} icon={'graduation-cap'} tipo={1}/>
                            <View style={tw`flex-row mb-4`}>
                                <View style={tw`justify-start items-start w-[100%]`}>
                                    
                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel Escolar' : 'School Level'}</Text>
                                            <Contenedor title={info.nivel_estudio} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Año de Graduación' : 'Year of Graduation'}</Text>
                                            <Contenedor title={info.graduacion} hasBottomLine={false}/>
                                        </View>

                                        <View style={{flex: 2}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Titulo Académico' : 'Degree'}</Text>
                                            <Contenedor title={info.titulo_academico} hasBottomLine={false}/>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                        
                                        <View style={{flex: 2}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Institución' : 'Institution'}</Text>
                                            <Contenedor title={info.institucion} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Estudia' : 'Studying'}</Text>
                                            <Contenedor title={info.cursando} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Horario' : 'Schedule'}</Text>
                                            <Contenedor title={info.horario} hasBottomLine={false}/>
                                        </View>
                                    </View>
                                    
                                    <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Otros Estudios' : 'Other Studies'}</Text>
                                            <Contenedor title={info.otros_estudios} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Paquetes Computacionales' : 'Computer Programs'}</Text>
                                            <Contenedor title={info.paquetes_computacionales} hasBottomLine={false}/>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <Title title={language === '1' ? 'IDIOMAS' : 'LANGUAGES'} icon={'language'} tipo={1}/>
                            <View style={tw`flex-row mb-4`}>
                                <View style={tw`justify-start items-start w-[100%]`}>
                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Idioma' : 'Language'}</Text>
                                            <Contenedor title={'INGLÉS'} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Lugar de Aprendizaje' : 'Place of Learning'}</Text>
                                            <Contenedor title={info.lugar_aprendizaje} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel de Escritura' : 'Writing'}</Text>
                                            <Contenedor title={info.nivel_escritura} hasBottomLine={false}/>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                        <View style={{flex: 1}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel de Lectura' : 'Reading'}</Text>
                                            <Contenedor title={info.nivel_lectura} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel de Comprensión' : 'Comprehension'}</Text>
                                            <Contenedor title={info.nivel_comprension} hasBottomLine={false}/>
                                        </View>
                                        <View style={{flex: 1, marginLeft: 6}}>
                                            <Text style={titleStyle}>{language === '1' ? 'Nivel Conversacional' : 'Speaking'}</Text>
                                            <Contenedor title={info.nivel_conversacional} hasBottomLine={false}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            
                            {
                                info.referencias_laborales
                                &&
                                    info.referencias_laborales.length > 0 
                                    &&
                                        <>
                                            <Title title={language === '1' ? 'REFERENCIAS LABORALES': 'LABORAL REFERENCES'} icon={'clipboard'} tipo={1}/>
                                            <View style={{marginTop: 5}}></View>
                                        </>
                            }
                            <View style={{marginBottom: 7}}></View>
                            {
                                info.referencias_laborales 
                                &&
                                    info.referencias_laborales.map(x => 
                                        x.refl_nombre_empresa !== ''
                                        ?
                                            <View style={{flex: 1}} key={x.id}>
                                                <Title title={language === '1' ? `REFERENCIA ${x.id}` : `REFERENCE ${x.id}`} icon={'caret-right'} tipo={1} main={14}/>
                                                <View style={{paddingVertical: 7}}>
                                                    <Text style={[titleStyle, {paddingLeft: 7}]}>{language === '1' ? 'Nombre de la Empresa' : 'Company Name'}</Text>
                                                    <Contenedor title={x.refl_nombre_empresa ? x.refl_nombre_empresa : 'N/A'} />
                                                </View>
                                                <View style={tw`flex-row mb-4`}>
                                                    <View style={tw`justify-start items-start w-[100%]`}>
                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                                            <View style={{flex: 1}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Giro de la Empresa' : 'Line of Business'}</Text>
                                                                <Contenedor title={x.refl_giro_empresa ? x.refl_giro_empresa : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Actividad que Realizaba' : 'Activity'}</Text>
                                                                <Contenedor title={x.refl_actividad ? x.refl_actividad : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                                            <View style={{flex: 1}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Sueldo Inicial' : 'Starting Salary'}</Text>
                                                                <Contenedor title={x.refl_sueldo_inicial ? `$${x.refl_sueldo_inicial}` : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Sueldo Final' : 'Final Salary'}</Text>
                                                                <Contenedor title={x.refl_sueldo_final ? `$${x.refl_sueldo_final}` : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                                            <View style={{flex: 1}}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Fecha de Ingreso' : 'Starting Date'}</Text>
                                                                <Contenedor title={x.refl_fecha_ingreso ? x.refl_fecha_ingreso : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Fecha de Salida' : 'End Date'}</Text>
                                                                <Contenedor title={x.refl_fecha_salida ? x.refl_fecha_salida : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>

                                                        <View style={{paddingHorizontal: 7, paddingBottom: 7}}>
                                                            <Text style={[titleStyle]}>{language === '1' ? 'Motivo de Salida' : 'Reason for Exit'}</Text>
                                                            <Contenedor title={x.refl_motivo_salida ? x.refl_motivo_salida : 'N/A'} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={{paddingHorizontal: 7, paddingBottom: 7}}>
                                                            <Text style={[titleStyle]}>{language === '1' ? 'Permanencia' : 'Permanence'}</Text>
                                                            <Contenedor title={x.refl_permanencia ? x.refl_permanencia : 'N/A'} hasBottomLine={false}/>
                                                        </View>
                                                    
                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2 pb-2`}>
                                                            <View style={{flex: 1}}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Jefe Directo' : 'Direct Manager'}</Text>
                                                                <Contenedor title={x.refl_jefe_directo ? x.refl_jefe_directo : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Teléfono' : 'Phone Number'}</Text>
                                                                <Contenedor title={x.refl_telefono ? x.refl_telefono : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex-row self-stretch justify-start items-start px-2`}>
                                                            <View style={{flex: 1}}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Permiso de Contactar' : 'Direct Manager'}</Text>
                                                                <Contenedor title={x.refl_contactar ? x.refl_contactar : 'N/A' } hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1, marginLeft: 6}}>
                                                                <Text style={titleStyle}>{language === '1' ? 'Motivos' : 'Reasons'}</Text>
                                                                <Contenedor title={x.refl_motivos ? x.refl_motivos : 'N/A'} hasBottomLine={false}/>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        :
                                            <View key={x.id_ref_laborales}></View>
                                    )
                            }
                        </ScrollView>
                    </View>
            }
        </>
    );
}

const titleStyle = tw`text-sm text-[#1177E9] font-medium`