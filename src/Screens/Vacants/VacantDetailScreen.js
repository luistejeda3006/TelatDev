import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, StatusBar, SafeAreaView, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {HeaderLandscape, HeaderPortrait} from '../../components';
import {useNavigation, useOrientation, useScroll} from '../../hooks';
import HTMLView from 'react-native-htmlview'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../colors/colorsApp';
import {isIphone} from '../../access/requestedData';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import tw from 'twrnc';

export default ({navigation, route: {params: {language, orientation, nombre, ubicacion, sueldo, descripcion: header, beneficios: body, requisitos: footer}}}) => {
    const [contador, setContador] = useState(0)
    const {handlePath} = useNavigation()
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': 'PORTRAIT'
    });

    const [initialState, setInitialState] = useState({
        lg: parseInt(language),
        ori: orientation,
        name: nombre,
        location: ubicacion,
        salary: sueldo,
        description: header,
        benefits: body,
        requeriments: footer
    })

    const {lg, ori, name, location, salary, description, benefits, requeriments} = initialState
    const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)

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
                        orientationInfo.initial === 'PORTRAIT'
                        ?
                            <HeaderPortrait title={lg === 1 ? 'Detalles de la Vacante' : 'Job Opening Details'} screenToGoBack={'Vacants'} navigation={navigation} visible={true} translateY={translateY}/>
                        :
                            <HeaderLandscape title={lg === 1 ? 'Detalles de la Vacante' : 'Job Opening Details'} screenToGoBack={'Vacants'} navigation={navigation} visible={true} translateY={translateY}/>
                    }
                    <View style={tw`self-stretch flex-1 px-[3%] bg-[#fff]`}>
                        <ScrollView
                            scrollEventThrottle={16}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            contentContainerStyle={{paddingTop: paddingTop}}
                        >
                            <>
                                <View style={tw`border-b border-b-[#f7f7f7] mb-2.5 pb-[2%] mt-[3%]`}>
                                    <Text style={tw`text-2xl font-bold text-black`}>{name}</Text>
                                    <Text style={tw`text-lg text-[#adadad] mb-2.5`}>Telat</Text>
                                    <Text style={tw`text-lg font-bold text-black`}>{lg === 1 ? 'Ubicación' : 'Location'}</Text>
                                    <Text style={tw`text-lg text-black mb-2.5`}>{location}</Text>
                                    <Text style={tw`text-lg text-black font-bold`}>{lg === 1 ? 'Salario' : 'Salary'}</Text>
                                    <View style={tw`h-auto justify-center items-start mt-1.5 self-stretch`}>
                                        <Text style={tw`text-lg text-black mb-1.5 bg-[#d1d1d1]`}>{salary}</Text>
                                    </View>
                                </View>
                                <Text style={tw`text-lg font-bold text-black`}>{lg === 1 ? 'Descripción\n' : 'Description\n'}</Text>
                                <View style={tw`flex-1 mb-6`}>
                                    <HTMLView
                                        value={'<div style="color: black">' + description + '</div>'}
                                        stylesheet={styles}
                                    />
                                </View>
                                <Text style={tw`text-lg font-bold text-black`}>{lg === 1 ? 'Ofrecemos\n' : 'We Offer\n'}</Text>
                                <View style={tw`flex-1 mb-6`}>
                                    <HTMLView
                                        value={'<div style="color: black">' + benefits + '</div>'}
                                        stylesheet={styles}
                                    />
                                </View>
                                <Text style={tw`text-lg font-bold text-black`}>{lg === 1 ? 'Requisitos\n' : 'Requirements\n'}</Text>
                                <View style={tw`flex-1 mb-4`}>
                                    <HTMLView
                                        value={'<div style="color: black">' + requeriments + '</div>'}
                                        stylesheet={styles}
                                    />
                                </View>
                                <TouchableWithoutFeedback onPress={() => navigation.navigate('Contact', {language: language, orientation: orientationInfo.initial})}>
                                    <View style={tw`bg-[${Blue}] h-11 justify-center items-center rounded-xl my-2.5 self-stretch mb-${isIphone ? 6 : 4} flex-row`}>
                                        <IonIcons name={'account-check'} size={24} color={'#fff'}/>
                                        <Text style={tw`text-white font-bold text-lg ml-2.5`}>{lg === 1 ? 'Postularme' : 'Apply'}</Text>
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