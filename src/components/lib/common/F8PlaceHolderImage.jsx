'use strict';

import React, {Component} from 'react';

class F8PlaceHolderImage extends Component {

  constructor(...props) {
    super(...props);
    const {source, placeholderSource} = this.props;
    let current = source || placeholderSource;
    this.state = {
      source: current
    }
  }

  onLoad = () => {
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  }

  onError = () => {
    const {placeholderSource} = this.props;
    if (this.props.onError) this.props.onError();
    if (placeholderSource) {
      this.setState({source: placeholderSource});
    }
  }

  render() {
    const {source} = this.state;
    return (
      <img
        width={this.props.width}
        height={this.props.height}
        className={this.props.className}
        alt={this.props.alt}
        src={source}
        onLoad={this.onLoad.bind(this)}
        onError={this.onError.bind(this)}
      />);
  }
}

export default F8PlaceHolderImage;
