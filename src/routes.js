import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth';
import {
  App,
  Login,
  LoginSuccess,
  Survey,
  NotFound,
} from 'containers';


import Telescope from './components/lib';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const {auth: {user}} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      {/* Home (main) route */}
      <IndexRoute component={Telescope.components.PostsDailyWithSidebarPage}/>

      {/* Routes requiring login */}
      {/*<Route onEnter={requireLogin}>*/}
      {/*<Route path="loginSuccess" component={LoginSuccess}/>*/}
      {/*</Route>*/}

      {/* Routes */}
      <Route path="/post" component={Telescope.components.PostsSingle}/>
      <Route path="/about" component={Telescope.components.AppAbout}/>
      <Route path="/privacy" component={Telescope.components.AppPrivacy}/>
      <Route path="/terms" component={Telescope.components.AppTermsOfService}/>
      <Route path="/contact" component={Telescope.components.AppContact}/>
      <Route path="/careers" component={Telescope.components.AppCareers}/>
      <Route path="/list" component={Telescope.components.PostsListWithSidebarPage}/>
      <Route path="/new/article" component={Telescope.components.SubmitAnArticle}/>
      <Route path="/users/:slug" component={Telescope.components.UsersSingle}/>
      <Route path="/verifyemail/:token" component={Telescope.components.UsersVerifyEmail}/>
      <Route path="/removeaccount/:token" component={Telescope.components.UsersVerifyDeletion}/>

      {/* Catch all route */}
      <Route path="*" component={NotFound} status={404}/>
    </Route>
  );
};
