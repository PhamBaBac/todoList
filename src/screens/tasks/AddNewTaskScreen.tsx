import React, {useEffect, useState} from 'react';
import {Alert, Button, PermissionsAndroid, Platform, View} from 'react-native';
import Container from '../../components/Container';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import InputComponent from '../../components/InputComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import {Attachment, TaskModel} from '../../models/TaskModel';
import DropdownPicker from '../../components/DropdownPicker';
import {SelectModel} from '../../models/SelectModel';
import firestore from '@react-native-firebase/firestore';
import ButtonComponent from '../../components/ButtonComponent';
import TitleComponent from '../../components/TitleComponent';
import TextComponent from '../../components/TextComponent';
import UploadFileComponent from '../../components/UploadFileComponent';
import {calcFileSize} from '../../utils/calcFileSize';
import auth from '@react-native-firebase/auth';
import {create} from 'react-test-renderer';
import { HandleNotification } from '../../utils/handleNotification';

const initValue: TaskModel = {
  id: '',
  title: '',
  description: '',
  dueDate: undefined,
  start: undefined,
  end: undefined,
  uids: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isUrgent: false,
  attachments: [],
};

const AddNewTask = ({navigation, route}: any) => {
  const user = auth().currentUser;
  const {editable, task}: {editable: boolean; task?: TaskModel} = route.params;
  const uids : string[] = task ? task.uids : [];
  console.log("uids:", uids)
  const [usersSelect, setUsersSelect] = useState<SelectModel[]>([]);
  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  useEffect(() => {
    user && setTaskDetail({...taskDetail, uids: [user.uid]});
  }, [user]);

  useEffect(() => {
    task &&
      setTaskDetail({
        ...taskDetail,
        title: task.title,
        description: task.description,
        uids: task.uids,
      });
  }, [task]);


  const handleGetAllUsers = async () => {
    await firestore()
      .collection('users')
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log(`users data not found`);
        } else {
          const items: SelectModel[] = [];

          snap.forEach(item => {
            items.push({
              label: item.data().name,
              value: item.id,
            });
          });

          setUsersSelect(items);
        }
      })
      .catch((error: any) => {
        console.log(`Can not get users, ${error.message}`);
      });
  };

  const handleChangeValue = (id: string, value: string | string[] | Date) => {
    const item: any = {...taskDetail};
    item[`${id}`] = value;
    setTaskDetail(item);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ]);
    }
  }, []);

  const handleAddNewTask = async () => {
    if (user) {
      const data = {
        ...taskDetail,
        id: task ? task.id : taskDetail.id,
        attachments: task ? task.attachments : attachments,
        dueDate: task ? task.dueDate : taskDetail.dueDate,
        start: task ? task.start : taskDetail.start,
        end: task ? task.end : taskDetail.end,
        createdAt: task ? task.createdAt : Date.now(),
        updatedAt: Date.now()
      };

      if (task) {
        await firestore()
          .doc(`tasks/${task.id}`)
          .update(data)
          .then(() => {
            if (uids.length > 0) {
              uids.forEach(member => {
                member !== user.uid &&
                  HandleNotification.SendNotification({
                    title: 'Task updated',
                    body: `A task updated by ${user?.email}`,
                    taskId: task.id,
                    memberId: member,
                  });
              });
            }
            navigation.goBack();
          });
      } else {
        const docRef = await firestore().collection('tasks').add(data);
        await firestore().collection('tasks').doc(docRef.id).update({
          id: docRef.id,
        });
        if (uids.length > 0) {
          uids.forEach(member => {
            member !== user.uid &&
              HandleNotification.SendNotification({
                title: 'New task added',
                body: `A new task added by ${user?.email}`,
                taskId: docRef.id,
                memberId: member,
              });
              console.log("member:", member)
          });
        }

        navigation.goBack();
      }
    } else {
      Alert.alert('You are not logged in!');
    }
  };

  return (
    <Container back title="Add new task" isScroll>
      <SectionComponent>
        <InputComponent
          value={taskDetail.title}
          onChange={val => handleChangeValue('title', val)}
          title="Title"
          allowClear
          placeholder="Title of task"
        />
        <InputComponent
          value={taskDetail.description}
          onChange={val => handleChangeValue('description', val)}
          title="Description"
          allowClear
          placeholder="Content"
          multiple
          numberOfLine={3}
        />

        <DateTimePickerComponent
          selected={taskDetail.dueDate}
          onSelect={val => handleChangeValue('dueDate', val)}
          placeholder="Choice"
          type="date"
          title="Due date"

        />

        <RowComponent>
          <View style={{flex: 1}}>
            <DateTimePickerComponent
              selected={taskDetail.start}
              type="time"
              onSelect={val => handleChangeValue('start', val)}
              title="Start"
            />
          </View>
          <SpaceComponent width={14} />
          <View style={{flex: 1}}>
            <DateTimePickerComponent
              selected={taskDetail.end}
              onSelect={val => handleChangeValue('end', val)}
              title="End"
              type="time"
            />
          </View>
        </RowComponent>

        <DropdownPicker
          selected={taskDetail.uids}
          items={usersSelect}
          onSelect={val => handleChangeValue('uids', val)}
          title="Members"
          multiple
        />

        <View>
          <RowComponent justify="flex-start">
            <TitleComponent text="Attachments" flex={0} />
            <SpaceComponent width={8} />
            <RowComponent>
              <UploadFileComponent
                onUpload={file =>
                  file && setAttachments([...attachments, file])
                }
              />
            </RowComponent>
          </RowComponent>
          {attachments.map((item, index) => (
            <View
              style={{justifyContent: 'flex-start', marginBottom: 8}}
              key={`attachment${index}`}>
              <TextComponent flex={0} text={item.name} />
              <TextComponent
                flex={0}
                text={calcFileSize(item.size)}
                size={12}
              />
            </View>
          ))}
        </View>
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          text={task ? 'Update' : 'Save'}
          onPress={handleAddNewTask}
        />
      </SectionComponent>
    </Container>
  );
};

export default AddNewTask;
