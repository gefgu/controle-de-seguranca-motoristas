import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import MyMap from './map/Map'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <MyMap />
    </>
  )
}
