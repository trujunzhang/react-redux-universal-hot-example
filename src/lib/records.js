/**
 * The states were interested in
 */
import Users from './users';

const slugify = require('slugify');
const _ = require('underscore');

const {
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_FLAGS,
  // Edit form
  MODEL_FORM_TYPE_NEW,
  MODEL_FORM_TYPE_EDIT,

  // Voting action type
  VOTING_FOR_UPVOTE,
  VOTING_FOR_DOWNVOTE,
} = require('./constants');

const {
  getInstanceWithoutData,
  appendGeoLocation,
  createParseInstance,
} = require('../parse/objects');

import Posts from './posts';
import Comments from './comments';
import Settings from './settings';
import AppConstants from './appConstants';
import Topics from './topics';
import AppMaintainTasks from './appMaintainTasks';
import Flags from './flags';


const {
  getFirstOnlineParseInstance
} = require('../parse/parseUtiles');

const Records = {};

Records.toFirstUpperString = function (name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

Records.setParseObjectFieldWithoutData = function (parseType, instance, parseInstanceId) {
  const {objectSchemaName} = AppConstants.realmObjects[parseType];
  const instanceWithoutData = getInstanceWithoutData(objectSchemaName, parseInstanceId);
  instance.set(parseType, instanceWithoutData);
};

Records.setParseObjectFieldWithoutDataBySchema = function (objectSchemaName, instance, parseInstanceId) {
  const instanceWithoutData = getInstanceWithoutData(objectSchemaName, parseInstanceId);
  const parseType = AppConstants.realmTypes[objectSchemaName];
  instance.set(parseType, instanceWithoutData);
};

Records.setVotingUsers = function (objectSchemaName, onlineParseObject, userInstanceWithoutData, tableSelectAction, hasVoting) {
  switch (objectSchemaName) {
    case PARSE_POSTS:
      Posts.setVotingUsers(onlineParseObject, userInstanceWithoutData, tableSelectAction, hasVoting);
      break;
    case PARSE_COMMENTS:
      break;
  }
};

Records.setParseOnlineObjectStatus = function (objectSchemaName, onlineParseObject, tableSelectAction) {

  switch (objectSchemaName) {
    case PARSE_POSTS:
      Posts.setParseOnlineObjectStatus(onlineParseObject, tableSelectAction);
      break;
    case PARSE_COMMENTS:
      Comments.setParseOnlineObjectStatus(onlineParseObject, tableSelectAction);
      break;
    case PARSE_USERS:
      Users.setParseOnlineObjectStatus(onlineParseObject, tableSelectAction);
      break;
    case PARSE_TOPICS:
      Topics.setParseOnlineObjectStatus(onlineParseObject, tableSelectAction);
      break;
    case PARSE_FLAGS:
      Flags.setParseOnlineObjectStatus(onlineParseObject, tableSelectAction);
      break;
  }
};

Records.createNewTopic = async function (object) {
  // '_id' : 'e01479a43f25cfc314346805385d0c17',
  //   'status' : NumberInt(1),
  //   'name' : 'Ranjit Singh',
  //   'is_ignore' : false,
  //   'statistic' : {
  //   'postCount' : NumberInt(1)
  // },
  // 'slug' : 'ranjit-singh'

  const onlineParseObject = createParseInstance(PARSE_TOPICS);

  onlineParseObject.set('status', Topics.config.STATUS_APPROVED);
  onlineParseObject.set('name', object.name);
  onlineParseObject.set('slug', slugify(object.name, '_'));
  onlineParseObject.set('is_ignore', false);
  onlineParseObject.set('active', false);
  onlineParseObject.set('statistic', {postCount: 1});

  /**
   * Must return the new topic parse online instance with it's objectId.
   */
  return await onlineParseObject.save();
};

Records.getOnlineObjectDict = function (array) {
  let dict = {};
  array.map(function (item) {
    dict[item.id] = item;
  });
  return dict;
};

Records.createOnlineParseInstance = async function (editModelType, onlineParseObject, objectSchemaName, localRecorder) {

  switch (objectSchemaName) {
    case PARSE_POSTS:

      // Basic Fields
      // Attributes
      onlineParseObject.set('url', localRecorder.url);
      onlineParseObject.set('thumbnailUrl', localRecorder.thumbnailUrl);
      onlineParseObject.set('cloudinaryId', localRecorder.cloudinaryId);
      onlineParseObject.set('cloudinaryUrls', localRecorder.cloudinaryUrls);
      onlineParseObject.set('localUploadPath', localRecorder.localUploadPath);
      onlineParseObject.set('title', localRecorder.title);
      onlineParseObject.set('slug', slugify(localRecorder.title, '_'));
      onlineParseObject.set('body', localRecorder.body);
      onlineParseObject.set('status', localRecorder.status);
      onlineParseObject.set('sourceFrom', localRecorder.sourceFrom);

      switch (editModelType) {
        case MODEL_FORM_TYPE_NEW:
          const author = localRecorder.currentUser;
          onlineParseObject.set('postedAt', new Date());
          onlineParseObject.set('userId', author.id);
          onlineParseObject.set('author', author.username);

          break;
      }

      const _postTopics = localRecorder.postTopics || [];

      const _savedTopics = [];
      for (let i = 0; i < _postTopics.length; i++) {
        if (Topics.checkNewTopic(_postTopics[i])) {
          const newTopic = await Records.createNewTopic(_postTopics[i]);
          _savedTopics.push(newTopic.id);
        } else {
          _savedTopics.push(_postTopics[i].id);
        }
      }

      onlineParseObject.set('topics', _savedTopics);

      break;
    case PARSE_TOPICS:
      // Basic Fields
      // Attributes
      onlineParseObject.set('name', localRecorder.topicTitle);
      onlineParseObject.set('slug', localRecorder.topicSlug);

      break;

    case PARSE_COMMENTS:
      // Basic Fields
      // Attributes
      onlineParseObject.set('body', localRecorder.commentBody);
      onlineParseObject.set('htmlBody', Comments.getHtmlBody(localRecorder.commentBody));

      break;

    case PARSE_FLAGS:
      // Basic Fields
      // Attributes
      onlineParseObject.set('reason', localRecorder.flagReason);

      break;

    case PARSE_USERS:
      onlineParseObject.set('displayName', localRecorder.displayName);
      onlineParseObject.set('bio', localRecorder.bio);
      // Notification
      onlineParseObject.set('notifications_posts', localRecorder.notifications_posts);
      onlineParseObject.set('notifications_comments', localRecorder.notifications_comments);
      onlineParseObject.set('notifications_replies', localRecorder.notifications_replies);

      break;
    case PARSE_SETTINGS:
      // Basic Fields
      // Attributes
      const settingsObjects = Settings.config.editTableDefaultObjects;

      settingsObjects.map(function (object) {
        onlineParseObject.set(object.columnValue, localRecorder[object.columnValue]);
      });


      break;
  }

};

export default Records;
