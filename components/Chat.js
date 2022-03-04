import React from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDgF6f_6SFQ0s-R8nAjtqPImE30XxWl6Mo",
    authDomain: "test-6145a.firebaseapp.com",
    projectId: "test-6145a",
    storageBucket: "test-6145a.appspot.com",
    messagingSenderId: "477716821300",
    appId: "1:477716821300:web:23e6aa11afba2868d9e161",
    measurementId: "G-09K86M3VQN"
  };

  export default class Chat extends React.Component {
    constructor() {
      super();
      this.state = {
        messages: [],
        uid: 0,
        loggedInText: 'Please wait, you are getting logged in',
        user: {
          _id: '',
          name: '',
          avatar: ''
        }
      }
      
  
  //initialize firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    };

  // reference to the Firestore messages collection
  this.referenceChatMessages = firebase.firestore().collection("messages");
  this.refMsgUser = null;
  
  onCollectionUpdate = QuerySnapshot => {
      const messages = [];
      //go through each document
      QuerySnapshot.forEach(doc => {
          //get the queryDocumentSnapshot's data
          let data = doc.data();
          messages.push({
              _id: data._id,
              text: data.text,
              createdAt: data.createdAt.toDate(),
              user: {
                  _id: data.user._id,
                  name: data.user.name,
                  avatar: data.user.avatar,
              },
              image: data.image || null,
          });
      });
      this.setState({
          messages: messages
      });
  };

  componentDidMount(); {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }}

    //attaches messages to chat
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    //changes the color of the bubble 
    renderBubble(props) {
        return (
            <Bubble
              {...props}
              wrapperStyle={{
                  right: {
                      backgroundColor: '#00ced1'
                  }
              }}
            />
        )
   }

    componentWillUnmount() {
        // close connections when we close the app
        NetInfo.fetch().then((connection) => {
          if (connection.isConnected) {
            this.unsubscribe();
            this.authUnsubscribe();
          }
        });
      }

    render() {
        let bgColor = this.props.route.params.bgColor;

        return (
            <View style={styles.container}>
                <View style={{...styles.container, backgroundColor: bgColor ? bgColor: '#FFF'}}>

            <GiftedChat
             renderBubble={this.renderBubble.bind(this)}
             messages={this.state.messages}
             onSend={messages => this.onSend(messages)}
             user={{
                _id: 1,
            }}/>
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/>
            : null
            }
            </View>
        </View>
    
        );
     }
 }
 const styles = StyleSheet.create({
     container: {
         flex: 1
     }
 })

