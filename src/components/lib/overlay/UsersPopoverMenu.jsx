import React, {Component} from 'react';
import {Link} from 'react-router';
import onClickOutside from 'react-onclickoutside';
import Users from '../../../lib/users';

import $ from 'jquery';

const {
  logOut,
  dismissAppOverlay,
} = require('../../../actions');

class UsersPopoverMenu extends Component {

  constructor(props) {
    super(props);

    const {currentUser} = props,
      isMobileDevice = false;//Users.isMobileDevice();

    this.state = this.initialState = {
      loggedUserMenu: Users.getPopoverMenuArray(currentUser, isMobileDevice)
    };
  }

  onMenuItemClick(menu) {
    const {history, location} = this.props;

    switch (menu.type) {
      case 'logout':
        this.handleClickOutside();
        this.props.logOutAction();
        history.push({pathname: '/'});
        break;
      case 'line':
        break;
      default:
        this.handleClickOutside();
        const link = menu.link;
        history.push(link);
        break;
    }
  }

  render() {
    const {model} = this.props,
      {position} = model,
      {loggedUserMenu} = this.state;

    const top = position.top + position.height + 24;
    let left = (position.left + position.width / 2) - 50;

    let popoverClass = 'v-bottom-center';
    if (left + 150 >= $(window).width()) {
      popoverClass = 'v-bottom-left';
      left = left - 50;
    }

    const popover = Users.getCollectionsPopover(left, top, 148, -1, 0, popoverClass);

    return (
      <div id="medium-popover-user-menus" className={popover.className} style={popover.style}>
        <ul className="content_2mq4P">
          {loggedUserMenu.map((menu, key) => {
            if (menu.type === '') {
              return (<li key={key}/>);
            }
            else if (menu.type === 'separator') {
              return (
                <li key={key} className="list-item list-item--separator"/>
              );
            }
            return (
              <li key={key}
                  className="option_2XMGo secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2">
                <a className="button button--dark button--chromeless u-baseColor--buttonDark"
                   id={`user_pop_menu_${menu.type}`}
                   onClick={this.onMenuItemClick.bind(this, menu)}>
                  {menu.title}
                </a>
              </li>
            );
          })}
        </ul>

      </div>
    );
  }

  handleClickOutside = evt => {
    this.props.dismissAppOverlayAction();
  };
}

const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    logOutAction: () => dispatch(logOut()),
    dismissAppOverlayAction: () => dispatch(dismissAppOverlay()),
  };
}

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user
  };
}

export default connect(select, mapDispatchToProps)(onClickOutside(UsersPopoverMenu));
