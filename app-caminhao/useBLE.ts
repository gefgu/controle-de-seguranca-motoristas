import { useEffect, useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  bleData: any;
  readDataFromDevice: any;
}

const SERVICE_UUID = "6a232ea8-eebe-4efc-bb8d-f91252f4d102";
const CHARACTERISTIC_UUID = "c316c762-786e-40bf-b082-e7da0753b0fe";

export default function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);

  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [bleData, setbleData] = useState<any>(null);

  // console.log(allDevices);
  // console.log(connectedDevice);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermissions = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Scan Permission",
        message: "App Requires Bluetooth Scanning",
        buttonPositive: "OK",
      }
    );

    const bluetoothConnectPermissions = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Scan Permission",
        message: "App Requires Bluetooth Scanning",
        buttonPositive: "OK",
      }
    );

    const bluetoothFineLocationPermissions = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACESS_FINE_LOCATION,
      {
        title: "Fine Location",
        message: "App Requires fine location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothConnectPermissions === "granted" &&
      bluetoothScanPermissions === "granted" &&
      bluetoothFineLocationPermissions === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice?.id === device?.id) > -1;

  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      setAllDevices((prevState: Device[]) => {
        if (!isDuplicateDevice(prevState, device as Device)) {
          return [...prevState, device];
        }
        return prevState;
      });
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      console.log("Connected to device");
      await bleManager.stopDeviceScan();
    } catch (error) {
      console.log("FAILED TO CONNECT", error);
      // await bleManager.cancelDeviceConnection(device.id);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  const readDataFromDevice = async (): Promise<any> => {
    if (connectedDevice) {
      try {
        const characteristic =
          await connectedDevice.readCharacteristicForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID
          );
        const value = base64.decode(characteristic.value);
        // console.log(value);
        if (bleData != value) setbleData(value);
        return value == "True";
      } catch (error) {
        if (error.message.includes("connected")) {
          await connectToDevice(connectedDevice);
          // Optionally, retry reading the characteristic after reconnecting
          return await readDataFromDevice();
        } else {
          console.error(error);
          throw error; // Re-throw the error if it's not related to connection
        }
      }
    } else {
      throw new Error("No connected device");
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    allDevices,
    bleData,
    readDataFromDevice,
  };
}
