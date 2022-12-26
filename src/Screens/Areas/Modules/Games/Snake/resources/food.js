import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

export default (props) => {
	const x = props.position[0];
	const y = props.position[1];

	return (
		<View
			style={[
			styles.finger,
			{
				width: props.size,
				height: props.size,
				left: x * props.size,
				top: y * props.size,
			},
			]}
		/>
	)
}
  
const styles = StyleSheet.create({
	finger: {
		backgroundColor: '#EA563C',
		position: 'absolute',
		borderRadius: 25,
		borderWidth: 1,
		borderColor: '#dadada'
	},
});
