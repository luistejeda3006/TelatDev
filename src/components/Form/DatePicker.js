import { useState } from 'react'
import { useField } from 'formik'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import DatePicker from 'react-native-date-picker'
import {formatDate} from '../../js/dates'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

let initialDate = new Date()
export default ({fieldName, language = '1', shortFormat = true, isModule = false, required = false}) => {
    const [field, helpers, meta] = useField(fieldName);
    const { value, setValue } = meta
    const [dateLabel, setDateLabel] = useState('')
    const [date, setDate] = useState(initialDate)
    const [open, setOpen] = useState(false)

    const handleDate = (date) => {
        let shorter = date.toLocaleDateString()
        shorter = shorter.split('/')
        let dia = shorter[0]
        let mes = shorter[1]
        let año = shorter[2]
        dia = dia.length === 1 ? `0${dia}` : dia
        mes = mes.length === 1 ? `0${mes}` : mes
        const ordered = `${año}-${mes}-${dia}`
        const formated = `${dia}-${mes}-${año}`
        setOpen(false)
        setValue(ordered)
        setDateLabel(formated)
        setDate(date)
    }
    
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20, height: 'auto', alignSelf: 'stretch'}}>
            <TouchableOpacity style={[styles.picker, {justifyContent: shortFormat ? 'flex-start' : 'center'}]} onPress={() => setOpen(true)}>
                <View style={{flex: 1}}>
                    <Text style={{color: '#000', fontSize: 15}}>{dateLabel ? dateLabel : 'No seleccionada'}</Text>
                </View>
                {
                    ((field.value === '' || field.value === undefined && required) || (dateLabel === '' && required))
                    &&
                        <View style={{height: 48, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name='asterisk' color={'#DC3644'} size={12}/>
                        </View>
                }
            </TouchableOpacity>
            <DatePicker
                modal
                mode='date'
                title={null}
                open={open}
                date={date}
                onConfirm={handleDate}
                onCancel={() => {
                setOpen(false)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    picker: {
        alignItems: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 20,
        height: 48,
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
})