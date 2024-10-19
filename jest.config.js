module.exports = {
	preset: '@testing-library/react-native',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	setupFilesAfterEnv: ['./jest-setup.ts'],
	transformIgnorePatterns: ['node_modules/(?!@toolz/allow)/" --env=jsdom'],
	// transformIgnorePatterns: [
	// 	'node_modules/(?!(react-native|@react-native|react-native-reanimated|expo-modules-core|expo-file-system)/)'
	// ],
	testMatch: ['**/*.test.{ts,tsx}'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1'
	}
}
