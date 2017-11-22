const _ = require('underscore');
import moment from 'moment';

const {delayEvent} = require('./utils');
import AppConstants from './appConstants';
import AppMaintainTasks from '../lib/appMaintainTasks';

const queryString = require('query-string');

/**
 * The states were interested in
 */
const {
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_SITES,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_FLAGS,
  REVIEW_LIST_TYPE_NORMAL,
  REVIEW_LIST_TYPE_USER_PROFILE_ABOUT,
  REVIEW_LIST_TYPE_USER_PROFILE_AppTable,
  // Review Sort
  REVIEW_SORT_NORMAL,
  REVIEW_SORT_NEWEST,
  REVIEW_SORT_OLDEST,
  REVIEW_SORT_HIGHEST,
  REVIEW_SORT_LOWEST,
  MODEL_FORM_TYPE_EDIT,
  MODEL_FORM_TYPE_NEW,

  // Table actions type
  TABLE_ACTIONS_TYPE_NONE,
  TABLE_ACTIONS_TYPE_EDIT,
  TABLE_ACTIONS_TYPE_MOVE_TRASH,
  TABLE_ACTIONS_TYPE_RESTORE,
  TABLE_ACTIONS_TYPE_DELETE,
  TABLE_ACTIONS_TYPE_APPROVE,
  TABLE_ACTIONS_TYPE_UNAPPROVE,
  TABLE_ACTIONS_TYPE_MAKE_AS_SPAM,
  TABLE_ACTIONS_TYPE_NOT_SPAM,


  // Comment table type
  COMMENTS_TABLE_NORMAL,
  COMMENTS_TABLE_FOR_POST,

  LOGIN_FORM_TYPE_LOGIN,
  LOGIN_FORM_TYPE_REGISTER,

  OVERLAY_TYPE_LOGIN_UI,
} = require('./constants');

const AppTable = {
  config: {}
};

/**
 *
 * @param list
 * @returns {Array}
 */
AppTable.generateEmptyAllRows = function (list) {
  let rowTableIds = [];
  if (!!list) {
    list.map(function (item, index) {
      rowTableIds.push({
        position: index,
        rowId: -1
      });
    });
  }

  return rowTableIds;
};

AppTable.generateSelectAllRows = function (tableRowIds, selectedAllRows) {
  let rowTableIds = [];
  tableRowIds.map(function (id, index) {
    rowTableIds.push({
      position: index,
      rowId: selectedAllRows ? id : -1
    });
  });
  return rowTableIds;
};


AppTable.hasSelectedRows = function (selectedTableRowIds) {
  let selectedRowCount = 0;

  selectedTableRowIds.map(function (row, index) {
    if (row.rowId !== -1) {
      selectedRowCount++;
    }
  });

  return selectedRowCount > 0;
};

AppTable.toggleSelectRow = function (selectedTableRowIds, {position, rowObjectId}) {
  const isSelected = selectedTableRowIds[position].rowId === -1;

  let nextSelectedTableRowIds = [];
  let selectedRowCount = 0;
  selectedTableRowIds.map(function (row, index) {
    let rowData = row;
    if (index === position) {
      rowData = {
        position,
        rowId: isSelected ? rowObjectId : -1
      };
    }
    nextSelectedTableRowIds.push(rowData);
    if (rowData.rowId !== -1) {
      selectedRowCount++;
    }
  });

  const nextSelectedAllRows = (selectedRowCount === selectedTableRowIds.length);
  return {
    nextSelectedTableRowIds,
    nextSelectedAllRows
  };
};

AppTable.checkAndInvokeAction = function (props) {
  const {objectSchemaName, queryStatus, actions, editModel} = props;
  const {
    // Select rows
    hasSelectedAllRows,
    currentTableRowIds,
    selectedTableRowIds,
    selectedTableSingleRowId,
    tableEditSingleRow,
    tableEditSelectedRows,
    // Table action
    tableSelectAction,
  } = editModel.form;

  switch (tableSelectAction) {
    case TABLE_ACTIONS_TYPE_NONE:
      break;
    case TABLE_ACTIONS_TYPE_EDIT:
      if (AppTable.hasSelectedRows(selectedTableRowIds)) {
        actions.setSelectedRowsActionEdit();
      }
      break;
    case TABLE_ACTIONS_TYPE_DELETE:
      break;
    case TABLE_ACTIONS_TYPE_APPROVE:
      break;
    case TABLE_ACTIONS_TYPE_UNAPPROVE:
      break;
    case TABLE_ACTIONS_TYPE_MAKE_AS_SPAM:
      break;
    case TABLE_ACTIONS_TYPE_NOT_SPAM:
      break;
  }

};

