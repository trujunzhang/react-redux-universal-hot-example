import React, {Component} from 'react';

import AppTable from '../../../../lib/appTable';

const {
  showAppOverlay,
} = require('../../../../actions');

class AppTopHero extends Component {

  constructor(props, context) {
    super(props);

    this.state = {
      showHero: AppTable.shouldShowHero(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    const showHero = AppTable.shouldShowHero(nextProps);
    this.setState({
      showHero
    });
  }

  dismissHero() {
    this.props.hideTopHeroPanel();
  }

  render() {
    const {isLoggedIn} = this.props;
    const {showHero} = this.state;

    //> 1) I want to add a feature where this block only appears if the user has not visited politicl.com before. Never show it if the user is logged in.
    //> 2) Need a small ‘x’ cross button on the top right for the user to close it.
    if (!showHero || !!isLoggedIn) {
      return null;
    }

    return (
      <div>
        <div className="hero_4c01e">
          <div className="constraintWidth_c0bbf content_58aa5" id="max-width-for-hero">

            <span className="close_hero_1JGKW" onClick={this.dismissHero.bind(this)}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
              </svg>
            </span>

            <div className="cta_ee41c">
              <span className="font_9d927 black_476ed xLarge_18016 bold_f69ef title_88ce7 top-hero-color">
                {'Understand context, not just the news.'}
              </span>
              <p className="text_44214 top-hero-color">
                {
                  'Politicl puts together high quality articles about the latest news, everyday.   ' +
                  ' It’s a place for people who want to stay intelligently informed about current affairs and have a hunger for depth. '
                }
              </p>
              <button
                onClick={(e) => AppTable.showLoginUI(this.props, '', '', true, false)}
                className="button_30e5c bigSize_8949a orangeSolidColor_1132c solidVariant_0ef4d signup_9df8f margin_top20">
                <span
                  className="font_9d927 small_231df semiBold_e201b buttonContainer_b6eb3 uppercase_a49b4">
                  {'Sign Up'}
                </span>
              </button>
            </div>
            <div className="kitty_7eed9">
              <img src="/images/ambassador-icon.png"/>
              <span id="top-hero-right-twitter">
                {/*> 7) Change “@GetPoliticl” to “#GetPoliticl” and remove the link, make the color: #0884C7 and some padding on the top.*/}
                <a className="hero_get_politicl_title">{'#GetPoliticl'}</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    showAppOverlayAction: (object) => dispatch(showAppOverlay(object)),
    hideBannerForTopHeroAction: () => dispatch(hideBannerForTopHero()),
  };
}

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user
  };
}

export default connect(select, mapDispatchToProps)(AppTopHero);


