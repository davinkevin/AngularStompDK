AngularStompDK
============

[![Join the chat at https://gitter.im/davinkevin/AngularStompDK](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/davinkevin/AngularStompDK?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
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

Configure the ngStomp module to connect to your web-socket system :

```js
    angular.module('myApp')
        .config(function(ngstompProvider){
            ngstompProvider
                .url('/ws')
                .credential('login', 'password')
        });
```

If you want to use a sub-system to do the connection, like SockJS, you can add the class name in the configuration part : 

```js
    angular.module('myApp')
        .config(function(ngstompProvider){
            ngstompProvider
                .url('/ws')
                .credential('login', 'password')
                .class(SockJS); // <-- Will be used by StompJS to do the connection
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

You can chain multiple subscribe and add headers to your subscription :

```js
 angular.controller('myController', function($scope, ngstomp) {
    
    var items = [], 
        headers = {
        foo : 'bar'            
    };
    
    ngstomp
        .subscribe('/topic/item', whatToDoWhenMessageComming)
        .subscribe('/queue/message', whatToDoWhenMessageComming, headers);
            
    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
    }
 });
```

Don't forget to unsubscribe your callback when the $scope is detroy (or the call will append even after the scope has been detroyed)

```js
 angular.controller('myController', function($scope, ngstomp) {
    
    var items = [], 
        headers = {
            foo : 'bar'            
        };
    
    ngstomp
        .subscribe('/topic/item', whatToDoWhenMessageComming)
        .subscribe('/queue/message', whatToDoWhenMessageComming, headers);
        
    $scope.$on('$destroy', function() {
        ngstomp
            .unsubscribe('/topic/item', whatToDoWhenUnsubscribe);
    });
    
    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
    }
    
    function whatToDoWhenUnsubscribe() {
        console.log('Unsubscribed !! :D');
    }
 });
```

Or you can give the $scope to the subscribe method to enable the auto-unsubscribe

```js
 angular.controller('myController', function($scope, ngstomp) {

    var items = [], 
        headers = {
            foo : 'bar'            
        };

    ngstomp
        .subscribe('/topic/item', whatToDoWhenMessageComming, {}, $scope)
        .subscribe('/queue/message', whatToDoWhenMessageComming, headers, $scope);

    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
    }
 });
```

And now (since v0.1.0) you can send back information to the Web-Socket : 

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

A more fluent API is available to subscribe with ngstomp (Since 0.3.2) : 

```js
 angular.controller('myController', function($scope, ngstomp) {

    var items = [];

    ngstomp
        .subscribeTo('/topic/item')
                .callback(whatToDoWhenMessageComming)
                .bindTo($scope)
        .build()

    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
    }
 });
```

And if you want subbscribe to multiple topic, you can chain the builder pattern :
```js
 angular.controller('myController', function($scope, ngstomp) {
    var vm = this;
    vm.items = [];

    ngstomp
        .subscribeTo('/topic/item1')
                .callback(whatToDoWhenMessageComming)
                .bindTo($scope)
            .and()
        .subscribeTo('/topic/item2')
                .callback(whatToDoWhenMessageComming)
                .withHeaders({})
        .build();

    function whatToDoWhenMessageComming(message) {
        vm.items.push(JSON.parse(message.body));
    }
 });
```
