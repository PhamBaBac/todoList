import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/homes/HomeScreen';
import AddNewTaskScreen from '../screens/tasks/AddNewTaskScreen';

const Router = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTaskScreen" component={AddNewTaskScreen} />
    </Stack.Navigator>
  );
};

export default Router;
