import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { StorageService } from '../../../services/storage.service'

@Component({
  selector: 'app-demo-result',
  templateUrl: './demo-result.component.html',
  styleUrls: ['./demo-result.component.scss']
})
export class DemoResultComponent implements OnInit {

  theirResult
  ourResult

  stats = {
    distance: null,
    time: null
  }

  constructor(private router: Router, private storage: StorageService) {
    this.theirResult = this.router.getCurrentNavigation().extras.state?.theirResult
    this.ourResult = this.router.getCurrentNavigation().extras.state?.ourResult

    if (!this.theirResult) {
      this.theirResult = storage.get('theirResult')
      this.ourResult = storage.get('ourResult')
    } else {
      storage.set('theirResult', this.theirResult)
      storage.set('ourResult', this.ourResult)
    }
  }

  ngOnInit(): void {
    console.log(this.theirResult)
    console.log(this.ourResult)

    const ourTotal = this.ourResult?.reduce((prev, next) => ({
      distance: prev.distance + next.distance,
      etaMinutes: prev.etaMinutes + next.etaMinutes
    }))

    const theirTotal = this.theirResult?.reduce((prev, next) => ({
      distance: prev.distance + next.distance,
      etaMinutes: prev.etaMinutes + next.etaMinutes
    }))


    if (ourTotal && theirTotal) {
      this.stats.distance = ((ourTotal.distance - theirTotal.distance) / theirTotal.distance * 100).toFixed(1)
      this.stats.time = ((ourTotal.etaMinutes - theirTotal.etaMinutes) / theirTotal.etaMinutes * 100).toFixed(1)
    }
  }
}
