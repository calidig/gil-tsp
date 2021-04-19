import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() {
  }

  public minutesToLongTime(k: number): string {
    let delta = k * 60
    const days = Math.floor(delta / 86400)
    delta -= days * 86400

    const hours = Math.floor(delta / 3600) % 24
    delta -= hours * 3600

    const minutes = Math.floor(delta / 60) % 60

    return `${days} days, ${hours} hours, ${minutes} minutes`
  }
}
