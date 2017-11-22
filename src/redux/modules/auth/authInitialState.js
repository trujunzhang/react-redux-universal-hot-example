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
const {Record} = require('immutable')
const {
  REGISTER
} = require('../../../lib/constants')

/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
const Form = Record({
  state: REGISTER,
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
  fields: new (Record({
    username: 'trujunzhang',
    usernameHasError: false,
    usernameErrorMsg: '',
    email: 'trujunzhang@gmail.com',
    emailHasError: false,
    emailErrorMsg: '',
    password: 'wanghao@720',
    passwordHasError: false,
    passwordErrorMsg: '',
    passwordAgain: '',
    passwordAgainHasError: false,
    passwordAgainErrorMsg: '',
    showPassword: false
  }))()
})

/**
 * ## InitialState
 * The form is set
 */
let InitialState = Record({
  form: new Form()
})
export default InitialState

