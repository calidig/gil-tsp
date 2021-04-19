import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }


  private _set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  public set(key: string | object, value?: any): void {
    if (typeof key === 'string') {
      this._set(key, value)
    } else {
      if (typeof key === typeof {}) {
        for (const t in key) {
          if (key.hasOwnProperty(t)) {
            this._set(t, key[t])
          }
        }
      }
    }
  }

  get(key: string): any {
    const item = localStorage.getItem(key)
    if (item) {
      try {
        return JSON.parse(item)
      } catch (e) {
        console.error(e)
        console.log(`the "${key}" key was deleted!`)
        this.remove(key)
      }
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }

  set$(key: string, value: any): Observable<any> {
    return of(this.set(key, value))
  }

  get$(key: string): Observable<any> {
    return of(this.get(key))
  }
}
