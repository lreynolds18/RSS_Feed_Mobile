import React, { Component } from 'react';

import {
  AsyncStorage, 
  FlatList,
  StyleSheet,
  TouchableOpacity 
} from 'react-native';

import { 
  Button, 
  Container, 
  Content, 
  Icon,
  Input, 
  Item,
  ListItem, 
  Left,
  Right,
  SwipeRow,
  Switch,
  Text,
  View
} from 'native-base';

export default class Settings extends Component {
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
  }

  /*
   * componentDidMount - call asyncstorage to get current feeds value
   * only calling asyncstorage on mount and update (go back)
   */
  async componentDidMount() {
    // AsyncStorage.getItem('feeds')
    //  .then((value) => this.setState({ 'feeds': value }));
  }

  /*
   * addRSSFeed - add RSS Feed
   * gets RSS Feed site from textinput, checks if valid, then pushs to state
   */ 
  addRSSFeed() {
    let feeds = [...this.state.feeds];
    // TODO: verify that new_site is a valid rss feed
    // TODO: push error message on invalid rss feed
    feeds.push({on: true, site: this.state.new_site});
    this.setState({ feeds: feeds, new_site: "" });
  }

  /*
   * deleteRSS - deletes item from state feeds
   * update async every time?
   */
  deleteRSS(index) {
    let feeds = [...this.state.feeds];

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
    let feeds = [...this.state.feeds];
    feeds[index].on = !feeds[index].on;
    this.setState({ feeds: feeds });
  }

  /*
   * render - render jsx
   */
  render() {
    return (
      <Container>
      {/* <Container style={styles.view}> */}
        <Content style={styles.container}>

        {/* Generate List of RSS Feeds */}
        <FlatList
          style={styles.listContainer}
          data={this.state.feeds}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => 
            <SwipeRow
              disableRightSwipe={true}
              rightOpenValue={-60}
              body={
                <View>
                <TouchableOpacity onPress={() => this.toggleRSS(index)}>
                    <Text 
                      style={{
                        textDecorationLine: (item.on ? 'none' : 'line-through')
                      }}
                    >
                      { item.site }
                    </Text>
                </TouchableOpacity> 
                </View>
              }
              right={
                <Button full danger onPress={ () => this.deleteRSS(index) }>
                  <Icon active name="trash" />
                </Button>
              }
            />
          }
        />

        <View style={styles.controlContainer}>
        <Item>
          <Input 
            onChangeText={(new_site) => this.setState({new_site})}
            value={this.state.new_site}
            placeholder="Type here to add new RSS feeds"
          />
          {/* <Icon name='checkmark-circle' /> */}
          <Button success
            onPress={ () => this.addRSSFeed() }
            accessibilityLabel="Press button to add website RSS feed"
          >
            <Icon type='FontAwesome' name='plus' />
          </Button>
        </Item>
    
        <Item>
          <Button rounded
            onPress={() => this.props.navigation.navigate('Feed')}
            style = {{ backgroundColor: '#3e3f40' }}
            accessibilityLabel="Press button to update settings and navigate back to main feed."
          >
            <Text>Update!</Text>
          </Button>
        </Item>
        </View>

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  listContainer: {
    flex: 3,
  },
  controlContainer: {
    flex: 2,
    alignItems: 'center',
  },
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
