const {
  getInstanceWithoutData
} = require('../parse/objects');

/**
 * The states were interested in
 */
const {
  PARSE_POSTS,
  PARSE_USERS
} = require('../lib/constants');


export default class SettingsParameters {
  constructor(query) {
    this.query = query;
  }

  addParameters(terms) {

    return this;
  }

  end() {
    return this.query;
  }

}


