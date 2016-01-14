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
        connections.push({queue : 'a', other : 'a'}, {queue : 'a', other : 'b'}, {queue : 'b'}, {queue : 'c'});

        /* When  */
        unSubscriber.unSubscribeNth(2);

        /* Then  */
        expect(ngStomp.spies.$$unSubscribeOf.calls.count()).toBe(1);
        expect(unSubscriber.connections.length).toBe(4);
    });

});