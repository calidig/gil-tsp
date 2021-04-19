import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { SnackService } from '../services/snack.service'
import { UserRoles } from '../models/user-roles'

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService,
              private snack: SnackService,
              private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let roles = next.data.role
    roles = Array.isArray(roles) ? roles : [roles]
    if (roles.includes(this.auth.authData.role)) {
      return true
    } else {
      switch (this.auth.authData.role) {
        case UserRoles.admin:
          this.router.navigate(['/', 'admin'])
          break
        case UserRoles.branchManager:
          this.router.navigate(['/', 'new-route'])
          break
        case UserRoles.organizationManager:
          this.router.navigate(['/', 'new-route'])
          break
        case UserRoles.driverInOrganization:
          this.router.navigate(['/', 'my-routes'])
          break
        case UserRoles.driverInBranch:
          this.router.navigate(['/', 'my-routes'])
          break
      }
      return false
    }
  }
}
