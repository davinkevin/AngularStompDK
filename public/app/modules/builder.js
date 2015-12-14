/**
 * Created by kevin on 14/12/2015.
 */

export default class SubscribeBuilder {

    /*@ngNoInject*/
    constructor(ngStomp, topic) {
        this.ngStomp = ngStomp;
        this.topic = topic;
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