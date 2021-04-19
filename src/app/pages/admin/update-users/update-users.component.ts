import { Component, OnInit } from '@angular/core'
import { AdminService } from '../../../services/admin.service'
import { SnackService } from '../../../services/snack.service'
import { LanguageService } from '../../../services/language.service'

const initialUser = {
  email: null,
  firstName: null,
  lastName: null,
  car_size: null,
  home: null,
  organization: null,
  phone: null,
  branch: null,
  type: null,
  createdAt: null,
  updatedAt: null,
  actions: null,
  max_distance: null,
  max_time: null
}

@Component({
  selector: 'app-update-users',
  templateUrl: './update-users.component.html',
  styleUrls: ['./update-users.component.scss']
})
export class UpdateUsersComponent implements OnInit {

  users: any[] = []

  newUser = { ...initialUser }

  carTypeOptions = []
  roles = []
  organizationsWithBranches = []

  constructor(public admin: AdminService, private snack: SnackService, public language: LanguageService) {
  }

  ngOnInit(): void {
    this.admin.getAllUsers().subscribe(users => {
      this.users = users
      console.log(this.users)
    }, error => {
      console.error(error)
    })

    this.admin.getSettingsByType('car_size').subscribe(options => {
      console.log('options', options)
      this.carTypeOptions = options
    })

    this.admin.getRoles().subscribe(roles => {
      this.roles = roles
    })

    this.admin.getOrganizationWithBr().subscribe(orgs => {
      this.organizationsWithBranches = orgs
      console.log('this.organizationsWithBranches', this.organizationsWithBranches)
    })
  }

  getBranches(user): any {
    return this.organizationsWithBranches.find(o => o.id === user.organization)?.branches || []
  }

  delete(user): void {
    this.admin.deleteUser(user.id).subscribe(() => {
      this.users = this.users.filter(t => t.id !== user.id)
    })
  }

  createUser(): void {
    this.admin.registerUser(this.newUser).subscribe(({ result }) => {
      this.users.unshift(result)
      this.newUser = { ...initialUser }
    })
  }

  updateUser(user, e, field): void {
    let value = e.target.value
    value = value?.trim() || value

    const old = user[field]

    if (old === value) {
      return
    }

    user[field] = value

    let oldBr
    if (field === 'organization') {
      oldBr = { ...user.branch }
      user.branch = null
    }

    this.admin.updateUser(user).subscribe({
      next: (t) => {
        console.log(t)
      },
      error: err => {
        this.snack.showErrorMessage(err)
        user[field] = old
        if (field === 'organization') {
          user.branch = oldBr
        }
      }
    })
  }
}
