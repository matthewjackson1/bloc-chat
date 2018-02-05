import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import RoomList from './components/RoomList';
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
  render() {
    return (
      <div className="App">
            <RoomList firebase={firebase} />
      </div>
    );
  }
}

export default App;
