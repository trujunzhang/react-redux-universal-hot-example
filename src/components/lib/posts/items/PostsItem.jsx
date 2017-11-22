import Telescope from '../../index';
import React, {Component} from 'react';

import AppTable from '../../../../lib/appTable';

const _ = require('underscore');

import Posts from '../../../../lib/posts';
import Users from '../../../../lib/users';


/**
 * The states were interested in
 */
const {
  POSTS_VOTING_LIST_UPVOTE,
  POSTS_VOTING_LIST_DOWNVOTE,
  POSTS_VOTING_ARTICLE_UPVOTE,
  POSTS_VOTING_ARTICLE_DOWNVOTE,

  // Voting views type
  VOTING_POSTS_LIST_ITEM,
  VOTING_ARTICLE_HEADER_ITEM,
  VOTING_RELATED_POSTS_LIST_ITEM,
} = require('../../../../lib/constants');

class PostsItem extends Component {
  // A: Title + Image should open the “Read More” link - link to the original article
  // B: Title + Image in post list is like in post detail. click them will open original url?
  // A: YES

  renderContent(showActionButtons) {
    const {post} = this.props;
    return (
      <div className={'row ' + (showActionButtons ? 'posts_content row_margin_bottom30' : '')}>
        <div>
          <span onClick={this.onReadMoreClick.bind(this)}
                className="title_2p9fd featured_2W7jd default_tBeAo base_3CbW2 post-title">
            {post.title}
          </span>
          <Telescope.components.PostsDomain post={post} domainClass=""/>
        </div>

        <div className="post_description post_description_p"
             onClick={this.onReadMoreClick.bind(this)}>
          {Posts.getLimitedContent(post.body, 150)}
        </div>

        <Telescope.components.PostsVotingContainer
          {...this.props}
          voteContainerType={VOTING_POSTS_LIST_ITEM}
        />

      </div>
    );
  }

  renderThumbnail() {
    const {post} = this.props,
      imageSet = Posts.getThumbnailSet(post);

    if (imageSet.small) {
      return (
        <div className="post-thumbnail thumbnail_JX64A post-left-thumbnail">
          <div onClick={this.onReadMoreClick.bind(this)}
               className="container_22rD3 post-list-thumbnail">
            <Telescope.components.BlurryImage
              imageId={post.id + '-thumbnail'}
              containerClass={'container__Ql6q lazyLoadContainer_3KgZD'}
              imageClass={'post-list-thumbnail'}
              imageSet={imageSet}
              imageTitle={post.title}
            />
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    // const {user} = this.props; // Important: <* props.user (Maybe user is not Logged user)*>
    const user = null; // Important: <* props.user (Maybe user is not Logged user)*>

    const {location, post} = this.props,
      admin = false,//Users.checkIsAdmin(location, user),
      showActionButtons = (!!admin || post.status === Posts.config.STATUS_APPROVED),
      postCanEdit = !!admin;

    const itemDisabled = post.status !== Posts.config.STATUS_APPROVED;

    return (
      <li className='postItem_block'>
        <div disabled={itemDisabled} className="postItem_2pV9v">
          <a className="link_3fUGJ" onClick={this.onReadMoreClick.bind(this)}>
            {this.renderThumbnail()}
            {this.renderContent(showActionButtons)}
          </a>
        </div>
      </li>
    );
  }

  onReadMoreClick(evt) {
    evt.preventDefault();

    AppTable.openNewBackgroundTab(evt.target, this.props.post.url);

    evt.stopPropagation();
  }

  popupDetail(evt) {
    evt.preventDefault();

    const {user} = this.props; // Important: <* props.user (Maybe user is not Logged user)*>
    const {router, post, location} = this.props;
    if (post.status === Posts.config.STATUS_APPROVED) {
      this.context.messages.pushRouterForDetailPage(router, post, Users.checkIsAdmin(location, user));
    }

    evt.stopPropagation();
  }

}

export default PostsItem;
