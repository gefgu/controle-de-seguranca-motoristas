import { Text, View, Dimensions } from "react-native";
import { styles } from "./styles";
import MapView, { Marker, enableLatestRenderer } from "react-native-maps";
import { GOOGLE_MAPS_DIRECTIONS_API_KEY } from "@env";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";

enableLatestRenderer();

const { width, height } = Dimensions.get("window");

const waypoint_address = "-25.5272981,-49.4266079";
const paranagua_address = "-25.5028027,-48.5220868";

const truck_icon = require("./assets/truck_icon.png");
const sleep_icon = require("./assets/sleep.png");

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch: 70,
          center: response.coords,
        });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            }}
            title="Esse é Você"
            image={truck_icon}
          />
          <Marker
            coordinate={{
              latitude: location?.coords.latitude - 0.001,
              longitude: location?.coords.longitude + 0.001,
            }}
            image={sleep_icon}
            title="Vc dormiu aqui..."
          />
          <Marker
            coordinate={{
              latitude: location?.coords.latitude - 0.001,
              longitude: location?.coords.longitude - 0.001,
            }}
            image={sleep_icon}
            title="Vc dormiu aqui..."
          />
          <MapViewDirections
            origin={location.coords}
            waypoints={[waypoint_address]}
            destination={paranagua_address}
            apikey={GOOGLE_MAPS_DIRECTIONS_API_KEY}
            strokeWidth={5}
            optimizeWaypoints={true}
          />
        </MapView>
      )}
    </View>
  );
}
