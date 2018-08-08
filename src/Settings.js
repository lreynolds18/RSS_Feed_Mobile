import React, { Component } from "react";

import {
    AsyncStorage, 
    FlatList,
    Keyboard,
    StyleSheet,
    TouchableOpacity 
} from "react-native";

import { 
    Button, 
    Container, 
    Content, 
    Icon,
    Input, 
    Item,
    SwipeRow,
    Text,
    Toast,
    View
} from "native-base";

import Colors from "./Colors";

export default class Settings extends Component {
  /*
   * navigationOptions - set style/text for navigation bar
   * TODO: have Settings make button in header call setRSS
   */
  static navigationOptions = ({ navigation, navigationOptions }) => {
      return {
          title: "Settings",
          headerStyle: { backgroundColor: navigationOptions.headerTintColor },
          headerTintColor: navigationOptions.headerStyle.backgroundColor,
          /*
          header: ({ goBack }) => ({
            left: <Icon name={'chevron-left'} onPress={() => {this.setRSS()}} />,
          }),
          */
      };
  };

  /*
   * constructor - 
   */
  constructor(props) {
      super(props);
      this.state = { new_site: "" };
  }

  /*
   * componentDidMount - call asyncstorage to get current feeds value
   * only calling asyncstorage on mount and update (go back)
   *
   * TODO: feeds in asyncstorage should actually be RSS
   */
  componentDidMount() {
      this.getRSS();
  }


  /*
   * getRSS - pull RSS feeds from AsyncStorage
   */
  getRSS() {
      AsyncStorage
          .getItem("feeds")
          .then((value) => {
              if (value) {
                  this.props.screenProps.setRSS(JSON.parse(value));
              }
          })
          .catch((error) => {
              console.log(error);
          });
  }

  /*
   * setRSS - push RSS feeds to AsyncStorage
   */
  setRSS() {
      AsyncStorage
          .setItem("feeds", JSON.stringify(this.props.screenProps.RSS))
          .catch((error) => {
              console.log(error);
          });
      this.props.navigation.navigate("Feed");
  }

  /*
   * addRSSFeed - add RSS Feed
   * gets RSS Feed site from textinput, checks if valid, then pushs to state
   */ 
  addRSSFeed() {
      // TODO: trigger keyboard to close on button press

      let re = new RegExp("[Hh]ttps?://.*(json)|(rss)");
      if (this.state.new_site === "" || !re.test(this.state.new_site)) {
          Toast.show({
              text: "Error: RSS feed must be a valid site",
              buttonText: "OK",
              type: "warning",
              duration: 1500,
              position: "bottom",
              style: { bottom: "50%" }
          });

          Keyboard.dismiss();
      } else {
          Toast.show({
              text: "Success! Added " + new_site,
              buttonText: "OK",
              type: "success",
              duration: 1500,
              position: "bottom",
              style: { bottom: "50%" }
          });

          let RSS = [...this.props.screenProps.RSS];
          let new_site = this.state.new_site.toLowerCase();
          RSS.push({on: true, site: new_site});
          this.props.screenProps.setRSS(RSS);
          this.setState({ new_site: "" });
      }
  }

  /*
   * deleteRSS - delete item from RSS
   */
  deleteRSS(index) {
      let RSS = [...this.props.screenProps.RSS];

      // delete element from array
      // if only one element left then initializes empty array
      // otherwise splice the element out
      RSS.length === 1 ? RSS = [] : RSS.splice(index, 1);

      this.props.screenProps.setRSS(RSS);
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
   * renderActivateRSS - builds JSX for the Activate RSS List
   * body is each list RSS and each RSS can be turned on/off
   * right gives option to swipe the item to open up a option to delete
   *
   * TODO: I want to be able to group RSS feeds together
   * IE: JS group has some JS RSS, /r/reactjs, /r/javascript
   * and ML group has /r/machinelearning, /r/datascience, etc...
   */
  renderActivateRSS(item, index) {
      return (
          <SwipeRow
              style={{ backgroundColor: Colors.backgroundColor }}
              disableRightSwipe={true}
              rightOpenValue={-51}
              body={
                  <View>
                      <TouchableOpacity onPress={() => this.toggleRSS(index)}>
                          <Text 
                              style={{
                                  color: Colors.primaryTextColor,
                                  textDecorationLine: (item.on ? "none" : "line-through")
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
      );
  }

  /*
   * renderControlContainer - builds JSX for the Control Container 
   * 
   */
  renderControlContainer() {
      return (
          <View style={styles.controlContainer}>
              <Item style={{borderColor: "transparent"}}>
                  <Input 
                      style={{ color: Colors.primaryTextColor }}
                      placeholderTextColor={ Colors.primaryTextColor }
                      onChangeText={(new_site) => this.setState({new_site})}
                      value={this.state.new_site}
                      placeholder="Type here to add new RSS Feed"
                  />
                  <Button success full
                      onPress={ () => this.addRSSFeed() }
                      accessibilityLabel="Press button to add website RSS Feed"
                  >
                      <Icon type='FontAwesome' name='plus' />
                  </Button>
              </Item>
    
              <Item style={{borderColor: "transparent"}}>
                  <Button rounded
                      onPress={() => this.setRSS()}
                      style = {{ backgroundColor: "#3e3f40" }}
                      accessibilityLabel="Press button to update settings and go back."
                  >
                      <Text>Update!</Text>
                  </Button>
              </Item>
          </View>
      );
  }

  /*
   * render - render jsx
   */
  render() {
      return (
          <Container>
              <Content 
                  style={styles.container}
                  contentContainerStyle={{
                      justifyContent:"center",
                  }}
              >

                  {/* TODO: make list take 80% of screen and buttons take 20% */}
                  {/* Generate List of RSS */}
                  <FlatList
                      style={styles.listContainer}
                      data={this.props.screenProps.RSS}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => 
                          this.renderActivateRSS(item, index)
                      }
                  />

                  {/* Generate control input/button to add feed, button to update */}
                  { this.renderControlContainer() } 
              </Content>
          </Container>
      );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.backgroundColor
    },
    listContainer: {
        flex: 0.8,
        backgroundColor: Colors.backgroundColor,
    },
    controlContainer: {
        flex: 0.2,
        alignItems: "center",
    },
});
