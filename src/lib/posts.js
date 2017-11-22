const _ = require('underscore');
import moment from 'moment';

let parseDomain = require('parse-domain');
const queryString = require('query-string');

import AppConstants from './appConstants';

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

  // Post Status
  POST_MODEL_STATUS_UNKNOW,
  POST_MODEL_STATUS_APPROVED,
  POST_MODEL_STATUS_PENDING,
  POST_MODEL_STATUS_SPAM_DRAFT,

  // Table actions type
  TABLE_ACTIONS_TYPE_NONE,
  TABLE_ACTIONS_TYPE_EDIT,
  TABLE_ACTIONS_TYPE_MOVE_TRASH,
  TABLE_ACTIONS_TYPE_AS_PUBLISHED,
  TABLE_ACTIONS_TYPE_RESTORE,
  TABLE_ACTIONS_TYPE_DELETE,
  TABLE_ACTIONS_TYPE_APPROVE,
  TABLE_ACTIONS_TYPE_UNAPPROVE,
  TABLE_ACTIONS_TYPE_MAKE_AS_SPAM,
  TABLE_ACTIONS_TYPE_NOT_SPAM,

  // Voting
  POSTS_VOTING_LIST_UPVOTE,
  POSTS_VOTING_LIST_DOWNVOTE,
  POSTS_VOTING_ARTICLE_UPVOTE,
  POSTS_VOTING_ARTICLE_DOWNVOTE,

  // Voting action type
  VOTING_FOR_UPVOTE,
  VOTING_FOR_DOWNVOTE,


  // Parse empty model type
  PARSE_EMPTY_MODEL_ID,
} = require('./constants');

const Posts = {};

/**
 * @summary Posts config namespace
 * @type {Object}
 */
Posts.config = {
  PAGE_RELATED_POSTS_COUNT: 6,
  paginationCountPerPage: 20,
  // July 29, 2017
  selectedPhotoCreatedAtFormat: 'MMMM DD, YYYY'
};

//A: which status of the post submitted by user?
//B: Pending
//   Someone will check the content and approve it
//   If the content is not good, it will be rejected
//A: you will approve the posts which status is pending?
//B: Yes
//A: which status of the posts is set from the flag on the detail page?
//B: Can you make a new status = Flagged?
//A: ok, i add a new status called Posts.config.STATUS_FLAGGED.
//A: move to trash on the wordpress, move to which status on my web app?
//B: Move to Trash is delete(Posts.config.STATUS_DELETED).
//Note: Approved is when the article is published
//      Pending is when someone submits an article

Posts.config.STATUS_UNKNOW = 0;
Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2; // it means that the posts are published.
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4; // it means that the posts are moved to trash, the same as STATUS_DRAFT.
Posts.config.STATUS_DELETED = 5;

Posts.config.STATUS_REMOVED = 7; // Articles have been removed from the database, It means that no data to show.

Posts.config.STATUS_UI_ALERT = 8; // Special status, just for the posts that no permission to view.

Posts.config.ALL_STATUS = [
  Posts.config.STATUS_PENDING,
  Posts.config.STATUS_APPROVED,
  Posts.config.STATUS_REJECTED,
  Posts.config.STATUS_SPAM,
  Posts.config.STATUS_DELETED
];

Posts.config.ALL_STATUS_FOR_USER_PROFILE = [
  Posts.config.STATUS_PENDING,
  Posts.config.STATUS_APPROVED,
  Posts.config.STATUS_REJECTED,
  Posts.config.STATUS_SPAM,
  Posts.config.STATUS_DELETED,
  Posts.config.STATUS_REMOVED
];

Posts.config.PUBLISH_STATUS = [
  Posts.config.STATUS_PENDING,
  Posts.config.STATUS_APPROVED,
  Posts.config.STATUS_REJECTED,
  Posts.config.STATUS_SPAM
];

Posts.config.emptyArticle = {
  id: PARSE_EMPTY_MODEL_ID,
};

