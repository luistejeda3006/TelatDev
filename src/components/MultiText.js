import React, {forwardRef} from 'react'
import {StyleSheet, View, TextInput} from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {isIphone} from '../access/requestedData';
import tw from 'twrnc'

export default forwardRef(({required = false, edit = true, value ,...rest}, ref) => {
    return(
        !required
        ?
            <View style={[multiline, tw`justify-start mb-0 bg-[${edit ? '#fff' : '#f7f7f7'}]`]}>
                <TextInput
                    style={{color: '#000', textAlignVertical: 'top', height: '100%', flex: 1}}
                    placeholderTextColor={'#CBCBCB'}
                    value={value}
                    {...rest}
                />
            </View>
        :
            <View style={[multiline, tw`justify-start mb-0 bg-[${edit ? '#fff' : '#f7f7f7'}]`]}>
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

const multiline = tw`justify-start items-start self-stretch border border-[#CBCBCB] flex-row mb-4 h-27.5 w-[99%] px-2 py-[${isIphone ? 3 : 0}] rounded`