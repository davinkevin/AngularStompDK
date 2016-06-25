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
        $rootScope = { $$phase : false, $apply : angular.noop, $applyAsync : func => func() },
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
        spyOn($rootScope, '$applyAsync').and.callThrough();
        spyOn(aConnection, 'unsubscribe').and.callThrough();
        ngStomp = new NgStomp(angular.copy(settings), $q, $log, $rootScope, $timeout, Stomp);
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
        ngStomp.subscribe('/topic/foo', callBack, {}, { $applyAsync : func => func() });
        stompClient.subscribe.calls.mostRecent().args[1]();

        /* Then */
        expect(pivotValue).toBe(10);
        expect(ngStomp.connections.filter(c => c.queue ==='/topic/foo').length > 0).toBeTruthy();
    });

    it('should subscribe with json', () => {
        /* Given */
        let pivotValue = 0,
            callBack = (val) => pivotValue = val.body.a;

        /* When */
        ngStomp.subscribe('/topic/foo', callBack, {}, { $applyAsync : func => func() }, true);
        stompClient.subscribe.calls.mostRecent().args[1]({ body : "{ \"a\":10, \"b\":5 }"});

        /* Then */
        expect(pivotValue).toBe(10);
        expect(ngStomp.connections.filter(c => c.queue ==='/topic/foo').length > 0).toBeTruthy();
    });

    describe('with connection failed at boot up', () => {

        let $q = {defer : x => x }, defferedWitchReject = {
            promise : { then : (_, func) => func() },
            resolve : angular.noop,
            reject : angular.noop
        };

        beforeEach(() => {
            spyOn($q, 'defer').and.returnValue(defferedWitchReject);
            spyOn(defferedWitchReject, 'resolve').and.callThrough();
            spyOn(defferedWitchReject, 'reject').and.callThrough();
            spyOn(defferedWitchReject.promise, 'then').and.callThrough();
            ngStomp = new NgStomp(angular.copy(settings), $q, $log, $rootScope, $timeout, Stomp);
        });

        it('should save connection if connection failed', () => {
            /* Given */
            let pivotValue = 0, callBack = (val) => pivotValue = val.body.a;
            /* When  */
            ngStomp.subscribe('/topic/foo', callBack, {}, {});

            /* Then  */
            expect(ngStomp.connections.length).toBe(1);
        });

    });


    it('should return builder on subscribeTo', () => {
        let builder = ngStomp.subscribeTo('aTopic');
        expect(builder.queue).toBe('aTopic');
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
            callback2 = y => y, header2 = {}, scope2 = {}, sub2 = jasmine.createSpyObj('sub2', ['unsubscribe']),
            callback3 = y => y, header3 = {}, scope3 = {}, sub3 = jasmine.createSpyObj('sub3', ['unsubscribe']);

        ngStomp.connections = [
            {queue : topic, callback : callback1, header : header1, scope : scope1, sub : sub1},
            {queue : topic, callback : callback2, header : header2, scope : scope2, sub : sub2},
            {queue : 'bar', callback : callback3, header : header3, scope : scope3, sub : sub3}
        ];

        /* When */
        ngStomp.$$unSubscribeOf({queue : topic, callback : callback2, header : header2, scope : scope2});

        /* Then */
        expect(sub1.unsubscribe).not.toHaveBeenCalled();
        expect(sub2.unsubscribe).toHaveBeenCalled();
        expect(sub3.unsubscribe).not.toHaveBeenCalled();
        expect(ngStomp.connections.length).toBe(2);
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

        it('should handle a disconnection and reconnect after time defined in setting.timeOut if positive', () => {
            let connectionsCount = ngStomp.connections.length;
            let timeOutreconnectOnError = stompClient.connect.calls.argsFor(0)[3];
            $rootScope.$$phase = true;


            timeOutreconnectOnError();
            $timeout.calls.first().args[0]();

            expect($timeout.calls.first().args[1]).toBe(settings.timeOut);
            expect(stompClient.connect.calls.argsFor(1)[0]).toEqual(settings.login);
            expect(stompClient.connect.calls.argsFor(1)[1]).toEqual(settings.password);
            expect(stompClient.connect.calls.argsFor(1)[4]).toEqual(settings.vhost);
            expect(ngStomp.connections.length).toBe(connectionsCount);
        });

        it('should do noting on disconnection because of configuration', () => {
            let connectionsCount = ngStomp.connections.length;
            ngStomp.settings.timeOut = -1;
            let timeOutreconnectOnError = stompClient.connect.calls.argsFor(0)[3];
            $rootScope.$$phase = true;

            timeOutreconnectOnError();

            expect($timeout).not.toHaveBeenCalled();
            expect(stompClient.connect).toHaveBeenCalledTimes(1);
            expect(ngStomp.connections.length).toBe(connectionsCount);
        })

    });



});