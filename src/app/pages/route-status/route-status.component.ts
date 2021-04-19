import { Component, OnDestroy, OnInit } from '@angular/core'
import { LanguageService } from '../../services/language.service'
import { RouteStatusModel } from '../../models/route-model'
import { Router } from '@angular/router'
import { interval } from 'rxjs'
import { SubSink } from 'subsink'
import { TspApiService } from '../../services/tsp-api.service'

@Component({
  selector: 'app-route-status',
  templateUrl: './route-status.component.html',
  styleUrls: ['./route-status.component.scss']
})
export class RouteStatusComponent implements OnInit, OnDestroy {

  routes: RouteStatusModel[]

  private subs = new SubSink()

  constructor(public tspApiService: TspApiService,
              private router: Router,
              public language: LanguageService
  ) {
  }

  ngOnInit(): void {
    this.subs.add(this.tspApiService.status().subscribe(data => {
      this.routes = data
      this.update()
    }))
  }

  update(): void {
    this.subs.add(interval(2000).subscribe(() =>
      this.routes.forEach((route) => {
        if (route.status !== 'completed') {
          const { id } = route
          this.tspApiService.fetchStatus(id).subscribe(newInfo => {
            const index = this.routes.findIndex(e => e.id === id)
            this.routes[index] = newInfo
            console.log('update: ', newInfo)
          }, error => {
            this.routes = this.routes.filter(t => t.id !== id)
          })
        }
      })
    ))
  }

  async open(route: RouteStatusModel): Promise<void> {
    if (route.status === 'completed') {
      await this.router.navigate(['new-route', 'map', route.id]).then(() => this.ngOnDestroy())
    }
  }


  sortBy(e): void {
    const { value } = e
    this.routes.sort((a, b) => a[value].localeCompare(b[value]))
  }

  getAsDate(dateString): Date {
    return new Date(dateString)
  }

  deleteRoute(route: RouteStatusModel): void {
    route.status = 'canceled'
    this.tspApiService.deleteRoute(route.id).subscribe(() => {
      // this.routes = this.routes.filter(t => t.id !== route.id)
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getStatusColor(status): string {
    switch (status) {
      case 'completed':
        return '#15b11e'
      case 'pending':
        return '#f57c00'
      case 'canceled':
        return '#512da8'
      case 'error':
        return '#d32f2f'
      case 'in progress':
        return 'rgba(8,175,182,0.78)'
    }
  }
}
