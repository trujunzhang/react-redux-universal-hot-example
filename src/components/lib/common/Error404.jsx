import React from 'react';
import {Link} from 'react-router';

const Error404 = () => {

  return (
    <div className="container u-maxWidth920 u-marginTop180 u-xs-marginTop50 u-clearfix">
      <div className="u-floatLeft ">
        <span className="svgIcon svgIcon--error404 svgIcon--120px u-textColorLighter">
          <svg className="svgIcon-use" width="120" height="120">
            <path
              d="M0 120V0h120v120H0zm54.28-51.36V63.6h-3.84V46.48H43L32.28 63.92v4.72h12.16V74h6v-5.36h3.84zM38.04 63.6l6.4-10.48V63.6h-6.4zm40.28-3.44c0-7.08-2-14.2-11-14.2S56.16 53 56.16 60.32c0 7.08 2 14.2 11 14.2s11.16-7.04 11.16-14.36zm-7 .08c0 6.88-1.16 9.48-4.08 9.48s-4.08-2.6-4.08-9.48c0-6.88 1.16-9.48 4.08-9.48s4.08 2.6 4.08 9.48zm30.84 8.4V63.6h-3.84V46.48h-7.44L80.16 63.92v4.72h12.16V74h6v-5.36h3.84zM85.92 63.6l6.4-10.48V63.6h-6.4z">
            </path>
          </svg>
        </span>
      </div>
      <div
        className="u-floatLeft u-alignMiddle u-height120 u-paddingLeft20 u-xs-paddingLeft0 js-errorMessage">
        <div className="u-alignBlock u-textColorDarker">
          <h2 className="u-uiTextBold u-fontSizeLarger u-xs-fontSizeBase">
            {'We can\'t find that page.'}
          </h2>
          <div className="u-uiTextRegular u-fontSizeBase u-textColorNormal">
            {'Use the search option or go back to our '}
            <Link className="link--underline" to="/">
              {'homepage'}
            </Link>
            {'.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;


