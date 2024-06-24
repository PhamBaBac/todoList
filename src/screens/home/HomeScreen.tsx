import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Task, TouchableOpacity, View} from 'react-native';
import CardComponent from '../../components/CardComponent';
import Container from '../../components/Container';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import { globalStyles } from '../../styles/globalStyles';
import {
  Add,
  Edit2,
  Element4,
  Logout,
  Notification,
  SearchNormal,
  SearchNormal1,
} from 'iconsax-react-native';
import {colors} from '../../constants/colors';
import SpaceComponent from '../../components/SpaceComponent';
import TagComponent from '../../components/TagComponent';
import CicularComponent from '../../components/CicularComponent';
import CardImageComponent from '../../components/CardImageComponent';
import AvatarGroupComponent from '../../components/AvatarGroupComponent';
import ProgressBarComponent from '../../components/ProgressBarComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import auth from '@react-native-firebase/auth';
import {TaskModel} from '../../models/TaskModel';
import firestore from '@react-native-firebase/firestore';
import {HandleDateTime} from '../../utils/handeDateTime';
import {monthNames} from '../../constants/appInfos';
import {add0ToNumber} from '../../utils/add0ToNumber';
import { HandleNotification } from '../../utils/handleNotification';
import ButtonComponent from '../../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
const date = new Date();

