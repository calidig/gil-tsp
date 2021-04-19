import { Injectable } from '@angular/core'
import { BehaviorSubject, fromEvent, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { ConstantsService } from './constants.service'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { debounceTime } from 'rxjs/operators'
import { UserRoles } from '../models/user-roles'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private sideMenuWidthSubject$: BehaviorSubject<number>
  public sideMenuWidth$: Observable<number>

  private readonly LARGE = 300
  private readonly MEDIUM = 68
  private readonly SMALL = 0


  private stateOptions = {
    open: 300,
    close: 0
  }

  private _isOpened: boolean
  public get isOpened(): boolean {
    return this._isOpened
  }

  public screenSize = {
    isSmall: false
  }

  constructor(private http: HttpClient,
              private constants: ConstantsService,
              private observer: BreakpointObserver,
              private auth: AuthService
  ) {
    this.sideMenuWidthSubject$ = new BehaviorSubject(this.LARGE)
    this.sideMenuWidth$ = this.sideMenuWidthSubject$.asObservable().pipe()
    this.onResize()
    fromEvent(window, 'resize').pipe(debounceTime(0)).subscribe(() => this.onResize())
  }

  getVersion(): Observable<{ version: string }> {
    const url = `${this.constants.apiUrl}version/`
    return this.http.get<{ version: string }>(url)
  }

  public toggleMenu(): void {
    this._isOpened = !this._isOpened
    this.sideMenuWidthSubject$.next(this._isOpened ? this.stateOptions.open : this.stateOptions.close)
  }

  onResize(): void {
    const isMedium = this.observer.isMatched('(min-width: 900px)')
    const isLarge = this.observer.isMatched('(min-width: 1440px)')

    this.screenSize.isSmall = false
    if (isLarge) {
      this._isOpened = true
    } else if (isMedium) {
      this._isOpened = false
      this.stateOptions.close = this.MEDIUM
    } else {
      this.screenSize.isSmall = true
      this.stateOptions.close = this.SMALL
      this._isOpened = false
    }

    this._isOpened = !this._isOpened

    this.toggleMenu()
  }

  areTabsDisplayed(): boolean {
    return this.screenSize.isSmall &&
      (this.auth.authData.role === UserRoles.driverInBranch ||
        this.auth.authData.role === UserRoles.driverInOrganization)
  }
}
