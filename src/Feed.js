import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Feed extends React.Component {
  /*
   * constructor - 
   */
  constructor(props) {
    super(props);
    this.state ={ isLoading: true}
  }

  /*
   * componentDidMount - 
   */
  componentDidMount() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        console.log('success', request.responseText);
      } else {
        console.warn('error: ' + request.status);
      }
    };

    request.open('GET', 'https://reddit.com/r/datascience.rss');
    request.send();
    console.log(request);
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
      <View style={styles.container}>
        <Text style={styles.text}>Open up App.js to start working on your app!</Text>
        <Text style={styles.text}>Changes you make will automatically reload.</Text>
        <Text style={styles.text}>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff'
  }
});
