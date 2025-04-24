import { View, Text, Image } from "react-native";
import { styles } from "../styles";
import MenuCard from "../components/MenuCard";

const bg_image = require("../assets/bg.png");

export default function RoleSelectionPage() {
  return (
    <View style={styles.container}>
      <Image source={bg_image} resizeMode="center" />

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
          <Text style={{ ...styles.heading1 }}>Bem-vindo!</Text>
          <Text style={styles.heading2}>Selecione seu perfil de usuário</Text>
        </View>

        <View style={{ gap: 24 }}>
          <MenuCard
            text="Sou Gerente"
            href="/login?role=manager"
            inverted={true}
          />

          <MenuCard
            text="Sou Motorista"
            href="/login?role=driver"
            inverted={false}
          />
        </View>
      </View>
    </View>
  );
}
