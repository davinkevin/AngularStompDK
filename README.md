AngularStomp
============
[![Build Status](https://travis-ci.org/davinkevin/AngularStompDK.svg?branch=master)](https://travis-ci.org/davinkevin/AngularStompDK) [![Coverage Status](https://coveralls.io/repos/davinkevin/AngularStompDK/badge.svg?branch=master)](https://coveralls.io/r/davinkevin/AngularStompDK?branch=master) [![Code Climate](https://codeclimate.com/github/davinkevin/AngularStompDK/badges/gpa.svg)](https://codeclimate.com/github/davinkevin/AngularStompDK) 

Angular service to Web-Stomp

Usage
-----
This class relies on stomp.js that can be found at: https://github.com/jmesnil/stomp-websocket/

Add the dependency to your Angular application :

```js
    angular.module('myApp', [
        'AngularStompDK'
    ])
```

Configure the ngStomp to connect to your web-socket system :

```js
    angular.module('myApp')
        .config(function(ngstompProvider){
            ngstompProvider
                .url('/ws')
                .credential('login', 'password')
                .class(SockJS);
        });
```

Use it inside your controller (or everywhere you want !)

```js
    angular.controller('myController', function($scope, ngstomp) {
    
        var webSocketEndPoint = '/topic/item',
            items = [];

        ngstomp
            .subscribe(webSocketEndPoint, whatToDoWhenMessageComming);

        function whatToDoWhenMessageComming(message) {
            items.push(JSON.parse(message.body));
        }
     });
```

You can chain multiple subscribe

```js
 angular.controller('myController', function($scope, ngstomp) {
    
    var items = [];
    
    ngstomp
        .subscribe('/topic/item', whatToDoWhenMessageComming)
        .subscribe('/queue/message', whatToDoWhenMessageComming);
            
    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
    }
 });
```

Don't forget to unsubscribe your callback when the $scope is detroy (or the call will append even after the scope has been detroyed)

```js
 angular.controller('myController', function($scope, ngstomp) {
    
    var items = [];
    
    ngstomp
        .subscribe('/topic/item', whatToDoWhenMessageComming)
        .subscribe('/queue/message', whatToDoWhenMessageComming);
        
    $scope.$on('$destroy', function() {
        ngstomp
            .unsubscribe('/topic/item', whatToDoWhenUnsubscribe);
    });
    
    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
    }
    
    function whatToDoWhenUnsubscribe() {
        console.log("Unsubscribed !! :D);
    }
 });
```

Or you can give the $scope to the subscribe method to enable the auto-unsubscribe

```js
 angular.controller('myController', function($scope, ngstomp) {

    var items = [];

    ngstomp
        .subscribe('/topic/item', whatToDoWhenMessageComming, $scope)
        .subscribe('/queue/message', whatToDoWhenMessageComming, $scope);

    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
    }
 });
```

And now (since v0.1.0) you can send back to the Web-Socket information : 

```js
 angular.controller('myController', function($scope, ngstomp) {

    var items = [];

    ngstomp
        .subscribe('/topic/item', whatToDoWhenMessageComming, $scope);

    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
    }

    var objectToSend = { message : 'Hello Web-Socket'},
        stompHeaders = {headers1 : 'xx', headers2 : 'yy'};
         
    $scope.sendDataToWS = function(message) {
        ngstomp
            .send('/topic/item/message', objectToSend, stompHeaders);
    }
 });
```