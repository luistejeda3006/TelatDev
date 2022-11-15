import {View, Text, TouchableOpacity} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {AuthLogin, ChooseScreen, LoginScreen, RegisterScreen, WelcomeScreen} from './Screens/Login'

import {CurriculumScreenMX, InfoLaboralScreenMX, InfoMedicaScreenMX, InfoPersonalScreenMX, RefPersonalesScreenMX} from './Screens/Drawer/CandidatesMX'
import {CurriculumScreenUSA, InfoPersonalScreenUSA, RefPersonalesScreenUSA, EmployeeScreenUSA} from './Screens/Drawer/CandidatesUSA'
import {VacantsScreen, VacantDetailScreen} from './Screens/Vacants'
import {ContactScreen} from './Screens/Areas/RRHH'
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerEmployees, OptionsMenuScreen} from './Screens/Drawer';
import {BettingScreen, ChecksScreen, GazetteScreen, MyMoneyScreen, MyPrenomineScreen, PrenomineScreen} from './Screens/Areas/Modules';
import {TicketsScreen, TicketsDetailScreen} from './Screens/Areas/Modules/Tickets'
import {VacationDetailScreen, VacationScreen} from './Screens/Areas/Modules/Vacations';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackCandidate = ({route: {params}, navigation, style}) => {
    return (
		<Stack.Navigator
			initialRouteName={'Choose'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name={'Choose'} component={ChooseScreen} initialParams={{language_: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name={'Login'} component={LoginScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name={'Register'} component={RegisterScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name={'Vacants'} component={VacantsScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name={'VacantDetail'} component={VacantDetailScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name={'Contact'} component={ContactScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
		</Stack.Navigator>
    );
}

const StackEmployee = ({route: {params}, navigation, style}) => {
    return (
		<Stack.Navigator
			initialRouteName={'Welcome'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name={'Welcome'} component={WelcomeScreen} initialParams={{language: '1', orientation: 'PORTRAIT'}}/>
			<Stack.Screen name={'Dashboard'} component={OptionsMenuScreen} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='Personal' component={InfoPersonalScreenMX} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='Laboral' component={InfoLaboralScreenMX} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='Curriculum' component={CurriculumScreenMX} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='Personales' component={RefPersonalesScreenMX} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='Medica' component={InfoMedicaScreenMX} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='CurriculumUSA' component={CurriculumScreenUSA} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='PersonalesUSA' component={RefPersonalesScreenUSA} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='EmployeeUSA' component={EmployeeScreenUSA} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='PersonalUSA' component={InfoPersonalScreenUSA} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='Bettings' component={BettingScreen} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='GeneralPrenomine' component={PrenomineScreen} initialParams={{language: params.language, orientation: params.orientation}}/>   
			<Stack.Screen name='Prenomine' component={MyPrenomineScreen} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='Tickets' component={TicketsScreen} initialParams={{language: params.language, orientation: params.orientation}}/>            
			<Stack.Screen name='TicketsDetail' component={TicketsDetailScreen} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='Vacation' component={VacationScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='VacationDetail' component={VacationDetailScreen} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='Checks' component={ChecksScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='Gazette' component={GazetteScreen} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='Money' component={MyMoneyScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
		</Stack.Navigator>
    );
}

const DrawerEmployeeRoute = ({route: {params}}) => {
    return (
        <Drawer.Navigator
			screenOptions={{headerShown: false, drawerPosition: 'right', drawerStyle: {width: '80%'}, sceneContainerStyle: {backgroundColor: 'transparent'}}}
            drawerContent={(props) =>  <DrawerEmployees orientation={params.orientation} language={params.language} {...props} />}
        >
            <Stack.Screen name={'Modules'} initialParams={{language: '1', orientation: 'PORTRAIT'}} component={StackEmployee} />
        </Drawer.Navigator>
    );
}

export default () => {
  return (
	<NavigationContainer>
		<Stack.Navigator
			initialRouteName={'AuthLogin'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name={'AuthLogin'} component={AuthLogin} />
			<Stack.Screen name={'Unlogged'} component={StackCandidate} />
			<Drawer.Screen name={'Logged'} component={DrawerEmployeeRoute} />
			<Stack.Screen name={'Dashboard'} component={OptionsMenuScreen} />
		</Stack.Navigator>
	</NavigationContainer>
  );
}