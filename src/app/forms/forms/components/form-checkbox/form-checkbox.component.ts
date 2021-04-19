import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss']
})
export class FormCheckboxComponent implements OnInit {

  @Input() state: boolean

  constructor() {
  }

  ngOnInit(): void {
  }


}
