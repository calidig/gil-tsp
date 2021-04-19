import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ProfileModel } from '../models/profile-model'
import { ConstantsService } from './constants.service'
import { InviteUserModel } from '../models/invite-user-model'
import { tap } from 'rxjs/operators'
import { SnackService } from './snack.service'

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient,
              private constants: ConstantsService,
              private snack: SnackService) {
  }

  get(): Observable<ProfileModel> {
    const url = `${this.constants.apiUrl}profile/`
    return this.http.get<ProfileModel>(url)
  }

  getOne(id): Observable<ProfileModel> {
    const url = `${this.constants.apiUrl}profile/${id}`
    return this.http.get<ProfileModel>(url)
  }

  set(data: InviteUserModel): Observable<ProfileModel> {
    const url = `${this.constants.apiUrl}profile/`
    return this.http.post<ProfileModel>(url, data)
      .pipe(tap(() => this.snack.success()))
  }

}
