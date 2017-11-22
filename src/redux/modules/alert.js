const {
  RESET_ERROR,
  SHOW_ALERT_MESSAGE,
  DISMISS_ALERT_MESSAGE,
  UPDATE_MODEL_REQUEST
} = require('../../lib/constants');

const initialState = {message: null};

export default function error(state = initialState, action = {}) {

  if (action.type === DISMISS_ALERT_MESSAGE) {
    return initialState;
  }

  if (action.type === SHOW_ALERT_MESSAGE) {
    return {message: action.payload};
  }

  if (action.type === UPDATE_MODEL_REQUEST) {
    return initialState;
  }


  return state;
}
