import React from 'react';
import {View, StyleSheet} from 'react-native';
import Picker from 'react-native-picker-select';
import {useField} from 'formik';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {isIphone} from '../../access/requestedData';

export default ({fieldName, handleAction_uno, handleAction_dos, handleAction_tres, handleAction_cuatro, handleAction_cinco, contador = 0, items, required = true}) => {
    const [field, helpers, meta] = useField(fieldName);
    const { value, setValue } = meta
    const handleIndex = (itemValue,itemIndex) => {
        switch (contador) {
            case 1:
                handleAction_uno(itemIndex);
                setValue(itemValue, true);
                break;
            case 2:
                handleAction_dos(itemIndex);
                setValue(itemValue, true);
                break;
            case 3:
                handleAction_tres(itemIndex);
                setValue(itemValue, true);
                break;
            case 4:
                handleAction_cuatro(itemIndex);
                setValue(itemValue, true);
                break;
            case 5:
                handleAction_cinco(itemIndex);
                setValue(itemValue, true);
                break;
            default:
                setValue(itemValue, true);
                break;
        }
    }
    
    return (
        required
        ?
            <View style={[styles.picker, {paddingRight: (field.value === 'SEL' || field.value === undefined) ? 10 : 0}]}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Picker
                        value={field.value}
                        onValueChange={(itemValue, itemIndex) => handleIndex(itemValue, itemIndex)}
                        items={items}
                        placeholder={{}}
                    />
                </View>
                {
                    (field.value === 'SEL' || field.value === undefined) &&
                    <View style={{height: 48, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                        <Ionicons name='asterisk' color={'#DC3644'} size={12}/>
                    </View>
                }
            </View>
        :
            <View style={[styles.picker, {paddingRight: (field.value === 'SEL' || field.value === undefined) ? 10 : 0}]}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Picker
                        value={field.value}
                        onValueChange={(itemValue, itemIndex) => handleIndex(itemValue, itemIndex)}
                        items={items}
                        placeholder={{}}
                    />
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    picker: {
        justifyContent: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 20,
        height: 48,
        flexDirection: 'row',
        paddingRight: 10,
        paddingLeft: isIphone ? 10 : 0
    },
})