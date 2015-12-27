/**
 * Created by kevin on 21/12/2015.
 */
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
        $rootScope = { $$phase : false, $apply : angular.noop };

    let ngStomp;

    beforeEach(() => {
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
        ngStomp = new NgStomp(settings, $q, $log, $rootScope, Stomp);
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

    it('should resolve in stomp', () => {
        let error = stompClient.connect.calls.argsFor(0)[3];
        $rootScope.$$phase = true;
        error();
        expect(defered.reject).toHaveBeenCalled();
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

    });


});