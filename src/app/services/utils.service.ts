import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { ConstantsService } from './constants.service'
import { SnackService } from './snack.service'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private http: HttpClient,
              private constants: ConstantsService,
              private snack: SnackService) {
  }

  public getGeocodeMultipleAddresses(addresses: string[]): Observable<any> {
    const url = `${this.constants.apiUrl}utils/geocode/`
    return this.http.post(url, { addresses })
  }
}
