import moment from 'moment';

const {
  getInstanceWithoutData
} = require('../parse/objects');

import Flags from '../lib/flags';

/**
 * The states were interested in
 */
const {
  PARSE_FLAGS,
} = require('../lib/constants');

export default class FlagsParameters {
  constructor(query) {
    this.query = query;
  }

  addParameters(terms) {
    const {s} = terms;

    if (!!s) {
      this.query.matches('reason', s, 'i');
    }

    this.addStatusFlagsParameter(terms);

    return this;
  }


  addStatusFlagsParameter(terms) {
    let queryStatus = terms.status;
    switch (queryStatus) {
      case 'publish':
        this.query.equalTo('status', Flags.config.STATUS_APPROVED);
        break;
      case 'trash':
        this.query.equalTo('status', Flags.config.STATUS_DELETED);
        break;
      default:
        this.query.containedIn('status', Flags.config.PUBLISH_STATUS);
        break;
    }
  }


  end() {
    return this.query;
  }

}


