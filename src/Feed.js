import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Button, Text, View } from 'react-native';

export default class Feed extends Component {
  /*
   * navigationOptions - set style/text for navigation bar
   */
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'Feed',
      headerStyle: { backgroundColor: navigationOptions.headerTintColor },
      headerTintColor: navigationOptions.headerStyle.backgroundColor,
    };
  };

  /*
   * constructor - 
   */
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  /*
   * componentDidMount - 
   */
  componentDidMount() {
    // this.setState({ 'feeds': value }));

    /*
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        // console.log('success', request.responseText);
        console.log(request.responseText);
      } else {
        console.warn('error: ' + request.status);
      }
    };

    AsyncStorage
      .getItem('feeds')
      .then((value) => {
        value.forEach((site) => {
          request.open('GET', site);
          request.send();
        });
      });
    */
    // console.log(request);
  }

  /*
   * link_builder - build each view for every link in rss
   */
  link_builder(link) {
    return (
        <Text>Hello There</Text>
    );
  }

  /*
   * render - render jsx
   */
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>Open up App.js to start working on your app!</Text>

        <Button
          onPress={() => this.props.navigation.navigate('Settings')}
          title="Change Settings"
          color="#3e3f40"
          accessibilityLabel="Press button to change settings."
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
  text: {
    color: '#fff'
  }
});
