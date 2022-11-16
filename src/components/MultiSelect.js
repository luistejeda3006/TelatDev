import React, {useState} from 'react'
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

//este componente se tiene que hacer reutilizable
export default ({handleAddElement, information, label}) => {
    const [showList, setShowList] = useState(false);

    const Item = ({name, selected, id}) => {
        return(
            <TouchableOpacity style={{flex: 1, height: 'auto', borderColor: '#dadada', borderWidth: .8, flexDirection: 'row', paddingLeft: 4}} onPress={() => handleAddElement(name, id)}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'flex-start', paddingHorizontal: 8, flexDirection: 'row', height: '100%'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingVertical:8}}>
                            <Text style={{fontSize: 13, color: selected ? '#dadada' : '#000'}}>{name}</Text>
                        </View>
                        <View style={{width: 20, justifyContent: 'center', alignItems: 'center'}}>
                            <Icon name='check' size={15} color={selected ? '#dadada' : 'transparent'} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const Labels = ({name, selected, id}) => {
        return(
            <View style={{flex: 1, borderColor: '#dadada', height: 40, backgroundColor: '#f7f7f7', borderWidth: 1, flexDirection: 'row', paddingLeft: 4, margin: 1.5, borderRadius: 8}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'flex-start', paddingLeft: 8, flexDirection: 'row', height: '100%'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingVertical:8}}>
                            <Text style={{fontSize: 12, color: '#c1c1c1'}}>{name}</Text>
                        </View>
                        <TouchableOpacity style={{width: 30, justifyContent: 'center', alignItems: 'center'}} onPress={() => handleAddElement(name, id)}>
                            <Icon name='times' size={20} color={'#ff0000'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return(
        <>
            <View style={styles.container}>
                <TouchableOpacity style={styles.box} onPress={() => setShowList(!showList)}>
                    <View style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
                        <Text style={{fontSize: 15, color: '#000'}}>{label}</Text>
                    </View>
                    <Icon name={!showList ? 'caret-down' : 'times'} size={15} color='#000' />
                </TouchableOpacity>

                <View style={{height: 'auto', alignSelf: 'stretch'}}>
                    {
                        showList
                        &&
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={styles.list}
                                data={information}
                                numColumns={1}
                                renderItem={({item}) => <Item name={item.name} selected={item.selected} id={item.id}/>}
                                keyExtractor={item => String(item.id)}
                                key={'#_'}
                            />

                    }
                </View>
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                    {
                        !showList
                        &&
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={styles.list}
                                data={information.filter(x => x.selected && x)}
                                numColumns={3}
                                renderItem={({item}) => <Labels name={item.name} selected={item.selected} id={item.id}/>}
                                keyExtractor={item => String(item.id)}
                                key={'#_#'}
                            />
                    }
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        alignSelf: 'stretch',
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
        marginBottom: 5,
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 16
    },
    list:{
        height: 'auto',
        alignSelf: 'stretch',
    },
})