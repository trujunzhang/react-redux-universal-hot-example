import React, {Component} from 'react';

import Avatar from 'react-avatar';
import Users from '../../../lib/users';

class AvatarBlurryImage extends Component {

  constructor(props) {
    super(props);
    const date = new Date().getTime();
    this.state = ({
        initialized: false,
        imageId: date.toString()
      }
    );
  }

  render() {
    const {imageId} = this.state,
      {containerClass, imageClass, imageSet, imageWidth, imageHeight, imageTitle} = this.props;

    const {user} = this.props;
    const avatarProperty = Users.getUserAvatarProperty(user);

    return (
      <div className={containerClass}>
        <Avatar  {...avatarProperty}
                 alt={imageTitle}
                 title={imageTitle}
                 className={imageClass}
                 size={imageWidth}/>
      </div>
    );
  }
}

export default AvatarBlurryImage;
