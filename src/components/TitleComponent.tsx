import {View, Text, TextStyle, StyleProp} from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  text: string;
  font?: string;
  size?: number;
  color?: string;
  flex?: number;
  styles?: StyleProp<TextStyle>;
}

const TitleComponent = (props: Props) => {
  const {text, font, size, color, flex,styles} = props;

  return (
    <TextComponent
      size={size ?? 20}
      font={font ?? fontFamilies.semiBold}
      color={color}
      text={text}
      flex={flex ?? 1}
      styles={styles}
    />
  );
};

export default TitleComponent;
