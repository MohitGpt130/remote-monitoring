import { DynamicLayoutComponent } from './shared/layouts/dynamic-layout/dynamic-layout.component';
import { SfwLayoutComponent } from './shared/layouts/sfw-layout/sfw-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sfw',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    data: { breadcrumb: 'auth' }
  },
  // {
  //   path: 'client',
  //   component: ClientComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'intas',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'admin',
  //       loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  //       data: { breadcrumb: 'Admin' , roles: []}
  //     },
  //     {
  //       path: 'me',
  //       loadChildren: () => import('./me/me.module').then(m => m.MeModule),
  //       data: { breadcrumb: 'Me' , roles: []}
  //     },
  //     {
  //       path: 'pdv',
  //       loadChildren: () => import('./pdv/pdv.module').then(m => m.PdvModule),
  //       data: { breadcrumb: 'TV Screen' , roles: []}
  //     },
  //     {
  //       path: 'intas',
  //       loadChildren: () => import('./_components/intas.module').then(m => m.IntasModule),
  //       data: { breadcrumb: 'Intas' , roles: []}
  //     },
  //   ],
  //   data: { breadcrumb: 'SmartFactoryWorx' , roles: []},
  //   canActivate: [AuthGuard],
  // },

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
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        data: { breadcrumb: 'Admin' , roles: []}
      },
      {
        path: 'intas',
        loadChildren: () => import('./_components/intas.module').then(m => m.IntasModule),
        data: { breadcrumb: 'Intas' , roles: []}
      },
    ],
    data: { breadcrumb: 'SmartFactoryWorx' , roles: []},
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class ClientRoutingModule { }


