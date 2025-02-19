import {StyleSheet, Button, View} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AbrevvaBle, BleDevice } from "@evva/abrevva-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";

type ItemProps = {mac: string};

const Item = ({mac}: ItemProps) => (
  <ThemedView style={styles.item}>
    <ThemedText style={styles.itemTitle}>{mac}</ThemedText>
  </ThemedView>
);

export default function TabThreeScreen() {
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [scanLabel, setScanLabel] = useState<string>("Start Scan");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  let addDevice = (device: BleDevice) => {
    if (!devices.map(e => e.deviceId).includes(device.deviceId)) {
      devices.push(device);
    }
    setDevices([...devices, device]);
  }

  let onPressScanButton = async () => {
    await AbrevvaBle.initialize();
    await AbrevvaBle.startScan((device) => {
      addDevice(device);
    }, () => {
      setIsScanning(true);
      setScanLabel("Scanning ...");
      setDevices([]);
    }, () => {
      setIsScanning(false);
      setScanLabel("Start Scan");
    }, undefined, false);
  }

  return (
    <SafeAreaProvider>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="wifi"
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={{textAlign: 'left'}} type="title">Scan</ThemedText>
          <Button
            onPress={onPressScanButton}
            title={scanLabel}
            color="#841584"
            accessibilityLabel="Scan Button"
            disabled={isScanning}
          />
        </ThemedView>
        <ThemedText>Here a list of found EVVA components will be shown.</ThemedText>
        {devices.map((item, index) => (
          <View key={index}>
            <Item mac={item.advertisementData?.manufacturerData?.identifier || "unknown"} />
          </View>
        ))}
      </ParallaxScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 8,
    marginVertical: 6,
    marginHorizontal: 0,
  },
  itemTitle: {
    fontSize: 20,
  },
});
