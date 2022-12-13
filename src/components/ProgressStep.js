import React from  'react'
import {View, Text, StyleSheet} from 'react-native'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Blue} from '../colors/colorsApp'
import {selectLanguageApp} from '../slices/varSlice';
import {useSelector} from 'react-redux';
import {selectError, selectStep} from '../slices/progressStepSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import tw from 'twrnc'

let step = null;
let error = null;
let language = null;

export default ({data, children}) => {
    step = useSelector(selectStep)
    error = useSelector(selectError)
    language = useSelector(selectLanguageApp)

    const Item = ({id}) => {
        return(
            <View style={tw`flex-1 justify-center items-center`}>
                <View style={tw`h-9.5 w-9.5 rounded-full bg-[${step >= id ? '#fff' : '#dadada'}] border border-4 border-[${step >= id ? Blue : '#dadada'}] justify-center items-center`}>
                    {
                        step > id
                        ?
                            <IonIcons name={'check'} size={16} color={Blue} />
                        :
                            <Text style={tw`font-bold text-xs text-[${step >= id ? Blue : '#fff'}]`}>{id}</Text>
                    }
                </View>
            </View>
        )
    }

    const Progress = ({id, title}) => {
        return(
            <View style={tw`h-1.5 self-stretch bg-[${id <= step ? Blue : '#dadada'}] flex-1`} />
        )
    }

    const Legend = ({id, title}) => {
        return(
            <View style={tw`flex-1 justify-center items-center mx-2.5 self-stretch`}>
                <Text style={[{fontSize: 12.5}, tw`text-center text-[${id <= step ? Blue : '#dadada'}]`]}>{title}</Text>
            </View>
        )
    }

    return(
        <View style={tw`bg-[#fff] flex-1 justify-center items-center`}>
            <View style={tw`h-14 self-stretch justify-center items-center flex-row`}>
                {data.map(x => <Item total={data.length} {...x}/>)}
            </View>
            <View style={tw`h-auto self-stretch justify-center items-center flex-row`}>
                {data.map(x => <Progress total={data.length} {...x}/>)}
            </View>
            <View style={tw`h-auto self-stretch justify-center items-center flex-row my-1.5`}>
                {data.map(x => <Legend total={data.length} {...x}/>)}
            </View>
            <View style={tw`flex-1 self-stretch border-t border-t-[#dadada] border-b border-b-[#dadada] bg-[#fff]`}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow:1,
    }
})