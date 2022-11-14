import React, { useState } from 'react'
import {View, TouchableOpacity, Text, Platform, Image} from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default ({savePicture = undefined, imagen, required = false}) => {
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    const [initialState, setInitialState] = useState({
        tipoAccion: 1,
        imagen: imagen
    })

    const {tipoAccion} = initialState

    const handleSelectImage = () => {
        setInitialState({...initialState, imagen: ''})
        const options = {
            title: 'Seleccionar una imagen',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true,
        }
        
        launchImageLibrary(options, response => {
            if(response.errorCode){
                console.log(response.errorMessage)
            } else if(response.didCancel){
                console.log('El usuario canceló la fotografía')
                setInitialState({...initialState, imagen: ''})
                savePicture('', '', '')
            } else {
                console.log(response.assets)
                const uri = response.assets[0].uri
                savePicture(response.assets[0].fileName, response.assets[0].base64, uri, false)
                setInitialState({...initialState, nombre_imagen: response.assets[0].fileName, encryptedImage: response.assets[0].base64, imagen: uri})
            }
        })
    }
    
    const handleTakePicture = () => {
        if(!isIphone) setInitialState({...initialState, imagen: ''})
        const options = {
            title: 'Tomar fotografía',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true
        }
        
        launchCamera(options, response => {
            if(response.errorCode){
                console.log(response.errorMessage)
            } else if(response.didCancel){
                console.log('El usuario canceló la fotografía')
                setInitialState({...initialState, imagen: ''})
                savePicture('', '', '')
            } else {
                const uri = response.assets[0].uri
                savePicture(response.assets[0].fileName, response.assets[0].base64, uri, false)
                setInitialState({...initialState, nombre_imagen: response.assets[0].fileName, encryptedImage: response.assets[0].base64, imagen: uri})
            }
        })
    }
    return(
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 20}}>
            <View style={{height: 'auto', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start', flexDirection: 'row'}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                        {
                            !imagen
                            ?
                                <Image 
                                    style={{
                                        alignSelf: 'center',
                                        height: 40,
                                        width: 40
                                    }}
                                    source={require('../../assets/icons/add-image.png')}
                                />
                            :
                                <View style={{borderWidth: 1, borderColor: '#cbcbcb'}}>
                                    <Image 
                                        style={{
                                            alignSelf: 'center',
                                            height: 38,
                                            width: 38
                                        }}
                                        source={{uri: imagen}}
                                    />
                                </View>
                        }
                    </View>
                    <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 8, borderTopColor: '#cbcbcb', borderBottomColor: '#cbcbcb', borderTopWidth: 1, borderBottomWidth: 1}}>
                        {
                            !isIphone
                            ?
                                <Text style={{fontSize: 14, color: '#adadad'}}>{!imagen ? 'Adjuntar fotografía' : 'Fotografía adjuntada'}</Text>
                            :    
                                <Text style={{fontSize: 14, color: '#adadad'}}>{!imagen ? 'Adjuntar fotografía' : 'Fotografía tomada'}</Text>
                        }
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleTakePicture()} style={{width: 40, height: 40, backgroundColor: '#f7f7f7', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, paddingLeft: 7, paddingTop: 4, borderLeftColor: '#cbcbcb', borderLeftWidth: 1, borderTopColor: '#cbcbcb', borderTopWidth: 1, borderBottomWidth: 1, borderBottomColor: '#cbcbcb'}}>
                <IonIcons name={'camera'} size={23} color={'#000'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectImage()} style={{width: 40, height: 40, backgroundColor: '#f7f7f7', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, borderLeftColor: '#cbcbcb', borderLeftWidth: 1, borderTopColor: '#cbcbcb', borderTopWidth: 1, borderBottomWidth: 1, borderBottomColor: '#cbcbcb', borderRightWidth: 1, borderRightColor: '#cbcbcb'}}>
                <IonIcons name={'image-search'} size={23} color={'#000'} />
            </TouchableOpacity>
        </View>
    )
}