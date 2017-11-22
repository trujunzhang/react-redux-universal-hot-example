import Users from './users';
import AppConstants from './appConstants';

const _ = require('underscore');
const slugify = require('slugify');

const {
  PAGE_MAIN_FORM,
  PAGE_MAIN_FORM_WITH_PHOTO_OVERLAY,
  PAGE_PHOTOS_BROWSER_FORM,
  PAGE_PHOTOS_BROWSER_FORM_WITH_PHOTO_OVERLAY,
  PARSE_POSTS,
  PARSE_USERS,
  PARSE_SETTINGS,
  PARSE_TOPICS,
  PARSE_SITES,
  PARSE_COMMENTS,
  PARSE_HISTORY,
  PARSE_PEOPLE_IN_EVENT,
  // 1.1 LOGGED user left menus.
  LOGGED_USER_MENU_ABOUT,
  LOGGED_USER_MENU_REVIEWS,
  LOGGED_USER_MENU_BROWSER_PHOTOS,
  LOGGED_USER_MENU_EVENTS,
  // 1.2 Edit User.
  LOGGED_USER_EDIT_FORM,
} = require('../lib/constants');

export function showDetailedPagePath(router, post) {
  const {location} = router;
  const obj = {pathname: location.pathname, query: {postId: post.id}};
  router.push(obj);
}

export function getRestaurantLink(restaurant) {
  return `/biz/${restaurant.id}/${slugify(restaurant.displayName)}`;
}

export function getEventLink(event) {
  return `/events/${event.id}/${slugify(event.displayName)}`;
}

/**
 * path: 'ordereduser/(:uid)/(:uslug)/(:eid)/(:rid)',
 *
 * @param user
 * @param peopleInEvent
 * @returns {string}
 */
export function getOrderedUserLink(user, peopleInEvent) {
  return `/ordereduser/${peopleInEvent.id}`;
}

/**
 *
 * path: 'orderedrecipe/(:oid)/(:oid)
 * @param recipe
 * @returns {string}
 */
export function getOrderedRecipeLink(recipe) {
  return `/orderedrecipe/${recipe.id}/${slugify(recipe.displayName)}`;
}

export function getEditRestaurantLink(restaurant) {
  return `/edit/biz/${restaurant.id}/${slugify(restaurant.displayName)}`;
}

export function getEditEventLink(event) {
  return `/edit/event/${event.id}/${slugify(event.displayName)}`;
}

export function getReviewsListLink({modelType, forObject}) {
  return `/reviews/${modelType}/${forObject.id}/${forObject.displayName}`;
}

export function getAddPhotoLink(modelType, model) {
  // path: 'photos/add/(:modelType)/(:forObjectId)',
  return `/photos/add/${modelType}/${model.id}`;
}

export function getEditLinkByModelType(modelType, forObject) {
  const {objectSchemaName} = AppConstants.realmObjects[modelType];
  switch (objectSchemaName) {
    case PARSE_POSTS:
      return getEditRestaurantLink(forObject);
    case PARSE_TOPICS:
      return getEditEventLink(forObject);
    case PARSE_SITES:
      return getEditRecipeLink(forObject);
  }
}

export function getEditRecipeLink(recipe) {
  return `/edit/recipe/${recipe.id}/${slugify(recipe.displayName)}`;
}

export function getNewEventLink(restaurant) {
  return `/edit/event/for/restaurant/${restaurant.id}/${slugify(restaurant.displayName)}`;
}

export function getNewReviewLink(reviewType, forObject) {
  return `/new/review/${reviewType}/${forObject.id}`;
}

export function getEditReviewLink(review) {
  const reviewType = review.reviewType;
  const forObject = review[reviewType];
  return `/edit/review/${reviewType}/${forObject.id}/${review.id}`;
}

export function getDetailedMaintainTaskLink(task) {
  return `/maintain/task/${task.id}`;
}

/**
 * No photo browser page's pageIndex:
 * http://localhost:3000/biz_photos/OnNGSfwoou/Forno%20Vecchio?select=Px63VDvuud
 *
 * Contains photo browser page's pageIndex:
 * http://localhost:3000/biz_photos/OnNGSfwoou/Forno%20Vecchio?select=Px63VDvuud && page = 1
 *
 * @param photo
 * @param photoType
 * @param forObject
 * @param props
 * @returns {string}
 */
