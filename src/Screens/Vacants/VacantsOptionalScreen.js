import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import tw from 'twrnc'
export default () => {

    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            headerLargeTitle: true,
            headerTitle: 'Vacantes',
            headerSearchBarOptions: {
                placeholder: 'Search',
            },
            headerRight: () => (
                <TouchableOpacity style={tw`justify-center items-center bg-red-400 w-10 h-10`}>
                    <Text style={tw`text-[#000] font-bold`}>+</Text>
                </TouchableOpacity>
            ),
        })
    },[navigation])

    return(
        <ScrollView>
            <Text>Friends</Text>
        </ScrollView>
    )
}