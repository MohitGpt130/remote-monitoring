import { ApiSettingsComponent } from './api-settings/api-settings.component';
import { SetupComponent } from './setup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SetupComponent,
    children: [
      {
        path: 'api-settings',
        component: ApiSettingsComponent,
        pathMatch: 'full',
      },
      {
        path: 'dashboard-settings',
        component: ApiSettingsComponent,
        pathMatch: 'full',
      },
      {
        path: 'layout-settings',
        component: ApiSettingsComponent,
        pathMatch: 'full',
      },
      {
        path: 'tv-settings',
        component: ApiSettingsComponent,
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
