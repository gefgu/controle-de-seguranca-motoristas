import { ListItem, Text } from "@rneui/base";
import { TouchableOpacity, View } from "react-native";
import { styles } from "../styles";
import { Link } from "expo-router";

export default function Page() {
  return (
    <View style={{ ...styles.container, gap: 32 }}>
      <Link href="/manager/overview" asChild>
        <TouchableOpacity style={styles.menu_card}>
          <ListItem>
            <Text>Gerente</Text>
          </ListItem>
        </TouchableOpacity>
      </Link>

      <Link href="/driver/map" asChild>
        <TouchableOpacity style={styles.menu_card}>
          <ListItem>
            <Text>Motorista</Text>
          </ListItem>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
