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
   

    
  render() {
  		console.log("rendering");
 		return( 
			<div>
				<span className="username">{this.props.activeUser ? this.props.activeUser : "Welcome, Guest"}</span><br/>
				{ !this.props.activeUser ? <Button onClick={this.signIn} className="signinButton"><img className="g-signin" src="../assets/images/btn_google_signin_dark_normal_web@2x.png"/></Button> :
				<Button onClick={this.signOut} className="signoutButton" bsStyle="link">Sign out</Button> }
			</div>    
						
 		);

 	}
 };


 export default User;