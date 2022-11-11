import {useState, useEffect} from 'react'
import Sound from 'react-native-sound'

export default (soundName) => {
    const [sound, setSound] = useState(new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
    }))

    useEffect(() => {
        sound.setVolume(1)
    },[])

    return{
        sound
    }
}