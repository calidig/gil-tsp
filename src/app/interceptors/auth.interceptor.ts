import { Injectable } from '@angular/core'
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private auth: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getAuthToken()}`
      }
    })

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error?.error?.type === 'access_token_expired') {
          console.log('access_token_expired')
          this.auth.logout()
        }
        return throwError(error)
      })
    )
  }
}
