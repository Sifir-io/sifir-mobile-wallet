import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {connect} from 'react-redux';

import SifirChatListItem from '@elements/SifirChatListItem';
import SifirSearchBox from '@elements/SifirSearchBox';
import {loadRoomList} from '@actions/rooms';

class RoomsMainScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.loadRoomList();
  }

  state = {
    srchTxt: '',
    isSrchStarted: false,
    itemClicked: false,
    roomsList: [],
    gColors: [
      ['#122C3A', '#122C3A', '#122C3A'],
      ['#52d4cd', '#54a5b1', '#57658c'],
    ],
  };

  clickedItem = data => {
    this.props.navigation.navigate('RoomsDetail');

    // const index = this.state.listData.findIndex(item => data.id === item.id);
    // let listData = this.state.listData;
    // listData[index].selected = true;
    // this.setState({listData});
    // setTimeout(() => {
    //   listData[index].selected = false;
    //   this.setState({listData});
    // }, 500);
  };

  FlatListItemSeparator = () => {
    return <View style={styles.flatListItemSep} />;
  };

  render() {
    const {roomsList, loaded, loading} = this.props.rooms;
    return (
      <View style={styles.mainscreen}>
        <SifirSearchBox
          onChangeText={this.onSrchTxtChange}
          onCloseSrch={this.onCloseSrch}
          value={this.state.srchTxt}
          isSrchStarted={this.state.isSrchStarted}
        />
        {loading === true && (
          <ActivityIndicator
            size="large"
            color={AppStyle.mainColor}
            style={styles.loading}
          />
        )}
        {loaded === true && (
          <FlatList
            data={roomsList}
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
        )}
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
  loading: {
    marginTop: C.SCREEN_HEIGHT / 3,
  },
});

const mapStateToProps = state => {
  return {
    rooms: state.rooms,
  };
};

const mapDispatchToProps = {loadRoomList};

// eslint-disable-next-line prettier/prettier
export default connect(mapStateToProps, mapDispatchToProps)(RoomsMainScreen);
