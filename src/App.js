import React, { Component } from 'react';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';
import './App.css';
import * as firebase from 'firebase';
import {Grid, Col, Row, Button} from 'react-bootstrap';


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
      activeRoomName: "",
      activeUser: "",
      messages: []
    }
  }

  setActiveRoom(r) {
    this.setState({ activeRoom : r.key });
    this.setState({ activeRoomName: r.name });
  }

  setUser(user) {
    if (user !== null) {
      console.log("setUser"+user.displayName);  
      this.setState({ activeUser: user.displayName});
    }
    else {
      this.setState({ activeUser: null});
    }
  }

  setMessages(messages) {
    this.setState({messages: messages});
  }

  render() {
    return (
      <Grid className="App" fluid>
      <Row>




        <Col sm={4}>

<div className="navbar navbar-expand-sm navbar-light">

    <Col>
        <a className="navbar-brand" href="/">
          <img className="header-logo" src="../assets/branding/jabberLogo.png" />
        </a>
    
        
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive"
    aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse flex-column" id="navbarResponsive">
            
          <User
              firebase = {firebase}
              setUser = {(user) => this.setUser(user)}
              activeUser = {this.state.activeUser}
          />
      
          <RoomList
              firebase = {firebase}
              activeRoom = {this.state.activeRoom} 
              activeRoomName = {this.state.activeRoomName} 
              setActiveRoom = {(r) => this.setActiveRoom(r)}
              appMessages = {this.state.messages}
          />
             
        </div>
    </Col>
</div>

</Col>





        <Col sm={8} className="messages">
        <MessageList 
            firebase = {firebase} 
            activeRoom = {this.state.activeRoom}
            activeRoomName = {this.state.activeRoomName}
            activeUser = {this.state.activeUser}
            appMessages = {this.state.messages}
            setMessages = {(messages) => this.setMessages(messages)}
        />
        </Col>
          </Row>
      </Grid>
    );
  }
}

export default App;
