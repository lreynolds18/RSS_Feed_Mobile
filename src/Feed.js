import React, { Component } from "react";
import { 
    AsyncStorage, 
    FlatList, 
//    StyleSheet,
} from "react-native";
import {
    Container,
    Content,
    Fab,
    Icon,
    Item,
    ListItem,
    Spinner,
    Text,
    View,
} from "native-base";
import { parseString } from "react-native-xml2js";

import Colors from "./Colors";


export default class Feed extends Component {
  /*
   * navigationOptions - set style/text for navigation bar
   */
  static navigationOptions = ({ navigation, navigationOptions }) => {
      return {
          title: "Feed",
          headerStyle: { backgroundColor: navigationOptions.headerTintColor },
          headerTintColor: navigationOptions.headerStyle.backgroundColor,
      };
  };

  /*
   * constructor - 
   */
  constructor(props) {
      super(props);
      this.state = { RSS: [], feeds: []} ;
  }

  /*
   * componentDidMount - get feeds from asyncstorage
   * then call makeXMLRequest or makeJSONRequest depending on api call
   * TODO: should this be in componentWillMount or componentDidMount or something else
   * componentWillMount is depreciated 
   * https://reactjs.org/docs/react-component.html#unsafe_componentwillmount
   * TODO: should this have async in front of it
   * TODO: can we handle async calls better?
   * TODO: handle json calls
   */
  componentDidMount() {
      // get sites to pull RSS Feed from
      console.log("in mnt");
      AsyncStorage.getItem("feeds")
          .then((value) => {
              if (value === null) {
                  // replace with text and button
                  Alert.alert(
                      "Error: no RSS feeds available",
                      "Please enter feeds in settings",
                      [ {text: "OK"}, ],
                      { cancelable: false }
                  );
              } else {
                  value = [...JSON.parse(value)];
                  this.setState({ "RSS": value });
          
                  value.forEach((rss) => {
                      if (rss.on) {
                          try {
                              this.makeXMLRequest(rss.site);
                          } catch (e) {
                              console.log("ERROR", rss.site, e);
                          }
                      }
                  }); 
              }
          })
          .catch((error) => {
              console.log(error);
          });
  }

  /*
   * makeRSSRequest - get xml from RSS request
   * @site - site to get rss feed data from
   */
  makeXMLRequest(site) {
      console.log("in fetch");
      var request = new XMLHttpRequest();

      request.onreadystatechange = () => {
      // request.onreadystatechange = (e) => {
          if (request.readyState !== 4) {
              return;
          }

          if (request.status === 200) {
              // console.log('success', request.responseText);
              parseString(request.response, (err, result) => {
                  let feeds = [...this.state.feeds, ...result.feed.entry];
                  this.setState({ feeds: feeds });
              });
          } else {
              console.warn("error: " + request.status);
          }
      };

      request.open("GET", site);
      request.send();
  }

  /*
   * renderRSSFeed - build each view for every link in rss
   */
  renderRSSFeed(item, index) {
      // const author = item.author[0].name[0];
      // <Text style={{color: Colors.primaryTextColor}}>{ author }</Text>

      const title = item.title[0];
      let content = item.content[0]['_'];
      content = content.substring(content.lastIndexOf("<p>") + 3, content.lastIndexOf("</p>"));
      const link = item.link[0].$.href;

      return (
          <ListItem style={{flex: 1, flexDirection:"column", justifyContent:"center"}}>
              <Text style={{color: Colors.primaryTextColor, flex: 0.1}}>{ title }</Text>
              <Text style={{color: Colors.primaryTextColor, flex: 0.8}}>{ content }</Text>
              <Text style={{color: Colors.primaryTextColor, flex: 0.1}}>{ link }</Text>
          </ListItem>
      );
  }

  /* 
   * Generate List of RSS Feeds 
   */
  renderBody() {
      if (this.state.feeds.length === 0) {
          return ( <Spinner color='gray' /> );
      } else {
          return (
              <FlatList
                  style={{flex: 1}}
                  data={this.state.feeds}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => 
                      this.renderRSSFeed(item, index)
                  }
              />
          );
      }
  }

  /*
   * render - render jsx
   */
  render() {
      console.log(this.state);
      return (
          <Container>
              <Content 
                  style={{backgroundColor: Colors.backgroundColor}}
                  contentContainerstyle={{
                      flex: 1, 
                      flexDirection:"column", 
                      justifyContent:"center"
                  }}
              >
                  { this.renderBody() }          
              </Content>

              <Fab
                  active={false}
                  containerStyle={{ }}
                  direction="up"
                  style={{ flex: 1, backgroundColor: Colors.primaryDarkColor }}
                  position="bottomRight"
                  onPress={() => this.props.navigation.navigate("Settings")}
                  accessibilityLabel="Press button to change settings.">
                  <Icon name="cog" />
              </Fab>
          </Container>
      );
  }
}

/*
const styles = StyleSheet.create({
});
*/
