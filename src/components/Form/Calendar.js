import {useState} from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import DatePicker from 'react-native-date-picker'
import {formatDate} from '../../js/dates'

let initialDate = new Date()
export default ({dateLabel = '', language = '1', getValue = () => {}, shortFormat = true, isModule = false, marginBottom = true,}) => {
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
        const ordered = isModule ? `${año}-${mes}-${dia}` : `${dia}-${mes}-${año}`
        const formated = shortFormat ? isModule ? `${año}-${mes}-${dia}` : `${dia}-${mes}-${año}` : formatDate(`${dia}-${mes}-${año}`, language)
        setOpen(false)
        getValue(ordered, formated)
        setDate(date)
    }
    
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20, height: 'auto', alignSelf: 'stretch'}}>
            <TouchableOpacity style={[styles.picker, {justifyContent: shortFormat ? 'flex-start' : 'center', borderColor: '#adadad', marginBottom: marginBottom ? 10 : 0}]} onPress={() => setOpen(true)}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#adadad', fontSize: isModule ? 12 : 15, fontWeight: isModule ? 'bold' : 'normal'}}>{dateLabel ? dateLabel : 'Seleccionar fecha'}</Text>
                </View>
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
        height: 45,
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
})