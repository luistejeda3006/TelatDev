import {useState, useEffect} from 'react';
import {DeviceEventEmitter} from 'react-native';
import { useDispatch } from 'react-redux';
import { setOrientation } from '../slices/orientationSlice';
import Orientation from 'react-native-orientation';

export default (initialState = {}) => {
    const dispatch = useDispatch()
    const [orientationInfo, setOrientationInfo] = useState(initialState);
    
    const handleOrientationDidChange = (data) => {
        /* console.log('data: ', data)
        console.log('entra en el cambioooooo') */
        /* dispatch(setOrientation(data ? data : 'PORTRAIT'))
        setOrientationInfo({...orientationInfo, initial: data}); */
    }

    useEffect(() => {
        Orientation.addOrientationListener(handleOrientationDidChange);
        return () => {
            Orientation.removeOrientationListener(handleOrientationDidChange);
        }
    })

    return {orientationInfo}
}