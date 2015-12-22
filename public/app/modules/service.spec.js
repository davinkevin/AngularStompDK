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
        promise = { then : angular.noop },
        defered = { promise : promise, resolve : angular.noop, reject : angular.noop},
        stompClient = { connect : x => x, heartbeat : {}, subscribe : angular.noop },
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
        spyOn($rootScope, '$apply').and.callThrough();
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
        ngStomp.subscribe('http://an.url.com/foo', callBack, {}, {});
        promise.then.calls.mostRecent().args[0]();
        stompClient.subscribe.calls.mostRecent().args[1]();

        /* Then */
        expect(pivotValue).toBe(10);
    });

});