/**
 * Created by kevin on 14/12/2015.
 */
import SubscribeBuilder from './builder';
import angular from 'angular';

export default class ngStompWebSocket {

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

    subscribe(url, callback, header = {}, scope) {
        this.promiseResult.then(() => {
            this.$stompSubscribe(url, callback, header);
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

    send(queue, data, header = {}) {
        let sendDeffered = this.$q.defer();

        this.promiseResult.then(() => {
            this.stompClient.send(queue, header, JSON.stringify(data));
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
        this.connections.set(queue, subscription);
    }

    $stompUnSubscribe(queue) {
        let subscription = this.connections.get(queue);
        subscription.unsubscribe();
        this.connections.delete(queue);
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
        this.connections = new Map();
        this.deferred = this.$q.defer();
        this.promiseResult = this.deferred.promise;
    }

    unRegisterScopeOnDestroy(scope, url) {
        if (scope !== undefined && angular.isFunction(scope.$on))
            scope.$on('$destroy', () => this.unsubscribe(url) );
    }
}
