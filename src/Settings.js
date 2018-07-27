import React, { Component } from 'react';
import { AsyncStorage, Button, FlatList, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

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
   * constructor - 
   */
  constructor(props) {
    super(props);
    this.state = { feeds: [{on: true, site: "https://reddit.com/r/datascience.rss"}, {on: true, site: "https://reddit.com/r/cscareerquestions.rss"}, {on: false, site: "https://reddit.com/r/machinelearning.rss"}], new_site: "" };

    // this.toggleRSS = this.toggleRSS.bind(this);
  }

  /*
   * componentDidMount - call asyncstorage to get current feeds value
   */
  componentDidMount() {
    // AsyncStorage.getItem('feeds')
    //  .then((value) => this.setState({ 'feeds': value }));
  }

  /*
   * setRSSFeeds - set RSS feeds in AsyncStorage
   * gets site from textinput, checks if valid, then pushs to state/async
   */ 
  setRSSFeeds() {
    feeds = this.state.feeds;
    // feeds.push();
    // this.setState( feeds:  
    // AsyncStorage.setItem('feeds', this.state.feeds);
  }

  /*
   * deleteRSS - deletes item from state feeds
   * update async every time?
   */
  deleteRSS(index) {
    let feeds = this.state.feeds;

    // delete element from array
    // if only one element left then initializes empty array
    // otherwise splice the element out
    feeds.length === 1 ? feeds = [] : feeds.splice(index, 1);

    this.setState({ feeds: feeds });
  }

  /*
   * toggleRSS - toggles if we look for RSS feed by switch
   */
  toggleRSS(index) {
    let feeds = this.state.feeds;
    feeds[index].on = !feeds[index].on;
    // create a deep copy because flatlist is a pure component
    // and doesn't update when feeds isn't reinitialized #WHY?
    // TODO: Refactor this
    feeds = JSON.parse(JSON.stringify(feeds));
    this.setState({ feeds: feeds });
  }

  /*
   * render - render jsx
   */
  render() {
    return (
      <View style={styles.view}>

        <FlatList
          data={this.state.feeds}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View>
              <Text style={styles.textinput}>{ item.site }</Text>
              <Switch onValueChange={ () => this.toggleRSS(index) } value={ item.on } />
              <Button onPress={ () => this.deleteRSS(index) } title="Delete" />
            </View>
          )}
        />

        <TextInput
          style={styles.textinput}
           onChangeText={(new_site) => this.setState({new_site})}
          placeholder="Type here to add new RSS feeds!"
        />
    
        <Button
          onPress={ () => this.setRSSFeeds() }
          title="Add RSS Feed"
          color="#3e3f40"
          accessibilityLabel="Press button to add website RSS feed"
        />

        <Button
          onPress={() => this.props.navigation.navigate('Feed')}
          title="Update"
          color="#3e3f40"
          accessibilityLabel="Press button to update settings and navigate back to main feed."
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
    color: '#fff',
  }
});
