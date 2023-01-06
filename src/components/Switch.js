import React from 'react'
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'
import { Blue } from '../colors/colorsApp'
import Icon from 'react-native-vector-icons/FontAwesome';

export default ({title, value = false, isButton = true, handleSwitch}) => {
    return(
        <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 20, justifyContent: 'flex-start', alignItems: 'center', borderRadius: 5}}>
            <Text style={styles.title}>{title}</Text>
            {
                isButton
                ?
                    <TouchableOpacity 
                        onPress={() => handleSwitch()}
                        style={{marginLeft: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3.5, backgroundColor: value === true || value === '1' ? Blue : '#AAA', borderRadius: 14}}
                    >
                        <View style={{width: 40, height: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderTopStartRadius: 10, borderBottomStartRadius: 10}}>
                            {
                                value === true || value === '1'
                                ?
                                    <View style={{width: 36, height: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingBottom: 2, borderTopStartRadius: 10, borderBottomStartRadius: 10, paddingTop: 1.5}}>
                                        <Icon name={'check'} size={15} color={'#fff'} />
                                    </View>
                                :
                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: value === true || value === '1' ? Blue : '#AAA'}}>OFF</Text>
                            }
                        </View>
                        <View style={{width: 40, height: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderTopEndRadius: 10, borderBottomEndRadius: 10}}>
                            {
                                value === true || value === '1'
                                ?
                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: value === true || value === '1' ? Blue : '#AAA'}}>ON</Text>
                                :
                                    <View style={{width: 36, height: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AAA', paddingBottom: 2, borderTopEndRadius: 10, borderBottomEndRadius: 10, paddingTop: 1}}>
                                        <Icon name={'times'} size={15} color={'#fff'} />
                                    </View>
                            }
                        </View>
                    </TouchableOpacity>
                :
                    <View style={{marginLeft: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3.5, backgroundColor: value === true || value === '1' ? Blue : '#AAA', borderRadius: 14}}>
                        <View style={{width: 40, height: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderTopStartRadius: 10, borderBottomStartRadius: 10}}>
                            {
                                value === true || value === '1'
                                ?
                                    <View style={{width: 36, height: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: Blue, paddingBottom: 2, borderTopStartRadius: 10, borderBottomStartRadius: 10, paddingTop: 1.5}}>
                                        <Icon name={'check'} size={15} color={'#fff'} />
                                    </View>
                                :
                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: value === true || value === '1' ? Blue : '#AAA'}}>OFF</Text>
                            }
                        </View>
                        <View style={{width: 40, height: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderTopEndRadius: 10, borderBottomEndRadius: 10}}>
                            {
                                value === true || value === '1'
                                ?
                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: value === true || value === '1' ? Blue : '#AAA'}}>ON</Text>
                                :
                                    <View style={{width: 36, height: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AAA', paddingBottom: 2, borderTopEndRadius: 10, borderBottomEndRadius: 10, paddingTop: 1}}>
                                        <Icon name={'times'} size={15} color={'#fff'} />
                                    </View>
                            }
                        </View>
                    </View>
                    
            }
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 13,
        color: Blue,
        fontWeight:'500'
    },
})