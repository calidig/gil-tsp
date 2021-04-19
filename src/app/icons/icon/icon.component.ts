import { Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild } from '@angular/core'
import { IconHostDirective } from '../directives/icon-host.directive'
import { MapSvgComponent } from '../components/map-svg/map-svg.component'
import { InfoSvgComponent } from '../components/info-svg/info-svg.component'
import { CheckMarkSvgComponent } from '../components/check-mark-svg/check-mark-svg.component'
import { ListThumbComponent } from '../components/list-thumb/list-thumb.component'
import { LanguageIconSvgComponent } from '../components/language-icon-svg/language-icon-svg.component'
import { ProfileComponent } from '../components/profile/profile.component'
import { LogoutSvgComponent } from '../components/logout-svg/logout-svg.component'
import { ExitSvgComponent } from '../components/exit-svg/exit-svg.component'
import { PresenterComponent } from '../components/presenter/presenter.component'

const IconMap: { [key in IconType]: Type<unknown> } = {
  map: MapSvgComponent,
  info: InfoSvgComponent,
  language: LanguageIconSvgComponent,
  profile: ProfileComponent,
  logout: LogoutSvgComponent,
  exit: ExitSvgComponent,
  'check-mark': CheckMarkSvgComponent,
  'list-thumb': ListThumbComponent,
  presenter: PresenterComponent
}

export type IconType =
  | 'map'
  | 'info'
  | 'check-mark'
  | 'list-thumb'
  | 'language'
  | 'profile'
  | 'logout'
  | 'exit'
  | 'presenter'

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input() icon: IconType
  @Input() fill: string

  @ViewChild(IconHostDirective, { static: true }) appIconHost: IconHostDirective

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.loadComponent()
  }

  loadComponent(): void {
    if (!this.icon || !IconMap[this.icon]) {
      return
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(IconMap[this.icon])

    const viewContainerRef = this.appIconHost.viewContainerRef
    viewContainerRef.clear()

    const componentRef = viewContainerRef.createComponent<{}>(componentFactory)
  }
}
