import React from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDgF6f_6SFQ0s-R8nAjtqPImE30XxWl6Mo",
    authDomain: "test-6145a.firebaseapp.com",
    projectId: "test-6145a",
    storageBucket: "test-6145a.appspot.com",
    messagingSenderId: "477716821300",
    appId: "1:477716821300:web:23e6aa11afba2868d9e161",
    measurementId: "G-09K86M3VQN"
  };

  export default class Chat extends Component {
    constructor() {
      super();
      this.state = {
        messages: [],
        uid: 0,
        user: {
          _id: '',
          name: '',
          avatar: '',
        }
      };

      if(!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      this.referenceChatMessages = firebase.firestore().collection('messages');
      this.refMsgUser = null;
    }

    onCollectionUpdate = QuerySnapshot => {
      const messages = [];
      //go through each document
      QuerySnapshot.forEach(doc => {
        let data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user_id,
            name: data.user.name,
            avatar: data.user.avatar,
          },
        })
      })
      this.setState({
        messages: messages,
      })
    };

    componentDidMount() {
      let { name } = this.props.route.params;
      this.props.navigation.setOptions({ title: name })

      this.unsubscribe = this.referenceChatMessages
					.orderBy('createdAt', 'desc')
					.onSnapshot(this.onCollectionUpdate);

          this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async user => {
            if (!user) {
              return await firebase.auth().signInAnonymously();
            }
            //update user state with currently active data
            this.setState({
              uid: user.uid,
              messages: [],
              user: {
                _id: user.uid,
                name: name,
                avatar: 'https://placeimg.com/140/140/any',
              },
            });

            //referencing messages of current user
            this.refMsgUser = firebase
                  .firestore()
                  .collection('messages')
                  .where('uid', '===', this.state.uid);
          });
    }
      addMessages() {
          const message = this.state.messages[0];
          //add a new message to the collection
          this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: this.state.user
          });
        }
      
      onSend(messages = []) {
        this.setState(
          previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
          }),
          () => {
            this.saveMessages();
            this.addMessages();
          });
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
        this.unsubscribe();
        this.authUnsubscribe();
      }

      render() {
        let bgColor = this.props.route.params.bgColor;

        return(
          <View style={StyleSheet.container}>
            <View style={{...StyleSheet.container, backgroundColor: bgColor ? bgColor: '#FFF'}}>
              
              <GiftedChat
               renderBubble={this.renderBubble.bind(this)}
               messages={this.state.messages}
               onSend={messages => this.onSend(messages)}
               user={{
                 _id: 1,
               }}/>
               {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/>
               : null
              }
              </View>
            </View>
        );
      }}

      const styles = StyleSheet.create({
        container: {
          flex: 1
        }
      })












  