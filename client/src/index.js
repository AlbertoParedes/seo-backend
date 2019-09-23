import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducers from './redux/reducers/reducers';
import { setEmpleado } from './redux/actions';

import firebase from './firebase/Firebase';
import 'firebase/database';
import 'firebase/auth';

import App from './components/App';
import SignIn from './components/SignIn/SignIn';
import StatusTask from './components/Scraping/StatusTask/StatusTask';



const browserHistory = createBrowserHistory();
const store = createStore(allReducers);
const db = firebase.database().ref();

firebase.auth().onAuthStateChanged( user => {
  var path = browserHistory.location.pathname
  if(user && (path==='/' || path==='/signin') ){
    var empleado = null;
    db.child('Empleados').orderByChild('email').equalTo(user.email).once("value", snapshot => {
      snapshot.forEach( data => {
        empleado=data.val();
        empleado.password=null;
      })
      store.dispatch(setEmpleado(empleado));
      browserHistory.push(`${process.env.PUBLIC_URL}`);
    })

  }else{
    browserHistory.replace(`${process.env.PUBLIC_URL}/signin`);
  }


});

render(
  <Provider store={store}>
    <Router history={browserHistory} path={`${process.env.PUBLIC_URL}/`}  >
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/statustask`} component={() => <StatusTask cron={false} /> } />
        <Route exact path={`${process.env.PUBLIC_URL}/statustask/cron`} component={() => <StatusTask cron={true} /> } />
        <Route path={`${process.env.PUBLIC_URL}/signin`} component={SignIn} />
        <Route exact path={`${process.env.PUBLIC_URL}`} component={App} />
      </Switch>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
