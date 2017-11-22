import Telescope from '../index'
import React, {Component} from 'react';

const {
  showAlertMessage,
  dismissAlertMessage,
  timeout,
  signUpWithPassword
} = require('../../../actions')

/**
 * The states were interested in
 */
const {
  ALERT_TYPE_ERROR,
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
} = require('../../../lib/constants')

class UserEmailSignUp extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState = {
      formState: "COMMON",
      // Message
      message: null,
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {

  }

  async signUp() {
    const {signUpWithPasswordAction} = this.props

    const username = this.props.auth.form.fields.username;
    const email = this.props.auth.form.fields.email;
    const password = this.props.auth.form.fields.password;

    let errorMessage = null
    this.setState({message: null})

    this.props.actions.signupRequest()

    try {
      await Promise.race([
        signUpWithPasswordAction(username, email, password),
        timeout(15000)
      ])
    } catch (e) {
      this.props.actions.signupFailure(e)
      const message = e.message || e
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        errorMessage = message;
        this.props.showAlertMessageAction({type: ALERT_TYPE_ERROR, text: errorMessage})
      }
    } finally {
      if (!!errorMessage) {
      } else {
        this.props.actions.signupSuccess()
        this.props.dismissAppOverlayAction()
      }
    }
  }

  renderSignupForm() {
    const {auth} = this.props;
    // const isDisabled = (!auth.form.isValid || auth.form.isFetching);
    const isDisabled = false;

    return (
      <div id="user-signin-panel" className="overlay--dark">
        <div className="overlay-dialog--email">
          <div className="overlay-content">
            <div className="inputGroup u-marginBottom0">
              <input type="text" name="text"
                     className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-email"
                     placeholder="Username"
                     value={
                       this.props.auth.form.fields.username
                     }
                     onChange={(e) => {
                       this.props.actions.onAuthFormFieldChange('username', e.target.value)
                     }}
              />
            </div>
          </div>
          <div className="overlay-content">
            <div className="inputGroup u-marginBottom0">
              <input type="email" name="email"
                     className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-email"
                     placeholder="Email"
                     value={
                       this.props.auth.form.fields.email
                     }
                     onChange={(e) => {
                       this.props.actions.onAuthFormFieldChange('email', e.target.value)
                     }}
              />
            </div>
          </div>
          <div className="overlay-content">
            <div className="inputGroup u-marginBottom0">
              <input type="password" name="password"
                     className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-password"
                     placeholder="Password"
                     value={
                       this.props.auth.form.fields.password
                     }
                     onChange={(e) => {
                       this.props.actions.onAuthFormFieldChange('password', e.target.value)
                     }}
              />
            </div>
          </div>
          <div className="overlay-content buttonGroup_2NmU8 right_2JztM" id="user-submit-button-panel">
            <button
              onClick={this.signUp.bind(this)}
              disabled={isDisabled}
              className="signInClass button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
              type="button">
              <div className="buttonContainer_wTYxi">Sign up</div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderResult() {
    return (
      <div>
        <div className="alert alert-info" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign">
          </span>
          <span className="sr-only">Error:</span>
          {"You need to verify your email address before using Politicl. "}
          <a className="resend_verification_link"
             onClick={this.onResendVerificationLinkClick.bind(this)}>Resend verification link</a>.
        </div>
      </div>
    )
  }

  render() {
    const {formState} = this.state;
    return (
      <div>
        <span>
          {!!this.state.message && <div className="errorMessage_2lxEG">{this.state.message.message}</div>}
          {formState === "RESULT" ? this.renderResult() : this.renderSignupForm()}
        </span>
      </div>
    )
  }
}

export default UserEmailSignUp;
