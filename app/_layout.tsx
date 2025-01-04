import React from 'react'
import { View, Text } from 'react-native'
import { useColorScheme } from 'react-native'

import {
	createMaterialTopTabNavigator,
	MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'

import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { Colors } from '@/constants/Colors'

import HomeScreen from './index'
import AddTransaction from './AddTransaction'
import AnalyticsScreen from './AnalyticsScreen'
import TransactionProvider from './TransactionContext'

import { styles } from '../styles/layoutStyles'

const Tab = createMaterialTopTabNavigator()

export default function Layout(): JSX.Element {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	const isOnline = useNetworkStatus()

	const offlineBannerStyles = isOnline
		? styles.hiddenBanner
		: styles.offlineBanner

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

	return (
		<TransactionProvider>
			<View style={offlineBannerStyles}>
				<Text style={styles.offlineText}>You are currently offline</Text>
			</View>
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
