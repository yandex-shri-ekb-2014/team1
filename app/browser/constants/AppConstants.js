var keyMirror = require('keymirror');


module.exports = {

  ActionTypes: keyMirror({
    NEW_CITY: null,
    NEW_WEATHER: null,
    NEW_SEARCH: null,
    NEW_SUGGEST: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
