import React, {Component} from 'react';

import AppTable from '../../../../lib/appTable';

class PostsDomain extends Component {
  // A: Remove “THE-VIEWSPAPER” from there
  // B: YES
  // A: “theviewspaper.net” on a line between the title and read more and link it to the domain page
  // B: “theviewspaper.net” on a line between the title and read more and link it to the domain page, need to add click event?
  // A: YES
  onDomainClick(evt) {
    evt.preventDefault();

    AppTable.pushForSourceFrom(this.props);

    evt.stopPropagation();
  }

  render() {
    const {post, domainClass} = this.props;
    return (
      <span className={`domain_item ${domainClass}`}>
        <span className="domain"
              onClick={this.onDomainClick.bind(this)}>
          {(post.sourceFrom ? post.sourceFrom : '').replace('www.', '')}
        </span>
      </span>
    );
  }
}

export default PostsDomain;


