/*
 * Copyright: Davin Kevin, Forked from V. Glenn Tarcea
 * MIT License Applies
 */

angular.module('AngularStomp', [])
    .factory('ngstomp', function ($rootScope, $log) {
        var NGStomp = function (url, wsClazz) {
                this.stompClient = wsClazz ? Stomp.over(new wsClazz(url)) : Stomp.client(url);
                this.stompClient.debug = $log.debug;
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
            this.stompClient.connect(
                user,
                password,
                function () {
                    onConnect.apply(this.stompClient, arguments);
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                },
                function () {
                    onError.apply(this.stompClient, arguments);
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                },
                vhost
            );
        };

        NGStomp.prototype.disconnect = function (callback) {
            this.stompClient.disconnect(function () {
                callback.apply(this.stompClient, arguments);
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            });
        };

        return function (url, wsClazz) {
            return new NGStomp(url, wsClazz);
        };

    });
