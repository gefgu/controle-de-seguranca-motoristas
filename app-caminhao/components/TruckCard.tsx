import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";

const mode_1 = require("../assets/1.jpg");
const mode_2 = require("../assets/2.jpg");
const mode_3 = require("../assets/3.jpg");

const styles = {
  container: {
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    //borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    //borderColor: "black",
    //borderWidth: 1,
  },
};

export default function TruckCard({
  status,
  driver_id,
}: {
  status: number;
  driver_id: string;
}) {
  return (
    <Link asChild href={`./map/${driver_id}`}>
      <TouchableOpacity style={styles.container}>
        <Text>Caminhão</Text>
        {/* {status === 0 && <Image source={require('./images.jpeg')} />} */}
        {status === 1 && <Image source={mode_1} />}
        {status === 2 && <Image source={mode_2} />}
        {status === 3 && <Image source={mode_3} />}
      </TouchableOpacity>
    </Link>
  );
}
