import React, { Component } from "react";
import { 
    FlatList, 
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    Container,
    Content,
    Fab,
    Icon,
    ListItem,
    Spinner,
    Text,
    View,
} from "native-base";
import { parseString } from "react-native-xml2js";
import HTMLView from "react-native-htmlview";

import Colors from "./Colors";

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
   * failed: TODO: remove
   * feeds: each post/content from RSS feed. Pulled from fetch call
   */
  state = { 
    failed: false, 
    feeds: [],
  };

  /*
   * componentDidMount - get feeds from asyncstorage
   */
  async componentDidMount() {
      await this.props.screenProps.getAsyncStorageRSS();
      await this.fetchData();
  }

  /* 
   * parseEntries - given xml or json, 
   *                find the entries and 
   *                extract out the title, link, content, etc for each one
   *
   * @response - either xml or json, object returned from fetch call
   * @site - hostname of site used (reddit, news.ycombinator, twitter...)
   * @type - response type either of xml or json
   *
   * TODO: write parsing for JSON and setState
   * TODO: write XML/JSON parser for reddit, hackernews, twitter, etc...
   * TODO: refactor code / use html parser
   * TODO: change comments to comments_link.  Add date and points
   */
  parseEntries(response, site, type) {
      switch (site) {
          case "reddit":
              if (type === "xml") {
                  let entries = response.feed.entry;
                  entries.forEach(function(item, index, arr) {
                      let content = item.content[0]._;
                      // extract second half
                      let linkAndComments = content.substring(
                        content.lastIndexOf("<!-- SC_ON -->"), 
                        content.length
                      );

                      // extract link and comment a href tags
                      linkAndComments = linkAndComments.substring(
                        linkAndComments.indexOf("<span>"),
                        linkAndComments.lastIndexOf("</span>")
                      );
                  
                      // extract link
                      let link = linkAndComments.substring(
                        linkAndComments.indexOf("<a href=") + 9,
                        linkAndComments.indexOf(">[link]</a>") - 1
                      );
                      
                      // extract comments
                      let comments = linkAndComments.substring(
                        linkAndComments.lastIndexOf("<a href=") + 9,
                        linkAndComments.lastIndexOf(">[comments]</a>") - 1
                      );

                      content = content.substring(
                        content.lastIndexOf("<!-- SC_OFF -->") + 15,
                        content.lastIndexOf("<!-- SC_ON -->")
                      ); 
                      arr[index] = {
                        // author: item.author[0].name[0],
                        title: item.title[0],
                        // link: item.link[0].$.href,
                        link: link,
                        comments: comments,
                        content: content,
                      };
                  });
                  return entries;
              } else if (type === "json") {
                  console.log(response);
                  console.warn("Error: unsupported");
              }
          case "news.ycombinator":
          case "twitter":
          default:
              console.warn("Error: unsupported website");
      }
  }

  /*
   * fetchData - get RSS Feeds from AsyncStorage or this.props.screenProps.RSS
   *             then call makeXMLRequest or makeJSONRequest depending on ending
   *
   * note: http fetchs will not work on IOS
   *       https://facebook.github.io/react-native/docs/network)
   *       We are only accepting https in Setting.js addRSS function
   */
  async fetchData() {
      try {
          let RSS = this.props.screenProps.getRSS();
          if (RSS !== null) {
              RSS.forEach(async (rss) => {
                  if (rss.on) {
                      // TODO: move to Settings.js
                      let calltype = rss.site.substring(
                        rss.site.lastIndexOf('.')+1, rss.site.length
                      );
                      if (calltype === "rss") {
                          calltype = "xml";
                      }
                      // TODO: make general
                      let site = rss.site.substring(
                        rss.site.lastIndexOf('//')+2, rss.site.lastIndexOf('.com')
                      );

                      const response = await fetch(rss.site);
                      if (calltype === "xml") {
                          const responseText = await response.text();
                          parseString(responseText, (err, result) => {
                              let feeds = [
                                ...this.state.feeds, 
                                ...this.parseEntries(result, site, calltype)
                              ];
                              this.setState({ feeds: feeds });
                          });
                      } else if (calltype === "json") {
                          const responseJson = await response.json();
                          let feeds = [
                            ...this.state.feeds, 
                            ...this.parseEntries(responseText, site, calltype)
                          ];
                      }
                  }
              });
          } else {
              this.setState({ failed: true });
          }
      } catch(error) {
          this.setState({ failed: true });
          console.warn("Error fetching data", error);
      }
  }

  /*
   * render - Render jsx of Feed page
   *
   * TODO: re-render on back and/or state change
   *       https://www.reddit.com/r/reactnative/comments/69xm4p/react_navigation_tab_change_event/
   */
  render() {
      return (
          <Container>
              <Content 
                  style={{backgroundColor: Colors.backgroundColor}}
                  contentContainerstyle={{
                      flex: 1, 
                      flexDirection:"column", 
                      justifyContent:"center",
                      alignItems: "center"
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
                      textAlignVertical: "center",
                      textAlign: 'center',
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
                  renderItem={({ item }) => 
                      this.renderRSSFeed(item)
                  }
              />
          );
      }
  }

  /*
   * renderRSSFeed - Build each view for every link in rss
   *
   * @item - entry item from each post.  Contains content, link, 
   *         comments (link to comments), author, date
   */
  renderRSSFeed(item) {
      return (
          <ListItem style={{flex: 1, flexDirection:"column", justifyContent:"flex-start"}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Comments", {item: item})}>
              <Text 
                  style={{
                      color: Colors.primaryTextColor, 
                      flex: 0.1
                  }}
              >
                  { item.title }
              </Text>
              <HTMLView
                  style={{flex:0.9}} 
                  stylesheet={styles}
                  value={ item.content }
              />
              </TouchableOpacity>
          </ListItem>
      );
  }
}

// TODO: extract all inline styling to here
const styles = StyleSheet.create({
    div: {
        color: Colors.primaryTextColor
    }
});
