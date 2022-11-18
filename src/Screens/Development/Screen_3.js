/* import React from  'react'
import {View, Text, TouchableOpacity, SafeAreaView, StatusBar} from 'react-native'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaBackground, barStyleBackground, barStyle, Blue} from '../../colors/colorsApp'
import tw from 'twrnc'

export default () => {
    const completed = 3;
    return(
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }}/>
            <View style={tw`h-27 self-stretch justify-center items-start flex-row`}>
                <View style={tw`flex-1 justify-center items-center h-[100%]`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`h-3 flex-1`} />
                        <View style={tw`h-12 w-12 rounded-full bg-white border border-4 border-[${Blue}] justify-center items-center`}>
                            {
                                completed > 1
                                ?
                                    <IonIcons name={'check-bold'} size={21} color={Blue} />
                                :
                                    <Text style={tw`font-bold text-xs text-[${Blue}]`}>1</Text>
                            }
                        </View>
                        <View style={tw`h-3 flex-1 bg-[${Blue}]`} />
                    </View>
                    <View style={tw`mt-2 justify-center items-center`}>
                        <Text style={tw`text-center text-[${Blue}]`}>Información Personal</Text>
                    </View>
                </View>
                <View style={tw`flex-1 justify-center items-center h-[100%]`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`h-3 flex-1 bg-[${Blue}]`} />
                        <View style={tw`h-12 w-12 rounded-full bg-white border border-4 border-[${Blue}] justify-center items-center`}>
                            {
                                completed > 1
                                ?
                                    <IonIcons name={'check-bold'} size={21} color={Blue} />
                                :
                                    <Text style={tw`font-bold text-xs text-[${Blue}]`}>1</Text>
                            }
                        </View>
                        <View style={tw`h-3 flex-1 bg-[${Blue}]`} />
                    </View>
                    <View style={tw`mt-2 justify-center items-center`}>
                        <Text style={tw`text-center text-[${Blue}]`}>Información Personal</Text>
                    </View>
                </View>
                
                <View style={tw`flex-1 justify-center items-center h-[100%]`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`h-3 flex-1 bg-[${Blue}]`} />
                        <View style={tw`h-12 w-12 rounded-full bg-white border border-4 border-[${Blue}] justify-center items-center`}>
                            {
                                completed > 1
                                ?
                                    <IonIcons name={'check-bold'} size={21} color={Blue} />
                                :
                                    <Text style={tw`font-bold text-xs text-[${Blue}]`}>1</Text>
                            }
                        </View>
                        <View style={tw`h-3 flex-1 bg-[${Blue}]`} />
                    </View>
                    <View style={tw`mt-2 justify-center items-center`}>
                        <Text style={tw`text-center text-[${Blue}]`}>Información Personal</Text>
                    </View>
                </View>
                <View style={tw`flex-1 justify-center items-center h-[100%]`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`h-3 flex-1 bg-[${Blue}]`} />
                        <View style={tw`h-12 w-12 rounded-full bg-white border border-4 border-[${Blue}] justify-center items-center`}>
                            {
                                completed > 1
                                ?
                                    <IonIcons name={'check-bold'} size={21} color={Blue} />
                                :
                                    <Text style={tw`font-bold text-xs text-[${Blue}]`}>1</Text>
                            }
                        </View>
                        <View style={tw`h-3 flex-1`} />
                    </View>
                    <View style={tw`mt-2 justify-center items-center`}>
                        <Text style={tw`text-center text-[${Blue}]`}>Información Personal</Text>
                    </View>
                </View>
            </View>
        </>
    )
} */

export default () => {
    return(
        <></>
    )
}