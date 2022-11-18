import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Image, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import {HeaderPortrait, HeaderLandscape, Title} from '../../../components';
import DeviceInfo from 'react-native-device-info';
import {useNavigation, useOrientation} from '../../../hooks'
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
        'initial': orientation
    });


    useEffect(() => {
        let obj = null;
        
        obj = {
            picture: data.data.datos_personales.foto ? `https://telat.mx/intranet/upload/fotos/${data.data.datos_personales.foto}` : '',
            f_name: data.data.datos_personales.nombre ? data.data.datos_personales.nombre : 'N/A',
            l_name: data.data.datos_personales.apellido ? data.data.datos_personales.apellido : 'N/A',
            is18years: data.data.datos_personales.edad_to_work ? data.data.datos_personales.edad_to_work === '1' ? 'YES' : 'NO' : 'N/A',
            legal: data.data.datos_personales.legal ? data.data.datos_personales.legal === '1' ? 'YES' : 'NO' : 'N/A',
            
            address: data.data.datos_personales.calle ? data.data.datos_personales.calle : 'N/A' ,
            city: data.data.datos_personales.ciudad ? data.data.datos_personales.ciudad : 'N/A',
            state: data.data.datos_personales.estado ? data.data.datos_personales.estado : 'N/A',
            cp: data.data.datos_personales.cp ? data.data.datos_personales.cp : 'N/A',

            email: data.data.datos_personales.email ? data.data.datos_personales.email : 'N/A',
            personal_phone: data.data.datos_personales.telefono_celular ? data.data.datos_personales.telefono_celular : 'N/A',
            home_phone: data.data.datos_personales.telefono_fijo ? data.data.datos_personales.telefono_fijo : 'N/A',
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
            <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={tw`self-stretch`}
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

                    <Title title={'GENERAL INFORMATION'} icon={'user'} tipo={1}/>
                    <View style={tw`flex-row mb-4`}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%'}}>
                            
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{'Name'}</Text>
                                    <Contenedor title={info.f_name} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1, marginLeft: 6}}>
                                    <Text style={titleStyle}>{'Last Name'}</Text>
                                    <Contenedor title={info.l_name} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={titleStyle}>{`I'm at least 18 years old`}</Text>
                                    <Contenedor title={info.is18years} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1, marginLeft: 6}}>
                                    <Text style={titleStyle}>{'I´m legally and eligible for employment in the United States'}</Text>
                                    <Contenedor title={info.legal} hasBottomLine={false}/>
                                </View>
                            </View>
                            
                        </View>
                    </View>

                    <Title title={'ADDRESS'} icon={'map'} tipo={1}/>
                    <View style={tw`flex-row mb-4`}>
                        <View style={tw`justify-start items-start w-[100%]`}>
                            
                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>Address</Text>
                                    <Contenedor title={info.address} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1, marginLeft: 6}}>
                                    <Text style={[titleStyle]}>City</Text>
                                    <Contenedor title={info.city} hasBottomLine={false}/>
                                </View>
                            </View>

                            <View style={tw`flex-row self-stretch justify-start items-start p-2`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[titleStyle]}>State</Text>
                                    <Contenedor title={info.state} hasBottomLine={false}/>
                                </View>
                                <View style={{flex: 1, marginLeft: 6}}>
                                    <Text style={[titleStyle]}>Zip Code</Text>
                                    <Contenedor title={info.cp} hasBottomLine={false}/>
                                </View>
                            </View>

                        </View>
                    </View>

                    <Title title={'CONTACT INFORMATION'} icon={'phone'} tipo={1}/>
                    <View style={tw`flex-row self-stretch justify-start items-start mb-2`}>
                        <View style={tw`flex-1`}>
                            <Text style={titleStyle}>{`E-mail`}</Text>
                            <Contenedor title={info.email} hasBottomLine={false}/>
                        </View>
                        <View style={{flex: 1, marginLeft: 6}}>
                            <Text style={titleStyle}>{'Phone Number'}</Text>
                            <Contenedor title={info.personal_phone} hasBottomLine={false}/>
                        </View>
                        <View style={{flex: 1, marginLeft: 6}}>
                            <Text style={titleStyle}>{'Landline Number'}</Text>
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
                    <HeaderPortrait title={'Personal Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
                :
                    <HeaderLandscape title={'Personal Information'} screenToGoBack={'Dashboard'} navigation={navigation} visible={true} normal={true}/>
            }
            {
                isTablet()
                ?
                    <LandscapePhoneAndTablet />
                :
                    orientationInfo.initial === 'PORTRAIT'
                    ?
                        <View style={tw`flex-1 justify-start items-center px-[${isIphone ? '5%' : '3%'}] bg-white`}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{alignSelf: 'stretch'}}
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

                                <Title title={'GENERAL INFORMATION'} icon={'user'} tipo={1}/>
                                
                                <View style={tw`flex-row mb-2.5 p-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 7}}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{'Name'}</Text>
                                                <Contenedor title={info.f_name} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1, marginLeft: 6}}>
                                                <Text style={titleStyle}>{'Last Name'}</Text>
                                                <Contenedor title={info.l_name} hasBottomLine={false}/>
                                            </View>
                                        </View>

                                        <View style={{paddingBottom: 7}}>
                                            <Text style={titleStyle}>{`I'm at least 18 years old`}</Text>
                                            <Contenedor title={info.is18years} hasBottomLine={false}/>
                                        </View> 

                                        <View style={{backgroundColor: 'transparent'}}>
                                            <Text style={titleStyle}>{`I'm legally and eligible for employment in the United States`}</Text>
                                            <Contenedor title={info.legal} hasBottomLine={false}/>
                                        </View> 
                                    </View>
                                </View>
            
                                <Title title={'ADDRESS'} icon={'map'} tipo={1}/>
                                <View style={tw`flex-row mb-2.5 p-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: 7}}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{'Address'}</Text>
                                                <Contenedor title={info.address} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1, marginLeft: 6}}>
                                                <Text style={titleStyle}>{'City'}</Text>
                                                <Contenedor title={info.city} hasBottomLine={false}/>
                                            </View>
                                        </View>
            
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{'State'}</Text>
                                                <Contenedor title={info.state} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1, marginLeft: 6}}>
                                                <Text style={titleStyle}>{'Zip code'}</Text>
                                                <Contenedor title={info.cp} hasBottomLine={false}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
            
                                <Title title={'CONTACT INFORMATION'} icon={'phone'} tipo={1}/>
                                <View style={tw`flex-row mb-2.5 p-2`}>
                                    <View style={tw`justify-start items-start w-[100%]`}>
                                        <View style={{paddingBottom: 7}}>
                                            <Text style={titleStyle}>{`E-mail`}</Text>
                                            <Contenedor title={info.email} hasBottomLine={false}/>
                                        </View> 
                                        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 7}}>
                                            <View style={tw`flex-1`}>
                                                <Text style={titleStyle}>{'Phone Number'}</Text>
                                                <Contenedor title={info.personal_phone} hasBottomLine={false}/>
                                            </View>
                                            <View style={{flex: 1, marginLeft: 6}}>
                                                <Text style={titleStyle}>{'Landline Number'}</Text>
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
const imageStyle = tw`w-42.5 h-42.5 rounded-full`