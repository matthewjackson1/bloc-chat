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
      messageContent: null
      
     };
    
     this.messagesRef = this.props.firebase.database().ref('messages');
 	}

 	componentDidMount() {
     this.messagesRef.on('child_added', snapshot => {
       const message = snapshot.val();
       message.key = snapshot.key;
       this.setState({ messages: this.state.messages.concat( message ) });
     });
   }

  roomMessages() {
       let messages = this.state.messages;
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
          </td>
        </tr>
        ); 
       return mapFilteredMessages;

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
    console.log(this.props.activeUser);
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