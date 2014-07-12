/*
 * Copyright: Davin Kevin, Forked from V. Glenn Tarcea
 * MIT License Applies
 */

angular.module('AngularStomp', [])
    .factory('ngstomp', function ($rootScope, $log) {
        var NGStomp = function (url, wsClazz, hasToBeLogged) {
                this.stompClient = wsClazz ? Stomp.over(new wsClazz(url)) : Stomp.client(url);
                this.stompClient.debug = (hasToBeLogged) ? $log.debug : function(){};
            };

        NGStomp.prototype.subscribe = function (queue, callback) {
            this.stompClient.subscribe(queue, function () {
                callback.apply(this.stompClient, arguments);
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            });
        };

        NGStomp.prototype.unsubscribe = function (queue, headers) {
            this.stompClient.unsubscribe(queue, headers);
        };

        NGStomp.prototype.send = function (queue, headers, data) {
            this.stompClient.send(queue, headers, data);
        };

        NGStomp.prototype.connect = function (user, password, onConnect, onError, vhost) {
            var self = this;
            this.stompClient.connect(
                user,
                password,
                function () {
                    onConnect.apply(self.stompClient, arguments);
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                },
                function () {
                    onError.apply(self.stompClient, arguments);
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                },
                vhost
            );
        };

        NGStomp.prototype.disconnect = function (callback) {
            var self = this;
            this.stompClient.disconnect(function () {
                callback.apply(self.stompClient, arguments);
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            });
        };

        return function (url, wsClazz, hasToBeLogged) {
            return new NGStomp(url, wsClazz, hasToBeLogged);
        };

    });
