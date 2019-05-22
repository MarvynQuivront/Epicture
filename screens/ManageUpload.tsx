import React, {Component} from "react";
import {CameraRoll, FlatList, Image, Text, ToastAndroid, View} from "react-native";
import {Body, Card, CardItem, Icon, Left, Right} from "native-base";
import {Button} from "react-native-elements";
import {FileSystem} from 'expo';
import DoubleClick from 'react-native-single-double-click';

export default class ManageUpload extends Component {
    state = {
        search: '',
        token: global.token,
        list: [],
        refreshing: false,
    };

    delete(item) {
        fetch("https://api.imgur.com/3/account/"+global.username+"/image/"+item, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + global.token,
                },
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                ToastAndroid.show('Item Deleted ', ToastAndroid.SHORT);
            }).catch((error) => {
            console.error(error);
        });
    }

    handleDoubleClick(item, index) {
        this.delete(item.id)
        this.setState({refreshing: true,})
        let newArray = [...this.state.list];
        newArray = newArray.slice(0,index).concat(newArray.slice(index+1, newArray.length))
        this.setState({list: newArray});
        this.setState({refreshing: false,})
    }

    getUpload() {
        this.setState({refreshing: true});
        fetch("https://api.imgur.com/3/account/me/images", {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global.token,
                },
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({list: responseJson.data})
                this.setState({refreshing: false});
            }).catch((error) => {
            console.error(error);
        });
    }

    componentDidMount(): void {
        this.getUpload()
    }


    render() {
        return (
            <View>
                <FlatList
                    keyExtractor={i => i.id}
                    data={this.state.list}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.getUpload()}
                    renderItem={({item, index}) => {
                        return (
                            <DoubleClick
                                onDoubleClick={() => this.handleDoubleClick(item, index)}
                                onClick={() => {
                                }}
                                underlayColor={'transparent'}
                                style={{
                                    flex: 1
                                }}>
                                <Card style={{
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 4,
                                    },
                                    shadowOpacity: 0.30,
                                    shadowRadius: 4.65,
                                    elevation: 8,
                                    flex: 1
                                }}>
                                    <CardItem cardBody>
                                        {
                                            item.images != null ? item.images.map((y) => {
                                                return (<Image
                                                    key={y.id}
                                                    style={{width: null, height: 200, flex: 1,}}
                                                    source={{
                                                        uri: y.link,
                                                    }}
                                                />);
                                            }) : <Image
                                                key={item.link}
                                                style={{width: null, height: 200, flex: 1}}
                                                source={{
                                                    uri: item.link,
                                                }}
                                            />}
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Text>{item.title}</Text>
                                        </Left>
                                        <Right>
                                            <Icon name={"md-download"} type={"Ionicons"}
                                                  onPress={() => this.download(item)}/>
                                        </Right>
                                    </CardItem>
                                </Card>
                            </DoubleClick>
                        )
                    }}
                />
            </View>
        )
    }

    private download(item) {
        FileSystem.downloadAsync(
            item.link,
            FileSystem.documentDirectory + item.link.split('/')[3]
        )
            .then(({uri}) => {
                CameraRoll.saveToCameraRoll(uri).then((uriGallery) => {
                    console.log('Finished downloading to ', uriGallery);
                })
            })
            .catch(error => {
                console.error(error);
            });

    }
}