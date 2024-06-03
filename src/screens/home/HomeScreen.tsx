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

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    setIsLoading(true);
    const unsubscribe = firestore()
      .collection('tasks')
      .orderBy('dueDate', 'desc')
      .limit(3)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log(`tasks not found!`);
        } else {
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
    return unsubscribe;
  };

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
              <TextComponent text="Hi, Jason" />
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
                    <CardImageComponent>
                      <View style={[globalStyles.iconContainer]}>
                        <Edit2 size={24} color={colors.desc} />
                      </View>
                      <TitleComponent text={tasks[0].title} />
                      <TextComponent text={tasks[0].description} />
                      <View style={{marginVertical: 20}}>
                        <AvatarGroupComponent uids={tasks[0].uids} />
                      </View>
                      {tasks[0].progress && (
                        <ProgressBarComponent
                          percent="70%"
                          color="#0AACFF"
                          size="large"
                        />
                      )}
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
                    <CardImageComponent color="rgba(33, 150, 243, 0.9)">
                      <View style={[globalStyles.iconContainer]}>
                        <Edit2 size={24} color={colors.desc} />
                      </View>
                      <TitleComponent text={tasks[1].title} />
                      <View style={{marginVertical: 20}}>
                        {tasks[1].uids && (
                          <AvatarGroupComponent uids={tasks[1].uids} />
                        )}
                      </View>

                      {tasks[1].progress && (
                        <ProgressBarComponent
                          percent="40%"
                          color="#A2F068"
                          size="large"
                        />
                      )}
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
                  <CardImageComponent color="rgba(18, 118, 22, 0.9)">
                    <View style={[globalStyles.iconContainer]}>
                      <Edit2 size={24} color={colors.desc} />
                    </View>
                    <TitleComponent text={tasks[2].title} />
                    <TextComponent text={tasks[2].description} />
                    {tasks[2].progress && (
                      <ProgressBarComponent
                        percent="40%"
                        color="#A2F068"
                        size="large"
                      />
                    )}
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
              <CardComponent>
                <RowComponent>
                  <CicularComponent value={40} radius={36} />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      paddingLeft: 12,
                    }}>
                    <TextComponent text="Title of task" />
                  </View>
                </RowComponent>
              </CardComponent>
              <SpaceComponent height={46} />
            </SectionComponent>
          </>
        ) : <></>}
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
          onPress={() => navigation.navigate('AddNewTaskScreen')}
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
