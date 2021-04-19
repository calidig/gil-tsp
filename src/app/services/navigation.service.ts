import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { LanguageService } from './language.service'
import { AuthService } from './auth.service'
import { UserRoles } from '../models/user-roles'

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private sideMenuSubject$ = new BehaviorSubject(this.getMenuItems())

  public sideMenuItems$ = this.sideMenuSubject$.asObservable()

  constructor(private language: LanguageService,
              private auth: AuthService) {
    language.language$.subscribe(() => {
      this.sideMenuSubject$.next(this.getMenuItems())
    })
    auth.auth$.subscribe(state => {
      this.sideMenuSubject$.next(this.getMenuItems())
    })
  }

  // TODO: CHECK TYPE
  private getMenuItems(): { title: any, url: string, icon: string, roles: string[], color: string }[] {
    if (!this.auth.isAuthenticated()) {
      return []
    }
    console.log('authData: ', this.auth.authData)
    console.log(this.auth.authData.role)
    return [
      {
        title: this.language.translationsDictionary.dashboard,
        url: '/dashboard',
        icon: 'list-thumb', // TODO: update icon
        color: 'black',
        roles: [UserRoles.organizationManager, UserRoles.branchManager]
      },
      {
        title: 'Demo',
        url: '/demo',
        icon: 'presenter',
        color: '#001942',
        roles: [UserRoles.admin]
      }
      , {
        title: this.language.translationsDictionary.newRoute,
        url: '/new-route',
        icon: 'map',
        color: 'red',
        roles: [UserRoles.organizationManager, UserRoles.branchManager]
      },
      {
        title: this.language.translationsDictionary.admin,
        url: '/admin',
        icon: 'map',
        color: 'purple',
        roles: [UserRoles.admin]
      },
      {
        title: this.language.translationsDictionary.profile,
        url: '/auth/profile',
        icon: 'profile',
        color: '#03a9f4',
        roles: [UserRoles.all]
      },
      {
        title: this.language.translationsDictionary.routes,
        url: '/my-routes',
        icon: 'list-thumb',
        color: 'red',
        roles: [UserRoles.driverInOrganization, UserRoles.driverInBranch]
      },
      {
        title: this.language.translationsDictionary.tasks,
        url: '/route/status',
        icon: 'list-thumb',
        color: '#ff9800',
        roles: [UserRoles.organizationManager, UserRoles.branchManager]
      },
      {
        title: this.language.translationsDictionary.team,
        url: '/team',
        icon: 'list-thumb',
        color: 'black',
        roles: [UserRoles.organizationManager, UserRoles.branchManager]
      }
    ].filter(r => r.roles[0] === UserRoles.all || r.roles.includes(this.auth.authData.role))
  }
}
