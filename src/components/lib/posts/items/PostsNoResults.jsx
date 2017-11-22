import React, {Component} from 'react';

import AppTable from '../../../../lib/appTable';

const queryString = require('query-string');

class PostsNoResults extends Component {

  onSubmitOneClick() {
    const {currentUser} = this.context;

    if (!currentUser) {
      AppTable.showLoginUI(this.props, '', '', true, true);
    } else {
      // this.context.messages.pushRouter(this.props.router, {pathname: '/', query: {action: 'new'}});
    }
  }

  render() {
    const {location, relatedList} = this.props;

    let noMessageHint = 'No articles yet. ';
    // const _query = queryString.parse(location.search);
    const _query = {};

    if (!relatedList && !!_query.query) {
      noMessageHint = 'We didn’t find anything with that search term.';
    }
    return (
      <div className="posts-no-results">
        <div className="posts-no-results-left">{noMessageHint + ' Why not'}</div>
        <a onClick={this.onSubmitOneClick.bind(this)}>submit one</a>
        <div>?</div>
      </div>
    );
  }
}

export default PostsNoResults;
