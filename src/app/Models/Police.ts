import { PoliceState } from "./Enums/PoliceState";

export interface IPolice {
    Nombre: string;
    Image: string;
    Status: string;
    StartTime: firebase.firestore.Timestamp;
}


export class Police implements IPolice {
    Nombre: string;
    Image: string;
    State: PoliceState;
    Status: string;
    StartTime: firebase.firestore.Timestamp;
    
    constructor() {
        
    }


}