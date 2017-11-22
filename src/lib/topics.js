const _ = require('underscore');
import moment from 'moment';

const md5 = require('blueimp-md5');
import AppConstants from './appConstants';

const slugify = require('slugify');

/**
 * The states were interested in
 */
const {
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_SITES,
  PARSE_topicS,
  PARSE_HISTORY,
  PARSE_FLAGS,
  // List Type.
  EVENTS_LIST_FOR_RESTAURANT,
  PAGE_PHOTOS_BROWSER_FORM,
  PAGE_MAIN_FORM,

  // Table actions type
  TABLE_ACTIONS_TYPE_NONE,
  TABLE_ACTIONS_TYPE_EDIT,
  TABLE_ACTIONS_TYPE_MOVE_TRASH,
  TABLE_ACTIONS_TYPE_RESTORE,
  TABLE_ACTIONS_TYPE_DELETE,
  TABLE_ACTIONS_TYPE_MAKE_AS_FILTER,
  TABLE_ACTIONS_TYPE_NOT_FILTER,

  TABLE_ACTIONS_TYPE_TOPIC_MAKE_AS_ACTIVE,
  TABLE_ACTIONS_TYPE_TOPIC_NOT_ACTIVE,

} = require('./constants');

const Topics = {
  config: {
    // This constant will be used for creating new topic tag.
    newTopicClassName: 'Select-create-option-placeholder'
  }
};

Topics.config.STATUS_APPROVED = 1;
Topics.config.STATUS_DELETED = 2;
Topics.config.STATUS_FILTER = 3;

Topics.config.PUBLISH_STATUS = [
  Topics.config.STATUS_APPROVED,
  Topics.config.STATUS_FILTER,
];

Topics.config.STATUS_TITLES = [
  '',
  'Publish',
  'Trash', // trash is the same as Deleted.
  'Banned'
];


Topics.config.defaultStatistic = {
  allCount: 0,
  publishCount: 0,
  trashCount: 0,
  filterCount: 0,
};

Topics.getTopicStatisticRows = function (topicsStatistic) {
  const {
    allCount,
    publishCount,
    trashCount,
    filterCount,
  } = topicsStatistic || Topics.config.defaultStatistic;

  const rows = [
    {title: 'All', status: 'all', count: allCount},
    {title: 'Published', status: 'publish', count: publishCount},
    {title: 'Banned', status: 'filter', count: filterCount},
    {title: 'Trash', status: 'trash', count: trashCount},
  ];

  return rows;
};


Topics.hasQueryChanged = function (editModel, lastPageQuery, currentLocation) {
  const currentQuery = currentLocation.query || {};

  if ((lastPageQuery.s || '') !== (currentQuery.s || '')) {
    return true;
  }
  if ((editModel.form.fields.countPerPage) !== (lastPageQuery.limit)) {
    return true;
  }
  if ((lastPageQuery.from || '') !== (currentQuery.from || '')) {
    return true;
  }
  if ((lastPageQuery.author || '') !== (currentQuery.author || '')) {
    return true;
  }
  if ((lastPageQuery.status || '') !== (currentQuery.status || '')) {
    return true;
  }
  if ((lastPageQuery.date || '') !== (currentQuery.date || '')) {
    return true;
  }
  if ((lastPageQuery.order || '') !== (currentQuery.order || '')) {
    return true;
  }
  if ((lastPageQuery.orderby || '') !== (currentQuery.orderby || '')) {
    return true;
  }

  return false;
};

Topics.generateTopicDict = function (topics) {
  let dict = {};
  topics.map(function (topic) {
    dict[topic.id] = topic.name;
  });

  return dict;
};
Topics.getTopicStatus = function (topic, state) {
  let statusArray = [];
  if (topic.active) {
    statusArray.push('widget');
  }
  let topicStatus = Topics.config.STATUS_TITLES[topic.status];
  if (state.toLowerCase() !== topicStatus.toLowerCase()) {
    if (topic.status !== Topics.config.STATUS_APPROVED) {
      statusArray.push(topicStatus);
    }
  }

  return statusArray;
};

Topics.getTopicsForPost = function (props) {
  const post = props.post || {topics: []};
  const listTask = props.listTask || {topicsDict: {}};
  const {topicsDict} = listTask;
  const topicIds = post.topics;

  const topics = [];

  topicIds.map(function (id) {
    if (Object.keys(topicsDict).indexOf(id) !== -1) {
      topics.push({id, name: topicsDict[id]});
    }
  });

  return topics;
};

Topics.checkNewTopic = function (object) {
  const _className = object.className || '';

  return String(_className).valueOf() === String(Topics.config.newTopicClassName).valueOf();
};

Topics.adjustChangedArray = function (changedTopics) {

  return changedTopics.map(function (item) {
    if (Object.keys(item).indexOf('className') !== -1) {
      return Object.assign(item, {
        id: Topics.generateTopicId(item.name)
      });
    }

    return {id: item.id, name: item.name};
  });
};

Topics.generateTopicId = function (name) {
  const newId = md5(name.toLowerCase());
  return newId;
};


