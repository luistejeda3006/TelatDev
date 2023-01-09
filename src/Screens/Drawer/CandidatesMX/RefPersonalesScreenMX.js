import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderPortrait, HeaderLandscape, Title, NotResults} from '../../../components';
import DeviceInfo from 'react-native-device-info';
import {useNavigation} from '../../../hooks'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../colors/colorsApp';
import {isIphone} from '../../../access/requestedData';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectLanguageApp, selectUserInfo} from '../../../slices/varSlice';
import tw from 'twrnc';
import {selectOrientation} from '../../../slices/orientationSlice';

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
            referencias_personales: data.data.referencias_personales ? data.data.referencias_personales : '',
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
                orientation === 'PORTRAIT'
                ?
                    <HeaderPortrait title={language === '1' ? 'Referencias Personales' : 'Personal References'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} />
                :
                    <HeaderLandscape title={language === '1' ? 'Referencias Personales' : 'Personal References'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} />
            }

            <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white self-stretch`}>
                {
                    info.referencias_personales
                    &&
                        info.referencias_personales.length > 0
                        ?
                            <>
                                <View style={{marginTop: '3%'}}></View>
                                <Title title={language === '1' ? 'REFERENCIAS PERSONALES' : 'PERSONAL REFERENCES'} icon={'user'}/>
                                <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white self-stretch`}>
                                    {
                                        info.referencias_personales.map(x => 
                                            <View style={tw`justify-start items-start w-[100%] mb-${!isTablet() ? 5 : 9}`} key={x.id_ref_personales}>
                                                <View style={tw`h-auto self-stretch bg-[${Blue}] border border-[${Blue}] justify-center items-center flex-row py-1.2 rounded-t-2xl`}>
                                                    <Text style={tw`text-white text-base font-bold`}>{language === '1' ? `Referencia ${x.id_ref_personales}` : `Reference ${x.id_ref_personales}`}</Text>
                                                </View>
                                                {
                                                    orientation === 'PORTRAIT'
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
                                </View>
                            </>
                        :
                            <NotResults />
                }
            </View>
        </>
    );
}

const titleStyle = tw`text-sm text-[#1177E9] font-medium`
