import { Component } from '@angular/core'
import { AppLoaderService } from './services/app-loader.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public app: AppLoaderService) {
  }
}
