import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import PoppinsBlack from '../assets/fonts/Poppins-Black.ttf'
import PoppinsBold from '../assets/fonts/Poppins-Bold.ttf'
import PoppinsExtraBold from '../assets/fonts/Poppins-ExtraBold.ttf'
import PoppinsExtraLight from '../assets/fonts/Poppins-ExtraLight.ttf'
import PoppinsLight from '../assets/fonts/Poppins-Light.ttf'
import PoppinsMedium from '../assets/fonts/Poppins-Medium.ttf'
import PoppinsRegular from '../assets/fonts/Poppins-Regular.ttf'
import PoppinsSemiBold from '../assets/fonts/Poppins-SemiBold.ttf'
import PoppinsThin from '../assets/fonts/Poppins-Thin.ttf'
import SpaceMono from '../assets/fonts/SpaceMono-Regular.ttf'

const useLoadAssets = () => {
	const [loaded, error] = useFonts({
		'Poppins-Black': PoppinsBlack,
		'Poppins-Bold': PoppinsBold,
		'Poppins-ExtraBold': PoppinsExtraBold,
		'Poppins-ExtraLight': PoppinsExtraLight,
		'Poppins-Light': PoppinsLight,
		'Poppins-Medium': PoppinsMedium,
		'Poppins-Regular': PoppinsRegular,
		'Poppins-SemiBold': PoppinsSemiBold,
		'Poppins-Thin': PoppinsThin,
		SpaceMono,
		...FontAwesome.font
	})

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	return { loaded, error }
}

export default useLoadAssets
