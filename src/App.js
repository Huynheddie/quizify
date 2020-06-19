import React, { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';
import CustomHomeRoute from './components/CustomHomeRoute';
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
import './css/App.css';

function App() {

  return (
    <div style={{textAlign: "center", height: "100%"}}>

      <Router>
        <Switch>
          <Route path="/login" render={(props) => (
            <LoginPage /> )} 
          />
          <CustomHomeRoute path="/" />
        </Switch>
      </Router>
    
     
    </div>
  );
}

export default App;