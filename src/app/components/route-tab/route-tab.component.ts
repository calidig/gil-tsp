import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MapViewService } from '../../services/map-view.service'
import { ConfigService } from '../../services/config.service'

@Component({
  selector: 'app-route-tab',
  templateUrl: './route-tab.component.html',
  styleUrls: ['./route-tab.component.scss']
})
export class RouteTabComponent implements OnInit {

  constructor(private router: Router,
              private mapViewService: MapViewService,
              public configService: ConfigService) {
  }

  ngOnInit(): void {
  }

  gotoRoute(route): void {
    try {
      if (this.mapViewService.selectedRouteInfo.id) {
        if (route === 'stops') {
          this.router.navigate(['./', 'new-route', 'map', this.mapViewService.selectedRouteInfo.id])
        }
        if (route === 'map') {
          this.router.navigate(['./', 'new-route', 'mapview', this.mapViewService.selectedRouteInfo.id])
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  gotoMyRoutes(): void {
    this.router.navigate(['./', 'my-routes'])
  }
}
