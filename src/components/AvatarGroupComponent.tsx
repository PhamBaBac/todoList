import {View, Text, Image} from 'react-native';
import React from 'react';
import RowComponent from './RowComponent';
import {colors} from '../constants/colors';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
interface Props{
  uids: string[];
}

const AvatarGroupComponent = (props: Props) => {
  const {uids} = props;
  const uidsLength = 10;
  const uriImage =
    'https://phambabac.s3.ap-southeast-1.amazonaws.com/202d0b66-4573-4bab-804b-99dd4547b858.jpg';
  const imageStyle = {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: -10,
    zIndex: 0,
    borderWidth: 2,
    borderColor: colors.white,
  };
  return (
    <RowComponent  styles={{justifyContent: 'flex-start'}}>
      {Array.from({length: uidsLength}).map(
        (_, index) =>
          index < 3 && (
            <Image key={index} source={{uri: uriImage}} style={imageStyle} />
          ),
      )}
      {uidsLength > 3 && (
        <View
          style={[
            imageStyle,
            {
              backgroundColor: colors.blue,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            },
          ]}>
          <TextComponent
            flex={0}
            text={`+${uidsLength - 3 > 9 ? 9 : uidsLength - 3}`}
            color={colors.white}
            size={16}
            styles={{
              lineHeight: 22,
            }}
            font={fontFamilies.semiBold}
          />
        </View>
      )}
    </RowComponent>
  );
};

export default AvatarGroupComponent;
