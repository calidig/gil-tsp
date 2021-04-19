import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { TspApiService } from '../../../services/tsp-api.service'
import { SnackService } from '../../../services/snack.service'
import { LanguageService } from '../../../services/language.service'
import { delay, map, retryWhen, tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { UtilsService } from '../../../services/utils.service'
import { RoutesService } from '../../../services/routes.service'

export interface DemoInputModel {
  fileType: string
  file?: File
  startPoint?: string
  country?: string
  pointsDemand: number
  carsCapacities: number
  timeInPoint: number
  carsDistanceLimit: number
  carsTimeLimit: number
  numberOfCars?: number
  flags: { [key: string]: boolean }
  csvRec?: {
    demand?: number
    timeInPoint?: number
    address: string
    geolocation?: null | {
      lng: number,
      lat: number
    }
    driver?: string
    orderIndex?: number | string
  }[]
  algoTimeLimit: number
}

@Component({
  selector: 'app-demo-input',
  templateUrl: './demo-input.component.html',
  styleUrls: ['./demo-input.component.scss']
})
export class DemoInputComponent implements OnInit {

  @ViewChild('f', { static: true }) fileInput: ElementRef

  data: DemoInputModel = {
    fileType: 'csv',
    pointsDemand: 1,
    timeInPoint: 0,
    carsCapacities: 50,
    carsDistanceLimit: 999999.999,
    carsTimeLimit: 50,
    algoTimeLimit: 10,
    flags: {}
  }

  availableCountries = []
  flags = []

  loading = false

  constructor(private tspApi: TspApiService,
              private snack: SnackService,
              public language: LanguageService,
              private router: Router,
              private routesService: RoutesService,
              private utils: UtilsService) {
  }

  ngOnInit(): void {
    this.tspApi.getByFlag('available_countries').subscribe(t => this.availableCountries = t)
    this.tspApi.getByFlag('algo_flags').pipe(tap(t => {
      t.forEach(flag => this.data.flags[flag.name] = false)
      this.data.flags.time_flag = true
      this.data.flags.distance_flag = true
      this.data.flags.demand_flag = true
    })).subscribe(t => this.flags = t)
  }

  async handleFileInput(e): Promise<void> {
    this.data.file = e.target.files[0]
    let text

    if (this.data.fileType === 'csv') {
      text = await this.renderFile(this.data.file)
    } else if (this.data.fileType === 'img') {
      const result = await this.tspApi.parseImg(this.data.file)
      text = result.data.parsed_text
    }

    const mapDict = {
      'Address/Place': 'address',
      Driver: 'driver'
    }

    try {
      const csvTmp = await this.tspApi.parseCsv(text)

      csvTmp.forEach(o => {
        Object.keys(o).forEach(key => {
          const newKey = mapDict[key]
          if (!newKey) {
            this.snack.showErrorMessage(`${this.language.translationsDictionary.invalidKeyInCSV}: ${key}`)
          }
          if (key !== newKey) {
            Object.defineProperty(o, newKey,
              Object.getOwnPropertyDescriptor(o, key))
            delete o[key]
          }
        })
      })
      this.data.csvRec = csvTmp
    } catch (e) {
      this.data.file = null
      this.fileInput.nativeElement.value = null
      this.snack.showErrorMessage(e?.error?.message || 'The api is not available')
    }

    console.log(this.data)
  }

  private renderFile(file): Promise<string> {
    return new Promise((resolve => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target.result as string
        resolve(data)
      }
      reader.readAsText(file)
    }))
  }

  async onSubmit(form): Promise<void> {
    this.loading = true
    if (form.invalid) {
      this.snack.showErrorMessage(this.language.translationsDictionary.formInvalid)
      this.loading = false
      return
    }
    if (!this.data?.csvRec?.length || !this.data?.startPoint) {
      this.snack.showErrorMessage(this.language.translationsDictionary.formInvalid)
      return
    }
    const data = { ...this.data }
    delete data.file
    delete data.fileType

    const geocode = await this.utils.getGeocodeMultipleAddresses(data.csvRec.map(t => t.address)).toPromise()
    data.csvRec.forEach((t, i) => {
      t.geolocation = geocode[i]
      t.demand = this.data.pointsDemand
      t.timeInPoint = this.data.timeInPoint
    })

    const routes = this.groupBy(data.csvRec, 'driver')
    data.numberOfCars = data.numberOfCars || Object.keys(routes).length
    this.data.numberOfCars = data.numberOfCars
    console.log(data)

    const tmp: any = { ...data }
    tmp.carsTimeLimit = Math.floor(tmp.carsTimeLimit * 3600)
    tmp.carsDistanceLimit = Math.floor(tmp.carsDistanceLimit * 1000)

    tmp.csvRecords = tmp.csvRec

    const startingPointGeolocation: any[] = await this.utils.getGeocodeMultipleAddresses([data.startPoint]).toPromise()
    if (!startingPointGeolocation?.length) {
      this.snack.showErrorMessage('geolocation not found for starting point')
      return
    }
    const csvStartingPoint = {
      address: data.startPoint,
      geolocation: startingPointGeolocation[0]
    }

    console.log(routes)
    tmp.csvRecords.push(csvStartingPoint)

    Object.keys(routes).forEach((key: any) => {
      routes[key].push(csvStartingPoint)
      routes[key].unshift(csvStartingPoint)
    })
    delete tmp.csvRec
    console.log(routes)
    const theirResult = await Promise.all(Object.keys(routes).map(driver => this.routesService.getStats(routes[driver]).toPromise()))
    const { id } = await this.tspApi.solveDemoRoute(tmp).toPromise()
    const result = await this.tspApi.getDemoRoute(id).pipe(tap(r => console.log(r)), map(r => {
      if (r && r.status && r.status !== 'completed' && r.status !== 'error') {
        throw r
      } else if (r.status === 'error') {
        this.snack.showErrorMessage('Unable to solve the route')
        return null
      }
      return r

    }), retryWhen(errors => errors.pipe(delay(1000)))).toPromise()
    let ourResult = null
    if (result) {
      console.log(result.routes)
      ourResult = await Promise.all(result.routes.map(t => this.routesService.getStats(t).toPromise()))
      console.log({ theirResult, ourResult })
    }
    await this.router.navigate(['demo', 'result'], {
      state: {
        theirResult, ourResult
      }
    })
    this.loading = false
  }

  private groupBy(xs, key): any {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
}
