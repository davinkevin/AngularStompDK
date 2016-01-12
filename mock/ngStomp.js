/**
 * Created by kevin on 12/01/2016.
 */

export default class NgStomp {

    constructor() {
        this.spies = {
            $$unsubscribeOf : spyOn(this, '$$unsubscribeOf').and.callThrough()
        }
    }

    $$unsubscribeOf(){}
}