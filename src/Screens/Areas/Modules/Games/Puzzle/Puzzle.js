import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, ImageBackground, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native'
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import { HeaderPortrait, HeaderLandscape } from '../../../../../components';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { barStyle, barStyleBackground, Blue, SafeAreaBackground } from '../../../../../colors/colorsApp';
import * as Animatable from 'react-native-animatable';
import { useNavigation, useOrientation, useSound } from '../../../../../hooks';
import { useFocusEffect } from '@react-navigation/native';

const options = {
	container: {
		width: 'auto',
		height: 50,
		backgroundColor: '#3283C5',
		paddingLeft: 0,
		paddingRight: 8,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 25,
		color: '#FFF',
		marginLeft: 7,
	},
};

export default ({navigation, route: {params: {nivel, puntos, meta, orientation, enTorneo}}}) => {
	const [time, setTime] = useState('')
	const [reload, setReload] = useState(0)
    const [initialState, setInitialState] = useState({
		elementos: [
			{ order: 1, text: 4 },
			{ order: 2, text: 6 },
			{ order: 3, text: 1 },
			{ order: 4, text: 8 },
			{ order: 5, text: 2 },
			{ order: 6, text: 5 },
			{ order: 7, text: 3 },
			{ order: 8, text: 9 },
			{ order: 9, text: 7 },
			{ order: 10, text: 14 },
			{ order: 11, text: 10 },
			{ order: 12, text: 12 },
			{ order: 13, text: 13 },
			{ order: 14, text: 11 },
			{ order: 15, text: 15 },
			{ order: 16, text: '' },
		],
		goal: meta,
		isStopWatchStart: false,
		resetStopWatch: false,
		won: false
	})

	const {elementos, goal, isStopWatchStart, resetStopWatch, won} = initialState

	const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });

	const {handlePath} = useNavigation()

	const {sound: slideSound} = useSound('slide.mp3')
	const {sound: successSound} = useSound('success.mp3')

	useFocusEffect(
        useCallback(() => {
			setInitialState({
				...initialState,
				goal: meta,
				isStopWatchStart: false,
				resetStopWatch: true,
				won: false
			})
            handlePath(enTorneo === '1' ? 'Menu_' : 'ChoosePuzzle')
			random()
        }, [])
    );

	const random = () => {
        let array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,'']
        let t = array.sort((a,b) => Math.random()-0.5);
		let nuevos = []
		let colored = []
		for(x=0; x<elementos.length; x++){
			if(x === (parseInt(elementos[x].order) - 1)){
				nuevos = [...nuevos, {order: x + 1, text: t[x] ? t[x] : '', match: false}]
			}
		}

		for(x = 0; x<nuevos.length; x++){
			colored = [...colored, {order: x + 1, text: goal[x].text ? goal[x].text : '', match: goal[x].text === nuevos[x].text ? true : false}]
		}
		
		setInitialState({...initialState, elementos: nuevos, goal: colored})
    }

    const Item = ({text, order}) => {
		return(
			text
			?
				!won
				?
					<TouchableWithoutFeedback onPress={() => handleMove(text, order)}>
						<View style={[styles.item, {backgroundColor: text ? '#fff' : '#eee', borderWidth: 2, width: orientationInfo.initial === 'PORTRAIT' ? 69 : 55, height: orientationInfo.initial === 'PORTRAIT' ? 69 : 55}]}>
							<Text style={[styles.itemText, {color: '#000'}]}>{text}</Text>
						</View>
					</TouchableWithoutFeedback>
				:
					<View onPress={() => handleMove(text, order)}>
						<Animatable.View
							animation={won ? 'bounceOut' : 'bounceIn'}
							duration={won ? 1000 : 2000}
							style={[styles.item, {backgroundColor: text ? '#fff' : '#eee', borderWidth: 2, width: orientationInfo.initial === 'PORTRAIT' ? 69 : 55, height: orientationInfo.initial === 'PORTRAIT' ? 69 : 55}]}>
							<Text style={[styles.itemText, {color: '#000'}]}>{text}</Text>
						</Animatable.View>
					</View>
			:
				!won
				?
					<View
						style={[styles.item, {backgroundColor: text ? '#fff' : '#eee', borderWidth: 2, width: orientationInfo.initial === 'PORTRAIT' ? 69 : 55, height: orientationInfo.initial === 'PORTRAIT' ? 69 : 55}]}>
						<Text style={[styles.itemText, {color: '#000'}]}>{text}</Text>
					</View>
				:
					<Animatable.View
						animation={won ? 'bounceOut' : 'bounceIn'}
						duration={1000}
						style={[styles.item, {backgroundColor: text ? '#fff' : '#eee', borderWidth: 2, width: orientationInfo.initial === 'PORTRAIT' ? 69 : 55, height: orientationInfo.initial === 'PORTRAIT' ? 69 : 55}]}>
						<Text style={[styles.itemText, {color: '#000'}]}>{text}</Text>
					</Animatable.View>
		)
	}

    const handleMove = (id, order) => {
		let empty = elementos.find(x => x.text === '')
		empty = empty.order;

		if((order === 4 && empty === 5) || (order === 8 && empty === 9) || (order === 12 && empty === 13) || (order === 5 && empty === 4) || (order === 9 && empty === 8) || (order === 13 && empty === 12)){}
		else {
			if(order === (empty - 1) || order === (empty + 1) || order === (empty - 4) || order === (empty + 4)){
				let temporales = elementos.map(x => x.text !== '' ? ({text: x.text, order: x.order}) : ({text: id, order: x.order}))
				let nuevos = temporales.map(x => x.order === order ? ({text: '', order: x.order}) : x)
				let colored = [];
				for(x = 0; x<nuevos.length; x++){
					colored = [...colored, {order: x + 1, text: goal[x].text ? goal[x].text : '', match: goal[x].text === nuevos[x].text ? true : false}]
				}
				const notYet = colored.find(x => x.match === false)
				if(notYet) {
					slideSound.play()
					setInitialState({...initialState, isStopWatchStart: true, resetStopWatch: false, elementos: nuevos, goal: colored})
				}
				else {
					successSound.play()
					setInitialState({...initialState, isStopWatchStart: false, resetStopWatch: false, elementos: nuevos, goal: colored, won: true})
				}
			}
		}
	}

	const ReferenceItem = ({text, order, match}) => {
		return(
			<View style={[styles.chooseItem, {backgroundColor: match ? '#1DB059' : text !== '' ? '#fff' : '#eee'}]}>
				<Text style={styles.chooseItemText}>{text}</Text>
			</View>
		)
	}

    return (
		<>
			<StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			<SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground}} />
			{
				orientationInfo.initial === 'PORTRAIT'
				?
					<HeaderPortrait title={'Puzzle'} screenToGoBack={enTorneo === '1' ? 'Menu_' : 'ChoosePuzzle'} navigation={navigation} visible={true} confirmation={true} titleAlert={'Saliendo del juego'} subtitleAlert={'¿Seguro que deseas abandonar la partida?'} normal={true}/>
				:
					<HeaderLandscape title={'Puzzle'} screenToGoBack={enTorneo === '1' ? 'Menu_' : 'ChoosePuzzle'} navigation={navigation} visible={true} confirmation={true} titleAlert={'Saliendo del juego'} subtitleAlert={'¿Seguro que deseas abandonar la partida?'} normal={true}/>
			}
			<View style={styles.gameContainer}>
				{
					orientationInfo.initial === 'PORTRAIT'
					?
						<>
							<View style={{flex: 1, padding: '3%', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
								<View style={{height: 'auto', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
									<IonIcons name={!won ? 'information-outline' : 'check-circle-outline'} color={Blue} size={32}/>
									<Text style={{marginLeft: 4, fontSize: 16, color: '#000', fontWeight: 'bold'}}>{!won ? 'Presiona cualquier tecla para comenzar...' : '¡Felicidades!, completaste el Puzzle.'}</Text>
								</View>
								<View style={{flexDirection: 'row', alignSelf: 'stretch', flex: 1}}>
									<View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'stretch'}}>
										<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
											<IonIcons name={'information-outline'} color={'transparent'} size={32}/>
											<Text style={{fontSize: 16, color: '#000'}}>Tipo de nivel: <Text style={{fontWeight: 'bold'}}>{nivel}</Text></Text>
										</View>
										<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
											<IonIcons name={'information-outline'} color={'transparent'} size={32}/>
											<Text style={{fontSize: 16, color: '#000'}}>Puntos en juego: <Text style={{fontWeight: 'bold'}}>{puntos}</Text></Text>
										</View>
									</View>
									<View style={{width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
										<View style={{flex: 1}}></View>
										<View style={{height: 'auto', alignSelf: 'stretch',}}>
											<FlatList
												data={goal}
												numColumns={4}
												renderItem={({item}) => <ReferenceItem text={item.text} order={item.order} match={item.match}/>}
												keyExtractor={item => String(item.order)}
											/>
										</View>
										<View style={{flex: 1}}></View>
									</View>
									<IonIcons name={'information-outline'} color={'transparent'} size={32}/>
								</View>
							</View>
							<View style={{flexDirection: 'row', height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
								<View style={{width: 'auto'}}>
									<IonIcons name={'information-outline'} color={'transparent'} size={32}/>
								</View>
								<View style={{width: 300, height: 300, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#f1f1f1'}}>
									<ImageBackground source={require('../../../../../../assets/perro.jpeg')} resizeMode='cover' style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
										<FlatList
											data={elementos}
											numColumns={4}
											renderItem={({item}) => <Item text={item.text} order={item.order}/>}
											keyExtractor={item => String(item.order)}
										/>
									</ImageBackground>
								</View>
								<View style={{width: 'auto'}}>
									<IonIcons name={'information-outline'} color={'transparent'} size={32}/>
								</View>
							</View>
							<View style={{flex: 1, flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
								<Stopwatch
									laps={true}
									msecs={false}
									start={isStopWatchStart}
									reset={resetStopWatch}
									options={options}
									getTime={(clock) => {
										if(won && !time){
											setTime(clock)
										}
									}}
								/>
								{
									won
									&&
										<TouchableOpacity style={{width: 50, height: 50, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginLeft: 6}} onPress={() => {
											setInitialState({...initialState, won: false, resetStopWatch: true})
											setReload(reload + 1)
											}}>
											<Animatable.View 
											animation={'bounceIn'}
											duration={1500}>
												<IonIcons name={'refresh'} size={35} color={'#fff'}/>
											</Animatable.View>
										</TouchableOpacity>
								}
							</View>
						</>
					:
						<>
							<View style={{flex: 1, padding: '1.5%', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
								<View style={{height: 'auto', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
									<IonIcons name={!won ? 'information-outline' : 'check-circle-outline'} color={Blue} size={32}/>
									<Text style={{marginLeft: 4, fontSize: 16, color: '#000', fontWeight: 'bold'}}>{!won ? 'Presiona cualquier tecla para comenzar...' : '¡Felicidades!, completaste el Puzzle.'}</Text>
								</View>
								<View style={{flexDirection: 'row', flex: 1, alignItems:'stretch'}}>
									<View style={{flex: 1}}>
										<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
											<IonIcons name={'information-outline'} color={'transparent'} size={32}/>
											<Text style={{fontSize: 16, color: '#000'}}>Tipo de nivel: <Text style={{fontWeight: 'bold'}}>{nivel}</Text></Text>
										</View>
										<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
											<IonIcons name={'information-outline'} color={'transparent'} size={32}/>
											<Text style={{fontSize: 16, color: '#000'}}>Puntos en juego: <Text style={{fontWeight: 'bold'}}>{puntos}</Text></Text>
										</View>
										<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', paddingVertical: 10}}>
											<FlatList
												data={goal}
												numColumns={4}
												renderItem={({item}) => <ReferenceItem text={item.text} order={item.order} match={item.match}/>}
												keyExtractor={item => String(item.order)}
											/>
										</View>
										<View style={{flex: 1, flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
											<Stopwatch
												laps={true}
												msecs={false}
												start={isStopWatchStart}
												reset={resetStopWatch}
												options={options}
												getTime={(clock) => {
													if(won && !time){
														setTime(clock)
													}
												}}
											/>
											{
												won
												&&
													<TouchableOpacity style={{width: 50, height: 50, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginLeft: 6}} onPress={() => {
														setInitialState({...initialState, won: false, resetStopWatch: true})
														setReload(reload + 1)
													}}>
														<Animatable.View 
														animation={'bounceIn'}
														duration={1500}>
															<IonIcons name={'refresh'} size={35} color={'#fff'}/>
														</Animatable.View>
													</TouchableOpacity>
											}
										</View>
									</View>
									<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
										<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
											<View style={{width: 250, height: 250, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#f1f1f1'}}>
												<ImageBackground source={require('../../../../../../assets/perro.jpeg')} resizeMode='cover' style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
													<FlatList
														data={elementos}
														numColumns={4}
														renderItem={({item}) => <Item text={item.text} order={item.order}/>}
														keyExtractor={item => String(item.order)}
													/>
												</ImageBackground>
											</View>
										</View>
									</View>
								</View>
							</View>
						</>
				}
			</View>
		</>
    )
}

const styles = StyleSheet.create({
	gameContainer: {
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	title: {
		fontSize: 35,
		fontWeight: 'bold',
	},
	item: {
		width: 69,
		height: 69,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 2,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: '#464646'
	},
	itemText: {
		fontSize: 20,
		color: '#000',
		fontWeight: 'bold'
	},
	chooseItem: {
		width: 20,
		height: 20,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 2,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: '#d3d3d3'
	},
	chooseItemText: {
		fontSize: 10,
		color: '#000',
		fontWeight: 'bold'
	}
})