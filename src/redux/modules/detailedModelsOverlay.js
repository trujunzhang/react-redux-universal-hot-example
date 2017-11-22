/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */


/**
 * The states were interested in
 */
const {
  OVERLAY_LOADED_MODEL_PAGE,
  OVERLAY_LOADED_MODEL_RESET,
  STATISTIC_CLOUD_MODEL,
  RESTAURANT_CLOUD_ADDRESS_MODEL,
  // Edit Model.
  UPDATE_MODEL_REQUEST,
  WRITE_MODEL_DONE,
  // App Overlay type
  APP_OVERLAY_SHOW_MODEL,
  APP_OVERLAY_DISMISS_MODEL,
} = require('../../lib/constants');

const initialState = {
  currentModel: null,
  statistic: null,
  googleAddressReverse: null,
  overlayModel: null
};

function detailedModelsOverlay(state = initialState, action = {}) {
  const payload = action.payload;

  switch (action.type) {
    case OVERLAY_LOADED_MODEL_PAGE:
      /**
       * The following is the payload's format:
       *    1. const payload = {parseId, model}
       */
      return Object.assign({}, state, {
        currentModel: payload
      });

    /**
     * After saved the parse objects.
     * If go back to the previous detailed page.
     *
     * The detailed page can use 'currentModel' to refresh the page.
     */
    // case WRITE_MODEL_DONE:
    // const parseId = payload.parseId;
    // const model = payload.originModel
    // debugger
    // const currentModel = {parseId, model}
    // return Object.assign({}, state, {
    //   currentModel
    // })

    case STATISTIC_CLOUD_MODEL:
      return Object.assign({}, state, {
        statistic: action.payload
      });
    case RESTAURANT_CLOUD_ADDRESS_MODEL:
      return Object.assign({}, state, {
        googleAddressReverse: action.payload
      });
    /**
     * Update the current model after saved the model.
     */
    case UPDATE_MODEL_REQUEST:
      return Object.assign({}, state, {
        currentModel: action.payload
      });


    case OVERLAY_LOADED_MODEL_RESET:
      return Object.assign({}, state, {
        currentModel: null
      });

    case APP_OVERLAY_SHOW_MODEL: {
      return Object.assign({}, state, {
        overlayModel: action.payload
      });
    }
    case APP_OVERLAY_DISMISS_MODEL: {
      return Object.assign({}, state, {
        overlayModel: null
      });
    }
  }

  return state;
}

export default detailedModelsOverlay;
