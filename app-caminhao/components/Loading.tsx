import { Button } from "@rneui/themed";
import { View } from "react-native";
import { styles } from "../styles";

export default function Loading() {
  return (
    <View style={styles.container}>
      <Button
        title="Solid"
        type="clear"
        loading
        style={{ backgroundColor: "white" }}
      />
    </View>
  );
}
