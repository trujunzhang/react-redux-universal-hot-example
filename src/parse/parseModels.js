const slugify = require('slugify');
const _ = require('underscore');

import AppConstants from '../lib/appConstants';

import Settings from '../lib/settings';

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
} = require('../lib/constants');

export function fromParsePointer(map: Object) {
  return {
    id: map.id,
  };
}

function fromParseCommon(map: Object) {
  return {
    id: map.id,
    createdAt: map.get('createdAt'),
    updatedAt: map.get('updatedAt'),
    postedAt: map.get('postedAt'),
  };
}


export function fromParseUser(map: Object) {
  const model = {
    // Basic Fields
    ...fromParseCommon(map),
    // Attributes
    services: map.get('services') || {facebook: {}, twitter: {}},
    profile: map.get('profile'),
    telescope: map.get('telescope'),
    loginType: map.get('loginType'),
    isAdmin: map.get('isAdmin'),
    emailVerified: map.get('emailVerified'),
    email_verify_token: map.get('_email_verify_token'),
  };
  return model;
}


export function fromParseTopics(map: Object) {
  return {
    // Basic Fields
    ...fromParseCommon(map),
    // Attributes
    slug: map.get('slug'),
    active: map.get('active'),
    status: map.get('status'),
    name: map.get('name'),
    is_ignore: map.get('is_ignore '),
    days: map.get('days'),
  };
}

function fromParseOnlyId(map) {
  return map.id;
}

export function fromParsePosts(map: Object) {
  const _model = {
    // Basic Fields
    ...fromParseCommon(map),
    // Attributes
    dummySlug: map.get('dummySlug'),
    userId: map.get('userId'),
    excerpt: map.get('excerpt'),
    isFuture: map.get('isFuture'),
    upvoters: map.get('upvoters'),
    topics: map.get('topics') || [],
    clickCount: map.get('clickCount'),
    cloudinaryId: map.get('cloudinaryId'),
    slug: map.get('slug'),
    sticky: map.get('sticky'),
    body: map.get('body'),
    htmlBody: map.get('htmlBody'),
    score: map.get('score'),
    downvotes: map.get('downvotes'),
    url: map.get('url'),
    viewCount: map.get('viewCount') || 0,
    cloudinaryVersion: map.get('cloudinaryVersion') || '',
    cloudinaryUrls: map.get('cloudinaryUrls') || [],
    commenters: map.get('commenters'),
    title: map.get('title'),
    sourceFrom: map.get('sourceFrom'),
    commentCount: map.get('commentCount') || 0,
    thumbnailUrl: map.get('thumbnailUrl') || '',
    inactive: map.get('inactive'),
    lastCommentedAt: map.get('lastCommentedAt'),
    author: map.get('author'),
    baseScore: map.get('baseScore'),
    upvotes: map.get('upvotes'),
    // status
    lastStatus: map.get('lastStatus') || map.get('status'),
    status: map.get('status'),

    usersUpvote: (map.get('usersUpvote') || []).map(fromParseOnlyId),
    usersDownvote: (map.get('usersDownvote') || []).map(fromParseOnlyId),

    objectSchemaName: PARSE_POSTS,
  };

  return _model;
}


export function fromParseFlags(map: Object) {
  const _model = {
    // Basic Fields
    ...fromParseCommon(map),
    // Attributes
    status: map.get('status'),
    reason: map.get('reason'),
    type: map.get('type'),
    userId: map.get('userId'),
    user: map.get('user') && fromParseUser(map.get('user')),
    authorId: map.get('authorId'),
    author: map.get('author') && fromParseUser(map.get('author')),
    postId: map.get('postId'),
    post: map.get('post') && fromParsePosts(map.get('post')),
  };

  return _model;
}

export function fromParseBaseComments(map: Object) {

  const _model = {
    // Basic Fields
    ...fromParseCommon(map),
    // Attributes
    upvotes: map.get('upvotes'),
    downvotes: map.get('downvotes'),
    baseScore: map.get('baseScore'),
    score: map.get('score'),
    author: map.get('author'),
    postId: map.get('postId'),
    post: map.get('post') && fromParsePosts(map.get('post')),
    body: map.get('body'),
    userId: map.get('userId'),
    user: map.get('user') && fromParseUser(map.get('user')),
    userIP: map.get('userIP'),
    userAgent: map.get('userAgent'),
    status: map.get('status'),
    htmlBody: map.get('htmlBody'),
    lastStatus: map.get('lastStatus'),
    inactive: map.get('inactive'),
  };

  return _model;
}

export function fromParseComments(map: Object) {

  const _model = {
    // Basic Fields
    ...fromParseBaseComments(map),
    parentComment: map.get('parentComment') && fromParseBaseComments(map.get('parentComment')),
  };

  return _model;
}


export function fromParseSettings(map: Object) {
  let model = {
    // Basic Fields
    ...fromParseCommon(map),
    // Attributes
  };

  const settingsObjects = Settings.config.editTableDefaultObjects;

  settingsObjects.map(function (object) {
    model[object.columnValue] = map.get(object.columnValue);
  });

  return model;
}


export function fromParseLoggedUser(map: Object) {
  const model = {
    // Basic Fields
    ...fromParseCommon(map),
    // Attributes
    username: map.get('username'),
    displayName: map.get('displayName') || '',
    slug: map.get('slug') || slugify(map.get('username'), '_'),
    bio: map.get('bio') || '',
    loginType: map.get('loginType'),
    email: map.get('email') || '',
    isAdmin: map.get('isAdmin'),
    emailVerified: map.get('emailVerified'),
    // social
    facebook_id: map.get('facebook_id') || '',
    // Notification
    notifications_posts: map.get('notifications_posts') || false,
    notifications_comments: map.get('notifications_comments') || false,
    notifications_replies: map.get('notifications_replies') || false,
    // News letter
    isSubscribed: map.get('isSubscribed') || false,
    // User profile background
    coverId: map.get('coverId') || '',
    coverUrls: map.get('coverUrls') || [],
    // Verification
    deletion_email_verify_token: map.get('deletion_email_verify_token') || '',
    deletion_email_verify_token_expires_at: map.get('deletion_email_verify_token_expires_at') || new Date(),
  };

  return model;
}


export function parseOnlineParseObject(objectSchemaName, map) {
  switch (objectSchemaName) {
    case PARSE_POSTS:
      return fromParsePosts(map);
    case PARSE_TOPICS:
      return fromParseTopics(map);
    case PARSE_COMMENTS:
      return fromParseComments(map);
    case PARSE_USERS:
      return fromParseUser(map);
    case PARSE_SETTINGS:
      return fromParseSettings(map);
    case PARSE_FLAGS:
      return fromParseFlags(map);

  }

}
