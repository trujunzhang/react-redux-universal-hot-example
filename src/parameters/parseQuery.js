const {
  ParseComments,
  ParseTopics,
  ParseUsers,
  getInstanceWithoutData
} = require('../parse/objects');

import AppConstants from '../lib/appConstants';

/**
 * The states were interested in
 */
const {
  // Parse Model Types
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_SITES,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_PEOPLE_IN_EVENT,
} = require('../lib/constants');


export function equalRelationObject(query, objectSchemaName, parseId, fieldName) {
  if (!!parseId) {
    const modelType = AppConstants.realmTypes[objectSchemaName];
    const instanceWithoutData = getInstanceWithoutData(objectSchemaName, parseId);
    query.equalTo(modelType, instanceWithoutData);
  }
}
