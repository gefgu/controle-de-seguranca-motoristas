import { TouchableOpacity, View, Image } from "react-native";
import { styles } from "../../styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import { Card, Text, Button } from "@rneui/themed";
import { Icon, ListItem } from "@rneui/base";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import RouteCard from "../../components/RouteCard";
import { supabase } from "../../lib/supabase";
import Loading from "../../components/Loading";
import useBLE from "../../useBLE";

// enableLatestRenderer();

const truck_icon = require("../../assets/truck_icon.png");
const sleep_icon = require("../../assets/sleep.png");
const bg_image = require("../../assets/bg.png");
const GOOGLE_MAPS_DIRECTIONS_API_KEY =
  process.env.GOOGLE_MAPS_DIRECTIONS_API_KEY;

function format_waypoint_address(lat: number, lon: number) {
  return `${lat},${lon}`;
}

const sleep_points = [{ latitude: -25.4207369, longitude: -49.2819641 }];

type RouteData = {
  destination: string;
  destination_lat: number;
  destination_lon: number;
  driver: string;
  id: string;
  origin: string;
  origin_lat: number;
  origin_lon: number;
};

async function getRoute(): Promise<RouteData> {
  const { data, error, status } = await supabase
    .from("routes")
    .select("*")
    .single();
  console.log(data);
  return data as RouteData;
}

export default function DriverMapView() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [data, setData] = useState<RouteData | null>(null);
  const [sleepPoints, setSleepPoints] = useState(sleep_points);
  const [lastSleepTime, setLastSleepTime] = useState<number | null>(null);
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    readDataFromDevice,
    bleData,
  } = useBLE();

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

  useEffect(() => {
    getRoute().then((d) => setData(d));

    return () => setData(null);
  }, []);

  useEffect(() => {
    async function logRoute() {
      if (!data) return;
      if (!connectedDevice) return;

      console.log("BLE", bleData);
      const is_sleeping = await readDataFromDevice();
      const currentTime = Date.now();

      if (is_sleeping) {
        if (!lastSleepTime || currentTime - lastSleepTime >= 10000) {
          setSleepPoints([
            ...sleepPoints,
            {
              latitude: location?.coords.latitude as number,
              longitude: location?.coords.longitude as number,
            },
          ]);

          const { status, error } = await supabase.from("tracking").insert({
            driver: data.driver,
            lat: location?.coords.latitude,
            lon: location?.coords.longitude,
            speed: location?.coords.speed,
            is_sleeping: is_sleeping,
            road_index: 2, // to be cleaned
          });

          setLastSleepTime(currentTime);
        }
      } else {
        const { status, error } = await supabase.from("tracking").insert({
          driver: data.driver,
          lat: location?.coords.latitude,
          lon: location?.coords.longitude,
          speed: location?.coords.speed,
          is_sleeping: is_sleeping,
        });
      }

      // console.log(status);
      // console.error(error);
    }

    const intervalId = setInterval(logRoute, 100);
    return () => clearInterval(intervalId);
  }, [bleData, connectedDevice]);

  useEffect(() => {
    requestPermissions();
    scanForPeripherals();
  }, []);

  if (!connectedDevice) {
    const detector = allDevices.find(
      (d) => d?.localName == "Detector de Sonolencia"
    );
    // console.log("Attempting to find device");
    if (detector) {
      connectToDevice(detector);
    }

    return (
      <View style={styles.container}>
        <Image source={bg_image} resizeMode="center" />
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
        <View
          style={{
            position: "absolute",
            flex: 1,
            justifyContent: "space-around",
            zIndex: 2,
          }}
        >
          <Text style={{ ...styles.heading1 }}>
            Conectando Com Detector De Sonolência...
          </Text>
          <Button
            title="Solid"
            type="clear"
            loading
            style={{ backgroundColor: "white" }}
            loadingProps={{ size: "large" }}
          />
        </View>
      </View>
    );
  }

  if (!data) return <Loading />;

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
          // camera={{ pitch: 70, center: location.coords, heading: 0 }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            }}
            title="Esse é Você"
            image={truck_icon}
          />
          {sleepPoints.map((p, index) => (
            <Marker
              id={`${p.latitude}, ${p.longitude}`}
              coordinate={p}
              image={sleep_icon}
              title="Sonolência Detectada"
              key={`${index} -> ${p.latitude}, ${p.longitude}`}
            />
          ))}
          <MapViewDirections
            origin={location.coords}
            destination={format_waypoint_address(
              data.destination_lat,
              data.destination_lon
            )}
            apikey={GOOGLE_MAPS_DIRECTIONS_API_KEY}
            strokeWidth={5}
            resetOnChange={false}
          />
          <Marker
            coordinate={{
              latitude: data.origin_lat,
              longitude: data.origin_lon,
            }}
            title={data.origin}
          />
          <Marker
            coordinate={{
              latitude: data.destination_lat,
              longitude: data.destination_lon,
            }}
            title={data.destination}
            pinColor="green"
          />
        </MapView>
      )}

      <RouteCard
        origin_name={data.origin}
        destination_name={data.destination}
      />

      <View style={styles.truck_map_card}>
        <Icon name="truck" type="font-awesome" size={48} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Caminhão #1234 - Dormindo: {bleData}
          </Text>
        </View>
      </View>
    </View>
  );
}
