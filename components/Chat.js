import React from 'react';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { LogBox } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGINGSENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
  };

  export default class Chat extends React.Component {
    constructor() {
      super();
      this.state = {
        messages: [],
        uid: 0,
        user: {
          _id: '',
          name: '',
          avatar: '',
        },
        isConnected: false,
        image: null,
        location: null
      };
      
      //initialise firebase
      if(!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      this.referenceChatMessages = firebase.firestore().collection('messages');
      this.refMsgUser = null;

      //removes warning message in the console
      LogBox.ignoreLogs(['Setting a timer for a long period of time']);
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
          image: data.image || null,
          location: data.location || null,
        })
      })
      this.setState({
        messages: messages,
      })
    };

    //get messages from AsyncStorage
    getMessages = async () => {
      let messages ='';
      try {
        messages = (await AsyncStorage.getItem('messages')) || [];
        this.setState({
          messages: JSON.parse(messages),
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    //saves messages on the AsyncStorage
    saveMessages = async () => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
      } catch (error) {
        console.log(error.message)
      }
    };
    
     //deleted message from AsynStorage 
    deleteMessages = async () => {
      try {
        await AsyncStorage.removeItem('messages');
        this.setState({
          messages: [],
        })
      } catch (error) {
        console.log(error.message)
      }
    };

    componentDidMount() {
      let { name } = this.props.route.params;
      //Adds the name on top of screen
      this.props.navigation.setOptions({ title: name })

      //Find out the user's connection status
      NetInfo.fetch().then(connection => {
        if(connection.isConnected) {
          this.setState({ isConnected: true});
          console.log('online')
        }
      })

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
            user: this.state.user,
            image: message.image || '',
            location: message.location || null
          });
        }
      
      onSend(messages = []) {
        this.setState(
          previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
          }),
          () => {
            this.addMessages();
            this.saveMessages();
          });
      }

      renderInputToolBar(props) {
        if (this.state.isConnected == false) {
        } else {
          return(
            <InputToolbar
            {...props}
            />
          )
        }
      }

      renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
          return (
            <MapView
              style={{
                width: 150,
                height: 100,
                borderRadius: 13,
                margin: 3
              }}
              region = {{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              />
          )
        }
        return null;;;
      }

      renderCustomActions(props) {
        return <CustomActions {...props}/>
      };

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
        //cloess connections when the user closes the app
        NetInfo.fetch().then((connection)=> {
          if (connection.isConnected) {
            this.unsubscribe();
            this.authUnsubscribe();
          }
        });
      }
       

      render() {
        let bgColor = this.props.route.params.bgColor;

        return(
          <View style={styles.container}>
            <View style={{...styles.container, backgroundColor: bgColor ? bgColor: '#FFF'}}>
              
              <GiftedChat
               renderBubble={this.renderBubble.bind(this)}
               renderInputToolbar={this.renderInputToolBar.bind(this)}
               renderActions={this.renderCustomActions}
               renderCustomView={this.renderCustomView}
               messages={this.state.messages}
               onSend={messages => this.onSend(messages)}
               user={{
                 _id: this.state.user._id,
                 name: this.state.name,
                 avatar: this.state.user.avatar
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












  