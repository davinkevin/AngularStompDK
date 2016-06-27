/**
 * Created by kevin on 10/01/2016.
 */

export default class Unsubscriber {

    constructor(ngStomp, connections) {
        this.ngStomp = ngStomp;
        this.connections = connections;
    }

    unSubscribeAll() {
        this.connections.forEach(c => this.$$unSubscribeOf(c));
        this.connections = [];
    }

    unSubscribeOf(queue) {
        this.connections
            .filter(c => c.queue === queue)
            .forEach(c => this.$$unSubscribeOf(c));

        this.connections = this.connections.filter(c => c.queue !== queue);
    }

    unSubscribeNth(index) {
        this.connections
            .filter(c => c.index === index)
            .forEach(c => this.$$unSubscribeOf(c));

        this.connections = this.connections.filter(c => c.index !== index);
    }

    $$unSubscribeOf(c) {
        this.ngStomp.$$unSubscribeOf({ queue: c.queue, callback: c.callback, header: c.headers, scope: c.scope, digest : c.digest});
    }

}