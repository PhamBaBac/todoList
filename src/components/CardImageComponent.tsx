import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/globalStyles'

interface Props {
    children: React.ReactNode
    color?: string
    onPress?: () => void
}

const CardImageComponent = (props: Props) => {
    const { children, color, onPress } = props
  const content = (
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
  )
  return onPress ? (
    <TouchableOpacity onPress={onPress}>
      {content}
    </TouchableOpacity>
  ) : (
    content
  )
}

export default CardImageComponent