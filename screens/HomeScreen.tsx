import React from 'react';
import {
    AsyncStorage,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList, SafeAreaView, ToastAndroid
} from 'react-native';
import {Constants} from "expo";
import {Button, SearchBar} from 'react-native-elements';
import {Card, CardItem, Icon, Left, Right, Thumbnail, Body} from "native-base";
import DoubleClick from 'react-native-single-double-click';
import {Dat, Feed} from "./ImgurFeed";
import {JsonConvert, OperationMode, ValueCheckingMode} from "json2typescript";


const ITEMS_PER_PAGE = 10;
export default class HomeScreen extends React.Component {


    state = {
        search: '',
        token: global.token,
        list: [],
        fullList: [],
        seed: 1,
        page: 1,
        isLoading: false,
        refresh: false,
    };


    updateSearch = search => {
        this.setState({search});
    };


    constructor(props) {
        super(props)

    }

    pagination = 1;
    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            if (this.state.page == 6) {
                this.searchConfirm(this.pagination)
                this.pagination++;
            }
            this.setState({refreshing: true,})
            this.setState({list: this.state.fullList.slice(this.state.page * 10, this.state.page * 10 + 10)})
            this.setState({refreshing: false,})
        });
    };
    static navigationOptions = {
        header: null,
    };

    handleDoubleClick(item, index) {
        item.images != null ? item.images.map((y) => {
           this.AddFav(y.id)
        }) : this.AddFav(item.id)
        let newArray = [...this.state.list];
        newArray[index].favorite = !newArray[index].favorite;
        this.setState({list: newArray});
    }

    render() {
        const {search} = this.state;
        return (
            <View style={{flex: 1, paddingTop: Constants.statusBarHeight}}>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    onEndEditing={() => this.searchConfirm(0)}
                    value={search}
                />
                <FlatList
                    keyExtractor={i => i.id}
                    data={this.state.list}
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
                                    <CardItem>
                                        <Left>
                                            <Body>
                                                <Text>Upload by {item.account_url}</Text>
                                            </Body>
                                        </Left>
                                    </CardItem>
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
                                            {
                                                item.favorite == false ?
                                                    <Icon name={'heart'} style={{color: 'grey'}}/>
                                                    :
                                                    <Icon name={'heart'} style={{color: 'red'}}/>
                                            }
                                        </Right>
                                    </CardItem>
                                </Card>
                            </DoubleClick>
                        )
                    }}
                />
                <Button onPress={this.handleLoadMore} style={{flex: 1}} title={'Load More'}/>
            </View>)
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

    searchConfirm(pag) {
        this.setState({refreshing: true, page: 1})
        console.log("input", this.state.search)
        console.log("token", this.state.token)
        fetch("https://api.imgur.com/3/gallery/search/time/all/" + pag + "?q=" + this.state.search, {
                method: 'GET',
                headers: {
                    'Authorization': 'Client-ID 8b04798a72b74e0',
                },
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(this.state.page)
                this.setState({fullList: responseJson.data})
                this.setState({list: responseJson.data.slice(0, 10)})
                this.setState({refreshing: false});
            }).catch((error) => {
            console.error(error);
        });
    }
}