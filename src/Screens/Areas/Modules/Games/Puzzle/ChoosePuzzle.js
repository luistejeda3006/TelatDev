import React, {useState, useCallback} from 'react'
import {View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground} from '../../../../../colors/colorsApp'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {HeaderLandscape, HeaderPortrait} from '../../../../../components';
import {useNavigation} from '../../../../../hooks';
import {puzzle_utilities} from './Systems'
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectOrientation} from '../../../../../slices/orientationSlice';
import {selectLanguageApp} from '../../../../../slices/varSlice';

export default ({navigation, route: {params: {origin}}}) => {
	const orientation = useSelector(selectOrientation)
	const language = useSelector(selectLanguageApp)

	const [initialState, setInitialState] = useState({
		opc_1: puzzle_utilities.opc_1,
		opc_2: puzzle_utilities.opc_2,
		opc_3: puzzle_utilities.opc_3,
		opc_4: puzzle_utilities.opc_4,
		cards: puzzle_utilities.cards,
		opcion: 1,
	})

	const {opc_1, opc_2, opc_3, opc_4, cards, opcion} = initialState

	const {handlePath} = useNavigation()

	useFocusEffect(
        useCallback(() => {
            handlePath('Menu')
        }, [])
    );

	const ChooseItem = ({text, order}) => {
		return(
			<View style={[styles.chooseItem, {backgroundColor: text ? '#fff' : '#eee'}]}>
				<Text style={styles.chooseItemText}>{text}</Text>
			</View>
		)
	}

	const handleSelected = (tipo) => {
		const nuevas = cards.map(x => x.tipo === tipo ? ({...x, selected: true}) : ({...x, selected: false}))
		setInitialState({...initialState, cards: nuevas})
	}

	const Card = ({selected, puntos, tipo, id}) => {
		return(
			selected
			?
				<View style={{height: 290, flex: 1, backgroundColor: 'rgba(50,131,197,.1)', borderWidth: 1, borderColor: Blue, justifyContent: 'center', alignItems: 'center', margin: 10}} onPress={() => !selected && handleSelected(tipo)}>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch'}}>
						<View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 4}}>
							<Animatable.View 
								animation='bounceIn'
								duration={1000}
								style={{backgroundColor: Blue, borderRadius: 6, padding: 4}}
							>
								<Text style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}>Puntos: {puntos}</Text>
							</Animatable.View>
						</View>
						<View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderRadius: 4}}>
							<Text style={{fontSize: 16, fontWeight: 'bold'}}>{tipo}</Text>
						</View>
					</View>
					<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
						<FlatList
							data={id === 1 ? opc_1 : id === 2 ? opc_2 : id === 3 ? opc_3 : opc_4}
							numColumns={4}
							renderItem={({item}) => <ChooseItem text={item.text} order={item.order}/>}
							keyExtractor={item => String(item.order)}
						/>
					</View>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch'}}>
						{
							<TouchableOpacity onPress={() => navigation.navigate('Puzzle', {nivel: tipo, puntos: puntos, meta: id === 1 ? opc_1 : id === 2 ? opc_2 : id === 3 ? opc_3 : opc_4, orientation: orientation})}>
								{
									selected
									&&
										<Animatable.View
											style={{width: 50, height: 50, backgroundColor: Blue, borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}
											animation='bounceIn'
											duration={1000}
										>
											<View>
												<IonIcons name={'gamepad-variant'} color={'#fff'} size={28}/>
											</View>
										</Animatable.View>
								}
							</TouchableOpacity>
						}
					</View>
				</View>
			:
				<TouchableOpacity style={{height: 290, flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center', margin: 10}} onPress={() => handleSelected(tipo)}>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{fontSize: 16, fontWeight: 'bold'}}>{tipo}</Text></View>
					<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
						<FlatList
							data={id === 1 ? opc_1 : id === 2 ? opc_2 : id === 3 ? opc_3 : opc_4}
							numColumns={4}
							renderItem={({item}) => <ChooseItem text={item.text} order={item.order}/>}
							keyExtractor={item => String(item.order)}
						/>
					</View>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch'}}>
						
					</View>
				</TouchableOpacity>
		)
	}

  	return(
		<>
			<StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			<SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground}} />
			{
				orientation === 'PORTRAIT'
				?
					<HeaderPortrait title={'Seleccionar Nivel'} screenToGoBack={'Menu'} navigation={navigation} visible={true} />
				:
					<HeaderLandscape title={'Seleccionar Nivel'} screenToGoBack={'Menu'} navigation={navigation} visible={true} />
			}
			<ScrollView
				style={{flex: 1, backgroundColor: '#fff'}}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
					<View style={[styles.selectionContainer, {padding: orientation === 'PORTRAIT' ? '3%' : '1.5%'}]}>
						<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start', marginBottom: 15}}>
							<View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
								<IonIcons name={'information-outline'} color={Blue} size={32}/>
								<Text style={{marginLeft: 4, fontSize: 16, color: '#000', fontWeight: 'bold'}}>Selecciona una opción para armar...</Text>
							</View>
						</View>
						<View style={{height: '100%', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
							<FlatList
								style={{height: 'auto', alignSelf: 'stretch'}}
								data={cards}
								numColumns={2}
								renderItem={({item}) => <Card selected={item.selected} puntos={item.puntos} tipo={item.tipo} id={item.id}/>}
								keyExtractor={item => String(item.tipo)}
							/>
						</View>
					</View>
			</ScrollView>
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
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#fff',
		padding: '3%'

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
		width: 30,
		height: 30,
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
		fontSize: 12,
		color: '#000',
		fontWeight: 'bold'
	}
})