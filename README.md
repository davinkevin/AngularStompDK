AngularStomp
============

Angular service to Web-Stomp

Usage
-----
This class relies on stomp.js that can be found at: https://github.com/jmesnil/stomp-websocket/

1. Add the dependency to your Angular application :  

```js
    angular.module('myApp', [
        'AngularStompDK'
    ])
```

2. Configure the ngStomp to connect to your web-socket system : 

```js
    angular.module('myApp')
        .config(function(ngstompProvider){
            ngstompProvider
                .url('/ws')
                .credential('login', 'password')
                .class(SockJS);
        });
```

3. Use it inside your controller (or everywhere you want !)

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

4. You can chain multiple subscribe 

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

5. Don't forget to unsubscribe your callback when the $scope is detroy (or the call will append even after the scope has been detroyed)

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

6. Or you can give the $scope to the subscribe method to enable the auto-unsubscribe

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
