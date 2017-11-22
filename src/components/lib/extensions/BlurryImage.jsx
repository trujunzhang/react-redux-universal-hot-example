import React, {Component} from 'react';

class BlurryImage extends Component {

  render() {
    const {imageId, containerClass, imageClass, imageSet, imageTitle} = this.props,
      width = this.props.width || '100%',
      height = this.props.height || '100%';

    return (
      <div style={{width: width, height: height}}>
        <div className={containerClass} id={'panel-blurry-' + imageId}>
          <img
            id={'blurry-' + imageId}
            src={imageSet.small}
            className={imageClass}
            alt={imageTitle}
            title={imageTitle}/>
        </div>
      </div>
    );
  }

}

export default BlurryImage;