// 18/12/2016
// When the User clicks on this notification, the article opens up in a page.
// The user should also be able to see the status of the submitted article.
// There should be only 3 types of status for the user - Pending Approval, Approved, or Rejected.
// So that when the user opens the article, he knows whether the article has been approved or not.
Posts.config.STATUS_MESSAGE_TITLES = [
  '',
  'Pending Approval',
  'Approved',
  'Rejected',
  '',
  '',
  ''
];

Posts.config.STATUS_EDIT_SINGLE = {
  0: POST_MODEL_STATUS_UNKNOW,
  1: POST_MODEL_STATUS_PENDING,
  2: POST_MODEL_STATUS_APPROVED,
  3: 'reject',
  4: POST_MODEL_STATUS_SPAM_DRAFT,
  5: 'trash', // trash is the same as Deleted.
  6: 'flag'
};

Posts.getEditSingleStatus = function (statusTag) {
  const index = Object.values(Posts.config.STATUS_EDIT_SINGLE).indexOf(statusTag);
  const keyString = Object.keys(Posts.config.STATUS_EDIT_SINGLE)[index];
  return parseInt(keyString);
};

Posts.config.STATUS_CHECKING = [
  '',
  'pending',
  'publish',
  'reject',
  'draft',
  'trash', // trash is the same as Deleted.
  'flag'
];

Posts.config.STATUS_TITLES = [
  '',
  'Approving',
  'Published',
  'Rejected',
  'Draft',
  'Trash', // trash is the same as Deleted.
  'Flagged'
];

Posts.config.ITEM_STATUS_TITLES = [
  '',
  'Pending Approval',
  'Published',
  'Rejected',
  'Draft',
  'Trash', // trash is the same as Deleted.
  'Flagged'
];

Posts.config.defaultStatistic = {
  allCount: 0,
  publishCount: 0,
  pendingCount: 0,
  rejectedCount: 0,
  draftCount: 0,
  trashCount: 0
};

Posts.getPostStatisticRows = function (postsStatistic) {
  const {
    allCount,
    publishCount,
    pendingCount,
    rejectedCount,
    draftCount,
    trashCount
  } = postsStatistic || Posts.config.defaultStatistic;
  const rows = [
    {title: 'All', status: 'all', count: allCount},
    {title: 'Published', status: 'publish', count: (publishCount )},
    {title: 'Pending', status: 'pending', count: (pendingCount )},
    {title: 'Rejected', status: 'reject', count: (rejectedCount )},
    {title: 'Drafts', status: 'draft', count: (draftCount )},
    {title: 'Trash', status: 'trash', count: trashCount},
  ];

  return rows;
};

Posts.getPostStatus = function (post, state) {
  let statusArray = [];
  let _postStatus = Posts.config.STATUS_CHECKING[post.status];
  if (state.toLowerCase() !== _postStatus.toLowerCase()) {
    if (post.status !== Posts.config.STATUS_APPROVED) {
      statusArray.push(_postStatus);
    }
  }
  return statusArray;
};

/**
 * @summary generate 15 days as the day filter for posts list admin
 */
Posts.getDateQueryString = function (date) {
  return moment(date).format('YYYY-MM-DD');
};

/**
 * @summary generate 15 days as the day filter for posts list admin
 */
Posts.getDateSelectors = function () {
  const size = 15;
  let REFERENCE = moment(new Date()); // today

  const dateSelectors = [];
  for (let i = 0; i < size; i++) {
    const date = REFERENCE.clone().subtract(i, 'months');
    const queryString = moment(date).format('YYYY-MM');
    const beginMoment = moment(AppConstants.config.webService.beginDate).format('YYYY-MM');

    if (date.isBefore(beginMoment)) {
      continue;
    }

    const title = date.format('MMMM YYYY');
    dateSelectors.push({'query': queryString, 'title': title});
  }

  return dateSelectors;
};

