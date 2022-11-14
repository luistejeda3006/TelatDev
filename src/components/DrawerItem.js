import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default ({title = 'Información Personal', icon, Imagen = undefined, size=28, handlePress, first = false}) => {
    return(
        <TouchableOpacity onPress={() => handlePress()} style={{height: 'auto', alignSelf: 'stretch', marginTop: first ? 20 : 10, marginBottom: 10, marginHorizontal: 25, backgroundColor: '#fff', shadowColor: '#000', elevation: 5, shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27, borderRadius: 15}}
        >
            <View style={{height: 'auto', alignSelf: 'stretch', borderWidth: 1, borderColor: '#dadada', backgroundColor: '#fff', paddingHorizontal: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 4}}>
                <View style={{width: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start', marginTop: 5}}>
                    {
                        !Imagen
                        ?
                            <IonIcons name={icon} color={'#000'} size={size}/>
                        :
                            <Imagen />
                    }
                </View>
                <View style={{height: 50, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start', marginTop: 5, marginLeft: 10, flex: 1}}>
                    <Text style={{fontSize: 16}}>{title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}