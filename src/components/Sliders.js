import React, {useEffect, useState} from 'react'
import * as Animatable from 'react-native-animatable';
import {View, Image, ScrollView, Dimensions, Text, ImageBackground, TouchableOpacity, SafeAreaView} from  'react-native'
import {isIphone} from '../access/requestedData'
import {Blue, Orange} from '../colors/colorsApp'
const {width} = Dimensions.get('window')
const height = width * 0.6
let slide = undefined;
let show = true;
let move = undefined;

export default ({handleStart}) => {
	const [active, setActive] = useState(0)
	const [current, setCurrent] = useState(1)
	const [images, setImages] = useState([
		{
			id: 0,
			title: '',
			titleEsp: '¡BIENVENIDO!',
			titleIng: 'WELCOME!',
			subtitle: '',
			subtitleEsp: 'La app del mejor Contact Center de México está aquí para ayudarte.',
			subtitleIng: 'The app of the best Contact Center in Mexico is here to help you.',
			color: Orange,
			image: 'https://i.ibb.co/k1DXnT1/uno.png',
			active: 1,
			animation: 'fadeIn',
			subtitleAnimation: 'slideInRight',
			duration: 2500,
		},
		{
			id: 1,
			title: '',
			titleEsp: 'APLICA A NUESTRAS VACANTES',
			titleIng: 'APPLY TO OUR JOB OPENINGS',
			subtitle: '',
			subtitleEsp: 'En sólo 2 pasos podrás encontrar tu próxima oportunidad de empleo.',
			subtitleIng: 'You can find your next job opportunity with just two steps.',
			color: Blue,
			image: 'https://i.ibb.co/cCrHjWJ/dos.png',
			active: 0,
			animation: 'fadeIn',
			subtitleAnimation: 'slideInRight',
			duration: 2500,
		},
		{
			id: 2,
			title: '',
			titleEsp: '¿YA ERES PARTE DEL EQUIPO?',
			titleIng: 'ARE YOU ALREADY PART OF OUR TEAM?',
			subtitle: '',
			subtitleEsp: 'Tus métricas, bonos y mucha más información está disponible aquí para ti.',
			subtitleIng: 'All your metrics, bonuses and much more information available for you here.',
			color: '#000',
			image: 'https://i.ibb.co/CbShcXc/tres.png',
			active: 0,
			animation: 'fadeIn',
			subtitleAnimation: 'slideInRight',
			duration: 2500,
		},
		{
			id: 3,
			title: '',
			titleEsp: '¡EMPIEZA AHORA!',
			titleIng: 'START NOW!',
			subtitle: '',
			subtitleEsp: 'La mejor experiencia en el sector de Atención a Clientes te espera.',
			subtitleIng: 'The best experience in the Customer Service industry is waiting for you.',
			color: Blue,
			image: 'https://i.ibb.co/Hr4VNPG/cuatro.png',
			active: 0,
			animation: 'fadeIn',
			subtitleAnimation: 'slideInRight',
			duration: 2500,
		},
	])

	useEffect(() => {
		const nuevos = images.map(x => ({...x, subtitle: current === 1 ? x.subtitleEsp : x.subtitleIng, title: current === 1 ? x.titleEsp : x.titleIng}))
		setImages(nuevos)
	}, [current])

	const onSlide = ({nativeEvent}) => {
		let animation = null;
		let time = 0;
	 	slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
		if(slide < 4){
			//para saber si va a la izquierda o a la derecha
			if(slide >= active){
				move = 'slideInRight'
				time = 0;
				show = true;
			} else {
				show = false
				move = undefined
				time = 1000
				setTimeout(() => {
					show = true
				}, 1000)
			}
			const nuevos = images.map(x => x.id === slide ? ({...x, active: 1, subtitleAnimation: move}) : ({...x, active: 0, subtitleAnimation: move}))
			setImages(nuevos)
		}

		if(slide !== active) setActive(slide)
		if(slide >= 3) setActive(3)
	}

	const handleLanguage = (nuevo) => {
		setCurrent(nuevo)
	}

	return(
		<>
			<SafeAreaView style={{flex: 0, backgroundColor: 'transparent',}}/>
			<ImageBackground source={require('../../assets/background/fondo.jpg')} style={{width: '100%', height: '100%'}}>
				<View style={{height: 50, paddingVertical: 5, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
					<TouchableOpacity onPress={() => current !== 1 && handleLanguage(1)}>
						<Text style={{fontWeight: current === 1 ? 'bold' : 'normal', color: current === 1 ? '#000' : '#acacac', marginRight: 10}}>Español</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => current !== 2 && handleLanguage(2)}>
						<Text style={{fontWeight: current === 2 ? 'bold' : 'normal', color: current === 2 ? '#000' : '#acacac'}}>English (US)</Text>
					</TouchableOpacity>
				</View>
				<ScrollView
					style={{flex: 1, alignSelf: 'stretch'}}
					pagingEnabled
					onScroll={onSlide}
					scrollEventThrottle={0}
					showsHorizontalScrollIndicator={false}
					horizontal={true}
				>
					{
						images.map((image, index) => 
							<View
								style={{flex: 1}} key={index}
								animation={image.active ? image.animation : undefined}
								duration={image.duration}
							>
								<View style={{flex: .5}} />
								<Animatable.View 
									animation={image.active ? image.subtitleAnimation : undefined}
									duration={1000}
									style={{height: 'auto', width, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
									<Text style={{fontSize: isIphone ? 30 : 25, textAlign: 'center', color: image.color, fontFamily: 'basillion'}}>{image.title}</Text>
								</Animatable.View>
								<Animatable.View 
									animation={image.active ? image.subtitleAnimation : undefined}
									duration={1500} 
									style={{width, height: 400, justifyContent: 'center', alignItems: 'center', paddingBottom: 15, marginTop: isIphone ? 40 : 10}}>
									{/* <ImageBackground style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> */}
										{/* <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
											<BallIndicator color={Orange} size={35} />
										</View> */}
										<Image
											source={{uri: image.image}}
											style={{width: 300, height: 300, resizeMode: 'contain', zIndex: 1}}
										/>
									{/* </ImageBackground> */}
								</Animatable.View>
								<Animatable.View 
									animation={image.active ? image.subtitleAnimation : undefined}
									duration={2000}
									style={{height: 200, width, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20}}>
									<Text style={{fontSize: 22, color: '#000', textAlign: 'center'}}>{image.subtitle}</Text>
								</Animatable.View>
								<View style={{flex: .5}} />
							</View>
						)
					}
				</ScrollView>
				<View style={{flexDirection: 'row', position: 'absolute', bottom: isIphone ? 50 : 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 50, width}}>
					{
						images.map((image, index) =>
							<View style={{width: 30, height: 5, backgroundColor: index === active ? Orange : '#dadada', borderRadius: 10, marginRight: 10}} key={index}></View>	
						)
					}
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 5}}>
						{
							active < 3
							?
								<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => handleStart()}>
									<Text style={{fontSize: 20, fontWeight: 'bold', color: '#adadad'}}>{current === 1 ? 'Iniciar' : 'Start'}</Text>
								</View>
							:
								<TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => handleStart()}>
									<Text style={{fontSize: 20, fontWeight: 'bold', color: Orange}}>{current === 1 ? 'Iniciar' : 'Start'}</Text>
								</TouchableOpacity>
						}
					</View>
				</View>
			</ImageBackground>
		</>
	)
}