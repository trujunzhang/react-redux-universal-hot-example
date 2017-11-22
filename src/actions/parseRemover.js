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




const Parse = require('parse');

const _ = require('underscore');
import type {Action, ThunkAction} from './types';
import Records from '../lib/records';
import Users from '../lib/users';
import {fromParseLoggedUser} from '../parse/parseModels';

import moment from 'moment';

const {
  getInstanceWithoutData,
  createParseInstance,
} = require('../parse/objects');


const {
  getQueryByType,
} = require('../parse/parseUtiles');

const {
  parseOnlineParseObject,
} = require('../parse/parseModels');

/**
 * The states were interested in
 */
const {
  // parse models
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_SITES,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_FLAGS,
  // Rest API
  SAVE_MODEL_REQUEST,
  UPDATE_MODEL_REQUEST,
  // Edit form
  MODEL_FORM_TYPE_NEW,
  MODEL_FORM_TYPE_EDIT,
  WRITE_MODEL_DONE,
  REMOVE_MODEL_DONE,
  WRITE_VOTING_USERS_DONE,
} = require('../lib/constants');


async function _removeOnlineParseObject(objectSchemaName,
                                        model): Promise<Array<Action>> {

  let onlineParseObject = null;
  switch (objectSchemaName) {
    case PARSE_USERS:
      const {parseId, token, userName} = model;
      const onlineUser = await getQueryByType(PARSE_USERS).get(parseId);
      const userModel = fromParseLoggedUser(onlineUser);

      if (token !== userModel.deletion_email_verify_token) {
        throw new Error('InValid deletion token!');
      }

      let verifyDate = moment(new Date());
      let deletedDate = moment(userModel.deletion_email_verify_token_expires_at);

      if (verifyDate.isAfter(deletedDate)) {
        throw new Error('Verify date has been expired!');
      }

      await onlineUser.destroy();

      break;
  }

  const action = {
    type: REMOVE_MODEL_DONE,
  };
  return Promise.all([
    Promise.resolve(action)
  ]);
}


function invokeEventFromAction(action: Promise<Array<Action>>): ThunkAction {
  return (dispatch) => {
    action.then(
      ([result]) => {
        dispatch(result);
      }
    );
    return action;
  };
}


export default {
  removeOnlineParseObject({
                            objectSchemaName,
                            model
                          }): ThunkAction {
    return invokeEventFromAction(_removeOnlineParseObject(objectSchemaName, model));
  },

};
