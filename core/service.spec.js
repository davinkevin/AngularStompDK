/**
 * Created by kevin on 21/12/2015.
 */
//import {describe, it, expect} from 'jasmine';
import NgStomp from './service';
import angular from 'angular';

describe('Service', () => {

    let settings = {
        "url": "http://connection.com/url",
        "login": "login",
        "password": "password",
        "class": angular.noop,
        "debug": true,
        "vhost": "vhost",
        "timeOut" : 5000,
        "heartbeat": {
            "outgoing": 1,
            "incoming": 2
        }
    };

    let Stomp = { client : x => x, over : x => x},
        $q = { defer : x => x },
        promise = { then : func => func() },
        defered = { promise : promise, resolve : angular.noop, reject : angular.noop},
        aConnection = { unsubscribe : angular.noop },
        stompClient = { connect : x => x, heartbeat : {}, subscribe : () => aConnection, send : angular.noop, disconnect : func => func() },
        $log = {},
        $rootScope = { $$phase : false, $apply : angular.noop },
        $timeout;

    let ngStomp;

    beforeEach(() => {
        $timeout = jasmine.createSpy('$timeout');
        spyOn($q, 'defer').and.returnValue(defered);
        spyOn(defered, 'resolve').and.callThrough();
        spyOn(defered, 'reject').and.callThrough();
        spyOn(promise, 'then').and.callThrough();
        spyOn(Stomp, 'client').and.returnValue(stompClient);
        spyOn(Stomp, 'over').and.returnValue(stompClient);
        spyOn(stompClient, 'connect').and.callThrough();
        spyOn(stompClient, 'subscribe').and.callThrough();
        spyOn(stompClient, 'send').and.callThrough();
        spyOn(stompClient, 'disconnect').and.callThrough();
        spyOn($rootScope, '$apply').and.callThrough();
        spyOn(aConnection, 'unsubscribe').and.callThrough();
        ngStomp = new NgStomp(settings, $q, $log, $rootScope, $timeout, Stomp);
    });

    it('should be defined with custom settings', () => {
        ngStomp = new NgStomp({
            "url": "http://connection.com/url",
            "login": "login",
            "password": "password",
            "class": angular.noop,
            "debug": true,
            "vhost": "vhost"
        }, $q, $log, $rootScope, $timeout, Stomp);
        expect(stompClient.connect.calls.argsFor(0)[0]).toEqual(settings.login);
        expect(stompClient.connect.calls.argsFor(0)[1]).toEqual(settings.password);
        expect(stompClient.connect.calls.argsFor(0)[4]).toEqual(settings.vhost);
    });

    it('should be coherent object', () => {
        expect(ngStomp).toBeDefined();
        expect(stompClient.connect.calls.argsFor(0)[0]).toEqual(settings.login);
        expect(stompClient.connect.calls.argsFor(0)[1]).toEqual(settings.password);
        expect(stompClient.connect.calls.argsFor(0)[4]).toEqual(settings.vhost);
    });

    it('should resolve in stomp', () => {
        let success = stompClient.connect.calls.argsFor(0)[2];
        success();
        expect(defered.resolve).toHaveBeenCalled();
    });

    it('should subscribe', () => {
        /* Given */
        let pivotValue = 0,
            callBack = () => pivotValue = 10;

        /* When */
        ngStomp.subscribe('/topic/foo', callBack, {}, {});
        stompClient.subscribe.calls.mostRecent().args[1]();

        /* Then */
        expect(pivotValue).toBe(10);
        expect(ngStomp.connections.has('/topic/foo')).toBeTruthy();
    });

    it('should subscribe with json', () => {
        /* Given */
        let pivotValue = 0,
            callBack = (val) => pivotValue = val.body.a;

        /* When */
        ngStomp.subscribe('/topic/foo', callBack, {}, {}, true);
        stompClient.subscribe.calls.mostRecent().args[1]({ body : "{ \"a\":10, \"b\":5 }"});

        /* Then */
        expect(pivotValue).toBe(10);
        expect(ngStomp.connections.has('/topic/foo')).toBeTruthy();
    });


    it('should return builder on subscribeTo', () => {
        let builder = ngStomp.subscribeTo('aTopic');
        expect(builder.topic).toBe('aTopic');
    });

    it('should unsubscribe from topic', () => {
        ngStomp.subscribe('/topic/foo', angular.noop, {}, {});
        ngStomp.unsubscribe('/topic/foo');

        expect(aConnection.unsubscribe).toHaveBeenCalled();
    });

    it('should unsubscribe if scope is destroyed', () => {
        let aScope = { $on : angular.noop };
        spyOn(aScope, '$on').and.callThrough();

        ngStomp.subscribe('/topic/foo', angular.noop, undefined, aScope);
        aScope.$on.calls.mostRecent().args[1]();

        expect(aScope.$on).toHaveBeenCalled();
        expect(aScope.$on.calls.mostRecent().args[0]).toBe('$destroy');
        expect(aConnection.unsubscribe).toHaveBeenCalled();
    });

    it('should unsubscribe from unsubscriber', () => {
        /* Given */
        let topic = 'foo';
        let callback1 = x => x, header1 = {}, scope1 = {}, sub1 = jasmine.createSpyObj('sub1', ['unsubscribe']),
            callback2 = y => y, header2 = {}, scope2 = {}, sub2 = jasmine.createSpyObj('sub2', ['unsubscribe']);

        ngStomp.connections.set(topic, [
            {callback : callback1, header : header1, scope : scope1, sub : sub1},
            {callback : callback2, header : header2, scope : scope2, sub : sub2}
        ]);

        /* When */
        ngStomp.$$unsubscribeOf({queue : topic, callback : callback2, header : header2, scope : scope2});

        /* Then */
        expect(sub1.unsubscribe).not.toHaveBeenCalled();
        expect(sub2.unsubscribe).toHaveBeenCalled();
        expect(ngStomp.connections.get(topic).length).toBe(1);
    });

    describe('when connected', () => {

        beforeEach(() => {
            ngStomp.subscribe('/queue/foo', angular.noop);
        });

        it('should send data', () => {
            let aPromise = ngStomp.send('/queue/foo', { foo : 'bar', to : 'foo'}, {});

            expect(stompClient.send).toHaveBeenCalled();
            expect(aPromise).toBe(promise);
        });

        it('should send data without header', () => {
            let aPromise = ngStomp.send('/queue/foo', { foo : 'bar', to : 'foo'});

            expect(stompClient.send).toHaveBeenCalled();
            expect(aPromise).toBe(promise);
        });

        it('should disconnect', () => {
            let aPromise = ngStomp.disconnect();
            expect(stompClient.disconnect).toHaveBeenCalled();
            expect(aPromise).toBe(promise);
        });

        it('should handle a disconnection', () => {
            let timeOutreconnectOnError = stompClient.connect.calls.argsFor(0)[3];
            $rootScope.$$phase = true;

            timeOutreconnectOnError();
            $timeout.calls.first().args[0]();

            expect($timeout.calls.first().args[1]).toBe(settings.timeOut);
            expect(stompClient.connect.calls.argsFor(1)[0]).toEqual(settings.login);
            expect(stompClient.connect.calls.argsFor(1)[1]).toEqual(settings.password);
            expect(stompClient.connect.calls.argsFor(1)[4]).toEqual(settings.vhost);
        });

    });



});