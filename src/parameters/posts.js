import moment from 'moment';

const {
  getInstanceWithoutData
} = require('../parse/objects');

import Posts from '../lib/posts';
import Topics from '../lib/topics';

/**
 * The states were interested in
 */
const {
  PARSE_POSTS,
  PARSE_USERS,

  // User Profile left menus type
  USER_PROFILE_LEFT_SIDE_UPVOTE,
  USER_PROFILE_LEFT_SIDE_DOWNVOTE,
  USER_PROFILE_LEFT_SIDE_SUBMITTED_ARTICLES,
} = require('../lib/constants');

export default class PostsParameters {
  constructor(query) {
    this.query = query;
  }

  addParameters(terms) {
    this.query.descending('createdAt');

    // order: nextOrder,
    // orderby: columnName,
    const {selfPostId, from, author, userId, link, topicId, s} = terms;
    if (!!selfPostId) {
      this.query.notContainedIn('objectId', [selfPostId]);
    }
    if (!!link) {
      this.query.equalTo('url', link);
    }
    if (!!from) {
      this.query.equalTo('sourceFrom', from);
    }
    if (!!author) {
      this.query.equalTo('author', author);
    }
    if (!!userId) {
      this.query.equalTo('userId', userId);
    }
    if (!!topicId) {
      this.query.containedIn('topics', [topicId]);
    }

    if (!!s) {
      this.query.matches('title', s, 'i');
    }

    this.addVotingParameter(terms);
    this.addDateParameter(terms);
    this.addStatusPostsParameter(terms);
    this.addSortParameter(terms);

    return this;
  }

  addVotingParameter(terms) {
    const {userProfileId, currentLeftSideMenuTag} = terms;
    if (!!userProfileId && !!currentLeftSideMenuTag) {
      const userInstanceWithoutData = getInstanceWithoutData(PARSE_USERS, userProfileId);
      switch (currentLeftSideMenuTag) {
        case USER_PROFILE_LEFT_SIDE_UPVOTE:
          this.query.containedIn('usersUpvote', [userInstanceWithoutData]);
          break;
        case USER_PROFILE_LEFT_SIDE_DOWNVOTE:
          this.query.containedIn('usersDownvote', [userInstanceWithoutData]);
          break;
        case USER_PROFILE_LEFT_SIDE_SUBMITTED_ARTICLES:
          this.query.equalTo('userId', userProfileId);
          break;
      }
    }
  }

  addDateParameter(terms) {

    let mAfter, mBefore,
      startOfDay, endOfDay,
      clientTimezoneOffset, serverTimezoneOffset,
      timeDifference;

    const {date, before, after} = terms;
    if (!!date) {
      let split = date.split('-');
      let year = split[0];
      let month = split[1];
      month = parseInt(month) - 1;
      const startDate = moment([year, month]).startOf('month');
      const endDate = moment(startDate).endOf('month');

      this.query.greaterThanOrEqualTo('postedAt', startDate.toDate());
      this.query.lessThan('postedAt', endDate.toDate());
    }

    if (!!before) {
      mBefore = moment(terms.before, 'YYYY-MM-DD');
      endOfDay = mBefore.endOf('day');

      // debugger
      this.query.lessThan('postedAt', endOfDay.toDate());
    }

    if (!!after) {
      mAfter = moment(terms.after, 'YYYY-MM-DD');
      startOfDay = mAfter.startOf('day');

      // debugger
      this.query.greaterThanOrEqualTo('postedAt', startOfDay.toDate());
    }
  }

  addSortParameter(terms) {
    // order: nextOrder,
    // orderby: columnName,
    const {order, orderby} = terms;

    if (!!orderby) {
      const order = terms.order || 'desc';

      switch (orderby) {
        case 'title':
          if (order === 'desc') {
            this.query.descending('title');
          } else if (order === 'asc') {
            this.query.ascending('title');
          }
          break;
        case 'date':
          if (order === 'desc') {
            this.query.descending('postedAt');
          } else if (order === 'asc') {
            this.query.ascending('postedAt');
          }
          break;
      }

    }

  }

  addStatusPostsParameter(terms) {
    const {postStatus} = terms;
    if (!!postStatus) {
      this.query.containedIn('status', postStatus);
    }

    let queryStatus = terms.status;
    if (!!queryStatus) {
      switch (queryStatus) {
        case 'publish':
          this.query.equalTo('status', Posts.config.STATUS_APPROVED);
          break;
        case 'pending':
          this.query.equalTo('status', Posts.config.STATUS_PENDING);
          break;
        case 'reject':
          this.query.equalTo('status', Posts.config.STATUS_REJECTED);
          break;
        case 'draft':
          this.query.equalTo('status', Posts.config.STATUS_SPAM);
          break;
        case 'trash':
          this.query.equalTo('status', Posts.config.STATUS_DELETED);
          break;
        default:
          this.query.containedIn('status', Posts.config.PUBLISH_STATUS);
          break;
      }
    }
  }

  end() {
    return this.query;
  }

}


