import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/Models/Events';
declare const google;
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private db: AngularFirestore) { }

  getEvents(date = new Date(), multiplier = 1) {
    const endData = date;
    const startDate = new Date(Date.now() - 86400000 * multiplier);
    console.log(endData);
    console.log(startDate);

    return this.db.collection('Events', (ref) => {
      const query = ref
        .where('timestamp', '<=', endData)
        .where('timestamp', '>=', startDate)
        .orderBy('timestamp', 'desc');
      return query;
    }).valueChanges();
  }

  addEventMarker(map, dataPoints: Event[]) {
    const lat = 19.432470;
    const lon = -99.16884;

    const location = new google.maps.LatLng(lat, lon);
    map = new google.maps.Map(map, {
      center: location,
      zoom: 13,
    });
    const eventPoints = dataPoints.map((data: Event) => {
      return {location: new google.maps.LatLng(data.Point.latitude, data.Point.longitude), weight: data.Severity};
    });
    console.log(eventPoints);
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: eventPoints,
      radius: 50
    });
    heatmap.setMap(map);
  }

}
