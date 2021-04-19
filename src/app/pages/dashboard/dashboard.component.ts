import { Component, OnInit, ViewChild } from '@angular/core'
import { RoutesService } from '../../services/routes.service'
import { tap } from 'rxjs/operators'
import { MapViewService } from '../../services/map-view.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public routes
  @ViewChild('googleMap') googleMapElement
  hours: string[] = []
  allDeliveries: any = []
  todayTime: any
  private markers: google.maps.Marker[] = []


  tDate: Date = new Date()

  constructor(private routesService: RoutesService, private mapViewService: MapViewService) {
  }

  ngOnInit(): void {
    const currentDate = new Date()
    this.todayTime = currentDate.getHours() + ':' + currentDate.getMinutes()
    this.initiateData()
    setInterval(() => {
      this.routes = []
      this.allDeliveries = []
      this.initiateData()
    }, 5 * 60 * 1000)
  }

  initiateData(): void {
    this.routesService.getAllWithStatusByDay(new Date()).pipe(tap(t => console.log(t))).subscribe(t => {
      const currentDate = new Date()
      this.todayTime = currentDate.getHours() + ':' + currentDate.getMinutes()
      this.routes = t

      console.log(this.routes)
      let qtotalBoxes = 0
      let qtotalAddress = 0
      let qfinished = 0
      let qdelivered = 0
      let qnonDelivered = 0
      let qpostponed = 0

      this.routes.forEach((row, index) => {
        let deliverIndex:any = []
        for (const k in row.deliveries) {
          if(row.deliveries[k].orderIndex != undefined){
            deliverIndex.push(row.deliveries[k].orderIndex)
          }
        }
        console.log(deliverIndex)
        row.totaldeliveryindex = Math.max(...deliverIndex) - 1
      });
      this.routes.forEach((row, index) => {

        let totalBoxes = 0
        let finished = 0
        let delivered = 0
        let nonDelivered = 0
        let postponed = 0
        // tslint:disable-next-line:forin
        let i=1
        for (const k in row.deliveries) {
          if(row.deliveries[k].orderIndex === 0 || row.deliveries.length === (parseInt(row.deliveries[k].orderIndex)+1)) 
          {
            console.log("exit"+row.deliveries[k].orderIndex)
            continue;
          }
          console.log("not exit"+row.deliveries[k].orderIndex+" k is "+(parseInt(k)+1))
          row.deliveries[k].user = row.user.firstName
          row.deliveries[k].id = row.id
          this.allDeliveries.push(row.deliveries[k])
          //console.log(row.deliveries[k].demand)
          if (row.deliveries[k].demand) {
            totalBoxes = totalBoxes + parseInt(row.deliveries[k].demand)
            qtotalBoxes = qtotalBoxes + parseInt(row.deliveries[k].demand)
          }
          if (row.deliveries[k].status != null) {
            if (row.deliveries[k].status === 'delivered') {
              delivered = delivered + 1
              qdelivered = qdelivered + 1
              finished = finished + 1
              qfinished = qfinished + 1
            } else {
              qpostponed = qpostponed + 1
              postponed = postponed + 1
              finished = finished + 1
              qfinished = qfinished + 1
            }
          } else {
            nonDelivered = nonDelivered + 1
            qnonDelivered = qnonDelivered + 1
          }
        }
        console.log("row data"+row.totaldeliveryindex)
        qtotalAddress = qtotalAddress + row.totaldeliveryindex
        row.totalBoxes = totalBoxes
        row.finishedPer = Math.round((finished / row.totaldeliveryindex) * 100)
        row.deliverPer = Math.round((delivered / row.totaldeliveryindex) * 100)
        row.nonDeliver = Math.round((nonDelivered / row.totaldeliveryindex) * 100)
        row.postponed = Math.round((postponed / row.totaldeliveryindex) * 100)
        row.leftToDeliver = Math.round(((row.totaldeliveryindex - finished) / row.totaldeliveryindex) * 100)

      })
      console.log("total"+qtotalAddress)
      this.routes.totalAddress = qtotalAddress
      this.routes.totalBoxes = qtotalBoxes
      this.routes.finishedPer = Math.round((qfinished / qtotalAddress) * 100)
      this.routes.deliverPer = Math.round((qdelivered / qtotalAddress) * 100)
      this.routes.nonDeliver = Math.round((qnonDelivered / qtotalAddress) * 100)
      this.routes.postponed = Math.round((qpostponed / qtotalAddress) * 100)
      this.routes.leftToDeliver = Math.round(((qtotalAddress - qfinished) / qtotalAddress) * 100)
      console.log(this.allDeliveries)
      this.clearMarker()
      this.callMarker()
    })
  }

  clearMarker(): void {
    this.markers.forEach(m => m.setMap(null))
  }

  callMarker(): void {
    let allDeliveriesCustom:any = [];
    this.routes.forEach((row, index) => {
      let deliverIndex:any = []
      let alldeliverIndex:any = []
      for (const k in row.deliveries) {
        if(row.deliveries[k].orderIndex != undefined && row.deliveries[k].status != null && row.deliveries[k].orderIndex != 0 && row.deliveries.length != (parseInt(row.deliveries[k].orderIndex)+1)){
          deliverIndex.push(row.deliveries[k].orderIndex)
        }
        alldeliverIndex.push(row.deliveries[k].orderIndex)
      }
      console.log(deliverIndex)
      row.totaldeliverymap = Math.max(...deliverIndex)
      //Object.keys(deliverIndex).find(key => deliverIndex[key] === row.totaldeliveryindex);
      console.log( Object.keys(alldeliverIndex).find(key => alldeliverIndex[key] === row.totaldeliverymap))
      let key = Object.keys(alldeliverIndex).find(key => alldeliverIndex[key] === row.totaldeliverymap)
      allDeliveriesCustom.push(row.deliveries[key])
    });
    console.log(allDeliveriesCustom);
    allDeliveriesCustom.forEach((csvRow, i) => {

      const html = document.createElement('div')
      html.id = 'driver-list'
      html.innerHTML = '<a href=\'/new-route/map/' + csvRow.id + '\'>' + csvRow.user + '</a>'
      const infowindow = new google.maps.InfoWindow({
        content: html
      })

      const marker = new google.maps.Marker({
        position: csvRow.geolocation,
        icon: { url: this.mapViewService.getMarker(i + 1) },
        map: this.googleMapElement?.googleMap || null,
        title: csvRow.user
      })

      this.markers.push(
        marker
      )
      marker.addListener('mouseover', () => {
        infowindow.open(this.googleMapElement?.googleMap, marker)
      })

    })

    this.googleMapElement.googleMap.setCenter(this.mapViewService.findCenter(this.allDeliveries.filter(a => a.geolocation)))
  }
}
