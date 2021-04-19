import { Component, OnInit } from '@angular/core'
import { ConfigService } from '../../services/config.service'
import { LanguageService } from '../../services/language.service'
import { NavigationService } from '../../services/navigation.service'
import { AuthService } from '../../services/auth.service'
import { animate, state, style, transition, trigger } from '@angular/animations'

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        maxHeight: '{{items}}px'
      }), {
        params: { items: 0 }
      }),
      state('closed', style({
        maxHeight: '0'
      })),
      transition('open => closed', [
        animate('.1s')
      ]),
      transition('closed => open', [
        animate('.1s')
      ])
    ])
  ]
})
export class AppLayoutComponent implements OnInit {

  languages: string[]
  version: string

  selectedIndex
  selectedLanguage
  showLanguageOptions: boolean

  constructor(public cfg: ConfigService,
              public language: LanguageService,
              public navigation: NavigationService,
              public auth: AuthService) {
  }

  ngOnInit(): void {
    this.languages = Object.keys(this.language.languagesConfigs)

    this.language.language$.subscribe(languageConfig => {
      this.selectedLanguage = languageConfig.lg
    })

    this.cfg.getVersion().subscribe(version => {
      this.version = version.version
    })
  }
}
