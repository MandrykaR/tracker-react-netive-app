import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useColorScheme } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './index'
import AddTransaction from './AddTransaction'
import ReportsScreen from './ReportsScreen'
import AnalyticsScreen from './AnalyticsScreen'
import { TransactionProvider } from './TransactionContext'

const Tab = createMaterialTopTabNavigator()

export default function Layout() {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	return (
		<TransactionProvider>
			<NavigationContainer>
				<Tab.Navigator
					screenOptions={{
						tabBarStyle: {
							backgroundColor: isDarkMode ? '#1D3D47' : '#A1CEDC',
						},
						tabBarIndicatorStyle: {
							backgroundColor: isDarkMode ? '#fff' : '#000',
						},
						tabBarLabelStyle: {
							color: isDarkMode ? '#FFF' : '#000',
							fontWeight: 'bold',
							fontSize: 18,
						},
					}}
				>
					<Tab.Screen
						name='index'
						component={HomeScreen}
						options={{
							tabBarLabel: 'Dashboard',
							title: 'Dashboard',
						}}
					/>
					<Tab.Screen
						name='AddTransaction'
						component={AddTransaction}
						options={{
							tabBarLabel: 'Transaction',
						}}
					/>
					<Tab.Screen
						name='ReportsScreen'
						component={ReportsScreen}
						options={{
							tabBarLabel: 'Reports',
						}}
					/>
					<Tab.Screen
						name='AnalyticsScreen'
						component={AnalyticsScreen}
						options={{ tabBarLabel: 'Analytics' }}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</TransactionProvider>
	)
}
