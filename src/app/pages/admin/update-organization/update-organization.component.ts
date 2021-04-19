import { Component, OnInit } from '@angular/core'
import { AdminService } from '../../../services/admin.service'
import { SnackService } from '../../../services/snack.service'

const initialValue = {
  name: null,
  address: null
}

@Component({
  selector: 'app-update-organization',
  templateUrl: './update-organization.component.html',
  styleUrls: ['./update-organization.component.scss']
})
export class UpdateOrganizationComponent implements OnInit {
  organizations = []

  newOrganization = { ...initialValue }


  constructor(public admin: AdminService, private snack: SnackService) {
  }

  ngOnInit(): void {
    this.admin.getOrganizations().subscribe(organization => {
      this.organizations = organization
    })
  }

  update(organization, e, field): void {
    let value = e.target.value
    value = value?.trim() || value
    const old = organization[field]

    if (old === value) {
      return
    }

    organization[field] = value

    this.admin.updateOrganization(organization).subscribe({
      next: (t) => {
        console.log(t)
      },
      error: err => {
        this.snack.showErrorMessage(err)
        organization[field] = old
      }
    })
  }

  delete(setting): void {
    this.admin.deleteOrganization(setting.id).subscribe(() => {
      this.organizations = this.organizations.filter(t => t.id !== setting.id)
    })
  }

  createOrganization(): void {
    this.admin.createOrganization(this.newOrganization).subscribe(t => {
      console.log(t)
      this.organizations.unshift(t)
      this.newOrganization = { ...initialValue }
    }, error => {
      this.snack.showErrorMessage(error)
    })
  }
}
