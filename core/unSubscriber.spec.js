/**
 * Created by kevin on 12/01/2016.
 */
import UnSubscriber from './unSubscriber';
import NgStomp from '../mock/ngStomp';

describe('unSubscriber', () => {

    let ngStomp, connections, unSubscriber;

    beforeEach(() => {
        ngStomp = new NgStomp();
        connections = [];
        unSubscriber = new UnSubscriber(ngStomp, connections);
    });

    it('should have a coherent object', () => {
        /* Given */
        /* When  */
        /* Then  */
        expect(unSubscriber.ngStomp).toBe(ngStomp);
        expect(unSubscriber.connections).toBe(connections);
    });

    it('should unsubscribe All', () => {
        /* Given */
        connections.push({a : 'a'}, {b : 'b'}, {c : 'c'});

        /* When  */
        unSubscriber.unSubscribeAll();

        /* Then  */
        expect(ngStomp.spies.$$unSubscribeOf.calls.count()).toBe(3);
        expect(unSubscriber.connections).toEqual([]);
    });

    it('should unSubscribe from a topic', () => {
        /* Given */
        connections.push({queue : 'a', other : 'a'}, {queue : 'a', other : 'b'}, {queue : 'b'}, {queue : 'c'});

        /* When  */
        unSubscriber.unSubscribeOf('a');

        /* Then  */
        expect(ngStomp.spies.$$unSubscribeOf.calls.count()).toBe(2);
        expect(unSubscriber.connections).toEqual([{queue : 'b'}, {queue : 'c'}]);
    });

    it('should unSubscribe the nth registration', () => {
        /* Given */
        connections.push({queue : 'a', other : 'a', index : 1}, {queue : 'a', other : 'b', index : 2}, {queue : 'b', index : 3}, {queue : 'c', index : 4});

        /* When  */
        unSubscriber.unSubscribeNth(2);
        unSubscriber.unSubscribeNth(1);

        /* Then  */
        expect(ngStomp.spies.$$unSubscribeOf.calls.count()).toBe(2);
        expect(unSubscriber.connections.length).toBe(2);
    });

});