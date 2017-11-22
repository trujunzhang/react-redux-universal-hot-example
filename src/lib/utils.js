const {isImmutable, Map, List, Stack} = require('immutable');

const token = require('crypto-token');

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
const delay = (function () {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export function convertToObject(source) {
  if (isImmutable(source)) {
    return source.toJS();
  }
  return source;
}

export function delayEvent(callback, ms) {
  delay(() => {
    callback();
  }, ms);
}

function random(max, min, exceptions) {
  max = max || 0;
  min = min || 0;
  exceptions = exceptions || [];
  var rand = Math.floor(( Math.random() * (max + 1 - min) ) + min);
  if (exceptions.indexOf(rand) === -1) {
    return rand;
  } else {
    return random(max, min, exceptions);
  }
}

export function secret(length) {
  return token(length);
}
