import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
    return (
        <View>
          <Text style={styles.optionsTitleText}>
            Menu
          </Text>

          <TouchableOpacity
              style={styles.option}
              onPress={()=>{this.props.navigation.navigate('Fav')}}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.optionIconContainer}>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Favorite
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.option}
              onPress={()=>{this.props.navigation.navigate('Up')}}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.optionIconContainer}>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Upload Image
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.option}
              onPress={this._handlePressForums}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.optionIconContainer}>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>
                  Manage upload images
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
  },
  optionIconContainer: {
    marginRight: 9,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
  },
  optionText: {
    fontSize: 15,
    marginTop: 1,
  },
});
