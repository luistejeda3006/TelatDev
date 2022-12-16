import React, {forwardRef} from 'react'
import {StyleSheet, TextInput, View} from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc'

export default forwardRef(({value, optional = false, edit = true, ...rest}, ref) => {
    return(
        !optional
        ?
            <View style={styles.box}>
                <TextInput
                    style={tw`text-[#000] bg-[${edit ? '#fff' : '#f7f7f7'}] flex-1`}
                    ref={ref}
                    value={value}
                    placeholderTextColor={'#CBCBCB'}
                    {...rest}
                />
                {
                    value === ''
                    &&
                        <View style={{height: 40, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name='asterisk' color={'#DC3644'} size={7}/>
                        </View>
                }
            </View>
        :
            <TextInput
                style={[styles.box, tw`text-black bg-[${edit ? '#fff' : '#f7f7f7'}]`]}
                ref={ref}
                value={value}
                placeholderTextColor={'#CBCBCB'}
                {...rest}
            />
        
    )
})

const styles = StyleSheet.create({
    box: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 45,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#cbcbcb',
        marginBottom: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingRight: 10,
        width: '100%',
        paddingLeft: 8,
        borderRadius: 4,
    }
})