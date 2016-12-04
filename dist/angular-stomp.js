"format global";
"globals.angular angular";
"globals.Stomp stompjs";

!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in p||(p[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==v.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=p[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(v.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=p[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return x[e]||(x[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},r.name);t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=p[s],v=x[s];v?l=v.exports:c&&!c.declarative?l=c.esModule:c?(d(c),v=c.module,l=v.exports):l=f(s),v&&v.importers?(v.importers.push(t),t.dependencies.push(v)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=p[e];if(t)t.declarative?c(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=f(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=p[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){if(r===e)return r;var t={};if("object"==typeof r||"function"==typeof r)if(g){var n;for(var o in r)(n=Object.getOwnPropertyDescriptor(r,o))&&h(t,o,n)}else{var a=r&&r.hasOwnProperty;for(var o in r)(!a||r.hasOwnProperty(o))&&(t[o]=r[o])}return t["default"]=r,h(t,"__useDefault",{value:!0}),t}function c(r,t){var n=p[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==v.call(t,u)&&(p[u]?c(u,t):f(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function f(e){if(D[e])return D[e];if("@node/"==e.substr(0,6))return y(e.substr(6));var r=p[e];if(!r)throw"Module "+e+" not present.";return a(e),c(e,[]),p[e]=void 0,r.declarative&&h(r.module.exports,"__esModule",{value:!0}),D[e]=r.declarative?r.module.exports:r.esModule}var p={},v=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},g=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(m){g=!1}var h;!function(){try{Object.defineProperty({},"a",{})&&(h=Object.defineProperty)}catch(e){h=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var x={},y="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,D={"@empty":{}};return function(e,n,o){return function(a){a(function(a){for(var u={_nodeRequire:y,register:r,registerDynamic:t,get:f,set:function(e,r){D[e]=r},newModule:function(e){return e}},d=0;d<n.length;d++)(function(e,r){r&&r.__esModule?D[e]=r:D[e]=s(r)})(n[d],arguments[d]);o(u);var i=f(e[0]);if(e.length>1)for(var d=1;d<e.length;d++)f(e[d]);return i.__useDefault?i["default"]:i})}}}("undefined"!=typeof self?self:global)

(["1"], ["9","c"], function($__System) {

!function(){var t=$__System;if("undefined"!=typeof window&&"undefined"!=typeof document&&window.location)var s=location.protocol+"//"+location.hostname+(location.port?":"+location.port:"");t.set("@@cjs-helpers",t.newModule({getPathVars:function(t){var n,o=t.lastIndexOf("!");n=-1!=o?t.substr(0,o):t;var e=n.split("/");return e.pop(),e=e.join("/"),"file:///"==n.substr(0,8)?(n=n.substr(7),e=e.substr(7),isWindows&&(n=n.substr(1),e=e.substr(1))):s&&n.substr(0,s.length)===s&&(n=n.substr(s.length),e=e.substr(s.length)),{filename:n,dirname:e}}}))}();
$__System.registerDynamic("2", [], true, function($__require, exports, module) {
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

$__System.registerDynamic("3", ["2"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('2');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("4", ["3"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('3'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5", ["4"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _Object$defineProperty = $__require('4')["default"];
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

$__System.registerDynamic("6", [], true, function($__require, exports, module) {
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

$__System.register("7", ["5", "6"], function (_export) {
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
                    value: function unSubscribeOf(queue) {
                        var _this2 = this;

                        this.connections.filter(function (c) {
                            return c.queue === queue;
                        }).forEach(function (c) {
                            return _this2.$$unSubscribeOf(c);
                        });

                        this.connections = this.connections.filter(function (c) {
                            return c.queue !== queue;
                        });
                    }
                }, {
                    key: "unSubscribeNth",
                    value: function unSubscribeNth(index) {
                        var _this3 = this;

                        this.connections.filter(function (c) {
                            return c.index === index;
                        }).forEach(function (c) {
                            return _this3.$$unSubscribeOf(c);
                        });

                        this.connections = this.connections.filter(function (c) {
                            return c.index !== index;
                        });
                    }
                }, {
                    key: "$$unSubscribeOf",
                    value: function $$unSubscribeOf(c) {
                        this.ngStomp.$$unSubscribeOf({ queue: c.queue, callback: c.callback, header: c.headers, scope: c.scope, digest: c.digest });
                    }
                }]);

                return Unsubscriber;
            })();

            _export("default", Unsubscriber);
        }
    };
});
$__System.register('8', ['5', '6', '7', '9'], function (_export) {
    var _createClass, _classCallCheck, UnSubscriber, angular, SubscribeBuilder;

    return {
        setters: [function (_) {
            _createClass = _['default'];
        }, function (_2) {
            _classCallCheck = _2['default'];
        }, function (_3) {
            UnSubscriber = _3['default'];
        }, function (_4) {
            angular = _4['default'];
        }],
        execute: function () {
            /**
             * Created by kevin on 14/12/2015.
             */
            'use strict';

            SubscribeBuilder = (function () {

                /*@ngNoInject*/

                function SubscribeBuilder(ngStomp, queue) {
                    _classCallCheck(this, SubscribeBuilder);

                    this.ngStomp = ngStomp;
                    this.connections = [];

                    this.subscribeTo(queue);
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
                    key: 'withDigest',
                    value: function withDigest(digest) {
                        this.digest = digest;
                        return this;
                    }
                }, {
                    key: 'build',
                    value: function build() {
                        return this.connect();
                    }
                }, {
                    key: 'subscribeTo',
                    value: function subscribeTo(queue) {
                        this.queue = queue;
                        this.aCallback = angular.noop;
                        this.headers = {};
                        this.scope = undefined;
                        this.json = false;
                        this.digest = true;

                        return this;
                    }
                }, {
                    key: 'connect',
                    value: function connect() {
                        var _this = this;

                        this.and();
                        this.connections.forEach(function (c) {
                            return _this.ngStomp.subscribe(c.queue, c.callback, c.headers, c.scope, c.json, c.digest);
                        });
                        return new UnSubscriber(this.ngStomp, this.connections);
                    }
                }, {
                    key: 'and',
                    value: function and() {
                        this.connections.push({
                            queue: this.queue,
                            callback: this.aCallback,
                            headers: this.headers,
                            scope: this.scope,
                            json: this.json,
                            digest: this.digest,
                            index: this.connections.length
                        });
                        return this;
                    }
                }]);

                return SubscribeBuilder;
            })();

            _export('default', SubscribeBuilder);
        }
    };
});
$__System.register('a', ['5', '6', '8', '9'], function (_export) {
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

                    this.$initConnectionState();
                    if (settings.autoConnect) {
                        this.connect();
                    }
                }

                _createClass(ngStompWebSocket, [{
                    key: 'connect',
                    value: function connect() {
                        this.$initConnectionState();
                        return this.$connect();
                    }
                }, {
                    key: '$initConnectionState',
                    value: function $initConnectionState() {
                        this.deferred && this.deferred.reject();
                        this.deferred = this.$q.defer();
                        this.connectionState = this.deferred.promise;
                    }
                }, {
                    key: '$connect',
                    value: function $connect() {
                        var _this = this;

                        this.$setConnection();

                        var successCallback = function successCallback() {
                            return _this.deferred.resolve();
                        };
                        var errorCallback = function errorCallback() {
                            _this.deferred.reject();
                            _this.$initConnectionState();
                            _this.settings.timeOut >= 0 && _this.$timeout(function () {
                                _this.$connect();
                                _this.$reconnectAll();
                            }, _this.settings.timeOut);
                        };

                        if (angular.isDefined(this.settings.headers)) {
                            this.stompClient.connect(this.settings.headers, successCallback, errorCallback);
                        } else {
                            this.stompClient.connect(this.settings.login, this.settings.password, successCallback, errorCallback, this.settings.vhost);
                        }

                        return this.connectionState;
                    }
                }, {
                    key: 'subscribe',
                    value: function subscribe(queue, callback, header, scope, json, digest) {
                        if (header === undefined) header = {};

                        var _this2 = this;

                        if (json === undefined) json = false;

                        this.connectionState.then(function () {
                            return _this2.$stompSubscribe(queue, callback, header, scope, json, digest);
                        }, function () {
                            return _this2.$$addToConnectionQueue({ queue: queue, callback: callback, header: header, scope: scope, json: json, digest: digest });
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

                        this.connectionState.then(function () {
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

                        this.connectionState.then(function () {
                            _this4.stompClient.send(queue, header, JSON.stringify(data));
                            sendDeffered.resolve();
                        });

                        return sendDeffered.promise;
                    }
                }, {
                    key: 'disconnect',
                    value: function disconnect() {
                        var disconnectionPromise = this.$q.defer();
                        this.stompClient.disconnect(function () {
                            disconnectionPromise.resolve();
                        });

                        return disconnectionPromise.promise;
                    }
                }, {
                    key: '$stompSubscribe',
                    value: function $stompSubscribe(queue, callback, header, scope, json, digest) {
                        if (scope === undefined) scope = this.$rootScope;

                        var sub = this.stompClient.subscribe(queue, function (message) {
                            if (json) message.body = JSON.parse(message.body);

                            if (digest) {
                                scope.$applyAsync(function () {
                                    return callback(message);
                                });
                            } else {
                                callback(message);
                            }
                        }, header);

                        var connection = { queue: queue, sub: sub, callback: callback, header: header, scope: scope, json: json, digest: digest };
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
                    key: '$setConnection',
                    value: function $setConnection() {
                        this.stompClient = this.settings['class'] ? this.Stomp.over(new this.settings['class'](this.settings.url)) : this.Stomp.client(this.settings.url);
                        this.stompClient.debug = this.settings.debug ? this.$log.debug : angular.noop;
                        if (angular.isDefined(this.settings.heartbeat)) {
                            this.stompClient.heartbeat.outgoing = this.settings.heartbeat.outgoing;
                            this.stompClient.heartbeat.incoming = this.settings.heartbeat.incoming;
                        }
                    }
                }, {
                    key: '$unRegisterScopeOnDestroy',
                    value: function $unRegisterScopeOnDestroy(connection) {
                        var _this5 = this;

                        if (connection.scope !== undefined && angular.isFunction(connection.scope.$on)) connection.scope.$on('$destroy', function () {
                            return _this5.$$unSubscribeOf(connection);
                        });
                    }
                }, {
                    key: '$reconnectAll',
                    value: function $reconnectAll() {
                        var _this6 = this;

                        var connections = this.connections;
                        this.connections = [];
                        // during subscription each connection will be added to this.connections array again
                        connections.forEach(function (c) {
                            return _this6.subscribe(c.queue, c.callback, c.header, c.scope, c.json, c.digest);
                        });
                    }
                }, {
                    key: '$$unSubscribeOf',
                    value: function $$unSubscribeOf(connection) {
                        var _this7 = this;

                        this.connections.filter(function (c) {
                            return _this7.$$connectionEquality(c, connection);
                        }).forEach(function (c) {
                            return c.sub.unsubscribe();
                        });

                        this.connections = this.connections.filter(function (c) {
                            return !_this7.$$connectionEquality(c, connection);
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
                        return c1.queue === c2.queue && c1.callback === c2.callback && c1.header === c2.header && c1.scope === c2.scope && c1.digest === c2.digest;
                    }
                }, {
                    key: 'login',
                    set: function set(login) {
                        this.settings.login = login;
                    }
                }, {
                    key: 'password',
                    set: function set(password) {
                        this.settings.password = password;
                    }
                }, {
                    key: 'url',
                    set: function set(url) {
                        this.settings.url = url;
                    }
                }]);

                return ngStompWebSocket;
            })();

            _export('default', ngStompWebSocket);
        }
    };
});
$__System.register("b", ["5", "6", "a"], function (_export) {
    var _createClass, _classCallCheck, ngStompWebSocket, ngstompProvider;

    return {
        setters: [function (_) {
            _createClass = _["default"];
        }, function (_2) {
            _classCallCheck = _2["default"];
        }, function (_a) {
            ngStompWebSocket = _a["default"];
        }],
        execute: function () {
            "use strict";

            ngstompProvider = (function () {
                function ngstompProvider() {
                    _classCallCheck(this, ngstompProvider);

                    this.settings = {
                        timeOut: 5000,
                        heartbeat: { outgoing: 10000, incoming: 10000 },
                        autoConnect: true
                    };
                }

                _createClass(ngstompProvider, [{
                    key: "credential",
                    value: function credential(login, password) {
                        this.settings.login = login;
                        this.settings.password = password;
                        return this;
                    }
                }, {
                    key: "url",
                    value: function url(_url) {
                        this.settings.url = _url;
                        return this;
                    }
                }, {
                    key: "class",
                    value: function _class(clazz) {
                        this.settings["class"] = clazz;
                        return this;
                    }
                }, {
                    key: "setting",
                    value: function setting(settingsObject) {
                        this.settings = settingsObject;
                        return this;
                    }
                }, {
                    key: "debug",
                    value: function debug(boolean) {
                        this.settings.debug = boolean;
                        return this;
                    }
                }, {
                    key: "vhost",
                    value: function vhost(host) {
                        this.settings.vhost = host;
                        return this;
                    }
                }, {
                    key: "reconnectAfter",
                    value: function reconnectAfter(numberInSeconds) {
                        this.settings.timeOut = numberInSeconds * 1000;
                        return this;
                    }
                }, {
                    key: "heartbeat",
                    value: function heartbeat(outgoing, incoming) {
                        this.settings.heartbeat.outgoing = outgoing;
                        this.settings.heartbeat.incoming = incoming;
                        return this;
                    }
                }, {
                    key: "autoConnect",
                    value: function autoConnect(autoConnectionDefaultValue) {
                        this.settings.autoConnect = autoConnectionDefaultValue;
                        return this;
                    }
                }, {
                    key: "headers",
                    value: function headers(_headers) {
                        this.settings.headers = _headers;
                        return this;
                    }
                }, {
                    key: "$get",
                    value: ["$q", "$log", "$rootScope", "$timeout", "Stomp", function $get($q, $log, $rootScope, $timeout, Stomp) {
                        "ngInject";
                        return new ngStompWebSocket(this.settings, $q, $log, $rootScope, $timeout, Stomp);
                    }]
                }]);

                return ngstompProvider;
            })();

            _export("default", ngstompProvider);
        }
    };
});
$__System.register('1', ['9', 'c', 'b'], function (_export) {
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
  factory(angular, Stomp);
});
//# sourceMappingURL=angular-stomp.js.map