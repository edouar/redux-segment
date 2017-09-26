(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reduxSegment = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getAliasProperties(fields) {
  if (!fields.previousId) return ['userId', 'options'];

  return ['userId', 'previousId', 'options'];
}

function validateAliasFields(fields) {
  if (!fields.userId) return new Error('missing userId field for EventTypes.alias');

  return null;
}

function extractFields(obj, keys) {
  return keys.map(function (key) {
    return obj[key];
  });
}

function extractAliasFields(fields) {
  var props = getAliasProperties(fields);

  var err = validateAliasFields(fields);
  if (err) return err;

  return extractFields(fields, props);
}

exports.extractAliasFields = extractAliasFields;

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultClient = exports.defaultMapper = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var page = _types2.default.page;


var defaultMapper = {
  mapper: {
    '@@router/INIT_PATH': page,
    '@@router/UPDATE_PATH': page,
    '@@router/LOCATION_CHANGE': page,
    '@@reduxReactRouter/initRoutes': page,
    '@@reduxReactRouter/routerDidChange': page,
    '@@reduxReactRouter/replaceRoutes': page
  }
};

var defaultClient = function defaultClient() {
  var root = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.self === self && self || (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && global.global === global && global || undefined;

  return root.analytics;
};

exports.defaultMapper = defaultMapper;
exports.defaultClient = defaultClient;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./types":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getGroupProperties() {
  return ['groupId', 'traits', 'options'];
}

function validateGroupFields(fields) {
  if (!fields.groupId) return new Error('missing groupId field for EventTypes.alias');

  return null;
}

function extractFields(obj, keys) {
  return keys.map(function (key) {
    return key === 'traits' ? obj[key] || {} : obj[key];
  });
}

function extractGroupFields(fields) {
  var props = getGroupProperties(fields);

  var err = validateGroupFields(fields);
  if (err) return err;

  return extractFields(fields, props);
}

exports.extractGroupFields = extractGroupFields;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getIdentifyProperties(fields) {
  if (!fields.userId) return ['traits', 'options'];

  return ['userId', 'traits', 'options'];
}

function extractFields(obj, keys) {
  return keys.map(function (key) {
    return key === 'traits' ? obj[key] || {} : obj[key];
  });
}

function extractIdentifyFields(fields) {
  // all fields are optional for identify events
  if (!fields) {
    return [];
  }

  var props = getIdentifyProperties(fields);

  return extractFields(fields, props);
}

exports.extractIdentifyFields = extractIdentifyFields;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function validatePageFields(fields) {
  if (fields.category && !fields.name) {
    return new Error('missing name field for EventTypes.page');
  }

  return null;
}

function getPageProperties(fields) {
  if (fields.category) return ['category', 'name', 'properties', 'options'];
  if (!fields.name) return ['properties', 'options'];

  return ['name', 'properties', 'options'];
}

function extractFields(obj, keys) {
  return keys.map(function (key) {
    return key === 'properties' ? obj[key] || {} : obj[key];
  });
}

function extractPageFields(fields) {
  // all fields are optional for page events
  if (!fields) {
    return [];
  }

  var err = validatePageFields(fields);
  if (err) return err;

  var props = getPageProperties(fields);

  return extractFields(fields, props);
}

exports.extractPageFields = extractPageFields;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function validateTrackFields(fields, actionType) {
  if (typeof actionType !== 'string' && !fields.event) {
    return new Error('missing event field for EventTypes.track');
  }

  return null;
}

function getTrackProperties(fields) {
  if (!fields.properties) return ['event', 'options'];

  return ['event', 'properties', 'options'];
}

function extractFields(obj, keys, actionType) {
  return keys.map(function (key) {
    return key === 'event' ? obj[key] || actionType : obj[key];
  });
}

function extractTrackFields(fields, actionType) {
  var props = getTrackProperties(fields);

  var err = validateTrackFields(fields, actionType);
  if (err) return err;

  return extractFields(fields, props, actionType);
}

exports.extractTrackFields = extractTrackFields;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var EventTypes = {
  identify: 'identify',
  page: 'page',
  track: 'track',
  alias: 'alias',
  group: 'group',
  reset: 'reset'
};

exports.default = EventTypes;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventTypes = exports.createMetaReducer = exports.createTracker = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('./utils');

var _types = require('./event/types');

var _types2 = _interopRequireDefault(_types);

var _configuration = require('./event/configuration');

var _identify = require('./event/identify');

var _page = require('./event/page');

var _track = require('./event/track');

var _alias = require('./event/alias');

var _group = require('./event/group');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function emit(type, fields, _ref) {
  var client = _ref.client;

  var currentClient = client();

  if (currentClient && typeof currentClient[type] === 'function') {
    currentClient[type].apply(currentClient, _toConsumableArray(fields));
  } else {
    (0, _utils.warn)('The analytics client you provided doesn\'t support ' + type + ' events. Make sure that the anaytics.js script is loaded.');
  }
}

function createTracker() {
  var customOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = {
    mapper: _extends({}, _configuration.defaultMapper.mapper, customOptions.mapper),
    client: customOptions.client ? function () {
      return customOptions.client;
    } : _configuration.defaultClient
  };

  if (!options.client) {
    (0, _utils.warn)('Could not find an analytics client. Provide a client to' + 'createTracker or make sure that the anaytics.js script' + 'is loaded and executed before your application code.');
  }

  return function (store) {
    return function (next) {
      return function (action) {
        return handleAction(store.getState.bind(store), next, action, options);
      };
    };
  };
}

function createMetaReducer() {
  var customOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = {
    mapper: _extends({}, _configuration.defaultMapper.mapper, customOptions.mapper),
    client: customOptions.client ? function () {
      return customOptions.client;
    } : _configuration.defaultClient
  };

  if (!options.client) {
    (0, _utils.warn)('Could not find an analytics client. Provide a client to' + 'createTracker or make sure that the anaytics.js script' + 'is loaded and executed before your application code.');
  }

  return function (reducer) {
    return function (prevState, action) {

      if (action.meta && action.meta.analytics) {
        return handleReducerSpec(reducer, prevState, action, options);
      }

      if (typeof options.mapper[action.type] === 'function') {
        var getState = function getState() {
          return prevState;
        };
        var analytics = options.mapper[action.type](getState, action);

        return handleReducerSpec(reducer, prevState, appendAction(action, analytics), options);
      }

      if (typeof options.mapper[action.type] === 'string') {
        var _analytics = { eventType: options.mapper[action.type] };
        return handleReducerSpec(reducer, prevState, appendAction(action, _analytics), options);
      }

      return reducer(prevState, action);
    };
  };
}

function handleReducerSpec(reducer, prevState, action, options) {
  var spec = action.meta.analytics;

  if (Array.isArray(spec)) {
    spec.forEach(function (s) {
      return handleIndividualSpec(s, action, options);
    });
  } else {
    handleIndividualSpec(spec, action, options);
  }

  return reducer(prevState, action);
}

function appendAction(action, analytics) {

  action.meta = _extends({}, action.meta, {
    analytics: Array.isArray(analytics) ? analytics : _extends({}, analytics)
  });

  return action;
}

function handleAction(getState, next, action, options) {

  if (action.meta && action.meta.analytics) {
    return handleSpec(next, action, options);
  }

  if (typeof options.mapper[action.type] === 'function') {

    var analytics = options.mapper[action.type](getState, action);
    return handleSpec(next, appendAction(action, analytics), options);
  }

  if (typeof options.mapper[action.type] === 'string') {

    var _analytics2 = { eventType: options.mapper[action.type] };
    return handleSpec(next, appendAction(action, _analytics2), options);
  }

  return next(action);
}

function getFields(type, fields, actionType) {
  var _typeFieldHandlers;

  var typeFieldHandlers = (_typeFieldHandlers = {}, _defineProperty(_typeFieldHandlers, _types2.default.identify, _identify.extractIdentifyFields), _defineProperty(_typeFieldHandlers, _types2.default.page, _page.extractPageFields), _defineProperty(_typeFieldHandlers, _types2.default.track, function (eventFields) {
    return (0, _track.extractTrackFields)(eventFields, actionType);
  }), _defineProperty(_typeFieldHandlers, _types2.default.alias, _alias.extractAliasFields), _defineProperty(_typeFieldHandlers, _types2.default.group, _group.extractGroupFields), _defineProperty(_typeFieldHandlers, _types2.default.reset, function () {
    return [];
  }), _typeFieldHandlers);

  return typeFieldHandlers[type](fields);
}

function getEventType(spec) {
  if (typeof spec === 'string') {
    return spec;
  }

  return spec.eventType;
}

function handleIndividualSpec(spec, action, options) {
  var type = getEventType(spec);

  // In case the eventType was not specified or set to `null`, ignore this individual spec.
  if (type && type.length) {
    var fields = getFields(type, spec.eventPayload || {}, action.type);

    if (fields instanceof Error) return (0, _utils.warn)(fields);

    emit(type, fields, options);
  }
}

function handleSpec(next, action, options) {
  var spec = action.meta.analytics;

  if (Array.isArray(spec)) {
    spec.forEach(function (s) {
      return handleIndividualSpec(s, action, options);
    });
  } else {
    handleIndividualSpec(spec, action, options);
  }

  return next(action);
}

exports.createTracker = createTracker;
exports.createMetaReducer = createMetaReducer;
exports.EventTypes = _types2.default;

},{"./event/alias":2,"./event/configuration":3,"./event/group":4,"./event/identify":5,"./event/page":6,"./event/track":7,"./event/types":8,"./utils":10}],10:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warn = warn;
function warn() {
  var ENV = typeof process !== 'undefined' && process.env.NODE_ENV || 'development';

  if (ENV === 'development' || ENV === 'test') {
    var _console;

    (_console = console).warn.apply(_console, arguments);
  }
}

}).call(this,require('_process'))
},{"_process":1}]},{},[9])(9)
});