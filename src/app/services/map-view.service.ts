import { Injectable, NgZone } from '@angular/core'
import { SnackService } from './snack.service'
import { interval, Observable } from 'rxjs'
import { catchError, switchMap, tap } from 'rxjs/operators'
import { ProfileService } from './profile.service'
import * as moment from 'moment'
import { AuthService } from './auth.service'
import { TspApiService } from './tsp-api.service'
import { RoutesService } from './routes.service'
import { SubSink } from 'subsink'
import { CSVData } from '../models/initial-data-model'

@Injectable({
  providedIn: 'root'
})
export class MapViewService {
  private _selectedRouteInfo: any = {}
  private directionsService = new google.maps.DirectionsService()

  private CHUNK_LENGTH = 27 // 25 + 2 (source + origin)

  center: google.maps.LatLngLiteral
  private subs = new SubSink()


  state: {
    name?: string
    algorithm: string
    data: {
      csvRecords: CSVData[],
      startTime: any,
      driverId: string,
    }[],
    status: 'active' | 'finished',
    startAt?: Date
  }

  private routeId: string
  private driverMarker: google.maps.Marker
  private mapElement: google.maps.Map = null
  infoTablesPreview = []
  activeMarkers: google.maps.Marker[] = []
  activeDirectionsRender: google.maps.DirectionsRenderer[] = []

  private clear(): void {
    this.activeMarkers.forEach(t => t.setMap(null)) // remove markers
    this.activeDirectionsRender.forEach(t => t.setMap(null)) // remove routes from the map
    this.driverMarker?.setMap(null)
    this.infoTablesPreview = []
    this.activeMarkers = []
    this.activeDirectionsRender = []
    this.mapElement = null
    this.driverMarker = null
    this.routeId = null
    this.state = null
    this.subs.unsubscribe()
  }

  constructor(private snack: SnackService,
              private profileService: ProfileService,
              public auth: AuthService,
              private tspApiService: TspApiService,
              private route: RoutesService,
              private zone: NgZone
  ) {
  }

  get selectedRouteInfo(): any {
    return this._selectedRouteInfo
  }

  set selectedRouteInfo(value: any) {
    console.log('selectedRouteInfo: ', value)
    this._selectedRouteInfo = value
  }

  public getStatus(): string | null {
    return this.selectedRouteInfo?.status || this.state?.status
  }

  public render(googleMap: google.maps.Map, routeId): void {
    this.clear()
    this.routeId = routeId
    this.mapElement = googleMap
    this.init()
  }

  private init(): void {
    this.getRoute(this.routeId).subscribe(async state => {
      console.log('STATE !!!!!: ', state)
      this.state = state
      this.showDriverOnTheMap()
      try {
        this.updateCenter()
      } catch (e) {
        console.error(e)
      }
      await this.generateMap()
    })
  }

  private getRoute(id): Observable<any> {
    if (this.auth.isManager()) {
      return this.tspApiService.fetchRoute(id).pipe(catchError(e => {
        return this.route.getOne(id).pipe(tap(result => {
          result.data = result.info
        }))
      }))
    }

    if (this.auth.isDriver()) {
      return this.route.getOne(id).pipe(tap(result => {
        result.data = result.info
      }))
    }
  }

  public findCenter(data: CSVData[] | CSVData[][]): google.maps.LatLngLiteral {
    console.log(data)
    const csvRecords = [].concat.apply([], data)
    const center = csvRecords.map(row => row.geolocation)
      .reduce((a: any, c: any) => ({
        lat: a.lat + c.lat,
        lng: a.lng + c.lng
      }))
    center.lat = center.lat / csvRecords.length
    center.lng = center.lng / csvRecords.length
    return center
  }

  // state:  route response from api
  private updateCenter(): void {
    console.log('update center: ', this.state)
    const data = this.state.data.map(d => d.csvRecords)
    this.center = this.findCenter(data)
  }

