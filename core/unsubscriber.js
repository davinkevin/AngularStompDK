/**
 * Created by kevin on 10/01/2016.
 */

export default class Unsubscriber {

    constructor(ngStomp, connections) {
        this.ngStomp = ngStomp;
        this.connections = connections;
    }

    unsubscribeAll() {
        this.connections.forEach(c => this.$$unsubscribeOf(c))
        this.connections = [];
    }

    unsubscribeOf(topic) {
        this.connections
            .filter(c => c.queue === topic)
            .forEach(c => this.$$unsubscribeOf(c));

        this.connections = this.connections.filter(c => c.queue !== topic);
    }

    unsubscribeNth(number) {
        this.$$unsubscribeOf(this.connections[number]);
        this.connections.splice(number-1, 1);
    }

    $$unsubscribeOf(c) {
        this.ngStomp.$$unsubscribeOf({ queue: c.topic, callback: c.callback, header: c.headers, scope: c.scope});
    }

}