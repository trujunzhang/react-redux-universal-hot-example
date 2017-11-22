import Telescope from '../index';
import React, {Component} from 'react';

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
  PARSE_POSTS,
  ALERT_TYPE_ERROR,
  ALERT_TYPE_SUCCESS,

  POSTS_VOTING_LIST_UPVOTE,
  POSTS_VOTING_LIST_DOWNVOTE,
  POSTS_VOTING_ARTICLE_UPVOTE,
  POSTS_VOTING_ARTICLE_DOWNVOTE,

  // Voting views type
  VOTING_POSTS_LIST_ITEM,
  VOTING_ARTICLE_HEADER_ITEM,
  VOTING_RELATED_POSTS_LIST_ITEM,

  // Voting action type
  VOTING_FOR_UPVOTE,
  VOTING_FOR_DOWNVOTE,
} = require('../../../lib/constants');

class PostsVotingContainer extends Component {

  constructor(props) {
    super(props);
  }

  async onVotingButtonPress(isUpvote, hasVoting) {
    const {currentUser, post, votingTerms, pageAfterHook} = this.props;
    const {setVotingUsersAction, showAlertMessageAction} = this.props;

    let errorMessage = null;
    const _object = {
      objectSchemaName: PARSE_POSTS,
      listId: votingTerms.listId,
      userId: currentUser.id,
      parseId: post.id,
      tableSelectAction: isUpvote ? VOTING_FOR_UPVOTE : VOTING_FOR_DOWNVOTE,
      hasVoting
    };

    try {
      await Promise.race([
        setVotingUsersAction(_object),
        timeout(15000)]);
    } catch (e) {
      const message = e.message || e;
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        errorMessage = message;
        showAlertMessageAction({type: ALERT_TYPE_ERROR, text: errorMessage});
      }
    } finally {
      if (!!errorMessage) {
      } else {
      }
    }
  }

  render() {
    const {voteContainerType} = this.props;

    switch (voteContainerType) {
      case VOTING_POSTS_LIST_ITEM:
        return (
          <Telescope.components.PostsItemActions
            onVotingButtonPress={this.onVotingButtonPress.bind(this)}
            {...this.props}/>
        );
      case VOTING_ARTICLE_HEADER_ITEM:
        return (
          <Telescope.components.PostsSingleHeader
            onVotingButtonPress={this.onVotingButtonPress.bind(this)}
            {...this.props}/>
        );
      case VOTING_RELATED_POSTS_LIST_ITEM:
        return (
          <Telescope.components.PostsRelatedActionItem
            onVotingButtonPress={this.onVotingButtonPress.bind(this)}
            {...this.props}/>
        );
    }
  }

}


const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    // Edit Model
    setVotingUsersAction: (object) => dispatch(setVotingUsers(object)),
    showAlertMessageAction: (object) => dispatch(showAlertMessage(object)),
  };
}

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user,
  };
}

export default connect(select, mapDispatchToProps)(PostsVotingContainer);


