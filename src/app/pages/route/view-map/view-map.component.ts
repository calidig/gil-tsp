import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MapViewService } from '../../../services/map-view.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.scss']
})
export class ViewMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('googleMap') googleMapElement

  constructor(public mapViewService: MapViewService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.mapViewService.render(this.googleMapElement.googleMap, id))

  }

  ngOnDestroy(): void {
  }
}
