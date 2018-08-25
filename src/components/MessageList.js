import React, { Component } from 'react';
import {Table, FormGroup, FormControl, Button, InputGroup, Row, Col} from 'react-bootstrap';
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
      editedMsg: [],
      editClicked: []
      
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

  messageControls = (message) => {
    return  <div className="controls ml-auto">
    { this.state.editClicked[message.key] ? 
      <Button onClick={(e) => this.toggleEdit(e, message.key) }><span className="msgIcons ion-close-circled" /> Cancel</Button> : 
      <Button onClick={(e) => this.toggleEdit(e, message.key) }><span className="msgIcons ion-edit" /> Edit</Button> }
    <Button className="delete" onClick={() => this.deleteMessage(message)}><span className="msgIcons ion-trash-a" />Delete</Button>
    </div>
  }

  editMessage = (e, message) => {
    //console.log(JSON.stringify(message));
    const selectedMsg = message.key;
    //console.log(e.target);
    //console.log(this.messagesRef.child(selectedMsg));
    //console.log("edited name"+this.state.editedMsg);
    const editedContent = this.state.editedMsg[selectedMsg];
    //console.log(editedContent);
    const clickStatuses = this.state.editClicked;
    console.log(clickStatuses);
    clickStatuses[message.key] = false;
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
         { !this.state.editClicked[message.key] &&
         <div>
         <span className="msgContent">
           {message.content}
         </span>
         {this.messageControls(message)}
         </div>
         }
         {(this.state.editClicked[message.key]) &&
         <div>
         <form onSubmit={(e) => this.editMessage(e, message)}>
           <FormGroup bsSize="large">
             <InputGroup className="editControls"> 
               <FormControl className="msgUpdate" type="text" defaultValue={message.content} onChange={(e)=>this.handleEdit(e,message)}/>
               <InputGroup.Button>
                 <Button className="msgSubmit" type="submit" bsSize="large" bsStyle="primary">Update</Button>
               </InputGroup.Button>
             </InputGroup>
           </FormGroup>
         </form>
         {this.messageControls(message)}
         </div>
         }
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

  toggleEdit = (e, messageKey) => {
    //console.log(messageKey);
    const clickStatuses = this.state.editClicked;
    console.log(clickStatuses);
    clickStatuses[messageKey] = (clickStatuses[messageKey] === true) ? false : true;
    console.log(clickStatuses);
    this.setState({editClicked: clickStatuses});
  }

  

    
 	render() {
 		return( 
      <div>
        <div>
          { this.props.activeRoom &&
          <div>
            <div className="messagesHeader">
                <span className="roomName" data-spy="affix" data-offset-top="121">{this.props.activeRoomName}</span>
              </div>
            <div className="messageContainer">
           		<Table>
              <tbody>
                { this.roomMessages() }
              </tbody>
              </Table>
              <div className="new-msg-container">
                <form className="newMsgForm bottom" onSubmit={this.createMsg}>
                <FormGroup bsSize="large">
                  <InputGroup> 
                    <FormControl className="msgEntry" type="text" id="message" placeholder="Write your message here..." onChange={this.handleChange} />
                    <InputGroup.Button>
                      <Button className="msgSubmit" type="submit" bsStyle="primary">Send</Button>
                    </InputGroup.Button>
                  </InputGroup>
                </FormGroup>
                </form>
              </div>
            </div>
            
          </div>
          }
          </div>
          <div>
        { !this.props.activeRoom &&
          <div>
            <h1>Welcome to Bloc Chat!</h1>
            <span> Please select a room on the left to start messaging</span>
            <div>
              <span className="ion-person-stalker introIcon"></span>
            </div>
          </div>
        }
      </div>
    </div>
    
 			);
 	}
 };


export default MessageList;