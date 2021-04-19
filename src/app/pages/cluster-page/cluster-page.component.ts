import { Component, OnDestroy, OnInit } from '@angular/core'
import { CSVData, InitialDataModel } from '../../models/initial-data-model'
import { SubSink } from 'subsink'
import { Router } from '@angular/router'
import { TspApiService } from '../../services/tsp-api.service'
import { SnackService } from '../../services/snack.service'
import { UtilsService } from '../../services/utils.service'
import { LanguageService } from '../../services/language.service'

@Component({
  selector: 'app-cluster-page',
  templateUrl: './cluster-page.component.html',
  styleUrls: ['./cluster-page.component.scss']
})
export class ClusterPageComponent implements OnInit, OnDestroy {
  data: InitialDataModel
  loading = false
  private subs = new SubSink()
  driverList: any = []
  chooselocation: any = []

  constructor(
    private router: Router,
    private tsp: TspApiService,
    private snack: SnackService,
    private utils: UtilsService,
    public language: LanguageService
  ) {
    this.data = this.router.getCurrentNavigation().extras.state?.data
    if (this.data) {
      localStorage.data = JSON.stringify(this.data)
    } else {
      this.data = JSON.parse(localStorage.data)
    }
    if (!this.data) {
      this.router.navigate(['/home'])
    }
    console.log(this.data)

    let driver: any
    driver = this.data.csvRecords.reduce((r, a) => {
      r[a.driver] = r[a.driver] || []
      r[a.driver].push(a)
      return r
    }, Object.create(null))
    for (const k in driver) {
      // tslint:disable-next-line:triple-equals
      if (k != 'undefined') {
        this.driverList.push(k)
      }
    }
    console.log(this.driverList)

  }

  async ngOnInit(): Promise<void> {
    this.loading = true
    const addresses = this.data.csvRecords.map(csv => csv.address)
    const addressesGeocode = await this.utils.getGeocodeMultipleAddresses(addresses).toPromise()
    this.data.csvRecords.forEach((csv, index) => {
      csv.geolocation = addressesGeocode[index]
    })
    console.log('data', this.data)
    this.loading = false
  }

  async changeDriver(row: CSVData): Promise<void> {
    try {
      this.data.csvRecords = [...this.data.csvRecords]
    } catch (e) {
      console.error(e)
    }
  }

  async changeDriverall(event): Promise<void> {
    if (!event.target.value) {
      if (this.chooselocation.length > 0) {
        this.chooselocation.forEach((csv, index) => {
          csv.driver = event.target.value
          this.changeDriver(csv)
        })
      } else {
        alert('Please select location\'s')
      }
    }
  }

  async changeSelected(event, row, i): Promise<void> {
    console.log(row)
    if (event.target.checked) {
      this.chooselocation[i] = row
    } else {
      this.chooselocation.splice(i, 1)
    }
  }

  findRoute(): void {
    this.loading = true
    let data: any
    this.data.startPoint = this.data.csvRecords[this.data.csvRecords.length - 1].address
    data = {
      ...this.data
    }
    delete data.fileType

    data.carload = this.data.carload

    this.subs.sink = this.tsp.solveRoute(data).subscribe(async () => {
      await this.router.navigate(['route', 'status']).then(() => {
        this.loading = false
      })
    }, error => {
      this.loading = false
      if (error.unsuccessful_requests) {
        this.snack.showErrorMessage(`I couldn't find [ ${error.unsuccessful_requests.length} ] locations`)
      } else {
        this.snack.showErrorMessage(`Something bad`)
      }
    })
  }

  async updateAddress(row: CSVData): Promise<void> {
    try {
      [row.geolocation] = await this.utils.getGeocodeMultipleAddresses([row.address]).toPromise()
      this.data.csvRecords = [...this.data.csvRecords]
    } catch (e) {
      console.error(e)
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
