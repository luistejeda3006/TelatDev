<ImageBackground source={{uri: 'https://fondosmil.com/fondo/17536.jpg'}/* require('../../../assets/background/002.png') */} resizeMode='stretch' style={{width: '100%', height: '100%'}}>
    <View style={{height: 100, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 30}}>
        <View style={{height: '100%', flex: 1, justifyContent: 'center'}}>
            <IonIcons name={'arrow-left'} size={35} color='transparent' />
        </View>
        <View style={{height: '100%', flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <IonIcons name={'bell'} size={35} color='#000' />
            <View style={{width: 18, height: 18, borderRadius: 20, backgroundColor: 'red', position: 'absolute', top: 33, right: 0, borderWidth: 1.5, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingLeft: 2}}>
                <Text style={{fontSize: 10, color: '#fff', fontWeight: 'bold'}}>2</Text>
            </View>
        </View>
    </View>
    <View style={{height: 150, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
        <Image
            style={{width: 100, height: 100, resizeMode:'contain'}}
            source={require('../../../assets/logo_telat.png')}
        />
    </View>
    <View style={{height: 100, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 33, fontWeight: 'bold'}}>¡Bienvenido!</Text>
    </View>
    <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: Blue}}>

    </View>
    <View style={{height: 'auto', alignSelf: 'stretch', backgroundColor: 'orange'}}>
        
    </View>
</ImageBackground>