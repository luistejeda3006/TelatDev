import React from 'react';
import {StyleSheet} from 'react-native'
import {Modal} from 'react-native-paper';

export default ({visibility, handleDismiss, orientation, children}) => {
    return (
        <Modal visible={visibility} onDismiss={handleDismiss} contentContainerStyle={[styles.center, {marginHorizontal: orientation === 'PORTRAIT' ? 10 : 150, marginVertical: 45}]}>
            {children}
        </Modal>
    );  
};

const styles = StyleSheet.create({
    center: {
        backgroundColor: 'white', 
        padding: 20, 
        margin: 10, 
        borderRadius: 10
    }
})