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

const ParsePosts = Parse.Object.extend('posts');
const ParseTopics = Parse.Object.extend('topics');
const ParseUsers = Parse.User;
const ParseSettings = Parse.Object.extend('settings');
const ParseComments = Parse.Object.extend('comments');
const ParseFlags = Parse.Object.extend('flags');


/**
 * The states were interested in
 */
const {
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_FLAGS,
  // cloud methods
  CLOUD_STATISTIC_FOR_POSTS,
  CLOUD_STATISTIC_FOR_TOPICS,
  CLOUD_STATISTIC_FOR_COMMENTS,
  CLOUD_STATISTIC_FOR_FLAGS,
  CLOUD_STATISTIC_FOR_USERS,
  CLOUD_EMPTY_TRASH_FOR_POSTS,
  CLOUD_EMPTY_TRASH_FOR_COMMENTS,
  CLOUD_EMPTY_TRASH_FOR_TOPICS,
  CLOUD_EMPTY_TRASH_FOR_FLAGS,
  CLOUD_POSTS_COUNTS_FOR_TOPICS,
  CLOUD_POSTS_COUNTS_FOR_USERS,
  CLOUD_STATISTIC_FOR_LOGGED_USERS,

  // Email template type
  EMAILS_TEMPLATE_VERIFY_REMOVE_USER,
} = require('../lib/constants');


function createParseInstance(objectSchemaName) {
  switch (objectSchemaName) {
    case PARSE_POSTS:
      return new ParsePosts();
    case PARSE_TOPICS:
      return new ParseTopics();
    case PARSE_COMMENTS:
      return new ParseComments();
    case PARSE_SETTINGS:
      return new ParseSettings();
    case PARSE_FLAGS:
      return new ParseFlags();
    case PARSE_USERS:
      return new ParseUsers();
  }
}

function appendGeoLocation(onlineParseObject, localRecorder, field = 'geoLocation') {
  const _geoLocation = new Parse.GeoPoint({
    latitude: localRecorder.latitude,
    longitude: localRecorder.longitude
  });
  onlineParseObject.set(field, _geoLocation);
}

function getInstanceWithoutData(objectSchemaName, parseInstanceId) {
  let relatedObject = null;
  switch (objectSchemaName) {
    case PARSE_POSTS:
      relatedObject = ParseComments.createWithoutData(parseInstanceId);
      break;
    case PARSE_TOPICS:
      relatedObject = ParseTopics.createWithoutData(parseInstanceId);
      break;
    case PARSE_SETTINGS:
      relatedObject = ParseSettings.createWithoutData(parseInstanceId);
      break;
    case PARSE_USERS:
      relatedObject = ParseUsers.createWithoutData(parseInstanceId);
      break;
    case PARSE_FLAGS:
      relatedObject = ParseFlags.createWithoutData(parseInstanceId);
      break;
    case PARSE_COMMENTS:
      relatedObject = ParseComments.createWithoutData(parseInstanceId);
      break;
    default:
      throw new Error('No matched parseType to create parse without data!');
  }

  return relatedObject;
}

const parseCloudMethodNames = {
  CLOUD_STATISTIC_FOR_POSTS: 'statisticPosts',
  CLOUD_STATISTIC_FOR_TOPICS: 'statisticTopics',
  CLOUD_STATISTIC_FOR_COMMENTS: 'statisticComments',
  CLOUD_STATISTIC_FOR_FLAGS: 'statisticFlags',
  CLOUD_STATISTIC_FOR_USERS: 'statisticUsers',
  CLOUD_RESTAURANT_ADDRESS: 'getAddressFromLocation',
  CLOUD_EMPTY_TRASH_FOR_POSTS: 'emptyPostsTrash',
  CLOUD_EMPTY_TRASH_FOR_COMMENTS: 'emptyCommentsTrash',
  CLOUD_EMPTY_TRASH_FOR_TOPICS: 'emptyTopicsTrash',
  CLOUD_EMPTY_TRASH_FOR_FLAGS: 'emptyFlagsTrash',
  CLOUD_POSTS_COUNTS_FOR_TOPICS: 'countPostsForTopics',
  CLOUD_POSTS_COUNTS_FOR_USERS: 'countPostsForUsers',
  CLOUD_STATISTIC_FOR_LOGGED_USERS: 'countPostsForLoggedUser'
};

const cloudEmailTemplateNames = {
  EMAILS_TEMPLATE_VERIFY_REMOVE_USER: 'verifyRemoveUser',
};

const parseCloudMethodTags = {
  PARSE_POSTS,
  PARSE_USERS: CLOUD_POSTS_COUNTS_FOR_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS: CLOUD_POSTS_COUNTS_FOR_TOPICS,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_FLAGS,
};


export default {
  ParseComments,
  ParseTopics,
  ParsePosts,
  ParseUsers,
  ParseSettings,
  ParseFlags,

  createParseInstance,
  getInstanceWithoutData,
  appendGeoLocation,

  parseCloudMethodNames,
  parseCloudMethodTags,

  cloudEmailTemplateNames,
};
