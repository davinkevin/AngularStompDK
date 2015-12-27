import AngularStompDK from './angular-stomp';
import 'angular-mocks';

describe('angular-stomp', () => {

    let Stomp;
    let ngstompProvider;

    beforeEach(module(AngularStompDK.name, (_ngstompProvider_) => {
        ngstompProvider = _ngstompProvider_;
    }));

    describe('Provider', () => {

        beforeEach(inject());

        it('should have a provider', () => {
            expect(ngstompProvider).toBeDefined();
            expect(ngstompProvider.$get).toBeDefined();
        });
    });

    describe('Stomp', () => {

        beforeEach(inject((_Stomp_) => {
            Stomp = _Stomp_;
        }));

        it('should have a service', () => {
            expect(Stomp).toBeDefined();
        });
    });

});