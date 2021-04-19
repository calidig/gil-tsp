import { Injectable } from '@angular/core'
import { BehaviorSubject, forkJoin } from 'rxjs'
import { AuthService } from './auth.service'
import { LanguageService } from './language.service'
import { mergeMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

  // tslint:disable-next-line:variable-name
  private _loader = new BehaviorSubject<boolean>(false)

  public loaded$ = this._loader.asObservable()

  constructor(auth: AuthService,
              language: LanguageService) {
    forkJoin([auth.updateState()])
      .pipe(
        mergeMap(() => language.load())
      )
      .subscribe(() => {
        this._loader.next(true)
        this._loader.complete()
      })
  }
}
