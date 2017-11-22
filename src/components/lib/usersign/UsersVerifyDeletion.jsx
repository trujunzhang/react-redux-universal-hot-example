import Telescope from '../index';
import React, {Component} from 'react';

import AppConstants from '../../../lib/appConstants';

const {
  timeout,
  loadSingleUserByUserId,
  removeOnlineParseObject,

  logOut,
} = require('../../../actions');

const {
  getPageFormTypeForUserProfile,
} = require('../../filter/filterRoutes');

const {getModelByObjectId} = require('../../filter/filterPosts');
const queryString = require('query-string');

/**
 * The states were interested in
 */
const {
  PARSE_USERS,

  //Alert Type
  ALERT_TYPE_SUCCESS,
  ALERT_TYPE_ERROR,
  ALERT_TYPE_INFO,
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
} = require('../../../lib/constants');


const {secret} = require('../../../lib/utils');

class UsersVerifyDeletion extends Component {

  constructor(props, context) {
    super(props);

    const {location, match, isLoggedIn} = props;
    const token = match.params.token || '';
    const _query = queryString.parse(location.search || '');

    const userName = _query.username || '';
    this.state = {
      userLoggedIn: isLoggedIn,
      waiting: false,
      message: {
        type: ALERT_TYPE_INFO,
        content: `Deleting user ${userName}`
      },
      wait: false,
      token,
      userName
    };
  }

  componentWillReceiveProps(nextProps) {
    const {waiting, userLoggedIn} = this.state;
    const {isLoggedIn} = this.props;

    if (waiting === false && userLoggedIn === false && isLoggedIn === true) {
      this.setState({
        userLoggedIn: true
      });

      this.confirmDeleteUser();
    }
  }

  async confirmDeleteUser() {
    const {userName, token} = this.state;
    const {removeOnlineParseObjectAction, currentUser, isLoggedIn} = this.props;

    if (isLoggedIn === false) {
      this.setState({
        message: {
          type: ALERT_TYPE_ERROR,
          content: 'Before delete the account, you must be logged in firstly.'
        }
      });
      return;
    }

    let errorMessage = null;
    const _object = {
      objectSchemaName: PARSE_USERS,
      model: {
        parseId: currentUser.id,
        token,
        userName
      }
    };

    try {
      await Promise.race([
        removeOnlineParseObjectAction(_object),
        timeout(15000)]);
    } catch (e) {
      const message = e.message || e;
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        errorMessage = message;
      }
    } finally {
      if (!!errorMessage) {
        this.setState({
          message: {
            type: ALERT_TYPE_ERROR,
            content: errorMessage
          }
        });
      } else {
        this.setState({
          message: {
            type: ALERT_TYPE_SUCCESS,
            content: `Your account (${userName}) has been deleted.`
          }
        });
        this.props.logOutAction();
      }
    }
  }


  componentDidMount() {
    this.confirmDeleteUser();
  }

  renderMessage() {
    const {message} = this.state;
    const {type, content} = message;

    switch (type) {
      case ALERT_TYPE_SUCCESS:
        break;
      case ALERT_TYPE_ERROR:
        break;
      case ALERT_TYPE_INFO:
        return (
          <div className="post_loading_same_height_as_load_more">
          <span className="loading_2hQxH featured_2W7jd subtle_1BWOT base_3CbW2">
              <div className="post-loadmore-spinner">
                  <span>
                      {content}
                    </span>
                  <div className="bounce1"/>
                  <div className="bounce2"/>
                  <div className="bounce3"/>
              </div>
          </span>
          </div>
        );
    }

    return (
      <div className='password-reset-form'>
        <div className="errorMessage_2lxEG">{content}</div>
      </div>
    );
  }

  render() {
    return (
      <section className="results_37tfm">
        <div>
          {this.renderMessage()}
        </div>
      </section>
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
    logOutAction: () => dispatch(logOut()),
    //Model
    loadSingleUserByUserIdAction: (parseId) => dispatch(loadSingleUserByUserId(parseId)),
    removeOnlineParseObjectAction: (object) => dispatch(removeOnlineParseObject(object)),
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

export default connect(select, mapDispatchToProps)(UsersVerifyDeletion);


