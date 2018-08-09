import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { ActionSheet, Root, Toast } from 'native-base';

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
// TODO: change AsyncStorage key 'feed' to 'RSS_Feed'
// TODO: verify that empty AsyncStorage triggers message instead of loading spinner
export default class App extends Component {
  
  /*
   * constructor - set RSS in state
   */
  constructor(props) {
      super(props);
      this.state = { RSS: [] };
  }

  /*
   * getRSS - returns RSS from state
   *          purely define to maintain symmetry 
   */
  getRSS() {
      return this.state.RSS;
  }

  /*
   * setRSS - store RSS in state
   */
  setRSS(RSS) {
      this.setState({ RSS: RSS });
  }

  /*
   * setASRSS - set RSS in state and AsyncStorage
   */
  async setASRSS(RSS) {
      try {
          await AsyncStorage.setItem(
            "feeds", 
            JSON.stringify(this.state.RSS)
          );
      } catch (error) {
          console.warn("Error pushing to AsyncStorage", error);
      }
  }

  /*
   * getRSS - getRSS data from AsyncStorage or from state
   */
  async getASRSS() {
      try {
          const response = await AsyncStorage.getItem("feeds");
          if (response !== null) {
              let json = JSON.parse(response);
              let RSS = Array.from(json);
              console.log(RSS[0]);
              this.setState({ RSS: RSS });
              return RSS;
          }
      } catch (error) {
          console.warn("Error fetching from AsyncStorage", error);
      }
  }

  /*
   * componentDidMount - Load font package for native base
   *                     & Load content from AsyncStorage
   */
  async componentDidMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      });

      // await this.getASRSS();
  }

  componentWillUnmount() {
      Toast.toastInstance = null;
  }

  /*
   * render - render jsx for app
   *          Root needed so native base knows where to put Toast notifications
   */
  render() {
      const props = {
          setRSS: this.setRSS.bind(this), 
          getRSS: this.getRSS.bind(this),
          setASRSS: this.setASRSS.bind(this),
          getASRSS: this.getASRSS.bind(this),
      };

      return (
          <Root>
              <RootStack screenProps={ props } />
          </Root>
      );
  }
}
