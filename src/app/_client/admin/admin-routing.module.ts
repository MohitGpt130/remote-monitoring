import { PrivilegesComponent } from './privileges/privileges.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './admin.guard';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: '',
        component: AdminComponent,
        data: { breadcrumb: 'Admin' , roles: []}
      },
      {
        path: 'users',
        component: UsersComponent,
        data: { breadcrumb: 'Users' , roles: []}
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: { breadcrumb: 'Roles' , roles: []}
      },
      {
        path: 'privileges',
        component: PrivilegesComponent,
        data: { breadcrumb: 'Privileges' , roles: []}
      },
      {
        path: 'menus',
        component: PrivilegesComponent,
        data: { breadcrumb: 'Privileges' , roles: []}
      },
    ],
    canActivate: [RoleGuard],
    data: { breadcrumb: 'Admin' , roles: ['admin']},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
