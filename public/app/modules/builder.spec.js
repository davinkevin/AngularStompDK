/**
 * Created by kevin on 15/12/2015.
 */

import Builder from './builder';
import angular from 'angular';

describe('Builder', () => {

    let ngStomp = { subscribe : x => x}, firstTopic = 'aTopic', secondTopic = 'secondTopic';
    let builder;

    beforeEach(() => {
        spyOn(ngStomp, 'subscribe').and.returnValue(new Builder(ngStomp, secondTopic));
        builder = new Builder(ngStomp, firstTopic);
    });

    it('should construct a coherent object', () => {
        expect(builder.ngStomp).toBe(ngStomp);
        expect(builder.topic).toBe(firstTopic);
    });

    it('should subscribe with default parameters', () => {
        builder.build();
        expect(ngStomp.subscribe.calls.mostRecent().args).toEqual([firstTopic, angular.noop, {}, {}])
    });

    it('should subscribe', () => {
        let aCallback = x => x,
            headers = { foo : 'foo', bar : 'bar'},
            $scope = {};

        builder
            .callback(aCallback)
            .withHeaders(headers)
            .bindTo($scope)
            .build();

        expect(ngStomp.subscribe.calls.mostRecent().args).toEqual([firstTopic, aCallback, headers, $scope]);
    });

    it('should subscribe with chaining', () => {
        let aCallback = x => x,
            headers = { foo : 'foo', bar : 'bar'},
            $scope = {};

        builder
            .callback(aCallback)
            .withHeaders(headers)
            .bindTo($scope)
            .and()
            .build();

        expect(ngStomp.subscribe.calls.argsFor(0)).toEqual([firstTopic, aCallback, headers, $scope]);
        expect(ngStomp.subscribe.calls.argsFor(1)).toEqual([secondTopic, angular.noop, {}, {}]);
    });


});
