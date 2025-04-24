import { View, Text, ScrollView, Dimensions } from "react-native";
import { Card, Divider, Icon } from "@rneui/base";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { styles } from "../styles";
import { TripData } from "./TripCard";

const sleep_icon = require("../assets/sleep.png");
const screenWidth = Dimensions.get("window").width;

interface TripDetailProps {
  trip: TripData;
}

const TripDetail = ({ trip }: TripDetailProps) => {
  // Parse the sleep duration to get minutes for average calculation
  const sleepMinutes = parseInt(trip.sleepDuration.split(" ")[0]);
  const avgSleepPerEvent =
    trip.sleepEvents > 0 ? (sleepMinutes / trip.sleepEvents).toFixed(1) : "0";

  return (
    <ScrollView
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        paddingTop: 60,
        paddingBottom: 20,
      }}
      contentContainerStyle={{
        paddingBottom: 40, // Extra padding at bottom for better scrolling
      }}
    >
      <View style={{ padding: 16 }}>
        <Text
          style={{
            ...styles.heading1,
            fontSize: 24, // Reduced from 28
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {trip.title}
        </Text>

        <Card
          containerStyle={{
            borderRadius: 8,
            margin: 0,
            marginVertical: 12,
            padding: 12, // Ensure consistent padding
          }}
        >
          {/* Date and time section */}
          <View
            style={{
              flexDirection: "column", // Changed from row to column for better visibility
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              {trip.startDate}
            </Text>
            <Text style={{ fontSize: 14 }}>
              Horário: {trip.startTime} - {trip.endTime}
            </Text>
          </View>

          <Text
            style={{
              marginBottom: 15,
              lineHeight: 20,
            }}
          >
            {trip.description}
          </Text>

          <Divider style={{ marginVertical: 10 }} />

          {/* Stats section - completely redesigned for better spacing */}
          <View style={{ marginVertical: 10 }}>
            {/* Each stat on its own row for better visibility */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
                height: 40,
              }}
            >
              <View style={{ width: 40, alignItems: "center" }}>
                <Icon name="road" type="font-awesome" size={22} color="#555" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 12, color: "#777" }}>Distância</Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {trip.distance}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
                height: 40,
              }}
            >
              <View style={{ width: 40, alignItems: "center" }}>
                <Icon name="bed" type="font-awesome" size={22} color="#555" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 12, color: "#777", width: 200 }}>
                  Eventos de Sono
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {trip.sleepEvents}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 40,
              }}
            >
              <View style={{ width: 40, alignItems: "center" }}>
                <Icon
                  name="clock-o"
                  type="font-awesome"
                  size={22}
                  color="#555"
                />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 12, color: "#777" }}>
                  Tempo Dormindo
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {trip.sleepDuration}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          Mapa da Viagem
        </Text>

        <View
          style={{
            height: 300,
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <MapView
            style={{ width: "100%", height: "100%" }}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: (trip.origin.latitude + trip.destination.latitude) / 2,
              longitude:
                (trip.origin.longitude + trip.destination.longitude) / 2,
              latitudeDelta:
                Math.abs(trip.origin.latitude - trip.destination.latitude) *
                1.5,
              longitudeDelta:
                Math.abs(trip.origin.longitude - trip.destination.longitude) *
                1.5,
            }}
          >
            <Marker coordinate={trip.origin} title="Origem" />
            <Marker
              coordinate={trip.destination}
              title="Destino"
              pinColor="green"
            />
            {trip.sleepPoints.map(
              (
                point: { latitude: number; longitude: number },
                index: number
              ) => (
                <Marker
                  key={`sleep-${index}`}
                  coordinate={point}
                  title={`Sonolência #${index + 1}`}
                  image={sleep_icon}
                />
              )
            )}
          </MapView>
        </View>

        <Card containerStyle={{ borderRadius: 8, margin: 0, marginBottom: 20 }}>
          <Card.Title>Resumo da Sonolência</Card.Title>
          <Card.Divider />

          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
              Total de eventos: {trip.sleepEvents}
            </Text>
            <Text style={{ marginBottom: 4 }}>
              Tempo total de sonolência: {trip.sleepDuration}
            </Text>
            <Text style={{ marginBottom: 4 }}>
              Média por evento: {avgSleepPerEvent} min
            </Text>
          </View>

          <Text
            style={{
              fontSize: 12,
              color: "#777",
              fontStyle: "italic",
              marginTop: 10,
              lineHeight: 18,
            }}
          >
            A sonolência foi detectada em {trip.sleepEvents} pontos diferentes
            durante a viagem. Recomendamos paradas mais frequentes para
            descanso.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

export default TripDetail;
