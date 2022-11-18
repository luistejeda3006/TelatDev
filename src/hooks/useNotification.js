import messaging from '@react-native-firebase/messaging';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default () => {
    /* messaging().onNotificationOpenedApp(e => console.log('data cuando abre la noti: ', e))
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    }); */
    // para los mensajes

    let dataNotification = 'dataNotification'
    const [arrived, setArrived] = useState('')

    
    useEffect(() => {
        const notificationOpened = messaging().onNotificationOpenedApp(e => console.log('data cuando abre la noti: ', e))
        return notificationOpened
    },[])

    const backgroundMessageHandler = messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });
    
    useEffect(() => {
        return backgroundMessageHandler
    },[])
    
    useEffect(() => {
        const onMessage = messaging().onMessage(async remoteMessage => {
            setArrived(Math.random().toString())
            AsyncStorage.setItem(dataNotification, JSON.stringify(remoteMessage))
        });
        return onMessage
    },[])

    return{
        arrived
    }    
}

