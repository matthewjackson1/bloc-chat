import React, { Component } from 'react';
import {Table} from 'react-bootstrap';
import './MessageList.css';

class MessageList extends Component {
   constructor(props) {
     super(props);
 
     this.state = { 
     	messages : [],
      username: "",
      content: "",
      sentAt: "",
      roomId: ""
      
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

    
 	render() {
 		return( 
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
      
 			);
 	}
 };


export default MessageList;