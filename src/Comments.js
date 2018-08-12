import React, { Component } from "react";
import { 
    FlatList, 
    StyleSheet,
    WebView
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

export default class Comments extends Component {
  /*
   * navigationOptions - set style/text for navigation bar
   */
  static navigationOptions = ({ navigation, navigationOptions }) => {
      return {
          title: "Comments",
          headerStyle: { backgroundColor: navigationOptions.headerTintColor },
          headerTintColor: navigationOptions.headerStyle.backgroundColor,
      };
  };

  /*
   * constructor - 
   * @props - props passed
   */
  constructor(props) {
     super(props);
     this.state = { comments: [] };
  }

  /*
   * componentDidMount - fetch comments
   */
  async componentDidMount() {
      const comments = this.props.navigation.state.params.item.comments + ".rss";
      const response = await fetch(comments);
      const responseText = await response.text();

      parseString(responseText, (err, result) => {
          result.feed.entry.shift();
          this.setState({ comments: result.feed.entry });
      });      
  }

  /*
   * render - Display main post (title, content or webview of link)
   *          & display comments
   */
  render() {
      const item = this.props.navigation.state.params.item;

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
                  <Text>{ item.title }</Text>
                  { this.renderContent(item) }
                  { this.renderListOfComments() }
              </Content>
          </Container>
      );
  }

  /*
   * renderContent - Display main post content or webview of link
   */
  renderContent(item) {
      if (item.comments === item.link){
          return (
              <HTMLView
                stylesheet={styles}
                value={ this.props.navigation.state.params.item.content }
              />     
          );
      } else {
          return (
              <WebView
                source={{uri: item.link}}
              />
          );
      }
  }

  /*
   * renderListOfComments - Displays list of comments 
   */
  renderListOfComments() {
      return (
          <FlatList
            style={{flex: 1}}
            data={this.state.comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => 
                this.renderSingleComment(item)
            }
          />
      );
  }

  /*
   * renderSingleComment - Generates comment from html
   */
  renderSingleComment(item) {
      return (
          <ListItem style={{flex: 1, flexDirection:"column", justifyContent:"flex-start"}}>
              <HTMLView
                  stylesheet={styles}
                  value={ item.content[0]._ }
              />
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
