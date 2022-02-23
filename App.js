import React from 'react';
import { StyleSheet } from 'react-native';
import Chat from './components/Chat';
import Start from './components/Start';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//create navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start}/>
        <Stack.Screen name='Chat' component={Chat}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7661b2',
    alignItems: 'center',
    justifyContent: 'center'
  }
})