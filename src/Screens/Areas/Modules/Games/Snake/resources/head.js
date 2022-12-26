import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

export default (props) => {
	const x = props.position[0];
	const y = props.position[1];
	return(
		<View
			style={[styles.finger, {width: props.size, height: props.size, left: x * props.size, top: y * props.size, borderWidth: 1, borderColor: '#fff'},
		]}
		/>
	);
}

const styles = StyleSheet.create({
	finger: {
		backgroundColor: '#49A958',
		position: 'absolute',
	},
});