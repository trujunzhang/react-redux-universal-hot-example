import Telescope from '../index';
import React, {Component} from 'react';

const _ = require('underscore');
const numeral = require('numeral');

import Posts from '../../../lib/posts';

const {
  timeout,
  // Edit Model
  writeOnlineParseObject,
  bulkWriteOnlineParseObjects,
  setVotingUsers,
  showAlertMessage,
  // List Task
  loadPostsList,
  invokeParseCloudMethod,
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

import AppTable from '../../../lib/appTable';
import PaginationTerms from '../../../lib/paginationTerms';


const {
  getPostsParameters,
  getTopicsParameters,
  getCommentsParameters,
  getSettingsParameters,
  getFlagsParameters,
  getUsersParameters,
  getQueryByType,
} = require('../../../parse/parseUtiles');

class PostsPopularThisWeek extends Component {

  constructor(props, context) {
    super(props);

    const terms = PaginationTerms.generateTermsForPopularThisWeekPostsList(props, 1);

    this.state = {
      listTitle: 'Popular this week',
      objectSchemaName: PARSE_POSTS,
      currentPageIndex: 1,
      // Query
      terms: terms,
      listTask: getDefaultListTask(terms),
    };
  }

  componentWillReceiveProps(nextProps) {
    const listTask = byListId(nextProps.listContainerTasks, this.state.terms, this.state.listTask);
    this.setState({listTask,});
  }

  componentDidMount() {
    this.pageAfterHook();
  }

  async pageAfterHook() {
    const {listTask, terms} = this.state;
    this.props.loadPostsListAction(listTask, terms);
  }

  loadMore() {
    const {currentPageIndex, listTask} = this.state;
    const {ready} = listTask;

    if (!ready) {
      return;
    }

    const nextPageIndex = currentPageIndex + 1;
    const newTerms = PaginationTerms.generateTermsForPopularThisWeekPostsList(this.props, nextPageIndex);
    const newListTask = getDefaultListTask(newTerms, listTask);
    this.setState({
      currentPageIndex: nextPageIndex,
      // Query
      terms: newTerms,
      listTask: newListTask
    });
    this.props.loadPostsListAction(newListTask, newTerms);
  }

  dismissBanner(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

  }

  renderFirstLoading() {
    const message = 'All good things take time';

    return (
      <section className="results_37tfm">
        <div>
          <div className="fullWidthBox_3Dggh box_c4OJj">
            <div className="content_DcBqe">
              <Telescope.components.PostsListTitle
                title={this.state.listTitle}
                showClose={true}
                dismissBanner={this.dismissBanner}
              />
            </div>
          </div>
        </div>
        <Telescope.components.PostsLoading message={message}/>
      </section>
    );
  }

  render() {
    const {listTask} = this.state;
    const {ready, results} = listTask;

    if (!!ready && Object.keys(results).length === 0) {
      return this._renderEmpty();
    }
    else if (!!ready || Object.keys(results).length > 0) {
      return this.renderPopularThisWeek();
    } else {
      return this.renderFirstLoading();
    }
  }

  _renderTitle() {
    return (
      <Telescope.components.PostsListTitle
        title={this.state.listTitle}
        showClose={true}
        dismissBanner={this.dismissBanner}
      />
    );
  }

  _renderRows() {
    const {listTask, terms} = this.state;
    const {ready, results, totalCount} = listTask;
    const resultsKeys = Object.keys(results);
    return (
      <div>
        <ul className="postsList_3n2Ck">
          {resultsKeys.map((key, index) => {
              const post = results[key];
              return (
                <Telescope.components.PostsItem key={key}
                                                pageAfterHook={this.pageAfterHook.bind(this)}
                                                votingTerms={terms}
                                                post={post}
                                                user={null}
                                                type="save"
                                                canEdit={false}
                                                listTask={listTask}
                />
              );
            }
          )}
        </ul>
      </div>
    );
  }

  _renderLoadMore() {
    const {listTask} = this.state;
    const {ready, results, totalCount} = listTask;
    const resultsKeys = Object.keys(results);
    const hasMore = resultsKeys.length !== totalCount;

    if (hasMore && ready) {
      return (<Telescope.components.PostsLoadMore loadMore={this.loadMore.bind(this)}/>);
    }

    return null;
  }

  _renderLoading() {
    const message = 'All good things take time';
    const {listTask} = this.state;
    const {ready, results, totalCount} = listTask;
    const resultsKeys = Object.keys(results);
    const hasMore = resultsKeys.length !== totalCount;

    if (hasMore && !ready) {
      return (<Telescope.components.PostsLoading message={message}/>);
    }

    return null;
  }

  _renderEmpty() {
    return (
      <section className="results_37tfm">
        <div>
          <div className="fullWidthBox_3Dggh box_c4OJj">
            <div className="content_DcBqe">
              {this._renderTitle()}
            </div>
          </div>
        </div>
        <Telescope.components.PostsNoResults relatedList={false}/>
      </section>
    );
  }

  renderPopularThisWeek() {
    return (
      <div className="posts-day">
        <section className="results_37tfm">
          <div>
            <div className="fullWidthBox_3Dggh box_c4OJj">
              <div className="content_DcBqe">
                {this._renderTitle()}
                {this._renderRows()}
              </div>
              {this._renderLoadMore()}
            </div>
          </div>
          {this._renderLoading()}
        </section>
      </div>
    );
  }

}

const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    // List Task
    loadPostsListAction: (listTask, terms) => dispatch(loadPostsList(listTask, terms)),
  };
}

function select(store) {
  return {
    listContainerTasks: store.listContainerTasks,
    currentUser: store.user
  };
}

export default connect(select, mapDispatchToProps)(PostsPopularThisWeek);
