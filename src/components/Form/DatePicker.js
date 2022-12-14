import { useState } from 'react'
import { useField } from 'formik'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import DatePicker from 'react-native-date-picker'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux'
import {selectLanguageApp} from '../../slices/varSlice'

let initialDate = new Date()
export default ({fieldName, shortFormat = true, isModule = false, required = false, label = ''}) => {
    const language = useSelector(selectLanguageApp)
    const [field, helpers, meta] = useField(fieldName);
    const { value, setValue } = meta
    const [dateLabel, setDateLabel] = useState(label)
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 'auto', alignSelf: 'stretch'}}>
            <TouchableOpacity style={[styles.picker, {justifyContent: shortFormat ? 'flex-start' : 'center'}]} onPress={() => setOpen(true)}>
                <View style={{flex: 1}}>
                    <Text style={{color: '#000', fontSize: 15}}>{dateLabel ? dateLabel : language === '1' ? 'No seleccionada' : 'Not selected'}</Text>
                </View>
                {
                    ((field.value === '' || field.value === undefined && required) || (dateLabel === '' && required))
                    &&
                        <View style={{height: 45, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name='asterisk' color={'#DC3644'} size={7}/>
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
        height: 45,
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        borderRadius: 4,
    },
})