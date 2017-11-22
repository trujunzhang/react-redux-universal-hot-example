import Telescope from '../index';
import React, {PropTypes, Component} from 'react';
import Photos from '../../../lib/photos';

import {getLoggedUserMenuLink} from '../../../lib/link';
import {Link} from 'react-router';

class F8UserAvatorSection extends Component {

  renderLeftUserAvator() {
    const user = this.props.user || {};
    const sectionClass = 'user-profile_avatar';

    return (
      <div className={sectionClass}>
        <div
          className="photo-slideshow photo-slideshow--full-width photo-slideshow--rounded js-photo-slideshow-user-details">
          <div className="photo-slideshow_slide is-active">
            <div>
              <Link to={getLoggedUserMenuLink(user)} className="ordered-user-avator">

                <Telescope.components.F8PlaceHolderImage
                  key={user.username}
                  alt={user.username}
                  className="photo-box-img"
                  width="250"
                  height="250"
                  placeholderSource={'/default/user_30_square.png'}
                  source={Photos.getListThumbnailUrl(user)}/>

              </Link>

            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {sectionClass} = this.props;

    return (
      <div className={sectionClass}>
        <div className="user-profile_container">
          {this.renderLeftUserAvator()}
        </div>
      </div>
    );
  }

}


F8UserAvatorSection.propTypes = {
  sectionClass: PropTypes.string
};

F8UserAvatorSection.defaultProps = {
  sectionClass: 'ordered-user-profile'
};


export default F8UserAvatorSection;
