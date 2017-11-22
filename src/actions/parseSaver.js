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
  WRITE_VOTING_USERS_DONE,
} = require('../lib/constants');


async function _writeOnlineParseObject(editModelType,
                                       objectSchemaName,
                                       model: object): Promise<Array<Action>> {

  let onlineParseObject = null;
  switch (editModelType) {
    case MODEL_FORM_TYPE_NEW:
      onlineParseObject = createParseInstance(objectSchemaName);
      break;
    case MODEL_FORM_TYPE_EDIT:
      onlineParseObject = await getQueryByType(objectSchemaName).get(model.parseId);
      break;
  }

  // First of all, set fields.
  await  Records.createOnlineParseInstance(editModelType, onlineParseObject, objectSchemaName, model);

  // step1: save the online object.
  await onlineParseObject.save();

  const action = {
    type: WRITE_MODEL_DONE,
  };
  return Promise.all([
    Promise.resolve(action)
  ]);
}

async function _setVotingUsers(objectSchemaName,
                               listId,
                               userId,
                               parseId,
                               tableSelectAction,
                               hasVoting): Promise<Array<Action>> {


  const userInstanceWithoutData = getInstanceWithoutData(PARSE_USERS, userId);
  const onlineParseObject = await getQueryByType(objectSchemaName).get(parseId);

  // step1: change the parse online object status
  Records.setVotingUsers(objectSchemaName, onlineParseObject, userInstanceWithoutData, tableSelectAction, hasVoting);

  // step2: save the online object.
  await onlineParseObject.save();

  const payload = {
    objectSchemaName,
    listId,
    votingModel: parseOnlineParseObject(objectSchemaName, onlineParseObject)
  };

  const action = {
    type: WRITE_VOTING_USERS_DONE,
    payload
  };
  return Promise.all([
    Promise.resolve(action)
  ]);
}


async function _uploadPhoto(model: object): Promise<Array<Action>> {
  const thumbnailFile = new Parse.File('image', model.file);
  await thumbnailFile.save();
  const photo = createParseInstance(PARSE_COMMENTS);

  // step1: generate photo.
  await  Records.createOnlineParseInstance(
    photo,
    PARSE_COMMENTS,
    Object.assign({}, model, {
      thumbnail: thumbnailFile,
      original: thumbnailFile,
    })
  );

  // step2: save photo.
  await photo.save();

  const action = {
    type: SAVE_MODEL_REQUEST,
  };
  return Promise.all([
    Promise.resolve(action)
  ]);
}


async function _uploadLoggedUser(model: object): Promise<Array<Action>> {
  // step1: get logged user.
  const current = await getQueryByType(PARSE_USERS).get(model.parseId);

  current.set('username', model.username);
  current.set('email', model.email);

  // step2: update user.
  await current.save();

  const action = {
    type: SAVE_MODEL_REQUEST,
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


async function _ownAnotherPhotoUser(photoId: string, selectedUserId: string): Promise<Array<Action>> {
  // step1: get online photo instance.
  const onlinePhoto = await getQueryByType(PARSE_COMMENTS).get(photoId);

  const ownerUser = getInstanceWithoutData(PARSE_USERS, selectedUserId);
  onlinePhoto.set('owner', ownerUser);

  // step2: update user.
  await onlinePhoto.save();

  const action = {
    type: SAVE_MODEL_REQUEST,
  };
  return Promise.all([
    Promise.resolve(action)
  ]);
}


export default {
  writeOnlineParseObject({
                           editModelType,
                           objectSchemaName,
                           model
                         }): ThunkAction {
    return invokeEventFromAction(_writeOnlineParseObject(editModelType, objectSchemaName, model));
  },

  setVotingUsers({
                   objectSchemaName,
                   listId,
                   userId,
                   parseId,
                   tableSelectAction,
                   hasVoting
                 }): ThunkAction {
    return invokeEventFromAction(
      _setVotingUsers(
        objectSchemaName,
        listId,
        userId,
        parseId,
        tableSelectAction,
        hasVoting
      ));
  },

  // write Online parse Objects.
  // Photos

  uploadPhoto(model: object): ThunkAction {
    return invokeEventFromAction(_uploadPhoto(model));
  },

  uploadLoggedUser(model: object): ThunkAction {
    return invokeEventFromAction(_uploadLoggedUser(model));
  },

  // Photos owner
  ownAnotherPhotoUser(photoId: string, selectedUserId: string): ThunkAction {
    return invokeEventFromAction(_ownAnotherPhotoUser(photoId, selectedUserId));
  },

};
