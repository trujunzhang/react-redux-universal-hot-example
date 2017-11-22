const {
  ParseComments,
  ParseTopics,
  ParseSite,
  ParseUsers,
  ParseFlags
} = require('../parse/objects');

import AppConstants from '../lib/appConstants';

import Posts from '../lib/posts';
import Topics from '../lib/topics';

/**
 * The states were interested in
 */
const {
  // Parse Model Types
  PARSE_TOPICS,
} = require('../lib/constants');

export default class TopicsParameters {
  constructor(query) {
    this.query = query;
  }

  addParameters(terms) {
    const {topicsIds, s} = terms;

    if (Object.keys(terms).indexOf('active') !== -1) {
      this.query.equalTo('active', true);
    }
    if (!!topicsIds) {
      this.query.containedIn('objectId', topicsIds);
    }

    if (!!s) {
      this.query.matches('name', s, 'i');
    }

    this.addStatusTopicsParameter(terms);
    this.addSortParameter(terms);

    return this;
  }

  addSortParameter(terms) {
    // order: nextOrder,
    // orderby: columnName,
    const {order, orderby} = terms;

    if (!!orderby) {
      const order = terms.order || 'desc';

      switch (orderby) {
        case 'name':
          if (order === 'desc') {
            this.query.descending('name');
          } else if (order === 'asc') {
            this.query.ascending('name');
          }
          break;
        case 'slug':
          if (order === 'desc') {
            this.query.descending('slug');
          } else if (order === 'asc') {
            this.query.ascending('slug');
          }
          break;
      }
    } else {
      this.query.descending('active');
    }

  }

  addStatusTopicsParameter(terms) {
    const {topicStatus} = terms;
    if (!!topicStatus) {
      this.query.containedIn('status', topicStatus);
    }

    let queryStatus = terms.status;
    if (!!queryStatus) {
      switch (queryStatus) {
        case 'publish':
          this.query.equalTo('status', Topics.config.STATUS_APPROVED);
          break;
        case 'filter':
          this.query.equalTo('status', Topics.config.STATUS_FILTER);
          break;
        case 'trash':
          this.query.equalTo('status', Topics.config.STATUS_DELETED);
          break;
        default:
          this.query.containedIn('status', Topics.config.PUBLISH_STATUS);
          break;
      }
    }
  }


  end() {
    return this.query;
  }

}


