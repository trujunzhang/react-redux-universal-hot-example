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

class PostsDay extends Component {

  constructor(props, context) {
    super(props);

    const listTitle = Posts.getDailyDateTitle(props.date);
    const terms = PaginationTerms.generateTermsForEachDayPostsList(props, listTitle, 1);

    this.state = {
      listTitle,
      objectSchemaName: PARSE_POSTS,
      currentPageIndex: 1,
      // Query
      terms,
      listTask: getDefaultListTask(terms),
    };

  }

  componentWillReceiveProps(nextProps) {
    const listTask = byListId(nextProps.listContainerTasks, this.state.terms, this.state.listTask);
    this.setState({listTask});
  }

  componentDidMount() {
    this.pageAfterHook();
  }

  pageAfterHook() {
    const {listTask, terms} = this.state;
    this.props.loadPostsListAction(listTask, terms);
  }

  loadMore() {
    const {currentPageIndex, listTask, listTitle} = this.state;
    const {ready} = listTask;

    if (!ready) {
      return;
    }

    const nextPageIndex = currentPageIndex + 1;
    const newTerms = PaginationTerms.generateTermsForEachDayPostsList(this.props, listTitle, nextPageIndex);
    const newListTask = getDefaultListTask(newTerms, listTask);
    this.setState({
      currentPageIndex: nextPageIndex,
      // Query
      terms: newTerms,
      listTask: newListTask
    });
    this.props.loadPostsListAction(newListTask, newTerms);
  }

  renderFirstLoading() {
    const message = 'All good things take time';
    return (
      <section className="results_37tfm">
        <div>
          <div className="fullWidthBox_3Dggh box_c4OJj">
            <div className="content_DcBqe">
              <Telescope.components.PostsListTitle title={this.state.listTitle}/>
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
      return this.renderDay();
    } else {
      return this.renderFirstLoading();
    }
  }

  _renderTitle() {
    return (<Telescope.components.PostsListTitle title={this.state.listTitle}/>);
  }

  _renderRows() {
    const {currentUser} = this.props;
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
      return (
        <Telescope.components.PostsLoading message={message}/>
      );
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

  renderDay() {
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

export default connect(select, mapDispatchToProps)(PostsDay);
