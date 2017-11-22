import React from 'react';

const PostsLoading = props => {
  return (
    <div className="post_loading_same_height_as_load_more">
          <span className="loading_2hQxH featured_2W7jd subtle_1BWOT base_3CbW2">
              <div className={'post-loadmore-spinner'}>
                  <span>{props.message}</span>
                  <div className="bounce1"/>
                  <div className="bounce2"/>
                  <div className="bounce3"/>
              </div>
          </span>
    </div>
  );
};

export default PostsLoading;