const HomeScreen = ({navigation}: any) => {
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<TaskModel[]>([]);

  useEffect(() => {
    getTasks();
    HandleNotification.checkNotificationPersion();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const urgent = tasks.filter(task => task.isUrgent);
      setUrgentTasks(urgent);
    }
  }, [tasks]);

  const getTasks =  () => {
    setIsLoading(true);
    
    firestore()
      .collection('tasks')
      .where('uids', 'array-contains', user?.uid)
      .onSnapshot(snap => {
        if (snap && !snap.empty) {
          const items: TaskModel[] = [];
          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });
          setTasks(items.sort((a, b) => b.createdAt - a.createdAt));
        }
        setIsLoading(false);
      });
  };

  const handleMoveToTaskDetail = (id?: string, color?: string) =>
    navigation.navigate('TaskDetail', {
      id,
      color,
    });

  const handleSingout = async () => {
    const token = await AsyncStorage.getItem('fcmtoken'); // Retrieve token from AsyncStorage

    // Remove token from AsyncStorage
    await AsyncStorage.removeItem('fcmtoken');

    // Remove token from Firestore
    const currentUser = auth().currentUser;
    if (currentUser) {
      await firestore()
        .doc(`users/${currentUser.uid}`)
        .get()
        .then(snap => {
          if (snap.exists) {
            const data: any = snap.data();
            if (data.tokens && data.tokens.includes(token)) {
              firestore()
                .doc(`users/${currentUser.uid}`)
                .update({
                  tokens: firestore.FieldValue.arrayRemove(token),
                })
                .then(() => {
                  console.log('Token removed from Firestore');
                })
                .catch(error => {
                  console.error('Error removing token from Firestore:', error);
                });
            } else {
              console.log('Token not found in Firestore');
            }
          }
        })
        .catch(error => {
          console.error('Error getting document:', error);
        });
    }

    // Sign out the user
    await auth().signOut();
  };



  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        <SectionComponent>
          <RowComponent justify="space-between">
            <Element4 size={24} color={colors.desc} />
            <Notification size={24} color={colors.desc} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <ButtonComponent text="get Acces " onPress={() => {
            HandleNotification.getAccessToken();
          }}/>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <View
              style={{
                flex: 1,
              }}>
              <TextComponent text={`Hi! ${user?.email}`} />
              <TitleComponent text="Be Productive today" />
            </View>
            <TouchableOpacity onPress={handleSingout}>
              <Logout size={22} color="coral" />
            </TouchableOpacity>
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent
            styles={[globalStyles.inputContainer]}
            onPress={() =>
              navigation.navigate('ListTasks', {
                tasks,
              })
            }>
            <TextComponent color="#696B6F" text="Search task" />
            <SearchNormal1 size={20} color={colors.desc} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent>
            <RowComponent>
              <View style={{flex: 1}}>
                <TitleComponent text="Task progress" />
                <TextComponent
                  text={`${
                    tasks.filter(
                      element => element.progress && element.progress === 1,
                    ).length
                  } /${tasks.length}`}
                />
                <SpaceComponent height={12} />
                <RowComponent justify="flex-start">
                  <TagComponent
                    text={`${monthNames[date.getMonth()]} ${add0ToNumber(
                      date.getDate(),
                    )}`}
                  />
                </RowComponent>
              </View>
              <View>
                <TextComponent text="CircleChar" />
                {tasks.length > 0 && (
                  <CicularComponent
                    value={Math.floor(
                      (tasks.filter(
                        element => element.progress && element.progress === 1,
                      ).length /
                        tasks.length) *
                        100,
                    )}
                  />
                )}
              </View>
            </RowComponent>
          </CardComponent>
        </SectionComponent>
        {isLoading ? (
          <ActivityIndicator />
        ) : tasks.length > 0 ? (
          <>
            <SectionComponent>
              <RowComponent
                onPress={() =>
                  navigation.navigate('ListTasks', {
                    tasks,
                    colors,
                  })
                }
                justify="flex-end"
                styles={{
                  marginBottom: 16,
                }}>
                <TextComponent size={16} text="See all" flex={0} />
              </RowComponent>
              <RowComponent
                styles={{alignItems: 'flex-start', borderRadius: 100}}>
                <View style={{flex: 1}}>
                  {tasks[0] && (
                    <CardImageComponent
                      onPress={() =>
                        handleMoveToTaskDetail(
                          tasks[0].id as string,
                          'rgba(113,77,217,0.9)',
                        )
                      }>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('AddNewTaskScreen', {
                            editable: true,
                            task: tasks[0],
                          })
                        }
                        style={globalStyles.iconContainer}>
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TitleComponent text={tasks[0].title} />
                      <TextComponent line={3} text={tasks[0].description} />
                      <View style={{paddingTop: 26}}>
                        <AvatarGroupComponent uids={tasks[0].uids} />
                      </View>
                      {tasks[0].progress &&
                      (tasks[0].progress as number) >= 0 ? (
                        <ProgressBarComponent
                          percent={`${Math.floor(tasks[0].progress * 100)}%`}
                          color="#0AACFF"
                          size="large"
                        />
                      ) : null}
                      <SpaceComponent height={24} />
                      {tasks[0].dueDate && (
                        <TextComponent
                          text={`Due ${HandleDateTime.DateString(
                            tasks[0].dueDate.toDate(),
                          )}`}
                          size={12}
                          color={colors.desc}
                        />
                      )}
                    </CardImageComponent>
                  )}
                </View>
                <SpaceComponent width={16} />
                <View style={{flex: 1}}>
                  {tasks[1] && (
                    <CardImageComponent
                      color="rgba(33, 150, 243, 0.9)"
                      onPress={() =>
                        handleMoveToTaskDetail(
                          tasks[1].id as string,
                          'rgba(33, 150, 243, 0.9)',
                        )
                      }>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('AddNewTaskScreen', {
                            editable: true,
                            task: tasks[1],
                          })
                        }
                        style={globalStyles.iconContainer}>
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TextComponent line={3} text={tasks[1].description} />
                      <View style={{paddingTop: 18}}>
                        {tasks[1].uids && (
                          <AvatarGroupComponent uids={tasks[1].uids} />
                        )}
                      </View>

                      {tasks[1].progress &&
                      (tasks[1].progress as number) >= 0 ? (
                        <ProgressBarComponent
                          percent={`${Math.floor(tasks[1].progress * 100)}%`}
                          color="#A2F068"
                          size="large"
                        />
                      ) : null}
                    </CardImageComponent>
                  )}
                  <SpaceComponent height={16} />
                  {tasks[2] && (
                    <CardImageComponent
                      color="rgba(18, 118, 22, 0.9)"
                      onPress={() =>
                        handleMoveToTaskDetail(
                          tasks[2].id as string,
                          'rgba(18, 118, 22, 0.9)',
                        )
                      }>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('AddNewTaskScreen', {
                            editable: true,
                            task: tasks[2],
                          })
                        }
                        style={globalStyles.iconContainer}>
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TitleComponent text={tasks[2].title} />
                      <TextComponent line={3} text={tasks[2].description} />
                    </CardImageComponent>
                  )}
                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <TitleComponent
                flex={1}
                font={fontFamilies.bold}
                size={21}
                text="Urgents tasks"
              />
              {urgentTasks.length > 0 &&
                urgentTasks.map(item => (
                  <CardComponent
                    onPress={() => handleMoveToTaskDetail(item.id)}
                    key={`urgentTask${item.id}`}
                    styles={{marginBottom: 12}}>
                    <RowComponent>
                      <CicularComponent
                        value={item.progress ? item.progress * 100 : 0}
                        radius={40}
                      />
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          paddingLeft: 12,
                        }}>
                        <TextComponent size={18} text={item.title} font= {fontFamilies.bold} />
                      </View>
                    </RowComponent>
                  </CardComponent>
                ))}
                <SpaceComponent height={42} />
            </SectionComponent>
          </>
        ) : (
          <></>
        )}
      </Container>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('AddNewTaskScreen', {
              editable: false,
              tasks: undefined,
            })
          }
          style={[
            globalStyles.row,
            {
              backgroundColor: colors.blue,
              padding: 10,
              borderRadius: 12,
              paddingVertical: 14,
              width: '80%',
            },
          ]}>
          <TextComponent text="Add new tasks" flex={0} />
          <Add size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
