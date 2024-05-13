import { Card, Icon, ListItem } from "@rneui/base";
import { styles } from "../styles";
import { Text } from "react-native";

export default function RouteCard({ origin, destination }: any) {
  return (
    <Card containerStyle={styles.route_card}>
      {origin && (
        <ListItem id={`list_route_${origin.name}`}>
          <Icon name="place" size={28} />
          <ListItem.Content>
            <Text style={styles.route_helper_text}>From:</Text>
            <ListItem.Title>{origin.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      )}
      {destination && (
        <ListItem id={`list_route_${destination.name}`}>
          <Icon name="truck" type="font-awesome" size={28} />
          <ListItem.Content>
            <Text style={styles.route_helper_text}>To:</Text>
            <ListItem.Title>{destination.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      )}
    </Card>
  );
}
