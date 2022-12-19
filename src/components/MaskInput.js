import React from 'react'
import {StyleSheet} from 'react-native'
import MaskInput from 'react-native-mask-input';

export default ({isCenter = false, mask, ...rest}) => {
    return(
        <MaskInput
            style={[styles.box, {justifyContent: 'center', textAlign: isCenter ? 'center' : 'left', backgroundColor: '#fff', color: '#000'}]}
            mask={mask}
            placeholderTextColor={'#adadad'}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    box:{
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 45,
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        backgroundColor: '#f7f7f7',
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignSelf: 'stretch',
        borderRadius: 4
    },
})