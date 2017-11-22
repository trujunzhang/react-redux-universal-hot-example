const _ = require('underscore');
const md5 = require('blueimp-md5');
import moment from 'moment';

import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

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

  // Comment table type
  COMMENTS_TABLE_NORMAL,
  COMMENTS_TABLE_FOR_POST,
} = require('./constants');

const Comments = {
  config: {
    dateFormat: 'dddd, DD MMM, h:mm a'
  }
};

/**
 * @summary Comments config namespace
 * @type {Object}
 */
Comments.config = {};

Comments.config.STATUS_PENDING = 1;
Comments.config.STATUS_APPROVED = 2; // it means that the comments are published.
Comments.config.STATUS_REJECTED = 3;
Comments.config.STATUS_SPAM = 4; // it means that the comments are moved to trash, the same as STATUS_DRAFT.
Comments.config.STATUS_DELETED = 5; // it means that the current status is trash.

Comments.config.STATUS_REMOVED = 7; // Articles have been removed from the database, It means that no data to show.

Comments.config.ALL_STATUS = [
  Comments.config.STATUS_PENDING,
  Comments.config.STATUS_APPROVED,
  Comments.config.STATUS_REJECTED,
  Comments.config.STATUS_SPAM,
  Comments.config.STATUS_DELETED
];

Comments.config.ALL_STATUS_FOR_USER_PROFILE = [
  Comments.config.STATUS_PENDING,
  Comments.config.STATUS_APPROVED,
  Comments.config.STATUS_REJECTED,
  Comments.config.STATUS_SPAM,
  Comments.config.STATUS_DELETED,
  Comments.config.STATUS_REMOVED
];

Comments.config.PUBLISH_STATUS = [
  Comments.config.STATUS_PENDING,
  Comments.config.STATUS_APPROVED,
  Comments.config.STATUS_REJECTED
];

Comments.config.STATUS_MESSAGE_TITLES = [
  '',
  'Pending Approval',
  'Approved',
  'Rejected',
  '',
  '',
  ''
];

Comments.config.STATUS_TITLES = [
  '',
  'Approving',
  'Published',
  'Rejected',
  'Draft',
  'Trash', // trash is the same as Deleted.
  'Flagged'
];

Comments.config.defaultStatistic = {
  allCount: 0,
  publishCount: 0,
  pendingCount: 0,
  spamCount: 0,
  trashCount: 0,
};


Comments.getCommentStatisticRows = function (commentsStatistic) {
  const {
    allCount,
    publishCount,
    pendingCount,
    spamCount,
    trashCount
  } = commentsStatistic || Comments.config.defaultStatistic;
  const rows = [
    {title: 'All', status: 'all', count: allCount},
    {title: 'Pending', status: 'pending', count: pendingCount},
    {title: 'Approved', status: 'publish', count: publishCount},
    {title: 'Spam', status: 'spam', count: spamCount},
    {title: 'Trash', status: 'trash', count: trashCount},
  ];

  return rows;
};

Comments.getCommentStatus = function (comment, state) {
  let statusArray = [];
  let commentStatus = '';// Comments.config.STATUS_CHECKING[comment.status];
  if (state.toLowerCase() !== commentStatus.toLowerCase()) {
    if (comment.status !== Comments.config.STATUS_APPROVED) {
      statusArray.push(commentStatus);
    }
  }
  return statusArray;
};

Comments.toDateString = function (date) {
  return moment(date).format(Comments.config.dateFormat);
};

Comments.hasQueryChanged = function (editModel, lastPageQuery, currentLocation) {
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

Comments.sanitize = function (s) {
  // console.log('// before sanitization:')
  // console.log(s)
  const shtml = sanitizeHtml(s, {
    allowedTags: [
      'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul',
      'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike',
      'code', 'hr', 'br', 'div', 'table', 'thead', 'caption',
      'tbody', 'tr', 'th', 'td', 'pre', 'img'
    ]
  });
  return shtml;
};

Comments.getHtmlBody = function (body) {
  const htmlBody = Comments.sanitize(marked(body));
  return htmlBody;
};

Comments.showPostTitle = function ({listTask, commentTableType}) {
  const {forObject, ready} = listTask;
  if (ready) {
    if (commentTableType === COMMENTS_TABLE_FOR_POST) {
      return true;
    }
  }

  return false;
};

Comments.setParseOnlineObjectStatus = function (onlineParseObject, tableSelectAction) {
  let lastStatus = -1;
  let currentStatus = -1;
  switch (tableSelectAction) {
    case TABLE_ACTIONS_TYPE_MOVE_TRASH:
      currentStatus = onlineParseObject.get('status');
      if (currentStatus !== Comments.config.STATUS_DELETED) {
        onlineParseObject.set('lastStatus', currentStatus);
      }
      onlineParseObject.set('status', Comments.config.STATUS_DELETED);
      break;
    case TABLE_ACTIONS_TYPE_RESTORE:
      lastStatus = onlineParseObject.get('lastStatus');
      if (!lastStatus) {
        lastStatus = Comments.config.STATUS_SPAM;
      }
      onlineParseObject.set('status', lastStatus);
      break;
    case  TABLE_ACTIONS_TYPE_APPROVE:
      onlineParseObject.set('status', Comments.config.STATUS_APPROVED);
      break;
    case  TABLE_ACTIONS_TYPE_UNAPPROVE:
      onlineParseObject.set('status', Comments.config.STATUS_PENDING);
      break;
    case  TABLE_ACTIONS_TYPE_MAKE_AS_SPAM:
      currentStatus = onlineParseObject.get('status');
      if (currentStatus !== Comments.config.STATUS_DELETED) {
        onlineParseObject.set('lastStatus', currentStatus);
      }
      onlineParseObject.set('status', Comments.config.STATUS_SPAM);
      break;
    case  TABLE_ACTIONS_TYPE_NOT_SPAM:
      lastStatus = onlineParseObject.get('lastStatus');
      if (!lastStatus) {
        lastStatus = Comments.config.STATUS_SPAM;
      }
      onlineParseObject.set('status', lastStatus);
      break;
  }
};

Comments.haveParent = function (comment) {
  const {parentComment} = comment;


  if (typeof parentComment === 'undefined') {
    return false;
  }

  if (typeof parentComment.id === 'undefined') {
    return false;
  }

  if (parentComment.id === 'undefined') {
    return false;
  }
  return true;
};
Comments.isApproved = function (comment, queryStatus) {
  if (queryStatus === 'spam' || queryStatus === 'trash') {
    return true;
  }

  return comment.status === Comments.config.STATUS_APPROVED;
};

export default Comments;
