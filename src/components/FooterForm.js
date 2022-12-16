import React from 'react'
import {View, Text, Image, Linking} from 'react-native'
import tw from 'twrnc';
import { Blue } from '../colors/colorsApp';

export default ({country = 'MX'}) => {
    return(
        <>
            <View style={tw`h-auto self-stretch justify-center items-center`}>
                <Image
                    resizeMode='contain'
                    style={tw`w-15 h-15`}
                    source={require('../../assets/logo_telat.png')}
                />
                <View style={tw`h-auto self-stretch my-3 justify-center items-center`}>
                    <Text style={tw`font-bold text-base text-[#000]`}>Telat Group<Text style={tw`font-normal`}> © 2022</Text></Text>
                </View>
            </View>
            <View style={tw`h-auto self-stretch justify-center items-center mt-4 mb-6 px-4.5`}>
                {
                    country === 'MX'
                    ?
                        <Text style={tw`text-sm text-justify text-[#000]`}><Text style={tw`font-bold`}>Teleservicios Latinoamericanos, S.A. de C.V.</Text> y Corporativo Teleservicios Latinoamericanos, S.A. de C.V. , ubicadas en Av. Monterrey 149, Col. Roma Norte, Ciudad de México, le notifica que la información aquí recabada se utilizará únicamente para integrar su expediente como candidato, y en su caso, como empleado; para el proceso de reclutamiento y/o contratación. Para mayor información acerca del tratamiento de los datos personales y de los derechos que puede hacer valer, puede consultar nuestro aviso de privacidad integral en: <Text onPress={async () => await Linking.openURL('https://telat-group.com/aviso-de-privacidad')} style={[tw`text-[${Blue}]`, {textDecorationLine: 'underline', textDecorationColor: Blue, textDecorationStyle: 'solid'}]}>www.telat-group.com/es/privacidad</Text></Text>
                    :
                        <Text style={tw`text-sm text-justify text-[#000]`}><Text style={tw`font-bold`}>Teleservicios Latinoamericanos, S.A. de C.V.</Text> and Corporativo Teleservicios Latinoamericanos, S.A. de C.V. , located in Av. Monterrey 149, Col. Roma Norte, Ciudad de México, notifies you that the information collected above will be used only for your personal record as candidate and, when applicable, as employee, for the recruitment and/or hiring process. For more information about the treatment of personal information and the rights you can enjoy, you may read our Privacy Policy on: <Text onPress={async () => await Linking.openURL('https://telat-group.com/aviso-de-privacidad?lang=en')} style={[tw`text-[${Blue}]`, {textDecorationLine: 'underline', textDecorationColor: Blue, textDecorationStyle: 'solid'}]}>www.telat-group.com/en/privacity</Text></Text>
                }
            </View>
        </>
    )
}