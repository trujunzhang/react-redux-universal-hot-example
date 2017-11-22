import Telescope from '../index';
import React, {Component} from 'react';

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
} = require('../../../lib/constants');

class AppPopup extends Component {

  renderMenu(overlayModel) {
    switch (overlayModel.overLayType) {
      case OVERLAY_TYPE_LOGGED_USER_MENU:
        return (<Telescope.components.UsersPopoverMenu model={overlayModel}/>);
      case OVERLAY_TYPE_ARTICLE_SAVE_BUTTON:
        return (<Telescope.components.UserCollectionsPopover model={overlayModel}/>);
      case OVERLAY_TYPE_MORE_TOPICS:
        return (<Telescope.components.MoreTagsPopoverMenu model={overlayModel}/>);
      case OVERLAY_TYPE_SUBMIT_FLAG:
        return (<Telescope.components.SubmitFlagPopover model={overlayModel}/>);
      case OVERLAY_TYPE_MESSAGES_LIST:
        return (<Telescope.components.MessagesListPopover comp={overlayModel}/>);
      case OVERLAY_TYPE_USER_DELETE_CONFIRM:
        return (<Telescope.components.UsersPopoverDeleteConfirm model={overlayModel}/>);
      case OVERLAY_TYPE_LOGIN_UI:
        return (<Telescope.components.UserLoginLayout model={overlayModel}/>);
      default:
        return null;
    }
  }

  render() {
    const {detailedModelsOverlay} = this.props;
    const {overlayModel} = detailedModelsOverlay;

    if (!!overlayModel) {
      return (
        <div id="show_popover_menu">
          {this.renderMenu(overlayModel)}
        </div>
      );
    }
    return null;
  }
}


const {connect} = require('react-redux');

function select(store) {
  return {
    detailedModelsOverlay: store.detailedModelsOverlay,
  };
}

export default connect(select)(AppPopup);


