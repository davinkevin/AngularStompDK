/**
 * Created by kevin on 15/12/2015.
 */

import Builder from './builder';
import angular from 'angular';

describe('Builder', () => {

    let ngStomp = { subscribe : x => x}, topic = 'aTopic';
    let builder;

    beforeEach(() => {
        spyOn(ngStomp, 'subscribe').and.callThrough();
        builder = new Builder(ngStomp, topic);
    });

    it('should construct a coherent object', () => {
        expect(builder.ngStomp).toBe(ngStomp);
        expect(builder.topic).toBe(topic);
    });

    it('should subscribe with default parameters', () => {
        builder.build();
        expect(ngStomp.subscribe.calls.mostRecent().args).toEqual([topic, angular.noop, {}, {}])
    })


});