Topics.setParseOnlineObjectStatus = function (onlineParseObject, tableSelectAction) {
  let lastStatus = -1;
  let currentStatus = -1;
  switch (tableSelectAction) {
    case TABLE_ACTIONS_TYPE_MOVE_TRASH:
      currentStatus = onlineParseObject.get('status');
      if (currentStatus !== Topics.config.STATUS_DELETED) {
        onlineParseObject.set('lastStatus', currentStatus);
      }
      onlineParseObject.set('status', Topics.config.STATUS_DELETED);
      break;
    case TABLE_ACTIONS_TYPE_RESTORE:
      lastStatus = onlineParseObject.get('lastStatus');
      if (!lastStatus) {
        lastStatus = Topics.config.STATUS_FILTER;
      }
      onlineParseObject.set('status', lastStatus);
      break;
    case  TABLE_ACTIONS_TYPE_MAKE_AS_FILTER:
      currentStatus = onlineParseObject.get('status');
      if (currentStatus !== Topics.config.STATUS_DELETED) {
        onlineParseObject.set('lastStatus', currentStatus);
      }
      onlineParseObject.set('status', Topics.config.STATUS_FILTER);
      onlineParseObject.set('active', false);
      break;
    case  TABLE_ACTIONS_TYPE_NOT_FILTER:// set it as approved.
      onlineParseObject.set('status', Topics.config.STATUS_APPROVED);
      break;
    case TABLE_ACTIONS_TYPE_TOPIC_MAKE_AS_ACTIVE:
      onlineParseObject.set('active', true);
      break;
    case TABLE_ACTIONS_TYPE_TOPIC_NOT_ACTIVE:
      onlineParseObject.set('active', false);
      break;
  }
};

Topics.isActived = function (topic, queryStatus) {
  if (queryStatus === 'filter' || queryStatus === 'trash') {
    return true;
  }

  return topic.active;
};

Topics.canActived = function (topic) {
  return topic.status === Topics.config.STATUS_APPROVED;
};

/**
 * ​​When a person clicks tag “Demonitisation” Link: http://scruby.site/?title=Demonetisation&topicId=a387097638dc4b5946f357176a0f33a7
 *
 * @param topic
 * @returns {string}
 */
Topics.searchWholeTopic = function (topic) {
  return `${AppConstants.config.politiclWeb.serverURL}/?query=${topic.slug}&topicId=${topic.id}`;
};
/**
 * ​​It should open search query “Demonitisation” Link: http://scruby.site/?query=Demonitisation
 *
 * @param topic
 * @returns {string}
 */
Topics.searchTopic = function (topic) {
  return `${AppConstants.config.politiclWeb.serverURL}/?query=${topic.slug}`;
};

Topics.getPostsCount = function (topic, listTask) {
  const {tableRelationCounts} = listTask;
  return tableRelationCounts[topic.id] || 0;
};

Topics.getTopicsTitle = function (name) {
  let splitStr = name.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  // Directly return the joined string
  return splitStr.join(' ');
};


/**
 * All topic's id is generated by name.toLowerCase()
 * @param topics
 * @param topicsArray
 * @param options
 * @returns {*}
 */
Topics.updateTopicsState = function (topics, topicsArray, options) {
  // remove a topic
  if (topics.length > options.length) {
    return Topics.generateTopicsState(topics, topicsArray, options);
  }
  // add new topic
  _.forEach(options, function (item) {
    if (!!item.label) {
      let items = Topics.generateNewTopic(topics, item);
      if (!!items) {
        topicsArray.push(items);
      }
    }
  });

  topics = _.pluck(topicsArray, '_id');

  return {topics: topics, topicsArray: topicsArray};
};

Topics.generateTopicsState = function (topics, topicsArray, options) {
  let newTopicsArray = [];
  _.forEach(options, function (item) {
    let items = Topics.generateNewTopic([], item);
    if (!!items) {
      newTopicsArray.push(items);
    }
  });

  let newTopics = _.pluck(newTopicsArray, '_id');

  return {topics: newTopics, topicsArray: newTopicsArray};
};

Topics.generateNewTopic = function (topics, item) {
  // TODO: djzhang(Topics): All topic's id is generated by name.toLowerCase()
  const name = item.label;
  const newId = md5(name.toLowerCase());
  // If exists,ignore it.
  if (topics.indexOf(newId) !== -1) {
    return null;
  }
  let newTopic = {
    _id: newId,
    slug: slugify(name, '_'),
    name: name,
    status: Topics.generateTopicStatus(name)
  };

  return newTopic;
};

Topics.generateTopicStatus = function (name) {
  let topicStatus = Topics.config.STATUS_APPROVED;
  // let isBannedTopic = Telescope.settings.checkTopicStatus(name, 'blacklist');
  // if (isBannedTopic) {
  //   topicStatus = Topics.config.STATUS_DELETED;
  // } else {
  //   isBannedTopic = Telescope.settings.checkTopicStatus(name, 'filterlist');
  //   if (isBannedTopic) {
  //     topicStatus = Topics.config.STATUS_FILTER;
  //   }
  // }

  return topicStatus;
};

export default Topics;
