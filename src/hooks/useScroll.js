import React, { useEffect, useState, useRef } from 'react'
import { Animated, Platform } from 'react-native'
import useOrientation from './useOrientation';

export default (orientation) => {
    const scrollY = new Animated.Value(0);
    const [paddingTop, setPaddingTop] = useState(Platform.OS === 'ios' ? 0 : orientation === 'PORTRAIT' ? 65 : 58)
    
    const {orientationInfo} = useOrientation({
        'isLandscape': false,
        'name': 'portrait-primary',
        'rotationDegrees': 0,
        'initial': orientation
    });

    const diffClamp = Animated.diffClamp(scrollY, 0, orientation === 'PORTRAIT' ? 65 : 58)
    const translateY = diffClamp.interpolate({
        inputRange:[0, orientation === 'PORTRAIT' ? 65 : 58],
        outputRange: [0, orientation === 'PORTRAIT' ? -65 : -58]
    })

    const translateYNumber = useRef();
    
    translateY.addListener(({value}) => {
        translateYNumber.current = value;
    });

    useEffect(() => {
        setPaddingTop(Platform.OS === 'ios' ? 0 : orientation === 'PORTRAIT' ? 65 : 58)
    }, [orientationInfo])


    const handleScroll = (e) => {
        scrollY.setValue(e.nativeEvent.contentOffset.y)
    }
    
    return {
        paddingTop,
        handleScroll,
        translateY,
    }
}