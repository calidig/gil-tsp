import { Component, OnInit } from '@angular/core'
import { AdminService } from '../../../services/admin.service'
import { SnackService } from '../../../services/snack.service'

const initialValue = {
  name: null,
  organization: null
}

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.scss']
})
export class UpdateBranchComponent implements OnInit {

  branches = []

  newBranch = { ...initialValue }
  organizations = []

  constructor(public admin: AdminService, private snack: SnackService) {
  }

  ngOnInit(): void {
    this.admin.getBranches().subscribe(branches => {
      this.branches = branches
    })

    this.admin.getOrganizations().subscribe(o => {
      this.organizations = o
    })
  }

  update(branch, e, field): void {
    let value = e.target.value
    value = value?.trim() || value

    const old = branch[field]

    if (old === value) {
      return
    }

    branch[field] = value

    this.admin.updateBranch(branch).subscribe({
      next: (t) => {
        console.log(t)
      },
      error: err => {
        this.snack.showErrorMessage(err)
        branch[field] = old
      }
    })
  }

  delete(setting): void {
    this.admin.deleteBranch(setting.id).subscribe(() => {
      this.branches = this.branches.filter(t => t.id !== setting.id)
    })
  }

  createOrganization(): void {
    this.admin.createBranch(this.newBranch).subscribe(t => {
      console.log(t)
      this.branches.unshift(t)
      this.newBranch = { ...initialValue }
    }, error => {
      this.snack.showErrorMessage(error)
    })
  }
}
