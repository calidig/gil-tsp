import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { SnackService } from '../services/snack.service'
import { AuthService } from '../services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public constructor(private auth: AuthService,
                     private snack: SnackService,
                     private router: Router
  ) {
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let authState = this.auth.isAuthenticated()

    if (next.data.auth === false) {
      authState = !authState
    }

    if (!authState) {
      if (next.data.auth === false) {
        this.router.navigate(['/'])
      } else {
        //  TODO: language
        // this.snack.showErrorMessage('please do sing in')
        this.router.navigate(['auth', 'login'])
      }
    }
    return authState
  }
}
