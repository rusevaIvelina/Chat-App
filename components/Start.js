import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ImageBackground, Image } from 'react-native';


export default class Start extends React.Component {
    constructor(props) {
        super(props);

        //state will be updated whit whatever values change for the specific state
        this.state = { 
            name: '',
            bgColor: ''
    };
}

       //updates the state with the background color for the Chat screen choosen by the user
       changeBgColor = (newColor) => {
           this.setState({ bgColor: newColor});
       };

       //background colors for the user to choose from
       colors = {
        dark: '#090C08',
        purple: '#474056',
        blue: '#8A95A5',
        green: '#B9C6AE'
       }

    render() {
        return (
            <View style={StyleSheet.container}>

               <ImageBackground style={styles.container} source={require('../BgImage.png')} resizeMode="cover" >

                    <View style={StyleSheet.titleBox}>
                        <Text style={StyleSheet.title}>ChatApp</Text>
                    </View>
                     
                     <View style={StyleSheet.box1}>
                         <View style={StyleSheet.inputBox}>
                             
                             <TextInput
                                style={StyleSheet.input}
                                onChangeText={(text) => this.setState({ name: text})}
                                value={this.state.name}
                                placeholder='Your Name'
                            />
                         </View>

                         <View style={StyleSheet.colorBox}>
                             <Text style={StyleSheet.chooseColor}>Choose Background Color:</Text>
                         </View>

                         <Pressable
                            style={StyleSheet.button}
                            onPress={() => this.props.navigation.navigate('Chat', {
                              name: this.state.name,
                              bgColor: this.state.bgColor
                            })}>
                                <Text style={StyleSheet.buttonText}>Start Chatting</Text>
                            </Pressable>
                     </View>
                </ImageBackground>
            </View>
           
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
    },
  
    backgroundImage: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    titleBox: {
      height: '50%',
      width: '88%',
      alignItems: 'center',
      paddingTop: 100
    },
  
    title: {
      fontSize: 45, 
      fontWeight: "600", 
      color: '#FFFFFF',
    },
  
    box1: {
      backgroundColor: 'white', 
      height: '44%',
      width: '88%',
      justifyContent: 'space-around', 
      alignItems: 'center',
  
    },
  
    inputBox: {
      borderWidth: 2,
      borderRadius: 1,
      borderColor: 'grey',
      width: '88%',
      height: 60,
      paddingLeft: 20,
      flexDirection: 'row',
      alignItems: 'center'
    },
  
    image: {
      width: 20,
      height: 20,
      marginRight: 10
    },
  
    input: {
      fontSize: 16, 
      fontWeight: "300", 
      color: '#757083', 
      opacity: 0.5,
    },
  
    colorBox: {
      marginRight: 'auto',
      paddingLeft: 15,
      width: '88%'
    },
  
    chooseColor: {
      fontSize: 16, 
      fontWeight: "300", 
      color: '#757083', 
      opacity: 1,
    },
  
    colorArray: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '88%',
      paddingRight: 60
    },
  
    color1: {
      backgroundColor: '#090C08',
      width: 50,
      height: 50,
      borderRadius: 25
    },
  
    color2: {
      backgroundColor: '#474056',
      width: 50,
      height: 50,
      borderRadius: 25
    },
  
    color3: {
      backgroundColor: '#8A95A5',
      width: 50,
      height: 50,
      borderRadius: 25
    },
  
    color4: {
      backgroundColor: '#B9C6AE',
      width: 50,
      height: 50,
      borderRadius: 25
    },
  
    button: {
      width: '88%',
      height: 70,
      backgroundColor: '#757083',
      alignItems: 'center',
      justifyContent: 'center'
    },
  
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: "600"
    }
  });

