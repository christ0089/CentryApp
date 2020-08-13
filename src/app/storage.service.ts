import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageData: any[];
  lastIndex = 0;
  constructor(private storage: Storage) {
    this.loadStorageData();
  }


  addToStorage(newObject)  {
    this.lastIndex++;
    newObject["index"] = this.lastIndex;
    const addPromise = this.storage.set(this.lastIndex.toString(), Object.assign({}, newObject));
    Promise.resolve(addPromise).then(() => {
      this.storageData.push(newObject);
    });
  }

  observableOf():  Observable<any[]> {
    return of(this.storageData);
  }

  loadStorageData() {
    this.storage.ready().then(() => {
      this.storage.keys().then((keys) => {
        console.log(keys);
        keys.map((key) => {
          this.storageData.push(key);
        });
      }).catch((e) => {
        console.log(e);
      });
    }).catch((e) => {
      console.log(e);
    }); 
  }
 
  removeFromStorage(index) {
    this.storage.remove(index);
  }
}
