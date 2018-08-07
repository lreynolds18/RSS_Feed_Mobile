import React, { Component } from "react";
import { 
    AsyncStorage, 
    FlatList, 
    StyleSheet,
    Platform,
    WebView,
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
import HTMLView from 'react-native-htmlview';

import Colors from "./Colors";

// TODO: check if shouldComponentUpdate(nextProps, nextState) can update the 
//       state when the objects in state are partially changed
//       (instead of having to redefine an array)
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
      this.state = { failed: false, RSS: [], feeds: []} ;
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
              this.setState({ failed: false });
              if (value !== null) {
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
          }, (error) => {
              this.setState({ failed: true });
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
    let content = xml.content[0]['_'];
    // content = content.substring(content.lastIndexOf("<div class=\"md\">") + 16, content.lastIndexOf("</div>")); 

    const data = {
      author: xml.author[0].name[0],
      title: xml.title[0],
      link: xml.link[0].$.href,
      content: content,
    };
    
    return data;
  }

  /*
   * renderRSSFeed - build each view for every link in rss
   */
  renderRSSFeed(item, index) {
      // <Text style={{color: Colors.primaryTextColor}}>{ author }</Text>


      //    <ListItem style={{flex: 1, flexDirection:"column", justifyContent:"center"}}>
      //        <Text style={{color: Colors.primaryTextColor, flex: 0.1}}>{ link }</Text>
      /*
              <View style={{flex: 0.9}}>
                  <WebView
                    style={{flex: 0.9}}
                    source={{ html: data.content }} 
                    scalesPageToFit={ true }
                    scrollEnabled={ false }
                  />
              </View>
      */
      const data = this.parseRedditXML(item);
      // console.log(data);
      return (
          <ListItem style={{flex: 1, flexDirection:"column", justifyContent:"flex-start"}}>
              <Text style={{color: Colors.primaryTextColor, flex: 0.1}}>{ data.title }</Text>
              <HTMLView
                  style={{flex:0.9}} 
                  stylesheet={styles}
                  value={ data.content }
              />
          </ListItem>
      );
  }

  /* 
   * Generate List of RSS Feeds 
   */
  renderBody() {
      if (this.state.feeds.length === 0 && this.state.failed === false) {
          return ( <Spinner color='gray' /> );
      } else if (this.state.feeds.length === 0 && this.state.failed === true) {
          return ( 
              <Text 
                style={{flex: 1, flexDirection:"column", justifyContent: "center", color: Colors.primaryTextColor}}>
                  Enter some RSS feeds to get started!
              </Text>
          );
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

const styles = StyleSheet.create({
  div: {
    color: Colors.primaryTextColor
  }
});
