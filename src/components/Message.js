import React from 'react'
import {View, Text, Image} from 'react-native'
import {useSelector} from 'react-redux'
import {selectOrientation} from '../slices/orientationSlice'
import Modal from './Modal'

export default ({title = '', tipo = 1, visible}) => {
    const orientation = useSelector(selectOrientation)

    return(
        <Modal orientation={orientation} visibility={visible} except={false}>
            <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', height: 180}}>
                {
                    tipo === 1 
                    ?
                        <Image
                            style={{width: 150, height: 150}}
                            resizeMode='stretch'
                            source={require('../../assets/correct.gif')}
                        />
                    :
                        <Image
                            style={{width: 150, height: 150}}
                            resizeMode='stretch'
                            source={require('../../assets/error.gif')}
                        />
                }
            </View>
            <View style={{height: 'auto', justifyContent: 'center', alignItems: 'center', padding: 16}}>
                <Text style={{fontWeight: 'bold', fontSize: 24, textAlign: 'center',color: '#000'}}>{title}</Text>
            </View>
        </Modal>
    )
}