import { View } from "react-native";
import { styles } from "../../styles";
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
import { Card, Text } from "@rneui/themed";
import { Icon, ListItem } from "@rneui/base";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import RouteCard from "../../components/RouteCard";

enableLatestRenderer();

const truck_icon = require("../../assets/truck_icon.png");
const sleep_icon = require("../../assets/sleep.png");

const origin = {
  latitude: -25.5272981,
  longitude: -49.4266079,
  name: "Cia Verde Logística",
};

const destination = {
  latitude: -25.5028027,
  longitude: -48.5220868,
  name: "Porto de Paranaguá",
};
function format_waypoint_address(
  w: { latitude: Int32; longitude: Int32 } | undefined
) {
  return `${w?.latitude},${w?.longitude}`;
}

const sleep_points = [
  { latitude: -25.4207369, longitude: -49.2819641 },
  { latitude: -25.4207369, longitude: -49.2790641 },
];

export default function DriverMapView() {
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
          {sleep_points.map((p) => (
            <Marker
              id={`${p.latitude}, ${p.longitude}`}
              coordinate={p}
              image={sleep_icon}
              title="Vc dormiu aqui..."
            />
          ))}
          <MapViewDirections
            origin={location.coords}
            destination={format_waypoint_address(destination)}
            apikey={GOOGLE_MAPS_DIRECTIONS_API_KEY}
            strokeWidth={5}
            optimizeWaypoints={true}
            resetOnChange={false}
          />
          {origin && (
            <Marker
              id={origin.name}
              coordinate={{
                latitude: origin.latitude,
                longitude: origin.longitude,
              }}
              title={origin.name}
            />
          )}
          {destination && (
            <Marker
              id={destination.name}
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              pinColor="green"
              title={destination.name}
            />
          )}
        </MapView>
      )}

      <RouteCard origin={origin} destination={destination} />

      <View style={styles.truck_map_card}>
        <Icon name="truck" type="font-awesome" size={48} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Caminhão #1234
          </Text>
        </View>
      </View>
    </View>
  );
}
