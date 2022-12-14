import React, {useState, useCallback} from 'react';
import {StyleSheet, View, Text, StatusBar, SafeAreaView, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {HeaderLandscape, HeaderPortrait} from '../../components';
import {useNavigation} from '../../hooks';
import HTMLView from 'react-native-htmlview'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../colors/colorsApp';
import {isIphone} from '../../access/requestedData';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectLanguageApp} from '../../slices/varSlice';
import {selectOrientation} from '../../slices/orientationSlice';
import tw from 'twrnc';

export default ({navigation, route: {params: {id, nombre, ubicacion, sueldo, descripcion: header, beneficios: body, requisitos: footer, country, id_sede}}}) => {
    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)

    const {handlePath} = useNavigation()

    const [initialState, setInitialState] = useState({
        ide: id,
        countri: country,
        lg: language,
        ori: orientation,
        name: nombre,
        location: ubicacion,
        salary: sueldo,
        description: header,
        benefits: body,
        requeriments: footer,
        sede: id_sede
    })

    const {ide, countri, lg, sede, name, location, salary, description, benefits, requeriments} = initialState

    useFocusEffect(
        useCallback(() => {
            handlePath('Vacants')
        }, [])
    );
    
    return (
        <View style={tw`flex-1 bg-[#fff]`}>
            {
                <>
                    <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
                    {
                        orientation === 'PORTRAIT'
                        ?
                            <HeaderPortrait title={lg === '1' ? 'Detalles de la Vacante' : 'Job Opening Details'} screenToGoBack={'Vacants'} navigation={navigation} visible={true}/>
                        :
                            <HeaderLandscape title={lg === '1' ? 'Detalles de la Vacante' : 'Job Opening Details'} screenToGoBack={'Vacants'} navigation={navigation} visible={true}/>
                    }
                    <View style={tw`self-stretch flex-1 px-[3%] bg-[#fff]`}>
                        <ScrollView
                            scrollEventThrottle={16}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            /* onScroll={handleScroll}
                            contentContainerStyle={{paddingTop: paddingTop}} */
                        >
                            <>
                                <View style={tw`border-b border-b-[#f7f7f7] mb-2.5 pb-[2%] mt-[3%]`}>
                                    <Text style={tw`text-2xl font-bold text-black`}>{name}</Text>
                                    <Text style={tw`text-lg text-[#adadad] mb-2.5`}>Telat</Text>
                                    <Text style={tw`text-lg font-bold text-black`}>{lg === '1' ? 'Ubicaci??n' : 'Location'}</Text>
                                    <Text style={tw`text-black mb-2.5`}>{location}</Text>
                                    <Text style={tw`text-lg text-black font-bold`}>{lg === '1' ? 'Salario' : 'Salary'}</Text>
                                    <View style={tw`h-auto justify-center items-start mt-1.5 self-stretch`}>
                                        <Text style={tw`text-lg text-black mb-1.5 bg-[#d1d1d1]`}>{salary}</Text>
                                    </View>
                                </View>
                                <Text style={tw`text-lg font-bold text-black`}>{lg === '1' ? 'Descripci??n\n' : 'Description\n'}</Text>
                                <View style={tw`flex-1 mb-6`}>
                                    <HTMLView
                                        value={'<div style="color: black">' + description + '</div>'}
                                        stylesheet={styles}
                                    />
                                </View>
                                <Text style={tw`text-lg font-bold text-black`}>{lg === '1' ? 'Ofrecemos\n' : 'We Offer\n'}</Text>
                                <View style={tw`flex-1 mb-6`}>
                                    <HTMLView
                                        value={'<div style="color: black">' + benefits + '</div>'}
                                        stylesheet={styles}
                                    />
                                </View>
                                <Text style={tw`text-lg font-bold text-black`}>{lg === '1' ? 'Requisitos\n' : 'Requirements\n'}</Text>
                                <View style={tw`flex-1 mb-4`}>
                                    <HTMLView
                                        value={'<div style="color: black">' + requeriments + '</div>'}
                                        stylesheet={styles}
                                    />
                                </View>
                                <TouchableWithoutFeedback onPress={() => navigation.navigate('Contact', {id: ide, language: lg, orientation: orientation, country: countri, id_sede: sede})}>
                                    <View style={tw`bg-[${Blue}] h-11 justify-center items-center rounded-3xl my-2.5 self-stretch mb-${isIphone ? 6 : 4} flex-row shadow-md`}>
                                        <IonIcons name={'account-check'} size={24} color={'#fff'}/>
                                        <Text style={tw`text-white font-bold text-lg ml-2.5`}>{lg === '1' ? 'Postularme' : 'Apply'}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </>
                        </ScrollView>
                    </View>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    div: {
        color: '#000'
    },
})