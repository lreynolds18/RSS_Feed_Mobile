import React, { Component } from 'react';
import { AsyncStorage, FlatList, StyleSheet } from 'react-native';

import {
  Container,
  Content,
  Fab,
  Icon,
  Text,
  View,
} from 'native-base';

import Colors from './Colors';

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
    this.state = { isLoading: true, RSS: []};
  }

  componentDidMount() {
    try {
    AsyncStorage.getItem('feeds')
      .then((value) => {
        console.warn(value);
        if (value) {
          this.setState({ 'RSS': JSON.parse(value) })
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  /*
   * componentDidMount - 
   */
  componentWillMount() {
    console.log('in will mnt');
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
   * renderRSSFeed - build each view for every link in rss
   */
  renderRSSFeed(item, index) {
    return (
        <Text style={{color: Colors.primaryTextColor}}>{ item.site }</Text>
    );
  }

  /*
   * render - render jsx
   */
  render() {
    return (
      <Container>
        <Content 
          style={{backgroundColor: Colors.backgroundColor}}
          contentContainerstyle={{
            flex: 1, 
            flexDirection:'column', 
            justifyContent:'center'
          }}
        >
          
        {/* Generate List of RSS Feeds */}
        <FlatList
          style={{flex: 1}}
          data={this.state.RSS}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => 
            this.renderRSSFeed(item, index)
          }
        />
        </Content>

        <Fab
          active={false}
          containerStyle={{ }}
          direction="up"
          style={{ flex: 1, backgroundColor: Colors.primaryDarkColor }}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('Settings')}
          accessibilityLabel="Press button to change settings.">
          <Icon name="cog" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
});
