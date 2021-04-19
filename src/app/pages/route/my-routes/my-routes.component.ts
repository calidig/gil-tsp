import { Component, OnDestroy, OnInit } from '@angular/core'
import { RoutesService } from '../../../services/routes.service'
import { RouteModel } from '../../../models/route-model'
import { SubSink } from 'subsink'
import { LanguageService } from '../../../services/language.service'
import { Router } from '@angular/router'
import { MapViewService } from '../../../services/map-view.service'

@Component({
  selector: 'app-my-routes',
  templateUrl: './my-routes.component.html',
  styleUrls: ['./my-routes.component.scss']
})
export class MyRoutesComponent implements OnInit, OnDestroy {
  routes: RouteModel[]

  private subs = new SubSink()
  loading = true

  constructor(private routesService: RoutesService,
              public language: LanguageService,
              public router: Router,
              public mapViewService: MapViewService) {
  }

  ngOnInit(): void {
    console.log('get user routes with routesService')
    this.subs.add(this.routesService.getAll().subscribe(routes => {
      this.routes = routes
      this.loading = false
      console.log(this.routes)
    }, () => this.loading = false))
  }

  // onDelete(route: RouteModel) {
  //     this.subs.add(this.routesService.delete(route.id).subscribe(() => {
  //         this.routes = this.routes.filter(t => t.id !== route.id)
  //     }))
  // }

  gotoRouteStop(name, id, status): void {
    this.mapViewService.selectedRouteInfo = { name, id, status }
    this.router.navigate(['./', 'new-route', 'map', id])
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  deleteRoute(id): void {
    const oldRoutes = this.routes
    this.routes = this.routes.filter(t => t.id !== id)
    this.routesService.delete(id).subscribe(() => {
      }, error => {
        console.log(error)
        this.routes = oldRoutes
      }
    )
  }
}