/**
 * orderby=date&order=desc
 * orderby=date&order=asc
 *
 * @param props
 * @param columnName
 */
AppTable.getCurrentColumnSortType = function (props, columnName) {
  const {location} = props;
  const {query} = location;
  const orderby = query.orderby || '';
  const order = query.order || 'desc';

  return orderby === columnName ? order : 'desc';
};

AppTable.setCurrentColumnQuerySort = function (props, columnName) {
  const {router, location} = props;
  router.push({
    pathname: location.pathname,
    query: Object.assign(location.query,
      AppTable.getCurrentColumnQuerySort(props, columnName)
    )
  });
};
AppTable.getCurrentColumnQuerySort = function (props, columnName) {
  const {location} = props;
  const {query} = location;
  const orderby = query.orderby || '';
  const order = query.order || 'desc';

  let nextOrder = 'asc';
  if (orderby === columnName) {
    nextOrder = order === 'desc' ? 'asc' : 'desc';
  }

  return {
    order: nextOrder,
    orderby: columnName,
  };
};


AppTable.getNewSearchForTable = function (props) {
  const {location} = props;

  return location.query.s || '';
};

AppTable.setNewSearchForTable = function (props, e) {
  const {router, location} = props;
  const newValue = e.target.value;

  delayEvent(function () {
    router.push({
      pathname: location.pathname,
      query: Object.assign(location.query, {'s': newValue})
    });
  }, 700);
};


AppTable.onStatisticStatusPress = function (props, objectSchemaName, newValue, key = 'status') {
  const {router, location} = props;

  const newProperty = {};
  newProperty[key] = newValue;

  if (objectSchemaName === PARSE_COMMENTS && props.commentTableType === COMMENTS_TABLE_FOR_POST) {
    router.push({pathname: location.pathname, query: Object.assign(location.query, newProperty)});
  } else {
    router.push({pathname: location.pathname, query: Object.assign({}, newProperty)});
  }

  props.actions.resetEditModel();
};

AppTable.getCommentTableType = function (props) {
  const {location} = props;
  const {query} = location;
  const postId = query.postId;

  if (Object.keys(query).indexOf('postId') === -1) {
    return COMMENTS_TABLE_NORMAL;
  }

  return COMMENTS_TABLE_FOR_POST;
};

AppTable.getSelectedRowIds = function (selectedTableRowIds) {
  let _ids = _.pluck(selectedTableRowIds, 'rowId');
  _ids = _.without(_ids, -1);
  return _ids;
};

AppTable.openNewWindow = function (pathname, query = {}) {
  let result = _.map(Object.getOwnPropertyNames(query), function (k) {
    return [k, query[k]].join('=');
  }).join('&');

  let root = AppConstants.config.politiclWeb.serverURL;
  let url = root + pathname + (result !== '' ? '?' + result : '');
  window.open(url);
};


AppTable.adjustNewQuery = function (location, newQuery) {
  const query = queryString.parse(location.search);
  if (!!query.before && !!query.after) {
    newQuery['before'] = query.before;
    newQuery['after'] = query.after;
  }
};

AppTable.pushForSourceFrom = function (props) {
  const {history, post} = props;
  const newQuery = {from: post.sourceFrom};
  history.push(
    {
      pathname: '/list',
      search: queryString.stringify(newQuery)
    }
  );
};

AppTable.getCurrentUserLeftSideSelectedMenuTag = function (props, leftSideUserMenuItems) {
  const currentPathName = props.location.pathname;
  let selectedMenu = leftSideUserMenuItems[0];
  leftSideUserMenuItems.forEach(function (menu) {
    if (currentPathName === menu.link.pathname) {
      selectedMenu = menu;
    }
  });

  return selectedMenu;
};

