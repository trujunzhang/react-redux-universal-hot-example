import React, {Component} from 'react';

const {dismissAlertMessage} = require('../../../actions');

/**
 * The states were interested in
 */
const {
  ALERT_TYPE_SUCCESS,
  ALERT_TYPE_ERROR,
  ALERT_TYPE_INFO,
} = require('../../../lib/constants');

const ALERTCLASS = {
  ALERT_TYPE_SUCCESS: 'success',
  ALERT_TYPE_ERROR: 'error',
  ALERT_TYPE_INFO: 'info',
};

class F8AppAlertSection extends React.Component {

  render() {
    if (!!this.props.appAlert.message) {
      const {type, text} = this.props.appAlert.message;
      const currentType = ALERTCLASS[type];
      return (
        <div id="alert-container">

          <div className={`alert alert-${currentType}`}>
            <a onClick={() => {
              this.props.dispatch(dismissAlertMessage());
            }}
               className="js-alert-dismiss dismiss-link">{'×'}</a>
            <p className={`alert-${currentType}`}>
              {text}
            </p>
          </div>
        </div>
      );
    }

    return null;
  }
}


const {connect} = require('react-redux');

function select(store) {
  return {
    appAlert: store.appAlert
  };
}

export default connect(select)(F8AppAlertSection);
