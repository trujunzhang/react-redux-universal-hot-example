import React from 'react';

const PostsLoadMore = ({loadMore, className = 'posts-load-more'}) => {
  return (
    <a className={className} onClick={loadMore}>Show More</a>
  );
};

export default PostsLoadMore;
