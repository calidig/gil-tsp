import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConstantsService } from './constants.service'
import { Observable } from 'rxjs'
import { RouteModel } from '../models/route-model'

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private http: HttpClient,
              private constants: ConstantsService) {
  }

  getOne(id: string): Observable<RouteModel> {
    const url = `${this.constants.apiUrl}route/${id}/`
    return this.http.get<RouteModel>(url)
  }

  delete(id: string): Observable<RouteModel> {
    const url = `${this.constants.apiUrl}route/${id}/`
    return this.http.delete<RouteModel>(url)
  }

  getAll(): Observable<RouteModel[]> {
    const url = `${this.constants.apiUrl}route/`
    return this.http.get<RouteModel[]>(url)
  }

  start(id: string): Observable<any> {
    const url = `${this.constants.apiUrl}route/start/${id}/`
    return this.http.post(url, {})
  }

  stop(id: string): Observable<any> {
    const url = `${this.constants.apiUrl}route/stop/${id}/`
    return this.http.post(url, {})
  }

  finish(id: string): Observable<any> {
    const url = `${this.constants.apiUrl}route/finish/${id}/`
    return this.http.post(url, null)
  }

  updateDeliverStatus(deliverId, status): Observable<RouteModel> {
    const url = `${this.constants.apiUrl}route/deliver`
    return this.http.post<RouteModel>(url, { deliverId, status })
  }

  getAllWithStatus(): Observable<any> {
    const url = `${this.constants.apiUrl}route/all-with-status`
    return this.http.get<any>(url)
  }

  getAllWithStatusByDay(date: Date): Observable<any> {
    const today = new Date()
    const yesterday = new Date(today)

    yesterday.setDate(yesterday.getDate() - 1)
    const url = `${this.constants.apiUrl}route/all-with-status/${yesterday.toJSON()}`
    return this.http.get<any>(url)
  }

  getDriverLocation(routeId): Observable<any> {
    const url = `${this.constants.apiUrl}location/${routeId}`
    return this.http.get<any>(url)
  }

  getStats(routeInfo): Observable<any> {
    const url = `${this.constants.apiUrl}route/stats`
    return this.http.post<any>(url, routeInfo)
  }

  updateComment(deliveryId, comment): Observable<any> {
    const url = `${this.constants.apiUrl}route/delivery/${deliveryId}`
    return this.http.post<any>(url, { comment })
  }
}
