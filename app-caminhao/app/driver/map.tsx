import { View, Image } from "react-native";
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
import { Text, Button } from "@rneui/themed";
import { Icon } from "@rneui/base";
import RouteCard from "../../components/RouteCard";
import Loading from "../../components/Loading";
import { supabase } from "../../lib/supabase";
import * as Notifications from "expo-notifications";

const truck_icon = require("../../assets/truck_icon.png");
const sleep_icon = require("../../assets/sleep.png");
const bg_image = require("../../assets/bg.png");
const GOOGLE_MAPS_DIRECTIONS_API_KEY =
  process.env.GOOGLE_MAPS_DIRECTIONS_API_KEY;

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function format_waypoint_address(lat: number, lon: number) {
  return `${lat},${lon}`;
}

const sleep_points = [];

// Mock data to replace Supabase call
const MOCK_ROUTE_DATA = {
  origin: "Curitiba",
  origin_lat: -25.4284,
  origin_lon: -49.2733,
  driver: "João Silva", // This is our tracked driver
  id: "mock-route-1",
  destination: "São Paulo",
  destination_lat: -23.5505,
  destination_lon: -46.6333,
};

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

// Replace Supabase call with mock data
async function getRoute(): Promise<RouteData> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ROUTE_DATA), 500);
  });
}

export default function DriverMapView() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [data, setData] = useState<RouteData | null>(null);
  const [sleepPoints, setSleepPoints] = useState(sleep_points);
  const [lastSleepTime, setLastSleepTime] = useState<number | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    try {
      const { granted } = await requestForegroundPermissionsAsync();

      if (granted) {
        const currentPosition = await getCurrentPositionAsync();
        setLocation(currentPosition);
      }
    } catch (error) {
      console.log("Error requesting location permissions:", error);
      // Use default location for demo if permissions fail
      setLocation({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: 0,
        },
        timestamp: Date.now(),
      });
    }
  }

  // Request notification permissions
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted");
      }
    };

    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    const subscription = watchPositionAsync(
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
    ).catch((error) => {
      console.log("Error watching position:", error);
    });

    // Clean up subscription when component unmounts
    return () => {
      subscription
        .then((sub) => {
          if (sub) {
            sub.remove();
          }
        })
        .catch(() => {});
    };
  }, []);

  useEffect(() => {
    getRoute().then((d) => setData(d));

    return () => setData(null);
  }, []);

  // Simulating connection with a timeout
  useEffect(() => {
    // Simulate connection process with a 3-second timeout
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function logRoute() {
      if (!data || !location) return;

      const currentTime = Date.now();

      try {
        if (isSleeping) {
          if (!lastSleepTime || currentTime - lastSleepTime >= 10000) {
            setSleepPoints([
              ...sleepPoints,
              {
                latitude: location.coords.latitude as number,
                longitude: location.coords.longitude as number,
              },
            ]);

            // Insert sleep tracking point to Supabase tracking_sample table
            const { error } = await supabase.from("tracking_sample").insert({
              driver: data.driver,
              lat: location.coords.latitude,
              lon: location.coords.longitude,
              speed: location.coords.speed || 0,
              is_sleeping: true,
              time: new Date().toISOString(),
            });

            if (error) {
              console.error("Error inserting sleep tracking:", error);
            } else {
              console.log(
                "Sleep tracking point added to tracking_sample table"
              );
            }

            setLastSleepTime(currentTime);
          }
        } else {
          // Insert regular tracking point to Supabase tracking_sample table
          const { error } = await supabase.from("tracking_sample").insert({
            driver: data.driver,
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            speed: location.coords.speed || 0,
            is_sleeping: false,
            time: new Date().toISOString(),
          });

          if (error) {
            console.error("Error inserting tracking:", error);
          } else {
            console.log(
              "Regular tracking point added to tracking_sample table"
            );
          }
        }
      } catch (error) {
        console.error("Error logging route:", error);
      }
    }

    const intervalId = setInterval(logRoute, 5000); // Send data every 5 seconds
    return () => clearInterval(intervalId);
  }, [location, data, isSleeping, lastSleepTime, sleepPoints]);

  // Function to send immediate sleep notification and tracking
  const triggerSleepEvent = async () => {
    if (!data || !location) return;

    try {
      // Add sleep point to local state immediately
      const newSleepPoint = {
        latitude: location.coords.latitude as number,
        longitude: location.coords.longitude as number,
      };

      setSleepPoints((prev) => [...prev, newSleepPoint]);

      // Insert immediate sleep tracking point to database
      const { error } = await supabase.from("tracking_sample").insert({
        driver: data.driver,
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        speed: location.coords.speed || 0,
        is_sleeping: true,
        time: new Date().toISOString(),
      });

      if (error) {
        console.error("Error inserting immediate sleep tracking:", error);
      } else {
        console.log("Immediate sleep event recorded");

        // Send local notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "⚠️ Sonolência Detectada",
            body: `${data.driver} apresentou sinais de sonolência. Localização registrada.`,
            data: {
              driver: data.driver,
              lat: location.coords.latitude,
              lon: location.coords.longitude,
              timestamp: new Date().toISOString(),
            },
          },
          trigger: null, // Show immediately
        });
      }
    } catch (error) {
      console.error("Error triggering sleep event:", error);
    }
  };

  // Toggle sleep status for testing
  const toggleSleepStatus = async () => {
    const newSleepingState = !isSleeping;
    setIsSleeping(newSleepingState);

    // If switching to sleeping state, trigger immediate sleep event
    if (newSleepingState) {
      await triggerSleepEvent();
    }
  };

  if (isConnecting) {
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
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Esse é Você"
            image={truck_icon}
          />
          {sleepPoints.map((p, index) => (
            <Marker
              coordinate={p}
              image={sleep_icon}
              title="Sonolência Detectada"
              key={`sleep-${index}`}
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
            Caminhão #1234 - Status: {isSleeping ? "Dormindo" : "Alerta"}
          </Text>
          <Button
            title={isSleeping ? "Marcar como Alerta" : "Simular Sonolência"}
            onPress={toggleSleepStatus}
            buttonStyle={{
              backgroundColor: isSleeping ? "green" : "red",
              borderRadius: 5,
              marginTop: 5,
            }}
            size="sm"
          />
        </View>
      </View>
    </View>
  );
}
