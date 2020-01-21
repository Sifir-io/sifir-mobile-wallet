import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import SifirShopListItem from '@elements/SifirShopListItem';
import SifirSearchBox from '@elements/SifirSearchBox';

export default class ShopMainScreen extends Component {
  state = {
    srchTxt: '',
    isSrchStarted: false,
    itemClicked: false,
    listData: [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-sdfasdew',
        title: 'Ghassan',
        cont: 'Hey man! You got a medium in black available?',
        timeTxt: 'Just now',
        avatar_url: Images.img_face1,
        selected: false,
        star: 4.5,
        type: 'Software Architect Consultant',
        rate: 1,
        status: 0,
        location: 'Sanfransisco',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-sdfasdew',
        title: 'Ghassan',
        cont: 'Hey man! You got a medium in black available?',
        timeTxt: 'Just now',
        avatar_url: Images.img_face1,
        selected: false,
        star: 4.5,
        type: 'Software Architect Consultant',
        rate: 1,
        status: 1,
        location: 'New York',
      },
    ],
  };

  clickedItem = data => {
    const index = this.state.listData.findIndex(item => data.id === item.id);
    let listData = this.state.listData;
    listData[index].selected = true;
    this.setState({listData});
    setTimeout(() => {
      this.props.navigation.navigate('RoomsDetail', {fromShop: true});
      listData[index].selected = false;
      this.setState({listData});
    }, 500);
  };

  FlatListItemSeparator = () => {
    return <View style={styles.flatListItemSep} />;
  };

  render() {
    return (
      <View style={styles.mainscreen}>
        <SifirSearchBox
          onChangeText={this.onSrchTxtChange}
          onCloseSrch={this.onCloseSrch}
          value={this.state.srchTxt}
          isSrchStarted={this.state.isSrchStarted}
        />
        <FlatList
          data={this.state.listData}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({item}) => (
            <SifirShopListItem data={item} clickedItem={this.clickedItem} />
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
