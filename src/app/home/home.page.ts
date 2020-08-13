import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as firebase from 'firebase';
import { Event, IEvents } from '../Models/Events';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  newEvent = new Event();
  constructor(
    public toastController: ToastController,
    private router: Router,
    private db: AngularFirestore,
    private geolocation: Geolocation
  ) { }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Se ha alertado a la policia.',
      color: 'danger',
      duration: 2000
    });
    toast.present();

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();

    watch.toPromise().then((data) => {
      console.log(data);
      // data can be a set of coordinates, or an error (if an error occurred).
      this.newEvent.Point = new firebase.firestore.GeoPoint(data.coords.latitude, data.coords.longitude);
      this.newEvent.Descripcion = 'Robo';
      this.newEvent.Severity = 3;
      this.newEvent.timestamp = firebase.firestore.Timestamp.now();
      this.addEventPoint(this.newEvent);
    });
  }

  addEventPoint(event: IEvents) {
    return this.db.collection('Events').add(Object.assign({}, event));
  }
  addNewRecord() {
    this.router.navigate(['/register']);
  }


}
