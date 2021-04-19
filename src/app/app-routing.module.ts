import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { ViewRouteComponent } from './pages/route/view-route/view-route.component'
import { PreviewTeamComponent } from './pages/preview-team/preview-team.component'
import { UserRoles } from './models/user-roles'
import { PreviewCsvComponent } from './pages/preview-csv/preview-csv.component'
import { AuthGuard } from './guards/auth.guard'
import { RoleGuard } from './guards/role.guard'
import { MyTeamComponent } from './pages/my-team/my-team.component'
import { LoginComponent } from './pages/login/login.component'
import { RegisterComponent } from './pages/register/register.component'
import { ProfileComponent } from './pages/profile/profile.component'
import { CreateRouteComponent } from './pages/create-route/create-route.component'
import { RouteStatusComponent } from './pages/route-status/route-status.component'
import { MyRoutesComponent } from './pages/route/my-routes/my-routes.component'
import { UpdateUsersComponent } from './pages/admin/update-users/update-users.component'
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component'
import { SettingsComponent } from './pages/admin/settings/settings.component'
import { UpdateBranchComponent } from './pages/admin/update-branch/update-branch.component'
import { UpdateOrganizationComponent } from './pages/admin/update-organization/update-organization.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { ViewMapComponent } from './pages/route/view-map/view-map.component'
import { TablePVComponent } from './pages/table-pv/table-pv.component'
import { DemoInputComponent } from './components/demo/demo-input/demo-input.component'
import { DemoResultComponent } from './components/demo/demo-result/demo-result.component'

const routes: Routes = [
  {
    path: 'pv',
    component: TablePVComponent
  },
  {
    path: '',
    redirectTo: 'new-route',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: [UserRoles.organizationManager, UserRoles.branchManager] }
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [AuthGuard],
        component: LoginComponent,
        data: { auth: false }
      },
      {
        path: 'register',
        component: RegisterComponent,

        canActivate: [AuthGuard],
        data: { auth: false }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'new-route',
    children: [
      {
        path: '',
        component: CreateRouteComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { role: [UserRoles.organizationManager, UserRoles.branchManager] }
      },
      {
        path: 'map/:id',
        component: ViewRouteComponent
      },
      {
        path: 'mapview/:id',
        component: ViewMapComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { role: [UserRoles.driverInBranch, UserRoles.driverInOrganization] }
      },
      {
        path: 'preview',
        children: [
          {
            path: '',
            component: PreviewCsvComponent,
            canActivate: [AuthGuard, RoleGuard],
            data: {
              role: [UserRoles.organizationManager, UserRoles.branchManager]
            }
          },
          {
            path: 'team',
            component: PreviewTeamComponent,
            canActivate: [AuthGuard, RoleGuard],
            data: { role: [UserRoles.organizationManager, UserRoles.branchManager] }
          }
        ]

      }
    ]
  },
  {
    path: 'my-routes',
    component: MyRoutesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: [UserRoles.driverInBranch, UserRoles.driverInOrganization] }
  },
  {
    path: 'route',
    children: [
      {
        path: 'status',
        component: RouteStatusComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { role: [UserRoles.organizationManager, UserRoles.branchManager] }
      }
    ]
  },
  {
    path: 'team',
    component: MyTeamComponent
  },
  {
    path: 'demo',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: [UserRoles.admin] },
    children: [
      {
        path: '',
        component: DemoInputComponent
      },
      {
        path: 'result',
        component: DemoResultComponent
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        component: AdminPageComponent
      },
      {
        path: 'users',
        component: UpdateUsersComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'organizations',
        component: UpdateOrganizationComponent
      },
      {
        path: 'branches',
        component: UpdateBranchComponent
      }
    ],
    canActivate: [AuthGuard, RoleGuard],
    data: { role: [UserRoles.admin] }
  },
  {
    path: '**',
    component: NotFoundComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
