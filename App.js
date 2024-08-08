import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import NoteManager from "./components/NoteManager";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    amaticSC: require("./assets/fonts/AmaticSC-Regular.ttf"),
    amaticSCBold: require("./assets/fonts/AmaticSC-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NoteManager />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </>
  );
}
