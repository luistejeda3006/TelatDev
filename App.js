import React from 'react';
import App from './src';
import {Provider} from 'react-redux'
import {store} from './src/store'
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';

IonIcons.loadFont();
Icon.loadFont();

console.error = (error) => error.apply;
export default () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};