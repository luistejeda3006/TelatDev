import React from 'react'
import {TouchableOpacity, View, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {isIphone} from '../access/requestedData';
import {Blue} from '../colors/colorsApp';

//disabled allows to change the value
//list only change width and height to show prettier lists
export default ({onChecked, checked, disabled = false, list = false, legend = '', color = Blue, isUnderline = false, fontSize = 13, unique = false, handlePress = () => {}}) => {
    return(
        !unique
        ?
            !list
            ?
                !disabled
                ?
                    <TouchableOpacity
                        onPress={() => onChecked()}
                        style={{flex: 1, height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <View style={{width: 25, height: 25, backgroundColor: checked ? '#3283c5' : 'rgba(50,131,197,.1)', borderColor: checked ? '#3283c5' : '#CBCBCB', borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name={'check-bold'} size={20} color={checked ? '#fff' : 'transparent'} />
                        </View>
                        <Text style={{fontSize: fontSize, fontWeight: 'bold', marginLeft: 6, color: color, textDecorationColor: isUnderline ? color : 'transparent', textDecorationLine: isUnderline ? 'underline' : 'none', textDecorationStyle: 'solid'}}>{legend}</Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        onPress={() => onChecked()}
                        style={{flex: 1, height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <View style={{width: 25, height: 25, backgroundColor: checked ? '#3283c5' : 'rgba(50,131,197,.1)', borderColor: checked ? '#3283c5' : '#CBCBCB', borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name={'check-bold'} size={20} color={checked ? '#fff' : 'transparent'} />
                        </View>
                        <Text style={{fontSize: fontSize, fontWeight: 'bold', marginLeft: 6, color: color, textDecorationColor: isUnderline ? color : 'transparent', textDecorationLine: isUnderline ? 'underline' : 'none', textDecorationStyle: 'solid'}}>{legend}</Text>
                    </TouchableOpacity>
            :
                !disabled
                ?
                    <TouchableOpacity
                        onPress={() => onChecked()}
                        style={{flex: 1, height: 'auto', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: 4}}>
                        <View style={{width: 25, height: 25, backgroundColor: checked ? '#3283c5' : 'rgba(50,131,197,.1)', borderColor: checked ? '#3283c5' : '#CBCBCB', borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name={'check-bold'} size={20} color={checked ? '#fff' : 'transparent'} />
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            <Text style={{fontSize: fontSize, marginLeft: 6, color: color, textDecorationColor: isUnderline ? color : 'transparent', textDecorationLine: isUnderline ? 'underline' : 'none', textDecorationStyle: 'solid'}}>{legend}</Text>
                        </View>
                    </TouchableOpacity>
                :
                    <View
                        style={{flex: 1, height: 'auto', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: 4}}>
                        <View style={{width: 25, height: 25, backgroundColor: checked ? '#3283c5' : 'rgba(50,131,197,.1)', borderColor: checked ? '#3283c5' : '#CBCBCB', borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name={'check-bold'} size={20} color={checked ? '#fff' : 'transparent'} />
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            <Text style={{fontSize: fontSize, marginLeft: 6, color: color, textDecorationColor: isUnderline ? color : 'transparent', textDecorationLine: isUnderline ? 'underline' : 'none', textDecorationStyle: 'solid'}}>{legend}</Text>
                        </View>
                    </View>
        :
            <View style={{flexDirection: 'row', marginTop: 8, marginBottom: 16}}>
                <TouchableOpacity
                    onPress={() => onChecked()}
                    style={{width: 'auto', height: 'auto', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: 4}}>
                    <View style={{width: 25, height: 25, backgroundColor: checked ? '#3283c5' : 'rgba(50,131,197,.1)', borderColor: checked ? '#3283c5' : '#CBCBCB', borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Ionicons name={'check-bold'} size={20} color={checked ? '#fff' : 'transparent'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress()}>
                    <Text style={{flex: 1, fontSize: fontSize, marginLeft: 6, color: color, textDecorationColor: isUnderline ? color : 'transparent', textDecorationLine: isUnderline ? 'underline' : 'none', textDecorationStyle: 'solid', fontWeight: 'bold', marginTop: isIphone ? 2 : 0}}>{legend}</Text>
                </TouchableOpacity>
            </View>
    )
}