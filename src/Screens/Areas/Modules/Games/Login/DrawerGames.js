import React, { useEffect, useState } from 'react'
import {StatusBar, SafeAreaView, StyleSheet, View, TouchableWithoutFeedback, Text, FlatList, Image, TouchableOpacity, TouchableNativeFeedback, ScrollView, Alert} from 'react-native'
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { barStyle, barStyleBackground, Blue, Orange, SafeAreaBackground } from '../../../../../colors/colorsApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOrientation } from '../../../../../hooks';
import { useSelector } from 'react-redux';
import { selectOrientation } from '../../../../../slices/orientationSlice';

const Option = 'Option'
const Personaje = 'Personaje'

export default (props) => {
    const orientation = useSelector(selectOrientation)

    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)

    const language = '1'
    const Imagen = ({id, selected, tipo}) => {
		return(
			<Image
				style={{width: tipo === 2 ? selected ? 70 : 60 : 90, height: tipo === 2 ? selected ? 70 : 60 : 90, backgroundColor: 'transparent', borderRadius: tipo === 2 ? 0 : 75}}
				source={
					id === 1
                    ?
						require('../../../../../../assets/games/avatares/avatar_1.png')
                    :
                        id === 2
                        ?
                            require('../../../../../../assets/games/avatares/avatar_2.png')
                        :
                            id === 3
                            ?
                                require('../../../../../../assets/games/avatares/avatar_3.png')
                            :
                                id === 4
                                ?
                                    require('../../../../../../assets/games/avatares/avatar_4.png')
                                : 
                                    id === 5
                                    ?
                                        require('../../../../../../assets/games/avatares/avatar_5.png')
                                    :
                                        id === 6
                                        ?
                                            require('../../../../../../assets/games/avatares/avatar_6.png')
                                        :
                                            id === 7
                                            ?
                                                require('../../../../../../assets/games/avatares/avatar_7.png')
                                            :
                                                require('../../../../../../assets/games/avatares/avatar_8.png')
				}
				resizeMode={'cover'}
			/>
		)
	}
    
    const [initialState, setInitialState] = useState({
        avatares: [
            {id: 1, selected: false},
            {id: 2, selected: false},
            {id: 3, selected: false},
            {id: 4, selected: false},
            {id: 5, selected: false},
            {id: 6, selected: false},
            {id: 7, selected: false},
            {id: 8, selected: false},
        ],
        games: [
            {id: 1, game: 'Memorama', total: 14},
            {id: 2, game: 'Puzzle', total: 54},
            {id: 3, game: 'Snake', total: 250},
        ],
        torneos: [
            {id: 1, name: 'Ultimate Cup', game: 'Puzzle', suscribed: true, hide: false, fecha: '10/10/2022 - 15/10/2022', desc: 'Torneo en beneficio de las personas desamparadas, sin hogar.'},
            {id: 2, name: 'Category Master', game: 'Snake', suscribed: true, hide: false, fecha: '10/10/2022 - 15/10/2022', desc: 'Juega en nuestra dinamica y participa para ganar una bicicleta de montaña.'},
            {id: 3, name: 'Carvana Day', game: 'Memorama', suscribed: false, hide: false, fecha: '10/10/2022 - 15/10/2022', desc: 'Torneo en beneficio de las personas desamparadas, para el memorama.'},
        ],
        temporal: 1,
        edit: false,
    })

    const {avatares, games, torneos, temporal, edit} = initialState

    const getAvatar = async () => {
        let id = 0;
        id = await AsyncStorage.getItem(Personaje) || 1;
        const selected = avatares.map(x => x.id === parseInt(id) ? ({...x, selected: true}) : x)
        setInitialState({...initialState, temporal: parseInt(id), avatares: selected})
    }

    useEffect(() => {
        getAvatar()
    },[])

    const handleSelected = async (id) => {
        if(temporal !== id){
            const nuevos = avatares.map(x => x.id === id ? ({...x, selected: !x.selected}) : ({...x, selected: false}))
            await AsyncStorage.setItem(Personaje, String(id));
            setInitialState({...initialState, avatares: nuevos, temporal: id, edit: !edit})
        }
    }

    const Avatar = ({id, selected}) => {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: '100%', height: 100, justifyContent: 'center', alignItems: 'center'}}>
                    {
                        edit
                        ?
                            <TouchableOpacity onPress={() => handleSelected(id)} style={{width: (selected && edit) ? '80%' : '70%', backgroundColor: '#fff', height: (selected && edit) ? '80%' : '70%', borderWidth: (selected && edit) ? 2 : 1, borderColor: (selected && edit) ? Blue : '#dadada', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Imagen id={id} selected={selected} tipo={2}/>
                            </TouchableOpacity>
                        :
                            <View onPress={() => handleSelected(id)} style={{width: selected ? '80%' : '70%', backgroundColor: '#f2f2f2', height: selected ? '80%' : '70%', borderWidth: selected ? 2 : 1, borderColor: selected ? Blue : '#dadada', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Imagen id={id} selected={selected} tipo={2}/>
                            </View>
                    }
                </View>
            </View>
        )
    }

    const Torneo = ({id, name, game, suscribed, hide, fecha, desc}) => {
        return(
            <TouchableWithoutFeedback onPress={() => handleHide(id, suscribed)}>
                <View style={{height: 'auto', flex: 1, borderWidth: 1, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, borderRadius: 10, padding: 10, marginBottom: 15}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'stretch'}}>
                            <Text style={{color: suscribed ? Blue : '#000', fontWeight: 'bold', fontSize: 15}}>{name}<Text>  |  <Text>{game}</Text></Text></Text>
                        </View>
                        <View style={{width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                            <IonIcons name={suscribed ? hide ? 'chevron-up' : 'chevron-down' : 'lock'} size={25} color={suscribed ? Blue : '#000'} />
                        </View>
                    </View>
                    {
                        hide
                        &&
                            <View style={{height: 'auto', justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'stretch', marginTop: 5}}>
                                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                                    <Text style={{color: '#c1c1c1', fontWeight: 'bold'}}>Descripción: <Text style={{fontWeight: 'normal'}}>{desc}</Text></Text>
                                </View>
                                <View style={{height: 'auto', alignSelf: 'stretch', alignItems: 'flex-start', marginVertical: 10}}>
                                    <Text style={{color: '#c1c1c1', fontWeight: 'bold', fontSize: 12}}>Vigencia: <Text style={{fontWeight: 'normal'}}>{fecha}</Text></Text>
                                </View>
                                <TouchableOpacity style={{height: 'auto', alignSelf: 'stretch', paddingVertical: 6, backgroundColor: Blue, borderWidth: 1, borderColor: '#dadada', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 5, flexDirection: 'row', marginBottom: 5}}>
                                    <IonIcons name={'trophy'} size={20} color={'#fff'} />
                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff', marginLeft: 8}}>Jugar torneo</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
            </TouchableWithoutFeedback>
        )
    }

    const Game = ({game, total}) => {
        return(
            <View style={{height: 30, alignSelf: 'stretch', marginLeft: 10, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={{fontSize: 12, fontWeight: 'normal', color: '#acacac', fontWeight: 'bold'}}>{game}: <Text style={{color: Blue, fontWeight: 'bold'}}>{total}</Text></Text>
            </View>
        )
    }

    const handleHide = (id, suscribed) => {
        if(suscribed){
            const nuevos = torneos.map(x => x.id === id ? ({...x, hide: !x.hide}) : ({...x, hide: false}))
            setInitialState({...initialState, torneos: nuevos})
        } else {
            Alert.alert(language === '1' ? 'Desbloquear Torneo' : 'Unlock Tournament',
            language === '1' ? '¿Seguro que deseas desbloquear el torneo?' : 'Are you sure you want to unlock the tournament?', 
            [
                {
                    text: language === '1' ? 'Cancelar' : 'Cancel',
                    onPress: () => null,
                    style: 'cancel'
                },
                { text: language === '1' ? 'Sí' : 'Yes', onPress: () => handleUnlock(id)}
            ]);
        }
    }

    const handleUnlock = (id) => {
        //seria un metodo de la api para actualizar el estado, mientras estarà temporal
        const nuevos = torneos.map(x => x.id === id ? ({...x, suscribed: true}) : x)
        setInitialState({...initialState, torneos: nuevos})
    }

    const handleConfirm = (tipo) => {
        const Logged = () => {
            props.navigation.closeDrawer()
            props.navigation.navigate('Logged')
        }

        const Unlogged = () => {
            props.navigation.closeDrawer()
            props.navigation.navigate('AuthLogin')
        }

        Alert.alert(
            tipo === 1 ? language === '1' ? 'Abandonar' : 'Leave' : language === '1' ? 'Cerrar Sesión' : 'Sign Out',
            tipo === 1 ? language === '1' ? '¿Seguro que deseas abandonar Juegos?' : 'Are you sure you want to leave Games?' : language === '1' ? '¿Seguro que deseas cerrar tu sesión?' : 'Are you sure you want to close the session?', 
        [
            {
                text: 'Cancelar',
                onPress: () => null,
                style: 'cancel'
            },
            { text: language === '1' ? 'Sí' : 'Yes', onPress: () => tipo === 1 ? Logged() : Unlogged()}
        ]);
    }

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor={barStyleBackground} />
            <SafeAreaView style={{ flex: 0, backgroundColor: SafeAreaBackground }} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{height: 'auto', alignSelf: 'stretch', backgroundColor: '#fff'}}
            >

                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{ borderRadius: 30, overflow: 'hidden'}}>
                            <TouchableNativeFeedback onPress={() => props.navigation.closeDrawer()}>
                                <View style={{height: 'auto', alignSelf: 'stretch', padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                                    <IonIcons name={'arrow-left'} size={30} color={Blue} />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 5, color: '#000'}}>Gestionar Perfiles</Text>
                    </View>
                    <View style={{height: 'auto', alignSelf: 'stretch', paddingHorizontal: 10, paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: '#dadada', flexDirection: 'row'}}>
                        <View style={{width: 'auto', alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{width: 95, height: 95, borderRadius: 75, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#dadada'}}>
                                <Imagen id={temporal} tipo={1}/>
                            </View>
                            <TouchableWithoutFeedback onPress={() => setInitialState({...initialState, edit: !edit})}>
                                <View style={{width: 30, height: 30, position: 'absolute', backgroundColor: Blue, borderRadius: 25, bottom: 30, right: 10, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                    <IonIcons name={!edit ? 'lead-pencil' : 'close-thick'} size={16} color={'#fff'} />
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={{height: 'auto', width: 120, justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                                <Text style={{fontWeight: 'bold', fontSize: 13, color: '#000'}}>bboysouw</Text>
                            </View>
                        </View>
                        {/* <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 0}}>
                            <View style={{height: 'auto', paddingVertical: 2, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10}}>
                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>Partidas Jugadas Totales: <Text style={{color: Blue, fontWeight: 'bold'}}>1502</Text></Text>
                            </View>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={{height: 'auto', alignSelf: 'stretch'}}
                                data={games}
                                numColumns={1}
                                renderItem={({item}) => <Game id={item.id} game={item.game} total={item.total}/>}
                                keyExtractor={item => String(item.id)}
                            />
                        </View> */}
                    </View>

                    <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 10}}>
                        <View style={{height: 30, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                            <Text style={{color: '#000', fontWeight: 'bold', fontSize: 15}}>Seleccionar personaje</Text>
                        </View>
                        {
                            orientation === 'PORTRAIT'
                            ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={{height: 'auto', alignSelf: 'stretch'}}
                                    data={avatares}
                                    numColumns={4}
                                    renderItem={({item}) => <Avatar id={item.id} selected={item.selected}/>}
                                    keyExtractor={item => String(item.id)}
                                    key={'_1'}
                                    />
                                :
                                    <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={{height: 'auto', alignSelf: 'stretch'}}
                                    data={avatares}
                                    numColumns={8}
                                    renderItem={({item}) => <Avatar id={item.id} selected={item.selected}/>}
                                    keyExtractor={item => String(item.id)}
                                    key={'_2'}
                                />

                        }
                    </View>
                    <View style={{height: 'auto', alignSelf: 'stretch', marginBottom: 10, paddingHorizontal: 10}}>
                        <View style={{height: 30, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                            <Text style={{color: '#000', fontWeight: 'bold', fontSize: 15}}>Torneos Disponibles</Text>
                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={{height: 'auto', alignSelf: 'stretch'}}
                            data={torneos}
                            numColumns={1}
                            renderItem={({item}) => <Torneo id={item.id} name={item.name} game={item.game} suscribed={item.suscribed} hide={item.hide} fecha={item.fecha} desc={item.desc}/>}
                            keyExtractor={item => String(item.id)}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={{height: 'auto', justifyContent: 'flex-end', backgroundColor: '#fff', borderTopColor: '#dadada', borderTopWidth: 1.5, marginBottom: isIphone ? 15 : 0}}>
                <View style={{height: orientation === 'PORTRAIT' ? 85 : 60, marginHorizontal: 15, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity style={{backgroundColor: Orange, height: orientation === 'PORTRAIT' ? 55 : 40, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderRadius: 12, flexDirection: 'row'}} onPress={() => props.origin === 1 ? handleConfirm(1) : handleConfirm(2)}>
                        <IonIcons name={'logout'} size={25} color='#fff' />
                        <Text style={{fontSize: 15, color: '#fff', fontWeight: 'bold', marginLeft: 8}}>{props.origin === 1 ? 'Salir' : 'Cerrar Sesión'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({ 
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 5,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
        color: '#000'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        color: '#fff'
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 10,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        shadowColor: 'transparent'
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },
    gradient: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});