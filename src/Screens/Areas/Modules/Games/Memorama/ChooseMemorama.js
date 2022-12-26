import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView} from 'react-native'
import {barStyle, barStyleBackground, Blue, SafeAreaBackground, Yellow} from '../../../../../colors/colorsApp'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { HeaderPortrait, HeaderLandscape } from '../../../../../components';
import { useNavigation, useOrientation, useScroll } from '../../../../../hooks';
import {memorama_utilities} from './Systems'
import { useFocusEffect } from '@react-navigation/native';

export default ({navigation, route: {params: {orientation, language}}}) => {
	const [contador, setContador] = useState(Math.random().toString())
	const [initialState, setInitialState] = useState({
		opc_1: memorama_utilities.opc_1,
		opc_2: memorama_utilities.opc_2,
		opc_3: memorama_utilities.opc_3,
		opc_4: memorama_utilities.opc_4,
		cards: memorama_utilities.cards,
		opcion: 1,
	})

	const {opc_1, opc_2, opc_3, opc_4, cards, opcion} = initialState
	
	const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });

	const {handleScroll, paddingTop, translateY} = useScroll(orientationInfo.initial)

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

	const Item = ({text, order, icon, color, opened, completed}) => {
		return(
			<View style={[styles.chooseItem, {backgroundColor: '#fff'}]}>
				{
					opened
					?
						<IonIcons name={icon} size={40} color={color}/>
					:
						<Image
							style={{width: 10, height: 10}}
							source={require('../../../../../../assets/logo.png')}
						/>
				}
			</View>
		)
	}

	const handleSelected = (tipo) => {
		const nuevas = cards.map(x => x.tipo === tipo ? ({...x, selected: true}) : ({...x, selected: false}))
		setInitialState({...initialState, cards: nuevas})
	}

	const Card = ({tipo, pares, selected, id}) => {
		return(
			selected
			?
				<View style={{height: 290, flex: 1, backgroundColor: 'rgba(50,131,197,.1)', borderWidth: 1, borderColor: Blue, justifyContent: 'center', alignItems: 'center', margin: 10}} onPress={() => !selected && handleSelected(tipo)}>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', marginVertical: 10}}>
						<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderRadius: 4}}>
							<Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>{tipo}</Text>
							<Text style={{fontSize: 12, fontWeight: 'normal', color: '#000'}}>{pares} pares</Text>
						</View>
					</View>
					<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
						<FlatList
							data={id === 1 ? opc_1 : id === 2 ? opc_2 : id === 3 ? opc_3 : opc_4}
							numColumns={id === 1 || id === 2 ? 4 : 5}
							renderItem={({item}) => <Item text={item.text} order={item.order} opened={item.opened} icon={item.icon} color={item.color} completed={item.completed}/>}
							keyExtractor={item => String(item.order)}
						/>
					</View>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', marginVertical: 10}}>
						{
							selected
							&&
								<TouchableOpacity onPress={() => navigation.navigate('Memorama', {nivel: tipo, meta: id === 1 ? opc_1 : id === 2 ? opc_2 : id === 3 ? opc_3 : opc_4, rows: id === 1 || id === 2 ? 4 : id === 3 || id === 4 && 5, seconds: id === 1 ? 2000 : id === 2 ? 3000 : id === 3 ? 4000 : 5000, id: id, orientation: orientation})}>
									<Animatable.View
										style={{width: 50, height: 50, backgroundColor: Blue, borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}
										animation='bounceIn'
										duration={1000}
									>
										<View>
											<IonIcons name={'gamepad-variant'} color={'#fff'} size={28}/>
										</View>
									</Animatable.View>
								</TouchableOpacity>
						}
					</View>
				</View>
			:
				<TouchableOpacity style={{height: 290, flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center', margin: 10}} onPress={() => !selected && handleSelected(tipo)}>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', marginVertical: 10}}>
						<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderRadius: 4}}>
							<Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>{tipo}</Text>
							<Text style={{fontSize: 12, fontWeight: 'normal', color: '#000'}}>{pares} pares</Text>
						</View>
					</View>
					<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
						<FlatList
							data={id === 1 ? opc_1 : id === 2 ? opc_2 : id === 3 ? opc_3 : opc_4}
							numColumns={id === 1 || id === 2 ? 4 : 5}
							renderItem={({item}) => <Item text={item.text} order={item.order} opened={item.opened} icon={item.icon} color={item.color} completed={item.completed}/>}
							keyExtractor={item => String(item.order)}
						/>
					</View>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', marginVertical: 10}}>
						{
							selected
							&&
								<Animatable.View
									style={{width: 50, height: 50, backgroundColor: 'transparent', borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}
									animation='bounceIn'
									duration={1000}
								>
									<View>
										<IonIcons name={'gamepad-variant'} color={'transparent'} size={28}/>
									</View>
								</Animatable.View>
						}
					</View>
				</TouchableOpacity>
			
		)
	}

  	return(
		<>
			<StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
			<SafeAreaView style={{flex: 0, backgroundColor: SafeAreaBackground }} />
			{
				orientationInfo.initial === 'PORTRAIT'
				?
					<HeaderPortrait title={'Seleccionar Nivel'} screenToGoBack={'Menu'} navigation={navigation} visible={true} translateY={translateY} />
				:
					<HeaderLandscape title={'Seleccionar Nivel'} screenToGoBack={'Menu'} navigation={navigation} visible={true} translateY={translateY} />
			}
			<ScrollView
				style={{flex: 1, backgroundColor: '#fff'}}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				/* onScroll={handleScroll}
				contentContainerStyle={{paddingTop: paddingTop}}	 */
			>
				<View style={[styles.selectionContainer, {padding: orientationInfo.initial === 'PORTRAIT' ? '3%' : '1.5%'}]}>
					<View style={{height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start', marginBottom: 15}}>
						<View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
							<IonIcons name={'information-outline'} color={Blue} size={32}/>
							<Text style={{marginLeft: 4, fontSize: 16, color: '#000', fontWeight: 'bold', color: '#000'}}>Selecciona el nivel que deseas jugar...</Text>
						</View>
					</View>
					<View style={{height: '100%', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
						<FlatList
							style={{height: 'auto', alignSelf: 'stretch'}}
							data={cards}
							numColumns={2}
							renderItem={({item}) => <Card selected={item.selected} tipo={item.tipo} pares={item.pares} id={item.id}/>}
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
		width: 20,
		height: 25,
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