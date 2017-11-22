import Telescope from '../index';
import React, {Component} from 'react';

import onClickOutside from 'react-onclickoutside';

const {connect} = require('react-redux');
import {bindActionCreators} from 'redux';

import * as authActions from '../../../redux/modules/auth/authActions';

/**
 * States of login display
 */
const {
  LOGIN_FORM_TYPE_LOGIN,
  LOGIN_FORM_TYPE_REGISTER,
  LOGIN_FORM_TYPE_LOG_OUT,
  LOGIN_FORM_TYPE_FORGOTPASSWORD,
  LOGIN_FORM_TYPE_RESET_PASSWD,
} = require('../../../lib/constants');

const {
  showAlertMessage,
  dismissAppOverlay,
  signUpWithPassword,
  logInWithPassword,
  logInWithFacebook,
} = require('../../../actions');

class UserLoginLayout extends Component {
  constructor(props) {
    super(props);

    const {position, object} = props.model;

    const formType = object.formType || LOGIN_FORM_TYPE_LOGIN;
    this.state = this.initialState = {
      formType
    };

    switch (formType) {
      case LOGIN_FORM_TYPE_LOGIN:
        this.props.actions.loginState();
        break;
      case LOGIN_FORM_TYPE_REGISTER:
        this.props.actions.registerState();
        break;
    }
  }

  signIn() {
    this.setState({formType: LOGIN_FORM_TYPE_LOGIN});
    this.props.actions.loginState();
  }

  signUp() {
    this.setState({formType: LOGIN_FORM_TYPE_REGISTER});
    this.props.actions.registerState();
  }

  renderCloseIcon() {
    return (
      <a className="modal--close v-desktop"
         onClick={(evt) => {
           evt.preventDefault();
           this.handleClickOutside();
         }} title="Close">
        <span>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
          </svg>
        </span>
      </a>
    );
  }

  _renderCurrentFormType() {
    const {formType} = this.state;
    switch (formType) {
      case LOGIN_FORM_TYPE_LOGIN :
        return (
          <div className={`login-fullscreen SIGNIN`}>
            <h2 className="login-fullscreen--title">
              Log In
            </h2>
            <Telescope.components.UserLoginMain
              {...this.props}
              {...this.state}
            />
            - or -<br/>
            <Telescope.components.UserEmailSignIn
              {...this.props}
              {...this.state}
            />
          </div>
        );
      case LOGIN_FORM_TYPE_REGISTER:
        return (
          <div className={`login-fullscreen REGISTER`}>
            <h2 className="login-fullscreen--title">
              Sign Up
            </h2>
            <Telescope.components.UserLoginMain
              {...this.props}
              {...this.state}
            />
            - or -<br/>
            <Telescope.components.UserEmailSignUp
              {...this.props}
              {...this.state}
            />
          </div>
        );
    }
  }

  _renderFooter() {
    const {formType} = this.state;
    switch (formType) {
      case LOGIN_FORM_TYPE_LOGIN :
        return (
          <div className="LoginFormFooter">
            <i>Don’t have an account?</i>
            <a className="user_main_link" onClick={(e) => {
              this.signUp();
            }}>Sign Up</a>
          </div>
        );
      case LOGIN_FORM_TYPE_REGISTER:
        return (
          <div className="LoginFormFooter">
            <i>Already have an account? </i>
            <a className="user_main_link" onClick={(e) => {
              this.signIn();
            }}>Sign In</a>
          </div>
        );
    }
  }

  render() {
    return (
      <div className="modal-overlay v-fullscreen" id="popover_for_loginui">
        <div className="modal--content">
          {this._renderCurrentFormType()}
          {this._renderFooter()}
        </div>

        {this.renderCloseIcon()}
      </div>
    );
  }

  handleClickOutside = evt => {
    this.props.dismissAppOverlayAction();
  };
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch),
    showAlertMessageAction: (object) => dispatch(showAlertMessage(object)),
    // Model
    dismissAppOverlayAction: () => dispatch(dismissAppOverlay()),
    // Actions
    signUpWithPasswordAction: (username, email, password) => dispatch(signUpWithPassword(username, email, password)),
    logInWithPasswordAction: (username, password) => dispatch(logInWithPassword(username, password)),
    logInWithFacebookAction: () => dispatch(logInWithFacebook()),
  };
}

function select(store) {
  return {
    auth: store.authModel
  };
}

export default connect(select, mapDispatchToProps)(UserLoginLayout);





