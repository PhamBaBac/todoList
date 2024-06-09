import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../constants/colors';
import SectionComponent from '../../components/SectionComponent';
import RowComponent from '../../components/RowComponent';
import {
  AddSquare,
  ArrowLeft2,
  CalendarEdit,
  Clock,
  TickCircle,
  TickSquare,
} from 'iconsax-react-native';
import {Attachment, SubTask, TaskModel} from '../../models/TaskModel';
import firestore from '@react-native-firebase/firestore';
import TitleComponent from '../../components/TitleComponent';
import TextComponent from '../../components/TextComponent';
import SpaceComponent from '../../components/SpaceComponent';
import {HandleDateTime} from '../../utils/handeDateTime';
import AvatarGroupComponent from '../../components/AvatarGroupComponent';
import CardComponent from '../../components/CardComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import UploadFileComponent from '../../components/UploadFileComponent';
import {calcFileSize} from '../../utils/calcFileSize';
import {Slider} from '@miblanchard/react-native-slider';
import ButtonComponent from '../../components/ButtonComponent';
import ModalAddSubTask from '../../modals/ModalAddSubTask';

const TaskDetail = ({navigation, route}: any) => {
  const {id, color}: {id: string; color: string} = route.params;
  console.log('id', id);
  console.log('color', color);

  const [taskDetail, setTaskDetail] = useState<TaskModel>();
  const [isUrgent, setIsUrgent] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [progress, setProgress] = useState(0);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    const [isVisibleModalSubTask, setIsVisibleModalSubTask] = useState(false);

  useEffect(() => {
    getTaskDetail();
  }, []);

  useEffect(() => {
    if (
      progress !== taskDetail?.progress ||
      attachments.length !== taskDetail.attachments.length
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [progress, taskDetail, attachments]);

  useEffect(() => {
    if (taskDetail) {
      setProgress(taskDetail.progress ?? 0);
      setAttachments(taskDetail.attachments);
      setIsUrgent(taskDetail.isUrgent);
    }
  }, [taskDetail]);

  const getTaskDetail = () => [
    firestore()
      .doc(`tasks/${id}`)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setTaskDetail({
            id,
            ...snap.data(),
          });
          console.log('taskDetail', taskDetail);
        }
      }),
  ];

    const handleUpdateUrgentState = () => {
      firestore().doc(`tasks/${id}`).update({
        isUrgent: !isUrgent,
        updatedAt: Date.now(),
      });
    };

    const handleUpdateTask = async () => {
      const data = {
        ...taskDetail,
        progress,
        attachments,
        updatedAt: Date.now(),
      };

      await firestore()
        .doc(`tasks/${id}`)
        .update(data)
        .then(() => {
          Alert.alert('Task updated');
        })
        .catch(error => console.log(error));
    };

    

  return taskDetail ? (
    <>
      <ScrollView style={{flex: 1, backgroundColor: colors.bgColor}}>
        <StatusBar hidden />
        <SectionComponent
          styles={{
            backgroundColor: color,
            paddingTop: 60,
            paddingBottom: 18,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
          <RowComponent styles={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft2
                size={28}
                color={colors.white}
                style={{marginTop: -8, marginRight: 12}}
              />
            </TouchableOpacity>
            <TitleComponent
              line={1}
              flex={1}
              text={taskDetail.title}
              size={22}
            />
          </RowComponent>
          <View style={{marginTop: 20, marginHorizontal: 12}}>
            <TextComponent text="Due date" />
            <RowComponent styles={{justifyContent: 'space-between'}}>
              <RowComponent
                styles={{
                  flex: 1,
                  justifyContent: 'flex-start',
                }}>
                <Clock size={20} color={colors.white} />
                <SpaceComponent width={4} />
                {taskDetail.end && taskDetail.start && (
                  <TextComponent
                    flex={0}
                    text={`${HandleDateTime.GetHour(
                      taskDetail.start?.toDate(),
                    )} - ${HandleDateTime.GetHour(taskDetail.end?.toDate())}`}
                  />
                )}
              </RowComponent>
              {taskDetail.dueDate && (
                <RowComponent
                  styles={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CalendarEdit size={20} color={colors.white} />
                  <SpaceComponent width={4} />

                  <TextComponent
                    flex={0}
                    text={
                      HandleDateTime.DateString(taskDetail.dueDate.toDate()) ??
                      ''
                    }
                  />
                </RowComponent>
              )}
              <View
                style={{
                  flex: 1,

                  alignItems: 'flex-end',
                }}>
                <AvatarGroupComponent uids={taskDetail.uids} />
              </View>
            </RowComponent>
          </View>
        </SectionComponent>
        <SectionComponent>
          <TitleComponent text="Description" size={22} />
          <CardComponent
            bgColor={colors.bgColor}
            styles={{
              borderWidth: 1,
              borderColor: colors.gray,
              borderRadius: 12,
              marginTop: 12,
            }}>
            <TextComponent
              text={taskDetail.description}
              styles={{textAlign: 'justify'}}
            />
          </CardComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent onPress={handleUpdateUrgentState}>
            <TickSquare
              variant={isUrgent ? 'Bold' : 'Outline'}
              size={24}
              color={colors.white}
            />
            <SpaceComponent width={8} />
            <TextComponent
              flex={1}
              text={`Is Urgent`}
              font={fontFamilies.bold}
              size={18}
            />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent>
            <RowComponent>
              <TextComponent text="Files & Links" flex={1} />
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
          </CardComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: colors.success,
                marginRight: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.success,
                  width: 16,
                  height: 16,
                  borderRadius: 100,
                }}
              />
            </View>
            <TextComponent
              flex={1}
              text="Progress"
              font={fontFamilies.medium}
              size={18}
            />
          </RowComponent>
          <SpaceComponent height={12} />
          <RowComponent>
            <View style={{flex: 1}}>
              <Slider
                value={progress}
                onValueChange={val => setProgress(val[0])}
                thumbTintColor={colors.success}
                thumbStyle={{
                  borderWidth: 2,
                  borderColor: colors.white,
                }}
                maximumTrackTintColor={colors.gray2}
                minimumTrackTintColor={colors.success}
                trackStyle={{height: 10, borderRadius: 100}}
              />
            </View>
            <SpaceComponent width={20} />
            <TextComponent
              text={`${Math.floor(progress * 100)}%`}
              font={fontFamilies.bold}
              size={18}
              flex={0}
            />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <TitleComponent flex={1} text="Sub tasks" size={20} />
            <TouchableOpacity onPress={() => {}}>
              <AddSquare size={24} color={colors.success} variant="Bold" />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={12} />
          {subTasks.length > 0 &&
            subTasks.map((item, index) => (
              <CardComponent
                key={`subtask${index}`}
                styles={{marginBottom: 12}}>
                <RowComponent
                // onPress={() =>
                //   handleUpdateSubTask(item.id, item.isCompleted)
                // }
                >
                  <TickCircle
                    variant={item.isCompleted ? 'Bold' : 'Outline'}
                    color={colors.success}
                    size={22}
                  />
                  <View style={{flex: 1, marginLeft: 12}}>
                    <TextComponent text={item.title} />
                    <TextComponent
                      size={12}
                      color={'#e0e0e0'}
                      text={HandleDateTime.DateString(new Date(item.createdAt))}
                    />
                  </View>
                </RowComponent>
              </CardComponent>
            ))}
        </SectionComponent>
        <SectionComponent>
          <RowComponent
          //  onPress={handleRemoveTask}
          >
            <TextComponent text="Delete task" color="red" flex={0} />
          </RowComponent>
        </SectionComponent>
      </ScrollView>
      {isChanged && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            left: 20,
          }}>
          <ButtonComponent text="Update" onPress={handleUpdateTask} />
        </View>
      )}

      <ModalAddSubTask
        visible={isVisibleModalSubTask}
        onClose={() => setIsVisibleModalSubTask(false)}
        taskId={id}
      />
    </>
  ) : (
    <></>
  );
};

export default TaskDetail;
