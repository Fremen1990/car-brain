/* eslint-disable no-undef */

// import 'fast-text-encoding'
// import 'react-native-url-polyfill/auto'

import '@testing-library/react-native/extend-expect'

jest.mock('expo-file-system', () => ({
	getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, size: 1024 })),
	readAsStringAsync: jest.fn(() => Promise.resolve('mocked file content')),
	writeAsStringAsync: jest.fn(() => Promise.resolve()),
	deleteAsync: jest.fn(() => Promise.resolve()),
	downloadAsync: jest.fn(() => Promise.resolve())
}))

// Mock any other NativeModules if needed
NativeModules.ExponentFileSystem = {
	...NativeModules.ExponentFileSystem,
	getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, size: 1024 }))
}

jest.mock('expo-router', () => ({
	useRouter: () => ({
		push: jest.fn(),
		replace: jest.fn(),
		back: jest.fn()
	}),
	useNavigation: () => ({
		navigate: jest.fn()
	})
}))

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons')

jest.mock('react-native-appwrite', () => {
	return {
		Client: jest.fn().mockImplementation(() => ({
			setEndpoint: jest.fn(),
			setProject: jest.fn()
		})),
		Account: jest.fn(),
		Avatars: jest.fn(),
		Databases: jest.fn(),
		ID: jest.fn(),
		Permission: jest.fn(),
		Query: jest.fn(),
		Role: jest.fn(),
		Storage: jest.fn()
	}
})

import { NativeModules } from 'react-native'

import { server } from './mocks/server'

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

// Establish API mocking before all tests.
beforeAll(() => {
	server.listen({
		onUnhandledRequest: 'warn' // Log unhandled requests
	})
})

// Reset any request handlers that are added during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())
