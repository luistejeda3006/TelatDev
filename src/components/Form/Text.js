import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default ({title, type = 'title'}) => {
    return (
        type === 'title'
        ?
            <View style={{borderColor: '#CBCBCB', borderBottomWidth: .5, marginBottom: 10, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', paddingBottom: 6, marginTop: 10}}>
                <Text style={[styles.title,{color: '#383838'}]}>{title}</Text>
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
        fontSize: 18,
        color: 'orange',
        fontWeight:'bold'
    },
})