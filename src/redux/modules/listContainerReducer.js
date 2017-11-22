/**
 * # authReducer.js
 *
 * The reducer for all the actions from the various log states
 */
/**
 * ## Imports
 * The InitialState for auth
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */


const initialState = {}

/**
 * The states were interested in
 */
const {
  LIST_VIEW_LOADED_BY_TYPE,
  WRITE_VOTING_USERS_DONE,
} = require('../../lib/constants')

/**
 * ## authReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
function listContainerReducer(state = initialState, action={}) {
  switch (action.type) {
    case WRITE_VOTING_USERS_DONE: {
      const {objectSchemaName, votingModel, listId} = action.payload
      let nextTask = {};
      nextTask[listId] = {
        taskType: WRITE_VOTING_USERS_DONE,
        objectSchemaName,
        votingModel
      }

      const nextState = nextTask;
      return nextState
    }
    /**
     * ### Requests start
     * set the form to fetching and clear any errors
     */
    case LIST_VIEW_LOADED_BY_TYPE: {
      const {list, listId, limit, totalCount, topicsDict, tableRelationCounts, forObject} = action.payload

      let nextTask = {};
      nextTask[listId] = {
        taskType: LIST_VIEW_LOADED_BY_TYPE,
        ready: true,
        id: listId,
        results: list,
        totalCount,
        limit,
        topicsDict,
        tableRelationCounts,
        forObject
      }

      const nextState = nextTask;
      return nextState
    }

  }

  /**
   * ## Default
   */
  return state
}

export default listContainerReducer;
