import { Component, OnInit } from '@angular/core'
import { CSVData, InitialDataModel } from '../../models/initial-data-model'
import { Router } from '@angular/router'
import { SnackService } from '../../services/snack.service'
import { LanguageService } from '../../services/language.service'
import { TspApiService } from '../../services/tsp-api.service'
import { UtilsService } from '../../services/utils.service'

@Component({
  selector: 'app-preview-csv',
  templateUrl: './preview-csv.component.html',
  styleUrls: ['./preview-csv.component.scss']
})
export class PreviewCsvComponent implements OnInit {
  data: InitialDataModel
  loading = false

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
  }

  async ngOnInit(): Promise<void> {
    this.loading = true
    const addresses = this.data.csvRecords.map(csv => csv.address)
    const addressesGeocode = await this.utils.getGeocodeMultipleAddresses(addresses).toPromise()
    this.data.csvRecords.forEach((csv, index) => {
      csv.geolocation = addressesGeocode[index]
      csv._index = index + 1
    })
    console.log('data', this.data)
    this.loading = false

  }

  async updateAddress(row: CSVData): Promise<void> {
    try {
      [row.geolocation] = await this.utils.getGeocodeMultipleAddresses([row.address]).toPromise()
      this.data.csvRecords = [...this.data.csvRecords]
    } catch (e) {
      console.error(e)
    }
  }

  findRoute(): void {
    this.loading = true
    let data: any
    this.data.startPoint = this.data.csvRecords[this.data.csvRecords.length - 1].address
    data = JSON.parse(JSON.stringify(this.data))
    delete data.fileType

    data.carload = this.data.carload
    data.csvRecords.forEach(t => {
      t.geolocation = t.geolocation.geolocation
      delete t._index
    })
    console.log(data)
    this.loading = false
    this.tsp.solveRoute(data).subscribe(async () => {
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

  public sort(index: string): void {
    console.log('sort by ', index)
    console.log(JSON.parse(JSON.stringify(this.data.csvRecords)))
    this.data.csvRecords.sort((a, b) => (a[index] > b[index]) ? 1 : -1)
    console.log(JSON.parse(JSON.stringify(this.data.csvRecords)))
  }
}
