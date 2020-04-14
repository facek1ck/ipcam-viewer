/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
Icon2.loadFont();
import {SafeAreaView, StyleSheet, StatusBar, AsyncStorage} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Header} from 'react-native-elements';
import ConnectionList from './components/ConnectionList';
import Dialog from 'react-native-dialog';

var uuid = require('react-native-uuid');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      cameras: [],
      curName: '',
      curHost: '',
      curUsername: '',
      curPassword: '',
    };
  }

  componentDidMount = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      if (items.length > 0) {
        const cameras = items.map((item) => ({
          uuid: item[0],
          ...JSON.parse(item[1]),
        }));
        this.setState({
          cameras,
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _storeData = async (camera) => {
    try {
      const {uuid, ...rest} = camera;
      await AsyncStorage.setItem(uuid, JSON.stringify(rest));
    } catch (error) {
      // Error storing data
    }
  };

  showDialog = () => {
    this.setState({dialogVisible: true});
  };

  handleCancel = () => {
    this.setState({dialogVisible: false});
  };

  handleAdd = async () => {
    const camera = {
      uuid: uuid.v4(),
      name: this.state.curName,
      host: this.state.curHost,
      username: this.state.curUsername,
      password: this.state.curPassword,
    };
    this._storeData(camera);
    await this.setState({
      dialogVisible: false,
      cameras: [...this.state.cameras, camera],
    });
  };

  handleAddSpecific = (camera) => {
    this._storeData(camera);
    this.setState({
      cameras: [...this.state.cameras, camera],
    });
  };

  handleRemove = async (camera) => {
    await this.setState({
      cameras: this.state.cameras.filter((c) => c.uuid !== camera.uuid),
    });
    AsyncStorage.removeItem(camera.uuid);
  };

  onChangeName = (name) => {
    this.setState({curName: name});
  };

  onChangeHost = (host) => {
    this.setState({curHost: host});
  };

  onChangeUsername = (username) => {
    this.setState({curUsername: username});
  };

  onChangePassword = (password) => {
    this.setState({curPassword: password});
  };

  render() {
    const iosProps = {};
    if (Platform.OS === 'ios') {
      iosProps.color = 'black';
    }
    return (
      <>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{backgroundColor: '#579ABE'}}>
          <Header
            centerComponent={{
              text: 'IP Camera Viewer',
              style: {color: '#fff'},
            }}
            rightComponent={{
              icon: 'add',
              underlayColor: 'inherit',
              color: '#fff',
              onPress: this.showDialog,
            }}
            backgroundColor="#579ABE"
          />
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Add a new IP Camera</Dialog.Title>
            <Dialog.Description>
              Please enter the name and host of your camera.
            </Dialog.Description>
            <Dialog.Input
              onChangeText={this.onChangeName}
              placeholder="Name"
              placeholderTextColor="rgb(204,204,204)"
              {...iosProps}></Dialog.Input>
            <Dialog.Input
              onChangeText={this.onChangeHost}
              placeholder="Host"
              placeholderTextColor="rgb(204,204,204)"
              {...iosProps}></Dialog.Input>
            <Dialog.Input
              onChangeText={this.onChangeUsername}
              placeholder="Username"
              placeholderTextColor="rgb(204,204,204)"
              {...iosProps}></Dialog.Input>
            <Dialog.Input
              onChangeText={this.onChangePassword}
              placeholder="Password"
              placeholderTextColor="rgb(204,204,204)"
              secureTextEntry={true}
              {...iosProps}></Dialog.Input>
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Add" onPress={this.handleAdd} />
          </Dialog.Container>
          <ConnectionList
            cameras={this.state.cameras}
            handleRemove={this.handleRemove}
            handleAdd={this.handleAddSpecific}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
