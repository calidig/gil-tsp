import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MapSvgComponent } from './components/map-svg/map-svg.component'
import { IconComponent } from './icon/icon.component'
import { IconHostDirective } from './directives/icon-host.directive';
import { InfoSvgComponent } from './components/info-svg/info-svg.component';
import { CheckMarkSvgComponent } from './components/check-mark-svg/check-mark-svg.component';
import { ListThumbComponent } from './components/list-thumb/list-thumb.component';
import { LanguageIconSvgComponent } from './components/language-icon-svg/language-icon-svg.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LogoutSvgComponent } from './components/logout-svg/logout-svg.component';
import { ExitSvgComponent } from './components/exit-svg/exit-svg.component';
import { PresenterComponent } from './components/presenter/presenter.component'


@NgModule({
  declarations: [
    MapSvgComponent,
    IconComponent,
    IconHostDirective,
    InfoSvgComponent,
    CheckMarkSvgComponent,
    ListThumbComponent,
    LanguageIconSvgComponent,
    ProfileComponent,
    LogoutSvgComponent,
    ExitSvgComponent,
    PresenterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IconComponent
  ]
})
export class IconsModule {
}
