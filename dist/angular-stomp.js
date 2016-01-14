"format global";
"globals.Stomp stompjs";
"globals.angular angular";
(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  var getOwnPropertyDescriptor = true;
  try {
    Object.getOwnPropertyDescriptor({ a: 0 }, 'a');
  }
  catch(e) {
    getOwnPropertyDescriptor = false;
  }

  var defineProperty;
  (function () {
    try {
      if (!!Object.defineProperty({}, 'a', {}))
        defineProperty = Object.defineProperty;
    }
    catch (e) {
      defineProperty = function(obj, prop, opt) {
        try {
          obj[prop] = opt.value || opt.get.call(obj);
        }
        catch(e) {}
      }
    }
  })();

  function register(name, deps, declare) {
    if (arguments.length === 4)
      return registerDynamic.apply(this, arguments);
    doRegister(name, {
      declarative: true,
      deps: deps,
      declare: declare
    });
  }

  function registerDynamic(name, deps, executingRequire, execute) {
    doRegister(name, {
      declarative: false,
      deps: deps,
      executingRequire: executingRequire,
      execute: execute
    });
  }

  function doRegister(name, entry) {
    entry.name = name;

    // we never overwrite an existing define
    if (!(name in defined))
      defined[name] = entry;

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }


  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];

      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;

      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {

        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative; 
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;

      if (typeof name == 'object') {
        for (var p in name)
          exports[p] = name[p];
      }
      else {
        exports[name] = value;
      }

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          for (var j = 0; j < importerModule.dependencies.length; ++j) {
            if (importerModule.dependencies[j] === module) {
              importerModule.setters[j](exports);
            }
          }
        }
      }

      module.locked = false;
      return value;
    });

    module.setters = declaration.setters;
    module.execute = declaration.execute;

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        depExports = depEntry.esModule;
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);

      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);

    if (output)
      module.exports = output;

    // create the esModule object, which allows ES6 named imports of dynamics
    exports = module.exports;
 
    if (exports && exports.__esModule) {
      entry.esModule = exports;
    }
    else {
      entry.esModule = {};
      
      // don't trigger getters/setters in environments that support them
      if ((typeof exports == 'object' || typeof exports == 'function') && exports !== global) {
        if (getOwnPropertyDescriptor) {
          var d;
          for (var p in exports)
            if (d = Object.getOwnPropertyDescriptor(exports, p))
              defineProperty(entry.esModule, p, d);
        }
        else {
          var hasOwnProperty = exports && exports.hasOwnProperty;
          for (var p in exports) {
            if (!hasOwnProperty || exports.hasOwnProperty(p))
              entry.esModule[p] = exports[p];
          }
         }
       }
      entry.esModule['default'] = exports;
      defineProperty(entry.esModule, '__useDefault', {
        value: true
      });
    }
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right 
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (!entry || entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    // node core modules
    if (name.substr(0, 6) == '@node/')
      return require(name.substr(6));

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its 
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    // exported modules get __esModule defined for interop
    if (entry.declarative)
      defineProperty(entry.module.exports, '__esModule', { value: true });

    // return the defined module object
    return modules[name] = entry.declarative ? entry.module.exports : entry.esModule;
  };

  return function(mains, depNames, declare) {
    return function(formatDetect) {
      formatDetect(function(deps) {
        var System = {
          _nodeRequire: typeof require != 'undefined' && require.resolve && typeof process != 'undefined' && require,
          register: register,
          registerDynamic: registerDynamic,
          get: load, 
          set: function(name, module) {
            modules[name] = module; 
          },
          newModule: function(module) {
            return module;
          }
        };
        System.set('@empty', {});

        // register external dependencies
        for (var i = 0; i < depNames.length; i++) (function(depName, dep) {
          if (dep && dep.__esModule)
            System.register(depName, [], function(_export) {
              return {
                setters: [],
                execute: function() {
                  for (var p in dep)
                    if (p != '__esModule' && !(typeof p == 'object' && p + '' == 'Module'))
                      _export(p, dep[p]);
                }
              };
            });
          else
            System.registerDynamic(depName, [], false, function() {
              return dep;
            });
        })(depNames[i], arguments[i]);

        // register modules in this bundle
        declare(System);

        // load mains
        var firstLoad = load(mains[0]);
        if (mains.length > 1)
          for (var i = 1; i < mains.length; i++)
            load(mains[i]);

        if (firstLoad.__useDefault)
          return firstLoad['default'];
        else
          return firstLoad;
      });
    };
  };

})(typeof self != 'undefined' ? self : global)
/* (['mainModule'], ['external-dep'], function($__System) {
  System.register(...);
})
(function(factory) {
  if (typeof define && define.amd)
    define(['external-dep'], factory);
  // etc UMD / module pattern
})*/

