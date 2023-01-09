import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
import {selectOrientation} from '../slices/orientationSlice';

export default ({screen = '', value, index, total, ...rest}) => {
    const orientation = useSelector(selectOrientation)
    
    return (
        <>
            <Animatable.View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: orientation === 'PORTRAIT' ? (index % 2) === 1 ? 20 : 20 : 10, paddingRight: orientation === 'PORTRAIT' ? (index % 2) === 0 ? 20 : 20 : 0, paddingBottom: orientation === 'PORTRAIT' ? total === index || !index || ((total - 1) === index && (total % 2) === 0) ? 40 : 20 : 20, paddingTop: orientation === 'PORTRAIT' ? (index === 1 || index === 2) ? 40 : 20 : 20}} animation='bounceIn' duration={1500}>
                <TouchableOpacity style={styles.item} {...rest}>
                    <Text style={{marginBottom: 8, color: '#383838', fontSize: 15, fontWeight: 'normal'}}>{value}</Text>
                    <Image
                        style={[{width: screen === 'Betting' ? 45 : 40, height: value === 'Betting' ? 45 : 40}]}
                        resizeMode={'contain'}
                        source={
                            value === 'My Pre-payroll' || value === 'Mi Pre-nómina'
                            ? 
                                require('../../assets/designing/modules/check.png')
                            :
                                value === 'Nóminas' || value === 'Payroll'
                                ?
                                    require('../../assets/designing/modules/calculator.png')
                                :
                                    value === 'Gaceta' || value === 'Gazette'
                                    ?
                                        require('../../assets/designing/modules/gaceta.png')
                                    :
                                        value === 'Tickets'
                                        ?
                                            require('../../assets/designing/modules/tickets.png')
                                        :
                                            value === 'Vacation' || value === 'Vacaciones'
                                            ?
                                                require('../../assets/designing/modules/vacaciones.png')
                                            :
                                                value === 'Mis Checadas' || value === 'Check-ins'
                                                ?
                                                    require('../../assets/designing/modules/checadas.png')
                                                :
                                                    value === 'Estadísticos' || value === 'Statistics'
                                                    ?
                                                        require('../../assets/designing/modules/charts.png')
                                                    :
                                                        value === 'Quiniela' || value === 'Betting Game'
                                                        ?
                                                            require('../../assets/designing/modules/betting.png')
                                                        :
                                                            value === 'My Money'
                                                            ?
                                                                require('../../assets/designing/modules/money.png')
                                                            :
                                                                require('../../assets/designing/modules/unknow.png')



                        }
                    />
                </TouchableOpacity>
            </Animatable.View>
        </>
    );
}

const styles = StyleSheet.create({
    item_: {
        alignSelf: 'stretch',
        height: 135,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 25,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dadada',
    },
    item: {
        width: 135,
        height: 135,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#dadada',
        backgroundColor: 'rgba(255,255,255, 0.45)'
    },
})