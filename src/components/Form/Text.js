import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default ({title, type = 'title', Item = undefined}) => {
    return (
        type === 'title'
        ?
            <View style={{alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', height: 'auto', paddingVertical: 10, flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Text style={[styles.title,{color: '#383838'}]}>{title}</Text>
                </View>
                {
                    Item
                    &&
                        <Item />
                }
            </View>
        :
            <Text style={styles.label}>{title}</Text>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: '#1177E9',
        marginBottom: 5,
    },
    title: {
        fontSize: 20,
        color: 'orange',
        fontWeight:'bold'
    },
})