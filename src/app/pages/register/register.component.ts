import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { SubSink } from 'subsink'
import { AuthService } from '../../services/auth.service'
import { LanguageService } from '../../services/language.service'
import { SnackService } from '../../services/snack.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  loading: boolean

  registerForm: FormGroup
  public errorMatcher = {
    isErrorState(control: FormControl | null,
                 form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted
      return !!(
        control &&
        control.invalid && (control.dirty || control.touched || isSubmitted)
        || form.hasError('notMatch') && (control.dirty || control.touched || isSubmitted)
      )
    }
  }
  private subs = new SubSink()

  constructor(public auth: AuthService,
              private fb: FormBuilder,
              public language: LanguageService,
              private snack: SnackService
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',
        [
          Validators.required
        ]
      ],
      confirmPassword: ['', [Validators.required]],
      organization: ['', [Validators.required]]
    }, { validators: this.checkPasswords })
  }

  register(): void {
    const credentials = this.registerForm.value
    delete credentials.confirmPassword
    this.loading = true
    this.subs.sink = this.auth.register(credentials).subscribe({
      error: (err) => {
        if (err.error && err.error['']) {
          err.error[''].forEach(message => {
            this.snack.showErrorMessage(message)
          })
        }
        this.loading = false
      }
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  private checkPasswords: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return control.get('password').value === control.get('confirmPassword').value ? null : { notMatch: true }
  }

}
