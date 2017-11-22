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
  PARSE_FLAGS
} = require('./constants');


import WebsiteTypes from './websiteTypes';
import ScrapedWebsites from './scraped_websites';
import Posts from './posts';


const AppConstants = {
  config: {
    webService: {
      beginDate: '2017-06'
    }
  }
};

AppConstants.config.parse = {
  // deploy-check
  serverURL: 'https://politicl-uapp.herokuapp.com/parse',
  serverDashboardURL: 'https://politicps-dashboard.herokuapp.com/apps',
  api: {
    applicationId: 'YTlrBqSp0MzkqIfZjG1Lz4L8BAu1XfqlMFJ4da3bSFu72tN0eK514AumUY',
    javaScriptKey: '4ri90zKbBxY92YlxE8HasDhaZWEGsADvrryWERpDehPaLaTZEXG33sI9NG',
    masterKey: 'M0h4dP1VPBPBAtMsWrw6DyNDkqwR24sRn81hkAxp7iJsniODMyXiC8PT70',
    restAPIKey: '4shwgAUTeUJAK2vkLcMQ40wUnvUFDncG6Ne6q9PIgWvBITTbob3FSMS9Ay',
  }
};

AppConstants.config.politiclWeb = {
  serverURL: 'http://politicl.com',
};

if (__DEVELOPMENT__) {
  AppConstants.config.parse = {
    // deploy-check
    serverURL: 'http://localhost:3000/parse',
    serverDashboardURL: 'http://localhost:4040',
    api: {
      applicationId: 'YTlrBqSp0MzkqIfZjG1Lz4L8BAu1XfqlMFJ4da3bSFu72tN0eK514AumUY',
      javaScriptKey: '4ri90zKbBxY92YlxE8HasDhaZWEGsADvrryWERpDehPaLaTZEXG33sI9NG',
      masterKey: 'M0h4dP1VPBPBAtMsWrw6DyNDkqwR24sRn81hkAxp7iJsniODMyXiC8PT70',
      restAPIKey: '4shwgAUTeUJAK2vkLcMQ40wUnvUFDncG6Ne6q9PIgWvBITTbob3FSMS9Ay',
    }
  };

  AppConstants.config.politiclWeb = {
    serverURL: 'http://localhost:3000',
  };
}


AppConstants.currentVersion = 'v2';

/**
 * The value's format is 'xxx_yyy'.
 *
 * @param siteTag
 */
AppConstants.getWebsiteFieldValue = function (siteTag) {
  return (WebsiteTypes[siteTag].value).replace(/-/g, '_');
};

AppConstants.getWebsiteValue = function (siteTag) {
  return (WebsiteTypes[siteTag].value);
};

AppConstants.getWebsiteSiteStatus = function (siteTag, version = AppConstants.currentVersion) {
  const currentSiteDrafts = ScrapedWebsites.versions.websiteDrafts[version];
  const index = currentSiteDrafts.indexOf(siteTag);

  if (index === -1) {
    return Posts.config.STATUS_APPROVED;
  }

  return Posts.config.STATUS_SPAM;
};

AppConstants.getWebsiteSiteDomain = function (siteTag, version = AppConstants.currentVersion) {
  const currentSitesPagination = ScrapedWebsites.versions.websitesPaginations[version];
  const index = Object.values(currentSitesPagination).indexOf(siteTag);
  return Object.keys(currentSitesPagination)[index];
};

AppConstants.getCurrentSiteTags = function (version = AppConstants.currentVersion) {
  const siteTags = ScrapedWebsites.versions.siteTags[version];
  return siteTags;
};

AppConstants.realmObjects = {
  'record': {objectSchemaName: PARSE_SETTINGS},
  'restaurant': {objectSchemaName: PARSE_POSTS},
  'event': {objectSchemaName: PARSE_TOPICS},
  'peopleInEvent': {objectSchemaName: PARSE_FLAGS},
  'user': {objectSchemaName: PARSE_USERS},
  'recipe': {objectSchemaName: PARSE_SITES},
  'photo': {objectSchemaName: PARSE_COMMENTS},
  'review': {objectSchemaName: PARSE_HISTORY},
};

AppConstants.realmTypes = {
  PARSE_SETTINGS: 'record',
  PARSE_POSTS: 'restaurant',
  PARSE_TOPICS: 'event',
  PARSE_FLAGS: 'peopleInEvent',
  PARSE_USERS: 'user',
  PARSE_SITES: 'recipe',
  PARSE_COMMENTS: 'photo',
  PARSE_HISTORY: 'review'
};

AppConstants.SubDomainPhotos = {
  PARSE_POSTS: 'biz_photos',
  PARSE_SITES: 'recipe_photos',
  PARSE_USERS: 'user_local_photos',
};


AppConstants.getRelativeModel = function (modelType, objectSchemaName, modelSchema) {
  const currentPhotoType = AppConstants.realmTypes[objectSchemaName];

  return (currentPhotoType === modelType) ?
    {
      id: modelSchema.parseId,
      uniqueId: modelSchema.uniqueId
    } :
    {
      id: '',
      uniqueId: ''
    };

};


AppConstants.generateRelativeObjects = function (forParseInstance, reviewType) {
  const defaultRelativeObject =
    {
      restaurant: {id: '', uniqueId: ''},
      event: {id: '', uniqueId: ''},
      recipe: {id: '', uniqueId: ''}
    };
  defaultRelativeObject[reviewType] =
    {
      id: forParseInstance.id,
      uniqueId: forParseInstance.uniqueId
    };
  return defaultRelativeObject;
};


AppConstants.getUniqueIdByType = function (instance, modelType) {
  const {objectSchemaName} = AppConstants.realmObjects[modelType];

  switch (objectSchemaName) {
    case PARSE_POSTS:
      return instance.restaurant.uniqueId;
    case PARSE_SITES:
      return instance.recipe.uniqueId;
    case PARSE_USERS:
      return instance.user.uniqueId;
  }
};


export default AppConstants;

