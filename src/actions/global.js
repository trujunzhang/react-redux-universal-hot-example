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

'use strict';

import type {Action, ThunkAction} from './types';

/**
 * The states were interested in
 */
const {
  SHOW_ALERT_MESSAGE,
  DISMISS_ALERT_MESSAGE,

  BANNER_HIDEN_TOP_HERO_PANEL,
  BANNER_HIDDEN_TOP_NEWSLETTER_PANEL,

  // App Overlay type
  APP_OVERLAY_SHOW_MODEL,
  APP_OVERLAY_DISMISS_MODEL,
} = require('../lib/constants');

function showAppOverlay(model) {
  return {type: APP_OVERLAY_SHOW_MODEL, payload: model};
}

function dismissAppOverlay() {
  return {type: APP_OVERLAY_DISMISS_MODEL};
}

function showAlertMessage(message: string) {
  return {type: SHOW_ALERT_MESSAGE, payload: message};
}

function hideBannerForTopHero() {
  return {type: BANNER_HIDEN_TOP_HERO_PANEL};
}

function hideBannerForTopNewsLetter() {
  return {type: BANNER_HIDDEN_TOP_NEWSLETTER_PANEL};
}

function dismissAlertMessage() {
  return {type: DISMISS_ALERT_MESSAGE};
}

async function timeout(ms: number): Promise {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

export default {
  showAppOverlay,
  dismissAppOverlay,
  hideBannerForTopHero,
  hideBannerForTopNewsLetter,
  showAlertMessage,
  dismissAlertMessage,
  timeout
};
