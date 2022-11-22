import React, {forwardRef} from 'react'
import {StyleSheet, View, TextInput} from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isIphone } from '../access/requestedData';

export default forwardRef(({required = false, edit = true, value ,...rest}, ref) => {
    return(
        !required
        ?
            <View style={[styles.multiline, {justifyContent: 'flex-start', marginBottom: 0, backgroundColor: edit ? '#fff' : '#f7f7f7'}]}>
                <TextInput
                    style={{color: '#000', textAlignVertical: 'top', height: '100%', flex: 1}}
                    placeholderTextColor={'#CBCBCB'}
                    value={value}
                    {...rest}
                />
            </View>
        :
            <View style={[styles.multiline, {justifyContent: 'flex-start', marginBottom: 0, backgroundColor: edit ? '#fff' : '#f7f7f7'}]}>
                <TextInput
                    style={{color: '#000', textAlignVertical: 'top', height: '100%', flex: 1}}
                    placeholderTextColor={'#CBCBCB'}
                    value={value}
                    ref={ref}
                    {...rest}
                />
                {
                    value === ''
                    &&
                        <View style={{height: '100%', width: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                            <Ionicons name='asterisk' color={'#DC3644'} size={12}/>
                        </View>
                }
            </View>
        
    )
})

const styles = StyleSheet.create({
    multiline: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        borderColor: '#dadada',
        flexDirection: 'row',
        borderWidth: 1,
        marginBottom: 15,
        height: 110,
        marginHorizontal: .1,
        paddingHorizontal: 12,
        paddingVertical: isIphone ? 12 : 0,
        borderRadius: 20
    }
})