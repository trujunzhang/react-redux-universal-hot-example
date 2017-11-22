import Telescope from '../index';
import React, {Component} from 'react';

import moment from 'moment';
import {Link} from 'react-router';

class WidgetAppFooter extends Component {


  renderContactUS() {
    const politiclEmail = Telescope.settings.get('defaultEmail', 'contact@politicl.com');
    return (
      <li className="Footer-item">
        <Telescope.components.MailTo
          className="Footer-link"
          email={politiclEmail}
          value="Contact us"
          title="Contact to Politicl"/>
      </li>
    );
  }

  renderFooterMenus() {

    return (
      <ul className="u-cf">
        <li className="Footer-item">
          <Link className="Footer-link"
                to='about'
                title="More about Politicl">
            About
          </Link>
        </li>
        <li className="Footer-item">
          <Link className="Footer-link"
                to="careers"
                title="Read Politicl’s terms of service">
            Careers
          </Link>
        </li>

        {/*Issue #80: remove the Contact Us page.*/}
        {/* {this.renderContactUS()} */}
        <li className="Footer-item">
          <Link className="Footer-link"
                to="terms"
                title="Read Politicl’s policies's Terms of Use">
            Terms of Use
          </Link>
        </li>
        <li className="Footer-item">
          <Link className="Footer-link"
                to="privacy"
                title="Read Politicl’s policies">
            Privacy Policy
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div className="paddedBox_2UY-S box_c4OJj sidebarBox_1-7Yk sidebarBoxPadding_y0KxM"
           id="app-footer">
        <div className="Footer module roaming-module">
          <div className="flex-module">
            <div className="flex-module-inner js-items-container">
              {this.renderFooterMenus()}
              <div className="Footer-item Footer-copyright copyright">
                {'© ' + moment(new Date()).format('YYYY') + ' Politicl'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetAppFooter;
