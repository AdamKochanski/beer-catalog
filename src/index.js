import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import { ModalContainer, ModalRoute } from 'react-router-modal';


// @TODO modal routing...
// ReactDOM.render((  
//	<Router history={browserHistory}>
//	  <Route path="/" component={App} />
//	</Router>
// ), document.getElementById('root'));
// registerServiceWorker();


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
