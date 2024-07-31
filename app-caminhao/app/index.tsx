import { ListItem, Text } from "@rneui/base";
import { TouchableOpacity, View } from "react-native";
import { styles } from "../styles";
import { Link } from "expo-router";
import MenuCard from "../components/MenuCard";

export default function Page() {
  return (
    <View style={{ ...styles.container, gap: 32 }}>
      <MenuCard text="Gerente" href="/manager/overview" />

      <MenuCard text="Motorista" href="/driver" />
    </View>
  );
}
