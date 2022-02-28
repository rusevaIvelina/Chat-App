import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }
    
    render() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        const { bgColor } = this.props.route.params;

        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bgColor
            }}>
                <Text>Hello Chat</Text>
            </View>
        );
    }
}

