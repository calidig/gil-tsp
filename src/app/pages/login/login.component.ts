import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { LanguageService } from '../../services/language.service'
import { SnackService } from '../../services/snack.service'
import { SubSink } from 'subsink'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loading: boolean
  loginForm: FormGroup
  private subs = new SubSink()

  constructor(public auth: AuthService,
              private fb: FormBuilder,
              public language: LanguageService,
              private snack: SnackService) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login(): void {
    this.loading = true
    this.subs.sink = this.auth.login(this.loginForm.value).subscribe({
      error: err => {
        // TODO: ensure strings
        this.snack.showErrorMessage(err.error)
        this.loading = false
      }
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }


}
