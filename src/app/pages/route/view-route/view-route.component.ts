import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { mergeMap } from 'rxjs/operators'
import { RoutesService } from '../../../services/routes.service'
import { SnackService } from '../../../services/snack.service'
import { ActivatedRoute } from '@angular/router'
import { SubSink } from 'subsink'
import { LanguageService } from '../../../services/language.service'
import { AuthService } from '../../../services/auth.service'
import { ConfigService } from '../../../services/config.service'
import { MapViewService } from '../../../services/map-view.service'
import { UserRoles } from '../../../models/user-roles'


@Component({
  selector: 'app-view-route',
  templateUrl: './view-route.component.html',
  styleUrls: ['./view-route.component.scss']
})
export class ViewRouteComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('googleMap') googleMapElement

  private subs = new SubSink()
  public startingRoute

  constructor(
    public auth: AuthService,
    private snack: SnackService,
    private route: RoutesService,
    public language: LanguageService,
    private activatedRoute: ActivatedRoute,
    public configService: ConfigService,
    public mapViewService: MapViewService
  ) {
  }

  async ngOnInit(): Promise<void> {
  }

  async ngAfterViewInit(): Promise<void> {
    this.activatedRoute.params.subscribe(({ id }) => this.mapViewService.render(this.googleMapElement?.googleMap || null, id))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  startRoute(): void {
    this.startingRoute = true
    this.activatedRoute.params.pipe(mergeMap(({ id }) => this.route.start(id))).subscribe(res => {
      this.startingRoute = false
      this.mapViewService.selectedRouteInfo.status = 'active'
      this.mapViewService.state.status = 'active'
      this.mapViewService.showDriverOnTheMap()
    }, () => {
      this.startingRoute = false
    })
  }

  stopRoute(): void {
    this.startingRoute = true
    this.activatedRoute.params.pipe(mergeMap(({ id }) => this.route.stop(id))).subscribe(res => {
      this.mapViewService.selectedRouteInfo.status = null
      this.startingRoute = false
    }, () => {
      this.startingRoute = false
    })
  }
}
