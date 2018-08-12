import React, { Component } from "react";

import {
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
   * newRSSUrl: New RSS feed website.  Input field updates newRSSUrl on change 
   *           and it's used in addRSS.
   */
  state = { newRSSUrl: "" };

  /*
   * componentDidMount - call asyncstorage to get current feeds value
   * only calling asyncstorage on mount and update (go back)
   */
  async componentDidMount() {
      await this.props.screenProps.getAsyncStorageRSS();
  }

  /*
   * goBack - set RSS in AsyncStorage and return to feed page
   */
  goBack() {
      this.props.screenProps.setAsyncStorageRSS();
      this.props.navigation.navigate("Feed");
  }

  /*
   * addRSSFeed - add the RSS Feed in newRSSUrl
   * gets RSS Feed site from textinput, checks if valid, then pushs to state
   *
   * TODO: Figure out why Toasts don't fire / don't fire immediately
   *       It's wrapped in Root component
   *       Debugger is off
   *
   * notes: - regexp only accepts https because you can't make fetch calls to 
   *          http on ios w/o additionally libraries
   */ 
  addRSSFeed() {
      let re = new RegExp("^[Hh]ttps:\/\/.*((json)|(rss))$");
      let newRSSUrl = this.state.newRSSUrl.toLowerCase();
      if (newRSSUrl !== "" && re.test(newRSSUrl)) {
          // Success
          Toast.show({
              text: "Success! Added " + newRSSUrl,
              buttonText: "OK",
              type: "success",
              duration: 1500,
              position: "bottom",
              style: { bottom: "50%" }
          });

          Keyboard.dismiss();

          let RSS = [...this.props.screenProps.getRSS()];
          RSS.push({on: true, site: newRSSUrl});
          this.props.screenProps.setRSS(RSS);
          this.setState({ newRSSUrl: "" });
      } else {
          // Failure
          Toast.show({
              text: "Error: RSS feed must be a valid site",
              buttonText: "OK",
              type: "warning",
              duration: 1500,
              position: "bottom",
              style: { bottom: "50%" }
          });

          Keyboard.dismiss();
      }
  }

  /*
   * deleteRSS - delete item from RSS
   */
  deleteRSS(index) {
      let RSS = [...this.props.screenProps.getRSS()];

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
      let RSS = [...this.props.screenProps.getRSS()];
      console.log(RSS, index);

      RSS[index].on = !RSS[index].on;

      this.props.screenProps.setRSS(RSS);
  }

  /*
   * renderActivateRSS - Builds JSX for the Activate RSS List
   * Body is each list RSS and each RSS can be turned on/off
   * Right gives option to swipe the item to open up a option to delete
   *
   * @item: Each RSS Feed to display 
   * @index: Spot the item is in list.
   *
   * TODO: load slows / can't manipulate while loading
   * TODO: delete buttons show up on switch screen (before & after)
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
                      onChangeText={(newRSSUrl) => this.setState({newRSSUrl})}
                      value={this.state.newRSSUrl}
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
                      onPress={() => this.goBack()}
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
   * render - Renders a list of RSS feeds and control input and buttons
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
                  {/* Generate List of RSS */}
                  <FlatList
                      style={styles.listContainer}
                      data={this.props.screenProps.getRSS()}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item, index}) => 
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

// TODO: extract all inline styling to here
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
