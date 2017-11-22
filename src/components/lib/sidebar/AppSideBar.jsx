import Telescope from '../index';
import React, {Component} from 'react';

import moment from 'moment';

/**
 * Make day wise groups on category pages, remove calendar widget from tag and source pages
 * So calendar will only show on “Homepage” and “Category” page
 * Homepage and category pages will have day wise groups
 */
class AppSideBar extends Component {

  /**
   * A: Make day wise groups on category pages, remove calendar widget from tag and source pages
   *    So calendar will only show on “Homepage” and “Category” page
   *
   * @returns {XML}
   */
  renderWidgetCalendar() {
    return (
      <Telescope.components.WidgetCalendar selected={moment().startOf('day')}/>
    );
  }

  renderProduction() {
    if (__DEVELOPMENT__) {
      return null;
    }

    return (
      <div>
        <Telescope.components.WidgetTwitter/>
      </div>
    );
  }

  renderTrendingTopics() {
    return (
      <Telescope.components.WidgetTopics/>
    );
  }

  /**
   * Remove Download App image from sidebar
   * Sidebar widgets location -
   * 1. Trending Topics on top,
   * 2. then calendar,
   * 3. The follow us on social media,
   * 4.twitter stream and footer links
   * @returns {XML}
   */
  render() {
    const production = false;

    return (
      <div className="sidebar_Y2LGQ">

        {this.renderTrendingTopics()}
        {this.renderWidgetCalendar()}

        <Telescope.components.WidgetAppFollower/>
        {this.renderProduction()}
        <Telescope.components.WidgetAppFooter/>
      </div>
    );
  }

}

export default AppSideBar;
