import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/globalStyles'

interface Props {
    children: React.ReactNode
    color?: string
}

const CardImageComponent = (props: Props) => {
    const { children, color } = props
  return (
    <ImageBackground
      source={require('../assets/images/card-bg.png')}
      imageStyle={{ borderRadius: 12 }}
      style={[globalStyles.card]}>
      <View style={{
        flex: 1,
        backgroundColor: color ?? 'rgba(113,77,217,0.9)',
        borderRadius: 12,
        padding: 12,
      }}>
        {children}
      </View>
    </ImageBackground>
  );
}

export default CardImageComponent