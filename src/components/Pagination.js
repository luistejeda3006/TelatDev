import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native'
import { Blue } from '../colors/colorsApp'
import Icon from 'react-native-vector-icons/FontAwesome';
import InputFilter from './InputFilter';

export default ({data, Item, SearchInput = undefined, onChangeFilter, handleClean = () => {}, placeholder, property, handlePage = () => {}, current = 1, changing = undefined, temporal, handleTop = () => {}}) => {
    const [initialState, setInitialState] = useState({
        information: data,
        masterInformation: data,
        countPagination: Math.round(data.length / 10),
        currentPage: current,
        entries: 10,
        filter: '',
        random: 0,
    })

    const { filter, countPagination, currentPage, information, masterInformation, entries, random} = initialState

    useEffect(() => {
        if(data.length > 0){
            if(filter === ''){
                const etc = data.map((x,i,a) => x && ({...x, rango: i + 1}))
                const newData = etc.filter(x => x.rango > ((current - 1) * entries) && x.rango <= (current * entries))
                const isDecimal = String(etc.length / entries).includes('.')
                const split = String(etc.length / entries).split('.')
                setInitialState({ ...initialState, masterInformation: etc, countPagination: isDecimal ? parseInt(split[1]) < 5 ? (Math.round(etc.length / entries)) + 1 : Math.round(etc.length / entries) : Math.round(etc.length / entries), information: newData, filter: ''})
            } else {
                setInitialState({ ...initialState, information: temporal})
            }
        }
    }, [data, temporal])

    useEffect(() => {
        const newData = masterInformation.filter(x => x.rango <= (1 * entries))
        const isDecimal = String(data.length / entries).includes('.')
        const split = String(data.length / entries).split('.')
        setInitialState({ ...initialState, countPagination: isDecimal ? parseInt(split[1]) < 5 ? (Math.round(data.length / entries)) + 1 : Math.round(data.length / entries) : Math.round(data.length / entries), information: newData, filter: ''})
    }, [entries, random])

    const handleNextPage = useCallback(() => {
        handleTop()
        handlePage('+')
        const newData = masterInformation.filter(x => x.rango > ((current) * entries) && x.rango <= ((current + 1) * entries))
        setInitialState({ ...initialState, currentPage: current + 1, information: newData })
    })

    const handleBackPage = useCallback(() => {
        handleTop()
        handlePage('-')
        const newData = masterInformation.filter(x => x.rango > ((current - 2) * entries) && x.rango <= ((current - 1) * entries))
        setInitialState({ ...initialState, currentPage: current - 1, information: newData })
    })

    const handleLastPage = useCallback(() => {
        handleTop()
        handlePage('/', countPagination)
        const newData = masterInformation.filter(x => x.rango >= ((current - 1) * entries) && x.rango <= (current * entries))
        setInitialState({ ...initialState, information: newData, currentPage: countPagination })
    })

    const handleStartPage = useCallback(() => {
        handleTop()
        handlePage('/', 1)
        const newData = masterInformation.filter(x => x.rango <= entries)
        setInitialState({ ...initialState, information: newData, currentPage: 1 })
    })

    const handleFilterChange = (text) => {
        if (text) {
            const newData = masterInformation.filter(item => {
                const itemData = item[property] ? item[property].toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            });
            const fin = newData.filter(x => 1 <= (1 * entries))
            if (changing) changing(fin, text)
            setInitialState({ ...initialState, countPagination: Math.round(newData / entries), currentPage: 1, information: fin, temporaInformation: fin, filter: text })
        }
        else {
            setInitialState({...initialState, random: Math.random().toString()})
        }
    }

    return (
        <>
            {
                data.length > 10
                ?
                    <>
                    {
                        SearchInput
                        &&
                            <>
                                <View style={{marginTop: '1%'}}></View>
                                <InputFilter handleInputChange={(e) => handleFilterChange(e)} handleFilterChange={() => {
                                    onChangeFilter()
                                    setInitialState({...initialState, random: Math.random().toString()})
                                }} value={filter} currentFilter={placeholder} marginTop={true} marginBottom={true} handleClean={() => {
                                    setInitialState({...initialState, filter: '', random: Math.random().toString()})
                                    handleClean()    
                                }}/>
                            </>
                    }
                    </>
                :
                    <View style={{ marginTop: '3%' }}></View>
            }
            <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                data={information}
                numColumns={1}
                renderItem={({ item }) => <Item {...item} />}
                keyExtractor={item => String(item.id)}
            />
            {
                data.length > 10
                &&
                    <>
                        <View style={{ flexDirection: 'row', height: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                            {
                                currentPage > 1
                                ?
                                    <TouchableOpacity style={[styles.button, {paddingHorizontal: 14, height: 40, width: 40}]} onPress={() => handleBackPage()}>
                                        <Icon name='angle-left' size={20} color={Blue} />
                                    </TouchableOpacity>
                                :
                                    <View style={[styles.button, {paddingHorizontal: 14, height: 40, width: 40}]}>
                                        <Icon name='angle-left' size={20} color={'#adadad'} />
                                    </View>
                            }
                            {
                                currentPage > 3
                                &&
                                    <TouchableOpacity style={[styles.button, { backgroundColor: '#fff'}]} onPress={() => handleStartPage()}>
                                        <Text style={[styles.legend, { color: Blue }]}>1</Text>
                                    </TouchableOpacity>
                            }
                            {
                                currentPage > 2
                                &&
                                    <View style={styles.button}>
                                        <Text style={[styles.legend, { color: '#adadad' }]}>...</Text>
                                    </View>
                            }
                            {
                                currentPage > 1
                                &&
                                    <TouchableOpacity style={[styles.button, { backgroundColor: '#fff' }]} onPress={() => handleBackPage()}>
                                        <Text style={[styles.legend, { color: Blue }]}>{currentPage - 1}</Text>
                                    </TouchableOpacity>
                            }
                            {
                                countPagination > 1
                                ?
                                    <View style={[styles.button, { backgroundColor: Blue }]}>
                                        <Text style={[styles.legend, { color: '#fff' }]}>{currentPage}</Text>
                                    </View>
                                :
                                    <View style={[styles.button, { backgroundColor: Blue }]}>
                                        <Text style={[styles.legend, { color: '#fff' }]}>{currentPage}</Text>
                                    </View>
                            }
                            {
                                currentPage <= countPagination - 1
                                &&
                                    <TouchableOpacity style={[styles.button, { backgroundColor: '#fff' }]} onPress={() => handleNextPage()}>
                                        <Text style={[styles.legend, { color: Blue }]}>{currentPage + 1}</Text>
                                    </TouchableOpacity>
                            }
                            {
                                currentPage < countPagination - 1
                                &&
                                    <View style={styles.button}>
                                        <Text style={[styles.legend, { color: '#adadad' }]}>...</Text>
                                    </View>
                            }
                            {
                                currentPage < countPagination - 2
                                &&
                                    <TouchableOpacity style={[styles.button, { backgroundColor: '#fff' }]} onPress={() => handleLastPage()}>
                                        <Text style={[styles.legend, { color: Blue }]}>{countPagination}</Text>
                                    </TouchableOpacity>
                            }
                            {
                                currentPage < countPagination
                                ?
                                    <TouchableOpacity style={[styles.button, {paddingHorizontal: 14, height: 40, width: 40}]} onPress={() => handleNextPage()}>
                                        <Icon name='angle-right' size={20} color={Blue} />
                                    </TouchableOpacity>
                                :
                                    <View style={[styles.button, {paddingHorizontal: 14, height: 40, width: 40}]}>
                                        <Icon name='angle-right' size={20} color='#adadad' />
                                    </View>
                            }
                        </View>
                        <View style={{ marginBottom: '2%' }}></View>
                    </>
            }
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        height: 40,
        paddingHorizontal: 10,
        borderColor: '#dadada',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 4
    },
    legend: {
        fontSize: 14,
        color: Blue
    },
    list: {
        height: 'auto',
        alignSelf: 'stretch',
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        flexDirection: 'row',
        borderColor: '#CBCBCB',
        borderWidth: 1,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#000',
        fontSize: 15
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#CBCBCB',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        marginBottom: 10,
        height: 50,
        width: 'auto',
        paddingHorizontal: 8
    },
    title: {
        fontSize: 13,
        color: Blue,
    },
})