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
const GOOGLE_MAPS_DIRECTIONS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function format_waypoint_address(lat: number, lon: number) {
  return `${lat},${lon}`;
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

async function getTrackingData(driver_id: string): Promise<TrackingData> {
  const { data, error, status } = await supabase
    .from("tracking")
    .select("*")
    .eq("driver", driver_id)
    .order("time", { ascending: false })
    .limit(1)
    .single();
  console.log(data);
  return data as TrackingData;
}

export default function DriverMapView() {
  const params = useLocalSearchParams();
  const driver_id = params["driver"] as string;
  const [data, setData] = useState<TrackingData | null>(null);

  useEffect(() => {
    getTrackingData(driver_id).then((d) => setData(d));

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
          console.log(d);
          setData(d["new"]);
          mapRef.current?.animateCamera({
            pitch: 20,
            center: { latitude: d["new"].lat, longitude: d["new"].lon },
          });
        }
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

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
            title="Esse é Zezinho"
            image={truck_icon}
          />
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
