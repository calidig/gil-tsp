import { Component, Input } from '@angular/core'
import { MapViewService } from '../../services/map-view.service'

@Component({
  selector: 'app-route-details',
  templateUrl: './route-details.component.html',
  styleUrls: ['./route-details.component.scss']
})
export class RouteDetailsComponent {
  routeInfo // route info
  totalInfo

  constructor(public mapViewService: MapViewService) {
  }

  @Input() routeName: string

  @Input() set info(value) {
    this.routeInfo = value
    this.calcTotal()
  }

  getTime(t): string {
    if (!t) {
      return ''
    }
    const h = Math.floor(t / 3600)
    const m = Math.floor((t / 60)) - (h * 60)
    return `${h} hours and ${m} minutes`
  }

  getDistance(d): string {
    if (!d) {
      return ''
    }
    const km = Math.round(d / 1000)
    if (km < 5) {
      return `${d} m`
    }
    return `${km} KM`
  }

  calcTotal(): void {
    console.log('this.routeInfo', this.routeInfo)
    this.totalInfo = this.routeInfo.reduce((accumulator, currentValue) => {
      console.log(accumulator, currentValue)
      accumulator.eta += ((currentValue.etaMinutes || 0) + (parseInt(currentValue.break, 10) || 0))
      accumulator.distance += (currentValue.distance || 0)
      accumulator.boxes += (parseInt(currentValue.boxes, 10) || 0)
      return accumulator
    }, { eta: 0, distance: 0, boxes: 0 })
  }
}
