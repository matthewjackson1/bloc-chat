import React, { Component } from 'react';
import {Button, FormGroup, InputGroup, FormControl} from 'react-bootstrap';
import './RoomList.css';

class RoomList extends Component {
   constructor(props) {
     super(props);
  
     this.state = { 
     	rooms: [],
      newRoomName : "",
      editedNames: []
     };
    
     this.roomsRef = this.props.firebase.database().ref('rooms');
     this.messagesRef = this.props.firebase.database().ref('messages');
     this.handleChange = this.handleChange.bind(this);
     this.createRoom = this.createRoom.bind(this);
     this.handleEdit = this.handleEdit.bind(this);
     //this.deleteRoom = this.deleteRoom.bind(this);
 	}

 	componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
       console.log("child_added");
       const room = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) });
     });
     this.roomsRef.on('child_removed', snapshot => {
       //console.log("child_removed");
       const room = snapshot.val();
       room.key = snapshot.key;
       //console.log(JSON.stringify(this.state.rooms));
       //console.log(room);
       //console.log(JSON.stringify(this.state.rooms));
       this.setState({ rooms: this.state.rooms.filter( (item) => item.key !== room.key ) });
       //console.log("Round 2"+JSON.stringify(this.state.rooms));
     });
     this.roomsRef.on('child_changed', snapshot => {
       console.log("child_changed");
       //console.log("child_removed");
       const room = snapshot.val();
       room.key = snapshot.key;
       //console.log("room key and room name" + room.key + room.name);
       //console.log(this.state.rooms)
       const roomIndex = this.state.rooms.findIndex(obj => obj.key === room.key);
       //console.log("room index"+roomIndex);
       const roomCopy = this.state.rooms;
       //console.log(roomCopy[roomIndex]);
       roomCopy[roomIndex].name = room.name;
       const updatedRooms = roomCopy
       //console.log(this.state.rooms);
       this.setState({ rooms: updatedRooms});
      
     });

     /*this.messagesRef.on('child_removed', snapshot => {
       //console.log("child_removed");
       const message = snapshot.val();
       message.key = snapshot.key;
       //console.log(JSON.stringify(this.state.rooms));
       //console.log(room);
       //console.log(JSON.stringify(this.state.rooms));
       this.setState({ messages: this.state.messages.filter( (item) => item.key !== message.key ) });
       //console.log("Round 2"+JSON.stringify(this.state.rooms));
     });*/
   }

  handleChange(e) {
    this.setState({newRoomName: e.target.value});
  }

  handleEdit(e, room) {
    const editedNames = this.state.editedNames;
    editedNames[room.key] = e.target.value;
    console.log("editedNames"+editedNames);
    this.setState({editedNames: editedNames});
    console.log(this.state.editedNames);
  }


  createRoom(e) {
    this.roomsRef.push({ name: this.state.newRoomName });
    e.preventDefault();
  }

  editRoom = (e, room) => {
    const selectedRoom = room.key;
    console.log(e.target);
    console.log(this.roomsRef.child(selectedRoom));
    const editedName = this.state.editedNames[selectedRoom];
    console.log("edited name"+this.state.editedName);
    this.roomsRef.child(selectedRoom).update({ name: editedName});
    e.target.reset();
    e.preventDefault();
    
  }


  deleteRoom = (room) => {
  console.log("deleteroom triggered");
  const selectedRoom = room.key;
  this.roomsRef.child(selectedRoom).remove();
/*  this.state.messages.map( (message) => { 
    if(message.roomId === selectedRoom) { 
      this.messagesRef.child(message).remove()
    }; 
  });*/

  }


 	render() {
 		return(
      <div className="text-left">
        <span className="blocChatTitle">Bloc Chat</span> 
        <span className="blocChatRooms">Rooms</span>
        <div className="chatroomList">
       			{
       				this.state.rooms.map(
                (room) => 
                  <div>
                  <span className="roomNames" onClick={() => this.props.setActiveRoom(room)}>{room.name}</span>
                  <Button className="deleteRoom" onClick={() => this.deleteRoom(room)}>Delete</Button>
                  <form className="editRoom" onSubmit={(e) => this.editRoom(e, room)}>
                    <FormGroup bsSize="large">
                      <InputGroup> 
                        <FormControl className="nameEntry" type="text" placeholder="Enter new room name..." onChange={(e)=>this.handleEdit(e, room)} />
                        <InputGroup.Button>
                          <Button className="nameSubmit" type="submit" bsSize="large">Update</Button>
                        </InputGroup.Button>
                      </InputGroup>
                    </FormGroup>
                  </form>
                  </div>
                  )
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
