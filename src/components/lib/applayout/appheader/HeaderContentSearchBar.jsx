import React, {Component} from 'react';

const {delayEvent} = require('../../../../lib/utils');


class HeaderContentSearchBar extends Component {

  constructor(props) {
    super(props);
    let query = props.location.query.query;
    if (!!props.location.query.topicId) {
      query = '';
    }
    this.state = this.initialState = {
      search: query || ''
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if ((!!nextProps.location.query.topicId) || (!nextProps.location.query.query)) {
      this.setState({search: ''});
    }
  }

  search(e) {
    const input = e.target.value;
    this.setState({search: input});

    this.searchQuery(input);
  }

  searchQuery(input) {
    const router = this.props.router,
      query = input === '' ? {} : {query: input};

    this.context.messages.delayEvent(function () {
      router.push({pathname: '/', query: query});
    }, 700);
  }

  onCloseClick(e) {
    this.searchQuery('');
    this.props.onCloseClick();
  }

  renderSearchForm() {
    return (
      <div className="container_22rD3 search_2Ab6k">
        <div className="form_3Mr4A">
          <label className="text_3Wjo0 subtle_1BWOT base_3CbW2">
                      <span className="searchIcon_1kDQk">
                          <svg width="15" height="15" viewBox="0 0 15 15">
                              <path
                                d="M9.383 10.347c-.987.78-2.233 1.244-3.588 1.244C2.595 11.59 0 8.997 0 5.796 0 2.595 2.595 0 5.795 0c3.2 0 5.796 2.595 5.796 5.795 0 1.355-.464 2.6-1.243 3.588L15 14.036l-.964.964-4.653-4.653zm-3.588-.12c2.448 0 4.432-1.984 4.432-4.432 0-2.447-1.984-4.43-4.432-4.43-2.447 0-4.43 1.983-4.43 4.43 0 2.448 1.983 4.432 4.43 4.432z"
                                fill="#BBB"/>
                          </svg>
                      </span>
            <div id="header-searchbar-panel">
              <input className="input_2lFmX" name="q"
                     autoFocus
                     value={this.state.search}
                     onChange={this.search.bind(this)}
                     placeholder="Search Articles"/>
            </div>
            <button className="close_gH8kN"
                    onClick={this.onCloseClick.bind(this)}
                    type="reset">
                          <span>
                              <svg width="12" height="12" viewBox="0 0 12 12">
                                  <path
                                    d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
                              </svg>
                          </span>
            </button>
          </label>
        </div>
      </div>

    );
  }

  renderSearchBarIcon() {
    return (
      <label
        className="inputGroup u-sm-hide metabar-predictiveSearch u-baseColor--placeholderNormal  u-lineHeight30 u-height32 u-verticalAlignMiddle"
        id="header-searchbar-panel"
        title="Search Articles">
        <span
          className="svgIcon svgIcon--search svgIcon--25px u-fillTransparentBlackNormal u-baseColor--iconLight">
          <svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25">
            <path
              d="M20.067 18.933l-4.157-4.157a6 6 0 1 0-.884.884l4.157 4.157a.624.624 0 1 0 .884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"/>
          </svg>
        </span>
        <input
          className="js-predictiveSearchInput textInput textInput--rounded textInput--darkText u-baseColor--textNormal textInput--transparent  u-lineHeight30 u-height32 u-verticalAlignMiddle"
          type="search"
          value={this.state.search}
          placeholder="Search Articles"
          onChange={this.search.bind(this)}
          required="true"/>
      </label>
    );
  }

  render() {
    const {barType} = this.props;
    if (barType === 'icon') {
      return this.renderSearchBarIcon();
    }

    return this.renderSearchForm();
  }
}


export default HeaderContentSearchBar;
