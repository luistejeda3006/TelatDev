import React, {forwardRef} from 'react'
import {StyleSheet, View, TextInput} from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useField} from 'formik';
import {isIphone} from '../../access/requestedData';

export default forwardRef(({fieldName, required = false, edit = true, value ,...rest}, ref) => {
    const [field, meta] = useField(fieldName);
    return(
        !required
        ?
            <View style={[styles.multiline, {justifyContent: 'flex-start', marginBottom: 0, backgroundColor: edit ? '#fff' : '#f7f7f7'}]}>
                <TextInput
                    style={{color: '#000', textAlignVertical: 'top', height: '100%', flex: 1}}
                    placeholderTextColor={'#CBCBCB'}
                    onChangeText={field.onChange(fieldName)}
                    value={field.value}
                    onBlur={field.onBlur(fieldName)}
                    autoCapitalize='characters'
                    ref={ref}
                    multiline={true}
                    {...rest}
                />
            </View>
        :
            <View style={[styles.multiline, {justifyContent: 'flex-start', marginBottom: 0, backgroundColor: edit ? '#fff' : '#f7f7f7'}]}>
                <TextInput
                    style={{color: '#000', textAlignVertical: 'top', height: '100%', flex: 1}}
                    placeholderTextColor={'#CBCBCB'}
                    onChangeText={field.onChange(fieldName)}
                    value={field.value}
                    onBlur={field.onBlur(fieldName)}
                    autoCapitalize='characters'
                    ref={ref}
                    multiline={true}
                    {...rest}
                />
                {
                    meta.error
                    &&
                        <View style={{height: '100%', width: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name='asterisk' color={'#DC3644'} size={7}/>
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
        borderColor: '#CBCBCB',
        flexDirection: 'row',
        borderWidth: 1,
        marginBottom: 15,
        height: 110,
        marginHorizontal: .1,
        paddingHorizontal: 8,
        paddingVertical: isIphone ? 12 : 0,
        borderRadius: 4,
    }
})