import React from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hey You',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'Welcome to the Chat Room',
                    createdAt: new Date(),
                    system: true,
                },

            ]
        })
    }

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
