AngularStomp
============

Angular service to Web-Stomp

Usage
-----
This class relies on stomp.js that can be found at: https://github.com/jmesnil/stomp-websocket/

1. Set the socket provider for Stomp. I do this in my app config: `Stomp.WebSocketClass = SockJS;`
   (Here I am using SockJS: `<script src="http://cdn.sockjs.org/sockjs-0.3.min.js"></script>`)
2. In your app module add 'AngularStomp'. The name of the injected service is ngstomp
3. The service is a constructor that takes the url to connect to. Here is a full example:

```js
function FrontPageController($scope, $routeParams, ngstomp) {
    $scope.messages = [];
    $scope.client = ngstomp('http://localhost:15674/stomp');
    $scope.client.connect("guest", "guest", function(){
        $scope.client.subscribe("/topic/test", function(message) {
            $scope.messages.push(message.body);
        });
    }, function(){}, '/');
```

Example HTML:

```html
<div class="row" ng-controller="FrontPageController">
    <div class="span8 offset1">
        <h1>Messages</h1>
        <p ng-repeat="message in messages">{{message}}</p>
    </div>
</div>
```

