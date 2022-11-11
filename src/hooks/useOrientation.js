import {useState, useEffect} from 'react';
import {DeviceEventEmitter} from 'react-native';
import { useDispatch } from 'react-redux';
import { setOrientation } from '../slices/orientationSlice';
import Orientation from 'react-native-orientation';

export default (initialState = {}) => {
    const dispatch = useDispatch()
    const [orientationInfo, setOrientationInfo] = useState(initialState);
    
    const handleOrientationDidChange = (data) => {
        dispatch(setOrientation(data.isLandscape && data.isLandscape ? 'LANDSCAPE' : 'PORTRAIT'))
        setOrientationInfo({...orientationInfo, initial: data.isLandscape ? 'LANDSCAPE' : 'PORTRAIT'});
    }

    useEffect(() => {
        Orientation.addOrientationListener('namedOrientationDidChange', handleOrientationDidChange);
        return () => {
            Orientation.removeOrientationListener('namedOrientationDidChange', handleOrientationDidChange);
        }
    })

    return {orientationInfo}
}