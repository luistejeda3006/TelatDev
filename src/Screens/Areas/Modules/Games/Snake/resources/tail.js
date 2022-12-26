/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Constants from './constants';

export default (props) => {
    let tailList = props.elements.map((el, idx) => {
		return (
				<View
					key={idx}
					style={{
						width: props.size,
						height: props.size,
						position: 'absolute',
						left: el[0] * props.size,
						top: el[1] * props.size,
						backgroundColor: '#5FC46F',
						borderWidth: 1,
						borderColor: '#fff'
					}}
				/>
		);
    });

	return(
		<View
			style={{
				width: Constants.GRID_SIZE * props.size,
				height: Constants.GRID_SIZE * props.size,
			}}>
			{tailList}
		</View>
	)
}

const styles = StyleSheet.create({
	finger: {
		backgroundColor: '#5FC46F',
		position: 'absolute',
		marginHorizontal: 5
	},
});