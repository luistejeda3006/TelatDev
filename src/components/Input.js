import React, {forwardRef} from 'react'
import {StyleSheet, TextInput, View} from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

export default forwardRef(({value, optional = false, edit = true, ...rest}, ref) => {
    return(
        !optional
        ?
            <View style={styles.box}>
                <TextInput
                    style={{color: '#000', backgroundColor: edit ? '#fff' : '#f7f7f7', height: 48, flex: 1, borderRadius: 20}}
                    ref={ref}
                    value={value}
                    placeholderTextColor={'#CBCBCB'}
                    {...rest}
                />
                {
                    value === ''
                    &&
                        <View style={{height: 48, width: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                            <Ionicons name='asterisk' color={'red'} size={12}/>
                        </View>
                }
            </View>
        :
            <TextInput
                style={[styles.box, {color: '#000', backgroundColor: edit ? '#fff' : '#f7f7f7'}]}
                ref={ref}
                value={value}
                placeholderTextColor={'#CBCBCB'}
                {...rest}
            />
        
    )
})

const styles = StyleSheet.create({
    box:{
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        width: '99%',
        borderRadius: 20
    },
})