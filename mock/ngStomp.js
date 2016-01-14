/**
 * Created by kevin on 12/01/2016.
 */

export default class NgStomp {

    constructor() {
        this.spies = {
            $$unSubscribeOf : spyOn(this, '$$unSubscribeOf').and.callThrough()
        }
    }

    $$unSubscribeOf(){}
}