import React, {useState, useCallback} from 'react';
import {AppRegistry, StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, TouchableNativeFeedback, Image} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import { barStyle, barStyleBackground, Blue, SafeAreaBackground } from '../../../../../colors/colorsApp';
import {Constants, Food, Head, Systems, Tail} from './resources'
import * as Animatable from 'react-native-animatable';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {HeaderPortrait, HeaderLandscape, Modal} from '../../../../../components'
import {useNavigation, useSound} from '../../../../../hooks';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectLanguageApp} from '../../../../../slices/varSlice';
import {selectOrientation} from '../../../../../slices/orientationSlice';

let engine = null;
let move = 'move-right'
export default ({navigation, route: {params: {enTorneo = '0'}}}) => {
	const orientation = useSelector(selectOrientation)
	const language = useSelector(selectLanguageApp)
	const [initialState, setInitialState] = useState({
		boardSize: Constants.GRID_SIZE * Constants.CELL_SIZE,
		state: {
			running: false,
			score: 0,
			visible: false,
			onFocused: true,
			name: '',
			finished: false,
		},
		scoreVisible: false,
	})

	const {sound: openSound} = useSound('bubble.mp3')
	const {sound: gameOverSound} = useSound('game_over.mp3')

	const {handlePath} = useNavigation()
	
	useFocusEffect(
        useCallback(() => {
            handlePath('Menu/')
        }, [])
    );

	const {boardSize, state, scoreVisible} = initialState

	const randomBetween = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	const onEvent = (e) => {
		const {score} = state;
		if (e.type === 'game-over') {
			gameOverSound.play()
			setInitialState({...initialState, state: {...state, running: false, finished: true}, scoreVisible: !scoreVisible})
		} else if (e.type === 'score+') {
			var s = score + 1;
			openSound.play()
			setInitialState({...initialState, state: {...state, score: s}})
		}
	};

	const reset = () => {
		engine.swap({
			head: {
				type: move,
				position: [0, 0],
				xspeed: 1,
				yspeed: 0,
				nextMove: 10,
				updateFrequency: 10,
				size: 20,
				renderer: <Head />,
			},
			food: {
				position: [
					randomBetween(0, Constants.GRID_SIZE - 1),
					randomBetween(0, Constants.GRID_SIZE - 1),
				],
				size: 20,
				renderer: <Food />,
			},
			tail: {
				size: 20, elements: [], renderer: <Tail />
			},
		});
		setInitialState({...initialState, state: {...state, running: false, score: 0, finished: false}, scoreVisible: false})
	};

	const {score, name, running, finished} = state;
	
	return (
		<>
			<StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			<SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
			<View style={styles.container}>
				{
					orientation === 'PORTRAIT'
					?
						<>
						
							<HeaderPortrait title={'Snake'} screenToGoBack={'Menu'} navigation={navigation} visible={true} confirmation={true} titleAlert={'Saliendo del juego'} subtitleAlert={'¿Seguro que deseas abandonar la partida?'} normal={true}/>
							<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
								<GameEngine
									ref={(ref) => {engine = ref}}
									style={[
										{
											width: boardSize,
											height: boardSize,
											backgroundColor: !finished ? '#ffffff' : '#f7f7f7',
											flex: null,
											marginTop: 50,
											borderWidth: 1,
											borderColor: '#acacac'
										},
									]}
									systems={[Systems]}
									entities={{
										head: {
										position: [0, 0],
										xspeed: .5,
										yspeed: 0,
										nextMove: 10,
										updateFrequency: 10,
										size: 20,
										type: move,
										renderer: <Head />,
										},
										food: {
										position: [
											randomBetween(0, Constants.GRID_SIZE - 1),
											randomBetween(0, Constants.GRID_SIZE - 1),
										],
										size: 20,
										renderer: <Food />,
										},
										tail: {size: 20, elements: [], renderer: <Tail />},
									}}
									running={state.running}
									onEvent={onEvent}>
								</GameEngine>
							</View>
							<View style={{height: 50, alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 30, position: 'relative', bottom: 20, left: 5}}>
								<View style={{backgroundColor: score >= 25 ? '#49A958' : '#D02C2C', justifyContent: 'center', alignItems: 'center', borderRadius: 20, width: 40, height: 40, borderWidth: 1, borderColor: '#dadada'}}>
									<Text style={{color: '#fff', fontWeight: 'bold'}}>{score}</Text>
								</View>
							</View>
							<View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
								{
									!finished
									?
										<>
											<View style={{height: 'auto', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
												<View style={{flex: 1}} />
												<TouchableNativeFeedback
													onPress={() => {
														if(move !== 'move-down'){
															engine.dispatch({type: 'move-up'});
															move = 'move-up'
															setInitialState({...initialState, state: {...state, running: !running ? true : true}})
														}
													}}>
														<View
															style={{width: 80, height: 80, backgroundColor: Blue, borderWidth: 2, borderColor: '#03A9F4', justifyContent: 'center', alignItems: 'center'}} >
															<IonIcons size={40} color={'#fff'} name={'menu-up-outline'}/>
														</View>
													</TouchableNativeFeedback>
												<View style={{flex: 1}} />
											</View>
											<View style={{height: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
												<View style={{flex: 1, alignItems: 'flex-end'}}>
													<TouchableNativeFeedback
														onPress={() => {
															if(move !== 'move-right'){
																engine.dispatch({type: 'move-left'});
																move = 'move-left'
																setInitialState({...initialState, state: {...state, running: !running ? true : true}})
															}
														}}>
														<View
															style={{width: 80, height: 80, backgroundColor: Blue, borderWidth: 2, borderColor: '#03A9F4', justifyContent: 'center', alignItems: 'center'}}>
															<IonIcons size={40} color={'#fff'} name={'menu-left-outline'}/>
														</View>
													</TouchableNativeFeedback>
												</View>
												<View style={{width: 80, height: 80}}>
												
												</View>
												<View style={{flex: 1, alignItems: 'flex-start'}}>
													<TouchableNativeFeedback
														onPress={() => {
															if(move !== 'move-left'){
																engine.dispatch({type: 'move-right'});
																move = 'move-right'
																setInitialState({...initialState, state: {...state, running: !running ? true : true}})
															}
														}}>
														<View 
															style={{width: 80, height: 80, backgroundColor: Blue, borderWidth: 2, borderColor: '#03A9F4', justifyContent: 'center', alignItems: 'center'}}>
															<IonIcons size={40} color={'#fff'} name={'menu-right-outline'}/>
														</View>
													</TouchableNativeFeedback>
												</View>
											</View>
											<View style={{height: 'auto', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
												<View style={{flex: 1}} />
												<TouchableNativeFeedback
													onPress={() => {
														if(move !== 'move-up'){
															engine.dispatch({type: 'move-down'});
															move = 'move-down'
															setInitialState({...initialState, state: {...state, running: !running ? true : true}})
														}
													}}>
													<View 
														style={{width: 80, height: 80, backgroundColor: Blue, borderWidth: 2, borderColor: '#03A9F4', justifyContent: 'center', alignItems: 'center'}}>
														<IonIcons size={40} color={'#fff'} name={'menu-down-outline'}/>
													</View>
												</TouchableNativeFeedback>
												<View style={{flex: 1}} />
											</View>
										</>
									:
										<>
											<View style={{height: 'auto', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
												<View style={{flex: 1}} />
													<View
														onPress={() => {
															move = 'move-up'
															setInitialState({...initialState, state: {...state, running: !running ? true : true}})
															engine.dispatch({type: 'move-up'});
														}}>
															<View
																style={{width: 80, height: 80, backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}} >
																<IonIcons size={40} color={'#dadada'} name={'menu-up-outline'}/>
															</View>
													</View>
												<View style={{flex: 1}} />
											</View>
											<View style={{height: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
												<View style={{flex: 1, alignItems: 'flex-end'}}>
													<View
														onPress={() => {
															move = 'move-left'
															setInitialState({...initialState, state: {...state, running: !running ? true : true}})
															engine.dispatch({type: 'move-left'});
														}}>
														<View
															style={{width: 80, height: 80, backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
															<IonIcons size={40} color={'#dadada'} name={'menu-left-outline'}/>
														</View>
													</View>
												</View>
												{
													finished
													&&
														<View style={{width: 80, height: 80, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center'}}>
															<TouchableNativeFeedback onPress={() => reset()}>
																<View style={{flex: 1, alignSelf: 'stretch', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
																	<Animatable.View 
																		animation={'bounceIn'}
																		duration={1500}>
																		<IonIcons name={'refresh'} size={38} color={'#fff'}/>
																	</Animatable.View>
																</View>
															</TouchableNativeFeedback>
														</View>
												}
												<View style={{flex: 1, alignItems: 'flex-start'}}>
													<View
														onPress={() => {
															move = 'move-right'
															setInitialState({...initialState, state: {...state, running: !running ? true : true}})
															engine.dispatch({type: 'move-right'});
														}}>
														<View 
															style={{width: 80, height: 80, backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
															<IonIcons size={40} color={'#dadada'} name={'menu-right-outline'}/>
														</View>
													</View>
												</View>
											</View>
											<View style={{height: 'auto', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
												<View style={{flex: 1}} />
												<View
													onPress={() => {
														move = 'move-down'
														setInitialState({...initialState, state: {...state, running: !running ? true : true}})
														engine.dispatch({type: 'move-down'});
													}}>
													<View 
														style={{width: 80, height: 80, backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
														<IonIcons size={40} color={'#dadada'} name={'menu-down-outline'}/>
													</View>
												</View>
												<View style={{flex: 1}} />
											</View>
										</>
								}
							</View>
						</>
					:
						<>
							<HeaderLandscape title={'Snake'} screenToGoBack={'Menu'} navigation={navigation} visible={true} confirmation={true} titleAlert={'Saliendo del juego'} subtitleAlert={'¿Seguro que deseas abandonar la partida?'} normal={true}/>
							<View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row'}}>
								<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50}}>
									<GameEngine
										ref={(ref) => {engine = ref}}
										style={[
											{
												width: boardSize,
												height: boardSize,
												backgroundColor: !finished ? '#ffffff' : '#f7f7f7',
												flex: null,
												borderWidth: 1,
												borderColor: '#acacac'
											},
										]}
										systems={[Systems]}
										entities={{
											head: {
											position: [0, 0],
											xspeed: .5,
											yspeed: 0,
											nextMove: 10,
											updateFrequency: 10,
											size: 20,
											type: move,
											renderer: <Head />,
											},
											food: {
											position: [
												randomBetween(0, Constants.GRID_SIZE - 1),
												randomBetween(0, Constants.GRID_SIZE - 1),
											],
											size: 20,
											renderer: <Food />,
											},
											tail: {size: 20, elements: [], renderer: <Tail />},
										}}
										running={state.running}
										onEvent={onEvent}>
									</GameEngine>
									<View style={{height: 50, alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 30, position: 'absolute', bottom: 10, right: 3}}>
										<View style={{backgroundColor: score >= 25 ? '#49A958' : '#D02C2C', justifyContent: 'center', alignItems: 'center', borderRadius: 20, width: 40, height: 40, borderWidth: 1, borderColor: '#dadada'}}>
											<Text style={{color: '#fff', fontWeight: 'bold'}}>{score}</Text>
										</View>
									</View>
								</View>
								<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
									{
										!finished
										?
											<>
												<View style={{height: 'auto', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
													<View style={{flex: 1}} />
													<TouchableNativeFeedback
														onPress={() => {
															if(move !== 'move-down'){
																engine.dispatch({type: 'move-up'});
																move = 'move-up'
																setInitialState({...initialState, state: {...state, running: !running ? true : true}})
															}
														}}>
															<View
																style={{width: 80, height: 80, backgroundColor: Blue, borderWidth: 2, borderColor: '#03A9F4', justifyContent: 'center', alignItems: 'center'}} >
																<IonIcons size={40} color={'#fff'} name={'menu-up-outline'}/>
															</View>
														</TouchableNativeFeedback>
													<View style={{flex: 1}} />
												</View>
												<View style={{height: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
													<View style={{flex: 1, alignItems: 'flex-end'}}>
														<TouchableNativeFeedback
															onPress={() => {
																if(move !== 'move-right'){
																	engine.dispatch({type: 'move-left'});
																	move = 'move-left'
																	setInitialState({...initialState, state: {...state, running: !running ? true : true}})
																}
															}}>
															<View
																style={{width: 80, height: 80, backgroundColor: Blue, borderWidth: 2, borderColor: '#03A9F4', justifyContent: 'center', alignItems: 'center'}}>
																<IonIcons size={40} color={'#fff'} name={'menu-left-outline'}/>
															</View>
														</TouchableNativeFeedback>
													</View>
													<View style={{width: 80, height: 80}}>
													
													</View>
													<View style={{flex: 1, alignItems: 'flex-start'}}>
														<TouchableNativeFeedback
															onPress={() => {
																if(move !== 'move-left'){
																	engine.dispatch({type: 'move-right'});
																	move = 'move-right'
																	setInitialState({...initialState, state: {...state, running: !running ? true : true}})
																}
															}}>
															<View 
																style={{width: 80, height: 80, backgroundColor: Blue, borderWidth: 2, borderColor: '#03A9F4', justifyContent: 'center', alignItems: 'center'}}>
																<IonIcons size={40} color={'#fff'} name={'menu-right-outline'}/>
															</View>
														</TouchableNativeFeedback>
													</View>
												</View>
												<View style={{height: 'auto', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
													<View style={{flex: 1}} />
													<TouchableNativeFeedback
														onPress={() => {
															if(move !== 'move-up'){
																engine.dispatch({type: 'move-down'});
																move = 'move-down'
																setInitialState({...initialState, state: {...state, running: !running ? true : true}})
															}
														}}>
														<View 
															style={{width: 80, height: 80, backgroundColor: Blue, borderWidth: 2, borderColor: '#03A9F4', justifyContent: 'center', alignItems: 'center'}}>
															<IonIcons size={40} color={'#fff'} name={'menu-down-outline'}/>
														</View>
													</TouchableNativeFeedback>
													<View style={{flex: 1}} />
												</View>
											</>
										:
											<>
												<View style={{height: 'auto', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
													<View style={{flex: 1}} />
														<View
															onPress={() => {
																move = 'move-up'
																setInitialState({...initialState, state: {...state, running: !running ? true : true}})
																engine.dispatch({type: 'move-up'});
															}}>
																<View
																	style={{width: 80, height: 80, backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}} >
																	<IonIcons size={40} color={'#dadada'} name={'menu-up-outline'}/>
																</View>
														</View>
													<View style={{flex: 1}} />
												</View>
												<View style={{height: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
													<View style={{flex: 1, alignItems: 'flex-end'}}>
														<View
															onPress={() => {
																move = 'move-left'
																setInitialState({...initialState, state: {...state, running: !running ? true : true}})
																engine.dispatch({type: 'move-left'});
															}}>
															<View
																style={{width: 80, height: 80, backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
																<IonIcons size={40} color={'#dadada'} name={'menu-left-outline'}/>
															</View>
														</View>
													</View>
													{
														finished
														&&
															<View style={{width: 80, height: 80, backgroundColor: Blue, justifyContent: 'center', alignItems: 'center'}}>
																<TouchableNativeFeedback onPress={() => reset()}>
																	<View style={{flex: 1, alignSelf: 'stretch', backgroundColor: Blue, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
																		<Animatable.View 
																			animation={'bounceIn'}
																			duration={1500}>
																			<IonIcons name={'refresh'} size={38} color={'#fff'}/>
																		</Animatable.View>
																	</View>
																</TouchableNativeFeedback>
															</View>
													}
													<View style={{flex: 1, alignItems: 'flex-start'}}>
														<View
															onPress={() => {
																move = 'move-right'
																setInitialState({...initialState, state: {...state, running: !running ? true : true}})
																engine.dispatch({type: 'move-right'});
															}}>
															<View 
																style={{width: 80, height: 80, backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
																<IonIcons size={40} color={'#dadada'} name={'menu-right-outline'}/>
															</View>
														</View>
													</View>
												</View>
												<View style={{height: 'auto', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
													<View style={{flex: 1}} />
													<View
														onPress={() => {
															move = 'move-down'
															setInitialState({...initialState, state: {...state, running: !running ? true : true}})
															engine.dispatch({type: 'move-down'});
														}}>
														<View 
															style={{width: 80, height: 80, backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
															<IonIcons size={40} color={'#dadada'} name={'menu-down-outline'}/>
														</View>
													</View>
													<View style={{flex: 1}} />
												</View>
											</>
									}
								</View>
							</View>
					
						</>
				}
			</View>
			<Modal orientation={orientation} visibility={scoreVisible} handleDismiss={() => setInitialState({...initialState, scoreVisible: !scoreVisible})}>
				<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginBottom: 5, flexDirection: 'row'}}>
					<View style={{width: 'auto'}}>
						<IonIcons size={40} color={'transparent'} name={'close'}/>
					</View>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
						<Text style={{fontSize: 20, fontWeight: 'bold'}}>Puntaje: <Text style={{color: score >= 25 ? '#49A958' : '#D02C2C'}}>{score}</Text></Text>
					</View>
					<TouchableOpacity style={{width: 'auto'}} onPress={() => setInitialState({...initialState, scoreVisible: !scoreVisible})}>
						<IonIcons size={40} color={'#000'} name={'close'}/>
					</TouchableOpacity>
				</View>
				<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginBottom: 5}}>
					<Image 
						style={{width: 120, height: 90}}
						source={require('./resources/assets/snake.png')}
						resizeMode={'contain'}
					/>
				</View>
				<TouchableOpacity style={{width: 'auto', paddingVertical: 8, marginTop: 5, backgroundColor: Blue, borderRadius: 6, justifyContent: 'center', alignItems: 'center'}} onPress={() => reset()}>
					<Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>Jugar de nuevo</Text>
				</TouchableOpacity>
			</Modal>
		</>
	)
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
	flex: 1,
  },
  controls: {
    width: 300,
    height: 300,
    flexDirection: 'column',
    marginTop: 40,
  },
  controlRow: {
    height: 70,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  control: {
    width: 70,
    height: 70,
    backgroundColor: Blue,
	justifyContent: 'center',
	alignItems: 'center'
  },
  scoreView: {
    flexDirection: 'row',
	paddingVertical: 8
  },
  scoreTxt: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  stdModalMainView: {
    height: 320,
    width: 360,
    backgroundColor: '#455A64',
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
  },
  nameInput: {
    fontSize: 25,
    fontWeight: 'bold',
    height: 50,
    width: 250,
    marginTop: 40,
    textAlign: 'center',
  },
  modalHaderTxt: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
  },
  stdModalBtn: {
    height: 50,
    width: 200,
    backgroundColor: 'blue',
    marginTop: 40,
    justifyContent: 'center',
    borderRadius: 40,
  },
  stdTxt: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
  },
});

AppRegistry.registerComponent('game', () => Game);
