import React, {forwardRef} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useField} from 'formik';

//estatus permite saber si la caja esta activa o inactiva
//fieldname es el nombre o id de nuestra caja de texto - con el cual vamos a recuperar el valor
//icon hace referencia a que si la caja tendrá icono {icon: Nombre del icono :: String}
//...rest son el resto de propiedades que pudiera tener el campo de texto

export default forwardRef(({status, radius = true, fieldName, icon, isTextArea = false, ...rest}, ref) => {
    const [field, meta] = useField(fieldName);
    return (
        <View style={(meta.error !== 'Requerido' && meta.error !== 'Required') ? [styles.box, {borderTopStartRadius: 20, borderBottomStartRadius: 20, borderTopEndRadius: radius ? 20 : 0, borderBottomEndRadius: radius ? 20 : 0}] : [styles.box, {borderTopStartRadius: 20, borderBottomStartRadius: 20, borderTopEndRadius: 20, borderBottomEndRadius: 20}]}>
            {
                !icon
                ?
                    <TextInput
                        ref={ref}
                        style={!isTextArea ? styles.input : [styles.input, {height: 80, textAlign: 'auto'}]}
                        onChangeText={field.onChange(fieldName)}
                        value={field.value}
                        autoCapitalize = 'characters'
                        placeholderTextColor='#c1c1c1'
                        onBlur={field.onBlur(fieldName)}
                        editable={status}
                        {...rest}
                    />
                :
                    <>
                        <View style={{backgroundColor: '#F7F7F7', width: 50, height: 48, paddingLeft: 3, justifyContent: 'center', alignItems: 'center', borderColor: '#f1f1f1', borderWidth: 1, borderTopLeftRadius: 20, borderBottomLeftRadius: 20}}>
                            <Icon name={icon} size={20} color='black' />
                        </View>
                        <TextInput
                            ref={ref}
                            style={styles.input}
                            onChangeText={field.onChange(fieldName)}
                            value={field.value}
                            onBlur={field.onBlur(fieldName)}
                            autoCapitalize = 'none'
                            placeholderTextColor='#c1c1c1'
                            editable={status}
                            {...rest}
                        />
                    </>
            }
            
            {
                status 
                &&
                    meta.error &&
                    <View style={{height: 48, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                        <Ionicons name='asterisk' color={'#DC3644'} size={12}/>
                    </View>
            }
        </View>
    );
})

const styles = StyleSheet.create({
    box:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 10,
        paddingRight: 10,
    },
    input:{
        flex: 1,
        height: 48,
        borderRadius: 20,
        color: '#000',
        paddingLeft: 8
    }
})