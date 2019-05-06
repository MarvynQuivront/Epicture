import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    Alert,
} from 'react-native';
import {AsyncStorage} from 'react-native';
import {AuthSession} from "expo";
import ImgurFeed from "./ImgurFeed";

export default class LoginView extends Component {

    constructor(props) {
        super(props);
        state = {
            email: '',
            password: '',
        }
    }

    _signInAsync = async () => {
        const {navigation} = this.props;
        const redirectUrl = AuthSession.getRedirectUrl();
        const result = await AuthSession.startAsync({
            authUrl:
                `https://api.imgur.com/oauth2/authorize?client_id=8b04798a72b74e0&response_type=token&state=APPLICATION_STATE`
        });
        console.log(result);
        const {type, errorCode = 'You cancel or dismissed the login'} = result;
        if (type === 'success') {
            let t = result.params.access_token
            let u = result.params.account_username
            console.log(AuthSession.getRedirectUrl());
            global.token = t;
            global.username = u;
            navigation.navigate('Main', {token: t});
        } else {
            this.setState({errorCode});
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this._signInAsync}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    loginText: {
        color: 'white',
    }
});