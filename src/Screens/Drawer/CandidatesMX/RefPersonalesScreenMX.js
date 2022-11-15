import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderPortrait, HeaderLandscape, Title} from '../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {useOrientation, useNavigation, useScroll} from '../../../hooks'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp';
import {isIphone} from '../../../access/requestedData';
import tw from 'twrnc';
import {useFocusEffect} from '@react-navigation/native';

export default ({navigation, route: {params: {language, orientation}}}) => {
    const {handlePath} = useNavigation()
    const {isTablet} = DeviceInfo;
    const [info, setInfo] = useState({})
    const [contador, setContador] = useState(0)

    useFocusEffect(
        useCallback(() => {
            handlePath('Dashboard')
        }, [])
    );

    useEffect(async () => {
        let data = null;
        let keyUserInfo = 'userInfo';
        data = await AsyncStorage.getItem(keyUserInfo) || '[]';
        data = JSON.parse(data);
        let obj = {
            referencias_personales: data.data.referencias_personales ? data.data.referencias_personales : '',
        }

        setInfo(obj)
        return undefined
    },[])

    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });

    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)

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
                    <HeaderPortrait title={language === '1' ? 'Referencias Personales' : 'Personal References'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
                :
                    <HeaderLandscape title={language === '1' ? 'Referencias Personales' : 'Personal References'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} translateY={translateY}/>
            }

            <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}]`}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{alignSelf: 'stretch'}}
                    onScroll={handleScroll}
                    contentContainerStyle={{paddingTop: paddingTop}}
                >
                    <View style={{marginTop: '3%'}}></View>
                    <Title title={language === '1' ? 'REFERENCIAS PERSONALES' : 'PERSONAL REFERENCES'} icon={'user'}/>
                    {
                        info.referencias_personales 
                        &&
                            info.referencias_personales.map(x => 
                                <View style={tw`justify-start items-start w-[100%] mb-${!isTablet() ? 5 : 9}`} key={x.id_ref_personales}>
                                    <View style={tw`h-auto self-stretch bg-[${Blue}] border border-[${Blue}] justify-center items-center flex-row py-1.2 rounded-t-2xl`}>
                                        <Text style={tw`text-white text-base font-bold`}>{language === '1' ? `Referencia ${x.id_ref_personales}` : `Reference ${x.id_ref_personales}`}</Text>
                                    </View>
                                    {
                                        orientationInfo.initial === 'PORTRAIT'
                                        ?
                                            <>
                                                <View style={tw`border border-[${Blue}] self-stretch rounded-b-2xl`}>
                                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Nombre' : 'Name'}</Text>
                                                            <Contenedor title={x.refp_nombre} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={tw`flex-1 ml-1.5`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Teléfono' : 'Phone Number'}</Text>
                                                            <Contenedor title={x.refp_telefono} hasBottomLine={false}/>
                                                        </View>
                                                    </View>

                                                    <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Relación' : 'Relationship'}</Text>
                                                            <Contenedor title={x.refp_relacion} hasBottomLine={false}/>
                                                        </View>
                                                        <View style={tw`flex-1 ml-1.5`}>
                                                            <Text style={titleStyle}>{language === '1' ? 'Ocupación' : 'Position'}</Text>
                                                            <Contenedor title={x.refp_ocupacion} hasBottomLine={false}/>
                                                        </View>
                                                    </View>
                                                </View>
                                            </>
                                        :
                                            <View style={tw`border border-[${Blue}] self-stretch rounded-b-2xl`}>
                                                <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                                    <View style={tw`flex-1`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Nombre' : 'Name'}</Text>
                                                        <Contenedor title={x.refp_nombre} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={tw`flex-1 ml-1.5`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Teléfono' : 'Phone Number'}</Text>
                                                        <Contenedor title={x.refp_telefono} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={tw`flex-1`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Relación' : 'Relationship'}</Text>
                                                        <Contenedor title={x.refp_relacion} hasBottomLine={false}/>
                                                    </View>
                                                    <View style={tw`flex-1 ml-1.5`}>
                                                        <Text style={titleStyle}>{language === '1' ? 'Ocupación' : 'Position'}</Text>
                                                        <Contenedor title={x.refp_ocupacion} hasBottomLine={false}/>
                                                    </View>
                                                </View>
                                            </View>
                                    }
                                </View>
                            )
                    }
                </ScrollView>
            </View>
        </>
    );
}

const titleStyle = tw`text-sm text-[#1177E9] font-medium`
