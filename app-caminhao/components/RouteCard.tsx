import { Card, Icon, ListItem } from "@rneui/base";
import { styles } from "../styles";
import { Text } from "react-native";

export default function RouteCard({
  origin_name,
  destination_name,
}: {
  origin_name: string;
  destination_name: string;
}) {
  return (
    <Card containerStyle={styles.route_card}>
      <ListItem>
        <Icon name="place" size={28} />
        <ListItem.Content>
          <Text style={styles.route_helper_text}>De:</Text>
          <ListItem.Title>{origin_name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem>
        <Icon name="truck" type="font-awesome" size={28} />
        <ListItem.Content>
          <Text style={styles.route_helper_text}>Para:</Text>
          <ListItem.Title>{destination_name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </Card>
  );
}
