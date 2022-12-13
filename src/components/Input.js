import React, {forwardRef} from 'react'
import {StyleSheet, TextInput, View} from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc'

export default forwardRef(({value, optional = false, edit = true, ...rest}, ref) => {
    return(
        !optional
        ?
            <View style={box}>
                <TextInput
                    style={tw`text-[#000] bg-[${edit ? '#fff' : '#f7f7f7'}] h-12 flex-1`}
                    ref={ref}
                    value={value}
                    placeholderTextColor={'#CBCBCB'}
                    {...rest}
                />
                {
                    value === ''
                    &&
                        <View style={{height: 40, width: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                            <Ionicons name='asterisk' color={'red'} size={12}/>
                        </View>
                }
            </View>
        :
            <TextInput
                style={[box, tw`text-black bg-[${edit ? '#fff' : '#f7f7f7'}]`]}
                ref={ref}
                value={value}
                placeholderTextColor={'#CBCBCB'}
                {...rest}
            />
        
    )
})

const box = tw`justify-start items-center h-12.5 flex-row border border-[#CBCBCB] mb-2.5 bg-white px-3 py-2.5 w-[99%]`