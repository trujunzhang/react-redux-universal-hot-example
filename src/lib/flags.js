const _ = require('underscore');
const md5 = require('blueimp-md5');
import moment from 'moment';

/**
 * The states were interested in
 */
const {
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_SITES,
  PARSE_COMMENTS,
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
  TABLE_ACTIONS_TYPE_APPROVE,
  TABLE_ACTIONS_TYPE_UNAPPROVE,
  TABLE_ACTIONS_TYPE_MAKE_AS_SPAM,
  TABLE_ACTIONS_TYPE_NOT_SPAM,

} = require('./constants');

const Flags = {
  config: {}
};
/**
 * @summary Flags config namespace
 * @type {Object}
 */
Flags.config = {};

Flags.config.STATUS_SUBMITTED = 1;
Flags.config.STATUS_APPROVED = 2;
Flags.config.STATUS_DELETED = 3;

Flags.config.TYPE_POST = 1;
Flags.config.TYPE_COMMENT = 2;


Flags.config.PUBLISH_STATUS = [
  Flags.config.STATUS_SUBMITTED,
  Flags.config.STATUS_APPROVED,
];

Flags.config.defaultStatistic = {
  allCount: 0,
  publishCount: 0,
  trashCount: 0,
  postsCount: 0,
  commentsCount: 0,
};


Flags.getFlagStatisticRows = function (flagsStatistic) {
  const {
    allCount,
    publishCount,
    trashCount,
    postsCount,
    commentsCount,
  } = flagsStatistic || Flags.config.defaultStatistic;
  const rows = [
    {title: 'All', status: 'all', count: allCount + publishCount},
    {title: 'Approved', status: 'publish', count: publishCount},
    {title: 'Trash', status: 'trash', count: trashCount},
  ];

  return rows;
};


Flags.getFlagStatus = function (flag, state) {
  let statusArray = [];
  let flagStatus = '';// Flags.config.STATUS_CHECKING[flag.status];
  if (state.toLowerCase() !== flagStatus.toLowerCase()) {
    if (flag.status !== Flags.config.STATUS_APPROVED) {
      statusArray.push(flagStatus);
    }
  }
  return statusArray;
};

Flags.toDateString = function (date) {
  return moment(date).format(Flags.config.dateFormat);
};

Flags.hasQueryChanged = function (editModel, lastPageQuery, currentLocation) {
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

  return false;
};

Flags.setParseOnlineObjectStatus = function (onlineParseObject, tableSelectAction) {
  let lastStatus = -1;
  let currentStatus = -1;
  switch (tableSelectAction) {
    case TABLE_ACTIONS_TYPE_MOVE_TRASH:
      currentStatus = onlineParseObject.get('status');
      if (currentStatus !== Flags.config.STATUS_DELETED) {
        onlineParseObject.set('lastStatus', currentStatus);
      }
      onlineParseObject.set('status', Flags.config.STATUS_DELETED);
      break;
    case TABLE_ACTIONS_TYPE_RESTORE:
      lastStatus = onlineParseObject.get('lastStatus');
      if (!lastStatus) {
        lastStatus = Flags.config.STATUS_SPAM;
      }
      onlineParseObject.set('status', lastStatus);
      break;
    case  TABLE_ACTIONS_TYPE_APPROVE:
      onlineParseObject.set('status', Flags.config.STATUS_APPROVED);
      break;
    case  TABLE_ACTIONS_TYPE_UNAPPROVE:
      onlineParseObject.set('status', Flags.config.STATUS_SUBMITTED);
      break;
    case  TABLE_ACTIONS_TYPE_MAKE_AS_SPAM:
      currentStatus = onlineParseObject.get('status');
      if (currentStatus !== Flags.config.STATUS_DELETED) {
        onlineParseObject.set('lastStatus', currentStatus);
      }
      onlineParseObject.set('status', Flags.config.STATUS_SPAM);
      break;
    case  TABLE_ACTIONS_TYPE_NOT_SPAM:
      lastStatus = onlineParseObject.get('lastStatus');
      if (!lastStatus) {
        lastStatus = Flags.config.STATUS_SPAM;
      }
      onlineParseObject.set('status', lastStatus);
      break;
  }
};


Flags.isApproved = function (flag, queryStatus) {
  if (queryStatus === 'spam' || queryStatus === 'trash') {
    return true;
  }

  return flag.status === Flags.config.STATUS_APPROVED;
};


export default Flags;
