/**
 * # authFormValidation.js
 *
 * This class determines only if the form is valid
 * so that the form button can be enabled.
 * if all the fields on the form are without error,
 * the form is considered valid
 */

/**
 * ## Imports
 * the actions being addressed
 */
const {
  MENU_TABLE_TYPE_POSTS,
  MENU_ITEM_ADD_OR_EDIT_EVENT,
  MENU_ITEM_ADD_OR_EDIT_REVIEW,
  MENU_ITEM_ADD_OR_EDIT_USER,
  // parse models
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_SITES,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_FLAGS,
} = require('../../../lib/constants')

/**
 * ## formValidation
 * @param {Object} state - the Redux state object
 */
export default function formValidation(state) {

  switch (state.form.objectSchemaName) {
    /**
     * ### Logout has no fields, so always valid
     */
    case PARSE_POSTS:
      if (
        state.form.fields.displayName !== '' &&
        !state.form.fields.displayNameHasError &&
        state.form.fields.slugName !== '' &&
        !state.form.fields.slugNameHasError
      ) {
        return state.setIn(['form', 'isValid'], true)
      } else {
        return state.setIn(['form', 'isValid'], false)
      }
      break;
    case PARSE_TOPICS:
      if (
        state.form.fields.displayName !== '' &&
        !state.form.fields.displayNameHasError &&
        state.form.fields.slugName !== '' &&
        !state.form.fields.slugNameHasError
      ) {
        return state.setIn(['form', 'isValid'], true)
      } else {
        return state.setIn(['form', 'isValid'], false)
      }
      break;
    case PARSE_COMMENTS:
      if (
        state.form.fields.commentBody !== '' &&
        !state.form.fields.commentBodyHasError
      ) {
        return state.setIn(['form', 'isValid'], true)
      } else {
        return state.setIn(['form', 'isValid'], false)
      }
      break;
    case PARSE_FLAGS:
      if (
        state.form.fields.flagReason !== '' &&
        !state.form.fields.flagReasonHasError
      ) {
        return state.setIn(['form', 'isValid'], true)
      } else {
        return state.setIn(['form', 'isValid'], false)
      }
      break;
  }
  return state
}
