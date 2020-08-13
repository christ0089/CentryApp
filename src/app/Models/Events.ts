import { EventSev } from "./Enums/MarkerStates";

export interface IEvents {
    Severity: EventSev;
    Point: firebase.firestore.GeoPoint;
    Descripcion: string;
    timestamp: firebase.firestore.Timestamp;
};

export class Event implements IEvents {
    Severity: EventSev;
    Point: firebase.firestore.GeoPoint;
    Descripcion: string;
    timestamp: firebase.firestore.Timestamp;
    state: string;
    constructor() {
        this.state = this.getEventState();
    }

    getIcon(): string {
        let url = "";
        switch (this.Severity) {
            case EventSev.LOW:
                url = "";
                break;
            case EventSev.MEDIUM:
                url = "";
                break;
            case EventSev.HIGH:
                url = "";
                break;
        }
        return url;
    }

    getEventState() {
        let state = "";
        switch (this.Severity) {
            case EventSev.LOW:
                state = "Low";
                break;
            case EventSev.MEDIUM:
                state = "Medium";
                break;
            case EventSev.HIGH:
                state = "High";
                break;
        }
        return state;
    }
}
