import Telescope from '../index';
import React, {Component} from 'react';

/**
 * States of login display
 */
const {
  LOGIN_FORM_TYPE_LOGIN,
  LOGIN_FORM_TYPE_REGISTER,
  LOGIN_FORM_TYPE_LOG_OUT,
  LOGIN_FORM_TYPE_FORGOTPASSWORD,
  LOGIN_FORM_TYPE_RESET_PASSWD,
  ALERT_TYPE_ERROR,
} = require('../../../lib/constants');


const {
  timeout,
} = require('../../../actions');

const {
  getLoginFormType,
} = require('../../filter/filterRoutes');

import AppTable from '../../../lib/appTable';

class UserLoginMain extends Component {

  async loginTwitter() {

  }

  async loginFacebook() {
    const {logInWithFacebookAction} = this.props;
    let errorMessage = null;

    try {
      await Promise.race([
        logInWithFacebookAction(),
        timeout(15000),
      ]);
    } catch (e) {
      const message = e.message || e;
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        debugger;
        errorMessage = message;
        this.props.showAlertMessageAction({type: ALERT_TYPE_ERROR, text: errorMessage});
      }
    } finally {
      if (!!errorMessage) {
      } else {
        this.props.dismissAppOverlayAction();
      }
    }
  }

  renderLoginFooterLinks() {
    return (
      <div className="login_footer_links light" id="__w2_VNnJBb6_social_signup_links">
        <a onClick={(e) => {
          this.props.switchFormState(e, 'SIGNIN');
        }}
           id="user_login_link">
          I Have a Politicl Account
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

  renderLoginForm() {
    const typeTitle = this.props.formType === LOGIN_FORM_TYPE_LOGIN ? 'Log In' : 'Sign Up';
    return (
      <div className="buttonGroup_1mB5C">
        <a
          className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d facebookSolidColor_pdgXp solidVariant_2wWrf"
          rel="login-with-facebook"
          onClick={this.loginFacebook.bind(this)}>
          <i className="fa fa-facebook-official"/>
          <div className="buttonContainer_wTYxi">
            {`${typeTitle} with facebook`}
          </div>
        </a>
        <a
          className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d twitterSolidColor_G22Bs solidVariant_2wWrf"
          rel="login-with-twitter"
          onClick={this.loginTwitter.bind(this)}>
          <i className="fa fa-twitter" aria-hidden="true"/>
          <div className="buttonContainer_wTYxi">
            {`${typeTitle} with twitter`}
          </div>
        </a>

      </div>
    );
  }

  render() {
    return (
      <div id="login_main_section">
        <span>
          {this.renderLoginForm()}
        </span>
      </div>
    );
  }
}

export default UserLoginMain;
