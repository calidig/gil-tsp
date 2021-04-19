import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConstantsService } from './constants.service'
import { Observable } from 'rxjs'
import { InviteUserModel } from '../models/invite-user-model'
import { TeamUserModel } from '../models/team-user-model'

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient,
              private constants: ConstantsService) {
  }

  getAll(): Observable<TeamUserModel[]> {
    const url = `${this.constants.apiUrl}team/`
    return this.http.get<TeamUserModel[]>(url)
  }

  getCars(): Observable<any> {
    const url = `${this.constants.apiUrl}team/cars`
    return this.http.get(url)
  }

  add(data: InviteUserModel): Observable<TeamUserModel> {
    const url = `${this.constants.apiUrl}team/`
    return this.http.post<TeamUserModel>(url, data)
  }

  remove(userId: string): Observable<any> {
    const url = `${this.constants.apiUrl}team/${userId}/`
    return this.http.delete(url)
  }

  getAvailableCars(): Promise<any> {
    const url = `${this.constants.apiUrl}team/cars/`
    return this.http.get(url).toPromise()
  }

  getActiveRoutes(): Observable<any> {
    const url = `${this.constants.apiUrl}team/active-routes`
    return this.http.get<any>(url)
  }
}
