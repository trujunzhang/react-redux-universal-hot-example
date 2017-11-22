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

const {Map, fromJS} = require('immutable');
import Users from '../../lib/users';


/**
 * The states were interested in
 */
const {
  LOGGED_IN,
  LOGGED_OUT,
  BANNER_HIDEN_TOP_HERO_PANEL,
  BANNER_HIDDEN_TOP_NEWSLETTER_PANEL,
} = require('../../lib/constants');


type UserState = {
  isLoggedIn: boolean,
  // User Instance
  id: ? string,
  username: ? string,
  displayName: ? string,
  loginType: ? number,
  isAdmin: ? boolean,
  email: ? string,
  facebook_id: ? string,
  updatedAt: ? Date,
  slug: ? string;
  showTopHero: ? boolean,
  showNewsLetter: ? boolean,
}

const initialState = {
  isLoggedIn: false,
  // User Instance
  id: '',
  username: '',
  displayName: '',
  loginType: Users.config.TYPE_EMAIL,
  isAdmin: false,
  email: '',
  facebook_id: '',
  updatedAt: null,
  slug: '',
  showTopHero: true,
  showNewsLetter: true,
};

function user(state: UserState = initialState, action = {}): UserState {
  switch (action.type) {
    case LOGGED_IN: {
      let {
        id, username, displayName,
        loginType, email, facebook_id,
        updatedAt, slug, isAdmin, emailVerified
      } = action.payload;

      if (emailVerified === true) {
        const map = fromJS(state);
        const nextMap = map
          .set('isLoggedIn', true)
          .set('id', id)
          .set('username', username)
          .set('slug', slug)
          .set('displayName', displayName)
          .set('loginType', loginType)
          .set('isAdmin', isAdmin)
          .set('email', email)
          .set('facebook_id', facebook_id)
          .set('updatedAt', updatedAt);

        return nextMap.toJS();
      }
      break;
    }

    case LOGGED_OUT: {
      return initialState;
    }

    case BANNER_HIDEN_TOP_HERO_PANEL: {
      const map = fromJS(state);
      const nextMap = map.set('showTopHero', false);
      return nextMap.toJS();
    }

    case BANNER_HIDDEN_TOP_NEWSLETTER_PANEL: {
      const map = fromJS(state);
      const nextMap = map.set('showNewsLetter', false);
      return nextMap.toJS();
    }

  }

  return state;
}

export default user;
