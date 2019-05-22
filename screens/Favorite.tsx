import React from "react";
import {CameraRoll, FlatList, Image, Text, ToastAndroid, View} from "react-native";
import {Button, SearchBar} from "react-native-elements";
import {Constants} from "expo";
import DoubleClick from 'react-native-single-double-click';
import {Body, Card, CardItem, Icon, Left, Right} from "native-base";
import { FileSystem } from 'expo';

export default class Favorite extends React.Component {


    state = {
        search: '',
        token: global.token,
        list: [],
        fullList: [],
        seed: 1,
        page: 0,
        isLoading: false,
        refresh: false,
    };


    pagination = 1;
    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            if (this.state.page == 5) {
                this.setState({
                    page: 0
                })
                this.searchConfirm(this.pagination)
                this.pagination++;
            }
            this.setState({refreshing: true,})
            console.log("page"+this.state.page)
            this.setState({list: this.state.fullList.slice(this.state.page * 10, this.state.page * 10 + 10)})
            this.setState({refreshing: false,})
        });
    };

    componentDidMount(): void {
        this.getFav(0)
    }

    AddFav(id) {
        this.setState({refreshing: true, page: 1})
        console.log("id", id)
        console.log("token", global.token)
        fetch("https://api.imgur.com/3/image/" + id + "/favorite", {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + global.token,
                },
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                ToastAndroid.show(responseJson.success.toString() + responseJson.status.toString(), ToastAndroid.SHORT);
            }).catch((error) => {
            console.error(error);
        });
    }

    getFav(pag) {
        this.setState({refreshing: true, page:0})
        fetch("https://api.imgur.com/3/account/" + global.username + "/favorites/" + pag + "/all", {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global.token,
                },
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({fullList: responseJson.data})
                this.setState({list: responseJson.data.slice(0, 10)})
                this.setState({refreshing: false});
            }).catch((error) => {
            console.error(error);
        });
    }

    handleDoubleClick(item, index) {
        this.AddFav(item.id)
        this.setState({refreshing: true,})
        let newArray = [...this.state.list];
        newArray = newArray.slice(0,index).concat(newArray.slice(index+1, newArray.length))
        let newArray1 = [...this.state.fullList];
        newArray1 = newArray1.slice(0,index).concat(newArray1.slice(index+1, newArray1.length))
        this.setState({fullList: newArray1});
        this.setState({list: newArray});
        this.setState({refreshing: false,})
    }

    private download(item) {
        FileSystem.downloadAsync(
            item.link,
            FileSystem.documentDirectory + item.link.split('/')[3]
        )
            .then(({uri}) => {
                CameraRoll.saveToCameraRoll(uri).then((uriGallery) => {
                    ToastAndroid.show('Finished downloading to ' + uriGallery.toString(), ToastAndroid.SHORT);

                })
            })
            .catch(error => {
                console.error(error);
            });

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    extraData={this.state.refresh}
                    keyExtractor={i => i.id}
                    data={this.state.list}
                    renderItem={({item, index}) => {
                        if (item.link) {
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
                                            <Image
                                                key={item.link}
                                                style={{width: null, height: 200, flex: 1, resizeMode: 'contain'}}
                                                source={{
                                                    uri: item.link,
                                                }}
                                            />
                                        </CardItem>
                                        <CardItem>
                                            <Right>
                                                <Icon name={"md-download"} type={"Ionicons"} onPress={()=>this.download(item)}/>
                                            </Right>
                                        </CardItem>
                                    </Card>
                                </DoubleClick>)
                        } else return null;
                    }}
                />
                <Button onPress={this.handleLoadMore} style={{flex: 1}} title={'Load More'}/>
            </View>
        );
    }
}
