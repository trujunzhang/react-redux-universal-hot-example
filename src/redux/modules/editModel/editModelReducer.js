/**
 * # editModelReducer.js
 *
 * The reducer for all the actions from the various log states
 */


const _ = require('underscore');

/**
 * ## Imports
 * The InitialState for auth
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
const InitialState = require('./editModelInitialState');
const fieldValidation = require('../../../lib/fieldValidation');
const formValidation = require('./editModelFormValidation');


/**
 * ## Auth actions
 */
const {
  SET_STATE,
  ON_EDIT_MODEL_FORM_FIELD_CHANGE,
  ON_RESTAURANT_MODEL_FORM_ADDRESS_FIELD_CHANGE,
  EDIT_MODEL_TOGGLE_TYPE,
  TABLE_SELECT_ALL_ROWS_TOGGLE_TYPE,
  TABLE_SELECTED_ROWS_TOGGLE_TYPE,
  TABLE_SINGLE_ROWS_EDIT_TYPE,
  TABLE_SINGLE_ROWS_CANCEL_EDIT_TYPE,
  TABLE_SELECTED_ROWS_EDIT_TYPE,
  TABLE_SELECTED_ROWS_CANCEL_EDIT_TYPE,
  TABLE_CHANGE_ACTION_TYPE,
  TABLE_CHANGE_ACTION_TYPE_USER_ROLE,
  MENU_TABLE_TYPE_POSTS,
  UPDATE_MODEL_REQUEST,
  UPDATE_MODEL_SUCCESS,
  UPDATE_MODEL_FAILURE,
  WRITE_MODEL_DONE,
  MODEL_FORM_TYPE_EDIT,
  LIST_VIEW_LOADED_BY_TYPE,

  // Table actions type
  TABLE_ACTIONS_TYPE_NONE,
  TABLE_ACTIONS_TYPE_EDIT,
  TABLE_ACTIONS_TYPE_MOVE_TRASH,
  TABLE_ACTIONS_TYPE_RESTORE,
  TABLE_ACTIONS_TYPE_DELETE,
  TABLE_ACTIONS_TYPE_APPROVE,
  TABLE_ACTIONS_TYPE_UNAPPROVE,
  TABLE_ACTIONS_TYPE_MAKE_AS_SPAM,
  TABLE_ACTIONS_TYPE_NOT_SPAM,


  // Users
  TABLE_ACTIONS_TYPE_USER_ROLE_NONE,
  TABLE_ACTIONS_TYPE_USER_ROLE_NORMAL,
  TABLE_ACTIONS_TYPE_USER_ROLE_ADMINISTRATOR,

  // Table edit type
  EDIT_TABLE_SINGLE_MODEL,
  EDIT_TABLE_MULTIPLE_MODEL,
  EDIT_TABLE_RESET,

  // Post Status
  POST_MODEL_STATUS_UNKNOW,
  POST_MODEL_STATUS_APPROVED,
  POST_MODEL_STATUS_PENDING,
  POST_MODEL_STATUS_SPAM_DRAFT,
} = require('../../../lib/constants');

import AppTable from '../../../lib/appTable';

const initialState = new InitialState();

/**
 * ## editModelReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
function editModelReducer(state = initialState, action = {}) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  switch (action.type) {
    case EDIT_MODEL_TOGGLE_TYPE:
      return new InitialState()
        .setIn(['form', 'state'], action.payload.tag)
        .setIn(['form', 'originModel'], action.payload.model)
        .setIn(['form', 'editModelType'], action.payload.editModelType)
        .setIn(['form', 'error'], null);

    /**
     * ### Auth form field change
     *
     * Set the form's field with the value
     * Clear the forms error
     * Pass the fieldValidation results to the
     * the formValidation
     */
    case ON_EDIT_MODEL_FORM_FIELD_CHANGE: {
      const {field, value, ignoreValidation} = action.payload;

      let nextState =
        state.setIn(['form', 'fields', field], value)
          .setIn(['form', 'error'], null);

      if (ignoreValidation) {
        return nextState;
      }

      return formValidation(
        fieldValidation(nextState, action)
        , action);
    }

    /**
     * ### Requests start
     * set the form to fetching and clear any errors
     */
    case UPDATE_MODEL_REQUEST: {
      return state
        .setIn(['form', 'isFetching'], true)
        .setIn(['form', 'error'], null);
    }
    /**
     * ### Requests end, good or bad
     * Set the fetching flag so the forms will be enabled
     */
    case UPDATE_MODEL_SUCCESS:
      return state.setIn(['form', 'isFetching'], false);

    /**
     *
     * The fetching is done, but save the error
     * for display to the user
     */
    case UPDATE_MODEL_FAILURE:
      return state.setIn(['form', 'isFetching'], false)
        .setIn(['form', 'error'], action.payload);


    case WRITE_MODEL_DONE: {
      return state
        .setIn(['form', 'tableSelectAction'], TABLE_ACTIONS_TYPE_NONE)
        .setIn(['form', 'tableUserRoleSelectAction'], TABLE_ACTIONS_TYPE_USER_ROLE_NONE)
        .setIn(['form', 'isValid'], true)
        .setIn(['form', 'isFetching'], false);
    }
  }
  /**
   * ## Default
   */
  return state;
}

export default editModelReducer;
