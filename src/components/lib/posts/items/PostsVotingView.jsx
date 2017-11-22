import React, {Component} from 'react';

import Posts from '../../../../lib/posts';
import Users from '../../../../lib/users';

import AppTable from '../../../../lib/appTable';

const {
  showAppOverlay,
} = require('../../../../actions');

/**
 * The states were interested in
 */
const {
  POSTS_VOTING_LIST_UPVOTE,
  POSTS_VOTING_LIST_DOWNVOTE,
  POSTS_VOTING_ARTICLE_UPVOTE,
  POSTS_VOTING_ARTICLE_DOWNVOTE,
} = require('../../../../lib/constants');

class PostsVotingView extends Component {

  constructor(props) {
    super(props);

    this.state = this.initialState = {
      fade: false
    };
    this.fadingDone = this.fadingDone.bind(this);
  }

  componentDidMount() {
    const elm = this.refs.button;
    if (!!elm) {
      elm.addEventListener('animationend', this.fadingDone);
    }
  }

  componentWillUnmount() {
    const elm = this.refs.button;
    if (!!elm) {
      elm.removeEventListener('animationend', this.fadingDone);
    }
  }

  fadingDone() {
    // will re-render component, removing the animation class
    this.setState({fade: false});
  }

  onVotingButtonClick(event) {
    event.preventDefault();

    const {voteType, post, isLoggedIn, currentUser} = this.props;

    if (isLoggedIn) {
      const elm = this.refs.button;
      if (!!elm) {
        this.setState({fade: true});
      }
      const isUpvote = Posts.isUpvotingButton(voteType);
      const hasVoting = Users.hasVoting(voteType, currentUser, post);
      this.props.onVotingButtonPress(isUpvote, hasVoting);
    } else {
      AppTable.showLoginUI(this.props, '', '', true, true);
    }

    event.stopPropagation();
  }

  render() {
    const {voteType} = this.props;

    const {fade} = this.state;
    const {post, currentUser} = this.props;

    switch (voteType) {
      case POSTS_VOTING_LIST_UPVOTE:
      case POSTS_VOTING_LIST_DOWNVOTE:
        const hasVoting = Users.hasVoting(voteType, currentUser, post);
        const containClass =
          hasVoting ?
            'button_2I1re active_2heMV smallSize_1da-r secondaryText_PM80d simpleVariant_1Nl54 button_2n20W' :
            'button_2I1re smallSize_1da-r secondaryText_PM80d simpleVariant_1Nl54 button_2n20W';
        const votingClass = hasVoting ? ' upvoted_172lX' : '';
        const fadeClass = fade ? ' animate_asuDN' : '';

        let postVoteClass = `postUpvoteArrow_2xABl${votingClass}${fadeClass}`;
        if (voteType === POSTS_VOTING_LIST_DOWNVOTE) {
          postVoteClass = `postDownvoteArrow_2xABl${votingClass}${fadeClass}`;
        }

        return (
          <button className={containClass} rel="vote-button" onClick={this.onVotingButtonClick.bind(this)}>
            <div className="buttonContainer_wTYxi">
              <div ref='button' className={postVoteClass}/>
              {Posts.votingValue(voteType, post)}
            </div>
          </button>
        );
      case POSTS_VOTING_ARTICLE_UPVOTE:
        return (
          <a onClick={this.onVotingButtonClick.bind(this)}
             className="post-vote-button v-inlined v-category-tech postVoteButton_WsFJU button_2I1re solidVariant_2wWrf mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d whiteSolidColor_18W4g">
              <span className="post-vote-button--arrow">
                  <svg width="9" height="8" viewBox="0 0 9 8">
                      <path d="M9 8H0l4.5-8L9 8z" fill="#000"/>
                  </svg>
              </span>
            <span className="post-vote-button--count">
                 {Posts.votingValue(voteType, post)}
              </span>
          </a>
        );
      case POSTS_VOTING_ARTICLE_DOWNVOTE:
        return (
          <a onClick={this.onVotingButtonClick.bind(this)}
             className="post-vote-button v-inlined v-category-tech postVoteButton_WsFJU button_2I1re solidVariant_2wWrf mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d whiteSolidColor_18W4g">
              <span className="post-vote-button--arrow">
                  <svg width="9" height="8" viewBox="0 0 9 8">
                      <path d="M9 8H0l4.5-8L9 8z" transform="scale(1,-1) translate(0,-9)" fill="#000"/>
                  </svg>
              </span>
            <span className="post-vote-button--count">
                 {Posts.votingValue(voteType, post)}
              </span>
          </a>
        );
    }

  }
}


const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    // Edit Model
    showAppOverlayAction: (object) => dispatch(showAppOverlay(object)),
  };
}

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user,
  };
}

export default connect(select, mapDispatchToProps)(PostsVotingView);


