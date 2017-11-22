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
import type {ThunkAction, Action} from './types';

const _ = require('underscore');

const {
  getPostsParameters,
  getTopicsParameters,
  getCommentsParameters,
  getSettingsParameters,
  getFlagsParameters,
  getUsersParameters,
  getQueryByType,
} = require('../parse/parseUtiles');

const {
  fromParsePosts,
  fromParseTopics,
  fromParseSettings,
  fromParseUser,
  fromParseComments,
  fromParseFlags,
} = require('../parse/parseModels');

const {
  parseCloudMethodNames,
  parseCloudMethodTags,
  cloudEmailTemplateNames,
} = require('../parse/objects');

/**
 * The states were interested in
 */
const {
  // parse models
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_TOPICS,
  LIST_VIEW_LOADED_BY_TYPE,
  LOADED_PHOTOS_BROWSER,
  // cloud methods
  CLOUD_POSTS_COUNTS_FOR_TOPICS,
  CLOUD_POSTS_COUNTS_FOR_USERS,
  EMAIL_SEND_CLOUD_MODEL,
  // Email template type
  EMAILS_TEMPLATE_VERIFY_REMOVE_USER,
} = require('../lib/constants');

import Posts from '../lib/posts';
import Users from '../lib/users';
import Topics from '../lib/topics';
import AppConstants from '../lib/appConstants';

async function getCountForModel(terms, parsedResults) {
  const {objectSchemaName} = terms;
  const modelIds = _.pluck(parsedResults, 'id');
  const cloudReturnData = await  Parse.Cloud.run(
    parseCloudMethodNames[parseCloudMethodTags[objectSchemaName]],
    {modelIds}
  );

  return {tableRelationCounts: cloudReturnData};
}

async function getPostForComment(terms, parsedResults) {
  const postId = terms.postId;
  if (!!postId) {
    const onlineParseObject = await getQueryByType(PARSE_POSTS).get(postId);
    return {forObject: fromParsePosts(onlineParseObject)};
  }
  return {};
}

async function getTopicsFromPostsList(terms, parsedResults) {
  const topicsIds = Posts.getTopicsIdsInPostsArray(parsedResults);

  const topicsQuery = getTopicsParameters({topicsIds});
  const topicsResults = await topicsQuery.find();

  const topicsDict = Topics.generateTopicDict((topicsResults || []).map(fromParseTopics));
  return {topicsDict};
}

async function _loadListByType(listTask,
                               objectsQuery,
                               terms,
                               extendFun,
                               parseFun,
                               type): Promise<Array<Action>> {
  const {
    pageIndex,
    limit,
    objectSchemaName,
    allItems = false,
  } = terms;


  const skipCount = (pageIndex - 1) * limit;

  console.log('current:', pageIndex);

  const totalCount = await objectsQuery.count();
  let results = [];
  if (allItems) {
    results = await objectsQuery.find();
  } else {
    results = await objectsQuery.skip(skipCount).limit(limit).find();
  }


  const parsedResults = (results || []).map(parseFun);
  const _extendTerms = terms;

  let extendProps = {};
  if (!!extendFun) {
    extendProps = await extendFun(_extendTerms, parsedResults);
  }

  const payload = {
    list: _.object(_.map(parsedResults, function (item) {
      return [item.id, item];
    })),
    ...extendProps,
    listId: terms.listId,
    limit: terms.limit,
    totalCount
  };

  const action = {type, payload};

  return Promise.all([
    Promise.resolve(action)
  ]);
}

function loadListByType(listTask,
                        objectsQuery,
                        terms,
                        extendFun,
                        parseFun,
                        type = LIST_VIEW_LOADED_BY_TYPE): ThunkAction {
  return (dispatch) => {
    const action = _loadListByType(listTask, objectsQuery, terms, extendFun, parseFun, type);
    action.then(
      ([result]) => {
        dispatch(result);
      }
    );
    return action;
  };
}

function loadUsersList(listTask, terms): ThunkAction {
  return loadListByType(listTask, getUsersParameters(terms), terms, getCountForModel, fromParseUser);
}

function loadCommentsList(listTask, terms): ThunkAction {
  return loadListByType(listTask, getCommentsParameters(terms), terms, getPostForComment, fromParseComments);
}

function loadFlagsList(listTask, terms): ThunkAction {
  return loadListByType(listTask, getFlagsParameters(terms), terms, null, fromParseFlags);
}

function loadTopicsList(listTask, terms): ThunkAction {
  return loadListByType(
    listTask,
    getTopicsParameters(terms),
    terms,
    null,
    fromParseTopics
  );
}

function loadSettingsList(listTask, terms): ThunkAction {
  return loadListByType(listTask, getSettingsParameters(terms), terms, null, fromParseSettings);
}

function loadPostsList(listTask, terms): ThunkAction {
  return loadListByType(listTask,
    getPostsParameters(terms),
    terms,
    getTopicsFromPostsList,
    fromParsePosts);
}

async function _callCloudInviteEmailMethod(templateType, toEmail, params): ThunkAction {
  const emailDefaultProperty = {
    templateName: cloudEmailTemplateNames [templateType],
    toEmail,
    variables: {
      ...params,
      homepage: AppConstants.config.politiclWeb.serverURL,
    }
  };

  await Parse.Cloud.run('sendEmails', emailDefaultProperty);

  switch (templateType) {
    case EMAILS_TEMPLATE_VERIFY_REMOVE_USER:
      const onlineUser = await getQueryByType(PARSE_USERS).get(params.userId);
      Users.setUserDeletionToken(onlineUser, params);
      await onlineUser.save();
      break;
  }

  const action = {type: EMAIL_SEND_CLOUD_MODEL};

  return Promise.all([
    Promise.resolve(action)
  ]);
}

function callCloudInviteEmailMethod(templateType, toEmail, params): ThunkAction {
  return (dispatch) => {
    const action = _callCloudInviteEmailMethod(templateType, toEmail, params);
    action.then(
      ([result]) => {
        dispatch(result);
      }
    );
    return action;
  };
}


export default {
  loadPostsList,
  loadTopicsList,
  loadCommentsList,
  loadFlagsList,
  loadUsersList,
  loadSettingsList,
  // Send invite email
  callCloudInviteEmailMethod,
};
