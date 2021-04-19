import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {
  @Output() action = new EventEmitter<void>()
  @Input() disabled: true | false
  @Input() color:
    | 'danger'
    | 'success'
    | 'primary'
    | 'info'
    | 'warning'
    | 'dark'
  @Input() textColor: string

  constructor() {
  }

  ngOnInit(): void {
  }

}
