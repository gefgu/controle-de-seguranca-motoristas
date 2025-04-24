import { View, Text, Image, StyleSheet } from "react-native";
import { styles } from "../../styles";
import MenuCard from "../../components/MenuCard";

const bg_image = require("../../assets/bg.png");

export default function DriverMenuPage() {
  return (
    <View style={styles.container}>
      <Image source={bg_image} resizeMode="center" />

      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          width: "100%",
          height: "100%",
        }}
      />

      <View
        style={{
          position: "absolute",
          flex: 1,
          gap: 150,
          padding: 12,
          justifyContent: "space-around",
        }}
      >
        <View>
          <Text style={styles.heading1}>Área do Motorista</Text>
          <Text style={styles.heading2}>O que deseja fazer hoje?</Text>
        </View>

        <View style={{ gap: 24 }}>
          <MenuCard text="Iniciar Viagem" href="/driver/map" inverted={true} />

          <MenuCard
            text="Histórico de Viagens"
            href="/driver/history"
            inverted={false}
          />
        </View>
      </View>
    </View>
  );
}