Posts.getBulkPosts = function (props) {
  const {editModel, listTask} = props;

  const postStatusTag = props.editModel.form.fields.postStatusTag;
  const postStatus = Posts.getEditSingleStatus(postStatusTag);
  const postTopics = props.editModel.form.fields.postTopics;

  const appendTopics = _.pluck(postTopics, 'id');
  const {
    selectedTableRowIds,
  } = editModel.form;

  const bulkPosts = [];
  listTask.results.map(function (item, index) {
    const rowId = selectedTableRowIds[index].rowId;
    if (rowId === item.id) {
      let updatedTopics = _.unique(item.topics.concat(appendTopics));
      bulkPosts.push(
        {
          parseId: rowId,
          parseStatus: postStatusTag === POST_MODEL_STATUS_UNKNOW ? item.status : postStatus,
          parseTopics: updatedTopics
        }
      );
    }
  });

  return bulkPosts;
};


Posts.getTopicsTitlesObjectForPost = function (props) {
  const {post, listTask} = props;
  const {topicsDict} = listTask;
  const allTopicIds = Object.keys(topicsDict);
  const topicIds = post.topics;

  let topicsTitles = [];
  let topicsTitlesObject = {};
  topicIds.map(function (id) {
    if (allTopicIds.indexOf(id) !== -1) {
      topicsTitles.push(topicsDict[id]);
    }
  });

  return topicsTitles;
};

Posts.getTopicsIdsInPostsArray = function (parsedResults) {
  const multipleArrays = _.pluck(parsedResults, 'topics');
  const arrays = _.reduce(multipleArrays, function (result, arr) {
    return result.concat(arr);
  }, []);

  let topicsIds = _.unique(arrays);
  return topicsIds;
};

