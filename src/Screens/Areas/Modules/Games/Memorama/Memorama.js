import React, {useState, useEffect, useMemo, useCallback} from 'react'
import {View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image, StatusBar, SafeAreaView} from 'react-native'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground, Yellow} from '../../../../../colors/colorsApp'
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { HeaderLandscape, HeaderPortrait } from '../../../../../components';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
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

let isIn = null;
let width = Dimensions.get('screen').width
let height = Dimensions.get('screen').height
export default ({navigation, route: {params: {nivel, meta, seconds, id, orientation, enTorneo}}}) => {
	const [contador, setContador] = useState(Math.random().toString())
	const [time, setTime] = useState('')
	const [isStopWatchStart, setIsStopWatchStart] = useState(false)
	const [resetStopWatch, setResetStopWatch] = useState(false)
	const [won, setWon] = useState(false)
	const [errores, setErrores] = useState(0)
	const [reload, setReload] = useState(0)
	const [rowsNumber, setRowsNumber] = useState(id === 1 || id === 2 ? 4 : 5)
	
	const [initialState, setInitialState] = useState({
		cards: [],
		animation: 'flash',
		puntos: 0,
		temporal: undefined,
	})

	const {sound: correctSound} = useSound('correct.mp3')
	const {sound: errorSound} = useSound('error.mp3')
	const {sound: successSound} = useSound('success.mp3')

	useFocusEffect(
        useCallback(() => {
			setRowsNumber(id === 1 || id === 2 ? 4 : 5)
			setIsStopWatchStart(false)
			setResetStopWatch(true)
			setWon(false)
			setErrores(0)
			handlePath(enTorneo === '1' ? 'Menu_' : 'ChooseMemorama')
        }, [])
    );

	const {handlePath} = useNavigation()

	const {cards, animation, temporal} = initialState
	
	const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });

	useEffect(() => {
		let n = []
		let array = []
		for(x=0; x<meta.length; x++){
			array = [...array, meta[x].order]
		}
		
        let t = array.sort((a,b) => Math.random()-0.5);
		for(x=0; x<t.length; x++){
			n = [...n, ({...meta[t[x]-1], opened: true})]
		}

		setInitialState({...initialState, cards: n, animation: 'flipInX'})

		setTimeout(() => {
			const s = n.map(x => x.icon ? ({...x, opened: false}) : x)
			setInitialState({...initialState, cards: s, animation: 'fadeOut'})
		}, seconds)
	},[meta, reload, contador])

	const handleDiscover = (order, icon) => {
		const alreadyOpened = cards.find(x => x.opened && !x.completed)
		const opened = cards.filter(x => !x.completed && x.opened)
		if(opened.length + 1 < 3){
			if(alreadyOpened){
				if(temporal !== order){
					const nuevas = cards.map(x => x.order === order ? ({...x, opened: true, completed: false}) : x)
					setInitialState({...initialState, cards: nuevas, animation: 'shake'})
					setTimeout(() => {
						if(alreadyOpened.icon === icon && alreadyOpened.order !== order){
							const nuevas = cards.map(x => x.icon === icon && !x.completed ? ({...x, completed: true, opened: true}) : x)
							const notYet = nuevas.find(x => !x.completed)
							if(notYet) {
								correctSound.play()
								setInitialState({...initialState, cards: nuevas, animation: 'bounceIn'})
								setIsStopWatchStart(true)
								setResetStopWatch(false)
							}
							else {
								successSound.play()
								setInitialState({...initialState, cards: nuevas, animation: 'bounceIn'})
								setWon(true)
								setIsStopWatchStart(false)
								setResetStopWatch(false)
							}
						}
						else {
							errorSound.play()
							const nuevas = cards.map(x => !x.completed ? ({...x, completed: false, opened: false}) : x)
							setInitialState({...initialState, cards: nuevas, animation: 'shake'})
							setErrores(errores + 1)
							setIsStopWatchStart(true)
							setResetStopWatch(false)
						}
					}, alreadyOpened.icon === icon ? 0 : animation === 'shake' ? 0 : 200)
				}
			}
			else {
				const nuevas = cards.map(x => x.order === order ? ({...x, completed: false, opened: true}) : x)
				setInitialState({...initialState, cards: nuevas, animation: 'bounceIn', temporal: order})
				setIsStopWatchStart(true)
				setResetStopWatch(false)
			}
		}
	}

	const Imagen = ({icon}) => {
		return(
			<Image
				style={{width: width <= 365 ? 25 : 65, height: width <= 365 ? 25 : 65}}
				source={
					icon.includes('par_1.png')
					? 
						require('../../../../../../assets/games/memorama/par_1.png')
					:
						icon.includes('par_2.png')
						? 
							require('../../../../../../assets/games/memorama/par_2.png')
						:
							icon.includes('par_3.png')
							? 
								require('../../../../../../assets/games/memorama/par_3.png')
							:
								icon.includes('par_4.png')
								? 
									require('../../../../../../assets/games/memorama/par_4.png')
								:
									icon.includes('par_5.png')
									? 
										require('../../../../../../assets/games/memorama/par_5.png')
									:
										icon.includes('par_6.png')
										? 
											require('../../../../../../assets/games/memorama/par_6.png')
										:
											icon.includes('par_7.png')
											? 
												require('../../../../../../assets/games/memorama/par_7.png')
											:
												icon.includes('par_8.png')
												? 
													require('../../../../../../assets/games/memorama/par_8.png')
												:
													icon.includes('par_9.png')
													? 
														require('../../../../../../assets/games/memorama/par_9.png')
													:
														icon.includes('par_10.png')
														? 
															require('../../../../../../assets/games/memorama/par_10.png')
														:
															icon.includes('par_11.png')
															? 
																require('../../../../../../assets/games/memorama/par_11.png')
															:
																icon.includes('par_12.png')
																? 
																	require('../../../../../../assets/games/memorama/par_12.png')
																:
																	icon.includes('par_13.png')
																	? 
																		require('../../../../../../assets/games/memorama/par_13.png')
																	:
																		icon.includes('par_14.png')
																		? 
																			require('../../../../../../assets/games/memorama/par_14.png')
																		:
																			require('../../../../../../assets/games/memorama/par_15.png')
				}
				resizeMode={'cover'}
			/>
		)
	}

	const Item = ({text, order, icon, color, opened, completed}) => {
		return(
				opened && !completed
				?
					<Animatable.View
						key={String(order)}
						animation={animation}
						duration={500}>
						<TouchableOpacity onPress={() => handleDiscover(order, icon)} style={[styles.chooseItem, {backgroundColor: '#fff', width: width <= 365 ? 40 : orientationInfo.initial === 'PORTRAIT' ? 70 : 50, height: width <= 365 ? 55 : orientationInfo.initial === 'PORTRAIT' ? 85 : 65}]}>
							{
								opened
								?
									<Imagen icon={icon}/>
								:
									<Text style={styles.chooseItemText}>{text}</Text>
							}
						</TouchableOpacity>
					</Animatable.View>
				:
					!completed
					?
						<TouchableOpacity key={String(order)} onPress={() => handleDiscover(order, icon)} style={[styles.chooseItem, {backgroundColor: '#fff', width: width <= 365 ? 40 : orientationInfo.initial === 'PORTRAIT' ? 70 : 50, height: width <= 365 ? 55 : orientationInfo.initial === 'PORTRAIT' ? 85 : 65}]}>
							{
								opened
								?
									<Imagen icon={icon}/>
								:
									<Image
										style={{width: width <= 365 ? 20 : 30, height: width <= 365 ? 20 : 30}}
										source={require('../../../../../../assets/logo.png')}
									/>
							}
						</TouchableOpacity>
					:
						<View key={String(order)} onPress={() => handleDiscover(order, icon)} style={[styles.chooseItem, {backgroundColor: '#fff', width: width <= 365 ? 40 : orientationInfo.initial === 'PORTRAIT' ? 70 : 50, height: width <= 365 ? 55 : orientationInfo.initial === 'PORTRAIT' ? 85 : 65}]}>
							{
								opened
								?
									<Imagen icon={icon}/>
								:
									<Image
										style={{width: width <= 365 ? 20 : 30, height: width <= 365 ? 20 : 30}}
										source={require('../../../../../../assets/logo.png')}
									/>
							}
						</View>
		)
	}

  	return(
		<>
			<StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			<SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground}} />
			{
				orientationInfo.initial === 'PORTRAIT'
				?
					<HeaderPortrait title={'Memorama'} screenToGoBack={enTorneo === '1' ? 'Menu_' : 'ChooseMemorama'} navigation={navigation} visible={true} confirmation={true} titleAlert={'Saliendo del juego'} subtitleAlert={'¿Seguro que deseas abandonar la partida?'} normal={true}/>
				:
					<HeaderLandscape title={'Memorama'} screenToGoBack={enTorneo === '1' ? 'Menu_' : 'ChooseMemorama'} navigation={navigation} visible={true} confirmation={true} titleAlert={'Saliendo del juego'} subtitleAlert={'¿Seguro que deseas abandonar la partida?'} normal={true}/>
			}
			<View style={[styles.selectionContainer, {padding: orientationInfo.initial === 'PORTRAIT' ? '3%' : '1.5%'}]}>
				{
					orientationInfo.initial === 'PORTRAIT'
					?
						<>
							<View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
								<View style={{flexDirection: 'row', flex: 1,}}>
									<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
										<Image
											style={{width: 30, height: 30}}
											resizeMode={'cover'}
											source={require('../../../../../../assets/games/correcto.png')}
										/>
										<Text style={{fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 8}}>{nivel}</Text>
									</View>
									<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
										<Image
											style={{width: 40, height: 40}}
											resizeMode={'cover'}
											source={require('../../../../../../assets/games/error.png')}
										/>
										<Text style={{fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 8}}>{errores}</Text>
									</View>
								</View>
							</View>
							<View style={{height: 'auto', alignSelf:'stretch'}}>
								<View style={{flex: 1}}></View>
									<View style={{flexDirection: 'row'}}>
										<View style={{flex: 1}}></View>
										<FlatList
											data={cards}
											numColumns={rowsNumber}
											renderItem={({item}) => <Item text={item.text} order={item.order} opened={item.opened} icon={item.icon} color={item.color} completed={item.completed}/>}
											keyExtractor={item => String(item.order)}
											key={Math.random().toString()}
										/>
									</View>
								<View style={{flex: 1}}></View>
							</View>
							<View style={{flex: 1, flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
								<Stopwatch
									laps={true}
									msecs={true}
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
											setWon(false)
											setIsStopWatchStart(false)
											setResetStopWatch(true)
											setReload(reload + 1)
											setErrores(0)
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
							<View style={{flex: 1, flexDirection: 'row'}}>
								<View style={{flex: 1, paddingVertical: 8}}>
									<View style={{flexDirection: 'row', flex: 1,}}>
										<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
											<Image
												style={{width: 30, height: 30}}
												resizeMode={'cover'}
												source={require('../../../../../../assets/games/correcto.png')}
											/>
											<Text style={{fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 8}}>{nivel}</Text>
										</View>
										<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
											<Image
												style={{width: 40, height: 40}}
												resizeMode={'cover'}
												source={require('../../../../../../assets/games/error.png')}
											/>
											<Text style={{fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 8}}>{errores}</Text>
										</View>
									</View>
									<View style={{flex: 1}}>
										<View style={{flex: 1, flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start'}}>
											<Stopwatch
												laps={true}
												msecs={true}
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
														setInitialState({...initialState, resetStopWatch: true})
														setWon(false)
														setReload(reload + 1)
														setErrores(0)
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
								</View>
								<View style={{flex: 1}}>
									<View style={{flex: 1}}></View>
										<View style={{flexDirection: 'row'}}>
											<View style={{flex: 1}}></View>
											<FlatList
												data={cards}
												numColumns={id !== 4 ? rowsNumber : 6}
												renderItem={({item}) => <Item text={item.text} order={item.order} opened={item.opened} icon={item.icon} color={item.color} completed={item.completed}/>}
												keyExtractor={item => String(item.order)}
											/>
										</View>
									<View style={{flex: 1}}></View>
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
		backgroundColor: '#eee'
	},
	selectionContainer:{
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingHorizontal: '3%'

	},
	title: {
		fontSize: 35,
		fontWeight: 'bold',
	},
	item: {
		width: 80,
		height: 80,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 2,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: '#d3d3d3'
	},
	chooseItem: {
		width: width <= 365 ? 40 : 70,
		height: width <= 365 ? 55 : 85,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 2,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: '#d3d3d3'
	},
	itemText: {
		fontSize: 20,
		color: '#000',
		fontWeight: 'bold'
	},
	chooseItemText: {
		fontSize: 16,
		color: '#000',
		fontWeight: 'bold'
	}
})