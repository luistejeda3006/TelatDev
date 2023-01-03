/* import React from 'react'
import {View, FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Blue } from '../../colors/colorsApp';
export default () => {
	const data = [
		{
			id: 1,
			nombre: 'LUIS MANUEL TEJEDA CANO',
			puesto: 'Programador',
			isExpanded: false,
			nodos: [
				{
					id: 2,
					nombre: 'RUFINA REYES SANCHEZ',
					puesto: 'Programador',
					nodos: [
						{
							id: 4,
							nombre: 'ALEXIA MORA HERNANDEZ',
							puesto: 'Docente',
							nodos: ''
						},
						{
							id: 5,
							nombre: 'CAMILA HERNANDEZ SABIETA',
							puesto: 'Contador',
							nodos: ''
						},
					]
				},
				{
					id: 3,
					nombre: 'JUAN MANUEL HERNANDEZ',
					puesto: 'Programador',
					nodos: ''
				},
			]
			
		}
	]

	const Item = ({nombre, puesto, isExpanded, nodos}) => {
		return(
			<>
				<TouchableOpacity style={{height: 'auto', padding: 6, backgroundColor: 'orange'}}>
					<Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>{nombre}</Text>
				</TouchableOpacity>
				{
					nodos
					&&
						nodos.map(x => (
							<>
								<TouchableOpacity style={{height: 'auto', padding: 6, backgroundColor: 'yellow'}}>
									<Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>{x.nombre}</Text>
								</TouchableOpacity>
								{
									x.nodos
									?
										x.nodos.map(y => (
											<View style={{height: 'auto', padding: 6, backgroundColor: 'pink'}}>
												<Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>{y.nombre}</Text>
											</View>
										))
									:
									<></>
								}
							</>
						))
				}
			</>
		)
	}

	const Tree = () => {
		return(
			<FlatList
				style={styles.list}
				data={data}
				numColumns={1}
				renderItem={({item}) => <Item nombre={item.nombre} puesto={item.puesto} isExpanded={item.isExpanded} nodos={item.nodos}/>}
				keyExtractor={item => String(item.id)}
			/>
		)
	}

	return(
		<View style={styles.container}>
			<Tree />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	}
})
 */

import React from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'
import tw from 'twrnc'

export default () => {
    return(
        <View style={tw`flex-1 justify-center items-center bg-white`}>
            
        </View>
    )
}
