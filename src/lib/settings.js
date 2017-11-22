const _ = require('underscore');
import moment from 'moment';
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
  POST_MODEL_STATUS_APPROVED,
  POST_MODEL_STATUS_PENDING,
  POST_MODEL_STATUS_SPAM_DRAFT,
} = require('./constants');

const Settings = {
  config: {}
};

Settings.config.editTableDefaultObjects = [
  {columnValue: 'title', tableRowTitle: 'title'},
  {
    columnValue: 'siteUrl', tableRowTitle: 'site Url',
    description: ' Enter politicl web app address here.'
  },

  // {
  //   columnValue: "tagline", tableRowTitle: "tag line",
  //   description: 'In a few words, explain what this site is about.'
  // },

  {
    columnValue: 'defaultEmail', tableRowTitle: 'default Email',
    description: 'This address is used for admin purposes, like new user notification.'
  },
  {
    columnValue: 'mailUrl', tableRowTitle: 'mail Url',
    description: 'This mail url that will be used as default email deliverability.'
  },
  {
    columnValue: 'topicsFilterList',
    tableRowTitle: 'topics FilterList',
    description: 'Filted Tags need to be blocked from appearing next to trending topics sidebar.'
  },
  {
    columnValue: 'topicsBlackList', tableRowTitle: 'topics BlackList',
    description: 'Banned Tags need to be removed from appearing next to posts.'
  },

  // {columnValue: "scoreUpdateInterval", tableRowTitle: "score UpdateInterval"},
  // {columnValue: "postInterval", tableRowTitle: "postInterval"},
  // {columnValue: "commentInterval", tableRowTitle: "commentInterval"},
  // {columnValue: "maxPostsPerDay", tableRowTitle: "maxPostsPerDay"},
  // {columnValue: "startInvitesCount", tableRowTitle: "startInvitesCount"},
  // {columnValue: "postsPerPage", tableRowTitle: "postsPerPage"},

  {columnValue: 'twitterAccount', tableRowTitle: 'twitter Account'},
  {columnValue: 'facebookPage', tableRowTitle: 'facebook Page'},
  {columnValue: 'googleAnalyticsId', tableRowTitle: 'googleAnalyticsId'},
  {
    columnValue: 'embedlyKey', tableRowTitle: 'embedlyKey',
    description: 'Sometimes, If the Embedly\'s account have been expired, Change different apikey here.'
  },
  {
    columnValue: 'bugsnagKey', tableRowTitle: 'bugsnagKey',
    description: 'Sometimes, If the bugsnag\'s account have been expired, Change different apikey here.'
  },
  {columnValue: 'KADIRA_APP_ID', tableRowTitle: 'KADIRA APP_ID'},
  {columnValue: 'KADIRA_APP_SECRET', tableRowTitle: 'KADIRA APP_SECRET'},
  {
    columnValue: 'scraped_user_id', tableRowTitle: 'scraped user_id',
    description: 'This is the important user that must be used as the crawler\'s author.'
  },
  {columnValue: 'cloudinaryCloudName', tableRowTitle: 'cloudinary CloudName'},
  {columnValue: 'cloudinaryAPIKey', tableRowTitle: 'cloudinary APIKey'},
  {columnValue: 'cloudinaryAPISecret', tableRowTitle: 'cloudinary APISecret'},

  // {columnValue: "sidebar", tableRowTitle: "sidebar"},
  // {columnValue: "emailNotifications", tableRowTitle: "emailNotifications"}
];

Settings.generateUpdatedModel = function (props) {
  const {editModel, listTask} = props;

  let updatedModel = {parseId: listTask.results[0].id};

  const settingsObjects = Settings.config.editTableDefaultObjects;

  settingsObjects.map(function (object) {
    updatedModel[object.columnValue] = editModel.form.fields[object.columnValue];
  });

  return updatedModel;
};
Settings.generateCurrentTableObjects = function (settingModel) {
  const settingsObjects = Settings.config.editTableDefaultObjects;
  let tableRows = [];
  settingsObjects.map(function (object) {
    const tableRowObject = {
      columnValue: object.columnValue,
      tableRowTitle: object.tableRowTitle,
      tableRowValue: settingModel[object.columnValue],
      tableRowDescription: object.description
    };
    tableRows.push(tableRowObject);
  });
  return tableRows;
};
Settings.getInitEditKeyValue = function () {
  const settingsObjects = Settings.config.editTableDefaultObjects;
  let model = {};
  settingsObjects.map(function (object) {
    model[object.columnValue] = null;
  });
  return model;
};


export default Settings;
