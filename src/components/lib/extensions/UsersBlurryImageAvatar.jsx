import Telescope from '../index';
import React, {PropTypes, Component} from 'react';

import Avatar from 'react-avatar';
import Users from '../../../lib/users';

class UsersBlurryImageAvatar extends Component {

  render() {
    const {size} = this.props;
    const {forUser, imageClass, showAsAvatar} = this.props;
    const title = Users.getDisplayName(forUser);
    const avatarProperty = Users.getUserAvatarProperty(forUser);

    const politiclCrawler = Users.config.politiclCrawler;
    if (politiclCrawler.id === forUser.id) {
      return (
        <div className='avatar'>
          <img id='blurry-1511054937310'
               width='32'
               height='32'
               src='https://pbs.twimg.com/profile_images/769518937251995648/j-7uKfaK_200x200.jpg'
               className='avatar-image avatar-image--icon'
               alt='Politicl'
               title='Politicl'/>
        </div>
      );
    }
    const content = (
      <Avatar  {...avatarProperty}
               alt={title}
               title={title}
               className={imageClass}
               size={size}/>
    );
    if (showAsAvatar === false) {
      return content;
    }
    return (
      <div className='avatar'>
        {content}
      </div>
    );
  }
}

UsersBlurryImageAvatar.propTypes = {
  showAsAvatar: PropTypes.bool
};

UsersBlurryImageAvatar.defaultProps = {
  showAsAvatar: true
};


export default UsersBlurryImageAvatar;
