import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { CSVData } from '../../models/initial-data-model'
import { MapViewService } from '../../services/map-view.service'

@Component({
  selector: 'app-preview-addresses-map',
  templateUrl: './preview-addresses-map.component.html',
  styleUrls: ['./preview-addresses-map.component.scss']
})
export class PreviewAddressesMapComponent implements OnInit {
  get csvRecords(): CSVData[] {
    return this._csvRecords
  }

  @Input() set csvRecords(value: CSVData[]) {
    console.log('val', value)
    this.clearMarkers()
    this._csvRecords = value
    if (value) {
      this.updateMarkers()
    }
  }

  @ViewChild('googleMap') googleMapElement
  private _csvRecords: CSVData[]

  private markers: google.maps.Marker[] = []

  constructor(private mapViewService: MapViewService) {

  }

  ngOnInit(): void {
  }

  private clearMarkers(): void {
    this.markers.forEach(m => m.setMap(null))
  }

  private updateMarkers(): void {
    this.csvRecords.forEach((csvRow, i) => {
      if (csvRow.geolocation?.geolocation) {
        this.markers.push(
          new google.maps.Marker({
            position: csvRow.geolocation.geolocation,
            icon: { url: this.mapViewService.getMarker(i + 1) },
            map: this.googleMapElement?.googleMap || null,
            title: csvRow.address
          })
        )
      }
    })

    this.googleMapElement.googleMap.setCenter(this.mapViewService.findCenter(this.csvRecords.filter(a => a.geolocation).map(a => a.geolocation)))
  }
}