  public randDarkColor(): string {
    const lum = -0.25
    let hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '')
    let rgb = '#'
    let c
    let i
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16)
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
      rgb += ('00' + c).substr(c.length)
    }
    return rgb
  }

  getMarker(i, color = '#EA4335'): string {
    color = color.replace('#', '%23')
    return `data:image/svg+xml,<svg%20version%3D"1.1"%20width%3D"27px"%20height%3D"43px"%20viewBox%3D"0%200%2027%2043"%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20xmlns%3Axlink%3D"http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink">%0A<defs>%0A<path%20id%3D"a"%20d%3D"m12.5%200c-6.9039%200-12.5%205.5961-12.5%2012.5%200%201.8859%200.54297%203.7461%201.4414%205.4617%203.425%206.6156%2010.216%2013.566%2010.216%2022.195%200%200.46562%200.37734%200.84297%200.84297%200.84297s0.84297-0.37734%200.84297-0.84297c0-8.6289%206.7906-15.58%2010.216-22.195%200.89844-1.7156%201.4414-3.5758%201.4414-5.4617%200-6.9039-5.5961-12.5-12.5-12.5z"%2F>%0A<%2Fdefs>%0A<g%20fill%3D"none"%20fill-rule%3D"evenodd">%0A<g%20transform%3D"translate(1%201)">%0A<use%20fill%3D"${color}"%20fill-rule%3D"evenodd"%20xlink%3Ahref%3D"%23a"%2F>%0A<path%20d%3D"m12.5-0.5c7.18%200%2013%205.82%2013%2013%200%201.8995-0.52398%203.8328-1.4974%205.6916-0.91575%201.7688-1.0177%201.9307-4.169%206.7789-4.2579%206.5508-5.9907%2010.447-5.9907%2015.187%200%200.74177-0.6012%201.343-1.343%201.343s-1.343-0.6012-1.343-1.343c0-4.7396-1.7327-8.6358-5.9907-15.187-3.1512-4.8482-3.2532-5.01-4.1679-6.7768-0.97449-1.8608-1.4985-3.7942-1.4985-5.6937%200-7.18%205.82-13%2013-13z"%20stroke%3D"%23fff"%2F>%0A<%2Fg>%0A<text%20text-anchor%3D"middle"%20dy%3D"0.3em"%20x%3D"14"%20y%3D"15"%20font-family%3D"Roboto%2C%20Arial%2C%20sans-serif"%20font-size%3D"16px"%20fill%3D"%23FFF">${i}<%2Ftext>%0A<%2Fg>%0A<%2Fsvg>%0A`
  }

  public buildGoogleRequest(waypoints, stDate): any {
    let startDate = new Date()
    if (startDate < new Date(stDate)) {
      startDate = stDate
    }
    return {
      origin: waypoints[0].location,
      destination: waypoints[waypoints.length - 1].location,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: startDate,
        trafficModel: google.maps.TrafficModel.PESSIMISTIC
      },
      provideRouteAlternatives: false,
      waypoints: waypoints.slice(1, -1)
    }
  }

  public callGoogleDirectionService(request): Promise<google.maps.DirectionsResult> {
    console.log('%c callGoogleDirectionService ', 'background: #222; color: #bada55')
    return new Promise((resolve, reject) => {
      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          return resolve(result)
        }
        this.snack.showErrorMessage(status)
        return reject(status)
      })
    })
  }

  public buildChunks(waypoints: any[], chunk = []): any[] {
    console.log('interation')
    if (chunk.length * this.CHUNK_LENGTH < waypoints.length) {
      let lastChunk = chunk.length * this.CHUNK_LENGTH - 1
      if (lastChunk - 1 < 0) {
        lastChunk = 0
      }
      const next = (chunk.length + 1) * this.CHUNK_LENGTH
      console.log({ chunk: [...chunk] })
      chunk.push(waypoints.slice(lastChunk, next))
      console.log({ lastChunk, next, waypoints, chunk: [...chunk], wl: waypoints.length, cll: chunk.length * this.CHUNK_LENGTH })
      return this.buildChunks(waypoints, chunk)
    }
    return chunk
  }

  public sumTime(state, arr, index): number {
    let sum = 0
    for (let i = 0; i <= index; i++) {
      sum += arr[i].duration.value
      if (i > 0) {
        sum += 60 * state.csvRecords[i].timeInPoint
      }
    }
    return sum
  }

  public showDriverOnTheMap(): void {
    // TODO: rotate car pin!
    console.log('showDriverLocation: ', this.state)
    if (this.state?.status !== 'active') {
      return
    }
    this.driverMarker = this.addMarker({ icon: '/assets/icons/car-top-view.svg' })
    this.subs.add(interval(2000).pipe(switchMap(() => this.route.getDriverLocation(this.routeId))).subscribe(({ geolocation }) => {
      console.log(geolocation)
      this.driverMarker.setPosition(geolocation)
    }))
  }

  getDirectionsRender(strokeColor?): google.maps.DirectionsRenderer {
    const directionsRenderer = new google.maps.DirectionsRenderer({
      markerOptions: {
        visible: false
      }
    })
    directionsRenderer.setMap(this.mapElement)
    directionsRenderer.setOptions({
      polylineOptions: { strokeColor }
    })
    return directionsRenderer
  }

  public addMarker(options?: google.maps.ReadonlyMarkerOptions): any {
    return new google.maps.Marker({
      map: this.mapElement,
      ...options
    })
  }

  async generateMap(): Promise<void> {
    this.state.data.forEach((state, index) => setTimeout(async () => {

      console.log('GENERATE MAPS: ', { state })
      const waypoints = state.csvRecords.map(row => ({
        location: row.geolocation,
        stopover: true
      }))
      const chunks = this.buildChunks(waypoints)

      console.log('WAYPOINTS: ', waypoints)
      console.log('chunk', chunks)
      // return

      console.log({ waypoints })

      state.startTime = new Date(state.startTime)
      if (state.startTime < new Date()) {
        state.startTime = new Date()
      }

      const results = await Promise.all(chunks.map(chunk => this.callGoogleDirectionService(this.buildGoogleRequest(chunk, state.startTime))))

      console.log('%c result ', 'background: #eee; color: #00FF00')

      console.log({ results })
      let info = []
      const color = this.randDarkColor()
      results.forEach((result, ind) => {
        console.log('google result', result)
        console.log('ok: ', waypoints)
        const directionsRender = this.getDirectionsRender(color)
        this.activeDirectionsRender.push(directionsRender)
        directionsRender.setDirections(result)
        waypoints.slice(0, -1).forEach((point, i) => {
          this.activeMarkers.push(this.addMarker({
            position: point.location,
            icon: { url: this.getMarker(i + 1, color) },
            title: this?.state?.data[index].csvRecords[i]?.address
          }))
        })
        info = this.processRouteInfo(result.routes[0], ind, state, info)
      })

      // process route info
      this.profileService.getOne(state.driverId).subscribe(driverInfo => {
        this.zone.run(() => {
          this.infoTablesPreview.push({ driver: `${driverInfo.lastName || ''} ${driverInfo.firstName || ''}`, info })
          console.log('infoTablesPreview: ', this.infoTablesPreview)
        })
      })

    }, 500 * index))
  }

  private processRouteInfo(route, ind, state, info = []): any[] {
    console.log('processRouteInfoState: ', state)
    console.log('processRouteInfoRoute: ', route)
    // TODO: test time
    console.log('info before: ', [...info])


    if (ind === 0) {
      console.log('%c processs ', 'background: #eee; color: #34043')

      info.push({
        ...state.csvRecords[0],
        address: state.csvRecords[0].address,
        eta: new Date(this.state.startAt || state.startTime),
        phone: null,
        geolocation: state.csvRecords[0].geolocation,
        break: 0,
        checked: false
      })

      console.log('info 0: ', info)
    }
    info = [...info, ...route.legs.map((r, i, arr) => {
      // TODO: test time
      const estimatedTimeInPoint = moment(this.state.startAt || state.startTime).add(this.sumTime(state, arr, i), 'seconds').toDate()

      let csvIndex = ind * this.CHUNK_LENGTH + i
      if (ind === 0) {
        csvIndex++
      }

      const csvRecord = (state.csvRecords[csvIndex])
      console.log({ ind, ch: this.CHUNK_LENGTH, csvRecord, i, csv: state.csvRecords })
      return {
        ...csvRecord,
        address: csvRecord.address,
        eta: `${estimatedTimeInPoint.toLocaleDateString()}  ${estimatedTimeInPoint.toLocaleTimeString()}`,
        phone: csvRecord.phone,
        geolocation: csvRecord.geolocation,
        description: csvRecord.description,
        break: csvRecord.timeInPoint,
        boxes: csvRecord.demand,
        checked: false,
        etaMinutes: r.duration.value, // TODO:  on split
        distance: r.distance.value
      }
    })]
    console.log('info after: ', [...info])
    return info
  }
}
