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
        //Sets the page title once the Chat is loaded
        let name = this.props.route.params.name;
        //Adss the name to the top of the screen
        this.props.navigation.setOptions({ title: name });
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
                      backgroundColor: '#000'
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
