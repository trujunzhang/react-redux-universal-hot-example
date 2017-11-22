import Telescope from '../index';
import React from 'react';

const PostsListWithSidebarPage = ({}) => {

  // You can even exclude the return statement below if the entire component is
  // composed within the parentheses. Return is necessary here because some
  // variables are set above.
  return (
    <div className="constraintWidth_ZyYbM container_3aBgK">
      <div className="content_1jnXo">
        <Telescope.components.PostsList key={'postsDaily'}/>
        <Telescope.components.AppSideBar key={'appSideBar'}/>
      </div>
    </div>
  );
};


export default PostsListWithSidebarPage;
