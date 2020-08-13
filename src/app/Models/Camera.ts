import { Camera_State } from "./Enums/MarkerStates";

export interface ICamera {
    URL: string;
    Point: firebase.firestore.GeoPoint;
    CameraType: Camera_State;
}

export class Camera implements ICamera {
    URL: string;
    Point: firebase.firestore.GeoPoint;
    CameraType: Camera_State;

    constructor(camera: ICamera) {
        if (camera == null) {
            return;
        }
        this.URL = camera.URL;
        this.Point = camera.Point;
        this.CameraType = camera.CameraType;
    }

    getIcon(): string {
        let url = '';
        switch (this.CameraType) {
            case Camera_State.SELECTED:
                url = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
                break;
            case Camera_State.DESELECTED:
                url = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
                break;
            case Camera_State.LOADED:
                url = 'http://labs.google.com/ridefinder/images/mm_20_gray.png';
                break;
        }
        return url;
    }
}