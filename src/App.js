import React, { Component } from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Routes from "./routes/Routes";

import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'react-redux-api-tools';
import { fetchAuthUser } from './actions/api_auth';
import rootReducer from './reducers';

import './assets/css/Theme.css';

const store = createStore(rootReducer, applyMiddleware(thunk, apiMiddleware));

class App extends Component {
   componentDidMount() {
      store.dispatch(fetchAuthUser());
   }

   render() {
      return (
         <Provider store={store}>
            <Routes />
         </Provider>
      );
   }
}

export default App;
