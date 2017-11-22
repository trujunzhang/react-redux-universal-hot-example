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

const {convertToObject} = require('../../lib/utils');

const _ = require('underscore');

/**
 * The states were interested in
 */
const {
  LIST_VIEW_LOADED_BY_TYPE,
  WRITE_VOTING_USERS_DONE,
} = require('../../lib/constants');

/**
 * 1. Special Task for Photos List.
 *    when the last task already fetched the total photos count.
 *    So this time need to keep the 'total' field value.
 * @param terms
 * @param lastTask
 * @returns {{id: listId, ready: boolean, totalCount: number, limit: limit,  pageIndex: (pageIndex|number), results: Array}}
 */
export function getDefaultListTask(terms, lastTask = {ready: false, results: []}) {
  const {listId, allItems, limit, pageIndex} = terms;

  return {
    id: listId,
    ready: false,
    totalCount: lastTask.totalCount || 0,
    allItems: allItems,
    limit: limit,
    pageIndex: pageIndex || 1,
    results: lastTask.results || {},
    topicsDict: lastTask.topicsDict || {}
  };
}

/**
 * Filter the taskList.
 *
 * @param listContainerTasks
 * @param listId
 * @param lastTask
 * @returns {}
 */
export function byListId(listContainerTasks, {listId}, lastTask) {
  const taskObject = convertToObject(listContainerTasks);
  let task = taskObject[listId];
  let newTask = null;
  let newResults = null;
  if (!!task) {
    const {
      taskType, results, topicsDict,
      objectSchemaName,
      votingModel
    } = task;
    switch (taskType) {
      case LIST_VIEW_LOADED_BY_TYPE:
        if (!!lastTask) { // If not first page, here need to combine to the last results dict.
          newResults = Object.assign(lastTask.results, results);
          const newTopicsDict = Object.assign(lastTask.topicsDict, topicsDict);
          newTask = Object.assign(task, {
            results: newResults,
            topicsDict: newTopicsDict,
          });

          return newTask;
        }
        return task;
      case WRITE_VOTING_USERS_DONE:
        if (!!lastTask) { // If not first page, here need to combine to the last results dict.
          if (!!votingModel) {
            const votingId = votingModel.id;
            newResults = lastTask.results;
            newResults[votingId] = votingModel;
            newTask = Object.assign(lastTask, {
              results: newResults,
            });
            return newTask;
          }
        }
    }

  }

  return lastTask;
}

export function getModelByObjectId(nextProps, forParseId: string, lastModel, payLoadKey = 'currentModel') {
  const {detailedModelsOverlay} = nextProps;
  const payLoad = detailedModelsOverlay[payLoadKey];

  if (!!payLoad) {
    const {parseId, model} = payLoad;
    if (!!parseId && parseId === forParseId) {
      return model;
    }
  }
  return lastModel;
}



