import Telescope from '../../index';
import React, {Component} from 'react';

import {Link} from 'react-router';

import Users from '../../../../lib/users';

/**
 * The states were interested in
 */
const {
  OVERLAY_TYPE_MORE_TOPICS,
  OVERLAY_TYPE_LOGIN_UI,
  OVERLAY_TYPE_LOGGED_USER_MENU,
  OVERLAY_TYPE_ARTICLE_SAVE_BUTTON,
  OVERLAY_TYPE_SUBMIT_FLAG,
  OVERLAY_TYPE_MESSAGES_LIST,
  OVERLAY_TYPE_USER_DELETE_CONFIRM,
} = require('../../../../lib/constants');

class HeaderRightUserPanel extends Component {
  onBookmarkClick() {

  }

  onMessageButtonClick() {

  }

  popoverUserMenus() {
    const button = this.refs.userProfile;
    const top = button.offsetTop;
    const left = button.offsetLeft;
    const width = button.clientWidth;
    const height = button.clientHeight;

    const model = {
      overLayType: OVERLAY_TYPE_LOGGED_USER_MENU,
      object: {},
      position: {
        top, left, width, height
      }
    };
    this.props.showAppOverlayAction(model);
  }

  renderBookmarkIcon() {
    return (
      <a onClick={this.onBookmarkClick.bind(this)}
         className="button button--chromeless is-touchIconFadeInPulse u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--bookmark js-bookmarkButton"
         title="Bookmark this story to read later">
        <span className="button-defaultState">
          <span className="svgIcon svgIcon--bookmark svgIcon--25px">
            <svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25">
              <path
                d="M16 6c1.1 0 2 .9 2 2v13.661h-.012a.5.5 0 0 1-.118.285.508.508 0 0 1-.708.03L11.5 17.85l-5.662 4.125a.5.5 0 0 1-.706-.03.478.478 0 0 1-.12-.285H5V8c0-1.1.9-2 2-2h9zM6 8v12.636l5.162-3.667a.49.49 0 0 1 .676 0L17 20.637V8c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1z"/>
              <path
                d="M21 5v13.661h-.012a.5.5 0 0 1-.118.285.508.508 0 0 1-.708.03L20 18.858V5c0-.55-.45-1-1-1h-9c-.55 0-1 .45-1 1H8c0-1.1.9-2 2-2h9c1.1 0 2 .9 2 2z"/>
            </svg>
          </span>
        </span>
        <span className="button-activeState">
          <span className="svgIcon svgIcon--bookmarkFilled svgIcon--25px">
            <svg className="svgIcon-use" width="25" height="26" viewBox="0 0 25 26">
              <path
                d="M19 7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v14.66h.012c.01.103.045.204.12.285a.5.5 0 0 0 .706.03L12.5 17.85l5.662 4.126a.508.508 0 0 0 .708-.03.5.5 0 0 0 .118-.285H19V7z"/>
            </svg>
          </span>
        </span>
      </a>
    );
  }


  renderNotification() {
    const {isLoggedIn, currentUser} = this.props;
    if (!isLoggedIn) {
      return null;
    }

    const messagesLength = 0;//Users.getMessagesLength(currentUser);
    if (messagesLength !== 0) {
      return (
        <a id="messagesButton"
           ref="messagesButton"
           onClick={this.onMessageButtonClick.bind(this)}
           className="button button--small button--circle button--chromeless is-touchIconBlackPulse is-inSiteNavBar u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--activity js-notificationsButton"
           title="Notifications">

          <span className="svgIcon svgIcon--bell svgIcon--25px">
            <span
              className="activityFeedLabelUnseen_2t9sf menuLink_1h9ZN secondaryText_PM80d default_tBeAo base_3CbW2">
              {messagesLength}
            </span>
          </span>
        </a>
      );
    }

    return (
      <a id="messagesButton"
         ref="messagesButton"
         onClick={this.onMessageButtonClick.bind(this)}
         className="button button--small button--circle button--chromeless is-touchIconBlackPulse is-inSiteNavBar u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--activity js-notificationsButton"
         title="Notifications">

        <span className="svgIcon svgIcon--bell svgIcon--25px">
          <svg className="svgIcon-use" width="25" height="25" viewBox="-293 409 25 25">
            <path
              d="M-273.327 423.67l-1.673-1.52v-3.646a5.5 5.5 0 0 0-6.04-5.474c-2.86.273-4.96 2.838-4.96 5.71v3.41l-1.68 1.553c-.204.19-.32.456-.32.734V427a1 1 0 0 0 1 1h3.49a3.079 3.079 0 0 0 3.01 2.45 3.08 3.08 0 0 0 3.01-2.45h3.49a1 1 0 0 0 1-1v-2.59c0-.28-.12-.55-.327-.74zm-7.173 5.63c-.842 0-1.55-.546-1.812-1.3h3.624a1.92 1.92 0 0 1-1.812 1.3zm6.35-2.45h-12.7v-2.347l1.63-1.51c.236-.216.37-.522.37-.843v-3.41c0-2.35 1.72-4.356 3.92-4.565a4.353 4.353 0 0 1 4.78 4.33v3.645c0 .324.137.633.376.85l1.624 1.477v2.373z"/>
          </svg>
        </span>
      </a>
    );
  }

  renderUserMenu() {
    const {currentUser} = this.props,
      userName = Users.getDisplayName(currentUser);

    return (
      <button
        ref="userProfile"
        id="logged-user-menu"
        title={userName}
        className="button button--small button--chromeless u-baseColor--buttonNormal is-inSiteNavBar js-userActions"
        onClick={this.popoverUserMenus.bind(this)}>
        <Telescope.components.UsersBlurryImageAvatar
          imageClass={'avatar-image avatar-image--icon'}
          forUser={currentUser}
          size={32}
        />
      </button>
    );
  }


  render() {
    const writeClass =
      'button button--blue button--chromeless u-accentColor--buttonNormal is-inSiteNavBar u-sm-hide u-marginRight15 u-lineHeight30 u-height32';

    return (
      <div className="metabar-block metabar-block--right u-floatRight u-height65 u-xs-height56">
        <div className="buttonSet">
          <Link
            to="/new/article"
            id="header-submit-an-article"
            className={writeClass + ' actionNavbtn'}>
            {'Submit an Article'}
          </Link>

          {/*Search Icon*/}
          {/*<Telescope.components.HeaderContentSearchBar barType="icon"/>*/}

          {/*Notification Icon*/}
          {this.renderNotification()}

          {this.renderBookmarkIcon()}
          {this.renderUserMenu()}
        </div>
      </div>
    );
  }

}

export default HeaderRightUserPanel;
