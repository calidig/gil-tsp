import { Component, EventEmitter, OnInit } from '@angular/core'
import { ConfigService } from '../../services/config.service'

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {

  constructor(private configService: ConfigService) {
  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.configService.toggleMenu()
  }
}
