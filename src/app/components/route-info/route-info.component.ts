import { Component, Input, OnInit } from '@angular/core'
import { GeoPoint, RouteInfo } from '../../models/route-model'
import { LanguageService } from '../../services/language.service'
import { RoutesService } from '../../services/routes.service'
import { SnackService } from '../../services/snack.service'
import { AuthService } from '../../services/auth.service'
import { mergeMap } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
import { MapViewService } from '../../services/map-view.service'

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.scss']
})
export class RouteInfoComponent implements OnInit {

  @Input() disableSelect = true
  @Input() public data: RouteInfo[]

  @Input() public showStatus

  nextPointIndex

  constructor(public language: LanguageService,
              private routesService: RoutesService,
              private snack: SnackService,
              public auth: AuthService,
              private activatedRoute: ActivatedRoute,
              public mapViewService: MapViewService,
              private route: RoutesService) {
  }

  ngOnInit(): void {
    this.updateIndex()
  }

  openInGoogleUrl(index): string {
    let origin: GeoPoint
    let destination: GeoPoint

    origin = this.data[(index - 1) < 0 ? this.data.length - 1 : index - 1].geolocation
    destination = this.data[index].geolocation
    return `https://waze.com/ul?q=${destination.lat},${destination.lng}&navigate=yes&zoom=17`
  }

  asDate(dateString): Date {
    const date = new Date(dateString) // TODO: FIX ETA!!!
    // @ts-ignore
    // tslint:disable-next-line:triple-equals
    if (date != 'Invalid Date') {
      return date
    }
    return new Date()
  }

  public updateStatus(e: Event, route: RouteInfo): void {
    const value = (e.target as HTMLInputElement).value
    route.status = value
    if (value) {
      this.routesService.updateDeliverStatus(route.id, value).subscribe(() => {
        this.snack.success()
        this.updateIndex()
      }, error => {
        route.status = null
        this.snack.showErrorMessage(error)
        this.updateIndex()
      })
    }
  }

  updateIndex(): void {
    this.nextPointIndex = this.data.findIndex(t => !t.status)
    if (this.nextPointIndex === -1 && (this.mapViewService.state?.status === 'active')) {
      this.finishRoute()
    }
    console.log('this.nextPointIndex', this.nextPointIndex)
  }

  finishRoute(): void {
    if (this.auth.isDriver()) {
      this.activatedRoute.params.pipe(mergeMap(({ id }) => this.route.finish(id))).subscribe(() => {
        this.mapViewService.selectedRouteInfo.status = 'finished'
      }, error => {
        this.snack.showErrorMessage(error)
      })
    }
  }

  async updateComment(delivery: RouteInfo): Promise<void> {
    const r = await this.routesService.updateComment(delivery.id, delivery.comment).toPromise()
    console.log(this.data)
  }
}
