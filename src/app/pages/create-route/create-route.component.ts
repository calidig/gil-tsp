import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { CSVData, InitialDataModel } from '../../models/initial-data-model'
import { LanguageService } from '../../services/language.service'
import { TspApiService } from '../../services/tsp-api.service'
import { Router } from '@angular/router'
import { SnackService } from '../../services/snack.service'
import { StorageService } from '../../services/storage.service'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit {

  @ViewChild('f', { static: true }) fileInput: ElementRef

  data: InitialDataModel = {
    fileType: 'csv',
    cars: [],
    flags: {}
  }

  startTime = {
    date: null,
    time: null
  }

  startPoint = null // temp variable to check if starting point was updated
  rememberLocation: boolean


  availableCountries = []
  flags = []

  constructor(public language: LanguageService,
              private tspApi: TspApiService,
              private router: Router,
              private snack: SnackService,
              private store: StorageService
  ) {
    // this.startTime.date = this.startTime.time = new Date().toJSON()

    console.log('CREATE NEW ROUTE')
  }

  async ngOnInit(): Promise<void> {
    this.data.startPoint = await this.store.get('startPoint')
    this.rememberLocation = await this.store.get('rememberLocation')

    this.tspApi.getByFlag('algo_flags').pipe(tap(t => {
      t.forEach(flag => this.data.flags[flag.name] = false)
    })).subscribe(t => this.flags = t)

    this.tspApi.getByFlag('available_countries').subscribe(t => this.availableCountries = t)
  }

  async handleFileInput(e): Promise<void> {
    this.data.file = e.target.files[0]
    console.log(e.target.files[0].name)
    let text

    if (this.data.fileType === 'csv') {
      text = await this.renderFile(this.data.file)
    } else if (this.data.fileType === 'img') {
      const result = await this.tspApi.parseImg(this.data.file)
      text = result.data.parsed_text
    }

    const mapDict = {
      'Address/Place': 'address',
      'Demand in point': 'demand',
      'Phone Contact': 'phone',
      'Time In point': 'timeInPoint',
      Description: 'description',
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
      this.data.csvRecords = csvTmp
    } catch (e) {
      this.data.file = null
      this.fileInput.nativeElement.value = null
      this.snack.showErrorMessage(e?.error?.message || 'The api is not available')
    }

    console.log(this.data)
  }

  async onSubmit(form): Promise<void> {
    if (form.invalid) {
      this.snack.showErrorMessage(this.language.translationsDictionary.formInvalid)
      return
    }
    if (!this.data?.csvRecords?.length || !this.data?.startPoint) {
      this.snack.showErrorMessage(this.language.translationsDictionary.formInvalid)
      return
    }

    if (this.rememberLocation) {
      await this.store.set('startPoint', this.data.startPoint)
      await this.store.set('rememberLocation', this.rememberLocation)
    }

    const tempDateStart = new Date(this.startTime.date)

    if (this.startTime.time) {
      const [h, m] = this.startTime.time?.split(':')
      tempDateStart.setHours(h)
      tempDateStart.setMinutes(m)
    }

    this.data.startTime = tempDateStart

    const data = { ...this.data }
    const startPointRow = { ...new CSVData(), address: this.data.startPoint }
    if (this.startPoint) {
      data.csvRecords.pop()
    } else {
      if (data.cars) {
        data.cars.forEach(carInfo => data.csvRecords.push({ ...new CSVData(), address: carInfo.home })
        )
      }
    }
    data.csvRecords.push(startPointRow)

    this.startPoint = this.data.startPoint

    delete data.file

    data.csvRecords.forEach(row => {
      const time: any = row.timeInPoint // time index in csv
      // if time is like 10:20 then we need minutes
      if (isNaN(time)) {
        const tarr = time.split(':').map(t => parseInt(t, 10))
        const newTime = tarr[0] * 60 + tarr[1]
        row.timeInPoint = newTime.toString()
        console.log({ time, newTime })
      }
    })

    if (!data.name) {
      data.name = `route from "${data.startPoint}"`
    }

    console.log({ data })

    await this.router.navigate(['new-route', 'preview', 'team'], {
      state: {
        data
      }
    })
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
}
