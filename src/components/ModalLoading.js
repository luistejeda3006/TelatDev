import React from "react";
import {StyleSheet, View, Modal} from "react-native";
import {BallIndicator} from 'react-native-indicators';
import {Orange} from "../colors/colorsApp";

export default ({visibility}) => {
    return (
        <Modal animationType='fade' transparent={true} visible={visibility}>
            <View style={styles.center}>
                <View style={[styles.modal,{width: '100%', backgroundColor: 'transparent'}]}>
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                      	<BallIndicator color={Orange} size={35} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.3)",
	},

	modal: {
		padding: 15,
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 4,
		shadowColor: "#000",
		shadowOffset: {
			height: 0,
			width: 3,
		},
	},
});