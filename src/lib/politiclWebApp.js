const _ = require('underscore');
const md5 = require('blueimp-md5');
import moment from 'moment';

import AppConstants from './appConstants';

const PoliticlWebApp = {
  config: {}
};

PoliticlWebApp.getArticleLink = function (post) {
  return `${AppConstants.config.politiclWeb.serverURL}/?postId=${post.id}`;
};

PoliticlWebApp.getSourceFromLink = function (post) {
  return `${AppConstants.config.politiclWeb.serverURL}/?postId=${post.id}`;
};

export default PoliticlWebApp;
