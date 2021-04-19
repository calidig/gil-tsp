import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConstantsService } from './constants.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  private baseUrl = `${this.constants.apiUrl}admin/`

  constructor(private http: HttpClient,
              private constants: ConstantsService) {
  }

  public getAllUsers(): Observable<any> {
    const url = `${this.baseUrl}user/`
    return this.http.get(url)
  }

  public updateUser(user): Observable<any> {
    const url = `${this.baseUrl}user/${user.id}`
    return this.http.put(url, user)
  }

  public deleteUser(id): Observable<any> {
    const url = `${this.baseUrl}user/${id}`
    return this.http.delete(url)
  }

  public registerUser(user): Observable<any> {
    const url = `${this.baseUrl}user/`
    return this.http.post(url, user)
  }

  public getSettings(): Observable<any> {
    const url = `${this.baseUrl}settings/`
    return this.http.get(url)
  }

  public deleteSetting(id): Observable<any> {
    const url = `${this.baseUrl}settings/${id}`
    return this.http.delete(url)
  }

  public updateSetting(setting): Observable<any> {
    const url = `${this.baseUrl}settings/${setting.id}`
    return this.http.put(url, setting)
  }

  public createSetting(setting): Observable<any> {
    const url = `${this.baseUrl}settings/`
    return this.http.post(url, setting)
  }

  public getSettingsByType(type): Observable<any> {
    const url = `${this.baseUrl}settings/${type}`
    return this.http.get(url)
  }

  public getRoles(): Observable<string[]> {
    const url = `${this.baseUrl}/role`
    return this.http.get<string[]>(url)
  }

  public getOrganizationWithBr(): Observable<string[]> {
    const url = `${this.baseUrl}o/org-with-branch`
    return this.http.get<string[]>(url)
  }

  public getOrganizations(): Observable<any> {
    const url = `${this.baseUrl}o/organization/`
    return this.http.get(url)
  }

  public deleteOrganization(id): Observable<any> {
    const url = `${this.baseUrl}o/organization/${id}`
    return this.http.delete(url)
  }

  public updateOrganization(o): Observable<any> {
    const url = `${this.baseUrl}o/organization/${o.id}`
    return this.http.put(url, o)
  }

  public createOrganization(o): Observable<any> {
    const url = `${this.baseUrl}o/organization/`
    return this.http.post(url, o)
  }

  public getBranches(): Observable<any> {
    const url = `${this.baseUrl}o/branch/`
    return this.http.get(url)
  }

  public deleteBranch(id): Observable<any> {
    const url = `${this.baseUrl}o/branch/${id}`
    return this.http.delete(url)
  }

  public updateBranch(branch): Observable<any> {
    const url = `${this.baseUrl}o/branch/${branch.id}`
    return this.http.put(url, branch)
  }

  public createBranch(branch): Observable<any> {
    const url = `${this.baseUrl}o/branch/`
    return this.http.post(url, branch)
  }
}
