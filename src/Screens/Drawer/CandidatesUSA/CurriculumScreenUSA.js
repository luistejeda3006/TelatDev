import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderPortrait, HeaderLandscape, Title} from '../../../components';
import DeviceInfo from 'react-native-device-info';
import {useNavigation} from '../../../hooks'
import {barStyle, barStyleBackground, SafeAreaBackground} from '../../../colors/colorsApp';
import {isIphone} from '../../../access/requestedData';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectLanguageApp, selectUserInfo} from '../../../slices/varSlice';
import {selectOrientation} from '../../../slices/orientationSlice';
import tw from 'twrnc';

let data = ''

export default ({navigation}) => {
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)

    data = useSelector(selectUserInfo)
    const {handlePath} = useNavigation()
    const {isTablet} = DeviceInfo;
    const [info, setInfo] = useState({})

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    useEffect(() => {
        let obj = {
            languages: data.data.curriculum.idiomas,
            level_computers: data.data.curriculum.curr_usa_computadora ? data.data.curriculum.curr_usa_computadora : 'N/A',
            pkg_programs: data.data.curriculum.curr_pkg_computo ? data.data.curriculum.curr_pkg_computo : 'N/A',
            first_job: data.data.curriculum.cand_primer_empleo ? data.data.curriculum.cand_primer_empleo === '1' ? 'YES' : 'NO' : 'N/A',
            references: data.data.curriculum.ref_laborales
        }
        setInfo(obj)

        return undefined
    },[])

    const Contenedor = ({title, leftPosition = true, hasBottomLine = true}) => {
        return (
            <View style={tw`self-stretch items-${leftPosition ? 'start' : 'end'} justify-center pb-2 ml-${hasBottomLine ? 2 : 0}`}>
                <Text style={{fontSize: 14, color: '#000'}}>{title}</Text>
            </View>
        )
    }

    const LandscapePhoneAndTablet = () => {
        return(
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{alignSelf: 'stretch'}}
                >
                    <View style={{marginTop: '3%'}}></View>
                    <Title title={'LANGUAGES'} icon={'language'} tipo={1}/>
                    <View style={{marginBottom: 7}}></View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                            <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                {
                                    info.languages
                                    &&
                                        info.languages.length > 0
                                        &&
                                            info.languages.map(x =>
                                                <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 15}} key={x.idioma}>
                                                    <Title title={x.idioma} icon={'caret-right'} tipo={1} main={14}/>
                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', paddingHorizontal: 4, paddingTop: 4}}>
                                                        <View style={{flexDirection: 'row', paddingHorizontal: 4}}>
                                                            <View style={{flex: 1}}>
                                                                <Text style={styles.title}>{'Writing'}</Text>
                                                                <Contenedor title={x.nivel_escritura} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <Text style={styles.title}>{'Reading'}</Text>
                                                                <Contenedor title={x.nivel_lectura} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <Text style={styles.title}>{'Comprehension'}</Text>
                                                                <Contenedor title={x.nivel_comprension} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <Text style={styles.title}>{'Speaking'}</Text>
                                                                <Contenedor title={x.nivel_conversacional} hasBottomLine={false}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <Text style={styles.title}>{'Place of Learning'}</Text>
                                                                <Contenedor title={x.lugar_aprendizaje} hasBottomLine={false}/>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                }
                            </View>
                        </View>
                    </View>
                    
                    <View style={{flexDirection: 'row', marginTop: 7, marginBottom: 7}}>
                        <View style={{flex: 1}}>
                            <Title title={'COMPUTER KNOWLEDGE'} icon={'laptop'} tipo={1}/>
                            <View style={{alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 7}}>
                                <View style={{flex: 1, marginLeft: 6, paddingBottom: 7}}>
                                    <Text style={styles.title}>{'Level of knowledge using computers'}</Text>
                                    <Contenedor title={info.level_computers} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1, marginLeft: 6}}>
                                    <Text style={styles.title}>{`Programs you're familiar`}</Text>
                                    <Contenedor title={info.pkg_programs} hasBottomLine={false}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Title title={'LABORAL REFERENCES'} icon={'clipboard'} tipo={1}/>
                    <View style={{marginBottom: 7}}></View>
                    {
                        info.references
                        &&
                            info.references.map(x => 
                                x.refl_nombre_empresa !== ''
                                ?
                                    <View style={{flex: 1}} key={x.id}>
                                        <Title title={`REFERENCE ${x.id}`} icon={'caret-right'} tipo={1} main={14}/>
                                        <View style={{flexDirection: 'row', marginBottom: 7, marginTop: 7}}>
                                            <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 7, paddingBottom: 7}}>
                                                    <View style={{flex: 1, marginLeft: 6}}>
                                                        <Text style={styles.title}>{'Company (Name)'}</Text>
                                                        <Contenedor title={x.refl_nombre_empresa ? x.refl_nombre_empresa : 'N/A'} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={styles.title}>{'Line of Business'}</Text>
                                                        <Contenedor title={x.refl_giro_empresa ? x.refl_giro_empresa : 'N/A'} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={styles.title}>{'Position'}</Text>
                                                        <Contenedor title={x.refl_puesto ? x.refl_puesto : 'N/A'} hasBottomLine={false}/>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 7, paddingBottom: 7}}>
                                                    <View style={{flex: 1, marginLeft: 6}}>
                                                        <Text style={styles.title}>{'Starting Date'}</Text>
                                                        <Contenedor title={x.refl_fecha_ingreso ? x.refl_fecha_ingreso : 'N/A'} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={styles.title}>{'Ending Date'}</Text>
                                                        <Contenedor title={x.refl_fecha_salida ? x.refl_fecha_salida : 'N/A'} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={{flex: 1}}>
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
        )
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            {
                orientation === 'PORTRAIT'
                ?
                    <HeaderPortrait title={'Resume'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
                :
                    <HeaderLandscape title={'Resume'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
            }
            {
                isTablet()
                ?
                    <LandscapePhoneAndTablet />
                :
                    orientation === 'PORTRAIT'
                    ?
                        <View style={styles.container}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch'}}
                            >
                                <View style={{marginTop: '3%'}}></View>
                                <Title title={'LANGUAGES'} icon={'language'} tipo={1}/>
                                <View style={{marginBottom: 7}}></View>
                                <View style={{flexDirection: 'row', marginBottom: 7}}>
                                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                        <View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                            {
                                                info.languages
                                                &&
                                                    info.languages.length > 0
                                                    &&
                                                        info.languages.map(x =>
                                                            <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 15}} key={x.idioma}>
                                                                <Title title={x.idioma} icon={'caret-right'} tipo={1} main={14}/>
                                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', padding: 4}}>
                                                                    <View style={{flexDirection: 'row', paddingHorizontal: 4}}>
                                                                        <View style={{flex: 1}}>
                                                                            <Text style={styles.title}>{'Writing'}</Text>
                                                                            <Contenedor title={x.nivel_escritura} hasBottomLine={false}/>
                                                                        </View>
                                                                        <View style={{flex: 1}}>
                                                                            <Text style={styles.title}>{'Reading'}</Text>
                                                                            <Contenedor title={x.nivel_lectura} hasBottomLine={false}/>
                                                                        </View>
                                                                        <View style={{flex: 1}}>
                                                                            <Text style={styles.title}>{'Comprehension'}</Text>
                                                                            <Contenedor title={x.nivel_comprension} hasBottomLine={false}/>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexDirection: 'row', paddingHorizontal: 4, paddingTop: 4}}>
                                                                    <View style={{flexDirection: 'row', paddingHorizontal: 4}}>
                                                                        <View style={{flex: 1}}>
                                                                            <Text style={styles.title}>{'Speaking'}</Text>
                                                                            <Contenedor title={x.nivel_conversacional} hasBottomLine={false}/>
                                                                        </View>
                                                                        <View style={{flex: 2}}>
                                                                            <Text style={styles.title}>{'Place of Learning'}</Text>
                                                                            <Contenedor title={x.lugar_aprendizaje} hasBottomLine={false}/>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )
                                            }
                                        </View>
                                    </View>
                                </View>

                                <Title title={'COMPUTER KNOWLEDGE'} icon={'laptop'} tipo={1}/>
                                <View style={{alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 7, marginBottom: 7}}>
                                    <View style={{flex: 1, marginLeft: 6, paddingBottom: 7}}>
                                        <Text style={styles.title}>{'Level of knowledge using computers'}</Text>
                                        <Contenedor title={info.level_computers} hasBottomLine={false}/>
                                    </View>
                                    <View style={{flex: 1, marginLeft: 6}}>
                                        <Text style={styles.title}>{`Programs you're familiar`}</Text>
                                        <Contenedor title={info.pkg_programs} hasBottomLine={false}/>
                                    </View>
                                </View>
                                <Title title={'LABORAL REFERENCES'} icon={'clipboard'} tipo={1}/>
                                <View style={{marginBottom: 7}}></View>
                                {
                                    info.references
                                    &&
                                        info.references.map(x => 
                                            x.refl_nombre_empresa !== ''
                                            ?
                                                <View style={{flex: 1}} key={x.id}>
                                                    <Title title={`REFERENCE ${x.id}`} icon={'caret-right'} tipo={1} main={14}/>
                                                    <View style={{flexDirection: 'row', marginBottom: 15, marginTop: 7}}>
                                                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 7, paddingBottom: 7}}>
                                                                <View style={{flex: 1, marginLeft: 6}}>
                                                                    <Text style={styles.title}>{'Company (Name)'}</Text>
                                                                    <Contenedor title={x.refl_nombre_empresa ? x.refl_nombre_empresa : 'N/A'} hasBottomLine={false}/>
                                                                </View>
                                                                <View style={{flex: 1}}>
                                                                    <Text style={styles.title}>{'Line of Business'}</Text>
                                                                    <Contenedor title={x.refl_giro_empresa ? x.refl_giro_empresa : 'N/A'} hasBottomLine={false}/>
                                                                </View>
                                                            </View>

                                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 7, paddingBottom: 7}}>
                                                                <View style={{flex: 1, marginLeft: 6}}>
                                                                    <Text style={styles.title}>{'Position'}</Text>
                                                                    <Contenedor title={x.refl_puesto ? x.refl_puesto : 'N/A'} hasBottomLine={false}/>
                                                                </View>
                                                                <View style={{flex: 1}}>
                                                                    <Text style={styles.title}>{'Starting Date'}</Text>
                                                                    <Contenedor title={x.refl_fecha_ingreso ? x.refl_fecha_ingreso : 'N/A'} hasBottomLine={false}/>
                                                                </View>
                                                            </View>

                                                            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 7, paddingBottom: 7}}>
                                                                <View style={{flex: 1, marginLeft: 6}}>
                                                                    <Text style={styles.title}>{'Ending Date'}</Text>
                                                                    <Contenedor title={x.refl_fecha_salida ? x.refl_fecha_salida : 'N/A'} hasBottomLine={false}/>
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
                        <LandscapePhoneAndTablet />
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: isIphone ? '5%' : '3%',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 13,
        color: '#1177E9',
        fontWeight:'500'
    },
    image: {
        width: 165,
        height: 165,
        borderRadius: 85,
    },
    gradient: {
        width: 185,
        height: 185,
        borderRadius: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
})