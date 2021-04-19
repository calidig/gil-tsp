import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { CSVData } from '../../models/initial-data-model'
import { MapViewService } from '../../services/map-view.service'

@Component({
  selector: 'app-preview-cluster',
  templateUrl: './preview-cluster.component.html',
  styleUrls: ['./preview-cluster.component.scss']
})
export class PreviewClusterComponent implements OnInit {
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
  private polygon: google.maps.Polygon[] = []

  constructor(private mapViewService: MapViewService) {

  }

  ngOnInit(): void {
  }

  private clearMarkers(): void {
    this.markers.forEach(m => m.setMap(null))
    this.polygon.forEach((i, e) => {
      i.setMap(null)
    })
    this.polygon.length = 0
    console.log(this.polygon)
  }

  private updateMarkers(): void {
    const $ngthis = this
    let driver: any

    const result = this.csvRecords.reduce((r, a) => {
      r[a.driver] = r[a.driver] || []
      r[a.driver].push(a)
      return r
    }, Object.create(null))


    this.csvRecords.forEach((csvRow, i) => {
      let driverList = ''
      if (csvRow.geolocation) {
        for (const k in result) {
          // tslint:disable-next-line:triple-equals
          if (k != 'undefined') {
            let selected = ''
            if (csvRow.driver === k) {
              selected = 'selected=\'selected\''
            }
            driverList += '<option value=\'' + k + '\' ' + selected + '>' + k + '</option>'
          }
        }
        const html = document.createElement('div')
        html.id = 'driver-list'
        html.innerHTML = '<select id=\'driver-' + i + '\'>' + driverList + '</select>'
        const infowindow = new google.maps.InfoWindow({
          content: html
        })
        const marker = new google.maps.Marker({
          position: csvRow.geolocation,
          icon: { url: this.mapViewService.getMarker(i + 1) },
          map: this.googleMapElement?.googleMap || null,
          title: csvRow.address
        })

        this.markers.push(
          marker
        )
        marker.addListener('click', () => {
          infowindow.open(this.googleMapElement?.googleMap, marker)
        })

        google.maps.event.addDomListener(html, 'change', (function(marker, i, event) {
          return function() {
            $ngthis._csvRecords[i].driver = (document.getElementById('driver-' + i) as any).value
            $ngthis.clearMarkers()

            $ngthis.updateMarkers()
          }
        })(marker, i))

      }
    })

    this.googleMapElement.googleMap.setCenter(this.mapViewService.findCenter(this.csvRecords.filter(a => a.geolocation)))


    console.log(result)
    let upper: any
    for (const k in result) {
      console.log(k)
      const triangleCoords = []
      for (const j in result[k]) {
        if (j != undefined) {
          triangleCoords.push(new Point(j, result[k][j].geolocation.lat, result[k][j].geolocation.lng))
        }

      }
      upper = upperLeft(triangleCoords)
      console.log('points :: ' + triangleCoords)
      console.log('upper  :: ' + upper)
      triangleCoords.sort(pointSort)
      console.log(triangleCoords)
      const newcoordinates: any = []
      for (const i in triangleCoords) {

        newcoordinates.push(result[k][triangleCoords[i].label].geolocation)
      }

      console.log(newcoordinates)
      const colors = [
        '#ff0000', '#00ff00', '#0000ff',
        '#ff3333', '#ffff00', '#ff6600'
      ]
      // Construct the polygon.
      this.polygon.push(new google.maps.Polygon({
        paths: newcoordinates,
        strokeColor: k != undefined && colors[k] != undefined ? colors[k] : '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: k != undefined && colors[k] != undefined ? colors[k] : '#FF0000',
        fillOpacity: 0.35
      }))
      this.polygon.forEach((i, e) => {
        i.setMap($ngthis.googleMapElement.googleMap)
      })

      function Point(label, lat, lon) {

        this.label = label
        this.x = (lon + 180) * 360
        this.y = (lat + 90) * 180

        this.distance = function(that) {
          const dX = that.x - this.x
          const dY = that.y - this.y
          return Math.sqrt((dX * dX) + (dY * dY))
        }

        this.slope = function(that) {
          const dX = that.x - this.x
          const dY = that.y - this.y
          return dY / dX
        }

        this.toString = function() {
          return this.label
        }
      }

      // A custom sort function that sorts p1 and p2 based on their slope
      // that is formed from the upper most point from the array of points.
      function pointSort(p1, p2) {
        // Exclude the 'upper' point from the sort (which should come first).
        if (p1 == upper) {
          return -1
        }
        if (p2 == upper) {
          return 1
        }

        // Find the slopes of 'p1' and 'p2' when a line is
        // drawn from those points through the 'upper' point.
        const m1 = upper.slope(p1)
        const m2 = upper.slope(p2)

        // 'p1' and 'p2' are on the same line towards 'upper'.
        if (m1 == m2) {
          // The point closest to 'upper' will come first.
          return p1.distance(upper) < p2.distance(upper) ? -1 : 1
        }

        // If 'p1' is to the right of 'upper' and 'p2' is the the left.
        if (m1 <= 0 && m2 > 0) {
          return -1
        }

        // If 'p1' is to the left of 'upper' and 'p2' is the the right.
        if (m1 > 0 && m2 <= 0) {
          return 1
        }

        // It seems that both slopes are either positive, or negative.
        return m1 > m2 ? -1 : 1
      }

      // Find the upper most point. In case of a tie, get the left most point.
      function upperLeft(points) {
        let top = points[0]
        for (let i = 1; i < points.length; i++) {
          const temp = points[i]
          if (temp.y > top.y || (temp.y == top.y && temp.x < top.x)) {
            top = temp
          }
        }
        return top
      }

    }
  }
}
