import React from 'react'

import {
	createMaterialTopTabNavigator,
	MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'

import { useColorScheme } from 'react-native'

import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { Colors } from '@/constants/Colors'
import { handleRetry } from '@/utils/handleRetry'

import HomeScreen from './index'
import AddTransaction from './AddTransaction'
import AnalyticsScreen from './AnalyticsScreen'
import TransactionProvider from './TransactionContext'
import OfflineScreen from './OfflineScreen'

const Tab = createMaterialTopTabNavigator()

export default function Layout(): JSX.Element {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const isOnline = useNetworkStatus()

	const tabStyles: MaterialTopTabNavigationOptions = {
		tabBarStyle: {
			backgroundColor: isDarkMode
				? Colors.dark.tabBarBackground
				: Colors.light.tabBarBackground,
		},
		tabBarIndicatorStyle: {
			backgroundColor: isDarkMode
				? Colors.dark.tabBarIndicator
				: Colors.light.tabBarIndicator,
		},
		tabBarLabelStyle: {
			color: isDarkMode ? Colors.dark.tabBarLabel : Colors.light.tabBarLabel,
			fontWeight: 'bold',
			fontSize: 18,
		},
	}

	if (!isOnline) {
		return <OfflineScreen onRetry={handleRetry} />
	}

	return (
		<TransactionProvider>
			<Tab.Navigator screenOptions={tabStyles}>
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
					name='AnalyticsScreen'
					component={AnalyticsScreen}
					options={{ tabBarLabel: 'Analytics' }}
				/>
			</Tab.Navigator>
		</TransactionProvider>
	)
}
