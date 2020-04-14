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

const emptyCamera = {uuid: '', name: '', host: '', username: '', password: ''};
const editCamera = emptyCamera;
class ConnectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longPressDialogVisible: false,
      editDialogVisible: false,
      tempItem: emptyCamera,
      videoModalVisible: false,
    };
  }

  showLongPressDialog = (item) => () =>
    this.setState({longPressDialogVisible: true, tempItem: item});

  handleCancelLongPress = () => {
    this.setState({longPressDialogVisible: false, tempItem: emptyCamera});
  };

  handleCancelEdit = () => {
    this.setState({editDialogVisible: false, tempItem: emptyCamera});
  };

  handleDelete = () => {
    this.props.handleRemove(this.state.tempItem);
    this.setState({longPressDialogVisible: false, tempItem: emptyCamera});
  };

  showEditDialog = () => {
    this.setState(
      {
        longPressDialogVisible: false,
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              editDialogVisible: true,
            }),
          500,
        ),
    );
  };

  handleEdit = async () => {
    await this.props.handleRemove(this.state.tempItem);
    await this.props.handleAdd(this.state.tempItem);
    this.setState({editDialogVisible: false, tempItem: emptyCamera});
  };

  showVideoModal = (item) => () => {
    this.setState({videoModalVisible: true, tempItem: item});
  };

  onChangeName = (name) => {
    this.setState({tempItem: {...this.state.tempItem, name}});
  };

  onChangeHost = (host) => {
    this.setState({tempItem: {...this.state.tempItem, host}});
  };

  onChangeUsername = (username) => {
    this.setState({tempItem: {...this.state.tempItem, username}});
  };

  onChangePassword = (password) => {
    this.setState({tempItem: {...this.state.tempItem, password}});
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
    const iosProps = {};
    if (Platform.OS === 'ios') {
      iosProps.color = 'black';
    }
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
          <Dialog.Button label="Edit" onPress={this.showEditDialog} />
          <Dialog.Button label="Delete" onPress={this.handleDelete} />
        </Dialog.Container>

        <Dialog.Container visible={this.state.editDialogVisible}>
          <Dialog.Title>Edit</Dialog.Title>
          <Dialog.Description>
            Please enter the name and host of your camera.
          </Dialog.Description>
          <Dialog.Input
            onChangeText={this.onChangeName}
            defaultValue={this.state.tempItem.name}
            placeholder="Name"
            placeholderTextColor="rgb(204,204,204)"
            {...iosProps}></Dialog.Input>
          <Dialog.Input
            onChangeText={this.onChangeHost}
            defaultValue={this.state.tempItem.host}
            placeholder="Host"
            placeholderTextColor="rgb(204,204,204)"
            {...iosProps}></Dialog.Input>
          <Dialog.Input
            onChangeText={this.onChangeUsername}
            defaultValue={this.state.tempItem.username}
            placeholder="Username"
            placeholderTextColor="rgb(204,204,204)"
            {...iosProps}></Dialog.Input>
          <Dialog.Input
            onChangeText={this.onChangePassword}
            placeholder="Password"
            placeholderTextColor="rgb(204,204,204)"
            secureTextEntry={true}
            {...iosProps}></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={this.handleCancelEdit} />
          <Dialog.Button label="Save" onPress={this.handleEdit} />
        </Dialog.Container>

        <Overlay
          isVisible={this.state.videoModalVisible}
          width="100%"
          height="auto"
          onBackdropPress={() => this.setState({videoModalVisible: false})}>
          <VLCPlayer
            ref={(ref) => (this.vlcPlayer = ref)}
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
            }}
          />
        </Overlay>
      </React.Fragment>
    );
  }
}
export default ConnectionList;
