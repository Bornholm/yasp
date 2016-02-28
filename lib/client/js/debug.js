/* jshint browser:true */

const DEBUG_REGEX = /debug/;

function isDebug() {
  return DEBUG_REGEX.test(window.location.search);
}

export default isDebug;
