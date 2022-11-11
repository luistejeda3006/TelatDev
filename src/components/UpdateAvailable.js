import React from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity, Linking} from 'react-native'
import { Modal } from 'react-native-paper';
import { isIphone } from '../access/requestedData';
import * as Animatable from 'react-native-animatable';

export default ({visibility, language = '1', id_ios, id_android, handleDismiss}) => {

	let idioma = String(language);

    return (
        <Modal visible={visibility} onDismiss={handleDismiss} contentContainerStyle={[styles.center]}>
            <View style={{flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
				<TouchableOpacity style={{width: 300, height: 'auto'}} onPress={() => isIphone ? Linking.openURL(`itms-apps://itunes.apple.com/${id_ios}`) : Linking.openURL(`market://details?id=${id_android}`)}>
					<Animatable.View
						animation='pulse'
						iterationCount={'infinite'}
						duration={1500}
						style={{height: 70, flexDirection: 'row', backgroundColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderWidth: 2, borderColor: '#fff'}}
					>
						<Animatable.View
							animation='fadeIn'
							duration={1750}
							style={{height: 60, width: 60, justifyContent: 'center', alignItems: 'center'}}
						>
							<Image 
								style={{width: 40, height: 40}}
								resizeMode={'contain'}
								source={{uri: isIphone ? 'https://static.wikia.nocookie.net/apple/images/e/e4/App_Store_-_%C3%ADcono.png/revision/latest?cb=20200624173517&path-prefix=es' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_Arrow_logo.svg/1200px-Google_Play_Arrow_logo.svg.png'}}
							/>
						</Animatable.View>
						<View style={{flex: 1, alignSelf: 'stretch', paddingLeft: 5}}>
							<Animatable.View
								animation='slideInLeft'
								duration={2000}
								style={{height: '50%', alignSelf: 'stretch', justifyContent: 'center'}}
							>
								<Text style={{fontSize: 13, fontWeight: 'normal', color: '#fff'}}>{idioma === '1' ? 'Actualización Disponible' : 'Update Available'}</Text>
							</Animatable.View>
							<Animatable.View
								animation='slideInLeft'
								duration={2250}
								style={{height: '50%', alignSelf: 'stretch', justifyContent: 'flex-start'}}>
								<Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>{idioma === '1' ? `Consíguela en ${isIphone ? 'App Store' : 'Google Play'}` : `Get it on ${isIphone ? 'App Store' : 'Google Play'}`}</Text>
							</Animatable.View>
						</View>
					</Animatable.View>
				</TouchableOpacity>
			</View>
        </Modal>
    );  
};

const styles = StyleSheet.create({
    center: {
		flex: 1,
        padding: 20, 
        margin: 10, 
        borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center'
    }
})