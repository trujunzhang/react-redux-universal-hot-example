import Telescope from '../../index';
import React, {Component} from 'react';
import {Link} from 'react-router';

import AppTable from '../../../../lib/appTable';

const {
  showAppOverlay,
} = require('../../../../actions');

class HeaderRightLoginPanel extends Component {

  render() {
    return (
      <div className="metabar-block metabar-block--right u-floatRight u-height65 u-xs-height56">
        <div className="buttonSet">
          <a className="nav-mobile-toggle">
            <i className="icon fa fa-fw fa-ellipsis-h icon-ellipsis-h"/>
          </a>
          <a id="nav_signup_button"
             onClick={(e) => AppTable.showLoginUI(this.props, '', '', true, true)}
             className="actionNavbtn button button--primary button--chromeless u-accentColor--buttonNormal is-inSiteNavBar u-lineHeight30 u-height32 u-marginRight15 is-touched">
            {'Submit an Article'}
          </a>
          <b
            className="actionNavbtn button button--primary button--chromeless u-accentColor--buttonNormal is-inSiteNavBar u-lineHeight30 u-height32 u-marginRight15 is-touched">
            <a
              onClick={(e) => AppTable.showLoginUI(this.props, '', '', true, true)}
              className="signInButtonTop">Log In</a>
            <a
              onClick={(e) => AppTable.showLoginUI(this.props, '', '', true, false)}
              className="signUpButtonTop">Sign up</a>
          </b>

          {/*<Telescope.components.HeaderContentSearchBar barType="icon"/>*/}

        </div>
      </div>
    );
  }

}


const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    showAppOverlayAction: (object) => dispatch(showAppOverlay(object)),
  };
}

export default connect(null, mapDispatchToProps)(HeaderRightLoginPanel);
