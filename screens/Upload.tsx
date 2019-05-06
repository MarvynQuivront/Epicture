import React ,{Component} from "react";
import {Alert, Button, SafeAreaView, TextInput, Image, ToastAndroid} from "react-native";
import {ImagePicker} from 'expo';
import {Permissions} from "expo";

export default class Upload extends Component {


    state = {
        image: null,
        image64: null,
        title : undefined
    };

    constructor(props) {
        super(props);
    }



    render() {
        let {image} = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(title) => this.setState({title:title})}
                    value={this.state.title}
                />
                <Button
                    title="Pick an image from camera roll"
                    onPress={this._pickImage}
                />
                {image &&
                <Image  source={{uri: image}} style={{width: 200, height: 200}}/>}
                <Button
                    title="Confirm"
                    onPress={() => {
                        fetch("https://api.imgur.com/3/image", {
                                method: 'POST',
                                headers: {
                                    'Authorization':  'Bearer ' + global.token,
                                },
                            body: JSON.stringify({
                                "image": this.state.image64,
                                "type": 'base64',
                            })
                            }
                        )
                            .then((response) => {
                                console.log(response)
                                response.json()})
                            .then((responseJson) => {

                            }).catch((error) => {
                            console.error(error);
                        });
                    }}
                />
            </SafeAreaView>
        );
    }

    _pickImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL)
        Alert.alert(
            'Ajouter une photo',
            'Choisir une photo de la galerie ou en prendre une nouvelle ?',
            [
                {
                    text: 'Ouvrir la camera', onPress: async () => {
                        let result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            base64: true,
                            aspect: [4, 3],
                        });
                        console.log(result);

                        if (!result.cancelled) {
                            this.setState({image: result.uri,image64: result.base64});
                        }
                    }
                },
                {
                    text: 'Ouvrir la galerie', onPress: async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            allowsEditing: true,
                            base64:true,
                            aspect: [4, 3],
                        });
                        console.log(result);

                        if (!result.cancelled) {
                            this.setState({image: result.uri, image64: result.base64});
                        }
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        );

    };



}