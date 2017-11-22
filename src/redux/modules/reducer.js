import {combineReducers} from 'redux';
import multireducer from 'multireducer';
import {routerReducer} from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import auth from './auth';
import counter from './counter';
import {reducer as form} from 'redux-form';
import info from './info';
import widgets from './widgets';

export default combineReducers({
  routing: routerReducer,
  auth,
  reduxAsyncConnect,
  form,
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
  info,
  widgets,
  detailedModelsOverlay: require('./detailedModelsOverlay'),
  user: require('./user'),
  editModel: require('./editModel/editModelReducer'),
  authModel: require('./auth/authReducer'),
  userProfileTask: require('./userProfile'),
  listContainerTasks: require('./listContainerReducer'),
  appAlert: require('./alert'),
});
