import Telescope from '../index';
import React, {Component} from 'react';

const {
  timeout,
} = require('../../../actions');

/**
 * The states were interested in
 */
const {
  ALERT_TYPE_ERROR,
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
} = require('../../../lib/constants');

class UserEmailSignIn extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState = {
      // Message
      message: null,
    };
  }

  async signIn() {
    const {logInWithPasswordAction} = this.props;

    let username = this.props.auth.form.fields.username;
    let password = this.props.auth.form.fields.password;

    let errorMessage = null;

    this.props.actions.loginRequest();

    try {
      await Promise.race([
        logInWithPasswordAction(username, password),
        timeout(15000),
      ]);
    } catch (e) {
      this.props.actions.loginFailure(e);
      const message = e.message || e;
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        errorMessage = message;
        this.props.showAlertMessageAction({type: ALERT_TYPE_ERROR, text: errorMessage});
      }
    } finally {
      if (!!errorMessage) {
      } else {
        this.props.actions.loginSuccess();
        this.props.dismissAppOverlayAction();
      }
    }
  }

  onForgotPasswordClick(e) {

  }


  renderSignInForm() {
    const {auth} = this.props;
    const isDisabled = (!auth.form.isValid || auth.form.isFetching);

    return (
      <div id="user-signin-panel" className="overlay--dark">
        <div className="overlay-dialog--email">

          <div className="overlay-content">
            <div className="inputGroup u-marginBottom0">
              <input type="text"
                     name="usernameOrEmail"
                     id="signin_username_or_email_input"
                     className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-email"
                     placeholder="Username or Email"
                     value={
                       this.props.auth.form.fields.username
                     }
                     onChange={(e) => {
                       this.props.actions.onAuthFormFieldChange('username', e.target.value);
                     }}
              />
            </div>
          </div>
          <div className="overlay-content">
            <div className="inputGroup u-marginBottom0">
              <input type="password"
                     name="password"
                     id="signin_password_input"
                     className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-password"
                     placeholder="Password"
                     value={
                       this.props.auth.form.fields.password
                     }
                     onChange={(e) => {
                       this.props.actions.onAuthFormFieldChange('password', e.target.value);
                     }}
              />
            </div>
          </div>

          <div className="overlay-content" id="user-submit-button-panel">
            <button
              onClick={this.signIn.bind(this)}
              disabled={isDisabled}
              id="button_for_login"
              className="signInClass button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf">
              <div className="buttonContainer_wTYxi">
                Sign In
              </div>
            </button>
          </div>
          <div className="login-via-email">
            <button
              onClick={this.onForgotPasswordClick.bind(this)}
              disabled={isDisabled}
              id="button_for_forgot_password"
              className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderLoginFooterLinks() {
    return (
      <div className="login_footer_links light" id="__w2_VNnJBb6_social_signup_links">
        <a onClick={(e) => {
          this.props.switchFormState(e, 'MAIN');
        }}
           id="user_main_link">
          Sign In
        </a>
        <span className="bullet"> · </span>
        <a onClick={(e) => {
          this.props.switchFormState(e, 'REGISTER');
        }}
           id="user_email_register_link">
          Sign Up With Email
        </a>
      </div>
    );
  }

  render() {
    return (
      <div>
        <span>
          {!!this.state.message && <div className="errorMessage_2lxEG">{this.state.message.message}</div>}
          {this.renderSignInForm()}
        </span>
      </div>
    );
  }
}

export default UserEmailSignIn;
