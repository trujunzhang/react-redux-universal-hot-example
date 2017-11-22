/**
 * # authInitialState.js
 *
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
/**
 * ## Import
 */
const {Record} = require('immutable');

const {
  MENU_TABLE_TYPE_POSTS,
  // Model Form Type
  MODEL_FORM_TYPE_NEW,
  MODEL_FORM_TYPE_EDIT,


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

  // Post Status
  POST_MODEL_STATUS_APPROVED,
  POST_MODEL_STATUS_PENDING,
  POST_MODEL_STATUS_SPAM_DRAFT,
  POST_MODEL_STATUS_UNKNOW,


  // Table Options
  APP_TABLE_OPTIONS_CLOSE,
  APP_TABLE_OPTIONS_OPEN_OPTIONS,
  APP_TABLE_OPTIONS_OPEN_HELP,

  // Users
  TABLE_ACTIONS_TYPE_USER_ROLE_NONE,
  TABLE_ACTIONS_TYPE_USER_ROLE_NORMAL,
  TABLE_ACTIONS_TYPE_USER_ROLE_ADMINISTRATOR,
} = require('../../../lib/constants');

/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
const Form = Record({
  state: MENU_TABLE_TYPE_POSTS,
  originModel: {},
  objectSchemaName: '',
  // Select rows
  hasSelectedAllRows: false,
  currentTableRowIds: [],
  selectedTableRowIds: [],
  selectedTableSingleRowId: '',
  tableEditSingleRow: false,
  tableEditSelectedRows: false,
  // Table action
  tableSelectAction: TABLE_ACTIONS_TYPE_NONE,
  tableUserRoleSelectAction: TABLE_ACTIONS_TYPE_USER_ROLE_NONE,
  // Event
  disabled: false,
  error: null,
  isValid: true,
  isFetching: false,
  fields: new (Record({
    countPerPage: 10,
    currentTableType: APP_TABLE_OPTIONS_CLOSE,
    postStatusTag: POST_MODEL_STATUS_UNKNOW,
    //className:"Select-create-option-placeholder"
    postTopics: [], // Format is array with {id:'xxx',name:'yyy', OR className:''}
    displayName: '',
    displayNameHasError: false,
    displayNameErrorMsg: '',
    link: '',
    linkHasError: false,
    linkErrorMsg: '',
    commentBody: '',
    commentBodyHasError: false,
    commentBodyErrorMsg: '',
    flagReason: '',
    flagReasonHasError: false,
    flagReasonErrorMsg: '',
    slugName: '',
    slugNameHasError: false,
    slugNameErrorMsg: '',
  }))()
});

/**
 * ## InitialState
 * The form is set
 */
let InitialState = Record({
  form: new Form()
});
export default InitialState;

