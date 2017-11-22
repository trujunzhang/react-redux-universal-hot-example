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


/**
 * The states were interested in
 */
const {
  LOGGED_IN,
  LOGGED_OUT,
  SET_SHARING,
} = require('../lib/constants');

import type {Action, ThunkAction} from './types';

function skipLogin(): Action {
  return {
    type: 'SKIPPED_LOGIN',
  };
}

function logOut(): ThunkAction {
  return (dispatch) => {
    Parse.User.logOut();
    // FB.logout()
    // FacebookSDK.logout()

    //updateInstallation({user: null, channels: []})

    // TODO: Make sure reducers clear their state
    return dispatch({
      type: 'LOGGED_OUT',
    });
  };
}


export default {
  skipLogin, logOut,
};
