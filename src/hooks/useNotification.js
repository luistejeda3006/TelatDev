import messaging from '@react-native-firebase/messaging';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setDataNotification } from '../slices/varSlice';

export default () => {
    const dispatch = useDispatch()
    
    /* messaging().onNotificationOpenedApp(e => console.log('data cuando abre la noti: ', e))
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    }); */
    // para los mensajes

    let dataNotification = 'dataNotification'
    const [arrived, setArrived] = useState('')

    const notificationOpened = messaging().onNotificationOpenedApp(e => console.log('data cuando abre la noti: ', e))
    
    useEffect(() => {
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
            dispatch(setDataNotification(JSON.stringify(remoteMessage)))
            setArrived(Math.random().toString())
        });
        return onMessage
    },[])

    return{
        arrived
    }    
}

