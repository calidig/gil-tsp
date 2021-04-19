import { Component, Input, OnInit } from '@angular/core'

import * as Color from 'color'

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent implements OnInit {

  get color(): | string
    | 'danger'
    | 'success'
    | 'primary'
    | 'info'
    | 'warning'
    | 'dark' {
    return this._color
  }

  @Input() set color(value) {
    this._color = ChipComponent.colors[value] || value
    this.ratio = 1.3
    this.updateColor()
  }

  constructor() {
  }

  private static colors = {
    danger: '#d32f2f',
    success: '#15b11e',
    // primary: '',
    info: 'rgba(8,175,182,0.78)',
    warning: '#f57c00',
    dark: '#512da8'
  }

  ratio = 1.3

  private _color: string
  bgColor: string

  ngOnInit(): void {
  }

  updateColor(): void {
    this.bgColor = Color(this._color).lighten(this.ratio).hex()
    if (this.bgColor === '#FFFFFF') {
      this.ratio /= 1.5
      this.updateColor()
    }
  }

}
