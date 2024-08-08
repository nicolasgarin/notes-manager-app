import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NoteManager from './components/NoteManager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NoteManager />
    <StatusBar style="auto" />
    </GestureHandlerRootView>
    </>
  );
}


