import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '@shopify/polaris/styles.css';
import './css/landing.css';
import './css/font.css';

import Report from './components/Report';
import Landing from './components/Landing';
import NotFound from './components/NotFound';

const Root = () => {
  return (
  	<BrowserRouter>
    	<Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/report" component={Report} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}
render(<Root/>, document.querySelector('#main'));
