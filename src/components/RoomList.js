import React, { Component } from 'react';
import {Button, FormGroup, InputGroup, FormControl, Row, Col} from 'react-bootstrap';
import './RoomList.css';

class RoomList extends Component {
   constructor(props) {
     super(props);
  
     this.state = { 
     	rooms: [],
      newRoomName : "",
      editedNames: [],
      editClicked: []
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
       //console.log("child_added");
       const room = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) });
     });
     this.roomsRef.on('child_removed', snapshot => {
       //console.log("child_removed");
       const room = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.filter( (item) => item.key !== room.key ) });

     });
     this.roomsRef.on('child_changed', snapshot => {
       console.log("child_changed");
       //console.log("child_removed");
       const room = snapshot.val();
       room.key = snapshot.key;
       const roomIndex = this.state.rooms.findIndex(obj => obj.key === room.key);
       const roomCopy = this.state.rooms;
       roomCopy[roomIndex].name = room.name;
       const updatedRooms = roomCopy
       this.setState({ rooms: updatedRooms});
      
     });

   }

  handleChange(e) {
    this.setState({newRoomName: e.target.value});
  }

  handleEdit(e, room) {
    const editedNames = this.state.editedNames;
    console.log("target value"+ e.target.value);
    editedNames[room.key] = e.target.value;
    console.log(editedNames[room.key]);

    console.log("editedNames"+editedNames);
    this.setState({editedNames: editedNames});
    console.log(this.state.editedNames);
  }


  createRoom(e) {
    this.roomsRef.push({ name: this.state.newRoomName });
    e.preventDefault();
  }

  editRoom = (e, room) => {
    e.preventDefault();
    //console.log('editRoom triggered'+e+room.key);
    const selectedRoom = room.key;
    const editedName = this.state.editedNames[selectedRoom];
    this.roomsRef.child(selectedRoom).update({ name: editedName});
    e.target.reset();
    this.toggleEdit(e, room.key);
     
  }

  deleteRoom = (room) => {
  console.log("deleteroom triggered");
  const selectedRoom = room.key;
  this.roomsRef.child(selectedRoom).remove();
  }

  toggleEdit = (e, roomKey) => {
    //console.log(messageKey);
    const clickStatuses = this.state.editClicked;
    console.log(clickStatuses);
    clickStatuses[roomKey] = clickStatuses[roomKey] === true ? false : true;
    console.log(clickStatuses);
    this.setState({editClicked: clickStatuses});
  }

  


 	render() {
 		return(

      <Col className="text-left chatroomList navbar">
        <h2 className="blocChatRooms">Rooms</h2>
        <div>
       			{
       				this.state.rooms.map(
                (room) => 
                  <div>
                  {  !this.state.editClicked[room.key] && 
                    <div className={room.key === this.props.activeRoom ? "activeRoomRow" : "inactiveRoomRow"}> 
                    <Row className="roomRow">   
                      <Col className="roomNames"> 
                        <span onClick={() => this.props.setActiveRoom(room)}>{room.name}</span>
                      </Col>
                      <Col className="roomControls"> 
                         <Button className="roomButtons" bsStyle="link" onClick={(e) => this.toggleEdit(e, room.key) }><span className="roomMsgIcons ion-edit" /></Button>
                         <Button bsStyle="link" className="roomButtons deleteRoom" onClick={() => this.deleteRoom(room)}><span className="roomMsgIcons ion-trash-a" /></Button>
                      </Col>
                    </Row>
                    </div>
                  }
                  { this.state.editClicked[room.key] &&
                    <form onSubmit={(e) => this.editRoom(e, room)}>
                      <FormGroup bsSize="large">
                        <InputGroup className="nameEntry"> 
                          <FormControl type="text" defaultValue={room.name} onChange={(e)=>this.handleEdit(e, room)} />
                          <InputGroup.Button>
                            <Button className="nameSubmit" type="submit" bsSize="large">Update</Button>
                          </InputGroup.Button>
                        </InputGroup>
                      </FormGroup>
                    </form>
                  }
                
                  </div>

                )
       
       			}


                <form className="newRoomForm" onSubmit={this.createRoom}>
                    <FormGroup bsSize="large">
                      <InputGroup className="roomEntry"> 
                        <FormControl className="roomField" type="text" placeholder="" id="roomName" onChange={this.handleChange} />
                        <InputGroup.Button>
                          <Button className="createRoom" type="submit" bsSize="large" >Add</Button>
                      </InputGroup.Button>
                      </InputGroup>
                    </FormGroup>
                </form>  
      
      </div>

    </Col>
  
 			);
 	}
 };


export default RoomList;
