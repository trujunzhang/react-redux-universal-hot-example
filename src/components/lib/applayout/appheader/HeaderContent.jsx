import Telescope from '../../index';
import React, {Component} from 'react';

import {Link} from 'react-router';

import AppConstants from '../../../../lib/appConstants';
import Users from '../../../../lib/users';

const {
  showAppOverlay,
} = require('../../../../actions');

class HeaderContent extends Component {

  constructor(props, context) {
    super(props);

    this.state = this.initialState = {};
  }

  renderLeft() {
    return (
      <div className="metabar-block metabar-block--left u-floatLeft u-height65 u-xs-height56">
        <a className="sidebar-mobile-toggle">
          <i className="icon fa fa-fw fa-bars icon-bars"/>
        </a>
        <Link
          to={'/'}
          className="siteNav-logo">
          <span className="svgIcon svgIcon--logoNew svgIcon--45px is-flushLeft">
            <img id="politicl-logo" width="138" height="32"
                 src='/images/politicl-logo.png'>
            </img>
          </span>
        </Link>
      </div>
    );
  }

  renderRight() {
    const {isLoggedIn} = this.props;
    if (isLoggedIn) {
      return (<Telescope.components.HeaderRightUserPanel  {...this.props}/>);
    }
    return (<Telescope.components.HeaderRightLoginPanel/>);
  }

  renderHeader() {
    return (
      <div className="header_2k8Jf medium-header">
        <div className="metabar constraintWidth_ZyYbM">
          <div className="headerContent_3umLL centerItems_222KX u-height65">
            {this.renderLeft()}
            {this.renderRight()}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div id="section_header">
        {this.renderHeader()}
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

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user
  };
}

export default connect(select, mapDispatchToProps)(HeaderContent);


