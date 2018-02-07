import React, { Component } from 'react';


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
       let mapFilteredMessages = filteredMessages.map((message, index)=><span key={index}>{message.content}</span>); 
       return mapFilteredMessages;

  }

    
 	render() {
 		return( 
 		<div>
      { this.roomMessages() }
    </div>
      
 			);
 	}
 };


export default MessageList;