export function getPhotosBrowserSelectionLink(photo, photoType, forObject, props = {location: {query: {}}}) {
  const {objectSchemaName} = AppConstants.realmObjects[photoType];
  const pathname = `/${AppConstants.SubDomainPhotos[objectSchemaName]}/${forObject.id}/${slugify(forObject.displayName)}`;

  const select = photo.id;
  let query = {select};

  return adjustRouterQuery({pathname, query}, props);
}

export function getPhotosBrowserLink(photoType, forObject) {
  const {objectSchemaName} = AppConstants.realmObjects[photoType];
  return `/${AppConstants.SubDomainPhotos[objectSchemaName]}/${forObject.id}/${slugify(forObject.displayName)}`;
}

export function geDetailedModelLink(modelType, forObject) {
  const {objectSchemaName} = AppConstants.realmObjects[modelType];
  switch (objectSchemaName) {
    case PARSE_POSTS:
      return getRestaurantLink(forObject);
    case PARSE_SITES:
      return getOrderedRecipeLink(forObject);
    case PARSE_USERS:
      return getLoggedUserMenuLink(forObject);
    case PARSE_TOPICS:
      return getEventLink(forObject);
  }
  throw new Error('You need to set a proper model type!');
}

export function getPhotoSelectBackLink(pageForm, photoType, forObject, props) {
  let pathname = null;
  switch (pageForm) {
    case PAGE_MAIN_FORM_WITH_PHOTO_OVERLAY:
      pathname = geDetailedModelLink(photoType, forObject);
      break;
    case PAGE_PHOTOS_BROWSER_FORM_WITH_PHOTO_OVERLAY:
      pathname = getPhotosBrowserLink(photoType, forObject);
      break;
    case LOGGED_USER_MENU_BROWSER_PHOTOS:
      pathname = getLoggedUserMenuLink({
        id: forObject.id,
        username: forObject.displayName
      }, pageForm);
      break;
    default:
      throw new Error('You need to set a page Form to get PhotoSelectBackLink!');
  }

  return adjustRouterQuery({pathname}, props);
}

export function getLoggedUserMenuLink(userProfile, menuType = LOGGED_USER_MENU_ABOUT) {
  if (!userProfile.id) {
    return null;
  }
  const row = Users.profileLeftMenus[menuType];

  switch (menuType) {
    case LOGGED_USER_MENU_ABOUT:
    case LOGGED_USER_MENU_REVIEWS:
    case LOGGED_USER_MENU_BROWSER_PHOTOS:
    case LOGGED_USER_MENU_EVENTS:
      return `/${row.path}/${userProfile.id}/${slugify(userProfile.username)}`;
    case LOGGED_USER_EDIT_FORM:
      return '/profile';
  }
}

export function getCurrentPageIndex(props) {
  if (props.location.query.page) {
    return props.location.query.page;
  }

  return '1';
}

export function adjustRouterQuery(old, {location}) {
  let oldQuery = old.query;

  const page = location.query.page;
  if (!!page) {
    oldQuery = Object.assign({}, oldQuery, {page});
  }

  const sort_by = location.query.sort_by;
  if (!!sort_by) {
    oldQuery = Object.assign({}, oldQuery, {sort_by});
  }

  return {pathname: old.pathname, query: oldQuery};
}

export function getTotalPageForPagination({listTask}, totalCount) {
  const {limit} = listTask;

  let totalPage = Math.floor(totalCount / limit);
  let moreOnePage = totalCount % limit;
  if (moreOnePage !== 0) {
    totalPage += 1;
  }
  return totalPage;
}

export function calculateTotalCount(listTask) {
  const count = listTask.totalCount;
  return (count < 0) ? '' : count;
}


export function getPostLinkWithTopic(topic) {
  return `/posts/?topicId=${topic.id}`;
}

export function getPostLinkWithUser(user) {
  return `/posts/?userId=${user.id}`;
}



