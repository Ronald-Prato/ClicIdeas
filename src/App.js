import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './Components/Login'
import FormCommon from './Components/FormCommon'
import FormRed from './Components/FormRed'
import Eval from './Components/Eval'
import UserProfile from './Components/UserProfile'
import SpashScreen from './Components/SplashScreen'
import UsersGenerator from './Components/UsersCreator'


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Login} path="/" exact />
        <Route component={Login} path="/login" />
        <Route component={FormCommon} path="/formcommon" />
        <Route component={FormRed} path="/formred" />
        <Route component={Eval} path="/eval" />
        <Route component={UserProfile} path="/user-profile" />
        <Route component={SpashScreen} path="/splash" />
        <Route component={UsersGenerator} path="/generate-users" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
