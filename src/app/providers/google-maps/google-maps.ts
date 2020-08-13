import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICamera, Camera } from 'src/app/Models/Camera';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IEvents } from 'src/app/Models/Events';
import { Camera_State } from 'src/app/Models/Enums/MarkerStates';

declare const google;


export const buttonStyle = `
color: #ff4081;
box-sizing: border-box;
position: relative;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
cursor: pointer;
outline: 0;
border: none;
-webkit-tap-highlight-color: transparent;
display: inline-block;
white-space: nowrap;
text-decoration: none;
vertical-align: baseline;
text-align: center;
margin: 0;
min-width: 88px;
line-height: 36px;
padding: 0 16px;
border-radius: 2px;
overflow: visible;
`
/*
  Generated class for the GoogleMapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleMapsProvider {
  title = 'Securitas';
  displayCameras$ = new BehaviorSubject<ICamera[]>([]);
  displayCameras = [];
  markers = [];
  selectedCamera: ICamera = null;
  defaultRadius = new BehaviorSubject<number>(30);

  constructor(
    public http: HttpClient,
    private db: AngularFirestore
  ) {
    console.log('Hello GoogleMapsProvider Provider');
  }

  getCameras(): Observable<ICamera[]> {
    return this.displayCameras$;
  }

  setMapCenter(map, camera) {
    map.setCenter({ lat: camera.Point.latitude, lng: camera.Point.longitude });
  }

  setEventMarker(map, event: IEvents) {
    this.addEventPoint(event).then(() => {
      const marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: { lat: event.Point.latitude, lng: event.Point.longitude },
        icon: {
          url: 'http://maps.google.com/mapfiles/kml/pal3/icon33.png'
        }
      });
      this.markers.push(marker);
    }).catch(e => {
      return;
    });
  }

  addMarkersPoint(map, camera: Camera, index: number) {
    const title = this.title;

    const marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: { lat: camera.Point.latitude, lng: camera.Point.longitude },
      icon: {
        url: camera.getIcon()
      }
    });

    if (camera.CameraType === Camera_State.SELECTED) {
      this.selectedCamera = camera;
    }

    this.markers.push(marker);

    const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      `<h1 id="firstHeading" class="firstHeading">${title}</h1>` +
      '<img id="image0" src="' + camera.URL + '" class="img-responsive" >' +
      '<button style="' +  buttonStyle + '"id="setPivot">Camara Pivote</button>' +
      '<div id="bodyContent">' +
      '</div>' +
      '</div>';

    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function () {
      infowindow.open(map, marker);
    });

    google.maps.event.addListener(infowindow, 'domready', () => {
      const el = document.getElementById('setPivot');
      el.addEventListener('click', (event) => this.setPivotMaker(map, index, camera));
    });
  }

  setPivotMaker(map: any, index, camera) {
    this.setMapCenter(map, camera);
    this.getMarkers(map, camera.Point.latitude, camera.Point.longitude).toPromise().catch(e => {
      console.error(e);
    });
  }

  resetMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
    this.displayCameras = [];
    this.displayCameras$.next([]);
  }


  getMarkers(_map, lat, lon) {
    const area = this.updatePoints(lat, lon, this.defaultRadius.getValue());
    this.resetMarkers();
    return this.db.collection('DataPoints', (ref) => {
      const query = ref
        .orderBy('Point', 'desc');
      return query;
    }).valueChanges()
      .pipe(map((dataPoints: ICamera[]) => {
        if (dataPoints === null) return null;
        dataPoints.forEach((element: ICamera, index) => {
          const new_camera = new Camera(element);
          if (this.withinBouds(area, element.Point) === true) {
            if (element.Point.latitude === lat && element.Point.longitude === lon) {
              new_camera.CameraType = Camera_State.SELECTED;
            } else {
              new_camera.CameraType = Camera_State.DESELECTED;
            }
            this.displayCameras.push(element);
            this.displayCameras$.next(this.displayCameras);
          } else {
            new_camera.CameraType = Camera_State.LOADED;
          }
          this.addMarkersPoint(_map, new_camera, index);
        });
        return dataPoints;
      }));
  }


  updatePoints(latitude, longitude, distance) {
    const lat = 0.0144927536231884;
    const lon = 0.0181818181818182;
    const lowerLat = latitude-(lat * distance);
    const lowerLon = longitude-(lon * distance);

    const greaterLat = latitude + (lat * distance);
    const greaterLon = longitude + (lon * distance);

    const lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLon);
    const greaterGeopoint = new firebase.firestore.GeoPoint(greaterLat, greaterLon);
    return [lesserGeopoint, greaterGeopoint];
  }

  withinBouds(bounds: firebase.firestore.GeoPoint[], point: firebase.firestore.GeoPoint): boolean {
    console.log(point);
    console.log(bounds);
    if (bounds[0].latitude <= point.latitude && bounds[1].latitude >= point.latitude) {
      console.log("Within Lats");
      if (bounds[0].longitude <= point.longitude && bounds[1].longitude >= point.longitude) {
        return true;
      }
    }
    return false;
  }

  addCameraPoint(camera: ICamera) {
    const ref = this.db.collection('DataPoints').add(Object.assign({}, camera)).then(() => {
    }).catch(() => {
    });
  }
  addEventPoint(event: IEvents) {
    return this.db.collection('Events').add(Object.assign({}, event));
  }
}
