import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Orientation,
  BackHandle,
} from 'react-native';
import {List, ListItem, Overlay} from 'react-native-elements';
import Dialog from 'react-native-dialog';
import {VLCPlayer, VlCPlayerView} from 'react-native-vlc-media-player';

const emptyCamera = {uuid: -1, name: -1, host: -1, username: '', password: ''};
class ConnectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longPressDialogVisible: false,
      tempItem: emptyCamera,
      videoModalVisible: false,
    };
  }

  showLongPressDialog = item => () =>
    this.setState({longPressDialogVisible: true, tempItem: item});

  handleCancelLongPress = () => {
    this.setState({longPressDialogVisible: false, tempItem: emptyCamera});
  };

  handleDelete = () => {
    this.props.handleRemove(this.state.tempItem);
    this.setState({longPressDialogVisible: false, tempItem: emptyCamera});
  };

  handleEdit = () => {
    //TODO: implement edit for cameras
  };

  showVideoModal = item => () => {
    this.setState({videoModalVisible: true, tempItem: item});
  };

  keyExtractor = (item, index) => index.toString();
  renderItem = ({item}) => (
    <ListItem
      title={item.name}
      subtitle={item.host}
      leftAvatar={{title: item.name.charAt(0)}}
      bottomDivider
      onLongPress={this.showLongPressDialog(item)}
      onPress={this.showVideoModal(item)}
    />
  );
  render() {
    return (
      <React.Fragment>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.props.cameras}
          renderItem={this.renderItem}></FlatList>
        <Dialog.Container visible={this.state.longPressDialogVisible}>
          <Dialog.Title>{this.state.tempItem.name}</Dialog.Title>
          <Dialog.Description>What do you want to do?</Dialog.Description>
          <Dialog.Button label="Cancel" onPress={this.handleCancelLongPress} />
          <Dialog.Button label="Edit" onPress={this.handleEdit} />
          <Dialog.Button label="Delete" onPress={this.handleDelete} />
        </Dialog.Container>
        <Overlay
          isVisible={this.state.videoModalVisible}
          width="100%"
          height="auto"
          onBackdropPress={() => this.setState({videoModalVisible: false})}>
          <VLCPlayer
            ref={ref => (this.vlcPlayer = ref)}
            style={{width: '100%', height: 200}}
            videoAspectRatio="16:9"
            source={{
              uri:
                'rtsp://' +
                this.state.tempItem.username +
                ':' +
                this.state.tempItem.password +
                '@' +
                this.state.tempItem.host +
                '/11',
              //   uri: 'rtsp://admin:Sisma26!@eventfactory.ddns.net:1027/11',
            }}
          />
        </Overlay>
      </React.Fragment>
    );
  }
}
export default ConnectionList;
