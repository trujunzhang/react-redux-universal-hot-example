import Users from '../lib/users';

let {ParseComments, ParseUsers} = require('../parse/objects');

/**
 * The states were interested in
 */
const {} = require('../lib/constants');

export default class UsersParameters {
  constructor(query) {
    this.query = query;
  }

  addParameters(terms) {
    const {s, userSlug, facebook_id} = terms;

    if (!!userSlug) {
      this.query.equalTo('slug', userSlug);
    }
    if (!!s) {
      this.query.matches('username', s, 'i');
    }
    if (!!facebook_id) {
      this.query.equalTo('facebook_id', facebook_id);
    }

    this.addStatusUsersParameter(terms);
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
        case 'username':
          if (order === 'desc') {
            this.query.descending('username');
          } else if (order === 'asc') {
            this.query.ascending('username');
          }
          break;
        case 'admin':
          if (order === 'desc') {
            this.query.descending('isAdmin');
          } else if (order === 'asc') {
            this.query.ascending('isAdmin');
          }
          break;
        case 'email':
          if (order === 'desc') {
            // this.query.descending("telescope.email")
          } else if (order === 'asc') {
            // this.query.ascending("telescope.email")
          }
          break;
      }
    }

  }


  addStatusUsersParameter(terms) {
    let loginType = terms.loginType;
    if (!!loginType) {
      switch (loginType) {
        case 'admin':
          this.query.equalTo('isAdmin', true);
          break;
        case 'facebook':
          this.query.equalTo('loginType', Users.config.TYPE_FACEBOOK);
          break;
        case 'twitter':
          this.query.equalTo('loginType', Users.config.TYPE_TWITTER);
          break;
        case 'email':
          this.query.equalTo('loginType', Users.config.TYPE_EMAIL);
          break;
        default:
          break;
      }
    }
  }

  end() {
    return this.query;
  }

}