AppTable.pushForTopic = function (props, topic) {
  const {history, location} = props;
  const newQuery = {topicId: topic.id, query: topic.name};

  AppTable.adjustNewQuery(location, newQuery);
  history.push(
    {
      pathname: '/list',
      search: queryString.stringify(newQuery)
    }
  );
};

AppTable.pushForCalendar = function (props, dateString) {
  const {history} = props;
  history.push(
    {
      pathname: '/list',
      search: `?after=${dateString}&before=${dateString}`,
    }
  );
};

AppTable.jumpToHomePage = function (props) {
  const {history} = props;
  history.push({
    pathname: '/'
  });
};

AppTable.pushForDetailedPost = function (props, post) {
  const {history} = props;
  const hash = (+new Date).toString(36);
  history.push(
    {
      pathname: '/post',
      search: `?hash=${hash}&postId=${post.id}`,
    }
  );
};


AppTable.openNewBackgroundTab = (element, url) => {
  let eventMatchers = {
      'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
      'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
    },
    defaultOptions = {
      pointerX: 0,
      pointerY: 0,
      button: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true
    };

  function extend(destination, source) {
    for (let property in source) {
      destination[property] = source[property];
    }

    return destination;
  }

  /**
   * Trigger a HTMLEvent or MouseEvent
   * Credit: http://stackoverflow.com/a/6158050
   *
   * @private
   * @param  {HTMLElement} element     The target element
   * @param  {string}      eventName   Event type
   * @return {HTMLElement}             The target element
   */
  function DOMTrigger(element, eventName) {
    let options = extend(defaultOptions, arguments[2] || {}),
      oEvent, eventType = null,
      d = document;

    for (let name in eventMatchers) {
      if (eventMatchers[name].test(eventName)) {
        eventType = name;
        break;
      }
    }

    if (!eventType) {
      throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
    }

    if (d.createEvent) {
      oEvent = d.createEvent(eventType);
      if (eventType === 'HTMLEvents') {
        oEvent.initEvent(eventName, options.bubbles, options.cancelable);
      }
      else {
        oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, d.defaultView,
          options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
          options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, null);
      }
      oEvent = extend(oEvent, options);
      element.dispatchEvent(oEvent);
    }
    else {
      options.clientX = options.pointerX;
      options.clientY = options.pointerY;
      let evt = d.createEventObject();
      oEvent = extend(evt, options);
      element.fireEvent('on' + eventName, oEvent);
    }
    return element;
  }

  let a = document.createElement('a');
  a.href = url;
  //let evt = document.createEvent("MouseEvents");
  //the tenth parameter of initMouseEvent sets ctrl key
  //evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
  //                   true, false, false, false, 0, null);
  //a.dispatchEvent(evt);

  //DOMTrigger(a,'click');

  //let click = document.createEvent('MouseEvents');
  //click.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false,
  //false, false, 0, null);
  //a.dispatchEvent(click);

  window.open(url);
};

AppTable.pushDetailedPost = function (props, post) {


};
AppTable.showLoginUI = function (props, title = '', subtitle = '', showCloseIcon = true, signin = true) {
  const object = {
    showCloseIcon,
    title,
    subtitle,
    // formState: 'SIGNIN',
    formType: signin ? LOGIN_FORM_TYPE_LOGIN : LOGIN_FORM_TYPE_REGISTER
  };
  const model = {
    overLayType: OVERLAY_TYPE_LOGIN_UI,
    object: object,
    position: {}
  };

  props.showAppOverlayAction(model);
};

AppTable.shouldShowHero = function (props) {
  const {location} = props;
  const {pathname} = location;
  if (pathname.indexOf('/verifyemail/') !== -1) {
    return false;
  }

  if (typeof (props.showTopHero) === 'undefined') {
    return true;
  }

  return props.showTopHero;
};

AppTable.shouldShowNewsLetter = function (props) {
  return props.currentUser.showNewsLetter;
};

export default AppTable;
