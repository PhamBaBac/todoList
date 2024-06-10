import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Task, TouchableOpacity, View} from 'react-native';
import CardComponent from '../../components/CardComponent';
import Container from '../../components/Container';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {globalStyles} from '../../styles/globalStyles';
import {
  Add,
  Edit2,
  Element4,
  Logout,
  Notification,
  SearchNormal,
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

const HomeScreen = ({navigation}: any) => {
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<TaskModel[]>([]);

  useEffect(() => {
    getTasks();
    getUrgetTasks();
  }, []);

  const getTasks = () => {
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
          setTasks(items);
        }
        setIsLoading(false);
      });
  };

  const getUrgetTasks = () => {
    const fillter = firestore()
      .collection('tasks')
      .where('isUrgent', '==', true)
    fillter.onSnapshot(snap => {
      if (snap && !snap.empty) {
        const items: TaskModel[] = [];
        snap.forEach((item: any) => {
          items.push({
            id: item.id,
            ...item.data(),
          });
        });
        setUrgentTasks(items);
      } else {
        console.log('No urgent tasks found');
      }
    });
  };

  const handleMoveToTaskDetail = (id?: string, color?: string) =>
    navigation.navigate('TaskDetail', {
      id,
      color,
    });

  const handleSingout = async () => {
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
            onPress={() => console.log('Say hi')}>
            <TextComponent color="#69686F" text="Search task" />
            <SearchNormal size={24} color={colors.desc} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent>
            <RowComponent>
              <View style={{flex: 1}}>
                <TitleComponent text="Task progress" />
                <TextComponent text="30/40 tasks done" />
                <SpaceComponent height={12} />
                <RowComponent justify="flex-start">
                  <TagComponent
                    text="Match 22"
                    onPress={() => console.log('Say Hi!!!')}
                  />
                </RowComponent>
              </View>
              <View>
                <TextComponent text="CircleChar" />
                <CicularComponent value={80} />
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
                      <View style={{marginVertical: 18}}>
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
                      <TitleComponent text={tasks[1].title} />
                      <View style={{marginVertical: 18}}>
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
                      {tasks[1].dueDate && (
                        <TextComponent
                          text={`Due ${HandleDateTime.DateString(
                            tasks[1].dueDate.toDate(),
                          )}`}
                          size={12}
                          color={colors.desc}
                        />
                      )}
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

                      {tasks[2].dueDate && (
                        <TextComponent
                          text={`Due ${HandleDateTime.DateString(
                            tasks[2].dueDate.toDate(),
                          )}`}
                          size={12}
                          color={colors.desc}
                        />
                      )}
                    </CardImageComponent>
                  )}
                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <TextComponent
                flex={1}
                font={fontFamilies.bold}
                size={21}
                text="Urgents tasks"
              />
              {urgentTasks.length > 0 &&
                urgentTasks.map((item, index) => (
                  <CardComponent
                    styles={{marginVertical: 10}}
                    onPress={() => handleMoveToTaskDetail(item.id,
                      index === 0
                        ? 'rgba(113,77,217,0.9)'
                        : index === 1
                        ? 'rgba(33, 150, 243, 0.9)'
                        : 'rgba(18, 118, 22, 0.9)'
                    )}
                    key={`urgentTask${item.id}`}>
                    <RowComponent>
                      <CicularComponent
                        value={
                          item.progress ? Math.floor(item.progress * 100) : 0
                        }
                      />
                      <SpaceComponent width={42} />
                      <TextComponent
                        size={24}
                        text={item.title}
                        font={fontFamilies.bold}
                      />
                    </RowComponent>
                  </CardComponent>
                ))}

              <SpaceComponent height={46} />
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
