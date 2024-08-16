import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import AddNewTaskScreen from '../screens/tasks/AddNewTaskScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import auth from '@react-native-firebase/auth';
import RegisterScreen from '../screens/auth/RegisterScreen';
import TaskDetail from '../screens/tasks/TaskDetail';
import ListTasks from '../screens/tasks/ListTasks';
import {useLinkTo} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {HandleNotification} from '../utils/handleNotification';
import NotificationScreen from '../screens/home/components/NotificationScreen';
import {Linking} from 'react-native';
const Router = () => {
  const Stack = createNativeStackNavigator();

  const [isLogin, setIsLogin] = useState(false);
  const linkTo = useLinkTo();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      user ? setIsLogin(true) : setIsLogin(false);
    });

    HandleNotification.getAccessToken();
    messaging()
      .onNotificationOpenedApp((mess: any) => {
       if (mess && mess.data) {
         const data = mess.data;
         const taskId = data.taskId;
         linkTo(`/task-detail/${taskId}`);
       }
      })
  }, []);

  useEffect(() => {}, []);

  const MainRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTaskScreen" component={AddNewTaskScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetail} />
      <Stack.Screen name="ListTasks" component={ListTasks} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
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
  return isLogin ? MainRouter : AuthRouter;
};

export default Router;
