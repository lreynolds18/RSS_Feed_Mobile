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
  
  /*
   * constructor - set RSS in state
   */
  constructor(props) {
      super(props);
      this.state = { RSS: [] };
  }

  /*
   * setRSS - set state value RSS -- needed for child components to set State
   */
  setRSS = (RSS) => this.setState({ RSS: RSS });

  /*
   * componentDidMount - Load font package for native base
   */
  async componentDidMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
  }

  /*
   * render - render jsx for app
   *          Root needed so native base knows where to put Toast notifications
   */
  render() {
    const props = { setRSS: this.setRSS.bind(this), RSS: this.state.RSS };
    return (
        <Root>
          <RootStack screenProps={ props } />
        </Root>
    );
  }
}
