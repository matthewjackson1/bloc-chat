import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import './User.css';


class User extends Component {
   constructor(props) {
     super(props);
 
     this.state = {

     };

    }

    componentDidMount() {
    	console.log("componentDidMount triggered")
        this.props.firebase.auth().onAuthStateChanged( user => {
           this.props.setUser(user);

        });
    }

	signIn() {
		console.log("signIn triggered");
		const provider = new this.props.firebase.auth.GoogleAuthProvider();
		this.props.firebase.auth().signInWithPopup( provider );
	}


	signOut() {
		console.log("signOut triggered");
		this.props.firebase.auth().signOut();	}

    getUsername() {
    	console.log("getUsername triggered")
    	let activeUsername = this.props.activeUser;
    	console.log(activeUsername);
    	if (activeUsername !== undefined) {
    		console.log({activeUsername});
    		<span>{activeUsername}</span>;
    	}
    	else {
    		<span>Guest</span>;
    	}
    }
   

    
  render() {

 		return( 
 			<div>
 			    <span>{this.getUsername()}</span>
 				<Button onClick={this.signIn()}>Sign in</Button>
 				<Button onClick={this.signOut()}>Sign Out</Button>
 			</div>
 		);

 	}
 };


 export default User;