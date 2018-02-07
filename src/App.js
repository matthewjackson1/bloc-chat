import React, { Component } from 'react';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import './App.css';
import * as firebase from 'firebase';


// Initialize Firebase
var config = {
  apiKey: "AIzaSyAAJDttnqrtihgHPMZ7s54h5xtvED7MMXM",
  authDomain: "bloc-chat-85d0f.firebaseapp.com",
  databaseURL: "https://bloc-chat-85d0f.firebaseio.com",
  projectId: "bloc-chat-85d0f",
  storageBucket: "bloc-chat-85d0f.appspot.com",
  messagingSenderId: "204618429629"
};
firebase.initializeApp(config);


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeRoom: "",
      activeRoomName: ""
    }
  }

  setActiveRoom(r) {
    this.setState({ activeRoom : r.key });
    this.setState({ activeRoomName: r.name });
  }

  render() {
    return (
      <div className="App">
            <RoomList 
                firebase = {firebase}
                activeRoom = {this.state.activeRoom} 
                activeRoomName = {this.state.activeRoomName} 
                setActiveRoom = {(r) => this.setActiveRoom(r)}
            />
            <MessageList 
                firebase = {firebase} 
                activeRoom = {this.state.activeRoom}
                activeRoomName = {this.state.activeRoomName}
            />
      </div>
    );
  }
}

export default App;
