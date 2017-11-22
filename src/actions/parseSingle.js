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

import AppConstants from '../lib/appConstants';
import Users from '../lib/users';
import Posts from '../lib/posts';
import AppMaintainTasks from '../lib/appMaintainTasks';

import type {ThunkAction, Action} from './types';

const {
  getQueryByType,
  getUsersParameters,
} = require('../parse/parseUtiles');

const {
  fromParseLoggedUser,
  fromParseUser,
  fromParsePosts,
} = require('../parse/parseModels');


const {
  parseCloudMethodNames
} = require('../parse/objects');


/**
 * The states were interested in
 */
const {
  LIST_VIEW_LOADED_RESTAURANTS,
  DASHBOARD_LOADED_PAGINATION,
  OVERLAY_LOADED_MODEL_PAGE,
  OVERLAY_LOADED_MODEL_RESET,
  STATISTIC_CLOUD_MODEL,
  USERPROFILE_LOADED,
  // parse models
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_SITES,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_FLAGS,
  // statistic
  CLOUD_STATISTIC_FOR_POSTS,
  CLOUD_STATISTIC_FOR_TOPICS,
  CLOUD_STATISTIC_FOR_COMMENTS,
  CLOUD_STATISTIC_FOR_FLAGS,
  CLOUD_STATISTIC_FOR_USERS,
  CLOUD_EMPTY_TRASH_FOR_POSTS,
  CLOUD_EMPTY_TRASH_FOR_COMMENTS,
  CLOUD_EMPTY_TRASH_FOR_TOPICS,
  CLOUD_STATISTIC_FOR_LOGGED_USERS,
} = require('../lib/constants');

function callCloudStatisticMethod(type: string, methodType: string, params: string, parseId: string): ThunkAction {
  const methodName = parseCloudMethodNames[methodType];
  return (dispatch) => {
    return Parse.Cloud.run(methodName, params, {
      success: (model) => {
        const payload = {parseId, model};
        dispatch({type, payload});
      },
      error: (error) => {
        debugger;
      }
    });

  };

}

function findParseObject(type,
                         query,
                         parseId,
                         parseFun): ThunkAction {
  return (dispatch) => {
    return query.first({
      success: (object) => {
        const model = parseFun(object);
        const payload = {parseId, model};
        dispatch({type, payload});
      },
      error: (error) => {
        debugger;
      }
    });
  };
}


async function _getUserProfile(userSlug,
                               query,
                               parseFun,
                               type): Promise<Array<Action>> {

  let model = null;
  const politiclCrawler = Users.config.politiclCrawler;
  if (userSlug === politiclCrawler.slug) { // Default User.
    model = politiclCrawler;
  } else {
    const results = await query.find();
    const parsedResults = (results || []).map(parseFun);
    model = parsedResults.length > 0 ? parsedResults[0] : {id: -1, username: 'not found'};
  }

  if (model.id !== -1) {
    const methodName = parseCloudMethodNames[CLOUD_STATISTIC_FOR_LOGGED_USERS];
    const extendProps = await Parse.Cloud.run(methodName, {userId: model.id});
    model = Object.assign(model, extendProps);
  }

  const payload = {
    parseId: userSlug,
    model
  };
  const action = {type, payload};

  return Promise.all([
    Promise.resolve(action)
  ]);
}

async function _loadJoinsForSinglePosts(parseId, parseModel) {
  const {objectSchemaName} = parseModel;

  let extendProps = {};

  switch (objectSchemaName) {
    case PARSE_POSTS:
      const userId = parseModel.userId;
      const politiclCrawler = Users.config.politiclCrawler;
      if (userId === politiclCrawler.id) {
        extendProps = {user: politiclCrawler};
      } else {
        const onlineParseInstance = await getQueryByType(PARSE_USERS).get(userId);
        if (!!onlineParseInstance) {
          extendProps = {user: fromParseLoggedUser(onlineParseInstance)};
        }
      }
      break;
  }

  return extendProps;
}


async function _loadParseObject(query,
                                parseId,
                                parseFun,
                                afterFetchHook,
                                type): Promise<Array<Action>> {
  let onlineParseInstance = null;
  let parseModel = null;
  try {
    onlineParseInstance = await query.get(parseId);
  } catch (e) {
  }

  if (!!onlineParseInstance) {
    parseModel = parseFun(onlineParseInstance);
  } else {
    parseModel = Posts.config.emptyArticle;
  }

  let extendProps = {};
  if (!!afterFetchHook) {
    extendProps = await afterFetchHook(parseId, parseModel);
  }

  const payload = {parseId, model: {...parseModel, ...extendProps}};
  const action = {type, payload};

  return Promise.all([
    Promise.resolve(action)
  ]);
}

function loadParseObject(query,
                         parseId,
                         parseFun,
                         afterFetchHook,
                         type = OVERLAY_LOADED_MODEL_PAGE): ThunkAction {
  return (dispatch) => {
    const action = _loadParseObject(query, parseId, parseFun, afterFetchHook, type);
    action.then(
      ([result]) => {
        dispatch(result);
      }
    );
    return action;
  };
}


export default {
  /**
   * 'statisticUserState'
   * 'statisticReviews'
   * @param methodType
   * @param params
   * @param parseId
   * @param type
   * @returns {ThunkAction}
   */
  invokeParseCloudMethod: (methodType, params, parseId, type = STATISTIC_CLOUD_MODEL): ThunkAction => {
    return callCloudStatisticMethod(type, methodType, params, parseId);
  },

  loadArticlePage: (parseId: string): ThunkAction => {
    return loadParseObject(
      getQueryByType(PARSE_POSTS),
      parseId,
      fromParsePosts,
      _loadJoinsForSinglePosts
    );
  },

  loadSingleUserByUserId: (parseId): ThunkAction => {
    return loadParseObject(
      getQueryByType(PARSE_USERS),
      parseId,
      fromParseLoggedUser);
  },


  loadUserProfilePage: (userSlug): ThunkAction => {
    return (dispatch) => {
      const action = _getUserProfile(
        userSlug,
        getUsersParameters({userSlug}),
        fromParseLoggedUser,
        OVERLAY_LOADED_MODEL_PAGE
      );
      action.then(
        ([result]) => {
          dispatch(result);
        }
      );
      return action;
    };
  },


  resetLoadPage: Action => {
    return {
      type: OVERLAY_LOADED_MODEL_RESET,
    };
  },


};
