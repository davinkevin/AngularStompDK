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

    settings(settingsObject) {
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

    /* @ngInject */
    $get($q, $log, $rootScope) {
        return new ngStompWebSocket(this.settings, $q, $log, $rootScope);
    }
}
class ngStompWebSocket {

    /*@ngNoInject*/
    constructor(settings, $q, $log, $rootScope) {
        this.settings = settings;
        this.$q = $q;
        this.$rootScope = $rootScope;

        this.stompClient = settings.class ? Stomp.over(new settings.class(settings.url)) : Stomp.client(settings.url);
        this.stompClient.debug = (settings.debug) ? $log.debug : function () {};

        this.connections = [];
        this.deferred = this.$q.defer();
        this.promiseResult = this.deferred.promise;
        this.connect();
    }

    connect() {
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

    subscribe(url, callback, scope) {
        this.promiseResult.then(() => {
            this.$stompSubscribe(url, callback);
            this.unRegisterScopeOnDestroy(scope, url);
        });
        return this;
    }

    unsubscribe(url) {
        this.promiseResult.then(() => this.$stompUnSubscribe(url));
        return this;
    };

    send(queue, data, header) {
        let sendDeffered = this.$q.defer();

        this.promiseResult.then(() => {
            this.stompClient.send(queue, header || {}, JSON.stringify(data));
            sendDeffered.resolve();
        });

        return sendDeffered.promise;
    };

    disconnect() {
        let disconnectionPromise = this.$q.defer();
        this.stompClient.disconnect(() => {
            disconnectionPromise.resolve();
            this.$digestStompAction();
        });

        return disconnectionPromise.promise;
    }

    $stompSubscribe(queue, callback) {
        let subscription = this.stompClient.subscribe(queue, () => {
                callback.apply(this.stompClient, arguments);
                this.$digestStompAction()
            });
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
        !$rootScope.$$phase && $rootScope.$apply();
    }

    unRegisterScopeOnDestroy(scope, url) {
        if (scope !== undefined && angular.isFunction(scope.$on))
            scope.$on('$destroy', () => this.unsubscribe(url) );
    }
}
angular.module('AngularStompDK', [])
    .provider('ngstomp', ngstompProvider);
