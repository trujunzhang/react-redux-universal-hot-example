import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IndexLink} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import {isLoaded as isInfoLoaded, load as loadInfo} from 'redux/modules/info';
import {isLoaded as isAuthLoaded, load as loadAuth, logout, hideTopHeroPanel} from 'redux/modules/auth';
import {InfoBar} from 'components';
import {push} from 'react-router-redux';
import config from '../../config';
import {asyncConnect} from 'redux-async-connect';

import Telescope from '../../components/lib/index';

import AppConstants from '../../lib/appConstants';

const Parse = require('parse');

Parse.initialize(
  AppConstants.config.parse.api.applicationId,
  AppConstants.config.parse.api.javaScriptKey,
  AppConstants.config.parse.api.masterKey,
);

Parse.serverURL = AppConstants.config.parse.serverURL;

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    return (
      <div id="web-app-panel">

        <Helmet {...config.app.head}/>

        <Telescope.components.HeaderContent  {...this.props}/>
        {/*<Telescope.components.AppTopHero  {...this.props}/>*/}
        <Telescope.components.AppPopup/>

        <div id="container">
          {/*<Telescope.components.Newsletter  {...this.props}/>*/}

          {this.props.children}

        </div>

      </div>
    );

  }

}
