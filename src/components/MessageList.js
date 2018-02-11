import React, { Component } from 'react';
import {Table, FormGroup, FormControl, Button, InputGroup} from 'react-bootstrap';
import './MessageList.css';

class MessageList extends Component {
   constructor(props) {
     super(props);
 
     this.state = { 
     	messages : [],
      username: "",
      content: "",
      sentAt: "",
      roomId: "",
      messageContent: null,
      editedMsg: []
      
     };
    
     this.messagesRef = this.props.firebase.database().ref('messages');
     this.roomsRef = this.props.firebase.database().ref('rooms');
 	}

 	componentDidMount() {
     this.messagesRef.on('child_added', snapshot => {
       const message = snapshot.val();
       message.key = snapshot.key;
       this.setState({ messages: this.state.messages.concat( message ) });
     });

     this.messagesRef.on('child_removed', snapshot => {
       //console.log("child_removed");
       const message = snapshot.val();
       message.key = snapshot.key;
       //console.log(JSON.stringify(this.state.rooms));
       //console.log(room);
       //console.log(JSON.stringify(this.state.rooms));
       this.setState({ messages: this.state.messages.filter( (item) => item.key !== message.key ) });
       //console.log("Round 2"+JSON.stringify(this.state.rooms));
     });

     this.messagesRef.on('child_changed', snapshot => {
       console.log("child_changed");
       //console.log("child_removed");
       const message = snapshot.val();
       message.key = snapshot.key;
       //console.log("room key and room name" + room.key + room.name);
       //console.log(this.state.rooms)
       const msgIndex = this.state.messages.findIndex(obj => obj.key === message.key);
       //console.log("room index"+roomIndex);
       const msgsCopy = this.state.messages;
       //console.log(roomCopy[roomIndex]);
       msgsCopy[msgIndex].content = message.content;
       
       const updatedMsgs = msgsCopy;
       //console.log(this.state.rooms);
       this.setState({ 
        messages: updatedMsgs
       });
      });
   }

  handleEdit = (e, message) => {
    const editedMessages = this.state.editedMsg;
    editedMessages[message.key] = e.target.value;
    //console.log("editedMessages"+editedMessages);
    this.setState({editedMsg: editedMessages
    });

    //console.log(this.state.editedMsg);
  }

  editMessage = (e, message) => {
    //console.log(JSON.stringify(message));
    const selectedMsg = message.key;
    //console.log(e.target);
    //console.log(this.messagesRef.child(selectedMsg));
    //console.log("edited name"+this.state.editedMsg);
    const editedContent = this.state.editedMsg[selectedMsg];
    //console.log(editedContent);
    
    this.messagesRef.child(selectedMsg).update({
     content: editedContent,
     sentAt:this.timeNow(),
     username: this.props.activeUser ? this.props.activeUser : "Guest"
    });
    e.target.reset();
    e.preventDefault();
  }

  roomMessages() {
       let messages = this.state.messages;
       //console.log("messages are:"+JSON.stringify(this.state.messages));
       let activeRoom = this.props.activeRoom;
       let filteredMessages = messages.filter( message => (message.roomId === activeRoom));
       let mapFilteredMessages = filteredMessages.map((message, index)=>
        <tr className="messageList" key={index}>
          <td className="messageListMsg">
            <span className="userName">
              {message.username}
            </span>
            <span className="sentAt">
              {message.sentAt}
            </span>
            <span className="msgContent">
              {message.content}
            </span>
            <Button onClick={() => this.deleteMessage(message)}>Delete</Button>
            <form className="editMessage" onSubmit={(e) => this.editMessage(e, message)}>
              <FormGroup bsSize="large">
                <InputGroup> 
                  <FormControl className="msgUpdate" type="text" placeholder="Edit message" onChange={(e)=>this.handleEdit(e,message)}/>
                  <InputGroup.Button>
                    <Button className="msgSubmit" type="submit" bsSize="large">Update</Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </form>
          </td>
        </tr>
        ); 
       return mapFilteredMessages;

  }

  deleteMessage = (message) => {
    //console.log('deleteMessages called');
    const selectedMsg = message.key;
    //console.log(selectedMsg);
    this.messagesRef.child(selectedMsg).remove();

  }

  timeNow() {
      let d = new Date();
      let h = (d.getHours()<10?"0":"") + d.getHours();
      let m = (d.getMinutes()<10?"0":"") + d.getMinutes();
      let time = h + ":" + m;
      return time;
  }

  handleChange = (e) => {
    this.setState({messageContent: e.target.value});
  }


  createMsg = (e) => {
    //console.log(this.props.activeUser);
    this.messagesRef.push({ 
      content: this.state.messageContent,
      username: this.props.activeUser ? this.props.activeUser : "Guest",
      sentAt: this.timeNow(),
      roomId: this.props.activeRoom
       });
    e.target.reset();
    e.preventDefault();
  }

  

    
 	render() {
 		return( 
    <div>
      <div className="messageContainer">
        <div className="messagesHeader">
        <span className="roomName">{this.props.activeRoomName}</span>
        </div>
   		<Table striped>
       <tbody>
        { this.roomMessages() }
       </tbody>
      </Table>
      </div>
      <form className="newMsgForm" onSubmit={this.createMsg}>
        <FormGroup bsSize="large">
          <InputGroup> 
            <FormControl className="msgEntry" type="text" id="message" placeholder="Write your message here..." onChange={this.handleChange} />
            <InputGroup.Button>
              <Button className="msgSubmit" type="submit" bsSize="large">Send</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    </div>
 			);
 	}
 };


export default MessageList;