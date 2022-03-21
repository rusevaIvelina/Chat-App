import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


export default class CustomActions extends React.Component {

//allow user to pick image from phone library
 imagePicker = async () => {
    //permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            }).catch((error) => {
                console.error(error);
            });
            if (!result.cancelled) {
                const imageUrl = await this.uploadImage(result.uri);
                this.props.onSend({ image: imageUrl});
            }
    }
} catch (error) {
    console.error(error)
}
}

//allows user to take photo from camera
  takePhoto = async () => {
    //permission to access camera and media library
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    try {
        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
            }).catch((error) => {
                console.log(error)
            });
            if (!result.cancelled) {
                const imageUrl = await this.uploadImage(result.uri);
                this.props.onSend({ image: imageUrl});
            }
        }
    } catch (error) {
        console.error(error)
    }
};

//upload image, BLOB (BINARY LARGE OBJECT), uploads image to firebase 
uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = newXMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.oneerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null)
    });
    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length -1];
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);
    blob.close();
    return await snapshot.ref.getDownloadURL();
};

//allows user to get their location
getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    try {
        if ( status === 'granted') {
            let result = await Location.getCurrentPositionAsync({
            }).catch((error) => {
                console.log(error)
            });
            if (!result) {
                this.props.onSend({
                    location: {
                        longitude: result.coords.longitude,
                        latitude: result.coords.latitude,
                    }
                })
            }
        }
    } catch (error) {
        console.error(error);
    }
};

    //handels all communication features 
    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length -1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return;
                    case 1:
                        console.log('user wants to take a photo')
                        return;
                    case 2:
                        console.log('user wants to get their location');
                        default:

                }
            },
        );
    };

    render() {
        return (
            <TouchableOpacity
              accessable={true}
              accessibilityLabel='More options'
              accessabiltyHint='Let you choose to share an image of your location'
              style={[styles.container]} onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                    </View>
                </TouchableOpacity>
        )
    }
}

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});