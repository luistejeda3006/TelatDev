import React, {useState, useRef} from 'react'
import {View, Text, Platform, TouchableOpacity} from 'react-native'
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import { Blue } from '../colors/colorsApp';

export default ({handleInputChange}) => {
    const richText = useRef();
    const [isIphone, setIsPhone] = useState(Platform.OS === 'ios' ? true : false)
    return(
        <>
            <TouchableOpacity onPress={() => richText.current?.dismissKeyboard()} style={{alignSelf: 'stretch'}}>
                <RichToolbar
                    style={{borderTopWidth: 1, backgroundColor: '#f7f7f7', borderTopColor: '#cbcbcb', borderRightWidth: 1, borderRightColor: '#cbcbcb', borderLeftWidth: 1, borderLeftColor: '#cbcbcb', width: '99.5%', flex: 1, borderTopStartRadius: 4, borderTopEndRadius: 4}}
                    editor={richText}
                    selectedIconTint={Blue}
                    iconTint={'#000'}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                    ]}
                    iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), }}
                />
            </TouchableOpacity>
            <View style={{height: 200, maxHeight: 200, width: '99.5%', borderWidth: isIphone ? 0 : 1, borderColor: isIphone ? 'transparent' : '#cbcbcb'}}>
                <RichEditor
                    autoCapitalize='on'
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    useContainer={isIphone ? true : false}
                    style={{flex: 1, borderColor: '#cbcbcb', borderWidth: 1, height: 'auto', borderBottomStartRadius: 4, borderBottomEndRadius: 4}}
                    ref={richText}
                    onChange={(descriptionText) => handleInputChange(descriptionText)}
                />
            </View>
        </>
    )
}