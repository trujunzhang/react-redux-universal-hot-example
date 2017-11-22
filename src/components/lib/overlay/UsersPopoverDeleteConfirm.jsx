import Telescope from '../index';
import React, {Component} from 'react';

import onClickOutside from 'react-onclickoutside';

import {FormattedMessage, intlShape} from 'react-intl';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as authActions from '../../../redux/modules/auth/authActions';

import AppConstants from '../../../lib/appConstants';
import AppTable from '../../../lib/appTable';


const {
  showAlertMessage,
  callCloudInviteEmailMethod,
  timeout,
  dismissAppOverlay,
} = require('../../../actions');


/**
 * The states were interested in
 */
const {
  CLOUD_INVITE_WITH_EMAILS,
  MENU_ITEM_ADD_OR_EDIT_USER,
  ALERT_TYPE_SUCCESS,
  ALERT_TYPE_ERROR,
  MENU_ITEM_LOGGED_USER_INVITE,
  EMAIL_SEND_CLOUD_MODEL,

  // Confirm Delete user form type
  CONFIRM_DELETE_USER_MAIN,
  CONFIRM_DELETE_USER_RESULT,

  // Email template type
  EMAILS_TEMPLATE_VERIFY_REMOVE_USER,
} = require('../../../lib/constants');

const {secret} = require('../../../lib/utils');

class UsersPopoverDeleteConfirm extends Component {
  constructor(props, context) {
    super(props);

    this.state = this.initialState = {
      formType: CONFIRM_DELETE_USER_MAIN,
      waiting: false
    };

  }


  async onConfirmClick() {
    const {waiting} = this.state;
    if (waiting) {
      return;
    }

    this.setState({waiting: true});

    const {callCloudInviteEmailMethodAction, currentUser} = this.props;

    const username = currentUser.username;
    const toEmail = currentUser.email;

    const params = {
      userId: currentUser.id,
      username,
      token: secret(25)
    };

    let errorMessage = null;
    try {
      await Promise.race([
        callCloudInviteEmailMethodAction(EMAILS_TEMPLATE_VERIFY_REMOVE_USER, toEmail, params),
        timeout(15000),
      ]);
    } catch (e) {
      const message = e.message || e;
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        errorMessage = message;
        this.props.showAlertMessageAction({
          type: ALERT_TYPE_ERROR,
          text: 'Sent verify deletion user email failure!'
        });
      }
    } finally {
      this.setState({waiting: false});
      if (!!errorMessage) {
      } else {
        this.setState({formType: CONFIRM_DELETE_USER_RESULT});
        this.props.showAlertMessageAction({
          type: ALERT_TYPE_SUCCESS,
          text: `Sent emails successfully!`
        });
      }
    }
  }

  onCancelClick() {
    this.props.dismissAppOverlayAction();
  }

  render() {
    const {formType} = this.state;
    switch (formType) {
      case CONFIRM_DELETE_USER_MAIN:
        return this.renderMain();
      case CONFIRM_DELETE_USER_RESULT:
        return this.renderResult();
    }
  }

  renderResult() {
    const hint =
      'We’re sorry to see you go. ' +
      'The steps to delete your account have been emailed to you. ' +
      'Please check your email to complete the deletion process.';
    return (
      <div className="overlay" id="user_profile_delete_popover_overlay">
        <button
          onClick={this.onCancelClick.bind(this)}
          className="button button--close button--chromeless u-baseColor--buttonNormal">
          {'×'}
        </button>
        <div className="overlay-dialog overlay-dialog--form overlay-dialog--animate js-overlayDialog"
             tabIndex="-1">
          <h3 className="overlay-title">Confirm account deletion</h3>
          <div className="overlay-content">
            <div>{hint}</div>
          </div>
          <div className="overlay-actions buttonSet" id="button--light">
            <button
              className="button button--primary button--withChrome u-accentColor--buttonNormal button--overlayConfirm"
              onClick={this.onCancelClick.bind(this)}
              title="Confirm account deletion"
              type="form">
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderMain() {
    const {waiting} = this.state;
    const hint =
      'Are you sure you want to delete your account?  ' +
      'This action is irreversible and you will permanently lose all your data on Politicl.com.';
    return (
      <div className="overlay" id="user_profile_delete_popover_overlay">
        <button
          onClick={this.onCancelClick.bind(this)}
          className="button button--close button--chromeless u-baseColor--buttonNormal">
          {'×'}
        </button>
        <div className="overlay-dialog overlay-dialog--form overlay-dialog--animate js-overlayDialog"
             tabIndex="-1">
          <h3 className="overlay-title">Confirm account deletion</h3>
          <div className="overlay-content">
            <div>{hint}</div>
          </div>
          <div className="overlay-actions buttonSet" id="button--light">
            <button
              className="button button--delete button--withChrome u-accentColor--buttonNormal button--overlayConfirm"
              onClick={this.onConfirmClick.bind(this)}
              id="deletion_users_button"
              title="Confirm account deletion"
              disabled={waiting}
              type="form">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    );
  }

}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch),
    callCloudInviteEmailMethodAction: (templateType, toEmail, params) => dispatch(callCloudInviteEmailMethod(templateType, toEmail, params)),
    // Model
    dismissAppOverlayAction: () => dispatch(dismissAppOverlay()),
    showAlertMessageAction: (object) => dispatch(showAlertMessage(object)),
  };
}

function select(store, ownProps) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user,
    auth: store.auth,
  };
}

export default connect(select, mapDispatchToProps)(UsersPopoverDeleteConfirm);

