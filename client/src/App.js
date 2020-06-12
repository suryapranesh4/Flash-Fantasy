import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route , Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import './App.css';

import Navbar from '../src/components/utils/Navbar';
import Landing from './components/pages/Landing';
import Signup from '../src/components/pages/Signup';
import Login from '../src/components/pages/Login';
import Home from '../src/components/pages/Home';
import Match from '../src/components/pages/Match';
import Team from '../src/components/pages/Team';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';

import { loadUser } from '../src/actions/auth';

if(localStorage.getItem('token')){
  setAuthToken(localStorage.getItem('token'));
}

const App = () => {

    useEffect(() => {
        store.dispatch(loadUser());
    })

    return (
      <Provider store={store}>
        <div className="content">
          <Router>
              <Navbar/>
              <Switch>
                <Route path="/" component={Landing} exact></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/login" component={Login}></Route>
                <PrivateRoute path="/home" component={Home}></PrivateRoute>
                <PrivateRoute path="/match/:matchinfo" component={Match}></PrivateRoute>
                <PrivateRoute path="/team" component={Team}></PrivateRoute>
              </Switch>
          </Router>
        </div>
      </Provider>
    );
}

export default App;
