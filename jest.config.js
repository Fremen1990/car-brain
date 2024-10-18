module.exports = {
	preset: '@testing-library/react-native',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	setupFilesAfterEnv: ['./jest-setup.ts'],
	transformIgnorePatterns: ['node_modules/(?!@toolz/allow)/" --env=jsdom'],
	testMatch: ['**/*.test.{ts,tsx}']
}
