import Telescope from '../index';
import React, {Component} from 'react';


import Posts from '../../../lib/posts';
import Topics from '../../../lib/topics';

const {
  // List Task
  loadTopicsList,
} = require('../../../actions');

const {
  byListId,
  getModelByObjectId,
  getDefaultListTask,
} = require('../../filter/filterPosts');

/**
 * The states were interested in
 */
const {
  CLOUD_STATISTIC_FOR_POSTS,
  CLOUD_EMPTY_TRASH_FOR_POSTS,
  LIST_VIEW_LOADED_BY_TYPE,
  MENU_TABLE_TYPE_POSTS,
  PARSE_POSTS,

  ALERT_TYPE_ERROR,
  ALERT_TYPE_SUCCESS,
} = require('../../../lib/constants');

import PaginationTerms from '../../../lib/paginationTerms';
import AppTable from '../../../lib/appTable';

class WidgetTopics extends Component {

  constructor(props) {
    super(props);

    const trendingListTerms = PaginationTerms.generateTermsForTopicsTrendingList(props);

    this.state = {
      trendingListTerms,
      trendingListTask: getDefaultListTask(trendingListTerms),
    };

  }

  componentWillReceiveProps(nextProps) {
    const trendingListTask = byListId(nextProps.listContainerTasks, this.state.trendingListTerms, this.state.trendingListTask);

    this.setState({
      trendingListTask,
    });
  }

  componentDidMount() {
    const {trendingListTerms, trendingListTask} = this.state;
    this.props.loadTrendingTopicsListAction(trendingListTask, trendingListTerms);
  }


  onTagClick(topic) {
    // ** Trending Topics **
    //  (Point 4 Explanation):
    //    When a person clicks tag “Demonitisation” Link: http://scruby.site/?title=Demonetisation&topicId=a387097638dc4b5946f357176a0f33a7
    //    It should open search query “Demonitisation” Link: http://scruby.site/?query=Demonitisation
    //    Because we will not be able to add “Demonitisation” tag in every articles, but all articles will have the word “Demonitisation”.

    AppTable.pushForTopic(this.props, topic);
  }


  renderMenus() {
    const {trendingListTask} = this.state;
    const {results} = trendingListTask;
    const resultsKeys = Object.keys(results);

    return (
      <div className="tags tags--postTags tags--light">
        {resultsKeys.map((id, key) => {
          const item = results[id];
          return (
            <a key={id} className="link u-baseColor--link"
               onClick={this.onTagClick.bind(this, item)}>
              {Topics.getTopicsTitle(item.name)}
            </a>
          );
        })}
      </div>
    );
  }

  render() {
    const {trendingListTask} = this.state;
    const {results, ready} = trendingListTask;
    const resultsKeys = Object.keys(results);

    if (ready && !!resultsKeys.length) {
      return (
        <div className="paddedBox_2UY-S box_transparent_c4OJj sidebarBox_1-7Yk sidebarBoxPadding_y0KxM">
          <div className="content_DcBqe">
            <Telescope.components.WidgetHeader key={'trendingHeader'} message="TRENDING"/>
            {this.renderMenus()}
          </div>
        </div>
      );
    }

    return null;
  }
}


const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    // List Task
    loadTrendingTopicsListAction: (listTask, terms) => dispatch(loadTopicsList(listTask, terms)),
  };
}

function select(store) {
  return {
    listContainerTasks: store.listContainerTasks,
    currentUser: store.user
  };
}

export default connect(select, mapDispatchToProps)(WidgetTopics);

