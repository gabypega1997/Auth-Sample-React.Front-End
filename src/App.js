import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';

import './App.css';



const initialState = {
  input: '',
  route: 'signin',
  isSignedIn: true,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet:'',
    age: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if(token){
      fetch('http://localhost:3000/signin',{
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if(data && data.id){
          fetch(`http://localhost:3000/profile/${data.id}`, {
            method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : token
        }
          })
          .then(resp => resp.json())
          .then(user => {
            if(user && user.email){
              this.loadUser(user);
              this.onRouteChange('home');
            }
          })

        }
      })
      .catch(console.log)
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render() {
    const { isSignedIn, route, isProfileOpen, user } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}
        toggleModal={this.toggleModal}
        />
        {isProfileOpen &&
          <Modal>
            <Profile 
            isProfileOpen={isProfileOpen} 
            toggleModal={this.toggleModal} 
            user={user}
            loadUser = {this.loadUser}
            />
          </Modal>}
        { route === 'home'
          ? <div>
              <h1>Home</h1>
            </div>
          : (
              route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
