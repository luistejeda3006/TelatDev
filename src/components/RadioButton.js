import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {Blue} from '../colors/colorsApp';

export default ({legend = 'País', checked, handleCheck, width = 0, color = '#000'}) => {
    return(
        <TouchableOpacity onPress={() => handleCheck()} style={{flex: width === 0 ? 0.5 : 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{width: 21, height: 21, backgroundColor: '#fff', borderColor: checked ? Blue : '#CBCBCB', borderRadius: 25, borderWidth: 1, justifyContent:  'center', alignItems: 'center'}}>
                {/* <Icon name={'check'} size={12} color={checked ? '#fff' : 'transparent'} /> */}
                <View style={{width: 12, height: 12, backgroundColor: checked ? Blue : '#fff', borderRadius: 10}} />
            </View>
            <View style={{width: 4}}></View>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: color}}>{legend}</Text>
        </TouchableOpacity>
    )
}