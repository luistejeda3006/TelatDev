import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useField} from 'formik';
import { Blue } from '../../colors/colorsApp';

export default ({fieldName, handlePress, handleDate, timestamp, initialDate, show, required = true}) => {
    const [field, helpers, meta] = useField(fieldName);
    console.log('field: ', field)
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const { value, setValue } = meta;
    useEffect(() => {
        setValue(new Date(timestamp), true);
    },[show])
    
    return (
        <>
            {
                required
                ?
                    <TouchableOpacity
                        style={styles.box}
                        onPress={() => handlePress()}
                    > 
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                            {
                                initialDate !== 'No seleccionada'
                                ?
                                    <Text style={{color: '#000'}}> {initialDate.toString()} </Text>
                                :
                                    <Text style={{color: '#000'}}> No seleccionada </Text>
                            }
                        </View>
                        {
                            (initialDate === 'No seleccionada' || initialDate === 'Not selected') &&
                            <View style={{height: 48, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                                <Ionicons name='asterisk' color={'red'} size={12}/>
                            </View>
                        }
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={styles.box}
                        onPress={() => handlePress()}
                    > 
                        {
                            initialDate !== 'No seleccionada'
                            ?
                                <Text style={{color: '#000'}}> {initialDate.toString()} </Text>
                            :
                                <Text style={{color: '#000'}}> No seleccionada </Text>
                        }
                    </TouchableOpacity>
            }
            { 
                show 
                &&
                    <DateTimePicker
                        testID='dateTimePicker'
                        value={field.value}
                        mode={'date'}
                        is24Hour={true}
                        display='spinner'
                        onChange={(e) => handleDate(e)}
                        style={{backgroundColor: '#fff'}}
                    />
            }
        </>
    
    );
}

const styles = StyleSheet.create({
    box: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        alignSelf: 'stretch',
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 20,
        alignItems: 'center',
        paddingHorizontal: 10
    },
})