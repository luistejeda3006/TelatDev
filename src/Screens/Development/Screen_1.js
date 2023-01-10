import React, { useState } from 'react'
import {View, Text, TouchableOpacity, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import tw from 'twrnc'
import { Blue } from '../../colors/colorsApp'
import { selectOrientation } from '../../slices/orientationSlice'
import { selectLanguageApp } from '../../slices/varSlice'

export default () => {

    const language = useSelector(selectLanguageApp)
    const orientation = useSelector(selectOrientation)

    const [range, setRange] = useState({
        from: 1,
        until: 5
    })

    const {from, until} = range

    const [dias, setDias] = useState([
        {
            "id": 1,
            "dia": 1,
            "selected": false,
            "current": true,
        },
        {
            "id": 2,
            "dia": 2,
            "selected": false,
            "current": true,
        },
        {
            "id": 3,
            "dia": 3,
            "selected": false,
            "current": true,
        },
        {
            "id": 4,
            "dia": 4,
            "selected": false,
            "current": true,
        },
        {
            "id": 5,
            "dia": 5,
            "selected": false,
            "current": true,
        },
        {
            "id": 6,
            "dia": 6,
            "selected": false,
            "current": true,
        },
        {
            "id": 7,
            "dia": 7,
            "selected": false,
            "current": true,
        },
        {
            "id": 8,
            "dia": 8,
            "selected": false,
            "current": true,
        },
        {
            "id": 9,
            "dia": 9,
            "selected": false,
            "current": true,
        },
        {
            "id": 10,
            "dia": 10,
            "selected": true,
            "current": true,
        },
        {
            "id": 11,
            "dia": 11,
            "selected": false,
            "current": true,
        },
        {
            "id": 12,
            "dia": 12,
            "selected": false,
            "current": true,
        },
        {
            "id": 13,
            "dia": 13,
            "selected": false,
            "current": true,
        },
        {
            "id": 14,
            "dia": 14,
            "selected": false,
            "current": true,
        },
        {
            "id": 15,
            "dia": 15,
            "selected": false,
            "current": true,
        },
        {
            "id": 16,
            "dia": 16,
            "selected": false,
            "current": true,
        },
        {
            "id": 17,
            "dia": 17,
            "selected": false,
            "current": true,
        },
        {
            "id": 18,
            "dia": 18,
            "selected": false,
            "current": true,
        },
        {
            "id": 19,
            "dia": 19,
            "selected": false,
            "current": true,
        },
        {
            "id": 20,
            "dia": 20,
            "selected": false,
            "current": true,
        },
        {
            "id": 21,
            "dia": 21,
            "selected": false,
            "current": true,
        },
        {
            "id": 22,
            "dia": 22,
            "selected": false,
            "current": true,
        },
        {
            "id": 23,
            "dia": 23,
            "selected": false,
            "current": true,
        },
        {
            "id": 24,
            "dia": 24,
            "selected": false,
            "current": true,
        },
        {
            "id": 25,
            "dia": 25,
            "selected": false,
            "current": true,
        },
        {
            "id": 26,
            "dia": 26,
            "selected": false,
            "current": true,
        },
        {
            "id": 27,
            "dia": 27,
            "selected": false,
            "current": true,
        },
        {
            "id": 28,
            "dia": 28,
            "selected": false,
            "current": true,
        },
        {
            "id": 29,
            "dia": 29,
            "selected": false,
            "current": true,
        },
        {
            "id": 30,
            "dia": 30,
            "selected": false,
            "current": true,
        },
        {
            "id": 31,
            "dia": 31,
            "selected": false,
            "current": true,
        },
        {
            "id": 131,
            "dia": 1,
            "selected": false,
            "current": false,
        },
        {
            "id": 132,
            "dia": 2,
            "selected": false,
            "current": false,
        },
        {
            "id": 133,
            "dia": 3,
            "selected": false,
            "current": false,
        },
        {
            "id": 134,
            "dia": 4,
            "selected": false,
            "current": false,
        },
        {
            "id": 135,
            "dia": 5,
            "selected": false,
            "current": false,
        },
        {
            "id": 136,
            "dia": 6,
            "selected": false,
            "current": false,
        },
        {
            "id": 137,
            "dia": 7,
            "selected": false,
            "current": false,
        },
        {
            "id": 138,
            "dia": 8,
            "selected": false,
            "current": false,
        },
        {
            "id": 139,
            "dia": 9,
            "selected": false,
            "current": false,
        },
        {
            "id": 140,
            "dia": 10,
            "selected": false,
            "current": false,
        },
        {
            "id": 141,
            "dia": 11,
            "selected": false,
            "current": false,
        }
    ])

    const Mes = ({day}) => {
        return (
            <View style={tw`flex-1 h-12.5 justify-center items-center`}>
                <Text style={tw`font-bold text-black`}>{day}</Text>
            </View>
        )
    }

    const handlePress = (id) => {
        const nuevos = dias.map(x => x.id === id ? ({...x, selected: !x.selected}) : x)
        setDias(nuevos)
    }

    return(
        <View style={tw`flex-1 justify-center items-center`}>
            <View style={tw`flex-row border-b border-b-[#dadada] bg-[#f7f7f7]`}>
                <Mes day={language === '1' ? 'Dom' : 'Sun'}/>
                <Mes day={language === '1' ? 'Lun' : 'Mon'}/>
                <Mes day={language === '1' ? 'Mar' : 'Tue'}/>
                <Mes day={language === '1' ? 'Mie' : 'Wed'}/>
                <Mes day={language === '1' ? 'Jue' : 'Thu'}/>
                <Mes day={language === '1' ? 'Vie' : 'Fri'}/>
                <Mes day={language === '1' ? 'Sáb' : 'Sat'}/>
            </View>
            <View style={tw`h-auto self-stretch border-b border-b-[#dadada] bg-white`}>
                <FlatList
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={tw`h-auto self-stretch bg-white`}
                    data={dias}
                    numColumns={7}
                    renderItem={({item}) => 
                        item.current
                        ?
                            <TouchableOpacity style={tw`flex-1 h-12.5 justify-center items-center`} onPress={() => handlePress(item.id)}>
                                <View style={[tw`border border-[rgba(249,249,249,0.1)]'} w-[100%] h-9 justify-center items-center`]}>
                                    <View style={tw`w-7 h-7 justify-center items-center rounded-3xl ios:pl-px`}>
                                        <Text style={tw`text-[#000] text-sm`}>{item.dia}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        :
                            <View style={tw`flex-1 h-12.5 justify-center items-center`}>
                                <Text style={tw`text-[#adadad] text-sm`}>{item.dia}</Text>
                            </View>
                    }
                    keyExtractor={item => String(item.id)}
                />
            </View>
        </View>
    )
}