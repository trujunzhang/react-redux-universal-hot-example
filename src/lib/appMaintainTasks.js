const AppMaintainTasks = {};

AppMaintainTasks.config = {};

/**
 * First of all, submit a maintain task as submitted status.
 * Then, accept it and get started to maintain as fixing status.
 * If fixed it, set the task as fixed task.
 * Also if met other reasons, can set the task as pending task.
 * @type {number}
 */

AppMaintainTasks.config.task = {
  STATUS_PENDING: 0,
  STATUS_FIXING: 1,
  STATUS_FIXED: 2,
  STATUS_SUBMITTED: 3
};

AppMaintainTasks.config.STATUS_TASK_TITLES = [
  'pending',
  'fixing',
  'fixed',
  'submitted'
];


/**
 * The website need to check whether it is working normally now.
 *
 * @type {number}
 */
AppMaintainTasks.config.maintainedSiteStatus = {
  SITE_MAINTAIN_STATUS_PENDING: 0,
  SITE_MAINTAIN_STATUS_CHECKING: 1,
  SITE_MAINTAIN_STATUS_FIXING: 2,
  SITE_MAINTAIN_STATUS_WORKING: 3,
};

AppMaintainTasks.config.paginationOneColumn = {
  SITE_PAGINATION_STATUS_VALID: 0,
  SITE_PAGINATION_STATUS_ZERO: 1,
  SITE_PAGINATION_STATUS_INVALID: 2,
};

AppMaintainTasks.config.paginationOneColumnStyle = [
  '',
  ' red-row',
  ' black-row'
];

AppMaintainTasks.config.paginationOneRow = {
  SITE_ALL_PAGINATION_STATUS_VALID: 0,
  SITE_ALL_PAGINATION_STATUS_ZERO: 1,
  SITE_ALL_PAGINATION_STATUS_INVALID: 2,
  SITE_ALL_PAGINATION_STATUS_WORKING: 3,
  // Event
  SITE_ALL_PAGINATION_STATUS_PAGINATION_WORKING: 4,
  SITE_ALL_PAGINATION_STATUS_ALL_WORKING: 5,
};

AppMaintainTasks.config.paginationOneRowMaitainTitle = [
  'checking', // only check whether the articles are validate.
  'Fixing', // Not only checking the articles, also need to fix the pagination.
  'Invalidate', // the website's homepage can not be access now.
  'Working', // It means that list/article run normally.
  // Event
  'pagination working',// Already checked, and work normally.
  'all working',// Already checked, and work normally.
];

AppMaintainTasks.config.paginationOneRowMaitainStyle = [
  'info',
  'warning',
  'danger',
];

AppMaintainTasks.config.paginationOneRowStyle = [
  '',
  ' red-row',
  ' black-row'
];

AppMaintainTasks.getMaintainedSiteStatus = function (task, siteTag) {
  const taskKeys = Object.keys(task);
  if (taskKeys.indexOf(siteTag) === -1) {
    debugger;
  }
  const siteInstance = task[siteTag];
  const siteStatus = siteInstance.siteStatus;
  const taskStatusTitle = AppMaintainTasks.config.paginationOneRowMaitainTitle[siteStatus];
  return taskStatusTitle;
};

AppMaintainTasks.getMaintainedSiteStatusButtonStyle = function (task, siteTag) {
  const siteInstance = task[siteTag];
  const siteStatus = siteInstance.siteStatus;
  const taskStatusStyle = AppMaintainTasks.config.paginationOneRowMaitainStyle[siteStatus];
  return taskStatusStyle;
};

export default AppMaintainTasks;

