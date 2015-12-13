import angular from 'angular';
import Stomp from 'stompjs';

export default angular
    .module('AngularStompDK', [])
    .provider('ngstomp', ngstompProvider)
    .constant('Stomp', Stomp);