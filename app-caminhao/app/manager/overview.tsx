import { View, Text } from "react-native";
import { styles } from "../../styles";
import TruckCard from "../../components/TruckCard";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

type DriversIds = {
  id: string;
  name: string;
};

async function getDrivers(): Promise<DriversIds[]> {
  const { data, error } = await supabase.from("drivers").select("*");

  return data as DriversIds[];
}

export default function Overview() {
  const [driverData, setDriverData] = useState<DriversIds[]>();

  useEffect(() => {
    getDrivers().then((d) => setDriverData(d));
  }, []);

  if (!driverData) {
    return <Loading />;
  }

  return (
    <View style={styles.spaced_out_container}>
      {driverData.map((driver, index) => (
        <TruckCard status={index + 1} key={driver.id} driver_id={driver.id} />
      ))}
    </View>
  );
}
