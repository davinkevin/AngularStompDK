/*import angular from 'angular';
import Stomp from 'stomp-client';*/

class ngstompProvider {

    constructor() {
        this.settings = {};
    }

    credential(login, password) {
        this.settings.login = login;
        this.settings.password = password;
        return this;
    }

    url(url) {
        this.settings.url = url;
        return this;
    }

    class(clazz) {
        this.settings.class = clazz;
        return this;
    }

    setting(settingsObject) {
        this.settings = settingsObject;
        return this;
    }

    debug(boolean) {
        this.settings.debug = boolean;
        return this;
    }

    vhost(host) {
        this.settings.vhost = host;
        return this;
    }

    heartbeat(outgoing = 10000, incoming = 10000) {
        this.settings.heartbeat = {
            outgoing : outgoing,
            incoming : incoming
        };
        return this;
    }

    /* @ngInject */
    $get($q, $log, $rootScope, Stomp) {
        return new ngStompWebSocket(this.settings, $q, $log, $rootScope, Stomp);
    }
}

class ngStompWebSocket {

    /*@ngNoInject*/
    constructor(settings, $q, $log, $rootScope, Stomp) {
        this.settings = settings;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$log = $log;
        this.Stomp = Stomp;

        this.connect();
    }

    connect() {
        this.$setConnection();
        this.stompClient.connect(
            this.settings.login,
            this.settings.password,
            () => {
                this.deferred.resolve();
                this.$digestStompAction();
            },
            () => {
                this.deferred.reject();
                this.$digestStompAction();
            },
            this.settings.vhost
        );
        return this.promiseResult;
    }

    subscribe(url, callback, header, scope) {
        this.promiseResult.then(() => {
            this.$stompSubscribe(url, callback, header || {});
            this.unRegisterScopeOnDestroy(scope, url);
        });
        return this;
    }

    subscribeTo(topic) {
        return new SubscribeBuilder(this, topic);
    }

    unsubscribe(url) {
        this.promiseResult.then(() => this.$stompUnSubscribe(url));
        return this;
    }

    send(queue, data, header) {
        let sendDeffered = this.$q.defer();

        this.promiseResult.then(() => {
            this.stompClient.send(queue, header || {}, JSON.stringify(data));
            sendDeffered.resolve();
        });

        return sendDeffered.promise;
    }

    disconnect() {
        let disconnectionPromise = this.$q.defer();
        this.stompClient.disconnect(() => {
            disconnectionPromise.resolve();
            this.$digestStompAction();
        });

        return disconnectionPromise.promise;
    }

    $stompSubscribe(queue, callback, header) {
        let self = this;
        let subscription = self.stompClient.subscribe(queue, function() {
            callback.apply(self.stompClient, arguments);
            self.$digestStompAction();
        }, header);
        this.connections.push({url: queue, subscription: subscription});
    }

    $stompUnSubscribe(queue) {
        let indexToRemove = false;
        for (var i = 0, len = this.connections.length; i < len; i++) {
            if (this.connections[i].url === queue) {
                indexToRemove = i;
                this.connections[i].subscription.unsubscribe();
                break;
            }
        }
        if (indexToRemove !== false) {
            this.connections.splice(indexToRemove, 1);
        }
    }

    $digestStompAction() {
        !this.$rootScope.$$phase && this.$rootScope.$apply();
    }

    $setConnection() {
        this.stompClient = this.settings.class ? this.Stomp.over(new this.settings.class(this.settings.url)) : this.Stomp.client(this.settings.url);
        this.stompClient.debug = (this.settings.debug) ? this.$log.debug : angular.noop;
        if (angular.isDefined(this.settings.heartbeat)) {
            this.stompClient.heartbeat.outgoing = this.settings.heartbeat.outgoing;
            this.stompClient.heartbeat.incoming = this.settings.heartbeat.incoming;
        }
        this.connections = [];
        this.deferred = this.$q.defer();
        this.promiseResult = this.deferred.promise;
    }

    unRegisterScopeOnDestroy(scope, url) {
        if (scope !== undefined && angular.isFunction(scope.$on))
            scope.$on('$destroy', () => this.unsubscribe(url) );
    }
}

class SubscribeBuilder {

    /*@ngNoInject*/
    constructor(ngStomp, topic) {
        this.ngStomp = ngStomp;
        this.topic = topic
        this.aCallback = angular.noop;
        this.headers = {};
        this.scope = {};
    }

    callback(aCallback) {
        this.aCallback = aCallback;
        return this;
    }

    withHeaders(headers) {
        this.headers = headers
        return this;
    }

    bindTo(aScope) {
        this.scope = aScope;
        return this;
    }

    build() {
        return this.ngStomp.subscribe(this.topic, this.aCallback, this.headers, this.scope);
    }

    and() {
        return this.build();
    }
}

angular
    .module('AngularStompDK', [])
        .provider('ngstomp', ngstompProvider)
        .constant('Stomp', window.Stomp);
