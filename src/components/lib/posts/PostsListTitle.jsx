import React, {Component} from 'react';

class PostsListTitle extends Component {
  onRightSortBarClick(title) {
  }

  renderRightSortBarForTodayList() {
    const items = ['Popular', 'Newest'];

    const {query} = this.props.router.location;
    const orderBy = !!query && !!query.orderby ? query.orderby : 'Popular';

    return (
      <div className="feedNavigation_49169 secondaryText_PM80d subtle_1BWOT base_3CbW2">
        {items.map((item, index) =>
          <a key={index}
             className={orderBy === item ? 'activeLink_8d28a' : ''}
             onClick={this.onRightSortBarClick.bind(this, item)}>{item}</a>
        )}
      </div>
    );
  }

  render() {
    const {dismissBanner, showClose, title} = this.props;

    return (
      <div className="header_3GFef">
              <span className="header_title">
                  <span id="posts_list_header_title"
                        className="title_38djq featured_2W7jd default_tBeAo base_3CbW2">
                      {title}
                  </span>
              </span>
        {!!showClose &&
        (<span className="close_postlist">
                            <svg width="12" height="12" viewBox="0 0 12 12">
                                <path
                                  d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
                            </svg>
                        </span>
        )
        }
      </div>
    );
  }
}

export default PostsListTitle;
