import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import './User.css';


class User extends Component {
   constructor(props) {
     super(props);

     this.state = {
        username: "",
        loggedin: false
     };

    }
    
    componentDidMount() {
    	console.log("componentDidMount triggered");
    	//persisting login state across page refreshes or changes
        this.props.firebase.auth().onAuthStateChanged( user => {
           console.log("auth state changed"+user);
           this.props.setUser(user);

        });
    }

	signIn = () => {
		console.log("signIn triggered");
		const provider = new this.props.firebase.auth.GoogleAuthProvider()
		//console.log(provider);
		this.props.firebase.auth().signInWithPopup( provider )
		 .then( (result) => {
		 	this.props.setUser(result.user);
		 	this.setState({loggedin : true}); 
		 	console.log(JSON.stringify(result));
		 });
		console.log("triggered popup");
	}

	signOut = () => {
		console.log("signOut triggered");
		this.props.firebase.auth().signOut()
		  .then( () => {
		  	this.props.setUser(null);
			this.setState({loggedout : false}); 
		  	});	
	}


    /*getUsername = () => {
    	console.log("getUsername triggered")
    	let activeUsername = this.props.activeUser;
    	console.log("1"+activeUsername);
    	if (activeUsername !== "") {
    		console.log("2"+activeUsername);
    		this.setState({username : activeUsername});
    	}
    	else {
    		this.setState({username : "Guest"});
    	}
    }*/
   

    
  render() {
  		console.log("rendering");
 		return( 
 			<div className="userInfo">
 			    <span className="username">{this.props.activeUser ? this.props.activeUser : "Viewing as Guest"}</span>
 			    { !this.props.activeUser ? <Button onClick={this.signIn} classname="signinButton" bsStyle="primary">Sign in</Button> :
 			    <Button onClick={this.signOut} classname="signoutButton" bsStyle="link">Sign out</Button> }

 			</div>
 		);

 	}
 };


 export default User;