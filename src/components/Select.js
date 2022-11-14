import React, { useState } from 'react'
import {View, FlatList, Text, StyleSheet, TouchableOpacity, Image, TextInput} from 'react-native'

export default ({data = null, dataArea = null, handleVisiblePeriodos = null, handleActionUno = null, handleVisibleArea = null, handleActionDos = null, search = null}) => {
    const [initialState, setInitialState] = useState({
        filter: '',
        information: data,
        masterInformation: data,
    })

    const {filter, information, masterInformation} = initialState
    
    const handleFilterChange = (text) => {
        if(text){
            const newData = masterInformation.filter(item => {
                const itemData = item.label ? item.label.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            });

            setInitialState({...initialState, information: newData, filter: text});
        }
        else {
            setInitialState({...initialState, information: masterInformation, filter: text});
        }
    }
    
    return(
        <>
            {
                search
                &&
                    <View style={[styles.box, {height: 50, padding: '1%', borderRadius: 25}]}>
                        <View style={{width: 40, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <Image 
                                source={require('../../assets/icons/lupa.png')}
                                resizeMode='cover'
                                style={{width: '55%', height: '55%',
                                justifyContent: 'center',
                                alignItems: 'center'}}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            onChangeText={(e) => handleFilterChange(e)}
                            autoCapitalize = 'characters'
                            placeholder={'Buscar'}
                            value={filter}
                            placeholderTextColor='#c1c1c1'
                        />
                    </View>
            }
            <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                data={!search ? data ? data : dataArea && dataArea : information}
                numColumns={1}
                renderItem={({item}) => 
                    <TouchableOpacity style={{flex: 1, height: 'auto', padding: 14}} onPress={() => {
                        handleVisiblePeriodos ? handleVisiblePeriodos() : handleVisibleArea && handleVisibleArea()
                        handleActionUno ? handleActionUno(item.value, item.label, item.index) : handleActionDos && handleActionDos(item.value, item.label, item.index)
                    }}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text style={{fontSize: 16, color: '#000', fontWeight: '500'}}>{item.label}</Text>
                        </View>
                    </TouchableOpacity>
                }
                keyExtractor={item => String(item.value)}
            />
        </>
    )
}

const styles = StyleSheet.create({
    list:{
        height: 'auto',
        alignSelf: 'stretch',
    },
    box:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
    },
    input:{
        flex: 1,
        height: 50,
        color: '#000',
        fontSize: 15
    },
})
