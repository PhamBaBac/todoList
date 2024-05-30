import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { colors } from './src/constants/colors';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/routers/Router';

const App = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.bgColor}}>
        <StatusBar
          translucent
          barStyle={'light-content'}
          backgroundColor="transparent"
        />
        <NavigationContainer>
          <Router/>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}

export default App