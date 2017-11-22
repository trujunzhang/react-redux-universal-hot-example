import Telescope from '../../index';
import React, {Component} from 'react';

import $ from 'jquery';
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

  OVERLAY_TYPE_MORE_TOPICS,
  OVERLAY_TYPE_ARTICLE_SAVE_BUTTON,
} = require('../../../../lib/constants');

class PostsItemActions extends Component {

  /**
   * Rendering the post's event button, such as 'save' or 'remove'
   * @returns {XML}
   */
  renderSaveRemoveArticleButton() {
    const {currentUser} = this.context,
      {post} = this.props,
      isMobileAndPortrait = false,
      isOwnPost = false,
      type = (!!currentUser ? this.props.type : 'save'),
      event = (type === 'save') ? this.onSaveButtonClick.bind(this) : this.onRemoveButtonClick.bind(this);

    const leftIcon = (type === 'remove') ?
      (<span className="remove-button fa fa-remove"/>) :
      (<span>
          <svg className={isMobileAndPortrait ? 'margin_left4' : ''} width="13" height="10" viewBox="0 0 13 10">
            <path
              d="M9,6 L6,6 L6,7 L9,7 L9,10 L10,10 L10,7 L13,7 L13,6 L10,6 L10,3 L9,3 L9,6 Z M0,0 L8,0 L8,1 L0,1 L0,0 Z M0,3 L8,3 L8,4 L0,4 L0,3 Z M0,6 L5,6 L5,7 L0,7 L0,6 Z"
              fill="#FFF">
            </path>
          </svg>
        </span>
      );

    return (
      <span
        className="button_2I1re smallSize_1da-r secondaryText_PM80d subtleVariant_tlhj3 simpleVariant_1Nl54 button_2n20W"
        label={type}
        onClick={event}>
        <div className="buttonContainer_wTYxi">
          <span className="post-item-event-button">
            {leftIcon}
            {isMobileAndPortrait ? '' : type}
          </span>
        </div>
      </span>
    );
  }


  render() {
    const {user} = this.props; // Important: <* props.user (Maybe user is not Logged user)*>

    const {location, post} = this.props,
      admin = false,//Users.checkIsAdmin(location, user),
      showActionButtons = (!!admin || post.status === Posts.config.STATUS_APPROVED);

    if (showActionButtons) {
      return this.renderActionButtons();
    }

    return this.renderPostStatus();
  }

  renderPostStatus() {
    const {post} = this.props,
      imageSet = Posts.getThumbnailSet(post),
      panelClass = 'meta_2lIV- ' + (!!imageSet.small ? 'meta_2lIV-thumbnail' : 'meta_2lIV-no_thumbnail');

    return (
      <div className={panelClass}>
        <div className="associations_2dmvY">
          <div>
            <h2 className="heading_woLg1 title_2vHSk subtle_1BWOT base_3CbW2">
              {Posts.getPostItemStatusTitle(post.status)}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  renderActionButtons() {
    const {post} = this.props,
      imageSet = Posts.getThumbnailSet(post),
      panelClass = 'meta_2lIV- ' + (!!imageSet.small ? 'meta_2lIV-thumbnail' : 'meta_2lIV-no_thumbnail');

    return (
      <div className={panelClass} ref="saveButton">
        <div className="actionButtons_2mJsw margin_top8">
          <Telescope.components.PostsVotingView
            onVotingButtonPress={this.props.onVotingButtonPress.bind(this)}
            voteType={POSTS_VOTING_LIST_UPVOTE}
            post={post}/>
          <Telescope.components.PostsVotingView
            onVotingButtonPress={this.props.onVotingButtonPress.bind(this)}
            voteType={POSTS_VOTING_LIST_DOWNVOTE}
            post={post}/>
          <Telescope.components.PostsCommenters post={post} event={this.popupDetail.bind(this)}/>
          <div className="additionalActionButtons_BoErh">
            {this.renderSaveRemoveArticleButton()}
          </div>
        </div>

        <Telescope.components.PostsItemTopics
          post={post}
          listTask={this.props.listTask}
          onMoreTopicsClick={this.onMoreTopicsClick.bind(this)}/>

      </div>
    );
  }

  /**
   * https://politicl.com/?hash=ja0ek1lp&postId=8cc65dee368b9db3aef2dafe863f0fd9
   * @param evt
   */
  popupDetail(evt) {
    evt.preventDefault();

    const {user} = this.props; // Important: <* props.user (Maybe user is not Logged user)*>
    let {router, location, post} = this.props;

    AppTable.pushForDetailedPost(this.props, post);


    evt.stopPropagation();
  }

  onSaveButtonClick(evt) {
    evt.preventDefault();

    const {isLoggedIn} = this.props;
    if (isLoggedIn) {
      this.popoverSaveButtonClick();
    } else {
      AppTable.showLoginUI(this.props, '', '', true, true);
    }

    evt.stopPropagation();
  }

  popoverSaveButtonClick() {
    const {post} = this.props,
      isMobileAndPortrait = false;//Users.isMobileAndPortrait();

    let offset = $(this.refs.saveButton).offset();
    let top = offset.top;
    let left = offset.left + 60;
    let width = 20 + (isMobileAndPortrait ? 0 : 40);
    let height = 20;


    const model = {
      overLayType: OVERLAY_TYPE_ARTICLE_SAVE_BUTTON,
      object: {
        title: post.title,
        savedPostId: post.id
      },
      position: {
        top, left, width, height
      }
    };
    this.props.showAppOverlayAction(model);
  }

  onRemoveButtonClick(event) {
    event.preventDefault();
    const {post} = this.props;
    let {folder} = this.props;
    folder['lastPost'] = post.id;

    const modifier = {...folder, lastPost: post._id};

    const deleteFolderConfirm = 'Are you sure you want to delete this post? There is no way back. This is a path without return! Be brave?';
    if (window.confirm(deleteFolderConfirm)) {
      this.context.actions.call('folders.removePost', folder, (error, result) => {
        if (!!error) {
          this.context.messages.flash(this.context.intl.formatMessage({id: 'msg.error.folders.delete.post'}, {title: post.title}), 'error');
        }
      });
    }

    event.stopPropagation();
  }

  onMoreTopicsClick(evt, otherTopics) {
    evt.preventDefault();

    const offset = $(this.refs.saveButton).offset();
    const top = offset.top;
    const left = offset.left;
    const width = this.refs.saveButton.offsetWidth;
    const height = this.refs.saveButton.offsetHeight;


    const model = {
      overLayType: OVERLAY_TYPE_MORE_TOPICS,
      object: otherTopics,
      position: {
        top, left, width, height
      }
    };
    this.props.showAppOverlayAction(model);

    evt.stopPropagation();
  }
}

const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    showAppOverlayAction: (object) => dispatch(showAppOverlay(object)),
  };
}

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user
  };
}

export default connect(select, mapDispatchToProps)(PostsItemActions);

