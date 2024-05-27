import { View, Text } from "react-native";
import { styles } from "../../styles";
import TruckCard from "../../components/TruckCard";

export default function Overview() {
  return (
    <View style={styles.spaced_out_container}>
      <TruckCard status={1} />
      <TruckCard status={2} />
      <TruckCard status={3} />
    </View>
  );
}
