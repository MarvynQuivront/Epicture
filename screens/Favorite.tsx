import React from "react";
import {FlatList, Image, Text, ToastAndroid, View} from "react-native";
import {Button, SearchBar} from "react-native-elements";
import {Constants} from "expo";
import DoubleClick from 'react-native-single-double-click';
import {Body, Card, CardItem, Icon, Left, Right} from "native-base";

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
        let newArray = [...this.state.list];
        newArray[index].link = null
        let newArray1 = [...this.state.fullList];
        newArray1[index].link = null
        this.setState({fullList: newArray1});
        this.setState({list: newArray});
    }

    pagination = 1;

    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            if (this.state.page == 6) {
                this.getFav(this.pagination)
                this.pagination++;
            }
            this.setState({refreshing: true,})
            console.log(this.state.fullList)
            this.setState({list: this.state.fullList.slice(this.state.page * 10, this.state.page * 10 + 10)})
            this.setState({refreshing: false,})
        });
    };

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
