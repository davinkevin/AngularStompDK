/**
 * Created by kevin on 20/12/2015.
 */
import Provider from './provider';

describe('Provider', () => {

    let provider,
        Stomp = { client : x => x, over : x => x},
        $q = { defer : x => x },
        defered = { promise : 'promise' },
        stompClient = { connect : x => x, heartbeat : {}},
        $log = {},
        $rootScope = {};

    beforeEach(() => {
        spyOn($q, 'defer').and.returnValue(defered);
        spyOn(Stomp, 'client').and.returnValue(stompClient);
        spyOn(Stomp, 'over').and.returnValue(stompClient);
        provider = new Provider();
    });

    it('should be auto configured', () => {
        const connectionUrl = '/anUrl';

        let ngStomp = provider
            .url(connectionUrl)
            .$get($q, $log, $rootScope, Stomp);

        expect(ngStomp.settings).toEqual({ url : connectionUrl })
    });

    it('should be configured by fluent api', () => {
        const connectionUrl = '/anotherUrl',
            login = 'login', password = 'password',
            vhost = 'vhost';

        let ngStomp = provider
            .url(connectionUrl)
            .credential(login, password)
            .class(angular.noop)
            .debug(true)
            .vhost(vhost)
            .heartbeat(1, 2)
            .$get($q, $log, $rootScope, Stomp);

        expect(ngStomp.settings).toEqual({
            "url": connectionUrl,
            "login": login,
            "password": password,
            "class": angular.noop,
            "debug": true,
            "vhost": vhost,
            "heartbeat": {
                "outgoing": 1,
                "incoming": 2
            }
        });
    });

    it('should be configured by fluent api', () => {
        const connectionUrl = '/anotherUrl',
            login = 'login', password = 'password',
            vhost = 'vhost';

        let ngStomp = provider
            .url(connectionUrl)
            .credential(login, password)
            .class(angular.noop)
            .debug(true)
            .vhost(vhost)
            .heartbeat()
            .$get($q, $log, $rootScope, Stomp);

        expect(ngStomp.settings).toEqual({
            "url": connectionUrl,
            "login": login,
            "password": password,
            "class": angular.noop,
            "debug": true,
            "vhost": vhost,
            "heartbeat": {
                "outgoing": 10000,
                "incoming": 10000
            }
        })
    });

});
