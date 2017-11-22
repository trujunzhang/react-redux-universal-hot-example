const _ = require('underscore');
const md5 = require('blueimp-md5');

import AppConstants from './appConstants';
import moment from 'moment';

const {
  REVIEW_LIST_TYPE_NORMAL,
  REVIEW_LIST_TYPE_USER_PROFILE_ABOUT,
  REVIEW_LIST_TYPE_USER_PROFILE_REVIEWS,
  // 1.1 LOGGED user left menus.
  LOGGED_USER_MENU_ABOUT,
  LOGGED_USER_MENU_REVIEWS,
  LOGGED_USER_MENU_BROWSER_PHOTOS,
  LOGGED_USER_MENU_EVENTS,
  // Users
  TABLE_ACTIONS_TYPE_USER_ROLE_NONE,
  TABLE_ACTIONS_TYPE_USER_ROLE_NORMAL,
  TABLE_ACTIONS_TYPE_USER_ROLE_ADMINISTRATOR,
  // Voting
  POSTS_VOTING_LIST_UPVOTE,
  POSTS_VOTING_LIST_DOWNVOTE,
  POSTS_VOTING_ARTICLE_UPVOTE,
  POSTS_VOTING_ARTICLE_DOWNVOTE,

  // User Profile left menus type
  USER_PROFILE_LEFT_SIDE_UPVOTE,
  USER_PROFILE_LEFT_SIDE_DOWNVOTE,
  USER_PROFILE_LEFT_SIDE_SUBMITTED_ARTICLES,

  // User connection type
  USER_CONNECT_VIA_FACEBOOK,
  USER_CONNECT_VIA_TWITTER,
} = require('./constants');

const Users = {


  config: {
    // February 2014
    dateFormat: 'MMMM YYYY',
    orderedDataFormat: 'DD, MMMM, YYYY'
  },
};

Users.config.TYPE_EMAIL = 1;
Users.config.TYPE_TWITTER = 2;
Users.config.TYPE_FACEBOOK = 3;
Users.config.TYPE_GOOGLE = 4;
Users.config.TYPE_GITHUB = 5;
Users.config.TYPE_LINKEDIN = 6;

Users.config.TYPE_TITLES = [
  '',
  'email',
  'twiter',
  'facebook',
  'google',
  'github',
  'linkedin'
];

/**
 * Sometimes, If the users run the 'IEATTA' app, but network is unavailability.
 * So give the users the 'anonymous' user firstly to let them can use the app.
 *
 * The uniqueId and the password is the same as '12345654321'.
 *
 * @type {{id: null, name: string, slug: string, email: string, loginType: string, uniqueId: string}}
 */
Users.config.anonymousUser = {
  id: null,
  username: 'anonymous',
  email: '',
  loginType: Users.config.TYPE_EMAIL,
  listPhotoId: ''
};

Users.config.politiclCrawler = {
  id: 'yv57iwi6Zq8jaM7uD',
  username: 'Politicl',
  slug: 'politicl',
  displayName: 'GetPoliticl',
  bio: 'I am an system administrator named Politicl.',
  email: 'contact@politicl.com',
  loginType: Users.config.TYPE_EMAIL,
  listPhotoId: ''
};
Users.isLoggedUser = function (userProfile, currentUser) {
  if (!!currentUser && !!userProfile && userProfile.id === currentUser.id) {
    return true;
  }

  return false;
};

/**
 * @summary Get a user's email hash
 * @param {Object} user
 */
Users.getEmailHash = function (user) {
  return md5(user.email);
};

Users.getCreatedAtFormat = function (user) {
  return moment(user.createdAt).format(Users.config.dateFormat);
};

Users.config.defaultStatistic = {
  adminCount: 0,
  twitterCount: 0,
  facebookCount: 0,
  emailCount: 0
};


