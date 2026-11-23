import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen.js';
import ScanScreen from './screens/ScanScreen.js';
import HistoryScreen from './screens/HistoryScreen.js';
import MapScreen from './screens/MapScreen.js';
import LoginScreen from './screens/LoginScreen.js';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        <Stack.Screen name="Scan" component={ScanScreen}></Stack.Screen>
        <Stack.Screen name="History" component={HistoryScreen}></Stack.Screen>
        <Stack.Screen name="Map" component={MapScreen}></Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
      </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
