export enum EventRanges {
    DAY = 1,
    WEEK = 7,
    MONTH = 30
};

export class EventRangeClass {
    ranges: EventRanges;
    rangesString: string;
    constructor(range = EventRanges.DAY) {
        this.ranges = range;
        this.rangesString = this.getRangeInString();
    }
    getRangeInString() {
        let range = '';
        switch (this.ranges) {
            case EventRanges.DAY:
                range = 'Día';
                break;
            case EventRanges.WEEK:
                range = 'Semana';
                break;
            case EventRanges.MONTH:
                range = 'Mes';
                break;
        }
        return range;
    }
}