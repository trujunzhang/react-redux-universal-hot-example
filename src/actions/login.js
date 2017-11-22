/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */


// ========================
// For Web Apps
// ========================
const Parse = require('parse');

const slugify = require('slugify');

/**
 * The states were interested in
 */
const {
  LOGGED_IN,
  LOGGED_OUT,
  SET_SHARING,
  // parse models
  PARSE_TOPICS,
  PARSE_POSTS,
  PARSE_FLAGS,

  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_SITES,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  // statistic
  CLOUD_STATISTIC_FOR_POSTS,
  CLOUD_STATISTIC_FOR_TOPICS,
} = require('../lib/constants');

const {
  getQueryByType
} = require('../parse/parseUtiles');

import Users from '../lib/users';

const {updateInstallation} = require('./installation');

const {fromParseLoggedUser} = require('../parse/parseModels');

import type {Action, ThunkAction} from './types';


async function _logInWithPassword(username: string, password: string): Promise<Array<Action>> {
  const user = new Parse.User();
  user.set('username', username);
  user.set('password', password);

  await user.logIn();

  const action = {
    type: LOGGED_IN,
    payload: fromParseLoggedUser(user)
  };

  return Promise.all([
    Promise.resolve(action)
  ]);
}

function logInWithPassword(username: string, password: string): ThunkAction {
  return (dispatch) => {
    const login = _logInWithPassword(username, password);

    // Loading friends schedules shouldn't block the login process
    login.then(
      ([result]) => {
        dispatch(result);
      }
    );
    return login;
  };
}


async function _signUpWithPassword(username: string, email: string, password: string): Promise<Array<Action>> {
  const user = new Parse.User();

  user.set('username', username);
  user.set('displayName', username);
  user.set('password', password);
  user.set('slug', slugify(username, '_'));
  user.set('email', email);
  user.set('loginType', Users.config.TYPE_EMAIL);
  user.set('isAdmin', false);

  await user.signUp(Users.getDefaultUserProperty());

  const action = {
    type: LOGGED_IN,
    payload: fromParseLoggedUser(user)
  };

  return Promise.all([
    Promise.resolve(action)
  ]);
}

function signUpWithPassword(username, email, password): ThunkAction {
  return (dispatch) => {
    const login = _signUpWithPassword(username, email, password);

    // Loading friends schedules shouldn't block the login process
    login.then(
      ([result]) => {
        dispatch(result);
      }
    );
    return login;
  };
}


async function _verifyEmailWithToken(token: string, username: string): Promise<Array<Action>> {
  const user = new Parse.User();


  const action = {
    type: LOGGED_IN,
    payload: fromParseLoggedUser(user)
  };

  return Promise.all([
    Promise.resolve(action)
  ]);
}

function verifyEmailWithToken(username, email, password): ThunkAction {
  return (dispatch) => {
    const login = _verifyEmailWithToken(username, email, password);

    // Loading friends schedules shouldn't block the login process
    login.then(
      ([result]) => {
        dispatch(result);
      }
    );
    return login;
  };
}

export default {
  signUpWithPassword,
  logInWithPassword,
  verifyEmailWithToken,
};
