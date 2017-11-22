const Parse = require('parse');

const Parameters = require('../parameters');

const {
  ParsePosts,
  ParseComments,
  ParseTopics,
  ParseUsers,
  ParseFlags,
  ParseSettings,
  createParseInstance,
} = require('./objects');

/**
 * The states were interested in
 */
const {
  PARSE_POSTS,
  PARSE_TOPICS,
  PARSE_FLAGS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_COMMENTS,
} = require('../lib/constants');

function getQueryByType(type: string, includes: Array = []) {
  let query = null;
  switch (type) {
    case PARSE_POSTS:
      query = new Parse.Query(ParsePosts);
      break;
    case PARSE_TOPICS:
      query = new Parse.Query(ParseTopics);
      break;
    case PARSE_USERS:
      query = new Parse.Query(ParseUsers);
      break;
    case PARSE_SETTINGS:
      query = new Parse.Query(ParseSettings);
      break;
    case PARSE_COMMENTS:
      query = new Parse.Query(ParseComments).include('post').include('user').include('parentComment');
      break;
    case PARSE_FLAGS:
      query = new Parse.Query(ParseFlags).include('post').include('user').include('author');
      break;
  }

  includes.map((include) => {
    query = query.include(include);
  });
  return query;
}

function getCommentsParameters(terms) {
  return new Parameters.Comments(getQueryByType(PARSE_COMMENTS))
    .addParameters(terms)
    .end();
}

function getFlagsParameters(terms) {
  return new Parameters.Flags(getQueryByType(PARSE_FLAGS))
    .addParameters(terms)
    .end();
}

function getTopicsParameters(terms) {
  return new Parameters.Topics(
    getQueryByType(PARSE_TOPICS))
    .addParameters(terms)
    .end();
}

function getSettingsParameters(terms) {
  return new Parameters.Settings(
    getQueryByType(PARSE_SETTINGS))
    .addParameters(terms)
    .end();
}

function getUsersParameters(terms) {
  return new Parameters.Users(getQueryByType(PARSE_USERS))
    .addParameters(terms)
    .end();
}

function getPostsParameters(terms) {
  return new Parameters.Posts(getQueryByType(PARSE_POSTS))
    .addParameters(terms)
    .end();
}

async function checkExistOnlineParseInstance(objectSchemaName, realmInstance) {
  return await getQueryByType(objectSchemaName).equalTo('uniqueId', realmInstance.uniqueId).count() > 0;
}

async function getFirstOnlineParseInstance(objectSchemaName, realmInstance) {
  if (!realmInstance || !realmInstance.uniqueId || realmInstance.uniqueId === '') {
    return null;
  }
  return await getQueryByType(objectSchemaName).equalTo('uniqueId', realmInstance.uniqueId).first();
}

// async function getFirstOnlineRecorderInstance(localRecorderUniqueId) {
//   return await getQueryByType(PARSE_SETTINGS).equalTo('recordUniqueId', localRecorderUniqueId).first()
// }

export default {
  getQueryByType,

  getPostsParameters,
  getTopicsParameters,
  getCommentsParameters,
  getFlagsParameters,
  getSettingsParameters,
  getUsersParameters,

  // Update the model's record after saved it.
  checkExistOnlineParseInstance,
  getFirstOnlineParseInstance,
  // getFirstOnlineRecorderInstance
};
