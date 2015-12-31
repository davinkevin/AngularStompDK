AngularStompDK
============

[![Join the chat at https://gitter.im/davinkevin/AngularStompDK](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/davinkevin/AngularStompDK?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/davinkevin/AngularStompDK.svg?branch=master)](https://travis-ci.org/davinkevin/AngularStompDK) [![Coverage Status](https://coveralls.io/repos/davinkevin/AngularStompDK/badge.svg?branch=master)](https://coveralls.io/r/davinkevin/AngularStompDK?branch=master) [![Code Climate](https://codeclimate.com/github/davinkevin/AngularStompDK/badges/gpa.svg)](https://codeclimate.com/github/davinkevin/AngularStompDK) 

Angular service to Stomp Websocket Library. 
This library is an interface between native Stomp comunication and AngularJS
This service relies on stomp.js that can be found at: https://github.com/jmesnil/stomp-websocket/

### 1. Installation
----------------

This library is developped in ES2015 (and with some ES20XX features) and transpilled into plain old Javascript for browser compatibility. You can choose to use this lib from a standard AngularJS Project or inside a AngularJS written in ES2015.

#### 1. 1. ES5 : Plain Old Javascript

You have to import the transpiled files (normaly located in the dist folder) in your Single Page App.
Don't forget to import Angular and Stomp.js first (because the lib relies on it).

```html
<script src="js/lib/stompjs/stomp.js" />
<script src="js/lib/AngularStompDK/angular/angular.min.js" />
<script src="js/lib/AngularStompDK/dist/angular-stomp.min.js" />
```

And add the dependency to your Angular application :

```js
angular.module('myApp', [ 'AngularStompDK' ])
```

#### 1. 2. ES2015 and more
----------------
You can now (since version 0.4.0) import AngularStompDK directly from JSPM (Package manager build upon SystemJS) 

```
$ jspm install github:AngularStompDK
```

All the dependencies will automatically be fetch (kind of magic, isn't it :D) and you just have to register the lib at the AngularJS level (described here with the bootstrap method, commonly used in JSPM | ES2015 environnement).

```js 
import angular from 'angular';
import 'AngularStompDK'; // <-- Loading the full transpiled file from dist
...

let app = angular.module('MyWonderfullStompApp', [ 'AngularStompDK' ] );

angular
    .element(document)
    .ready(() => angular.bootstrap(element, [ app ] ));
```

You also can load the ES2015 file and use your current transpiler to use AngularStompDK. For this, we have to use the relative path of the entrypoint in the project 

```js 
import angular from 'angular';
import ngStomp from 'AngularStompDK/core/ngStomp'; // Path to the main ES6 Module
...

let app = angular.module('MyWonderfullStompApp', [ ngStomp.name ] );

... 
```


#### 2. Configuration
----------------

All the code example will be written in ES5 for the moment, if some of you would like to have example in ES2015, open an issue or do a PR.

##### 2. 1. Standard configuration
----------------

Configure the ngStomp module to connect to your web-socket system :

```js
    angular.module('myApp')
        .config(function(ngstompProvider){
            ngstompProvider
                .url('/ws')
                .credential('login', 'password')
        });
```

##### 2. 2. Configuration with underlying implementation
----------------

If you want to use a sub-system to do the connection, like SockJS, you can add the class name in the configuration part.
Don't forget to import this underlying library in your page via Bower (and HTML script tag or other) or via JSPM.

```js
    angular.module('myApp')
        .config(function(ngstompProvider){
            ngstompProvider
                .url('/ws')
                .credential('login', 'password')
                .class(SockJS); // <-- Will be used by StompJS to do the connection
        });
```

#### 3. 1. Receive information from Stomp Web-Socket
----------------

Use it inside your controller (or everywhere you want !)

```js
    angular.controller('myController', function(ngstomp) {
    
        var webSocketEndPoint = '/topic/item', items = [];

        ngstomp
            .subscribe(webSocketEndPoint, whatToDoWhenMessageComming);

        function whatToDoWhenMessageComming(message) {
            items.push(JSON.parse(message.body));
        }
     });
```

You can chain multiple subscribe and add headers to your subscription :

```js
 angular.controller('myController', function(ngstomp) {
    
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

Don't forget to unsubscribe your callback when the $scope is detroyed (or the call will keep happening even after the scope has been detroyed)

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

A simple way to unsubscribe automatically is to give the $scope as fourth parameters to let the library register the disconnection when the $scope will be destroyed. A better syntax could be used with the builder pattern (see above).

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

#### 3. 2. Builder Pattern to subscribe
----------------

A more fluent API is available to subscribe with ngstomp : 

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

#### 3. 3. Send information
----------------

You can send back information to the Web-Socket : 

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
         
    this.sendDataToWS = function(message) {
        ngstomp
            .send('/topic/item/message', objectToSend, stompHeaders);
    }
 });
```

## Frequently Asked Question : 

##### Why using $scope ? This seems to be deprecated in angularJs version since 1.3 ?
The $scope is the only bridge between Angular Lifecycle and standard HTML behaviour (like web-socket). To keep both in sync, we have to use the $scope.

##### How can I contribute to this project ? Because I think a very important feature is missing...
This project is totally open-source, and I'll be glad to see Push Request, so Fork it, improve it, test it (don't forget !) and do PR. It's very simple to work that way.

##### I have some question and I don't understand how it works, what can I do ?
First of all, I encourage you to read the implementation of the lib, and even the tests. Right now, it's only 200 lines of code (without the test), so it's very simple (read the ES2015 version, not the transpilled version...).
If it doesn't help, feel free to open a issue on the github, and if I can help, I will try to. 

#### I have another question and it's not in this FAQ
Like the previous question, open an issue and I will add it to this README (or you can do a PR only on this file).

