import {useDispatch} from 'react-redux';
import {setAccess, setScreen} from '../slices/navigationSlice';

export default () => {
    const dispatch = useDispatch()

    const handlePath = async (screen) => {
        dispatch(setScreen(screen))
        dispatch(setAccess('1'))
    }

    return {
        handlePath
    }
}