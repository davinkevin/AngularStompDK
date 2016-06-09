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

    unSubscribeOf(topic) {
        this.connections
            .filter(c => c.topic === topic || c.queue === topic)
            .forEach(c => this.$$unSubscribeOf(c));

        this.connections = this.connections.filter(c => (!(c.queue === topic || c.topic === topic)));
    }

    unSubscribeNth(index) {
        this.connections
            .filter(c => c.index === index)
            .forEach(c => this.$$unSubscribeOf(c));

        this.connections = this.connections.filter(c => c.index !== index);
    }

    $$unSubscribeOf(c) {
        this.ngStomp.$$unSubscribeOf({ queue: c.topic, callback: c.callback, header: c.headers, scope: c.scope});
    }

}