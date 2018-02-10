import React, { Component } from 'react';
import {} from 'react-bootstrap';
import './RoomList.css';

class RoomList extends Component {
   constructor(props) {
     super(props);
  
     this.state = { 
     	rooms: [],
      newRoomName : ""
     };
    
     this.roomsRef = this.props.firebase.database().ref('rooms');
     this.handleChange = this.handleChange.bind(this);
     this.createRoom = this.createRoom.bind(this);
 	}

 	componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
       const room = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) });
     });
   }

  handleChange(e) {
    this.setState({newRoomName: e.target.value});
  }

  createRoom(e) {
    this.roomsRef.push({ name: this.state.newRoomName });
    e.preventDefault();
  }



    

 	render() {
 		return(
      <div className="text-left">
        <span className="blocChatTitle">Bloc Chat</span> 
        <span className="blocChatRooms">Rooms</span>
        <div className="chatroomList">
       			{
       				this.state.rooms.map(
                (room) => <span className="roomNames" onClick={() => this.props.setActiveRoom(room)}>{room.name}</span> )
       			}
        </div>
    
        <form className="newRoomForm" onSubmit={this.createRoom}>
            <label className="roomEntryLabel" htmlFor="roomName">Add a room</label>
            <input className="roomEntry" type="text" id="roomName" onChange={this.handleChange} />
            <input className="createRoom" type="submit" value="Create Room"/>
        </form>
      </div>

    
  
 			);
 	}
 };


export default RoomList;
