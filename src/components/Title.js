import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

export default ({title, icon, tipo, hasBottom = true, isButton = false, handleAction = undefined, areHiden = true, vertical = true, itCloses=undefined, except=false}) => {
    return(
        !isButton
        ?
            <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8, paddingVertical: vertical ? 8 : 0, borderBottomColor: 'transparent', borderBottomWidth: 1, marginBottom: (!areHiden || hasBottom) ? 10 : 0}}>
                <View style={{flexDirection: 'row'}}>
                    {
                        itCloses
                        &&
                            <View style={{width: 30, justifyContent: 'center', alignItems: 'center'}} onPress={() => itCloses()}>
                                <IonIcons name={'close'} size={35} color={'transparent'} />
                            </View>
                    }
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8}}>
                        <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>{title}</Text>
                    </View>
                    {
                        itCloses
                        &&
                            <TouchableOpacity style={{width: 30, justifyContent: 'center', alignItems: 'center'}} onPress={() => itCloses()}>
                                <IonIcons name={'close'} size={35} color={'#000'} />
                            </TouchableOpacity>
                    }
                </View>
            </View>
        :
            <TouchableOpacity onPress={() => handleAction && handleAction()} style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 8, paddingVertical: vertical ? 8 : 0, borderBottomColor: 'transparent', borderBottomWidth: 1, marginBottom: (!areHiden || hasBottom) ? 10 : 0}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: 25, justifyContent: 'center'}}>
                    {
                        tipo === 1
                        ?
                            <Icon name={icon} size={24} color={'transparent'} />
                        :
                            <IonIcons name={icon} size={28} color={'transparent'} />
                    }
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8}}>
                        <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>{title}</Text>
                    </View>
                    <View style={{width: 25, height: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name={areHiden ? 'chevron-down' : 'chevron-up'} size={18} color={'#000'} />
                    </View>
                </View>
            </TouchableOpacity>
    )
}