import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConstantsService } from './constants.service'
import { LanguageService } from './language.service'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { RouteStatusModel } from '../models/route-model'

@Injectable({
  providedIn: 'root'
})
export class TspApiService {
  constructor(private http: HttpClient,
              private constants: ConstantsService,
              private language: LanguageService) {
  }

  public solveRoute(data): Observable<any> {
    const url = `${this.constants.apiUrl}alg/tsp/`
    return this.http.post(url, data, { responseType: 'text' })
  }

  public solveDemoRoute(data): Observable<any> {
    const url = `${this.constants.apiUrl}alg/demo/`
    return this.http.post(url, data)
  }

  public getDemoRoute(id: string): Observable<any> {
    const url = `${this.constants.apiUrl}alg/demo/${id}`
    return this.http.get(url)
  }

  public parseImg(file): Promise<{ data: { parsed_text } }> {
    const url = `${this.constants.apiUrl}ocr/`
    const formData = new FormData()
    formData.append('image', file)
    formData.append('lg', this.language.activeLanguage.lg)
    return this.http.post<any>(url, formData).toPromise()
  }

  public parseCsv(text): Promise<any> {
    const url = `${this.constants.apiUrl}csv/`
    return this.http.post<any>(url, { csv: text }).pipe(map(t => t.data.result)).toPromise()
  }


  public status(): Observable<RouteStatusModel[]> {
    const url = `${this.constants.apiUrl}alg/status/`
    return this.http.get<RouteStatusModel[]>(url)
  }

  public fetchStatus(id): Observable<RouteStatusModel> {
    const url = `${this.constants.apiUrl}alg/status/${id}`
    return this.http.get<RouteStatusModel>(url)
  }

  public fetchRoute(id): Observable<any> {
    const url = `${this.constants.apiUrl}alg/route/${id}`
    return this.http.get<any>(url)
  }

  public deleteRoute(id): Observable<any> {
    const url = `${this.constants.apiUrl}alg/route/${id}`
    return this.http.delete<any>(url)
  }

  public getByFlag(type): Observable<any> {
    const url = `${this.constants.apiUrl}settings/${type}`
    return this.http.get(url)
  }
}
