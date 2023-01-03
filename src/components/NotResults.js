import React from 'react'
import {View, Text, Image} from 'react-native'
import {useSelector} from 'react-redux'
import {selectLanguageApp} from '../slices/varSlice'
import tw from 'twrnc'

export default () => {
    const language = useSelector(selectLanguageApp)

    return(
        <>
            <View style={tw`h-auto self-stretch flex-row px-4`}>
                <View style={tw`flex-1 justify-center items-center flex-row`}>
                    <View style={tw`h-auto self-stretch`}>
                        <Text style={tw`text-xl font-bold text-[#000] text-center`}>{language === '1' ? '¡Sin resultados!' : 'No results!'}</Text>
                        <Text style={tw`text-sm text-[#adadad] text-center`}>{language === '1' ? 'Lo sentimos, no hemos encontrado ningún resultado.' : `Sorry, we count't find any results.`}</Text>
                    </View>
                </View>
            </View>
            <Image
                style={tw`w-65 h-65`}
                resizeMode={'stretch'}
                source={{uri: 'https://i.pinimg.com/originals/e3/fe/b0/e3feb005c7be486dbed5e1aa032a4dbb.gif'}}
            />
        </>
    )
}