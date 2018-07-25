import React, { Component } from 'react';
import { StyleSheet, Button, TextInput, View } from 'react-native';

export default class SetFeed extends Component {
  /*
   * navigationOptions - set style/text for navigation bar
   */
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'Settings',
      headerStyle: { backgroundColor: navigationOptions.headerTintColor },
      headerTintColor: navigationOptions.headerStyle.backgroundColor,
    };
  };

  /*
   * getRSSFeeds - get RSS feeds from AsyncStorage
   */ 
  getRSSFeeds() {
    
  }


  /*
   * setRSSFeeds - set RSS feeds in AsyncStorage
   */ 
  setRSSFeeds() {
    this.props.navigation.navigate('Feed');
  }

  /*
   * render - render jsx
   */
  render() {
    return (
      <View style={styles.view}>
        <TextInput
          style={styles.textinput}
          placeholder="Type here to add new RSS feeds!"
          onChangeText={(text) => this.setState({text})}
        />
    
        <Button
          onPress={this.setRSSFeeds}
          title="Add RSS Feeds"
          color="#3e3f40"
          accessibilityLabel="Press button to add website RSS feed"
        />

        <Button
          onPress={() => this.props.navigation.navigate('Feed')}
          title="Go Back"
          color="#3e3f40"
          accessibilityLabel="Press button to navigate back to main feed."
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    height: 50,
    color: '#fff',
  }
});
