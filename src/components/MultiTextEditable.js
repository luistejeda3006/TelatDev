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
                    style={{borderTopWidth: 1, backgroundColor: '#f7f7f7', borderTopColor: '#cbcbcb', borderRightWidth: 1, borderRightColor: '#cbcbcb', borderLeftWidth: 1, borderLeftColor: '#cbcbcb', alignSelf: 'stretch', flex: 1}}
                    editor={richText}
                    selectedIconTint={Blue}
                    iconTint={'#000'}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        actions.setStrikethrough,
                        actions.setUnderline,
                    ]}
                    iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), }}
                />
            </TouchableOpacity>
            <View style={{height: 200, maxHeight: 200, alignSelf: 'stretch', borderWidth: isIphone ? 0 : 1, borderColor: isIphone ? 'transparent' : '#cbcbcb'}}>
                <RichEditor
                    autoCapitalize='on'
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    useContainer={isIphone ? true : false}
                    style={{flex: 1, borderColor: '#cbcbcb', borderWidth: isIphone ? 0.5 : 1, height: 'auto'}}
                    ref={richText}
                    onChange={(descriptionText) => handleInputChange(descriptionText)}
                />
            </View>
        </>
    )
}