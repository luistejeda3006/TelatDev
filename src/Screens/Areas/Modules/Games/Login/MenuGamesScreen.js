import React, {useEffect, useState} from 'react'
import {Text, Image, View, TouchableOpacity, TouchableNativeFeedback, StyleSheet, ImageBackground, StatusBar, SafeAreaView, FlatList, ScrollView} from 'react-native'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {barStyle, barStyleBackground, Blue, LightBlue, Orange, SafeAreaBackground} from '../../../../../colors/colorsApp';
import {useNavigation} from '../../../../../hooks';
import * as Animatable from 'react-native-animatable';
import {memorama_utilities} from '../Memorama/Systems';
import {puzzle_utilities} from '../Puzzle/Systems';
import {BottomNavBar, Modal} from '../../../../../components';
import {useSelector} from 'react-redux';
import {selectOrientation} from '../../../../../slices/orientationSlice';
import {selectLanguageApp} from '../../../../../slices/varSlice';

export default ({navigation, route: {params: {origin = 1}}}) => {
	const orientation = useSelector(selectOrientation)
	const language = useSelector(selectLanguageApp)

	const [section, setSection] = useState(1)
	const [contador, setContador] = useState(0)
	const [animated, setAnimated] = useState(true)
	const [globalVisibility, setGlobalVisibility] = useState(false)
	const {handlePath} = useNavigation()

	useEffect(() => {
		navigation.closeDrawer()
	}, [orientation])

	useEffect(() => {
		setInitialState({...initialState, nivel_1: [], nivel_2: [], nivel_3: []})
		setAnimated(true)
		setTimeout(() => {
			setAnimated(false)
		}, 5250)
	}, [section])

	const [initialState, setInitialState] = useState({
        games: [
            {
                id: 1,
                mode: 'Memorama',
                screen: 'ChooseMemorama',
				selected: false,
				time: 500,
				image: 'https://i.pinimg.com/originals/24/b3/2e/24b32e53341202e5f52bf1609468fd05.jpg',
				niveles: [
					{
						id: 1,
						mode: 'Close',
						icon: '',
						selected: false,
						current: false,
					},
					{
						id: 2,
						mode: 'option',
						icon: 'earth',
						selected: true,
						current: false,
					},
					{
						id: 3,
						mode: 'Fácil',
						selected: false,
						current: false,
					},
					{
						id: 4,
						mode: 'Intermedio',
						selected: false,
						current: false,
					},
					{
						id: 5,
						mode: 'Difícil',
						selected: false,
						current: false,
					},
					{
						id: 6,
						mode: 'Avanzado',
						selected: false,
						current: false,
					},
				],
				torneos: [],
            },
            {
                id: 2,
                mode: 'Puzzle',
                screen: 'ChoosePuzzle',
                selected: false,
				time: 1000,
				image: 'https://i.pinimg.com/originals/9f/c2/5b/9fc25b1219200a94d4f090cc87318387.jpg',
				niveles: [],
				torneos: [
					{
						id: 1,
						name: 'Eliminatorias Telat Puzzle',
						time: 'Termina en 1d 16h',
						desc: 'Gana premios increibles, solo se uno de los primeros lugares.',
						lock: false,
						attemps: [
							{
								id: 1,
								played: true,
							},
							{
								id: 2,
								played: true,
							},
							{
								id: 3,
								played: false,
							},
						],
						screen: 'Puzzle',
						level: 1,
					},
				],
            },
            {
                id: 3,
                mode: 'Snake',
                screen: 'Snake',
                selected: false,
				time: 1500,
				image: 'https://i.pinimg.com/originals/9f/c2/5b/9fc25b1219200a94d4f090cc87318387.jpg',
				niveles: [],
				torneos: [],
            },
        ],
		nivel_1: [],
		nivel_2: [],
		nivel_3: [],
		winners: [
			{
				id: 5,
				position: '5th',
				name: 'Ventein',
				time: '00:00:0000',
				duration: 1000,
				errors: 0,
				backgroundColor: '#4084BB',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
			{
				id: 3,
				position: '3rd',
				name: 'Xocrus',
				time: '00:00:0000',
				duration: 3000,
				errors: 0,
				backgroundColor: '#2770AC',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
			{
				id: 1,
				position: '1st',
				name: 'bboysouw',
				time: '00:00:0000',
				duration: 5000,
				errors: 0,
				backgroundColor: '#0C538D',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
			{
				id: 2,
				position: '2nd',
				name: 'Xskas',
				time: '00:00:0000',
				duration: 4000,
				errors: 0,
				backgroundColor: '#246295',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
			{
				id: 4,
				position: '4th',
				name: 'Leviaty',
				time: '00:00:0000',
				duration: 2000,
				errors: 0,
				backgroundColor: '#2A79B9',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
		],
		winners_ordered: [
			{
				id: 1,
				position: '1st',
				name: 'bboysouw',
				time: '00:00:0000',
				duration: 5000,
				errors: 0,
				backgroundColor: '#0C538D',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
			{
				id: 2,
				position: '2nd',
				name: 'Xskas',
				time: '00:00:0000',
				duration: 4000,
				errors: 0,
				backgroundColor: '#246295',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
			{
				id: 3,
				position: '3rd',
				name: 'Xocrus',
				time: '00:00:0000',
				duration: 3000,
				errors: 0,
				backgroundColor: '#2770AC',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
			{
				id: 4,
				position: '4th',
				name: 'Leviaty',
				time: '00:00:0000',
				duration: 2000,
				errors: 0,
				backgroundColor: '#2A79B9',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
			{
				id: 5,
				position: '5th',
				name: 'Ventein',
				time: '00:00:0000',
				duration: 1000,
				errors: 0,
				backgroundColor: '#4084BB',
				image: 'https://previews.123rf.com/images/wowomnom/wowomnom1511/wowomnom151100037/48393049-vector-colorida-ilustraci%C3%B3n-de-modelo-de-la-vista-superior-del-cerebro-humano-sobre-fondo-blanco-el-.jpg?fj=1'
			},
		],
		global: [
			{id: 1, name: 'Daeboh', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 2, name: 'Billdy', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 3, name: 'Ushaje01', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 4, name: 'Balthemore', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 5, name: 'Andrew91', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 6, name: 'Sebas2', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 7, name: 'BastySL', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 8, name: 'Babelth', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 9, name: 'JonasHuy', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 10, name: 'Sparta23', record: {time: '00:00:0000', errors: null}, color: '#000'},
			{id: 128, name: 'bboysouw', record: {time: '00:00:0000', errors: null}, color: Blue},
		],
		temporal: undefined,
    })

	const {winners,winners_ordered, global, games, nivel_1, nivel_2, nivel_3, temporal} = initialState

	navigation.addListener('focus', async () => {
		setContador(contador + 1)
	});

	useEffect(() => {
		handlePath(parseInt(origin) === 1 ? 'Dashboard/' : 'AuthLogin')
	},[contador])

	const handleSelected = (id, game, has_lv1) => {
		const nuevos = has_lv1.map(x => x.mode === 'option' ? ({...x, mode: game}) : x)
		setInitialState({...initialState, nivel_1: nuevos, temporal: id})
	}
	
	const handleSelectedNivel_1 = (id, mode) => {
		const nuevos = nivel_1.map(x => x.mode === mode ? ({...x, current: true}) : ({...x, current: false}))
		setInitialState({...initialState, nivel_1: nuevos})
	}
	
	const handleTorneo = async (gameId, torneoId, lock, screen, level) => {
		//actualizamos estatus del torneo para poder jugarlo
		if(lock){
			//hacemos algo para desbloquearlo
		} else {
			if(screen === 'Memorama') navigation.navigate(screen, {nivel: memorama_utilities.cards[level - 1].tipo, meta: level === 1 ? memorama_utilities.opc_1 : level === 2 ? memorama_utilities.opc_2 : level === 3 ? memorama_utilities.opc_3 : memorama_utilities.opc_4, rows: level === 1 || level === 2 ? 4 : level === 3 || level === 4 && 5, seconds: level === 1 ? 2000 : level === 2 ? 3000 : level === 3 ? 4000 : 5000, id: level, orientation: orientation, enTorneo: '1'})
			else if(screen === 'Puzzle') navigation.navigate(screen, {nivel: puzzle_utilities.cards[level - 1].tipo, puntos: puzzle_utilities.cards[level - 1].puntos, meta: level === 1 ? puzzle_utilities.opc_1 : level === 2 ? puzzle_utilities.opc_2 : level === 3 ? puzzle_utilities.opc_3 : puzzle_utilities.opc_4, rows: level === 1 || level === 2 ? 4 : level === 3 || level === 4 && 5, seconds: level === 1 ? 2000 : level === 2 ? 3000 : level === 3 ? 4000 : 5000, id: level, orientation: orientation, enTorneo: '1'})
			else if(screen === 'Snake') navigation.navigate(screen, {language: language, orientation: orientation, enTorneo: '1'})
		}
	}

	const Niveles = ({id, mode ,icon, selected, current = false, niveles, handleBack = undefined, handleSelected = undefined}) => {
		return(
				selected
				?
					<Animatable.View 
						animation={undefined}
						duration={1000}
						onPress={() => {}} style={{width: 'auto', height: 40, paddingHorizontal: 6, backgroundColor: animated ? '#f7f7f7' : '#fff', justifyContent:  'center', alignItems: 'center', marginHorizontal: 8, borderRadius: 15, borderWidth: 1, borderColor: Blue, flexDirection: 'row'}}>
						{
							icon
							?
								<IonIcons name={icon} size={20} color={Blue} />
							:
								<></>
						}
						<Text style={{color: Blue, fontWeight: 'bold', marginLeft: 6}}>{mode}</Text>
					</Animatable.View>
				:
					mode === 'Close'
					?
						<Animatable.View 
							animation={undefined}
							duration={2500}>
								<TouchableOpacity onPress={() => handleBack()} style={{width: 40, height: 40, paddingHorizontal: 6, backgroundColor: animated ? '#f7f7f7' : '#fff', justifyContent:  'center', alignItems: 'center', marginHorizontal: 8, borderRadius: 25, borderWidth: 1, borderColor: '#dadada'}}>
									<IonIcons name={'arrow-left'} size={22} color={'#acacac'} />
								</TouchableOpacity>
						</Animatable.View>
					:
						<Animatable.View
							animation={undefined}
							duration={1000}
						>
							<TouchableOpacity onPress={() => handleSelected()} style={{width: 'auto', height: 40, paddingHorizontal: 6, backgroundColor: current ? Blue : animated ? '#f7f7f7' : '#fff', justifyContent:  'center', alignItems: 'center', marginHorizontal: 8, borderRadius: 15, borderWidth: 1, borderColor: '#dadada', flexDirection: 'row'}}>
								{
									icon
									?
										<IonIcons name={icon} size={20} color={current ? '#fff' : '#acacac'} />
									:
										<></>
								}
								<Text style={{color: current ? '#fff' : '#acacac', fontWeight: 'bold', marginLeft: 6}}>{mode}</Text>
							</TouchableOpacity>
						</Animatable.View>
		)
	}

	const Game = ({id, mode, time, niveles}) => {
		return(
			!animated
			?
				<TouchableOpacity onPress={() => handleSelected(id, mode, niveles)} style={{width: 'auto', height: 40, paddingHorizontal: 6, backgroundColor: animated ? '#f7f7f7' : '#fff', justifyContent:  'center', alignItems: 'center', marginHorizontal: 8, borderRadius: 15, borderWidth: 1, borderColor: '#dadada'}}>
					<Text style={{color: '#acacac', fontWeight: 'bold'}}>{mode}</Text>
				</TouchableOpacity>
			:
				<View onPress={() => handleSelected(id, mode, niveles)} style={{width: 'auto', height: 40, paddingHorizontal: 6, backgroundColor: animated ? '#f7f7f7' : '#fff', justifyContent:  'center', alignItems: 'center', marginHorizontal: 8, borderRadius: 15, borderWidth: 1, borderColor: '#dadada'}}>
					<Text style={{color: '#acacac', fontWeight: 'bold'}}>{mode}</Text>
				</View>
		)
	}

	const GlobalPodium = ({id, name, color}) => {
		return(
			<Animatable.View 
				duration={2500}	
				animation={animated ? 'fadeInDownBig' : undefined}
				style={{height: 35, alignSelf: 'stretch', borderBottomColor: '#dadada', borderBottomWidth: 1, marginBottom: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
			>
				<View style={{width: 40, height: 'auto', justifyContent: 'center', alignItems: 'center'}}>
					<Text style={{color: color, fontSize: 13, fontWeight: color === Blue ? 'bold' : 'normal'}}>{id}</Text>
				</View>
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
					<Text style={{color: color, fontSize: 14, fontWeight: color === Blue ? 'bold' : 'normal'}}>{name}</Text>
				</View>
				{
					id === 1 || id === 2 || id === 3
					?
					 	<View style={{width: 40, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
							<View style={{height: 25, width: 25, borderRadius: 20, backgroundColor: id === 1 ? 'gold' : id === 2 ? '#A8B4B9' : '#C36C3F', justifyContent: 'center', alignItems: 'center', paddingTop: 2}}>
								<IonIcons size={15} color={'#fff'} name={'trophy'}/>
							</View>
						 </View>
					:
					 	<></>
				}
			</Animatable.View>
		)
	}

	const TopPodium = ({id, position, duration, image, backgroundColor}) => {
		return(
			<Animatable.View 
				style={{height: 'auto', flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'stretch', paddingVertical: 0}}
				duration={duration}	
				animation={animated ? 'fadeInDownBig' : undefined}
			>
				<View style={{width: orientation === 'PORTRAIT' ? 45 : 55, height: orientation === 'PORTRAIT' ? 45 : 55, borderRadius: orientation === 'PORTRAIT' ? 25 : 35, backgroundColor: '#65c9ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Blue, marginBottom: 10}}>
					<Image
						style={{width: orientation === 'PORTRAIT' ? 40 : 50, height: orientation === 'PORTRAIT' ? 40 : 50, backgroundColor: 'transparent', borderRadius: 25}}
						resizeMode={'cover'} 
						source={require('../../../../../../assets/games/avatares/avatar_2.png')}
					/>
				</View>
				<View style={{height: id === 1 ? 175 : id === 2 ? 150 : id === 3 ? 125 : id === 4 ? 95 : 50, width: '65%', backgroundColor: backgroundColor, borderTopStartRadius: 10, borderTopEndRadius: 10, borderWidth: 1, borderColor: Blue, justifyContent: 'flex-end'}}>
					<View style={{height: 'auto', paddingVertical: 3, justifyContent: 'center', alignItems: 'center'}}>
						<Text style={{fontWeight: 'bold', color: '#fff'}}>{position}</Text>
					</View>
				</View>
			</Animatable.View>
		)
	}
	
	const BottomPodium = ({id, position, image, name, time, duration}) => {
		return(
			<Animatable.View 
				style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#fff', borderWidth: 1, borderColor: '#dadada', justifyContent: 'flex-start', alignItems: 'center', padding: 5, flexDirection: 'row', marginBottom: 20, borderRadius: 10}}
				duration={duration}	
				animation={animated ? 'fadeInRightBig' : undefined}
			>
				<View style={{width: 'auto', marginLeft: 15}}>
					<Text style={{fontSize: 14, fontWeight: 'bold'}}>{position}</Text>
				</View>
				<View style={{width: 35, height: 35, marginLeft: 15, backgroundColor: '#65c9ff', borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#dadada'}}>
					<Image
						style={{width: 30, height: 30, backgroundColor: 'transparent', borderRadius: 25}}
						resizeMode={'cover'}
						source={require('../../../../../../assets/games/avatares/avatar_2.png')}
					/>
				</View>
				<View style={{flex: 1, alignSelf: 'stretch', marginLeft: 15, justifyContent: 'center'}}>
					<Text style={{color: '#000', fontWeight: 'bold', fontSize:  14}}>{name}</Text>
					<Text style={{color: '#000', fontSize:  12}}>{time}</Text>
				</View>
			</Animatable.View>
		)
	}

	const Games = ({id, mode, screen, torneos, image}) => {
		return(
			<View style={{padding: 15}}>
				<ImageBackground /* source={require('../../../assets/perro.jpeg')} */ source={{uri: image}} resizeMode={'cover'} style={{width: '100%', height: 150}}>
					<View style={{height: 40, alignSelf: 'stretch', borderBottomColor: '#fff', backgroundColor: 'rgba(0,0,0,.5)', borderBottomWidth: 1, borderTopColor: '#fff', borderTopWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
						<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
							<View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
								<Text style={{fontSize: 17, color: '#fff', fontWeight: 'bold'}}>{mode}</Text>
							</View>
						</View>
					</View>
					<View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
						{
							torneos.length > 0
							?
								<>
									<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: 15}}>
										<TouchableNativeFeedback onPress={() => setGlobalVisibility(!globalVisibility)}>
											<View style={{height: 50, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderColor: '#fff', borderWidth: 2, borderRadius: 4, flexDirection: 'row', backgroundColor: Orange}}>
												<IonIcons name={'poll'} size={25} color={'#fff'} />
												<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 6}}>Ranking</Text>
											</View>
										</TouchableNativeFeedback>
									</View>
									<View style={{flex: 1, height: '60%', backgroundColor: 'rgba(0,0,0,.5)', padding: 4, justifyContent: 'center', alignItems:'center', borderRadius: 8}}>
										<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginBottom: 5}}>
											<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>Tu progreso</Text>
										</View>
										<FlatList
											showsVerticalScrollIndicator={false}
											showsHorizontalScrollIndicator={false}
											horizontal={true}
											style={{height: 'auto', flex: 1}}
											data={torneos[0].attemps}
											renderItem={({item}) =>
												<View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
													<View style={{width: 25, height: 25, borderRadius: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f1f1', marginRight: item.id === torneos[0].attemps.length ? 0 : 8}}>
														{
															item.played
															&&
															<IonIcons size={20} name={'close-thick'} color={'red'} />
														}
													</View>
												</View>
											}
											keyExtractor={item => String(item.id)}
										/>
									</View>
									<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: 15}}>
										<TouchableNativeFeedback onPress={() => handleTorneo(torneos[0].id, 0, torneos[0].lock, torneos[0].screen, torneos[0].level)}>
											<View style={{height: 50, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderColor: '#fff', borderWidth: 2, borderRadius: 4, flexDirection: 'row', paddingRight: 6, backgroundColor: LightBlue}}>
												<IonIcons name={'play-circle'} size={25} color={'#fff'} />
												<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 6}}>Jugar</Text>
											</View>
										</TouchableNativeFeedback>
									</View>
								</>
							:
								<>
									<View style={{flex: 1}}/>
									<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', paddingHorizontal: 15}}>
										<TouchableNativeFeedback onPress={() => navigation.navigate(screen)}>
											<View style={{height: 50, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderColor: '#fff', borderWidth: 2, borderRadius: 4, flexDirection: 'row', paddingRight: 6, backgroundColor: LightBlue}}>
												<IonIcons name={'play-circle'} size={25} color={'#fff'} />
												<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 6}}>Jugar</Text>
											</View>
										</TouchableNativeFeedback>
									</View>
									<View style={{flex: 1}}/>
								</>
						}
					</View>
				</ImageBackground>
			</View>
		)
	}

 	return(
		<>
			<StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
			<View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
				<View style={{height: 70,  alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', flexDirection: 'row'}}>
					<TouchableNativeFeedback onPress={() => navigation.openDrawer()}>
						<View style={{height: '100%', flex: 1, flexDirection: 'row', borderBottomColor: '#dadada', borderBottomWidth: 1}}>
							<View style={{width: 65, justifyContent: 'center', alignItems: 'center'}}>
								<View style={{width: 50, height: 50, backgroundColor: 'transparent', borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2FD443'}}>
									<Image
										style={{width: 40, height: 40, backgroundColor: 'transparent', borderRadius: 25}}
										resizeMode={'cover'}
										source={require('../../../../../../assets/games/avatares/avatar_3.png')}
									/>
								</View>
							</View>
							<View style={{flex: 1, height: '100%', justifyContent: 'center', paddingLeft: 10, borderRightWidth: 1, borderRightColor: '#dadada'}}>
								<Text style={{fontSize: 12, color: '#acacac'}}>Bienvenido</Text>
								<Text style={{fontSize: 13.5, color: '#000'}}>bboysouw</Text>
							</View>
						</View>
					</TouchableNativeFeedback>
					<View style={{width: orientation === 'PORTRAIT' ? 'auto' : 0, flex: orientation === 'PORTRAIT' ? 0 : 1, flexDirection: 'row'}}>
						{
							!animated
							?
								<TouchableNativeFeedback onPress={() => section !== 1 ? setSection(1) : {}}>
									<View style={{height: 70, width: orientation === 'PORTRAIT' ? 100 : 0, flex: orientation === 'PORTRAIT' ? 0 : 1,  borderBottomColor: section === 1 ? Blue : '#dadada', borderBottomWidth: section === 1 ? 3 : 1, borderRightWidth: 1, borderRightColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
										<IonIcons name={'gamepad-variant'} size={24} color={section === 1 ? Blue : '#acacac'} />
										<Text style={{color: section === 1 ? Blue : '#acacac', fontWeight: 'bold', marginLeft: 5, fontSize: 12}}>Juegos</Text>
									</View>
								</TouchableNativeFeedback>
							:
								<View style={{height: 70, width: orientation === 'PORTRAIT' ? 100 : 0, flex: orientation === 'PORTRAIT' ? 0 : 1,  borderBottomColor: section === 1 ? Blue : '#dadada', borderBottomWidth: section === 1 ? 3 : 1, borderRightWidth: 1, borderRightColor: '#dadada', justifyContent: 'center', alignItems: 'center'}}>
									<IonIcons name={'gamepad-variant'} size={24} color={section === 1 ? Blue : '#acacac'} />
									<Text style={{color: section === 1 ? Blue : '#acacac', fontWeight: 'bold', marginLeft: 5, fontSize: 12}}>Juegos</Text>
								</View>
						}
						<TouchableNativeFeedback onPress={() => section !== 2 ? setSection(2) : {}}>
							<View style={{height: 70, width: orientation === 'PORTRAIT' ? 100 : 0, flex: orientation === 'PORTRAIT' ? 0 : 1, borderBottomColor: section === 2 ? '#FFAC25' : '#dadada', borderBottomWidth: section === 2 ? 3 : 1, justifyContent: 'center', alignItems: 'center'}}>
								<IonIcons name={'trophy'} size={24} color={section === 2 ? '#FFAC25' : '#acacac'} />
								<Text style={{color: section === 2 ? '#FFAC25' : '#acacac', fontWeight: 'bold', marginLeft: 5, fontSize: 12}}>Ranking</Text>
							</View>
						</TouchableNativeFeedback>
					</View>
				</View>
				<View style={styles.container}>
					{
						section === 1 
						?
							<>
								<View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
									{/* <Carousel data={games} handleTorneo={handleTorneo} orientation={orientation} navigation={navigation}/> */}
									<FlatList
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
										style={{height: 'auto', alignSelf: 'stretch'}}
										data={games}
										renderItem={({item}) => <Games id={item.id} mode={item.mode} screen={item.screen} torneos={item.torneos} image={item.image}/> }
										keyExtractor={item => String(item.id)}
									/>
								</View>
							</>
						:
							<ScrollView 
								style={{flex: 1, alignSelf: 'stretch'}}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								>
								<View style={{height: 'auto', alignSelf: 'stretch'}}>
									<View style={{height: 'auto', alignSelf: 'stretch', marginVertical: 15}}>
										{
											nivel_1.length > 0
											?
												<FlatList
													showsVerticalScrollIndicator={false}
													showsHorizontalScrollIndicator={false}
													horizontal={true}
													style={{height: 'auto', alignSelf: 'stretch'}}
													data={nivel_1}
													renderItem={({item}) => <Niveles id={item.id} mode={item.mode} icon={item.icon} selected={item.selected} current={item.current} handleBack={() => setInitialState({...initialState, nivel_1: [], temporal: undefined})} handleSelected={() => handleSelectedNivel_1(item.id, item.mode)} />}
													keyExtractor={item => String(item.id)}
												/>												
											:
												<FlatList 
													showsVerticalScrollIndicator={false}
													showsHorizontalScrollIndicator={false}
													horizontal={true}
													style={{height: 'auto', alignSelf: 'stretch'}}
													data={games}
													renderItem={({item}) => <Game id={item.id} mode={item.mode} selected={item.selected} time={item.time} current={item.current} niveles={item.niveles}/>}
													keyExtractor={item => String(item.id)}
												/>
										}
									</View>
									<View style={{height: 'auto', alignSelf: 'stretch', marginTop: 10, borderBottomColor: '#adadad', borderBottomWidth: 1}}>
										<FlatList
											showsVerticalScrollIndicator={false}
											showsHorizontalScrollIndicator={false}
											style={{height: 'auto', alignSelf: 'stretch'}}
											data={winners}
											numColumns={5}
											renderItem={({item}) => <TopPodium position={item.position} image={item.image} backgroundColor={item.backgroundColor} id={item.id} duration={item.duration}/>}
											keyExtractor={item => String(item.id)}
										/>
									</View>
									<View style={{marginTop: 30, paddingHorizontal: 6}}>
										<FlatList
											showsVerticalScrollIndicator={false}
											showsHorizontalScrollIndicator={false}
											style={{height: 'auto', alignSelf: 'stretch'}}
											data={winners_ordered}
											numColumns={1}
											renderItem={({item}) => <BottomPodium position={item.position} duration={item.duration} image={item.image} backgroundColor={item.backgroundColor} id={item.id} name={item.name} time={item.time}/>}
											keyExtractor={item => String(item.id)}
										/>
									</View>
								</View>
							</ScrollView>
					}
				</View>
			</View>
			<Modal orientation={orientation} visibility={globalVisibility} handleDismiss={() => {
				setAnimated(true)
				setGlobalVisibility(!globalVisibility)}
			}>
				<View style={{height: 'auto', alignSelf: 'stretch'}}>
					<FlatList
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						style={{height: 'auto', alignSelf: 'stretch'}}
						data={global}
						renderItem={({item}) => <GlobalPodium id={item.id} name={item.name} color={item.color}/>}
						keyExtractor={item => String(item.id)}
					/>
				</View>
			</Modal>
			{
				origin === 1
				&&
					<BottomNavBar navigation={navigation} language={language} orientation={orientation} screen={3}/>
			}
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	}
})
