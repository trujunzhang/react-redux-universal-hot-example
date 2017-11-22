import React, {Component} from 'react';


import AppTable from '../../../../lib/appTable';

const {
  hideBannerForTopNewsLetter,
  showAppOverlay,
} = require('../../../../actions');

// https://gist.github.com/fform/0b07b4aff75da3c1cd54

class Newsletter extends Component {

  constructor(props, context) {
    super(props);
    this.state = {
      showBanner: AppTable.shouldShowNewsLetter(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    const showBanner = AppTable.shouldShowNewsLetter(nextProps);
    this.setState({
      showBanner
    });
  }

  subscribeEmail() {
    debugger;

  }

  dismissBanner(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    this.props.hideBannerForTopNewsLetterAction();
  }

  renderButton() {
    const titles = {
      'newsletter.subscribe': 'Subscribe',
      'newsletter.unsubscribe': 'Unsubscribe',
    };
    return (
      <div className="news_letter_button_panel">
        <button
          className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf">
          {titles[0]}
        </button>
      </div>
    );
  }

  renderForm() {
    const titles = {
      'newsletter.subscribe': 'Subscribe',
      'newsletter.unsubscribe': 'Unsubscribe',
    };
    return (
      <div className="form_1Nyhn">
        <div className="fieldWrap_1C8su">
          <input
            className="field_34Q-8 text_3Wjo0 subtle_1BWOT base_3CbW2"
            name="email"
            value=""
            placeholder={'Your email'}
            type="email"
          />
        </div>
        <button
          onSubmit={this.subscribeEmail.bind(this)}
          className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
          type="submit">
          {titles['newsletter.subscribe']}
        </button>
      </div>
    );
  }

  render() {
    const {showBanner} = this.state;
    if (!showBanner) {
      return null;
    }

    // 13/12/2016
    // When the user is already logged in, the message for newsletter subscription shoud be:
    // Get the best articles in your inbox every week. Subscribe to our newsletter. <subscribe button>

    const currentUser = null;
    const titles = {
      'newsletter.subscribe_prompt_logged': 'Get the best articles in your inbox every week. Subscribe to our newsletter.',
      'newsletter.subscribe_prompt_no_logged': 'Get the best articles in your inbox, weekly.',
    };
    const id = (!!currentUser ? 'newsletter.subscribe_prompt_logged' : 'newsletter.subscribe_prompt_no_logged');
    const title = titles[id];

    return (
      <div className="constraintWidth_ZyYbM hide-via-blocking-js--subscribe-to-newsletter margin-top30">
        <div className="fullWidthBox_3Dggh box_c4OJj container_R3fsF">
          <div className="content_DcBqe">
            <div className="boxContent_2e30p">

              <span className="close_1JGKW" onClick={this.dismissBanner.bind(this)}>
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path
                    d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
                </svg>
              </span>

              <span className="welcomeEmoji_3oUs1 welcome_emoji_icon"/>
              <span
                className="welcome_tPFOL boldText_3B8fa text_3Wjo0 default_tBeAo base_3CbW2">Welcome to Politicl.</span>
              <span className="tagline_1UlAa text_3Wjo0 subtle_1BWOT base_3CbW2">{title}</span>
              {currentUser ? this.renderButton() : this.renderForm()}
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
    hideBannerForTopNewsLetterAction: () => dispatch(hideBannerForTopNewsLetter()),
  };
}

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user
  };
}

export default connect(select, mapDispatchToProps)(Newsletter);


