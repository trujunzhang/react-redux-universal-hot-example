/**
 * # authActions.js
 *
 * All the request actions have 3 variations, the request, a success
 * and a failure. They all follow the pattern that the request will
 * set the ```isFetching``` to true and the whether it's successful or
 * fails, setting it back to false.
 *
 */

const _ = require('underscore');
/**
 * ## Imports
 *
 * The actions supported
 */
const {
  LOGOUT,
  REGISTER,
  LOGIN,
  FORGOT_PASSWORD,
  MENU_ITEM_ADD_OR_EDIT_USER,

  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  ON_AUTH_FORM_FIELD_CHANGE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,

  SET_STATE,
  DELETE_TOKEN_SUCCESS,

} = require('../../../lib/constants');


/**
 * ## State actions
 * controls which form is displayed to the user
 * as in login, register, logout or reset password
 */

export function logoutState() {
  return {
    type: LOGOUT
  };
}

export function registerState() {
  return {
    type: REGISTER
  };
}

export function loginState() {
  return {
    type: LOGIN
  };
}

export function editUserState() {
  return {
    type: MENU_ITEM_ADD_OR_EDIT_USER
  };
}

export function forgotPasswordState() {
  return {
    type: FORGOT_PASSWORD
  };
}

/**
 * ## Logout actions
 */
export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  };
}

export function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error
  };
}

/**
 * ## onAuthFormFieldChange
 * Set the payload so the reducer can work on it
 */
export function onAuthFormFieldChange(field, value) {
  return {
    type: ON_AUTH_FORM_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

/**
 * ## Signup actions
 */
export function signupRequest() {
  return {
    type: SIGNUP_REQUEST
  };
}

export function signupSuccess(json) {
  return {
    type: SIGNUP_SUCCESS,
    payload: json
  };
}

export function signupFailure(error) {
  return {
    type: SIGNUP_FAILURE,
    payload: error
  };
}

/**
 * ## signup
 * @param {string} username - name of user
 * @param {string} email - user's email
 * @param {string} password - user's password
 * @param {string} roleType - user's type, such as "admin","client","driver"
 *
 * Call the server signup and if good, save the sessionToken,
 * set the state to logout and signal success
 *
 * Otherwise, dispatch the error so the user can see
 */
export function signup(username, email, password, roleType) {
  return dispatch => {
    dispatch(deleteTokenRequestSuccess());
  };
}

export function deleteTokenRequestSuccess() {
  return {
    type: DELETE_TOKEN_SUCCESS
  };
}

/**
 * ## Login actions
 */
export function resetAuthorForm() {
  return {
    type: SET_STATE
  };
}

/**
 * ## Login actions
 */
export function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}

export function loginSuccess(json) {
  return {
    type: LOGIN_SUCCESS,
    payload: json
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error
  };
}

/**
 * ## Login
 * @param {string} username - user's name
 * @param {string} password - user's password
 *
 * After calling Backend, if response is good, save the json
 * which is the currentUser which contains the sessionToken
 *
 * If successful, set the state to logout
 * otherwise, dispatch a failure
 */

export function login(username, password) {
  return dispatch => {
    dispatch(loginRequest());
  };
}

/**
 * ## ResetPassword actions
 */
export function resetPasswordRequest() {
  return {
    type: RESET_PASSWORD_REQUEST
  };
}

export function resetPasswordSuccess() {
  return {
    type: RESET_PASSWORD_SUCCESS
  };
}

export function resetPasswordFailure(error) {
  return {
    type: RESET_PASSWORD_FAILURE,
    payload: error
  };
}

/**
 * ## ResetPassword
 *
 * @param {string} email - the email address to reset password
 * *Note* There's no feedback to the user whether the email
 * address is valid or not.
 *
 * This functionality depends on the server set
 * up correctly ie, that emails are verified.
 * With that enabled, an email can be sent w/ a
 * form for setting the new password.
 */
export function resetPassword(email) {
  return dispatch => {
    return dispatch(resetPasswordRequest());
  };
}
