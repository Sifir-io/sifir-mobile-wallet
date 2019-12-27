import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import SifirChatListItem from '@elements/SifirChatListItem';

export default class RoomsMainScreen extends Component {
  state = {
    srchTxt: '',
    isSrchStarted: false,
    itemClicked: false,
    listData: [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Ghassan',
        cont: 'Hey man! You got a medium in black available?',
        timeTxt: 'Just now',
        avatar_url: Images.img_face1,
        selected: false,
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Ghassan',
        cont: 'Hey man! You got a medium in black available?',
        timeTxt: 'Just now',
        avatar_url: Images.img_face1,
        selected: false,
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Ghassan',
        cont: 'Hey man! You got a medium in black available?',
        timeTxt: 'Just now',
        avatar_url: Images.img_face1,
        selected: false,
      },
    ],
    gColors: [
      ['#122C3A', '#122C3A', '#122C3A'],
      ['#52d4cd', '#54a5b1', '#57658c'],
    ],
  };

  onSrchTxtChange = txt => {
    this.setState({srchTxt: txt});
    if (txt !== '') {
      this.setState({isSrchStarted: true});
    }
  };

  clickedItem = data => {
    const index = this.state.listData.findIndex(item => data.id === item.id);
    var data = this.state.listData;
    data[index].selected = !data[index].selected;
    this.setState({listData: data});
    setTimeout(() => {
      this.props.navigation.navigate('RoomsDetail');
    }, 500);
  };

  FlatListItemSeparator = () => {
    return <View style={styles.flatListItemSep} />;
  };

  render() {
    return (
      <View style={styles.mainscreen}>
        <View style={styles.searchView}>
          <Image source={Images.icon_search} style={styles.srchImg} />
          <TextInput
            style={styles.srchInput}
            onChangeText={text => this.onSrchTxtChange(text)}
            value={this.state.srchTxt}
          />
          {this.state.isSrchStarted && (
            <TouchableOpacity
              onPressOut={() =>
                this.setState({
                  srchTxt: '',
                  isSrchStarted: false,
                })
              }>
              <Image source={Images.icon_close1} style={styles.srchCloseImg} />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={this.state.listData}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({item}) => (
            <SifirChatListItem
              data={item}
              clickedItem={this.clickedItem}
              gColors={this.state.gColors}
            />
          )}
          keyExtractor={item => item.id}
          style={styles.listView}
        />
        <TouchableOpacity style={styles.addImgView}>
          <Image source={Images.icon_plus} style={styles.addImg} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainscreen: {
    flex: 1,
    display: 'flex',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  tempStyle: {
    color: 'white',
    fontSize: 20,
  },
  searchView: {
    borderRadius: 17,
    backgroundColor: '#122C3A',
    marginHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  srchImg: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  srchInput: {
    paddingVertical: 0,
    color: 'white',
    marginLeft: 10,
    fontSize: 17,
    width: C.SCREEN_WIDTH * 0.75,
  },
  srchCloseImg: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  listView: {
    flex: 1,
    marginTop: 15,
    marginBottom: 10,
  },
  addImg: {
    width: 50,
    height: 50,
  },
  addImgView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  flatListItemSep: {
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
  },
});
