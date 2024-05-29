import React from 'react'
import HomeScreen from './src/screens/homes/HomeScreen'
import { SafeAreaView, StatusBar } from 'react-native'
import { colors } from './src/constants/colors';

const App = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.bgColor}}>
        <StatusBar
          translucent
          barStyle={'light-content'}
          backgroundColor="transparent"
        />
        <HomeScreen />
      </SafeAreaView>
    </>
  );
}

export default App