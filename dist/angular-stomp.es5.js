(function(){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ngstompProvider = (function () {
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
            value: (function (_url) {
                var _urlWrapper = function url(_x) {
                    return _url.apply(this, arguments);
                };

                _urlWrapper.toString = function () {
                    return _url.toString();
                };

                return _urlWrapper;
            })(function (url) {
                this.settings.url = url;
                return this;
            })
        },
        "class": {
            value: function _class(clazz) {
                this.settings["class"] = clazz;
                return this;
            }
        },
        settings: {
            value: function settings(settingsObject) {
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
        $get: {

            /* @ngInject */

            value: ["$q", "$log", "$rootScope", function $get($q, $log, $rootScope) {
                return new ngStompWebSocket(this.settings, $q, $log, $rootScope);
            }]
        }
    });

    return ngstompProvider;
})();

var ngStompWebSocket = (function () {

    /*@ngNoInject*/

    function ngStompWebSocket(settings, $q, $log, $rootScope) {
        _classCallCheck(this, ngStompWebSocket);

        this.settings = settings;
        this.$q = $q;
        this.$rootScope = $rootScope;

        this.stompClient = settings["class"] ? Stomp.over(new settings["class"](settings.url)) : Stomp.client(settings.url);
        this.stompClient.debug = settings.debug ? $log.debug : function () {};

        this.connections = [];
        this.deferred = this.$q.defer();
        this.promiseResult = this.deferred.promise;
        this.connect();
    }

    _createClass(ngStompWebSocket, {
        connect: {
            value: function connect() {
                var _this = this;

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
            value: function subscribe(url, callback, scope) {
                var _this = this;

                this.promiseResult.then(function () {
                    _this.$stompSubscribe(url, callback);
                    _this.unRegisterScopeOnDestroy(scope, url);
                });
                return this;
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
            value: function $stompSubscribe(queue, callback) {
                var self = this;
                var subscription = self.stompClient.subscribe(queue, function () {
                    callback.apply(self.stompClient, arguments);
                    self.$digestStompAction();
                });
                this.connections.push({ url: queue, subscription: subscription });
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
        unRegisterScopeOnDestroy: {
            value: function unRegisterScopeOnDestroy(scope, url) {
                var _this = this;

                if (scope !== undefined && angular.isFunction(scope.$on)) scope.$on("$destroy", function () {
                    return _this.unsubscribe(url);
                });
            }
        }
    });

    return ngStompWebSocket;
})();

angular.module("AngularStompDK", []).provider("ngstomp", ngstompProvider);
})();