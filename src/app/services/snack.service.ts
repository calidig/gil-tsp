import { Injectable } from '@angular/core'
import { LanguageService } from './language.service'
import { SnackBarService } from './snack-bar.service'
import { ToastType } from '../models/toast-config'

@Injectable({
  providedIn: 'root'
})
export class SnackService {


  constructor(private languageService: LanguageService, private snackBar: SnackBarService) {
  }

  public display(message, type: ToastType = 'success'): void {
    if (typeof message !== 'string') {
      return this.somethingWrong()
    }
    // TODO: create a toaster
    this.snackBar
      .show({
        text: message,
        type
      })
    // this.toastController.create({ message, duration }).then(toast => toast.present())
  }

  public showErrorMessage(err: any): void {
    console.log({err})
    if (typeof err === typeof '') {
      this.display(`${err}`, 'warning')
    } else if (typeof err === typeof {}) {
      const errorMessage = err?.error?.message || err.message
      this.display(`${errorMessage}`, 'warning')
    }
  }

  public somethingWrong(): void {
    this.showErrorMessage('Something went wrong!')
  }

  public success(): void {
    this.display(this.languageService.translationsDictionary.success)
  }

  public saved(): void {
    this.display(this.languageService.translationsDictionary.saved)
  }
}
