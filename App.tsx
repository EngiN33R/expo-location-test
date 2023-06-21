import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const TASK_NAME = "GEOCODING_TASK";

TaskManager.defineTask(
  TASK_NAME,
  async ({
    data,
    error,
  }: {
    data: any;
    error: TaskManager.TaskManagerError;
  }) => {
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      console.log(data.locations);
      const lastLocation = data.locations.pop();
      const address = (
        await Location.reverseGeocodeAsync(lastLocation.coords)
      )?.[0];
      console.log(`country: ${address.isoCountryCode}`);
    }
  }
);

const initLocationUpdates = async () => {
  console.log("Starting location updates");
  await Location.requestForegroundPermissionsAsync();
  await Location.requestBackgroundPermissionsAsync();
  await Location.startLocationUpdatesAsync(TASK_NAME, {
    accuracy: Location.Accuracy.Lowest,
    timeInterval: 1000,
    distanceInterval: 1,
    deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
  });
};

const stopLocationUpdates = async () => {
  console.log("Terminating location updates");
  await Location.stopLocationUpdatesAsync(TASK_NAME);
};

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button title="Start" onPress={initLocationUpdates} />
      <Button title="Stop" onPress={stopLocationUpdates} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
