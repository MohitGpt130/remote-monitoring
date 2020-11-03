import { DynamicLayoutComponent } from './_client/shared/layouts/dynamic-layout/dynamic-layout.component';
import { NotFoundComponent } from './_outlets/not-found/not-found.component';
// import { DynamicLayoutComponent } from './_layouts/dynamic-layout/dynamic-layout.component';
import { DashboardLayoutComponent } from './_layouts/dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './_outlets/auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sfw',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./_outlets/auth/auth.module').then(m => m.AuthModule),
    data: { breadcrumb: 'auth' }
  },
  {
    path: 'setup',
    loadChildren: () => import('./_outlets/setup/setup.module').then(m => m.SetupModule),
    data: { breadcrumb: 'Setup Config' , roles: []}
  },
  {
    path: 'new',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'events-analysis',
        pathMatch: 'full',
      },
      {
        path: 'admin',
        loadChildren: () => import('./_outlets/admin/admin.module').then(m => m.AdminModule),
        data: { breadcrumb: 'Admin' , roles: []}
      },
      {
        path: 'me',
        loadChildren: () => import('./_outlets/me/me.module').then(m => m.MeModule),
        data: { breadcrumb: 'Me' , roles: []}
      },
      {
        path: 'master',
        loadChildren: () => import('./_outlets/master/master.module').then(m => m.MasterModule),
        data: { breadcrumb: 'Master' , roles: []}
      },
      {
        path: 'schedule',
        loadChildren: () => import('./_outlets/schedule/schedule.module').then(m => m.ScheduleModule),
        data: { breadcrumb: 'Schedule' , roles: []}
      },
      {
        path: 'plant-activity',
        loadChildren: () => import('./_outlets/plant-activity/plant-activity.module').then(m => m.PlantActivityModule),
        data: { breadcrumb: 'Plant Analysis' , roles: []}
      },
      {
        path: 'events-analysis',
        loadChildren: () => import('./_outlets/events-analysis/events-analysis.module').then(m => m.EventsAnalysisModule),
        data: { breadcrumb: 'Events Analysis' , roles: []}
      },
      {
        path: 'setup',
        loadChildren: () => import('./_outlets/setup/setup.module').then(m => m.SetupModule),
        data: { breadcrumb: 'Setup Config' , roles: []}
      },
    ],
    data: { breadcrumb: 'Dashboard' , roles: []},
    canActivate: [AuthGuard],
  },

  {
    path: ':layout',
    component: DynamicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'intas',
        pathMatch: 'full',
      },
      {
        path: 'intas',
        loadChildren: () => import('./_client/_components/intas.module').then(m => m.IntasModule),
        data: { breadcrumb: 'Intas' , roles: []}
      },
    ],
    data: { breadcrumb: 'SmartFactoryWorx' , roles: []},
    canActivate: [AuthGuard],
  },
  {
    path: 'tv-screen',
    loadChildren: () => import('./_outlets/tv-screen/tv-screen.module').then(m => m.TvScreenModule),
    data: { breadcrumb: 'TV Screen' , roles: []}
  },
  {
    path: '404',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
