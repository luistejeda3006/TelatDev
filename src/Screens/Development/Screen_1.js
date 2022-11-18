import { useState } from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import DatePicker from 'react-native-date-picker'
import { formatDate } from '../../js/dates'

let initialDate = new Date()
/* getFullDate(datite.toLocaleDateString() */
export default ({language = '1', getValue = () => {}}) => {
    const [dateLabel, setDateLabel] = useState('')
    const [date, setDate] = useState(initialDate)
    const [open, setOpen] = useState(false)

    console.log(date)

    const handleDate = (date) => {
        let shorter = date.toLocaleDateString()
        shorter = shorter.split('/')
        let dia = shorter[0]
        let mes = shorter[1]
        let año = shorter[2]
        dia = dia.length === 1 ? `0${dia}` : dia
        mes = mes.length === 1 ? `0${mes}` : mes
        const ordered = `${año}-${mes}-${dia}`
        const formated = formatDate(`${dia}-${mes}-${año}`, language)
        setOpen(false)
        getValue(ordered)
        setDateLabel(formated)
        setDate(date)
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.picker} onPress={() => setOpen(true)}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>{dateLabel ? dateLabel : 'Seleccionar fecha'}</Text>
            </TouchableOpacity>
            <DatePicker
                modal
                mode='date'
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
        justifyContent: 'center',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 20,
        height: 48,
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
})