import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PoliceService {

  constructor(private db: AngularFirestore) { }

  getPolice() {
    return this.db.collection('Policias', (ref) => {
      const query = ref
        .orderBy('StartTime', 'desc');
      return query;
    }).valueChanges();

  }
}
