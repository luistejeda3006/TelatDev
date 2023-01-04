import {View, Text, TouchableOpacity} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {AuthLogin, ChooseScreen, LoginScreen, RegisterScreen, WelcomeScreen} from './Screens/Login'
import {CurriculumScreenMX, InfoLaboralScreenMX, InfoMedicaScreenMX, InfoPersonalScreenMX, RefPersonalesScreenMX} from './Screens/Drawer/CandidatesMX'
import {CurriculumScreenUSA, InfoPersonalScreenUSA, RefPersonalesScreenUSA, EmployeeScreenUSA} from './Screens/Drawer/CandidatesUSA'
import {VacantsScreen, VacantDetailScreen} from './Screens/Vacants'
import {ContactScreen} from './Screens/Areas/RRHH'
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerEmployees, NotificationsScreen, OptionsMenuScreen} from './Screens/Drawer';
import {BettingScreen, ChecksScreen, GazetteScreen, MyMoneyScreen, MyPrenomineScreen, PrenomineScreen, StatisticsScreen} from './Screens/Areas/Modules';
import {TicketsScreen, TicketsDetailScreen} from './Screens/Areas/Modules/Tickets'
import {VacationDetailScreen, VacationScreen} from './Screens/Areas/Modules/Vacations';
import {Screen_1, Screen_2, Screen_3, Screen_4} from './Screens/Development';
import {DrawerGames} from './Screens/Areas/Modules/Games/Login'
import MenuGamesScreen from './Screens/Areas/Modules/Games/Login/MenuGamesScreen';
import { ChoosePuzzle, Puzzle } from './Screens/Areas/Modules/Games/Puzzle';
import ChooseMemorama from './Screens/Areas/Modules/Games/Memorama/ChooseMemorama';
import { Memorama } from './Screens/Areas/Modules/Games/Memorama';
import Snake from './Screens/Areas/Modules/Games/Snake/Snake';
import { Dynamics, DynamicsDetail } from './Screens/Areas/Modules/Dynamics';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DevelopmentRoute = ({route: {params}}) => {
    return (
		<Stack.Navigator
			initialRouteName={'test_1'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name='test_1' component={Screen_1} />
            <Stack.Screen name='test_2' component={Screen_2} />
            <Stack.Screen name='test_3' component={Screen_3} />
            <Stack.Screen name='test_4' component={Screen_4} />
		</Stack.Navigator>
    );
}

const StackCandidate = ({route: {params}}) => {
    return (
		<Stack.Navigator
			initialRouteName={'Choose'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name={'Choose'} component={ChooseScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name={'Login'} component={LoginScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name={'Register'} component={RegisterScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name={'Vacants'} component={VacantsScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name={'VacantDetail'} component={VacantDetailScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name={'Contact'} component={ContactScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
		</Stack.Navigator>
    );
}

const StackEmployee = ({route: {params}}) => {
    return (
		<Stack.Navigator
			initialRouteName={'Welcome'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name={'Welcome'} component={WelcomeScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
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

			<Stack.Screen name='Statistics' component={StatisticsScreen} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='Dynamics' component={Dynamics} initialParams={{language: params.language, orientation: params.orientation}}/>
			<Stack.Screen name='DynamicsDetail' component={DynamicsDetail} initialParams={{language: params.language, orientation: params.orientation}}/>
		</Stack.Navigator>
    );
}

const StackGames = ({route: {params}, navigation, style}) => {
    return (
		<Stack.Navigator
			initialRouteName={'Menu'}
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name='Menu' component={MenuGamesScreen} initialParams={{language: '1', orientation: 'PORTRAIT', origin: '1'}}/>
			<Stack.Screen name='ChoosePuzzle' component={ChoosePuzzle} initialParams={{language: params.language, orientation: params.orientation, origin: params.origin}}/>            
			<Stack.Screen name='Puzzle' component={Puzzle} initialParams={{language: params.language, orientation: params.orientation}}/>            

			<Stack.Screen name='ChooseMemorama' component={ChooseMemorama} initialParams={{language: params.language, orientation: params.orientation, origin: params.origin}}/>            
			<Stack.Screen name='Memorama' component={Memorama} initialParams={{language: params.language, orientation: params.orientation}}/>

			<Stack.Screen name='Snake' component={Snake} initialParams={{language: params.language, orientation: params.orientation, origin: params.origin}}/>
			<Stack.Screen name='Dashboard' component={OptionsMenuScreen} initialParams={{language: params.language, orientation: params.orientation}}/>
		</Stack.Navigator>
    );
}

const DrawerEmployeeRoute = ({route: {params}}) => {
    return (
        <Drawer.Navigator
			screenOptions={{headerShown: false, drawerPosition: 'right', drawerStyle: {width: '80%'}, sceneContainerStyle: {backgroundColor: 'transparent'}}}
            drawerContent={(props) => <DrawerEmployees initialParams={{language: '1'}} {...props} />}
        >
            <Stack.Screen name={'Modules'} initialParams={{language: '1'}} component={StackEmployee} />
        </Drawer.Navigator>
    );
}

const DrawerGamesRoute = ({route: {params}}) => {
    return (
        <Drawer.Navigator
			screenOptions={{headerShown: false, drawerPosition: 'left', drawerStyle: {width: '100%'}, sceneContainerStyle: {backgroundColor: 'transparent'}}}
            drawerContent={(props) => <DrawerGames initialParams={{language: '1', orientation: 'PORTRAIT'}} {...props} />}
        >
            <Stack.Screen name={'Modules'} initialParams={{language: '1', orientation: 'PORTRAIT'}} component={StackGames} />
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
			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen name={'Notifications'} component={NotificationsScreen} />
			</Stack.Group>
			<Drawer.Screen name='Games' component={DrawerGamesRoute} />
			<Stack.Screen name={'Development'} component={DevelopmentRoute} />
		</Stack.Navigator>
	</NavigationContainer>
  );
}