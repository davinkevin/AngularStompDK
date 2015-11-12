/*! AngularStompDK v0.3.3 */
(function () {
    'use strict';
    var _createClass = function () {
        function defineProperties(target, props) {
            for (var key in props) {
                var prop = props[key];
                prop.configurable = true;
                if (prop.value)
                    prop.writable = true;
            }
            Object.defineProperties(target, props);
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
    var _classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    };
    /*import angular from 'angular';
import Stomp from 'stomp-client';*/
    var ngstompProvider = function () {
        function ngstompProvider() {
            _classCallCheck(this, ngstompProvider);
            this.settings = {};
        }
        _createClass(ngstompProvider, {
            credential: {
                value: function credential(login, password) {
                    this.settings.login = login;
                    this.settings.password = password;
                    return this;
                }
            },
            url: {
                value: function (_url) {
                    var _urlWrapper = function url(_x) {
                        return _url.apply(this, arguments);
                    };
                    _urlWrapper.toString = function () {
                        return _url.toString();
                    };
                    return _urlWrapper;
                }(function (url) {
                    this.settings.url = url;
                    return this;
                })
            },
            'class': {
                value: function _class(clazz) {
                    this.settings['class'] = clazz;
                    return this;
                }
            },
            setting: {
                value: function setting(settingsObject) {
                    this.settings = settingsObject;
                    return this;
                }
            },
            debug: {
                value: function debug(boolean) {
                    this.settings.debug = boolean;
                    return this;
                }
            },
            vhost: {
                value: function vhost(host) {
                    this.settings.vhost = host;
                    return this;
                }
            },
            heartbeat: {
                value: function heartbeat() {
                    var outgoing = arguments[0] === undefined ? 10000 : arguments[0];
                    var incoming = arguments[1] === undefined ? 10000 : arguments[1];
                    this.settings.heartbeat = {
                        outgoing: outgoing,
                        incoming: incoming
                    };
                    return this;
                }
            },
            $get: {
                /* @ngInject */
                value: ["$q", "$log", "$rootScope", "Stomp", function $get($q, $log, $rootScope, Stomp) {
                    return new ngStompWebSocket(this.settings, $q, $log, $rootScope, Stomp);
                }]
            }
        });
        return ngstompProvider;
    }();
    var ngStompWebSocket = function () {
        /*@ngNoInject*/
        function ngStompWebSocket(settings, $q, $log, $rootScope, Stomp) {
            _classCallCheck(this, ngStompWebSocket);
            this.settings = settings;
            this.$q = $q;
            this.$rootScope = $rootScope;
            this.$log = $log;
            this.Stomp = Stomp;
            this.connect();
        }
        _createClass(ngStompWebSocket, {
            connect: {
                value: function connect() {
                    var _this = this;
                    this.$setConnection();
                    this.stompClient.connect(this.settings.login, this.settings.password, function () {
                        _this.deferred.resolve();
                        _this.$digestStompAction();
                    }, function () {
                        _this.deferred.reject();
                        _this.$digestStompAction();
                    }, this.settings.vhost);
                    return this.promiseResult;
                }
            },
            subscribe: {
                value: function subscribe(url, callback, header, scope) {
                    var _this = this;
                    this.promiseResult.then(function () {
                        _this.$stompSubscribe(url, callback, header || {});
                        _this.unRegisterScopeOnDestroy(scope, url);
                    });
                    return this;
                }
            },
            subscribeTo: {
                value: function subscribeTo(topic) {
                    return new SubscribeBuilder(this, topic);
                }
            },
            unsubscribe: {
                value: function unsubscribe(url) {
                    var _this = this;
                    this.promiseResult.then(function () {
                        return _this.$stompUnSubscribe(url);
                    });
                    return this;
                }
            },
            send: {
                value: function send(queue, data, header) {
                    var _this = this;
                    var sendDeffered = this.$q.defer();
                    this.promiseResult.then(function () {
                        _this.stompClient.send(queue, header || {}, JSON.stringify(data));
                        sendDeffered.resolve();
                    });
                    return sendDeffered.promise;
                }
            },
            disconnect: {
                value: function disconnect() {
                    var _this = this;
                    var disconnectionPromise = this.$q.defer();
                    this.stompClient.disconnect(function () {
                        disconnectionPromise.resolve();
                        _this.$digestStompAction();
                    });
                    return disconnectionPromise.promise;
                }
            },
            $stompSubscribe: {
                value: function $stompSubscribe(queue, callback, header) {
                    var self = this;
                    var subscription = self.stompClient.subscribe(queue, function () {
                        callback.apply(self.stompClient, arguments);
                        self.$digestStompAction();
                    }, header);
                    this.connections.push({
                        url: queue,
                        subscription: subscription
                    });
                }
            },
            $stompUnSubscribe: {
                value: function $stompUnSubscribe(queue) {
                    var indexToRemove = false;
                    for (var i = 0, len = this.connections.length; i < len; i++) {
                        if (this.connections[i].url === queue) {
                            indexToRemove = i;
                            this.connections[i].subscription.unsubscribe();
                            break;
                        }
                    }
                    if (indexToRemove !== false) {
                        this.connections.splice(indexToRemove, 1);
                    }
                }
            },
            $digestStompAction: {
                value: function $digestStompAction() {
                    !this.$rootScope.$$phase && this.$rootScope.$apply();
                }
            },
            $setConnection: {
                value: function $setConnection() {
                    this.stompClient = this.settings['class'] ? this.Stomp.over(new this.settings['class'](this.settings.url)) : this.Stomp.client(this.settings.url);
                    this.stompClient.debug = this.settings.debug ? this.$log.debug : angular.noop;
                    if (angular.isDefined(this.settings.heartbeat)) {
                        this.stompClient.heartbeat.outgoing = this.settings.heartbeat.outgoing;
                        this.stompClient.heartbeat.incoming = this.settings.heartbeat.incoming;
                    }
                    this.connections = [];
                    this.deferred = this.$q.defer();
                    this.promiseResult = this.deferred.promise;
                }
            },
            unRegisterScopeOnDestroy: {
                value: function unRegisterScopeOnDestroy(scope, url) {
                    var _this = this;
                    if (scope !== undefined && angular.isFunction(scope.$on))
                        scope.$on('$destroy', function () {
                            return _this.unsubscribe(url);
                        });
                }
            }
        });
        return ngStompWebSocket;
    }();
    var SubscribeBuilder = function () {
        /*@ngNoInject*/
        function SubscribeBuilder(ngStomp, topic) {
            _classCallCheck(this, SubscribeBuilder);
            this.ngStomp = ngStomp;
            this.topic = topic;
            this.aCallback = angular.noop;
            this.headers = {};
            this.scope = {};
        }
        _createClass(SubscribeBuilder, {
            callback: {
                value: function callback(aCallback) {
                    this.aCallback = aCallback;
                    return this;
                }
            },
            withHeaders: {
                value: function withHeaders(headers) {
                    this.headers = headers;
                    return this;
                }
            },
            bindTo: {
                value: function bindTo(aScope) {
                    this.scope = aScope;
                    return this;
                }
            },
            build: {
                value: function build() {
                    return this.ngStomp.subscribe(this.topic, this.aCallback, this.headers, this.scope);
                }
            },
            and: {
                value: function and() {
                    return this.build();
                }
            }
        });
        return SubscribeBuilder;
    }();
    angular.module('AngularStompDK', []).provider('ngstomp', ngstompProvider).constant('Stomp', window.Stomp);
}());