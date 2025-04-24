import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/base";

export interface TripData {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endTime: string;
  description: string;
  distance: string;
  sleepEvents: number;
  sleepDuration: string;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  sleepPoints: { latitude: number; longitude: number }[];
}

interface TripCardProps {
  trip: TripData;
  onPress: (trip: TripData) => void;
}

const TripCard = ({ trip, onPress }: TripCardProps) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(trip)}
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: "100%",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name="truck" type="font-awesome" size={28} color="#333" />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {trip.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#666",
              flexWrap: "wrap",
            }}
          >
            {trip.startDate}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          backgroundColor: "#f8f8f8",
          padding: 8,
          borderRadius: 4,
        }}
      >
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 10, // Reduzido de 12 para 10
              color: "#777",
              textAlign: "center",
              flexWrap: "wrap", // Adicionado para permitir quebra de linha
              width: "100%", // Garante largura total
            }}
          >
            Distância
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {trip.distance}
          </Text>
        </View>
        <View style={{ alignItems: "center", flex: 2 }}>
          <Text
            style={{
              fontSize: 10, // Reduzido de 12 para 10
              color: "#777",
              textAlign: "center",
              flexWrap: "wrap", // Adicionado para permitir quebra de linha
              width: "100%", // Garante largura total
            }}
          >
            Eventos de Sono
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {trip.sleepEvents}
          </Text>
        </View>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: "#777",
              textAlign: "center",
            }}
          >
            Duração
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {trip.sleepDuration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TripCard;
