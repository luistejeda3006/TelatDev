import React from 'react'
import {StyleSheet, TouchableOpacity, View, TextInput, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

export default ({handleInputChange = () => {}, handleFilterChange = () => {}, value = '', currentFilter = '', marginHorizontal = false, marginTop = false, marginBottom = false, capitalize = true, handleClean = () => {}}) => {
    return(
        <View style={[{flexDirection: 'row', height: 45, alignSelf: 'stretch', backgroundColor: '#f7f7f7', marginHorizontal: marginHorizontal ? '2%' : 0, marginTop: marginTop ? '2%' : 0, marginBottom: marginBottom ? '2%' : 0, borderRadius: 30, justifyContent: 'center', alignItems: 'center'}]}>
            <View style={{height: '100%', width: 40, justifyContent: 'center', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 5}}>
                <Image 
                    source={require('../../assets/icons/lupa.png')}
                    resizeMode='cover'
                    style={{width: 25, height: 25,
                    justifyContent: 'center',
                    alignItems: 'center'}}
                />
            </View>
            <View style={{flex: 1, height: '100%', justifyContent: 'center'}}>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => handleInputChange(e)}
                    placeholder={currentFilter}
                    value={value}
                    placeholderTextColor='#adadad'
                    autoCapitalize={capitalize ? 'words' : undefined}
                />
            </View>
            <TouchableOpacity onPress={() => value === '' ? handleFilterChange() : handleClean()}>
                <View style={[{width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 35, paddingRight: 2}]}>
                    {
                        value === ''
                        ?
                            <Image 
                                source={require('../../assets/icons/filter.png')}
                                resizeMode='contain'
                                style={{width: 28, height: 28,
                                justifyContent: 'center',
                                alignItems: 'center'}}
                            />
                        :
                            <Ionicons name={'close'} size={28} color={'#acacac'}/>
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    box:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
        borderColor: '#dadada',
        borderWidth: 1,
        marginBottom: '1%',
    },
    input:{
        flex: 1,
        height: 45,
        color: '#000',
        fontSize: 16
    },
    shadow: {
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowColor: '#000',
        shadowOffset: {
            height: 2,
            width: 0
        },
        //android
        elevation: 1
    }
})