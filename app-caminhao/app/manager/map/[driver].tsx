import { View } from "react-native";
import { styles } from "../../../styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import { GOOGLE_MAPS_DIRECTIONS_API_KEY } from "@env";

import { useEffect, useRef, useState } from "react";
import { Card, Text } from "@rneui/themed";
import { Icon, ListItem } from "@rneui/base";
import { supabase } from "../../../lib/supabase";
import Loading from "../../../components/Loading";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

// enableLatestRenderer();

const truck_icon = require("../../../assets/truck_icon.png");
const sleep_icon = require("../../../assets/sleep.png");

const sleep_points = [{ latitude: -25.4207369, longitude: -49.2819641 }];

async function getSleepPoints(driver_id: string): Promise<[SleepPoint]> {
  const { data, error, status } = await supabase
    .from("tracking")
    .select("*")
    .eq("driver", driver_id)
    .eq("is_sleeping", true);
  return data?.map((d: TrackingData) => {
    return { latitude: d?.lat, longitude: d?.lon };
  }) as any as [SleepPoint];
}

type TrackingData = {
  id: string;
  driver: string;
  lat: number;
  lon: number;
  time: string;
  speed: number;
  is_sleeping: boolean;
};

type SleepPoint = {
  latitude: number;
  longitude: number;
};

async function getTrackingData(driver_id: string): Promise<TrackingData> {
  const { data, error, status } = await supabase
    .from("tracking")
    .select("*")
    .eq("driver", driver_id)
    .order("time", { ascending: false })
    .limit(1)
    .single();
  // console.log(data);
  return data as TrackingData;
}

export default function DriverMapView() {
  const params = useLocalSearchParams();
  const driver_id = params["driver"] as string;
  const [data, setData] = useState<TrackingData | null>(null);
  const [sleepPoints, setSleepPoints] = useState(sleep_points);
  const [lastSleepPoint, setLastSleepPoint] = useState(sleep_points[0]);

  useEffect(() => {
    getTrackingData(driver_id).then((d) => setData(d));
    getSleepPoints(driver_id).then((d) => setSleepPoints(d));
    console.log(sleepPoints.length);

    const sub = supabase
      .channel("tracking_drivers")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tracking",
          filter: `driver=eq.${driver_id}`,
        },
        (d: any) => {
          // console.log(d);
          setData(d["new"]);
          mapRef.current?.animateCamera({
            pitch: 20,
            center: { latitude: d["new"].lat, longitude: d["new"].lon },
          });
          if (d["new"].is_sleeping) {
            setLastSleepPoint({
              latitude: d["new"].lat as number,
              longitude: d["new"].lon as number,
            });
          }
        }
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setSleepPoints([...sleepPoints, lastSleepPoint]);
  }, [lastSleepPoint]);

  const mapRef = useRef<MapView>(null);

  if (!data) return <Loading />;

  return (
    <View style={styles.container}>
      {data && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: data.lat,
            longitude: data.lon,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          // camera={{ pitch: 70, center: location.coords, heading: 0 }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: data.lat,
              longitude: data.lon,
            }}
            title={`Speed: ${data.speed}. Carga: Desconhecida`}
            image={truck_icon}
          />
          {sleepPoints?.map((p, index) => (
            <Marker
              id={`${p.latitude}, ${p.longitude}`}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              image={sleep_icon}
              title="Sonolência Detectada"
              key={`${index} -> ${p.latitude}, ${p.longitude}`}
            />
          ))}
        </MapView>
      )}

      {/* <RouteCard
        origin_name={data.origin}
        destination_name={data.destination}
      /> */}

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
