import { ListItem, Text } from "@rneui/base";
import { TouchableOpacity, View, Image } from "react-native";
import { styles } from "../styles";
import { Link } from "expo-router";
import MenuCard from "../components/MenuCard";

export default function Page() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/bg.png")} resizeMode="center" />

      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          width: "100%",
          height: "100%",
        }}
      />

      <View
        style={{
          position: "absolute",
          flex: 1,
          gap: 196,
          padding: 12,
          justifyContent: "space-around",
        }}
      >
        <View>
          <Text style={{ ...styles.heading1 }}>
            Pronto para uma viagem mais tranquila?
          </Text>

          <Text style={styles.heading2}>A CAMinhão pode te ajudar!</Text>
        </View>

        <View style={{ gap: 24 }}>
          <MenuCard
            text="Sou Gerente"
            href="/manager/overview"
            inverted={true}
          />

          <MenuCard text="Sou Motorista" href="/driver/map" inverted={false} />
        </View>
      </View>
    </View>
  );
}
