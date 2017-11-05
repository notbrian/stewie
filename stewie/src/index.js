import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import App from './components/App';
import Landing from './components/Landing';
import NotFound from './components/NotFound';

import registerServiceWorker from './registerServiceWorker';

const Root = () => {
  return (
  	<BrowserRouter>
    	<Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/report" component={App} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}
render(<Root/>, document.querySelector('#main'));
