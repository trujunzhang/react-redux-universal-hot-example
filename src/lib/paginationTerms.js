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
} = require('./constants');

import moment from 'moment';
import Topics from './topics';
import Posts from './posts';
import {getCurrentPageIndex} from './link';

const queryString = require('query-string');

const PaginationTerms = {};


PaginationTerms.getCurrentQueryStatus = function ({location}) {
  if (!!location.query && location.query.status) {
    return location.query.status;
  }
  return 'all';
};

PaginationTerms.getCurrentQueryPageIndex = function ({location}) {
  const query = queryString.parse(location.search);
  if (!!query && query.paged) {
    let paged = query.paged;
    if (typeof (paged) === 'string') {
      return parseInt(paged);
    }
    return paged;
  }
  return 1;
};

PaginationTerms.generateTermsForUsersList = function (props, pageIndex = 1) {
  const {location} = props;

  return {
    ...location.query,
    listId: `users-list-for-${location.query.status || 'all'}-${location.query.date || 'all'}-${location.query.from || ''}-${location.query.author || ''}`,
    allItems: false,
    limit: props.editModel.form.fields.countPerPage,
    pageIndex,
    objectSchemaName: PARSE_USERS,
  };
};

PaginationTerms.generateTermsForCommentsList = function (props, pageIndex = 1) {
  const {location} = props;

  return {
    ...location.query,
    listId: `comments-list-for-${location.query.status || 'all'}-${location.query.date || 'all'}-${location.query.from || ''}-${location.query.author || ''}`,
    allItems: false,
    limit: props.editModel.form.fields.countPerPage,
    pageIndex,
    objectSchemaName: PARSE_COMMENTS,
  };
};

PaginationTerms.generateTermsForFlagsList = function (props, pageIndex = 1) {
  const {location} = props;

  return {
    ...location.query,
    listId: `flags-list-for-${location.query.status || 'all'}-${location.query.type || 'all'}`,
    allItems: false,
    limit: props.editModel.form.fields.countPerPage,
    pageIndex,
    objectSchemaName: PARSE_FLAGS,
  };
};

PaginationTerms.generateTermsForSettingsList = function (props) {
  const {location} = props;

  return {
    listId: `settings-list-for-${location.query.status || 'all'}-${location.query.date || 'all'}-${location.query.from || ''}-${location.query.author || ''}`,
    allItems: true,
    limit: -1,
    objectSchemaName: PARSE_SETTINGS,
  };
};

PaginationTerms.generateTermsForTopicsTrendingList = function (props) {

  return {
    active: true,
    topicStatus: [Topics.config.STATUS_APPROVED],
    listId: `topics-trending-list-sidebar`,
    allItems: false,
    limit: 10,
    pageIndex: 1,
    objectSchemaName: PARSE_TOPICS,
  };
};


PaginationTerms.generateTermsForTopicsList = function (props, pageIndex = 1) {
  const {location} = props;

  return {
    ...location.query,
    listId: `topics-list-for-${location.query.status || 'all'}-${location.query.date || 'all'}-${location.query.from || ''}-${location.query.author || ''}`,
    allItems: false,
    limit: props.editModel.form.fields.countPerPage,
    pageIndex,
    objectSchemaName: PARSE_TOPICS,
  };
};

PaginationTerms.generateTermsForPopularThisWeekPostsList = function (props, pageIndex = 1) {
  // const last_days = 4;
  const last_days = 20;
  const today = moment().subtract(0, 'days').startOf('day').toDate();
  const week = moment().subtract(last_days, 'days').startOf('day').toDate();

  return {
    after: moment(week).format('YYYY-MM-DD'),
    before: moment(today).format('YYYY-MM-DD'),
    postStatus: [Posts.config.STATUS_APPROVED],
    listId: `popular-this-week-posts-list`,
    allItems: false,
    // limit: 1,
    limit: pageIndex === 1 ? 5 : 10,
    // limit: 10,
    pageIndex,
    objectSchemaName: PARSE_POSTS,
  };
};


PaginationTerms.generateTermsForCommonPostsList = function (props, pageIndex = 1) {
  const {location} = props;

  const _query = queryString.parse(location.search);

  let postsPerPage = 10;
  // let postsPerPage = 2;

  return {
    ..._query,
    postStatus: [Posts.config.STATUS_APPROVED],
    listId: `posts-list-for-${_query.status || 'all'}-${_query.date || 'all'}-${_query.from || ''}-${_query.author || ''}`,
    allItems: false,
    limit: postsPerPage,
    pageIndex,
    objectSchemaName: PARSE_POSTS,
  };
};

PaginationTerms.generateTermsForEachDayPostsList = function (props, title, pageIndex = 1) {
  const {date} = props;

  let postsPerPage = (title.indexOf('Today') !== -1) ? 20 : 10;

  const dateString = moment(date).format('YYYY-MM-DD');
  return {
    after: dateString,
    before: dateString,
    postStatus: [Posts.config.STATUS_APPROVED],
    listId: `each-day-posts-list-${dateString}`,
    allItems: false,
    limit: postsPerPage,
    pageIndex,
    objectSchemaName: PARSE_POSTS,
  };
};

PaginationTerms.generateTermsForPostsList = function (props) {
  const {location} = props;
  const query = queryString.parse(location.search);

  return {
    ...query,
    listId: `posts-single-for-${query.status || 'all'}`,
    objectSchemaName: PARSE_POSTS,
  };
};

PaginationTerms.generateTermsForPostsSingle = function (props) {
  const {location} = props;
  const query = queryString.parse(location.search);

  return {
    ...query,
    listId: `posts-single-for-${query.postId}`,
    objectSchemaName: PARSE_POSTS,
  };
};

PaginationTerms.generateTermsForRelatedPostsList = function (props) {
  const {post} = props;

  return {
    selfPostId: post.id,
    author: post.author,
    listId: `related-posts-list-for-${post.id}`,
    postStatus: [Posts.config.STATUS_APPROVED],
    limit: Posts.config.PAGE_RELATED_POSTS_COUNT,
    allItems: false,
    objectSchemaName: PARSE_POSTS,
  };
};


PaginationTerms.generateTermsForUserPostsList = function (props, pageIndex = 1) {
  const {userProfile, selectedMenu} = props;

  return {
    userProfileId: userProfile.id,
    currentLeftSideMenuTag: selectedMenu.tag,
    listId: `user-posts-list-for-${userProfile.id}`,
    limit: 4,
    allItems: false,
    pageIndex,
    objectSchemaName: PARSE_POSTS,
  };
};


PaginationTerms.generateTermsForUsersWithoutAnonymousList = function (props) {
  return {
    listId: 'current-users-list-without-anonymous',
    allItems: true,
    limit: -1,
    objectSchemaName: PARSE_USERS,
  };
};


PaginationTerms.generateResultDirect = function (results) {


};

export default PaginationTerms;

