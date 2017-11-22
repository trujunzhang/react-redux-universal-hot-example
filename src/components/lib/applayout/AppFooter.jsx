import Telescope from '../index';
import React, {Component} from 'react';
import {Link} from 'react-router';
import moment from 'moment';

import AppConstants from '../../../lib/appConstants';

class AppFooter extends Component {

  // 31/01/2017
  // Copyright © 2017 - Inkreason Enterprises Terms of Service & Privacy Policy
  render() {
    return (
      <footer className="footer_ZFfDU text_3Wjo0 subtle_1BWOT base_3CbW2">
        <p role="contentinfo">
          {'Copyright © ' + moment(new Date()).format('YYYY') + ' - Inkreason Enterprises '}
          <Link to='terms'
                className="footer_terms_of_service">
            Terms of Service
          </Link>
          {' & '}
          <Link
            to="privacy"
            className="footer_terms_of_service">
            Privacy Policy
          </Link>
        </p>
      </footer>
    );
  }
}

export default AppFooter;
