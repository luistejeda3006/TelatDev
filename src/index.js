import {View, Text, TouchableOpacity} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {AuthLogin, ChooseScreen, LoginScreen, RegisterScreen, WelcomeScreen} from './Screens/Login'

import {CurriculumScreenMX, InfoLaboralScreenMX, InfoMedicaScreenMX, InfoPersonalScreenMX, RefPersonalesScreenMX} from './Screens/Drawer/CandidatesMX'
import {CurriculumScreenUSA, InfoPersonalScreenUSA, RefPersonalesScreenUSA, EmployeeScreenUSA} from './Screens/Drawer/CandidatesUSA'
import {VacantsScreen, VacantDetailScreen} from './Screens/Vacants'
import {ContactScreen} from './Screens/Areas/RRHH'

const Stack = createNativeStackNavigator();

/* const StackCandidate = ({route: {params}, navigation, style}) => {
    return (
        <Animated.View style={[{flex: 1}, style]}>
            <Stack.Navigator
                initialRouteName={'Choose'}
                headerMode={'none'}
            >
                <Stack.Screen name='Choose' component={ChooseScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
                <Stack.Screen name='Login' component={LoginScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
                <Stack.Screen name='Register' component={RegisterScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
                <Stack.Screen name='Vacants' component={VacantsScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
                <Stack.Screen name='VacantDetail' component={VacantDetailScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
                <Stack.Screen name='Contact' component={ContactScreen} initialParams={{orientation: params.orientation}}/>
            </Stack.Navigator>
        </Animated.View>
    );
} */

const StackCandidate = ({route: {params}, navigation, style}) => {
    return (
		<Stack.Navigator
			initialRouteName={'Choose'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name='Choose' component={ChooseScreen} initialParams={{language_: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name='Login' component={LoginScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name='Register' component={RegisterScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name='Vacants' component={VacantsScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name='VacantDetail' component={VacantDetailScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name='Contact' component={ContactScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
		</Stack.Navigator>
    );
}

export default () => {
  return (
	<NavigationContainer>
		<Stack.Navigator
			initialRouteName={'Main'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name='AuthLogin' component={AuthLogin} />
			<Stack.Screen name="Unlogged" component={StackCandidate} />
		</Stack.Navigator>
	</NavigationContainer>
  );
}