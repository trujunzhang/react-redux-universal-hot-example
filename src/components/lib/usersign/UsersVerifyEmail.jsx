import Telescope from '../index';
import React, {Component} from 'react';

import AppConstants from '../../../lib/appConstants';

const {
  loadSingleUserByUserId,
} = require('../../../actions');

const {
  getPageFormTypeForUserProfile,
} = require('../../filter/filterRoutes');

const {getModelByObjectId} = require('../../filter/filterPosts');
const queryString = require('query-string');

class UsersVerifyEmail extends Component {

  constructor(props, context) {
    super(props);

    const {location, match} = props;
    const token = match.params.token || '';
    const _query = queryString.parse(location.search || '');

    this.state = {
      message: '',
      wait: false,
      token,
      userName: _query.username || ''
    };
  }

  // http://localhost:1337/parse/apps/YTlrBqSp0MzkqIfZjG1Lz4L8BAu1XfqlMFJ4da3bSFu72tN0eK514AumUY/verify_email?token=dW4WAoVFNK6UpirkzAdtBZzld&username=trujunzhang
  verifyEmail() {
    const {token, userName} = this.state;
    const parseServerUrl = `${AppConstants.config.parse.serverURL}/apps/${AppConstants.config.parse.api.applicationId}/verify_email`;

    debugger;

    fetch(
      parseServerUrl,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          masterKey: AppConstants.config.parse.api.masterKey,
          restAPIKey: AppConstants.config.parse.api.restAPIKey,
          token: token,
          username: userName,
        })
      })
      .then((response) => {
        const result = response.json();
        debugger;
      })
      .catch((error) => {
        debugger;
        console.error(error);
      });
  }

  componentDidMount() {
    this.verifyEmail();
  }

  render() {
    const {message} = this.state;
    if (!!message) {
      return (
        <div className='password-reset-form'>
          <div className="errorMessage_2lxEG">{message}</div>
        </div>
      );
    }
    return (
      <div>
        <p>
          verify
        </p>
      </div>
    );
  }
}

/**
 * ## Imports
 *
 * Redux
 */
const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    //Model
    loadSingleUserByUserIdAction: (parseId) => dispatch(loadSingleUserByUserId(parseId)),
  };
}

function select(store) {
  return {
    listContainerTasks: store.listContainerTasks,
    detailedModelsOverlay: store.detailedModelsOverlay,
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user,
  };
}

export default connect(select, mapDispatchToProps)(UsersVerifyEmail);


