import { Component, Input, OnInit } from '@angular/core'
import { TimeService } from '../../../services/time.service'

@Component({
  selector: 'app-demo-stats',
  templateUrl: './demo-stats.component.html',
  styleUrls: ['./demo-stats.component.scss']
})
export class DemoStatsComponent implements OnInit {

  @Input() result: {
    distance: number
    etaMinutes: number
  }[]

  @Input() title: string

  total: {
    distance: number
    etaMinutes: number
  }

  constructor(public timeService: TimeService) {
  }

  ngOnInit(): void {
    this.total = this.result?.reduce((prev, next) => ({
      distance: prev.distance + next.distance,
      etaMinutes: prev.etaMinutes + next.etaMinutes
    }))
  }


}
