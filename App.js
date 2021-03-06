import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { ActionSheet, Root, Toast } from 'native-base';

import FeedScreen from './src/Feed';
import SettingsScreen from './src/Settings';
import CommentsScreen from './src/Comments';


// Create navigator routes
const RootStack = createStackNavigator(
  {
    Feed: FeedScreen,
    Settings: SettingsScreen,
    Comments: CommentsScreen
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
   * RSS: main list of RSS feeds to display in app.  Used in Feed and Setting.
   *      Pulled from AsyncStorage.
   */
  state = { RSS: [] };

  /*
   * getRSS - returns RSS from state
   *          purely define to maintain symmetry 
   */
  getRSS() {
      return this.state.RSS;
  }

  /*
   * setRSS - store RSS in state
   *
   * @RSS: new RSS feeds to update state with
   */
  setRSS(RSS) {
      this.setState({ RSS: RSS });
  }

  /*
   * setAsyncStorageRSS - set RSS in Async Storage
   */
  async setAsyncStorageRSS() {
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
   * getAsyncStorageRSS - get RSS data from AsyncStorage
   *
   * TODO: check if empty response from AsyncStorage
   */
  async getAsyncStorageRSS() {
      if (this.state.RSS.length === 0) {
          try {
              const response = await AsyncStorage.getItem("feeds");
              if (response !== null) {
                  let json = JSON.parse(response);
                  let RSS = Array.from(json);
                  this.setState({ RSS: RSS });
                  return RSS;
              }
          } catch (error) {
              console.warn("Error fetching from AsyncStorage", error);
          }
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

      // await this.getAsyncStorageRSS();
  }

  /*
   * componentWillUnmount - Supposedly this will help toasts work 
   *                        It doesn't
   */
  componentWillUnmount() {
      Toast.toastInstance = null;
  }

  /*
   * render - Render jsx for app
   *          Root needed so native base knows where to put Toast notifications
   */
  render() {
      const props = {
          setRSS: this.setRSS.bind(this), 
          getRSS: this.getRSS.bind(this),
          setAsyncStorageRSS: this.setAsyncStorageRSS.bind(this),
          getAsyncStorageRSS: this.getAsyncStorageRSS.bind(this),
      };

      return (
          <Root>
              <RootStack screenProps={ props } />
          </Root>
      );
  }
}
