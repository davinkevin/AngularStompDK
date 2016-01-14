/**
 * Created by kevin on 14/12/2015.
 */
import Unsubscriber from './unSubscriber'

export default class SubscribeBuilder {

    /*@ngNoInject*/
    constructor(ngStomp, topic) {
        this.ngStomp = ngStomp;
        this.connections = [];

        this.subscribeTo(topic);
    }

    callback(aCallback) {
        this.aCallback = aCallback;
        return this;
    }

    withHeaders(headers) {
        this.headers = headers;
        return this;
    }

    bindTo(aScope) {
        this.scope = aScope;
        return this;
    }

    withBodyInJson() {
        this.json = true;
        return this;
    }

    build() {
        return this.connect();
    }

    subscribeTo(topic) {
        this.topic = topic;
        this.aCallback = angular.noop;
        this.headers = {};
        this.scope = {};
        this.json = false;

        return this;
    }

    connect() {
        this.and();
        this.connections.forEach(c => this.ngStomp.subscribe(c.topic, c.callback, c.headers, c.scope, c.json));
        return new Unsubscriber(this.ngStomp, this.connections);
    }

    and() {
        this.connections.push({topic : this.topic, callback : this.aCallback, headers : this.headers, scope : this.scope, json : this.json, index : this.connections.length+1});
        return this;
    }
}