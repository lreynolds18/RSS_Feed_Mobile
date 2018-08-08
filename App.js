import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import { Root } from "native-base";

import FeedScreen from './src/Feed';
import SettingsScreen from './src/Settings';


// Create navigator routes
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
 
  state = {
    RSS: []
  };

  setRSS = (RSS) => this.setState({RSS});

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
  }

  render() {
    const props = { setRSS: this.setRSS, RSS: this.state.RSS };
    return (
        <Root>
          <RootStack screenProps={ props } />
        </Root>
    );
  }
}
