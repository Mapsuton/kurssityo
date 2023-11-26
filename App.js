import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './HomeScreen'
import InfoScreen from './InfoScreen'
import DogScreen from './DogScreen'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Koti') {
            iconName = 'md-home';
          } else if (route.name === 'Tiedot') {
            iconName = 'information-circle';
          }
          else if (route.name === 'Uusi koira') {
            iconName = 'paw';
          }
          return <Ionicons name={iconName} size={size} color={color} />; //it returns an icon component
        },
      })}>
        <Tab.Screen name="Koti" component={HomeScreen} />
        <Tab.Screen name="Uusi koira" component={DogScreen} />
        <Tab.Screen name="Tiedot" component={InfoScreen} />
      </Tab.Navigator>
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
