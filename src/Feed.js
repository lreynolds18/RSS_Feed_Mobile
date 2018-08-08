import React, { Component } from "react";
import { 
    AsyncStorage, 
    FlatList, 
    StyleSheet,
} from "react-native";
import {
    Container,
    Content,
    Fab,
    Icon,
    ListItem,
    Spinner,
    Text,
} from "native-base";
import { parseString } from "react-native-xml2js";
import HTMLView from "react-native-htmlview";

import Colors from "./Colors";

// TODO: figure out where to put asyncstorage and xml calls
// TODO: beautifully display text / video

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
      this.state = { failed: false, feeds: [] };
      console.log("in constuctor");
  }

  componentWillMount() {
    console.log("will mount");
  }

  componentDidUpdate() {
    console.log("did update");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("should update");
    return true;
  }

  componentWillUnmount() {
    console.log("unmount");
  }

  /*
   * componentDidMount - get feeds from asyncstorage
   */
  async componentDidMount() {
      console.log("did mount"); 
      fetchData();
  }

  /*
   * fetchData - get RSS Feeds from AsyncStorage or this.props.screenProps.RSS
   *             then call makeXMLRequest or makeJSONRequest depending on ending
   * TODO: can we handle async calls better?
   * TODO: handle json calls
   *
   */
  async fetchData() {
      try {
          const RSS = await AsyncStorage.getItem("feeds");
          if (RSS !== null) {
              RSS = [...JSON.parse(RSS)];
              this.props.screenProps.setRSS(RSS);
          
              RSS.forEach((rss) => {
                  if (rss.on) {
                      this.makeXMLRequest(rss.site);
                  }); 
              }
          } else {
              this.setState({ failed: true });
          }
      } catch(error) {
          this.setState({ failed: true });
          console.warn("Error fetching data", error);
      }
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
   * parseRedditXML - Extract meaningful data from XML.
   *                  Process content html into something that react native 
   *                  can handle.
   */
  parseRedditXML(xml) {
      let content = xml.content[0]["_"];
      /*
      content = content.substring(
        content.lastIndexOf("<div class=\"md\">") + 16, 
        content.lastIndexOf("</div>")
      ); 
      */
      const data = {
          author: xml.author[0].name[0],
          title: xml.title[0],
          link: xml.link[0].$.href,
          content: content,
      };
    
      return data;
  }

  /*
   * render - Render jsx of Feed page
   * TODO: re-render on back and/or state change
   *       https://www.reddit.com/r/reactnative/comments/69xm4p/react_navigation_tab_change_event/
   */
  render() {
      console.log("render");
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

  /* 
   * renderBody - Either Generate List of RSS Feeds, Loading Spinner, or Text
   */
  renderBody() {
      if (this.state.failed === true) {
          // No data in AsyncStorage
          return ( 
              <Text 
                  style={{
                      flex: 1,
                      flexDirection:"column",
                      justifyContent: "center", 
                      color: Colors.primaryTextColor
                  }}
              >
                  Enter some RSS feeds to get started!
              </Text>
          );
      } else if (this.state.failed === false && this.state.feeds.length === 0) {
          // Still trying to pull data from AsyncStorage and Fetchs
          return ( 
              <Spinner color='gray' />
          );
      } else {
          // Pulled data
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
   * renderRSSFeed - Build each view for every link in rss
   */
  renderRSSFeed(item, index) {
      const data = this.parseRedditXML(item);
      // console.log(data);
      return (
          <ListItem style={{flex: 1, flexDirection:"column", justifyContent:"flex-start"}}>
              <Text 
                  style={{
                      color: Colors.primaryTextColor, 
                      flex: 0.1
                  }}
              >
                  { data.title }
              </Text>
              <HTMLView
                  style={{flex:0.9}} 
                  stylesheet={styles}
                  value={ data.content }
              />
          </ListItem>
      );
  }
}

const styles = StyleSheet.create({
    div: {
        color: Colors.primaryTextColor
    }
});
