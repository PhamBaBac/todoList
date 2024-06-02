import React, { useEffect, useState } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import AddNewTaskScreen from '../screens/tasks/AddNewTaskScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import auth from '@react-native-firebase/auth'
import RegisterScreen from '../screens/auth/RegisterScreen';
const Router = () => {
  const Stack = createNativeStackNavigator();
  
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() =>{
    auth().onAuthStateChanged(user =>{
      user ? setIsLogin(true) : setIsLogin(false)
    })
  }, [])

  const MainRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTaskScreen" component={AddNewTaskScreen} />
    </Stack.Navigator>
  );

  const AuthRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
  return isLogin ? MainRouter :  AuthRouter
  ;
};

export default Router;
