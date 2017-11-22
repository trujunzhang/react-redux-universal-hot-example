import moment from 'moment';

import AppConstants from '../lib/appConstants';
import AppMaintainTasks from '../lib/appMaintainTasks';

const CacheStatistic = {
  config: {
    tableTitleDateFormat: 'h:mm',
  }
};

CacheStatistic.getTableTitleDateString = function (date) {
  return moment(date).format(CacheStatistic.config.tableTitleDateFormat);
};

CacheStatistic.getDateQueryString = function (results) {
  const titles = [];

  results.map(({createdAt}) => {
    const dateString = CacheStatistic.getTableTitleDateString(createdAt);
    titles.push(dateString);
  });
  return titles;
};

CacheStatistic.getSiteRowStyle = function (highLightZeroRow, item, siteTag) {
  if (highLightZeroRow) {

    let rowStatus = AppMaintainTasks.config.paginationOneColumn.SITE_PAGINATION_STATUS_VALID;
    const fieldValue = item[siteTag];
    if (typeof (fieldValue) !== 'undefined') {
      if (fieldValue === 0) {
        rowStatus = AppMaintainTasks.config.paginationOneColumn.SITE_PAGINATION_STATUS_ZERO;
      }
    } else {
      rowStatus = AppMaintainTasks.config.paginationOneColumn.SITE_PAGINATION_STATUS_INVALID;
    }

    return AppMaintainTasks.config.paginationOneColumnStyle[rowStatus];
  }

  return '';
};

CacheStatistic.isSiteOneRowAllUndefined = function (results, siteTag) {
  let size = 0;
  results.map((item) => {
    if (typeof (item[siteTag]) === 'undefined') {
      size++;
    }
  });

  return size === results.length;
};

CacheStatistic.isSiteOneRowAllZero = function (results, siteTag) {
  let size = 0;
  results.map((item) => {
    if (!!item[siteTag]) {
      size += item[siteTag];
    }
  });

  return size === 0;
};

CacheStatistic.getSiteOneRowStatus = function ({results, ready}) {
  const websiteTypes = AppConstants.getCurrentSiteTags();
  const sitesStatus = {};

  websiteTypes.map((siteTag, index) => {
    const allZero = CacheStatistic.isSiteOneRowAllZero(results, siteTag);
    let rowStatus = AppMaintainTasks.config.paginationOneRow.SITE_ALL_PAGINATION_STATUS_VALID;
    if (allZero) {
      rowStatus = AppMaintainTasks.config.paginationOneRow.SITE_ALL_PAGINATION_STATUS_ZERO;
      const allUndefined = CacheStatistic.isSiteOneRowAllUndefined(results, siteTag);
      if (allUndefined) {
        rowStatus = AppMaintainTasks.config.paginationOneRow.SITE_ALL_PAGINATION_STATUS_INVALID;
      }
    }
    sitesStatus[siteTag] = rowStatus;
  });

  return sitesStatus;
};

CacheStatistic.getSiteAllRowStyle = function (highLightZeroRow, allZeroStatus, siteTag) {
  if (highLightZeroRow) {
    const status = allZeroStatus[siteTag];

    return AppMaintainTasks.config.paginationOneRowStyle[status];
  }

  return '';
};

export default CacheStatistic;
