/**
 * Created by kevin on 15/12/2015.
 */
//import {describe, it, expect} from 'jasmine';
import angular from 'angular';
import Builder from './builder';

describe('Builder', () => {

    let ngStomp = { subscribe : x => x}, firstTopic = 'aTopic', secondTopic = 'secondTopic';
    let builder;

    let transformToConnection = (queue, callback, headers, scope, json, digest, index) => ({queue, callback, headers, scope, json, digest, index });

    beforeEach(() => {
        spyOn(ngStomp, 'subscribe').and.returnValue(new Builder(ngStomp, secondTopic));
        builder = new Builder(ngStomp, firstTopic);
    });

    it('should construct a coherent object', () => {
        expect(builder.ngStomp).toBe(ngStomp);
        expect(builder.queue).toBe(firstTopic);
    });

    it('should subscribe with default parameters', () => {
        builder.build();
        expect(ngStomp.subscribe.calls.mostRecent().args).toEqual([firstTopic, angular.noop, {}, {}, false, true])
    });

    it('should subscribe', () => {
        let aCallback = x => x,
            headers = { foo : 'foo', bar : 'bar'},
            $scope = {};

        let unSubscriber = builder
                .callback(aCallback)
                .withHeaders(headers)
                .bindTo($scope)
                .withBodyInJson()
            .connect();

        expect(ngStomp.subscribe.calls.mostRecent().args).toEqual([firstTopic, aCallback, headers, $scope, true, true]);
        expect(unSubscriber.connections).toEqual([transformToConnection(firstTopic, aCallback, headers, $scope, true, true, 1)]);
    });

    it('should subscribe with chaining', () => {
        let aCallback = x => x,
            headers = { foo : 'foo', bar : 'bar'},
            $scope = {};

        let unSubscriber = builder
            .callback(aCallback)
            .withHeaders(headers)
            .bindTo($scope)
        .and()
            .subscribeTo(secondTopic)
            .callback(angular.noop)
            .withDigest(false)
        .connect();

        expect(ngStomp.subscribe.calls.argsFor(0)).toEqual([firstTopic, aCallback, headers, $scope, false, true]);
        expect(ngStomp.subscribe.calls.argsFor(1)).toEqual([secondTopic, angular.noop, {}, {}, false, false]);

        expect(unSubscriber.connections).toEqual([
            transformToConnection(firstTopic, aCallback, headers, $scope, false, true, 1),
            transformToConnection(secondTopic, angular.noop, {}, {}, false, false, 2)
        ]);
    });


});