(['1'], ["7","c","7"], function($__System) {

$__System.register("2", ["3", "4"], function (_export) {
    var _createClass, _classCallCheck, Unsubscriber;

    return {
        setters: [function (_) {
            _createClass = _["default"];
        }, function (_2) {
            _classCallCheck = _2["default"];
        }],
        execute: function () {
            /**
             * Created by kevin on 10/01/2016.
             */

            "use strict";

            Unsubscriber = (function () {
                function Unsubscriber(ngStomp, connections) {
                    _classCallCheck(this, Unsubscriber);

                    this.ngStomp = ngStomp;
                    this.connections = connections;
                }

                _createClass(Unsubscriber, [{
                    key: "unSubscribeAll",
                    value: function unSubscribeAll() {
                        var _this = this;

                        this.connections.forEach(function (c) {
                            return _this.$$unSubscribeOf(c);
                        });
                        this.connections = [];
                    }
                }, {
                    key: "unSubscribeOf",
                    value: function unSubscribeOf(topic) {
                        var _this2 = this;

                        this.connections.filter(function (c) {
                            return c.queue === topic;
                        }).forEach(function (c) {
                            return _this2.$$unSubscribeOf(c);
                        });

                        this.connections = this.connections.filter(function (c) {
                            return c.queue !== topic;
                        });
                    }
                }, {
                    key: "unSubscribeNth",
                    value: function unSubscribeNth(number) {
                        this.$$unSubscribeOf(this.connections[number]);
                        this.connections.splice(number - 1, 1);
                    }
                }, {
                    key: "$$unSubscribeOf",
                    value: function $$unSubscribeOf(c) {
                        this.ngStomp.$$unSubscribeOf({ queue: c.topic, callback: c.callback, header: c.headers, scope: c.scope });
                    }
                }]);

                return Unsubscriber;
            })();

            _export("default", Unsubscriber);
        }
    };
});
$__System.register('5', ['2', '3', '4'], function (_export) {
    var Unsubscriber, _createClass, _classCallCheck, SubscribeBuilder;

    return {
        setters: [function (_3) {
            Unsubscriber = _3['default'];
        }, function (_) {
            _createClass = _['default'];
        }, function (_2) {
            _classCallCheck = _2['default'];
        }],
        execute: function () {
            /**
             * Created by kevin on 14/12/2015.
             */
            'use strict';

            SubscribeBuilder = (function () {

                /*@ngNoInject*/

                function SubscribeBuilder(ngStomp, topic) {
                    _classCallCheck(this, SubscribeBuilder);

                    this.ngStomp = ngStomp;
                    this.connections = [];

                    this.subscribeTo(topic);
                }

                _createClass(SubscribeBuilder, [{
                    key: 'callback',
                    value: function callback(aCallback) {
                        this.aCallback = aCallback;
                        return this;
                    }
                }, {
                    key: 'withHeaders',
                    value: function withHeaders(headers) {
                        this.headers = headers;
                        return this;
                    }
                }, {
                    key: 'bindTo',
                    value: function bindTo(aScope) {
                        this.scope = aScope;
                        return this;
                    }
                }, {
                    key: 'withBodyInJson',
                    value: function withBodyInJson() {
                        this.json = true;
                        return this;
                    }
                }, {
                    key: 'build',
                    value: function build() {
                        return this.connect();
                    }
                }, {
                    key: 'subscribeTo',
                    value: function subscribeTo(topic) {
                        this.topic = topic;
                        this.aCallback = angular.noop;
                        this.headers = {};
                        this.scope = {};
                        this.json = false;

                        return this;
                    }
                }, {
                    key: 'connect',
                    value: function connect() {
                        var _this = this;

                        this.and();
                        this.connections.forEach(function (c) {
                            return _this.ngStomp.subscribe(c.topic, c.callback, c.headers, c.scope, c.json);
                        });
                        return new Unsubscriber(this.ngStomp, this.connections);
                    }
                }, {
                    key: 'and',
                    value: function and() {
                        this.connections.push({ topic: this.topic, callback: this.aCallback, headers: this.headers, scope: this.scope, json: this.json });
                        return this;
                    }
                }]);

                return SubscribeBuilder;
            })();

            _export('default', SubscribeBuilder);
        }
    };
});
$__System.register('6', ['3', '4', '5', '7'], function (_export) {
    var _createClass, _classCallCheck, SubscribeBuilder, angular, ngStompWebSocket;

    return {
        setters: [function (_) {
            _createClass = _['default'];
        }, function (_2) {
            _classCallCheck = _2['default'];
        }, function (_3) {
            SubscribeBuilder = _3['default'];
        }, function (_4) {
            angular = _4['default'];
        }],
        execute: function () {
            /**
             * Created by kevin on 14/12/2015.
             */
            'use strict';

            ngStompWebSocket = (function () {

                /*@ngNoInject*/

                function ngStompWebSocket(settings, $q, $log, $rootScope, $timeout, Stomp) {
                    _classCallCheck(this, ngStompWebSocket);

                    this.settings = settings;
                    this.$q = $q;
                    this.$rootScope = $rootScope;
                    this.$log = $log;
                    this.Stomp = Stomp;
                    this.$timeout = $timeout;
                    this.connections = [];

                    this.connect();
                }

                _createClass(ngStompWebSocket, [{
                    key: 'connect',
                    value: function connect() {
                        var _this = this;

                        this.$setConnection();
                        this.stompClient.connect(this.settings.login, this.settings.password, function () {
                            _this.deferred.resolve();
                            _this.$digestStompAction();
                        }, function () {
                            _this.$timeout(function () {
                                _this.connect();
                                _this.$reconnectAll();
                            }, _this.settings.timeOut);
                        }, this.settings.vhost);
                        return this.promiseResult;
                    }
                }, {
                    key: 'subscribe',
                    value: function subscribe(url, callback, header, scope) {
                        if (header === undefined) header = {};

                        var _this2 = this;

                        var bodyInJson = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

                        this.promiseResult.then(function () {
                            _this2.$stompSubscribe(url, callback, header, scope, bodyInJson);
                        });
                        return this;
                    }
                }, {
                    key: 'subscribeTo',
                    value: function subscribeTo(topic) {
                        return new SubscribeBuilder(this, topic);
                    }

                    /* Deprecated */
                }, {
                    key: 'unsubscribe',
                    value: function unsubscribe(url) {
                        var _this3 = this;

                        this.promiseResult.then(function () {
                            return _this3.$stompUnSubscribe(url);
                        });
                        return this;
                    }
                }, {
                    key: 'send',
                    value: function send(queue, data) {
                        var _this4 = this;

                        var header = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                        var sendDeffered = this.$q.defer();

                        this.promiseResult.then(function () {
                            _this4.stompClient.send(queue, header, JSON.stringify(data));
                            sendDeffered.resolve();
                        });

                        return sendDeffered.promise;
                    }
                }, {
                    key: 'disconnect',
                    value: function disconnect() {
                        var _this5 = this;

                        var disconnectionPromise = this.$q.defer();
                        this.stompClient.disconnect(function () {
                            disconnectionPromise.resolve();
                            _this5.$digestStompAction();
                        });

                        return disconnectionPromise.promise;
                    }
                }, {
                    key: '$stompSubscribe',
                    value: function $stompSubscribe(queue, callback, header, scope, bodyInJson) {
                        var _this6 = this;

                        var subscription = this.stompClient.subscribe(queue, function (message) {
                            if (bodyInJson) message.body = JSON.parse(message.body);
                            callback(message);
                            _this6.$digestStompAction();
                        }, header);

                        var connection = { queue: queue, sub: subscription, callback: callback, header: header, scope: scope, json: bodyInJson };
                        this.$$addToConnectionQueue(connection);
                        this.$unRegisterScopeOnDestroy(connection);
                    }
                }, {
                    key: '$stompUnSubscribe',
                    value: function $stompUnSubscribe(queue) {
                        this.connections.filter(function (c) {
                            return c.queue === queue;
                        }).forEach(function (c) {
                            return c.sub.unsubscribe();
                        });

                        this.connections = this.connections.filter(function (c) {
                            return c.queue != queue;
                        });
                    }
                }, {
                    key: '$digestStompAction',
                    value: function $digestStompAction() {
                        !this.$rootScope.$$phase && this.$rootScope.$apply();
                    }
                }, {
                    key: '$setConnection',
                    value: function $setConnection() {
                        this.stompClient = this.settings['class'] ? this.Stomp.over(new this.settings['class'](this.settings.url)) : this.Stomp.client(this.settings.url);
                        this.stompClient.debug = this.settings.debug ? this.$log.debug : angular.noop;
                        if (angular.isDefined(this.settings.heartbeat)) {
                            this.stompClient.heartbeat.outgoing = this.settings.heartbeat.outgoing;
                            this.stompClient.heartbeat.incoming = this.settings.heartbeat.incoming;
                        }
                        this.deferred = this.$q.defer();
                        this.promiseResult = this.deferred.promise;
                    }
                }, {
                    key: '$unRegisterScopeOnDestroy',
                    value: function $unRegisterScopeOnDestroy(connection) {
                        var _this7 = this;

                        if (connection.scope !== undefined && angular.isFunction(connection.scope.$on)) connection.scope.$on('$destroy', function () {
                            return _this7.$$unSubscribeOf(connection);
                        });
                    }
                }, {
                    key: '$reconnectAll',
                    value: function $reconnectAll() {
                        var _this8 = this;

                        this.connections.forEach(function (c) {
                            return _this8.subscribe(c.queue, c.callback, c.header, c.scope, c.json);
                        });
                    }
                }, {
                    key: '$$unSubscribeOf',
                    value: function $$unSubscribeOf(connection) {
                        var _this9 = this;

                        this.connections.filter(function (c) {
                            return _this9.$$connectionEquality(c, connection);
                        }).forEach(function (c) {
                            return c.sub.unsubscribe();
                        });

                        this.connections = this.connections.filter(function (c) {
                            return !_this9.$$connectionEquality(c, connection);
                        });
                    }
                }, {
                    key: '$$addToConnectionQueue',
                    value: function $$addToConnectionQueue(connection) {
                        this.connections.push(connection);
                    }
                }, {
                    key: '$$connectionEquality',
                    value: function $$connectionEquality(c1, c2) {
                        return c1.queue === c2.queue && c1.callback === c2.callback && c1.header === c2.header && c1.scope === c2.scope;
                    }
                }]);

                return ngStompWebSocket;
            })();

            _export('default', ngStompWebSocket);
        }
    };
});
$__System.registerDynamic("4", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports["default"] = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("9", ["8"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('8');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a", ["9"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('9'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3", ["a"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _Object$defineProperty = $__require('a')["default"];
  exports["default"] = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.register('b', ['3', '4', '6'], function (_export) {
    var _createClass, _classCallCheck, ngStompWebSocket, ngstompProvider;

    return {
        setters: [function (_) {
            _createClass = _['default'];
        }, function (_2) {
            _classCallCheck = _2['default'];
        }, function (_3) {
            ngStompWebSocket = _3['default'];
        }],
        execute: function () {
            'use strict';

            ngstompProvider = (function () {
                function ngstompProvider() {
                    _classCallCheck(this, ngstompProvider);

                    this.settings = {
                        timeOut: 5000,
                        heartbeat: {
                            outgoing: 10000,
                            incoming: 10000
                        }
                    };
                }

                _createClass(ngstompProvider, [{
                    key: 'credential',
                    value: function credential(login, password) {
                        this.settings.login = login;
                        this.settings.password = password;
                        return this;
                    }
                }, {
                    key: 'url',
                    value: function url(_url) {
                        this.settings.url = _url;
                        return this;
                    }
                }, {
                    key: 'class',
                    value: function _class(clazz) {
                        this.settings['class'] = clazz;
                        return this;
                    }
                }, {
                    key: 'setting',
                    value: function setting(settingsObject) {
                        this.settings = settingsObject;
                        return this;
                    }
                }, {
                    key: 'debug',
                    value: function debug(boolean) {
                        this.settings.debug = boolean;
                        return this;
                    }
                }, {
                    key: 'vhost',
                    value: function vhost(host) {
                        this.settings.vhost = host;
                        return this;
                    }
                }, {
                    key: 'reconnectAfter',
                    value: function reconnectAfter(numberInSeconds) {
                        this.settings.timeOut = numberInSeconds * 1000;
                        return this;
                    }
                }, {
                    key: 'heartbeat',
                    value: function heartbeat(outgoing, incoming) {
                        this.settings.heartbeat.outgoing = outgoing;
                        this.settings.heartbeat.incoming = incoming;
                        return this;
                    }

                    /* @ngInject */
                }, {
                    key: '$get',
                    value: function $get($q, $log, $rootScope, $timeout, Stomp) {
                        return new ngStompWebSocket(this.settings, $q, $log, $rootScope, $timeout, Stomp);
                    }
                }]);

                return ngstompProvider;
            })();

            _export('default', ngstompProvider);
        }
    };
});
$__System.register('1', ['7', 'c', 'b'], function (_export) {
    'use strict';

    var angular, Stomp, ngstompProvider;
    return {
        setters: [function (_) {
            angular = _['default'];
        }, function (_c) {
            Stomp = _c['default'];
        }, function (_b) {
            ngstompProvider = _b['default'];
        }],
        execute: function () {
            _export('default', angular.module('AngularStompDK', []).provider('ngstomp', ngstompProvider).constant('Stomp', Stomp));
        }
    };
});
})
(function(factory) {
  factory(angular, Stomp, angular);
});
//# sourceMappingURL=angular-stomp.js.map