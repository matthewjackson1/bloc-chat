import React, { Component } from 'react';


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
 		<div>
    	<div>
 			{
 				this.state.rooms.map(
          (room) => <span className="roomNames" onClick={() => this.props.setActiveRoom(room)}>{room.name}</span> )
 			}
    </div>
    
    <form onSubmit={this.createRoom}>
      <label for="roomName">New Room Name</label>
      <input type="text" id="roomName" onChange={this.handleChange} />
      <input type="submit" value="Submit" />
    </form>
    </div>
 			);
 	}
 };


export default RoomList;
