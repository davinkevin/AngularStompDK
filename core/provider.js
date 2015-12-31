import ngStompWebSocket from './service';

export default class ngstompProvider {

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


