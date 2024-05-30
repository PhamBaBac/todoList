import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import CardComponent from '../../components/CardComponent';
import Container from '../../components/Container';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {globalStyles} from '../../styles/globalStyles';
import { Add, Edit2, Element4, Notification, SearchNormal,} from 'iconsax-react-native';
import { colors } from '../../constants/colors';
import SpaceComponent from '../../components/SpaceComponent';
import TagComponent from '../../components/TagComponent';
import CicularComponent from '../../components/CicularComponent';
import CardImageComponent from '../../components/CardImageComponent';
import AvatarGroupComponent from '../../components/AvatarGroupComponent';
import ProgressBarComponent from '../../components/ProgressBarComponent';
import { fontFamilies } from '../../constants/fontFamilies';


const HomeScreen = ({navigation}: any) => {
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
          <TextComponent text="Hi, Jason" />
          <TitleComponent text="Be Productive today" />
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
        <SectionComponent>
          <RowComponent styles={{alignItems: 'flex-start', borderRadius: 100}}>
            <View style={{flex: 1}}>
              <CardImageComponent>
                <View style={[globalStyles.iconContainer]}>
                  <Edit2 size={24} color={colors.desc} />
                </View>
                <TitleComponent text="UX Design" />
                <TextComponent text="task manager mobile app" />
                <View style={{marginVertical: 20}}>
                  <AvatarGroupComponent />
                </View>
                <ProgressBarComponent
                  percent="70%"
                  color="#0AACFF"
                  size="large"
                />
                <TextComponent text="Due in 2 days" />
              </CardImageComponent>
            </View>
            <SpaceComponent width={16} />
            <View style={{flex: 1}}>
              <CardImageComponent color="rgba(33, 150, 243, 0.9)">
                <View style={[globalStyles.iconContainer]}>
                  <Edit2 size={24} color={colors.desc} />
                </View>
                <TitleComponent text="API payment" />
                <AvatarGroupComponent />
                <ProgressBarComponent percent="40%" color="#A2F068" />
              </CardImageComponent>
              <SpaceComponent height={16} />
              <CardImageComponent color="rgba(18, 118, 22, 0.9)">
                <View style={[globalStyles.iconContainer]}>
                  <Edit2 size={24} color={colors.desc} />
                </View>
                <TitleComponent text="Update work" />
                <TextComponent text="Update work progress" />
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
                style={{flex: 1, justifyContent: 'center', paddingLeft: 12}}>
                <TextComponent text="Title of task" />
              </View>
            </RowComponent>
          </CardComponent>
        </SectionComponent>
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
