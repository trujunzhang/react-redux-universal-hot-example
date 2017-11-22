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
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */


/**
 * The states were interested in
 */
const {
  USERPROFILE_RESET,
  USERPROFILE_LOADED,
} = require('../../lib/constants');

const {User, fromParseUser} = require('../../parse/parseModels');

export type State = {
  ready: boolean,
  userProfile: User
}

const initialState = {
  ready: false,
  userProfile: null
};

function userProfileTask(state: State = initialState, action = {}): State {
  switch (action.type) {
    case USERPROFILE_LOADED: {
      let {parseId, object} = action.payload;
      return {
        ready: true,
        userProfile: fromParseUser(object)
      };
    }
    case  USERPROFILE_RESET: {
      return initialState;
    }
  }

  return state;
}

export default userProfileTask;
