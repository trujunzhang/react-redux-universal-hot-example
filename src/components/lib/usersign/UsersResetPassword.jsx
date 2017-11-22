import Telescope from '../index';
import React, {Component} from 'react';


class UsersResetPassword extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      newPassword: '',
      // Message
      message: null
    };
  }

  onResetPassClick(event) {

  }


  renderResetPanel() {
    const {waiting} = this.state;
    return (
      <div id="user-signin-panel" className="overlay--dark">
        <div className="overlay-dialog--email">
          <div className="overlay-content">
            <div className="u-paddingTop10">Password</div>
            <div className="inputGroup u-marginBottom0">
              <input type="password"
                     name="password"
                     id="signin_password_input"
                     className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-password"
                     placeholder="New Password"
                     value={this.state.newPassword}
                     onChange={(e) => this.setState({'newPassword': e.target.value})}
              />
            </div>
          </div>
          <div className="right_1jQ6K buttonGroup_2NmU8 right_2JztM" id="user-submit-button-panel">
            <div className="buttonWithNotice_3bRZb">
              <button
                disabled={waiting}
                onClick={this.onResetPassClick.bind(this)}
                id="button_for_login"
                className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf">
                <div className="buttonContainer_wTYxi">
                  Reset
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderChild() {
    return (
      <div>
        <span>
          {!!this.state.message && <div className="errorMessage_2lxEG">{this.state.message.message}</div>}
          {this.renderResetPanel()}
        </span>
      </div>
    );
  }

  render() {
    return (
      <Telescope.components.UserLoginLayout
        title={'Reset your password'}
        showCloseIcon={false}
        child={this.renderChild()}>
      </Telescope.components.UserLoginLayout>
    );
  }
}

export default UsersResetPassword;


