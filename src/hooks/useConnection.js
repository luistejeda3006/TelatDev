import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

export default () => {
    const [hasConnection, setHasConnection] = useState(true)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setHasConnection(state.isConnected)
          });
          
          return unsubscribe;
    },[])

    const askForConnection = () => {
        const timer1 = setTimeout(() => {
            NetInfo.fetch().then(state => {
                setHasConnection(state.isConnected)
            });
        }, 500)

        return () => {
            clearTimeout(timer1);
        };
    }

    return {
        askForConnection,
        hasConnection,
    }
}