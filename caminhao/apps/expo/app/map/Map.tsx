import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import Mapbox, { MapView } from '@rnmapbox/maps'

Mapbox.setAccessToken(
  'pk.eyJ1IjoiZ2VmZ3UiLCJhIjoiY2x2djd0czRuMDBibDJqbXZiZnFoYmRheCJ9.SJXAOSbnq2PjLLkLPDqetQ'
)

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
})

export default function MyMap() {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    </View>
  )
}
