import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public readonly apiUrl = environment.backend.baseURL
  public readonly authUrl = environment.backend.authUrl

  constructor() {
  }
}
