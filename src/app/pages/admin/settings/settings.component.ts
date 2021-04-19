import { Component, OnInit } from '@angular/core'
import { AdminService } from '../../../services/admin.service'
import { SnackService } from '../../../services/snack.service'

const initialValue = {
  name: null,
  value: null,
  type: null
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings

  newSetting = { ...initialValue }

  constructor(public admin: AdminService, private snack: SnackService) {
  }

  ngOnInit(): void {
    this.admin.getSettings().subscribe(settings => {
      this.settings = settings
    })
  }

  update(setting, e, field): void {
    let value = e.target.value
    value = value?.trim() || value

    const old = setting[field]
    if (old === value) {
      return
    }

    setting[field] = value

    this.admin.updateSetting(setting).subscribe({
      next: (t) => {
        console.log(t)
      },
      error: err => {
        this.snack.showErrorMessage(err)
        setting[field] = old
      }
    })
  }

  delete(setting): void {
    this.admin.deleteSetting(setting.id).subscribe(() => {
      this.settings = this.settings.filter(t => t.id !== setting.id)
    })
  }


  createSetting(): void {
    this.admin.createSetting(this.newSetting).subscribe(t => {
      console.log(t)
      this.settings.unshift(t)
      this.newSetting = { ...initialValue }
    }, error => {
      this.snack.showErrorMessage(error)
    })
  }
}
