import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SideMenuComponent } from './components/side-menu/side-menu.component'
import { CreateRouteComponent } from './pages/create-route/create-route.component'
import { PreviewCsvComponent } from './pages/preview-csv/preview-csv.component'
import { PreviewTeamComponent } from './pages/preview-team/preview-team.component'
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { MyTeamComponent } from './pages/my-team/my-team.component'
import { RouteStatusComponent } from './pages/route-status/route-status.component'
import { ViewRouteComponent } from './pages/route/view-route/view-route.component'
import { RouteDetailsComponent } from './components/route-details/route-details.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './pages/login/login.component'
import { RegisterComponent } from './pages/register/register.component'
import { ProfileComponent } from './pages/profile/profile.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthInterceptor } from './interceptors/auth.interceptor'
import { RouteInfoComponent } from './components/route-info/route-info.component'
import { GoogleMapsModule } from '@angular/google-maps'
import { NavigationHeaderComponent } from './components/navigation-header/navigation-header.component'
import { MenuButtonComponent } from './components/menu-button/menu-button.component'
import { IconsModule } from './icons/icons.module'
import { CustomFormsModule } from './forms/forms/forms.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActionButtonComponent } from './atoms/action-button/action-button.component'
import { ChipComponent } from './atoms/chip/chip.component'
import { AppLayoutComponent } from './components/app-layout/app-layout.component'
import { MyRoutesComponent } from './pages/route/my-routes/my-routes.component'
import { SnackBarComponent } from './components/snack-bar/snack-bar.component'
import { config } from 'rxjs'
import { defaultToastConfig, TOAST_CONFIG_TOKEN } from './models/toast-config'
import { OverlayModule } from '@angular/cdk/overlay'
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component'
import { UpdateUsersComponent } from './pages/admin/update-users/update-users.component'
import { SettingsComponent } from './pages/admin/settings/settings.component'
import { UpdateOrganizationComponent } from './pages/admin/update-organization/update-organization.component'
import { UpdateBranchComponent } from './pages/admin/update-branch/update-branch.component'
import { GeocodeComponent } from './pages/admin/geocode/geocode.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { RouteTabComponent } from './components/route-tab/route-tab.component'
import { ViewMapComponent } from './pages/route/view-map/view-map.component'
import { TooltipDirective } from './directives/tooltip.directive'
import { TooltipComponent } from './atoms/tooltip/tooltip.component'
import { InputTableComponent } from './components/input-table/input-table.component'
import { PreviewAddressesMapComponent } from './components/preview-addresses-map/preview-addresses-map.component';
import { DemoInputComponent } from './components/demo/demo-input/demo-input.component';
import { DemoResultComponent } from './components/demo/demo-result/demo-result.component';
import { DemoStatsComponent } from './components/demo/demo-stats/demo-stats.component';
import { ClusterPageComponent } from './pages/cluster-page/cluster-page.component';
import { PreviewClusterComponent } from './components/preview-cluster/preview-cluster.component'

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    CreateRouteComponent,
    PreviewCsvComponent,
    PreviewTeamComponent,
    NotFoundComponent,
    MyTeamComponent,
    RouteStatusComponent,
    ViewRouteComponent,
    RouteDetailsComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    RouteInfoComponent,
    NavigationHeaderComponent,
    MenuButtonComponent,
    ActionButtonComponent,
    ChipComponent,
    AppLayoutComponent,
    MyRoutesComponent,
    SnackBarComponent,
    AdminPageComponent,
    UpdateUsersComponent,
    SettingsComponent,
    UpdateOrganizationComponent,
    UpdateBranchComponent,
    GeocodeComponent,
    DashboardComponent,
    RouteTabComponent,
    ViewMapComponent,
    TooltipDirective,
    TooltipComponent,
    InputTableComponent,
    PreviewAddressesMapComponent,
    DemoInputComponent,
    DemoResultComponent,
    DemoStatsComponent,
    ClusterPageComponent,
    PreviewClusterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    // LayoutModule
    IconsModule,
    CustomFormsModule,
    OverlayModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: TOAST_CONFIG_TOKEN,
      useValue: { ...defaultToastConfig, ...config }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
