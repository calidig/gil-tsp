import { Component, OnDestroy, OnInit } from '@angular/core'
import { ProfileModel } from '../../models/profile-model'
import { SubSink } from 'subsink'
import { AuthService } from '../../services/auth.service'
import { ProfileService } from '../../services/profile.service'
import { LanguageService } from '../../services/language.service'
import { SnackService } from '../../services/snack.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  profile: ProfileModel = {}
  private subs = new SubSink()

  constructor(private auth: AuthService,
              private profileService: ProfileService,
              public language: LanguageService) {
  }

  ngOnInit(): void {
    this.profile.email = this.auth.authData.email
    this.profile.username = this.auth.authData.email
    this.subs.add(this.profileService.get().subscribe(profile => {
      this.profile = { ...this.profile, ...profile }
      console.log(this.profile)
    }))
  }

  onSubmit(data): void {
    this.subs.add(this.profileService.set(data).subscribe(profile => {
      this.profile = profile
    }))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }


}
