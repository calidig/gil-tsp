import { Injectable } from '@angular/core'
import { Credentials } from '../models/credentials'
import { ConstantsService } from './constants.service'
import { HttpClient } from '@angular/common/http'
import { SnackService } from './snack.service'
import { Router } from '@angular/router'
import jwt_decode from 'jwt-decode'
import { StorageService } from './storage.service'
import { Observable, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AuthDataModel } from '../models/auth-data-model'
import { UserRoles } from '../models/user-roles'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authData: AuthDataModel
  private authToken: {
    accessToken?: string,
    refreshToken?: string
  } = {}

  private authSubject$ = new Subject<boolean>()
  public auth$ = this.authSubject$.asObservable()

  constructor(private httpClient: HttpClient,
              private constants: ConstantsService,
              private snack: SnackService,
              private router: Router,
              private _storage: StorageService) {
  }

  private static decodedAccessToken(token: string): any {
    try {
      return jwt_decode(token)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public isAuthenticated(): boolean {
    // return !!this.authToken.refreshToken
    return !!this.authToken.accessToken
  }

  login(credentials: Credentials): Observable<any> {
    const url = `${this.constants.authUrl}login/`
    return this.httpClient.post(url, credentials)
      .pipe(tap(async session => {
        const accessToken = session.data.result
        this._storage.set({ accessToken })
        await this.updateState()
        await this.router.navigate(['new-route'])
      }))
  }

  refreshToken(): Observable<{ accessToken: string }> {
    const url = `${this.constants.authUrl}token/`
    const refreshToken = this.authToken
    return this.httpClient.post<{ accessToken: string }>(url, { refreshToken }).pipe(tap(({ accessToken }) => {
      console.log(accessToken)
    }))
  }

  register(credentials: Credentials): Observable<any> {
    const url = `${this.constants.authUrl}register/`
    return this.httpClient.post(url, credentials)
      .pipe(tap(async ({ data }: any) => {
        this.snack.display(data.result)
        await this.router.navigate(['auth', 'login'])
      }))
  }

  public isDriver(): boolean {
    return (this.authData?.role === UserRoles.driverInOrganization || this.authData?.role === UserRoles.driverInBranch)
  }

  public isManager(): boolean {
    return (this.authData?.role === UserRoles.organizationManager || this.authData?.role === UserRoles.branchManager)
  }

  async logout(): Promise<void> {
    await this.clearSession()
  }

  public getAuthToken(): string {
    return this.authToken.accessToken
  }

  public async updateState(): Promise<void> {
    const accessToken = this._storage.get('accessToken')
    const refreshToken = this._storage.get('refreshToken')

    console.log(accessToken)
    console.log(refreshToken)

    this.authToken = {
      accessToken, refreshToken
    }

    if (!this.isAuthenticated()) {
      return
    }

    this.authData = AuthService.decodedAccessToken(this.authToken.accessToken)
    console.log('authData', this.authData)

    this.authSubject$.next(true)
  }


  private async clearSession(): Promise<void> {
    this.authToken = {}
    this.authData = null
    this._storage.remove('accessToken')
    this._storage.remove('refreshToken')
    await this.router.navigate(['auth', 'login'])
    this.authSubject$.next(false)
  }
}
