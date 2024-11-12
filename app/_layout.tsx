// app/_layout.tsx
import React from 'react'
import {
	ThemeProvider,
	DarkTheme,
	DefaultTheme,
} from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { Stack } from 'expo-router'

export default function Layout() {
	const colorScheme = useColorScheme()

	const headerBackgroundColor = colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC'
	const headerTintColor = colorScheme === 'dark' ? '#fff' : '#000'

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: headerBackgroundColor,
					},
					headerTintColor: headerTintColor,
					headerShadowVisible: false,
				}}
			>
				<Stack.Screen name='index' options={{ title: 'Home' }} />
				<Stack.Screen name='AddTransaction' />
				<Stack.Screen name='Reports' />
			</Stack>
		</ThemeProvider>
	)
}