Users.getUserStatisticRows = function (usersStatistic) {
  const {
    adminCount,
    twitterCount,
    facebookCount,
    emailCount
  } = usersStatistic || Users.config.defaultStatistic;

  const allCount = twitterCount + facebookCount + emailCount;
  const rows = [
    {title: 'All', status: 'all', count: allCount},
    {title: 'Admin', status: 'admin', count: adminCount},
    {title: 'Twitter', status: 'twitter', count: twitterCount},
    {title: 'Facebook', status: 'facebook', count: facebookCount},
    {title: 'Email', status: 'email', count: emailCount},
  ];

  return rows;
};

Users.getUserStatus = function (user, state) {
  let statusArray = [];
  let userStatus = Users.config.STATUS_CHECKING[user.status];
  if (state.toLowerCase() !== userStatus.toLowerCase()) {
    if (user.status !== Users.config.STATUS_APPROVED) {
      statusArray.push(userStatus);
    }
  }
  return statusArray;
};


Users.hasQueryChanged = function (editModel, lastPageQuery, currentLocation) {
  const currentQuery = currentLocation.query || {};

  if ((lastPageQuery.s || '') !== (currentQuery.s || '')) {
    return true;
  }
  if ((editModel.form.fields.countPerPage) !== (lastPageQuery.limit)) {
    return true;
  }
  if ((lastPageQuery.loginType || '') !== (currentQuery.loginType || '')) {
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

Users.getUserAvatarProperty = function (user) {
  if ((typeof user) === 'undefined') {
    return {};
  }
  const {loginType} = user;
  let _avatorId = '';
  switch (loginType) {
    case Users.config.TYPE_FACEBOOK:
      return {
        facebookId: user.facebook_id,
      };
    case Users.config.TYPE_TWITTER:
      _avatorId = user.twitter.profile_image_url;
      return {src: _avatorId};
    case Users.config.TYPE_EMAIL:
      return {email: user.email, name: user.username};
    default:
      return {email: user.email};
  }
};

Users.getUserEmail = function (user) {
  // ignoring, if user is empty.
  if ((typeof user) === 'undefined') {
    return null;
  }
  if (user === null) {
    return null;
  }
  if (!!user.telescope && user.telescope.email) {
    return user.telescope.email;
  } else {
    return null;
  }
};

/**
 * @summary Get a user's username (unique, no special characters or spaces)
 * @param {Object} user
 */
Users.getUserName = function (user) {
  try {
    if (user.username) {
      return user.username;
    }
    if (user && user.services && user.services.twitter && user.services.twitter.screenName) {
      return user.services.twitter.screenName;
    }
    if (user && user.services && user.services.facebook && user.services.facebook.name) {
      return user.services.facebook.name;
    }
  }
  catch (error) {
    console.log(error); // eslint-disable-line
    return null;
  }
};

/**
 * @summary Get a user's display name (not unique, can take special characters and spaces)
 * @param {Object} user
 */
Users.getDisplayName = function (user) {
  if (typeof user === 'undefined') {
    return '';
  } else {
    return user.username;
  }
};

Users.getLoginType = function (user) {
  const loginType = user.loginType;
  return Users.config.TYPE_TITLES[loginType];
};

Users.setParseOnlineObjectStatus = function (onlineParseObject, tableSelectAction) {
  let lastStatus = -1;
  let currentStatus = -1;
  switch (tableSelectAction) {
    case TABLE_ACTIONS_TYPE_USER_ROLE_NORMAL:
      onlineParseObject.set('isAdmin', false);
      break;
    case TABLE_ACTIONS_TYPE_USER_ROLE_ADMINISTRATOR:
      onlineParseObject.set('isAdmin', true);
      break;
  }
};

Users.getUserProfileLink = function (user) {
  const userLink = `users/${user.telescope.slug}`;
  return `${AppConstants.config.politiclWeb.serverURL}/${userLink}`;
};

/**
 *
 * Users.openNewWindow("/", {action: "edit", editId: post._id, admin: true});
 * @param post
 * @returns {string}
 */
Users.getEditArticleLink = function (post) {
  const postId = post.id;
  return `${AppConstants.config.politiclWeb.serverURL}/?action=edit&admin=true&editId=${postId}`;
};

Users.getPostsCount = function (user, listTask) {
  const {tableRelationCounts} = listTask;
  return tableRelationCounts[user.id] || 0;
};

/**
 * Check the post is for the backend admins.
 * @param location
 * @param user
 * @returns {boolean}
 */
Users.checkIsAdmin = function (location, user) {
  return false;

  // Dashboard UI(for admin)
  // const {admin} = location.query;
  // if (!admin || !user) {
  //   return false;
  // }
  // else if (!!admin && user.isAdmin) {
  //   return true;
  // }
  // return false;
};


Users.hasVoting = function (voteType, user, document) {
  switch (voteType) {
    case POSTS_VOTING_LIST_UPVOTE:
    case POSTS_VOTING_ARTICLE_UPVOTE:
      return user && _.include(document.usersUpvote, user.id);
    case POSTS_VOTING_LIST_DOWNVOTE:
    case POSTS_VOTING_ARTICLE_DOWNVOTE:
      return user && _.include(document.usersDownvote, user.id);
  }

  return false;
};

/**
 * @summary Check if a user has downvoted a document
 * @param {Object} user
 * @param {Object} document
 */
Users.hasDownvoted = function (user, document) {
  return user && _.include(document.downvoters, user.id);
};


Users.getAvatarObj = function (user) {
  // if (!user) {
  return {haveAvatar: false, url: null, avatarId: -1, title: '', slug: ''};
  // }

  // const url = null;//Users.avatar.getUrl(user);
  // if (!!url) {
  //   return {
  //     haveAvatar: true,
  //     url: url,
  //     avatarId: user.id,
  //     title: Users.getDisplayName(user),
  //     slug: user.slug
  //   }
  // }
  // return {
  //   haveAvatar: false,
  //   url: '',//Users.avatar.getInitials(user),
  //   avatarId: user.id,
  //   title: Users.getDisplayName(user),
  //   slug: user.slug
  // }
};

Users.getPopoverMenuArray = function (user, isMobileDevice) {
  const menuArrays = [];
  if (!!isMobileDevice) {
    menuArrays.push([
      {type: 'acticle', link: {pathname: '/', query: {action: 'new'}}, title: 'Submit an article'},
      {type: 'separator'},
    ]);
  }
  menuArrays.push([
    {type: 'profile', link: Users.getLinkObject('profile', user), title: 'MY PROFILE'},
    {type: 'separator'}
  ]);
  menuArrays.push([
    {type: 'settings', link: Users.getLinkObject('editing'), title: 'SETTINGS'},
    {type: Users.isAdmin(user) ? 'management' : '', link: {pathname: '/management'}, title: 'MANAGEMENT'},
    {type: 'separator'}
  ]);
  menuArrays.push([
    {type: 'logout', title: 'LOGOUT'}
  ]);

  return _.flatten(menuArrays);
};

Users.getCollectionsPopover = function (left, top, popWidth, popHeight, offX, defaultClassName = 'v-bottom-left') {
  // if (Users.isMobileDevice()) {
  if (false) {
    return {
      style: {
        top: (popHeight === -1) ? top : (((window.innerHeight - popHeight) / 2) + window.pageYOffset),
        left: ((window.innerWidth - popWidth ) / 2 + offX)
      },
      className: 'popover v-center-center'
    };
  }

  return {style: {top: top, left: left + offX}, className: `popover ${defaultClassName}`};
};

Users.generateUserProfileLeftMenuItems = function (props) {
  const {userProfile} = props;

  const leftSideUserMenuItems = [
    {
      tag: USER_PROFILE_LEFT_SIDE_UPVOTE,
      title: 'Upvotes',
      listTitle: (userProfile[USER_PROFILE_LEFT_SIDE_UPVOTE] || 0) + ' Upvote',
      emptyHint: 'No upvotes yet.',
      value: userProfile[USER_PROFILE_LEFT_SIDE_UPVOTE] || 0,
      link: Users.getLinkObject('profile', userProfile)
    },
    {
      tag: USER_PROFILE_LEFT_SIDE_DOWNVOTE,
      title: 'Downvotes',
      listTitle: (userProfile[USER_PROFILE_LEFT_SIDE_DOWNVOTE] || 0) + ' Downvotes',
      emptyHint: 'No downvotes yet.',
      value: userProfile[USER_PROFILE_LEFT_SIDE_DOWNVOTE] || 0,
      link: Users.getLinkObject('downvotes', userProfile)
    },
    {
      tag: USER_PROFILE_LEFT_SIDE_SUBMITTED_ARTICLES,
      title: 'Curated',
      listTitle: (userProfile[USER_PROFILE_LEFT_SIDE_SUBMITTED_ARTICLES] || 0) + ' articles submitted ',
      emptyHint: 'No submitted posts yet.',
      value: userProfile[USER_PROFILE_LEFT_SIDE_SUBMITTED_ARTICLES] || 0,
      link: Users.getLinkObject('submittedPosts', userProfile)
    },
  ];
  return leftSideUserMenuItems;
};

Users.getLinkObject = function (type, user = null, folder = null) {
  const userLink = !!user ? `/users/${user.slug}` : null;
  switch (type) {
    case 'homepage':
      return {pathname: '/'};
    case 'editing':
      return {pathname: '/users/my/edit'};
    case 'profile':
      return {pathname: userLink};
    case 'downvotes':
      return {pathname: `${userLink}/downvotes`};
    case 'submittedPosts':
      return {pathname: `${userLink}/posts`};
    case 'collections':
      return {pathname: `${userLink}/collections`};
    case 'folderItem':
      return {pathname: `${userLink}/collections/${folder._id}/${folder.name}`};
  }
};

Users.isAdmin = function (user) {
  try {
    return !!user && !!user.isAdmin;
  } catch (e) {
    return false; // user not logged in
  }
};


/**
 * ("http://localhost:3000/image/upload/cover/k6ikrrYh9y5ZDvzvR.jpg")
 * @param user
 * @returns {*}
 */
Users.getUserCoverUrl = (user) => {
  let coverUrls = user.coverUrls;
  if (!!coverUrls && coverUrls.length > 0) {
    return coverUrls[0].url;
  }
  return '';
};


/**
 * @summary Get a user's Twitter name
 * @param {Object} user
 */
Users.getTwitterName = function (user) {
  // return twitter name provided by user, or else the one used for twitter login
  if (typeof user !== 'undefined') {
  }
  return null;
};


/**
 * @summary Get a user's display name (not unique, can take special characters and spaces)
 * @param {Object} user
 */
Users.getBio = function (user) {
  if (typeof user === 'undefined') {
    return '';
  } else {
    // Issue #36: There should be no text on the cover image. Remove "Describe the Biography briefly".
    return (!!user && !!user.bio) ? user.bio : '';
  }
};

/**
 * @summary Get a user's email
 * @param {Object} user
 */
Users.getEmail = function (user) {
  // ignoring, if user is empty, or user is admin.
  if (!!user && !!user.email) {
    return user.email;
  } else {
    return '';
  }
};

Users.getServiceInformation = function (user, type) {
  switch (type) {
    case USER_CONNECT_VIA_FACEBOOK:
      if (user.loginType !== Users.config.TYPE_FACEBOOK) {
        return null;
      }
      break;
    case USER_CONNECT_VIA_TWITTER:
      if (user.loginType !== Users.config.TYPE_TWITTER) {
        return null;
      }
      break;
  }
  const url = null;//Users.avatar.getUrlByService(user, service);
  if (!!url) {
    return {haveAvatar: true, url: url, title: user.displayName};
  }
  return {haveAvatar: false, url: '', title: user.displayName};
};

Users.isMobileDevice = function () {
  return false;
};

Users.getDefaultUserProperty = function () {
  return {
    bio: '',
    notifications_posts: false,
    notifications_comments: true,
    notifications_replies: true,
    coverId: '',
    coverUrls: [],
    isSubscribed: false
  };
};

Users.setUserDeletionToken = function (onlineUser, {token}) {
  onlineUser.set('deletion_email_verify_token', token);

  let validDate = moment(new Date());
  validDate = validDate.add('day', 1);
  onlineUser.set('deletion_email_verify_token_expires_at', validDate.toDate());
};

export default Users;
