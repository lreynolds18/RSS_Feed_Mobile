import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import FeedScreen from './src/Feed';
import SettingsScreen from './src/Settings';


const RootStack = createStackNavigator(
  {
    Feed: FeedScreen,
    Settings: SettingsScreen
  },
  {
    initialRouteName: 'Feed',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

// Main Entry Point for App
export default class App extends Component {
  render() {
    return <RootStack />;
  }
}
