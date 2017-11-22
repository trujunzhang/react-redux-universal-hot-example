/**
 * # authActions.js
 *
 * All the request actions have 3 variations, the request, a success
 * and a failure. They all follow the pattern that the request will
 * set the ```isFetching``` to true and the whether it's successful or
 * fails, setting it back to false.
 *
 */

const _ = require('underscore')

/**
 * ## Imports
 *
 * The actions supported
 */
const {
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
  UPDATE_MODEL_REQUEST,
  UPDATE_MODEL_SUCCESS,
  UPDATE_MODEL_FAILURE,
  // Table edit type
  EDIT_TABLE_SINGLE_MODEL,
  EDIT_TABLE_MULTIPLE_MODEL,
  EDIT_TABLE_RESET,
} = require('../../../lib/constants')


/**
 * ## State actions
 * controls which form is displayed to the user
 */
export function toggleTableModelType(tag) {
  return {
    type: EDIT_MODEL_TOGGLE_TYPE,
    payload: {tag}
  }
}

/**
 * ## State actions
 * controls which form is displayed to the user
 */
export function toggleEditModelType(tag, model, editModelType) {
  return {
    type: EDIT_MODEL_TOGGLE_TYPE,
    payload: {tag, model, editModelType}
  }
}

/**
 *
 * ## State actions
 * controls which form is displayed to the user
 */
export function toggleSingleEditModel(tag, modelType) {
  return {
    type: EDIT_TABLE_SINGLE_MODEL,
    payload: {tag, modelType}
  }
}

export function resetEditModel() {
  return {
    type: EDIT_TABLE_RESET,
  }
}

export function toggleAllSelectRows() {
  return {
    type: TABLE_SELECT_ALL_ROWS_TOGGLE_TYPE,
  }
}

export function toggleSelectedRows(position, rowObjectId) {
  return {
    type: TABLE_SELECTED_ROWS_TOGGLE_TYPE,
    payload: {position, rowObjectId}
  }
}

export function setEditSelectedRow(editProps, objectSchemaName) {
  return {
    type: TABLE_SINGLE_ROWS_EDIT_TYPE,
    payload: {editProps, objectSchemaName}
  }
}

export function cancelSelectedRow() {
  return {
    type: TABLE_SINGLE_ROWS_CANCEL_EDIT_TYPE,
  }
}

export function setSelectedRowsActionEdit() {
  return {
    type: TABLE_SELECTED_ROWS_EDIT_TYPE,
    payload: {newValue: true}
  }
}

export function cancelSelectedRowEdit() {
  return {
    type: TABLE_SELECTED_ROWS_CANCEL_EDIT_TYPE,
    payload: {newValue: false}
  }
}


export function setTableActionType(newActionType) {
  return {
    type: TABLE_CHANGE_ACTION_TYPE,
    payload: {newActionType}
  }
}

export function setTableUserRoleActionType(newActionType) {
  return {
    type: TABLE_CHANGE_ACTION_TYPE_USER_ROLE,
    payload: {newActionType}
  }
}


/**
 * ## onAuthFormFieldChange
 * Set the payload so the reducer can work on it
 */
export function onEditModelFormFieldChange(field, value, ignoreValidation = false) {
  return {
    type: ON_EDIT_MODEL_FORM_FIELD_CHANGE,
    payload: {field: field, value: value, ignoreValidation: ignoreValidation}
  }
}

/**
 * ## onAuthFormFieldChange
 * Set the payload so the reducer can work on it
 */
export function onRestaurantFormAddressFieldChange(restaurant) {
  return {
    type: ON_RESTAURANT_MODEL_FORM_ADDRESS_FIELD_CHANGE,
    payload: {restaurant}
  }
}

/**
 * ## Login actions
 */
export function updateModelRequest() {
  return {
    type: UPDATE_MODEL_REQUEST
  }
}

export function updateModelSuccess() {
  return {
    type: UPDATE_MODEL_SUCCESS
  }
}

export function updateModelFailure(error) {
  return {
    type: UPDATE_MODEL_FAILURE,
    payload: error
  }
}