Posts.hasQueryChanged = function (lastPageQuery, currentLocation) {
  const currentQuery = queryString.parse(currentLocation.search);

  if ((lastPageQuery.s || '') !== (currentQuery.s || '')) {
    return true;
  }
  if ((lastPageQuery.topicId || '') !== (currentQuery.topicId || '')) {
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
  if ((lastPageQuery.before || '') !== (currentQuery.before || '')) {
    return true;
  }
  if ((lastPageQuery.after || '') !== (currentQuery.after || '')) {
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

Posts.getArticleLink = function (post) {
  const postId = post.id;
  return `${AppConstants.config.politiclWeb.serverURL}/?postId=${postId}`;
};

/**
 *
 * Users.openNewWindow("/", {action: "edit", editId: post._id, admin: true});
 * @param post
 * @returns {string}
 */
Posts.getEditArticleLink = function (post) {
  const postId = post.id;
  return `${AppConstants.config.politiclWeb.serverURL}/?action=edit&admin=true&editId=${postId}`;
};

Posts.getCommentsForPostLink = function (post) {
  const postId = post.id;
  return `comments/?postId=${postId}`;
};
/**
 * http://politicl.com/?query=rajasthan+public+service+commission&topicId=c0e11c134383803d427375633c5aba54
 * @param value
 * @returns {string}
 */
Posts.getSearchTopicLink = function (value) {
  return `${AppConstants.config.politiclWeb.serverURL}/?query=${value}`;
};

Posts.setVotingUsers = function (onlineParseObject, userInstanceWithoutData, tableSelectAction, hasVoting) {
  switch (tableSelectAction) {
    case VOTING_FOR_UPVOTE:
      if (hasVoting) {
        onlineParseObject.remove('usersUpvote', userInstanceWithoutData);
      } else {
        onlineParseObject.addUnique('usersUpvote', userInstanceWithoutData);
        onlineParseObject.remove('usersDownvote', userInstanceWithoutData);
      }
      break;
    case VOTING_FOR_DOWNVOTE:
      if (hasVoting) {
        onlineParseObject.remove('usersDownvote', userInstanceWithoutData);
      } else {
        onlineParseObject.remove('usersUpvote', userInstanceWithoutData);
        onlineParseObject.addUnique('usersDownvote', userInstanceWithoutData);
      }
      break;
  }
};

Posts.setParseOnlineObjectStatus = function (onlineParseObject, tableSelectAction) {
  let lastStatus = -1;
  let currentStatus = -1;

  switch (tableSelectAction) {
    case TABLE_ACTIONS_TYPE_AS_PUBLISHED:
      currentStatus = onlineParseObject.get('status');
      if (currentStatus !== Posts.config.STATUS_DELETED) {
        onlineParseObject.set('lastStatus', currentStatus);
      }
      onlineParseObject.set('status', Posts.config.STATUS_APPROVED);
      break;
    case TABLE_ACTIONS_TYPE_MOVE_TRASH:
      currentStatus = onlineParseObject.get('status');
      if (currentStatus !== Posts.config.STATUS_DELETED) {
        onlineParseObject.set('lastStatus', currentStatus);
      }
      onlineParseObject.set('status', Posts.config.STATUS_DELETED);
      break;
    case TABLE_ACTIONS_TYPE_RESTORE:
      let lastStatus = onlineParseObject.get('lastStatus');
      if (!lastStatus) {
        lastStatus = Posts.config.STATUS_SPAM;
      }
      onlineParseObject.set('status', lastStatus);
      break;
  }
};

Posts.getPostItemStatusTitle = (status) => {
  return Posts.config.ITEM_STATUS_TITLES[status];
};
Posts.getPostStatusTitle = (status) => {
  return Posts.config.STATUS_TITLES[status];
};
Posts.getPostMessageStatusTitle = (post) => {
  return Posts.config.STATUS_MESSAGE_TITLES[post.status];
};

/**
 * @summary limit the post's content
 * @param {Object} content
 * @param limit
 */
Posts.getLimitedContent = function (content, limit) {
  let mytextlet = content;

  if ((content).length > limit) {
    mytextlet = content.substring(0, limit - 3) + '...';
  }
  return mytextlet;
};

Posts.getDefaultImageFromType = (post) => {
  // if (post.userId === Telescope.settings.get('scraped_user_id', 'yv57iwi6Zq8jaM7uD')) {
  const author = post.author;
  if (!!author) {
    return '/default/' + author + '.jpg';
  }
  // }

  return null;
};

/**
 * @summary Get the complete thumbnail url whether it is hosted on Embedly or on an external website, or locally in the app.
 * @param {Object} post
 */
Posts.getImageFromType = (post) => {
  let thumbnailUrl = null;
  // http://localhost:3000/cdn/storage/undefined/268cc214-4cd0-47a8-a2d2-444d72eaa5b1/thumbnail400/268cc214-4cd0-47a8-a2d2-444d72eaa5b1
  // http://localhost:3000/files/images/Images/39c72a14-2bec-4d5c-b9de-fc076b26e026/thumbnail400/39c72a14-2bec-4d5c-b9de-fc076b26e026.jpg

  let cloudinaryUrls = post['cloudinaryUrls'];

  if (!!cloudinaryUrls && cloudinaryUrls.length > 0) {
    thumbnailUrl = cloudinaryUrls[0].url;
  }
  else if (!thumbnailUrl && !!post.thumbnailUrl) {
    thumbnailUrl = post.thumbnailUrl;
  }
  if (!!thumbnailUrl) {
    return thumbnailUrl;
  }

  return Posts.getDefaultImageFromType(post);
};

/**
 * @summary Get the complete thumbnail url whether it is hosted on Embedly or on an external website, or locally in the app.
 * @param {Object} post
 */
Posts.getThumbnailSet = (post) => {
  const small = Posts.getImageFromType(post);

  return {small: small};
};

Posts.getRelatedThumbnailSet = (post) => {
  const small = Posts.getImageFromType(post);

  return {small: small};
};

/**
 * @summary Convert date to string using moment.js
 * @param {Object} date
 */
Posts.getDailyDateTitle = function (date) {
  let title = '';

  if (!!date) {
    let REFERENCE = moment(new Date()); // today
    let TODAY = REFERENCE.clone().startOf('day');
    let YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');

    const momentDate = moment(date);
    let prefix = '';
    if (momentDate.isSame(TODAY, 'd')) {
      title = 'Today, ' + momentDate.format('MMMM Do');
    } else if (momentDate.isSame(YESTERDAY, 'd')) {
      title = 'Yesterday, ' + momentDate.format('MMMM Do');
    } else {
      title = momentDate.format('dddd, MMMM Do');
    }
  }

  return title;
};

/**
 * @summary statistic topics.
 */
Posts.generatePostListTitle = function (location) {
  const query = queryString.parse(location.search);

  let title = null;

  let preTitle = 'Articles';

  if (query.query) {
    title = `${preTitle} in ${query.query}`;
  }
  else if (query.from) {
    title = `${preTitle} in ${query.from}`;
  }
  else if (query.author) {
    title = `${preTitle} in ${query.author}`;
  } else if (query.userId) {
    title = `${preTitle} by ${query.title}`;
  }
  else if (query.after) {
    if (query.cat || query.topicId) {
      title = `${query.title} on ${moment(query.after).format('MMMM Do')}`;
    } else {
      title = Posts.getDailyDateTitle(moment(query.after));
    }
  } else if (query.cat || query.topicId) {
    title = `${preTitle} in ${query.title}`;
  }

  if (query.admin) {
    if (!title) {
      let status = query.status;
      title = `${preTitle} in ${status}`;
    }
    title += ' [APPROVING]';
  }

  return {showHeader: !!title, title};
};

Posts.generateTwitterShareLink = function (post) {
  const twitterVia = 'Getpoliticl';
  const splits = [];
  splits.push('url=' + post.url);
  splits.push('via=' + twitterVia);
  splits.push('text=' + post.title);

  return 'https://twitter.com/share?' + splits.join('&');
};

/**
 *
 * https://www.facebook.com/dialog/share?
 * app_id=1549529981961270&href=http://scruby.site/?postId=hHMiCtoJkHEN56tQB&title=a-snapdragon-835-powered-windows-10-device-isn-t-far-away&quote=
 *
 */
Posts.generateFacebookShareLink = function (post) {
  let facebookId = '185174771986249';
  const splits = [];
  splits.push('app_id=' + facebookId);
  splits.push('href=' + post.url);
  splits.push('quote=');

  return 'https://www.facebook.com/dialog/share?' + splits.join('&');
};


Posts.votingValue = function (voteType, document) {
  switch (voteType) {
    case POSTS_VOTING_LIST_UPVOTE:
    case POSTS_VOTING_ARTICLE_UPVOTE:
      return document.usersUpvote.length;
    case POSTS_VOTING_LIST_DOWNVOTE:
    case POSTS_VOTING_ARTICLE_DOWNVOTE:
      return document.usersDownvote.length;
  }

  return 0;
};

Posts.isUpvotingButton = function (voteType) {
  switch (voteType) {
    case POSTS_VOTING_LIST_UPVOTE:
    case POSTS_VOTING_ARTICLE_UPVOTE:
      return true;
    case POSTS_VOTING_LIST_DOWNVOTE:
    case POSTS_VOTING_ARTICLE_DOWNVOTE:
      return false;
  }
  return false;
};

Posts.generateCommentTwitterShareLink = function (router, comment) {

  //href="https://twitter.com/share?
  //url=https%3A%2F%2Fdev.twitter.com%2Fweb%2Ftweet-button&
  //via=twitterdev&
  //related=twitterapi%2Ctwitter&
  //hashtags=example%2Cdemo&
  //text=custom%20share%20text"

  //$(location).attr('href');

  const twitterVia = Telescope.settings.get('twitterAccount', 'Getpoliticl');

  const url = Posts.generatePostPageUrl(router);
  const userName = Users.getDisplayName(comment.user);
  let text = comment.body;
  text = '\"' + text.substring(0, 50) + '...\"' + ' — ' + userName;

  const splits = [];
  splits.push('via=' + twitterVia);
  splits.push('url=' + url);
  splits.push('text=' + text);
  return 'https://twitter.com/share?' + splits.join('&');
};

Posts.generateCommentFacebookShareLink = function (router, comment) {
  //https://www.facebook.com/dialog/feed?
  //  app_id=1389892087910588
  //  &redirect_uri=https://scotch.io
  //  &link=https://scotch.io
  //  &picture=http://placekitten.com/500/500
  //  &caption=This%20is%20the%20caption
  //  &description=This%20is%20the%20description

  let facebookId = Telescope.settings.get('FACEBOOK_APP_ID');
  const url = Posts.generatePostPageUrl(router);
  let text = comment.body;

  const splits = [];

  splits.push('app_id=' + facebookId);
  splits.push('href=' + url);
  splits.push('quote=' + text);

  return 'https://www.facebook.com/dialog/share?' + splits.join('&');
};

Posts.validateUrl = function (value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
};


Posts.getDomain = function (url, subdomain) {
  subdomain = subdomain || false;

  url = url.replace(/(https?:\/\/)?(www.)?/i, '');

  if (!subdomain) {
    url = url.split('.');

    url = url.slice(url.length - 2).join('.');
  }

  if (url.indexOf('/') !== -1) {
    return url.split('/')[0];
  }

  return url;
};

Posts.adjustLargeImage = function (image) {
  const {width, height, url} = image;
  const split = url.split('&');

  for (let i = 0; i < split.length; i++) {
    let pair = split[i].split('=');
    if (decodeURIComponent(pair[0]) === 'width') {
      split[i] = 'width=' + width;
    } else if (decodeURIComponent(pair[0]) === 'height') {
      split[i] = 'height=' + height;
    }
  }
  return split.join('&');
};

Posts.parseEmbedlyData = function (json) {

  if (!!json.images && !!json.images.length) // there may not always be an image
  {
    json.thumbnailUrl = json.images[0].url;
  }

  if (!!json.authors && json.authors.length > 0) {
    json.sourceName = json.authors[0].name;
    json.sourceUrl = json.authors[0].url;
  }

  if (!!json.provider_display) {
    json.sourceFrom = json.provider_display;
  } else {
    json.sourceFrom = Posts.getDomain(json.sourceUrl);
  }

  if (!!json.content) {
    let matchs = String(json.content).match(/src\=[',"]([^\s]*)[',"]>\s/);
    if (!!matchs && matchs.length >= 2) {
      json.articleImage = matchs[1];
    }
  }

  if (!!json.images && json.images.length > 0) {
    const largeImage = json.images[0];
    json.articleImage = Posts.adjustLargeImage(largeImage);
  }

  let embedlyData = _.pick(json, 'title', 'media', 'description', 'thumbnailUrl', 'sourceName', 'sourceUrl', 'sourceFrom', 'articleImage');

  return embedlyData;
};

Posts.parseDomain = (url) => {
  let parse_domain = parseDomain(url);

  if (!!parse_domain) {
    let subdomain = parse_domain.subdomain,
      domain = parse_domain.domain,
      tld = parse_domain.tld;

    if (subdomain.length > 10) {
      subdomain = '';
    }

    return (((subdomain === 'www') || (subdomain === '')) ? [domain, tld] : [subdomain, domain, tld]).join('.');
  }

  let split = url.split('//');
  if (split.length > 2) {
    let right = split[1];
    let s = right.split('/');
    if (s.length > 2) {
      let domain = s[0].replace('www.', '');
      return domain;
    }
  }

  return '';
};

export default Posts;

