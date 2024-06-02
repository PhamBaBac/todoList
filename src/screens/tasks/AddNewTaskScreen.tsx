import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import SectionComponent from '../../components/SectionComponent';
import {taskModel} from '../../models/taskModel';
import {Button, View} from 'react-native';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import RowComponent from '../../components/RowComponent';
import SpaceComponent from '../../components/SpaceComponent';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {SelectModel} from '../../models/selectModel';
import DropdownPicker from '../../components/DropdownPicker';

const AddNewTaskScreen = ({navigation} : any) => {
  const initValue: taskModel = {
    title: '',
    desctiption: '',
    dueDate: new Date(),
    start: new Date(),
    end: new Date(),
    uids: [],
    fileUrls: [],
  };
  const [taskDetail, setTaskDetail] = useState<taskModel>(initValue);
  const [usersSelect, setUsersSelect] = useState<SelectModel[]>([]);
  const [attachmentsUrl, setAttachmentsUrl] = useState<string[]>([]);

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  const handleChangeValue = (id: string, value: string | string[] | Date) => {
    const item: any = {...taskDetail};

    item[`${id}`] = value;

    setTaskDetail(item);
  };
  const handleAddNewTask = async () => {
    const data = {
      ...taskDetail,
      fileUrls: attachmentsUrl,
    };

    await firestore()
      .collection('tasks')
      .add(data)
      .then(() => {
        console.log('New task added!!');
        navigation.goBack();
      })
      .catch(error => console.log(error));
  };

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
  

  return (
    <Container back title="Add new task">
      <SectionComponent>
        <InputComponent
          value={taskDetail.title}
          onChange={val => handleChangeValue('title', val)}
          title="Title"
          allowClear
          placeholder="Title of task"
        />
        <InputComponent
          value={taskDetail.desctiption}
          onChange={val => handleChangeValue('desctiption', val)}
          title="Description"
          allowClear
          placeholder="Content"
          multible
          numberOfLine={3}
        />
      </SectionComponent>
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
        multible
      />
      <SectionComponent>
        <Button title="Save" onPress={handleAddNewTask} />
      </SectionComponent>
    </Container>
  );
};

export default AddNewTaskScreen;
