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

  const roomMessages = {
      this.state.messages.map( (message) => {
      if (message.roomId === this.props.activeRoom) { return <span>message.content</span> } 
      return null;  
      })
  };

    

 	render() {

 		return( 
 		<div>
      {this.roomMessages()}
    </div>
      
 			);
 	}
 };


export default MessageList;