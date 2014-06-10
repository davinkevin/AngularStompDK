/*
 * Copyright: 2012, V. Glenn Tarcea
 * MIT License Applies
 */

angular.module('AngularStomp', []).
    factory('ngstomp', function($rootScope) {
       var stompClient = {};

        function NGStomp(url, classToUse, logFunction) {
            if (!classToUse)
                this.stompClient = Stomp.client(url);
            else {
                this.stompClient = Stomp.over(new classToUse(url));
            }
            if (logFunction)
                this.stompClient.debug = logFunction;
            else
                this.stompClient.debug = function(str) {};
        }

        NGStomp.prototype.subscribe = function(queue, callback) {
            this.stompClient.subscribe(queue, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback(args[0]);
                })
            })
        }

        NGStomp.prototype.send = function(queue, headers, data) {
            this.stompClient.send(queue, headers, data);
        }

        NGStomp.prototype.connect = function(user, password, on_connect, on_error, vhost) {
            this.stompClient.connect(user, password,
                function(frame) {
                    $rootScope.$apply(function() {
                        on_connect.apply(stompClient, frame);
                    })
                },
                function(frame) {
                    $rootScope.$apply(function() {
                        on_error.apply(stompClient, frame);
                    })
                }, vhost);
        }

        NGStomp.prototype.disconnect = function(callback) {
            this.stompClient.disconnect(function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(args);
                })
            })
        }

        return function(url, WebSocketclazz, logFunction) {
            return new NGStomp(url, WebSocketclazz, logFunction);
        }
    });
