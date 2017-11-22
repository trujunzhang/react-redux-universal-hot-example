import Telescope from '../index';
import React, {PropTypes, Component} from 'react';

import Waypoint from 'react-waypoint';

const _ = require('underscore');
import moment from 'moment';

class PostsDaily extends Component {

  constructor(props) {
    super(props);

    const showPopularPostsThisWeek = true;

    this.state = {days: props.days, showPopularPostsThisWeek: showPopularPostsThisWeek};
  }

  // for a number of days "n" return dates object for the past n days
  getLastNDates(n) {
    let map = _.range(n).map(
      i => moment().subtract(i, 'days').startOf('day').toDate()
    );
    return map;
  }

  loadMoreDays() {
    this.setState({
      days: this.state.days + this.props.increment
    });
  }

  _renderLoadMore() {
    return (
      <Waypoint onEnter={this.loadMoreDays.bind(this)}>
        <div>
          <a className="posts-load-more-days"
             onClick={this.loadMoreDays.bind(this)}>
            {'Load More Days'}
          </a>
        </div>
      </Waypoint>
    );
  }

  render() {
    const postsDays = [];
    if (this.state.showPopularPostsThisWeek) {
      postsDays.push(
        <Telescope.components.PostsPopularThisWeek
          key={'popularThisWeek'}
        />
      );
    }
    const days = this.getLastNDates(this.state.days);
    days.map((date, index) => {
      postsDays.push(
        <Telescope.components.PostsDay key={index}
                                       date={date}
                                       number={index}/>
      );
    });

    return (
      <section className="results_37tfm">
        <div>
          {postsDays}
          {this._renderLoadMore()}
        </div>
      </section>
    );
  }
}

PostsDaily.propTypes = {
  days: PropTypes.number,
  increment: PropTypes.number
};

PostsDaily.defaultProps = {
  days: 3,
  increment: 3
};

export default PostsDaily;
