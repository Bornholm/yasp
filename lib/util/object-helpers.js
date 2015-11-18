/* jshint esnext: true, node: true */
'use strict';

class ObjectHelpers {

  static pathExists(obj, path) {
    return !!(path+'').split('.').reduce((parent, childKey) => {
      if( parent === false || parent === undefined ) return false;
      if(  childKey in parent ) return parent[childKey];
    }, obj);
  }

  static getPropIfExists(obj, path, defaultValue) {
    if( ! ObjectHelpers.pathExists(obj, path) ) return defaultValue;
    return (path+'').split('.').reduce((parent, childKey) => {
      return parent[childKey];
    }, obj);
  }

  static deflaten(flatObj) {
    let obj = {};
    Object.keys(flatObj).forEach(key => {
      let fragments = key.split('.');
      let len = fragments.length;
      fragments.reduce((parent, childKey, i) => {
        if(i < len-1) {
          let node = childKey in parent ?
            parent[childKey] :
            ( parent[childKey] = {} )
          ;
          return node;
        } else {
          parent[childKey] = flatObj[key];
          return obj;
        }
      }, obj);
    });
    return obj;
  }

}

module.exports = ObjectHelpers;
