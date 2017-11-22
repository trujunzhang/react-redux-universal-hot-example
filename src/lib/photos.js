import moment from 'moment';

import Users from './users';

import {
  getLoggedUserMenuLink,
  getPhotosBrowserSelectionLink,
  geDetailedModelLink
} from './link';

const Photos = {
  config: {
    paginationCountPerPage: 6 * 5,
    // July 29, 2017
    selectedPhotoCreatedAtFormat: 'MMMM DD, YYYY'
  }
};

Photos.getThumbnailUrl = function (photo) {
  return photo.thumbnail._url;
};

Photos.getOriginalUrl = function (photo) {
  return photo.original._url;
};

Photos.getListThumbnailUrl = function (item = {}) {
  const photos = item.photos || [];

  if (photos.length > 0) {
    const firstPhoto = photos[0];
    const _thumbnail = firstPhoto.thumbnail || {};
    return _thumbnail._url || '';
  }

  return '';
};

Photos.getPhotoThumbnailByPosition = function (photos, index) {
  const firstPhoto = photos[index];
  return Photos.getThumbnailUrl(firstPhoto);
};

Photos.getPhotoItem = function (photos, modelType, forObject, index) {
  return {
    linkObject: getPhotosBrowserSelectionLink(photos[index], modelType, forObject),
    imageUrl: Photos.getPhotoThumbnailByPosition(photos, index)
  };
};

Photos.getPhotoInfoAboutUser = function (photos, index) {
  const _photo = photos[index];
  let user = Users.anonymousUser;
  if (!!_photo.owner) {
    user = _photo.owner;
  }
  return {
    userId: user.id,
    username: user.username,
    imageUrl: Photos.getListThumbnailUrl(user),
    userProfileUrl: getLoggedUserMenuLink(user)
  };
};

Photos.getPhotoItemInfo = function (photos, modelType, forObject, index) {
  const photo = photos[index];
  const photoObject = photo[photo.photoType];
  return {
    ...Photos.getPhotoItem(photos, modelType, forObject, index),
    overlay: {
      title: photoObject.displayName,
      linkUrl: geDetailedModelLink(modelType, photoObject),
      user: {
        ...Photos.getPhotoInfoAboutUser(photos, index)
      }
    }
  };
};

Photos.generateHeaderRightPhotoObject = function (props) {
  const {modelType, forObject, photosListTask} = props;
  const photos = photosListTask.results;
  const photoLength = photos.length;

  if (photoLength >= 6) {
    return {
      singleModel: false,
      total: photoLength,
      photos: [
        Photos.getPhotoItemInfo(photos, modelType, forObject, 0),
        Photos.getPhotoItemInfo(photos, modelType, forObject, 1),
      ],
      photosWall: [
        Photos.getPhotoItem(photos, modelType, forObject, 2),
        Photos.getPhotoItem(photos, modelType, forObject, 3),
        Photos.getPhotoItem(photos, modelType, forObject, 4),
        Photos.getPhotoItem(photos, modelType, forObject, 5),
      ]
    };
  } else {
    const _photos = photos.map((item, index) => {
      return Photos.getPhotoItemInfo(photos, modelType, forObject, index);
    });

    return {
      singleModel: true,
      total: photoLength,
      photos: _photos
    };
  }
};

/**
 * July 29, 2017
 * @param props
 * @returns {{createdAtFormat: string}}
 */
Photos.generateSelectedPhotoInfo = function ({photosListTask, selectPhotoIndex}) {
  const photos = photosListTask.results;
  const current = photos[selectPhotoIndex];
  return {
    ...Photos.getPhotoInfoAboutUser(photos, selectPhotoIndex),
    photoId: current.id,
    photoCreatedAtFormat: moment(current.createdAt).format(Photos.config.selectedPhotoCreatedAtFormat)
  };
};

Photos.generateScrollPhotoIndex = function (props, action, last = {}) {
  const currentIndex = (last.currentIndex || 0) + action;

  const {photoModelObject} = props;
  const {total} = photoModelObject;

  const showPhotosIndex = [];

  for (let i = 0; i < 3; i++) {
    if (currentIndex + i < total) {
      showPhotosIndex.push(currentIndex + i);
    }
  }

  return {
    haveLeftIcon: currentIndex > 0,
    haveRightIcon: currentIndex + showPhotosIndex.length < total,
    currentIndex: currentIndex,
    showPhotosIndex: showPhotosIndex
  };
};

export default Photos;
