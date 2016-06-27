/**
 * Created by kevin on 14/12/2015.
 */
import UnSubscriber from './unSubscriber';
import angular from 'angular';

export default class SubscribeBuilder {

    /*@ngNoInject*/
    constructor(ngStomp, queue) {
        this.ngStomp = ngStomp;
        this.connections = [];

        this.subscribeTo(queue);
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

    withDigest(digest) {
        this.digest = digest;
        return this;
    }

    build() {
        return this.connect();
    }

    subscribeTo(queue) {
        this.queue = queue;
        this.aCallback = angular.noop;
        this.headers = {};
        this.scope = {};
        this.json = false;
        this.digest = true;

        return this;
    }

    connect() {
        this.and();
        this.connections.forEach(c => this.ngStomp.subscribe(c.queue, c.callback, c.headers, c.scope, c.json, c.digest));
        return new UnSubscriber(this.ngStomp, this.connections);
    }

    and() {
        this.connections.push({
            queue : this.queue, 
            callback : this.aCallback, 
            headers : this.headers, 
            scope : this.scope, 
            json : this.json,
            digest : this.digest,
            index : this.connections.length+1
        });
        return this;
    }
}