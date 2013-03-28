/*
 * Copyright: 2012, V. Glenn Tarcea
 * MIT License Applies
 */

angular.module('AngularStomp', []).
    factory('ngstomp', function($rootScope) {
        Stomp.WebSocketClass = SockJS;
        var stompClient = Stomp.client('http://localhost:15674/stomp');

        return {
            subscribe: function(queue, callback) {
                stompClient.subscribe(queue, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback(args[0]);
                    })
                })
            },

            send: function(queue, headers, data) {
                stompClient.send(queue, headers, data);
            },

            connect: function(user, password, on_connect, on_error, vhost) {
                stompClient.connect(user, password,
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
            },

            disconnect: function(callback) {
                stompClient.disconnect(function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(args);
                    })
                })
            }
        }

//        function NGStomp(url, socketClass) {
//            Stomp.WebSocketClass = socketClass;
//            var stompClient = Stomp.client(url);
//        }

    });