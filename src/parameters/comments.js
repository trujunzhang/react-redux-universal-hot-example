const {
  getInstanceWithoutData
} = require('../parse/objects');

import moment from 'moment';
import Comments from '../lib/comments';

/**
 * The states were interested in
 */
const {
  PARSE_POSTS,
} = require('../lib/constants');

export default class CommentsParameters {
  constructor(query) {
    this.query = query;
  }

  addParameters(terms) {
    const {postId} = terms;

    if (!!postId) {
      this.query.equalTo('postId', postId);
    }

    this.addStatusCommentsParameter(terms);

    return this;
  }


  addStatusCommentsParameter(terms) {
    let queryStatus = terms.status;
    switch (queryStatus) {
      case 'publish':
        this.query.equalTo('status', Comments.config.STATUS_APPROVED);
        break;
      case 'pending':
        this.query.equalTo('status', Comments.config.STATUS_PENDING);
        break;
      case 'spam':
        this.query.equalTo('status', Comments.config.STATUS_SPAM);
        break;
      case 'trash':
        this.query.equalTo('status', Comments.config.STATUS_DELETED);
        break;
      default:
        this.query.containedIn('status', Comments.config.PUBLISH_STATUS);
        break;
    }
  }


  end() {
    return this.query;
  }

}


